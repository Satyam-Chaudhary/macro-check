# In app/schemas/log.py
from pydantic import BaseModel
from datetime import date

class LogBase(BaseModel):
    date: date
    meal_type: str
    description: str
    calories: float
    protein: float
    carbs: float
    fat: float

class LogCreate(LogBase):
    pass

class Log(LogBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True