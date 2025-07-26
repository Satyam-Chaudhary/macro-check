from sqlalchemy.orm import Session
from app.db import models
import uuid

def get_user_by_supabase_id(db: Session, supabase_user_id: uuid.UUID):
    return db.query(models.User).filter(models.User.supabase_user_id == supabase_user_id).first()

def create_user(db: Session, supabase_user_id: uuid.UUID, email: str):
    db_user = models.User(supabase_user_id=supabase_user_id, email=email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user