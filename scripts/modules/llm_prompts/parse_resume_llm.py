import requests
import json
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")

def call_mistral_resume_analyzer(resume_text, api_key):
    """
    Sends resume text to Mistral (via OpenRouter API) and returns structured JSON analysis.
    Handles both direct JSON and markdown-wrapped JSON responses.
    """

    prompt = f"""
You are a smart recruiter assistant AI.

Analyze the following resume text and extract the following information in valid JSON format:

- full_name (string)
- email (string)
- phone_number (string)
- total_experience_years (int)
- roles (list of {{title, company, years}})
- skills (dict: key=skill name, value={{"source": how skill was acquired, "years": if mentioned or estimated}})
- projects (list of {{name, tech_stack, description}})
- leadership_signals (bool)
- leadership_justification (string: sentence or phrase from the resume that indicates leadership, if any)
- candidate_fit_summary (1–2 sentence summary of best role for candidate)

Return only JSON. Do not explain or add any text outside the JSON block.

Resume:
\"\"\"
{resume_text}
\"\"\"
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "http://localhost",  # Replace with your frontend URL if needed
        "Content-Type": "application/json"
    }

    data = {
        "model": "mistralai/mistral-small-3.2-24b-instruct:free",
        "temperature": 0.0, 
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)

    if response.status_code == 200:
        try:
            raw = response.json()['choices'][0]['message']['content']
            # Clean markdown code block if present
            cleaned = raw.strip()
            if cleaned.startswith("```"):
                first_newline = cleaned.find('\n')
                if first_newline != -1:
                    cleaned = cleaned[first_newline + 1:]
                else:
                    cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            return json.loads(cleaned)
        except Exception as e:
            print("[ERROR] Failed to parse JSON:", e)
            print("Raw response:", raw)
            return None
    else:
        print("[ERROR]", response.status_code, response.text)
        return None


# # 👇 EXAMPLE USAGE 👇
# if __name__ == "__main__":
#     resume_text = """my resume text 
# """

#     result = call_mistral_resume_analyzer(resume_text, api_key)
    
#     if result:
#         print(json.dumps(result, indent=2))
