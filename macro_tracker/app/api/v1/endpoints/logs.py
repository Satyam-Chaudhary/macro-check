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

router = APIRouter()

@router.post("/", response_model=Log)
def create_log_entry( 
    *,
    db: Session = Depends(get_db),
    log_in: LogCreate,
    current_user: models.User = Depends(get_current_user)
):
    log = crud_log.create_user_log(db=db, log=log_in, user_id=current_user.id)
    end_date = log_in.date
    start_date = end_date - timedelta(days=6)
    cache_key = f"summary_v2:{current_user.id}:{start_date}:{end_date}"
    redis_client.delete(cache_key)

    daily_cache_key = f"daily_summary:{current_user.id}:{log_in.date}"
    redis_client.delete(daily_cache_key)
    
    print(f"--- CACHE INVALIDATED for key: {cache_key} ---")
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
    
    deleted_log = crud_log.delete_log(db=db, log_id=log_id)
    if not deleted_log:
        raise HTTPException(status_code=404, detail="Log not found.")


    cache_key = f"logs:{current_user.id}:{deleted_log.date}"
    redis_client.delete(cache_key)
    
    return {"detail": "Log deleted successfully"}