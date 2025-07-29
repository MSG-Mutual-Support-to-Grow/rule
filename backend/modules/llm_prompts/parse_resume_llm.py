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

    # Dynamically load API key from llm_config.json
    import os
    import json
    config_path = os.path.join(os.path.dirname(__file__), '../../llm_config.json')
    config_path = os.path.abspath(config_path)
    try:
        with open(config_path, 'r') as f:
            llm_config = json.load(f)
            api_key = llm_config.get('api_key')
            if not api_key:
                raise ValueError('API key not found in llm_config.json')
    except Exception as e:
        raise RuntimeError(f'Error loading llm_config.json: {e}')

    provider = llm_config.get('provider', 'openrouter')
    model = llm_config.get('model', 'mistralai/mistral-small-3.2-24b-instruct:free')
    base_url = llm_config.get('base_url')

    if provider == 'ollama':
        # Default Ollama base URL if not set
        if not base_url:
            base_url = 'http://localhost:11434'
        url = f"{base_url.rstrip('/')}/api/chat"
        headers = {"Content-Type": "application/json"}
        data = {
            "model": model,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            try:
                raw = response.json()['message']['content']
                cleaned = raw.strip()
                if cleaned.startswith("```"):
                    cleaned = cleaned.strip('`').strip()
                return cleaned
            except Exception as e:
                raise RuntimeError(f"Ollama response parsing error: {e}")
        else:
            raise RuntimeError(f"Ollama API error: {response.status_code} {response.text}")
    else:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "http://localhost",  # Replace with your frontend URL if needed
            "Content-Type": "application/json"
        }
        data = {
            "model": model,
            "temperature": 0.0,
            "messages": [
                {"role": "user", "content": prompt}
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
            raise RuntimeError(f"OpenRouter API error: {response.status_code} {response.text}")
