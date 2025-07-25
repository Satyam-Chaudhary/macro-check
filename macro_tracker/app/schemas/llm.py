from pydantic import BaseModel
from datetime import date as Date
from typing import Optional

class FoodParseRequest(BaseModel):
    description: str
    meal_type: str = "Unknown"
    date: Optional[Date] = None