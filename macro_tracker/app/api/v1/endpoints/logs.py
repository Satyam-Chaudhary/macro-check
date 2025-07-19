import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.db.session import get_db, redis_client
from app.schemas.log import Log, LogCreate
from app.crud import crud_log

from app.api.v1.endpoints.auth import get_current_user
from app.db import models

from app.llm import client as llm_client
from app.schemas.llm import FoodParseRequest

router = APIRouter()

#Helper function to clear relevant caches.
def invalidate_caches(user_id: int, log_date: date):
    end_date = log_date
    start_date = end_date - timedelta(days=6)
    weekly_cache_key = f"summary_v2:{user_id}:{start_date}:{end_date}"
    daily_cache_key = f"daily_summary:{user_id}:{log_date}"
    
    redis_client.delete(weekly_cache_key, daily_cache_key)
    print(f"--- CACHES INVALIDATED for {log_date} ---")

@router.post("/manual", response_model=Log)
def create_manual_log_entry(
    *,
    db: Session = Depends(get_db),
    log_in: LogCreate,
    current_user: models.User = Depends(get_current_user)
):
    log = crud_log.create_user_log(db=db, log=log_in, user_id=current_user.id)
    invalidate_caches(user_id=current_user.id, log_date=log_in.date)
    return log

@router.post("/llm", response_model=Log)
async def create_llm_log_entry(
    *,
    db: Session = Depends(get_db),
    request: FoodParseRequest,
    current_user: models.User = Depends(get_current_user)
):
    print("--- CALLING LLM FOR MACRO AND DESCRIPTION ENRICHMENT ---")
    parsed_data = await llm_client.get_macros_from_description(request.description)
    
    # Handle general failure from the client
    if not parsed_data:
        raise HTTPException(
            status_code=500,
            detail="Could not get a valid response from the AI model."
        )

    # Handle the specific "invalid food" error returned by the LLM
    if "error" in parsed_data:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid food description: '{request.description}' could not be processed."
        )

    log_in = LogCreate(
        date=date.today(),
        meal_type=request.meal_type,
        description=parsed_data.get("enriched_description"), 
        calories=parsed_data.get("calories"),
        protein=parsed_data.get("protein"),
        carbs=parsed_data.get("carbs"),
        fat=parsed_data.get("fat")
    )

    log = crud_log.create_user_log(db=db, log=log_in, user_id=current_user.id)
    invalidate_caches(user_id=current_user.id, log_date=log_in.date)
    return log



@router.get("/", response_model=List[Log])
def read_logs_for_day(
    target_date: date,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    #REDIS IMPLEMENTATION
    cache_key = f"logs:{current_user.id}:{target_date}" #unique cache key
    cached_logs = redis_client.get(cache_key) #try to get data from redis cache
    if cached_logs:
        print("--- CACHE HIT ---")
        # If found, parse the JSON string and return
        return json.loads(cached_logs)

    print("--- CACHE MISS ---")
    logs = crud_log.get_logs_by_user_and_date(db=db, user_id=current_user.id, target_date=target_date)
    if logs:
        # Convert list of Log objects to a JSON string
        json_data = json.dumps([log.model_dump() for log in [Log.model_validate(l) for l in logs]], default=str)
        redis_client.set(cache_key, json_data, ex=3600) # Cache for 1 hour (3600 seconds)

    return logs

@router.delete("/{log_id}")
def delete_log_entry(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Delete a specific food log entry by its ID and invalidate caches.
    """
    deleted_log = crud_log.delete_log(db=db, log_id=log_id)
    if not deleted_log:
        raise HTTPException(status_code=404, detail="Log not found.")
    
    # Invalidate caches for the date the log was on
    log_date = deleted_log.date
    end_date = log_date
    start_date = end_date - timedelta(days=6)
    weekly_cache_key = f"summary_v2:{current_user.id}:{start_date}:{end_date}"
    daily_cache_key = f"daily_summary:{current_user.id}:{log_date}"
    
    redis_client.delete(weekly_cache_key)
    redis_client.delete(daily_cache_key)
    
    print(f"--- CACHES INVALIDATED for {log_date} ---")
    
    return {"detail": "Log deleted successfully"}