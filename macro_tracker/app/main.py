from fastapi import FastAPI
from datetime import datetime


from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from app.core.limiter import main_limiter

from app.api.v1.endpoints import logs, goals, auth, analytics, llm

from app.core.config import settings


app = FastAPI(title="Macro Check API")

# print("---" * 10)
# print(f"INFO:     FastAPI is connecting to database: {settings.DATABASE_URL}")
# print("---" * 10)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "version": "1.1.0", # We'll use this version number to confirm the deploy
        "timestamp": datetime.utcnow().isoformat()
    }


# add limiter to app's state and register the exception handler
app.state.limiter = main_limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"]) ## moved to supabase
app.include_router(logs.router, prefix="/api/v1/logs", tags=["logs"])
app.include_router(goals.router, prefix="/api/v1/goals", tags=["goals"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(llm.router, prefix="/api/v1/llm", tags=["llm"])
#limiter on llm calls
app.include_router(llm.router, prefix="/api/v1/llm", tags=["llm"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Macro Tracker API"}