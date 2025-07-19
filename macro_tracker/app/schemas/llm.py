from pydantic import BaseModel

class FoodParseRequest(BaseModel):
    description: str
    meal_type: str = "Unknown"