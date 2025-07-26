import httpx
import uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.core.config import settings
from app.db.session import get_db
from app.db import models
from app.crud import crud_user

http_bearer_scheme = HTTPBearer()

async def get_supabase_jwks():
    """Fetches the JSON Web Key Set from Supabase."""
    async with httpx.AsyncClient() as client:
        try:
            jwks_url = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
            response = await client.get(jwks_url)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=500, detail=f"Could not fetch Supabase JWKS: {e}")

async def get_current_user(auth: HTTPAuthorizationCredentials = Depends(http_bearer_scheme), db: Session = Depends(get_db)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = auth.credentials

    try:
        jwks = await get_supabase_jwks()
        unverified_header = jwt.get_unverified_header(token)
        
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header.get("kid"):
                rsa_key = key
                break
        
        if not rsa_key:
            raise credentials_exception
            
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=[settings.ALGORITHM],
            audience="authenticated",
            issuer=f"{settings.SUPABASE_URL}/auth/v1"
        )
        
        supabase_user_id_str: str = payload.get("sub")
        user_email: str = payload.get("email")
        
        if supabase_user_id_str is None or user_email is None:
            raise credentials_exception
            
        supabase_user_id = uuid.UUID(supabase_user_id_str)

    except (JWTError, ValueError):
        raise credentials_exception
    
    user = crud_user.get_user_by_supabase_id(db, supabase_user_id=supabase_user_id)
    if user is None:
        user = crud_user.create_user(db, supabase_user_id=supabase_user_id, email=user_email)
        
    return user