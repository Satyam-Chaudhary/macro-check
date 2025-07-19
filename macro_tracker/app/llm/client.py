import json
from openai import AsyncOpenAI

from app.core.config import settings


client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
)

#system prompt for the LLM
SYSTEM_PROMPT = """
You are a helpful nutrition assistant. Your task is to analyze a user's
description of a meal and return its estimated nutritional values.
Respond ONLY with a valid JSON object containing these keys:
"calories", "protein", "carbs", "fat".

Example:
User: "For breakfast I had 2 scrambled eggs with a slice of toast and butter"
Assistant: {"calories": 350, "protein": 15, "carbs": 25, "fat": 20}
"""

async def get_macros_from_description(description: str) -> dict | None:
    """
    Sends a food description to the Kimi model via OpenRouter and gets
    estimated nutritional information using the OpenAI library.
    """
    try:
        completion = await client.chat.completions.create(
            model=settings.OPENROUTER_MODEL_NAME,
            response_format={"type": "json_object"}, # Force JSON output
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": description}
            ]
        )
        
        
        json_content_string = completion.choices[0].message.content
        macros = json.loads(json_content_string)
        
        # Basic validation
        if all(key in macros for key in ["calories", "protein", "carbs", "fat"]):
            return macros
        else:
            print("Error: LLM response was missing required keys.")
            return None

    except Exception as e:
        print(f"An error occurred while communicating with the LLM: {e}")
        return None