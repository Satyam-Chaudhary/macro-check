# from datetime import timedelta

# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
# from sqlalchemy.orm import Session

# from jose import jwt , JWTError

# from app.db.session import get_db
# from app.schemas.user import User, UserCreate
# from app.schemas.token import Token, TokenData
# from app.crud import crud_user
# from app.core import security
# from app.core.config import settings

# router = APIRouter()

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login") # to tell fastapi where the login endpoint is

# async def get_current_user(
#     token: str = Depends(oauth2_scheme), 
#     db: Session = Depends(get_db)
# ):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(
#             token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
#         )
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         token_data = TokenData(username=username)
#     except JWTError:
#         raise credentials_exception
    
#     user = crud_user.get_user_by_email(db, email=token_data.username)
#     if user is None:
#         raise credentials_exception
#     return user


# @router.post("/signup", response_model=User)
# def signup(
#     *,
#     db: Session = Depends(get_db),
#     user_in: UserCreate
# ):
#     user = crud_user.get_user_by_email(db, email=user_in.email)
#     if user:
#         raise HTTPException(
#             status_code=400,
#             detail="The user with this email already exists in the system.",
#         )
#     user = crud_user.create_user(db=db, user=user_in)
#     return user


# @router.post("/login", response_model=Token)
# def login(
#     db: Session = Depends(get_db),
#     form_data: OAuth2PasswordRequestForm = Depends()
# ):
#     #OAuth2 compatible token login, get an access token for future requests.
#     user = crud_user.get_user_by_email(db, email=form_data.username)
#     if not user or not security.verify_password(form_data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = security.create_access_token(
#         data={"sub": user.email}, expires_delta=access_token_expires
#     )
    
#     return {"access_token": access_token, "token_type": "bearer"}