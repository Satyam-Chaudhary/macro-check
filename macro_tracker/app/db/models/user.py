from sqlalchemy import Column, Integer, String, UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    supabase_user_id = Column(UUID(as_uuid=True), unique=True, index=True, nullable=False)
    
    goals = relationship("Goal", back_populates="owner")
    logs = relationship("FoodLog", back_populates="owner")