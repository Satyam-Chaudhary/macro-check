import pytest
from httpx import AsyncClient
from datetime import date

# Mark all tests in this file as async
pytestmark = pytest.mark.asyncio

async def test_create_and_read_log(test_client: AsyncClient):
    """
    Tests creating a log and reading it back.
    The `test_client` fixture handles all setup, including creating a
    database, tables, and a mock user.
    """
    # Define log data
    log_data = {
        "date": str(date.today()),
        "meal_type": "Breakfast",
        "description": "Final Test Log",
        "calories": 150, "protein": 15, "carbs": 15, "fat": 3
    }

    # Create the log
    create_response = await test_client.post("/api/v1/logs/manual", json=log_data)
    assert create_response.status_code == 200
    created_log = create_response.json()
    assert created_log["description"] == "Final Test Log"
    assert created_log["user_id"] == 1 # Asserts it's linked to our mock user

    # Read the logs back
    read_response = await test_client.get(f"/api/v1/logs/?target_date={date.today()}")
    assert read_response.status_code == 200
    logs_list = read_response.json()
    assert len(logs_list) == 1
    assert logs_list[0]["description"] == "Final Test Log"