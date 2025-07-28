from openai import OpenAI
from app.core.config import settings
from typing import Optional

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_task_summary(task_title: str, task_description: str, custom_prompt: Optional[str] = None) -> str:
    prompt = custom_prompt or f"Please provide a brief AI summary for this task:\nTitle: {task_title}\nDescription: {task_description or 'No description provided'}"
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes tasks concisely."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error generating summary: {str(e)}"