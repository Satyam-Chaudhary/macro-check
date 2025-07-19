from pydantic import BaseModel

class FoodParseRequest(BaseModel):
    description: str