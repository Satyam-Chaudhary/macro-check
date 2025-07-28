import redis
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
import os

# --- ADD THIS DEBUG BLOCK ---
print("---" * 20)
print(f"DATABASE CONNECTION: The engine is being created with this URL:")
print(f"URL: {settings.DATABASE_URL}")
print("---" * 20)
# --------------------------


engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# for localhosr
# redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

#for production -- inside docker container
# Default to 'localhost' for local development, but use 'redis' for Docker.
REDIS_HOST = os.environ.get("REDISHOST", "localhost")
REDIS_PORT = int(os.environ.get("REDISPORT", 6379))
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD", None)

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    password=REDIS_PASSWORD,
    db=0,
    decode_responses=True
)

