import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta
from collections import defaultdict

from app.db.session import get_db, redis_client
from app.db import models
from app.schemas.analytics import WeeklySummary, DailySummary
from app.crud import crud_log, crud_goal  

# from app.api.v1.endpoints.auth import get_current_user
from app.core.dependencies import get_current_user

from app.schemas.log import Log
from app.llm import client as llm_client


router = APIRouter()

@router.get("/weekly-summary", response_model=WeeklySummary)
async def get_weekly_summary(
    end_date_str: date = Depends(lambda: date.today()),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    end_date = end_date_str
    start_date = end_date - timedelta(days=6)
    
    cache_key = f"weekly_summary:{current_user.id}"
    cached_summary = redis_client.get(cache_key)

    if cached_summary:
        print("--- CACHE HIT - SUMMARY ---")
        return json.loads(cached_summary)
    
    print("--- CACHE MISS - SUMMARY ---")
    
    # Fetch data for the week
    logs = crud_log.get_logs_by_user_in_date_range(db, user_id=current_user.id, start_date=start_date, end_date=end_date)
    goals = crud_goal.get_goals_by_user_in_date_range(db, user_id=current_user.id, start_date=start_date, end_date=end_date)
    
    # --- Basic Analytics ---
    total_logs = len(logs)
    if total_logs == 0:
        # If no logs, create a default summary object with a simple message
        summary = WeeklySummary(
            start_date=start_date, end_date=end_date, total_logs=0, total_calories=0,
            avg_daily_calories=0, avg_daily_protein=0, avg_daily_carbs=0, avg_daily_fat=0,
            days_calorie_goal_met=0, avg_calorie_surplus_deficit=0, avg_protein_surplus_deficit=0,
            natural_language_summary="No food was logged this week. Log some meals to get a summary!"
        )
        
        redis_client.set(cache_key, summary.model_dump_json(), ex=3600)
        return summary
        
    total_calories = sum(log.calories for log in logs)
    total_protein = sum(log.protein for log in logs)
    num_days_with_logs = len(set(log.date for log in logs))
    
    goals_dict = {goal.date: goal for goal in goals}
    daily_totals = defaultdict(lambda: {"calories": 0, "protein": 0})
    for log in logs:
        daily_totals[log.date]["calories"] += log.calories
        daily_totals[log.date]["protein"] += log.protein

    calorie_diffs = []
    protein_diffs = []
    days_calorie_goal_met = 0
    
    for day_date, totals in daily_totals.items():
        if day_date in goals_dict:
            goal = goals_dict[day_date]
            calorie_diffs.append(totals["calories"] - goal.calories)
            protein_diffs.append(totals["protein"] - goal.protein)
            # goal met if within a tolerance range, e.g., +/- 100 calories
            if abs(totals["calories"] - goal.calories) <= 100:
                days_calorie_goal_met += 1

    
    numerical_summary = WeeklySummary(
        start_date=start_date,
        end_date=end_date,
        total_logs=total_logs,
        total_calories=total_calories,
        avg_daily_calories=total_calories / num_days_with_logs if num_days_with_logs > 0 else 0,
        avg_daily_protein=total_protein / num_days_with_logs if num_days_with_logs > 0 else 0,
        avg_daily_carbs=sum(l.carbs for l in logs) / num_days_with_logs if num_days_with_logs > 0 else 0,
        avg_daily_fat=sum(l.fat for l in logs) / num_days_with_logs if num_days_with_logs > 0 else 0,
        days_calorie_goal_met=days_calorie_goal_met,
        avg_calorie_surplus_deficit=sum(calorie_diffs) / len(calorie_diffs) if calorie_diffs else 0,
        avg_protein_surplus_deficit=sum(protein_diffs) / len(protein_diffs) if protein_diffs else 0,
        natural_language_summary="" # Placeholder
    )

    print("--- CALLING LLM FOR WEEKLY SUMMARY ---")
    
    llm_summary_text = await llm_client.get_weekly_summary_from_llm(numerical_summary.model_dump())
    
    
    final_summary = numerical_summary.model_copy(update={"natural_language_summary": llm_summary_text})

    # Cache the final, complete summary
    redis_client.set(cache_key, final_summary.model_dump_json(), ex=3600)
    
    return final_summary

@router.get("/daily-summary", response_model=DailySummary)
def get_daily_summary(
    target_date: date,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    
    cache_key = f"daily_summary:{current_user.id}:{target_date}"
    cached_summary = redis_client.get(cache_key)
    if cached_summary:
        print("--- CACHE HIT - DAILY SUMMARY ---")
        return json.loads(cached_summary)
        
    print("--- CACHE MISS - DAILY SUMMARY ---")

    goal = crud_goal.get_goal_by_user_and_date(db, user_id=current_user.id, target_date=target_date)
    logs = crud_log.get_logs_by_user_and_date(db, user_id=current_user.id, target_date=target_date)

    # Set goal values, defaulting to 0 if not set
    goal_calories = goal.calories if goal else 0
    goal_protein = goal.protein if goal else 0
    goal_carbs = goal.carbs if goal else 0
    goal_fat = goal.fat if goal else 0

    # Calculate actual totals from logs
    actual_calories = sum(log.calories for log in logs)
    actual_protein = sum(log.protein for log in logs)
    actual_carbs = sum(log.carbs for log in logs)
    actual_fat = sum(log.fat for log in logs)

    summary = DailySummary(
        date=target_date,
        goal_calories=goal_calories,
        goal_protein=goal_protein,
        goal_carbs=goal_carbs,
        goal_fat=goal_fat,
        actual_calories=actual_calories,
        actual_protein=actual_protein,
        actual_carbs=actual_carbs,
        actual_fat=actual_fat,
        remaining_calories=goal_calories - actual_calories,
        remaining_protein=goal_protein - actual_protein,
        remaining_carbs=goal_carbs - actual_carbs,
        remaining_fat=goal_fat - actual_fat,
        logs=[Log.model_validate(log) for log in logs]
    )
    
    redis_client.set(cache_key, summary.model_dump_json(), ex=3600) # Cache for 1 hour

    return summary