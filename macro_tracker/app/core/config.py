from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Build an absolute path to the project's root directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
# Construct the full path to the .env file
ENV_PATH = BASE_DIR / ".env"
# Manually load the variables from the .env file into the environment
load_dotenv(dotenv_path=ENV_PATH)

class Settings(BaseSettings):
    #SUPABASE CREDENTIALS
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str
    # SUPABASE_JWT_SECRET: str

    #SUPABASE DB moved from sqlite
    DATABASE_URL: str
    
    # JWT Settings
    SECRET_KEY: str
    ALGORITHM: str = "ES256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    OPENROUTER_API_KEY: str
    OPENROUTER_MODEL_NAME: str

settings = Settings()