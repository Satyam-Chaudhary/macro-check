from sqlalchemy.orm import Session
from datetime import date

from app.db import models
from app.schemas import log as log_schema

def get_logs_by_user_and_date(db: Session, user_id: str, target_date: date):
    return db.query(models.FoodLog).filter(models.FoodLog.user_id == user_id, models.FoodLog.date == target_date).all()

def create_user_log(db: Session, log: log_schema.LogCreate, user_id: str):
    db_log = models.FoodLog(**log.model_dump(), user_id=user_id)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def delete_log(db: Session, log_id: int) -> models.FoodLog | None:
    db_log = db.query(models.FoodLog).filter(models.FoodLog.id == log_id).first()
    if db_log:
        db.delete(db_log)
        db.commit()
    return db_log

def get_logs_by_user_in_date_range(db: Session, user_id: int, start_date: date, end_date: date):
    return db.query(models.FoodLog).filter(
        models.FoodLog.user_id == user_id,
        models.FoodLog.date >= start_date,
        models.FoodLog.date <= end_date
    ).all()