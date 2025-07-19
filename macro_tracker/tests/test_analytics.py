import requests
import json
from datetime import date, timedelta

# --- Configuration ---
BASE_URL = "http://127.0.0.1:8000/api/v1"
TEST_USER = {
    "email": "test@example.com",
    "password": "a_strong_password"
}

def run_test():
    """Signs up, logs in, posts data, and fetches the summary."""
    
    session = requests.Session()
    
    # 1. Sign up a new user (or ignore if user already exists)
    print("--- Step 1: Attempting to sign up user ---")
    try:
        signup_response = session.post(f"{BASE_URL}/auth/signup", json=TEST_USER)
        if signup_response.status_code == 200:
            print("✅ User signed up successfully.")
        elif signup_response.status_code == 400:
            print("ℹ️ User already exists. Proceeding to login.")
        else:
            print(f"❌ Signup failed: {signup_response.status_code} {signup_response.text}")
            return
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection Error: Could not connect to the API at {BASE_URL}. Is the server running?")
        return

    # 2. Log in to get an access token
    print("\n--- Step 2: Logging in ---")
    login_payload = {
        "username": TEST_USER["email"],
        "password": TEST_USER["password"]
    }
    login_response = session.post(f"{BASE_URL}/auth/login", data=login_payload)
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code} {login_response.text}")
        return
        
    access_token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    print("✅ Logged in successfully. Token obtained.")

    # 3. Set goals for today and yesterday
    print("\n--- Step 3: Setting goals for the last 2 days ---")
    today = date.today()
    yesterday = today - timedelta(days=1)
    
    goal_payload = {
        "date": str(yesterday), "calories": 2200, "protein": 180, "carbs": 200, "fat": 70
    }
    response = session.post(f"{BASE_URL}/goals/", headers=headers, json=goal_payload)
    print(f"Goal for {yesterday}: {'✅' if response.status_code == 200 else '❌'} (Status: {response.status_code})")
    
    goal_payload["date"] = str(today)
    response = session.post(f"{BASE_URL}/goals/", headers=headers, json=goal_payload)
    print(f"Goal for {today}: {'✅' if response.status_code == 200 else 'ℹ️ May already exist'} (Status: {response.status_code})")


    # 4. Add food logs for today and yesterday
    print("\n--- Step 4: Adding food logs ---")
    logs_to_add = [
        # Yesterday's logs (over on calories)
        {"date": str(yesterday), "meal_type": "Breakfast", "description": "Oats & Berries", "calories": 400, "protein": 20, "carbs": 70, "fat": 5},
        {"date": str(yesterday), "meal_type": "Lunch", "description": "Chicken Salad", "calories": 600, "protein": 50, "carbs": 10, "fat": 40},
        {"date": str(yesterday), "meal_type": "Dinner", "description": "Steak and Potatoes", "calories": 1300, "protein": 70, "carbs": 80, "fat": 60},
        # Today's logs (under on calories)
        {"date": str(today), "meal_type": "Breakfast", "description": "Protein Shake", "calories": 300, "protein": 40, "carbs": 20, "fat": 8},
        {"date": str(today), "meal_type": "Lunch", "description": "Grilled Fish and Veggies", "calories": 550, "protein": 45, "carbs": 30, "fat": 25},
    ]

    for log in logs_to_add:
        response = session.post(f"{BASE_URL}/logs/", headers=headers, json=log)
        print(f"Log '{log['description']}': {'✅' if response.status_code == 200 else '❌'} (Status: {response.status_code})")

    # 5. Fetch the weekly summary
    print("\n--- Step 5: Fetching weekly summary ---")
    summary_response = session.get(f"{BASE_URL}/analytics/weekly-summary", headers=headers)
    if summary_response.status_code == 200:
        print("✅ Weekly summary fetched successfully!")
        # Pretty print the JSON response
        summary_data = summary_response.json()
        print(json.dumps(summary_data, indent=2))
    else:
        print(f"❌ Failed to fetch summary: {summary_response.status_code} {summary_response.text}")


if __name__ == "__main__":
    run_test()