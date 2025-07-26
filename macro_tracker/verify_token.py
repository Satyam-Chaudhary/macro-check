import os
from dotenv import load_dotenv
from supabase import create_client
from jose import jwt, JWTError

# --- SETUP ---
# Load environment variables from .env file
load_dotenv()

# Get credentials from environment
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET")
ALGORITHM = os.environ.get("ALGORITHM", "HS512") # Default to HS512

# User credentials from your Supabase auth table
TEST_USER_EMAIL = "test@example.com"
TEST_USER_PASSWORD = "test"

# --- SCRIPT ---
print("--- Starting Token Verification Script ---")

# 1. Initialize Supabase client and get a token
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    auth_response = supabase.auth.sign_in_with_password({
        "email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD
    })
    token = auth_response.session.access_token
    print("✅ Step 1: Successfully received a token from Supabase.")
except Exception as e:
    print(f"❌ Step 1 FAILED: Could not get token from Supabase. Error: {e}")
    exit()

# 2. Try to decode the token using the provided secret
print("\n--- Step 2: Attempting to decode the token locally ---")
print(f"Using Algorithm: {ALGORITHM}")
try:
    payload = jwt.decode(
        token, SUPABASE_JWT_SECRET, algorithms=[ALGORITHM]
    )
    print("✅ SUCCESS: Token decoded successfully!")
    print("\nDecoded Payload:")
    print(payload)
except JWTError as e:
    print(f"❌ FAILURE: The token could not be decoded.")
    print(f"This definitively means the SUPABASE_JWT_SECRET in your .env file is incorrect.")
    print(f"Error details: {e}")
except Exception as e:
    print(f"An unexpected error occurred during decoding: {e}")