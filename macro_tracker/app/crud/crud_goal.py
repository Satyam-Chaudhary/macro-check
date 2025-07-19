from sqlalchemy.orm import Session
from datetime import date

from app.db import models
from app.schemas import goal as goal_schema

def get_goal_by_user_and_date(db: Session, user_id: str, target_date: date):
    return db.query(models.Goal).filter(models.Goal.user_id == user_id, models.Goal.date == target_date).first()

def create_user_goal(db: Session, goal: goal_schema.GoalCreate, user_id: str):
    db_goal = models.Goal(**goal.model_dump(), user_id=user_id)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

def get_goals_by_user_in_date_range(db: Session, user_id: int, start_date: date, end_date: date):
    return db.query(models.Goal).filter(
        models.Goal.user_id == user_id,
        models.Goal.date >= start_date,
        models.Goal.date <= end_date
    ).all()