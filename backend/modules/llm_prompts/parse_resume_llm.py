import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")

def call_mistral_resume_analyzer(resume_text,job_description,api_key):
    # Example job description for filtering
    # job_description = job_description

    prompt = f"""
You are a smart recruiter assistant AI helping companies filter resumes for job eligibility.

Job Description:
\"\"\"
{job_description}
\"\"\"

Analyze the following resume text and extract the candidate's details in valid JSON format with these fields:

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

Based on the Job Description above, evaluate the candidate's eligibility for the role and add these fields:

+ - fit_score (integer from 1 to 10): 10 means highly suitable, 1 means not suitable at all
- fit_score_reason (string): A short justification explaining why this score was given


Also include:
- fit_score_reason (string): A short justification explaining why this score was given

Return only valid JSON with the above fields. Do not include any text outside the JSON block.

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
            print("[WARNING] Mistral returned invalid JSON. Falling back.")
            return {"fit_score": 1, "fit_score_reason": "Could not parse response"}
            
        
    else:
        print("[ERROR]", response.status_code, response.text)
        return None
