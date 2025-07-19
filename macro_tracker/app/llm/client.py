import json
from openai import AsyncOpenAI

from app.core.config import settings


client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
)

#system prompt for the LLM
SYSTEM_PROMPT = """
You are a helpful nutrition assistant. Your task is to analyze a user's description of a meal.

First, determine if the user's input is a plausible description of food.
- If the input is nonsensical, random characters, or not food-related (e.g., "kjnk", "asdfg", "a car"), respond ONLY with a JSON object: {"error": "Invalid food description."}
- If the input is a plausible food description, respond ONLY with a valid JSON object containing these keys: "calories", "protein", "carbs", "fat", "enriched_description".

Example 1 (Valid food):
User: "2 eggs n toast"
Assistant: {
    "calories": 350,
    "protein": 15,
    "carbs": 25,
    "fat": 20,
    "enriched_description": "2 Scrambled Eggs with 1 Slice of Whole Wheat Toast"
}

Example 2 (Invalid food):
User: "kjnk"
Assistant: {"error": "Invalid food description."}
"""

async def get_macros_from_description(description: str) -> dict | None:
    """
    Sends a food description to the Kimi model via OpenRouter and gets
    estimated nutritional information using the OpenAI library.
    """
    try:
        completion = await client.chat.completions.create(
            model=settings.OPENROUTER_MODEL_NAME,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": description}
            ]
        )
        
        json_content_string = completion.choices[0].message.content
        parsed_data = json.loads(json_content_string)
        
        # bad desc
        if "error" in parsed_data:
            print(f"LLM rejected input: {parsed_data['error']}")
            return parsed_data 

        # Proceed with normal validation if no error
        required_keys = ["calories", "protein", "carbs", "fat", "enriched_description"]
        if all(key in parsed_data for key in required_keys):
            return parsed_data
        else:
            print("Error: LLM response was missing required keys.")
            return None

    except Exception as e:
        print(f"An error occurred while communicating with the LLM: {e}")
        return None