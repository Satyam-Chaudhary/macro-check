from fastapi import FastAPI

from app.api.v1.endpoints import logs, goals, auth, analytics, llm

from app.core.config import settings

app = FastAPI(title="Macro Check API")

# print("---" * 10)
# print(f"INFO:     FastAPI is connecting to database: {settings.DATABASE_URL}")
# print("---" * 10)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(logs.router, prefix="/api/v1/logs", tags=["logs"])
app.include_router(goals.router, prefix="/api/v1/goals", tags=["goals"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(llm.router, prefix="/api/v1/llm", tags=["llm"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Macro Tracker API"}