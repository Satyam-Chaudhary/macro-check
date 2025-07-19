from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db import models
from app.schemas.llm import FoodParseRequest
from app.llm import client as llm_client
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/parse-food")
async def parse_food_description(
    request: FoodParseRequest,
    current_user: models.User = Depends(get_current_user)
):
    macros = await llm_client.get_macros_from_description(description=request.description)
    
    if not macros:
        raise HTTPException(
            status_code=500,
            detail="Could not get a valid nutritional estimate from the AI model."
        )
        
    return macros