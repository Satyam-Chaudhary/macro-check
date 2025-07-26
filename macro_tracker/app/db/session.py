import redis
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

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

redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
