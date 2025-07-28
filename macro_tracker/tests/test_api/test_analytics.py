import pytest
from httpx import AsyncClient
from datetime import date

# Mark all tests in this file as async
pytestmark = pytest.mark.asyncio

async def test_daily_summary_analytics(test_client: AsyncClient):
    """
    Tests the daily summary analytics endpoint.
    It first creates a goal and a log, then verifies the calculations.
    """
    target_date = date.today()
    
    # 1. Create a goal for today
    goal_data = {
        "date": str(target_date),
        "calories": 2000, "protein": 150, "carbs": 200, "fat": 70
    }
    await test_client.post("/api/v1/goals/", json=goal_data)

    # 2. Create a log for today
    log_data = {
        "date": str(target_date), "meal_type": "Lunch",
        "description": "Analytics Test Log", "calories": 500,
        "protein": 40, "carbs": 50, "fat": 15
    }
    await test_client.post("/api/v1/logs/manual", json=log_data)

    # 3. Fetch the daily summary for today
    response = await test_client.get(f"/api/v1/analytics/daily-summary?target_date={target_date}")
    
    # 4. Assert that the request was successful and the calculations are correct
    assert response.status_code == 200
    summary = response.json()
    
    assert summary["date"] == str(target_date)
    assert summary["goal_calories"] == 2000
    assert summary["actual_calories"] == 500
    assert summary["remaining_calories"] == 1500 # 2000 - 500
    
    assert summary["goal_protein"] == 150
    assert summary["actual_protein"] == 40
    assert summary["remaining_protein"] == 110 # 150 - 40
    
    # Verify that the log we created is included in the summary
    assert len(summary["logs"]) == 1
    assert summary["logs"][0]["description"] == "Analytics Test Log"