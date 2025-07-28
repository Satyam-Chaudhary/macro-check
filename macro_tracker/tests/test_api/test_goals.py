import pytest
from httpx import AsyncClient
from datetime import date

# Mark all tests in this file as async
pytestmark = pytest.mark.asyncio

async def test_create_and_read_goal(test_client: AsyncClient):
    """
    Tests the full flow of creating a goal and then reading it back.
    The `test_client` fixture from conftest.py handles all setup.
    """
    # 1. Define the goal data we want to create
    target_date = date.today()
    goal_data = {
        "date": str(target_date),
        "calories": 2500,
        "protein": 180,
        "carbs": 250,
        "fat": 80
    }

    # 2. Make the API call to create the goal
    create_response = await test_client.post("/api/v1/goals/", json=goal_data)
    
    # 3. Assert that the creation was successful
    assert create_response.status_code == 200
    created_goal = create_response.json()
    assert created_goal["calories"] == 2500
    assert created_goal["user_id"] == 1 # Asserts it's linked to our mock user

    # 4. Make the API call to read the goal back for the same day
    read_response = await test_client.get(f"/api/v1/goals/?target_date={target_date}")
    
    # 5. Assert that the read was successful and contains our new goal
    assert read_response.status_code == 200
    read_goal = read_response.json()
    assert read_goal["calories"] == 2500
    assert read_goal["protein"] == 180