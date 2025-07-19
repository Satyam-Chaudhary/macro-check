from datetime import date
from sqlalchemy.orm import Session

from app.db import models
from app.schemas.user import UserCreate
from app.core.security import hash_password

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_pass = hash_password(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_pass)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

