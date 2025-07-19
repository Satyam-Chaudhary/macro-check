from pydantic import BaseModel
from datetime import date

class GoalBase(BaseModel):
    date: date
    calories: float
    protein: float
    carbs: float
    fat: float

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True