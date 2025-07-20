from pydantic import BaseModel
from datetime import date
from typing import List
from .log import Log 

class WeeklySummary(BaseModel):
    start_date: date
    end_date: date
    total_logs: int
    total_calories: float
    avg_daily_calories: float
    avg_daily_protein: float
    avg_daily_carbs: float
    avg_daily_fat: float

    days_calorie_goal_met: int
    avg_calorie_surplus_deficit: float
    avg_protein_surplus_deficit: float

    natural_language_summary: str

class DailySummary(BaseModel):
    date: date
    

    goal_calories: float
    goal_protein: float
    goal_carbs: float
    goal_fat: float
    

    actual_calories: float
    actual_protein: float
    actual_carbs: float
    actual_fat: float
    

    remaining_calories: float
    remaining_protein: float
    remaining_carbs: float
    remaining_fat: float

    logs: List[Log]
