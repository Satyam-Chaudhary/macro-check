import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.db.session import get_db, redis_client
from app.schemas.goal import Goal, GoalCreate
from app.crud import crud_goal

from app.api.v1.endpoints.auth import get_current_user

from app.db import models

router = APIRouter()

@router.post("/", response_model=Goal)
def create_goal(
    *,
    db: Session = Depends(get_db),
    goal_in: GoalCreate,
    current_user: models.User = Depends(get_current_user) #dependency
):
    existing_goal = crud_goal.get_goal_by_user_and_date(db, user_id= current_user.id, target_date=goal_in.date)
    if existing_goal:
        raise HTTPException(status_code=400, detail="Goal for this date already exists.")
    
    goal = crud_goal.create_user_goal(db=db, goal=goal_in, user_id= current_user.id)
    #invalidate cache when a new goal is created everytime
    cache_key = f"goal:{current_user.id}:{goal_in.date}"
    redis_client.delete(cache_key)
    return goal


@router.get("/", response_model=Goal)
def read_goal_for_day(
    target_date: date,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    cache_key = f"goal:{current_user.id}:{target_date}"
    cached_goal = redis_client.get(cache_key)
    if cached_goal:
        print("--- CACHE HIT - GOAL ---")
        return json.loads(cached_goal)

    print("--- CACHE MISS - GOAL ---")

    goal = crud_goal.get_goal_by_user_and_date(db=db, user_id= current_user.id, target_date=target_date)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found for this date.")
    redis_client.set(cache_key, Goal.model_validate(goal).model_dump_json(), ex=3600)
    return goal