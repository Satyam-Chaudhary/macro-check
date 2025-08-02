import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from app.core.limiter import main_limiter #limiter from app.main.py for rate limiting
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.db.session import get_db, redis_client
from app.schemas.log import Log, LogCreate
from app.crud import crud_log

# from app.api.v1.endpoints.auth import get_current_user
from app.core.dependencies import get_current_user
from app.db import models

from app.llm import client as llm_client
from app.schemas.llm import FoodParseRequest

router = APIRouter()

#Helper function to clear relevant caches.
# In app/api/v1/endpoints/logs.py

def invalidate_caches(user_id: int, log_date: date):
    """
    Helper function to clear all relevant caches after a data change.
    """
    print(f"--- INVALIDATING CACHES for user {user_id} on date {log_date} ---")
    
    # 1. Invalidate the specific daily caches
    logs_cache_key = f"logs:{user_id}:{log_date}"
    daily_cache_key = f"daily_summary:{user_id}:{log_date}"
    redis_client.delete(logs_cache_key, daily_cache_key)
    print(f"  - Deleted daily keys for {log_date}")

    # 2. Invalidate ALL weekly summaries for the user
    #    This is more robust as it doesn't need to guess the exact date range.
    weekly_summary_pattern = f"summary_v3:{user_id}:*"
    deleted_count = 0
    for key in redis_client.scan_iter(weekly_summary_pattern):
        redis_client.delete(key)
        deleted_count += 1
    
    if deleted_count > 0:
        print(f"  - Deleted {deleted_count} weekly summary key(s) matching '{weekly_summary_pattern}'")

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
@main_limiter.limit("5/minute") 
async def create_llm_log_entry(
    *,
    request: Request,
    db: Session = Depends(get_db),
    log_request: FoodParseRequest,
    current_user: models.User = Depends(get_current_user)
):
    print("--- CALLING LLM FOR MACRO AND DESCRIPTION ENRICHMENT ---")
    parsed_data = await llm_client.get_macros_from_description(log_request.description)
    
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
            detail=f"Invalid food description: '{log_request.description}' could not be processed."
        )
    
    log_date = log_request.date if log_request.date is not None else date.today()

    log_in = LogCreate(
        date=log_date,
        meal_type=log_request.meal_type,
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
    
    # Use the helper function to ensure ALL caches are cleared
    invalidate_caches(user_id=current_user.id, log_date=deleted_log.date)
    
    return {"detail": "Log deleted successfully"}