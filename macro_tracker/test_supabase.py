import requests
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pathlib import Path

# Load from your .env file
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"
# Manually load the variables from the .env file into the environment
load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8000/api/v1")

# Credentials for the user you created in the Supabase dashboard
TEST_USER_EMAIL = "test@example.com"
TEST_USER_PASSWORD = "test"

def run_test():
    # 1. Authenticate with Supabase to get a token
    print("--- Authenticating with Supabase ---")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD
        })
        token = auth_response.session.access_token
        print("✅ Successfully authenticated with Supabase.")
        print("\n--- COPY YOUR TOKEN BELOW ---")
        print(token)
    except Exception as e:
        print(f"❌ Supabase login failed: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Use the token to access a secure endpoint
    print("\n--- Testing a secure endpoint (/logs/) ---")
    target_date = "2025-07-26"
    response = requests.get(
        f"{API_BASE_URL}/logs/?target_date={target_date}",
        headers=headers
    )

    if response.status_code == 200:
        print("✅ Successfully accessed secure endpoint.")
        print("Response:", response.json())
    else:
        print(f"❌ Failed to access secure endpoint: {response.status_code}")
        print("Response:", response.text)

if __name__ == "__main__":
    run_test()