import json
from openai import AsyncOpenAI

from app.core.config import settings


client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
)

from app.llm.prompts import SYSTEM_PROMPT, SUMMARY_SYSTEM_PROMPT

#system prompt for the LLM
async def get_macros_from_description(description: str) -> dict | None:
    try:
        completion = await client.chat.completions.create(
            model=settings.OPENROUTER_MODEL_NAME,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": description}
            ],
            temperature=0.2
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
        return None\
        


async def get_weekly_summary_from_llm(summary_data: dict) -> str:
    try:
        user_content = json.dumps(summary_data, default=str)
        
        completion = await client.chat.completions.create(
            model=settings.OPENROUTER_MODEL_NAME,
            messages=[
                {"role": "system", "content": SUMMARY_SYSTEM_PROMPT},
                {"role": "user", "content": user_content}
            ],
            temperature=0.7, # this will add some creativity
        )
        
        return completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"An error occurred while generating summary: {e}")
        return "Could not generate a summary at this time."
