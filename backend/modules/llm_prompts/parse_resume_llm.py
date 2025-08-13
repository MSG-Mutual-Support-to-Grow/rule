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
You are an expert AI assistant for technical recruitment. Your task is to judge a candidate's resume **only in relation to the Job Description (JD)**. The JD is the SINGLE SOURCE OF TRUTH. Do not reward unrelated experience. Be strict, practical, and industry-aware (no keyword gaming).

Return **ONLY a valid JSON object** that conforms EXACTLY to the structure shown below—no extra keys, no markdown, no comments, no code fences.

------------
JOB DESCRIPTION (FOUNDATION — canonical source of truth):
{job_description}

------------
CANDIDATE RESUME (Plain Text):
{resume_text}

------------
EVALUATION RULES (apply in order):

1) JD-FIRST LOGIC
- Relevance is judged strictly against the JD's core responsibilities and required skills.
- Skills that are superficially similar but functionally different (e.g., Python for ML vs. Python for web backends) are NOT equivalent.
- Equivalent frameworks and ecosystems may be treated as similar (e.g., React ~ Angular, Django ~ Express) **only if** responsibilities align.

2) INTELLIGENT MATCHING CRITERIA
- Direct Relevance: Does prior work map to the JD’s core duties?
- Skill Transferability: Are skills truly applicable to this role, not just namesake overlaps?
- Industry Alignment: Does the background fit the target industry norms and expectations?
- Role-Specific Fit: Frontend needs HTML/CSS/JS/frameworks; Backend needs APIs, databases, services; Data roles need pipelines/ETL/ML ops, etc.
- Practical Success Probability: Could the candidate realistically succeed without extensive re-training?

3) EVALUATION PRINCIPLES
- Understand intent, not just keywords.
- Consider total experience, role history, progression, and initiative/ownership (leadership).
- Penalize vague buzzwords if unsupported by projects or outcomes.

4) SCORING & ELIGIBILITY
- fit_score: integer 1–10
  * 8–10 Strong fit (direct, demonstrated, recent relevance)
  * 5–7 Moderate fit (partial match; gaps or limited depth)
  * 1–4 Poor/irrelevant (different field/insufficient alignment)
- eligibility_status:
  * "Eligible" only if the candidate’s experience & skills directly align with core JD requirements.
  * Otherwise "Not Eligible", with a clear reason.

------------
OUTPUT (RAW JSON ONLY — EXACT KEYS, NO EXTRAS):

{{
  "job_description": "Verbatim JD text (copy the JD above)",
  "full_name": "Candidate full name or 'Unknown'",
  "email": "Valid email or empty string",
  "phone_number": "Phone number or empty string",
  "total_experience_years": 0,
  "roles": [
    {{
      "title": "Job title",
      "company": "Company name",
      "duration": "e.g., '2 years' or 'Unknown'",
      "start_date": "YYYY-MM or 'Unknown'",
      "end_date": "YYYY-MM or 'Present'"
    }}
  ],
  "work_experience_raw": "1–4 sentences summarizing relevant work experience in plain text",
  "skills": {{
    "skill_name": {{
      "source": "Where it appeared (e.g., 'Work Experience', 'Projects', 'Skills section')",
      "years": "Years of experience (number as string) or 'Unknown'"
    }}
  }},
  "projects": [
    {{
      "name": "Project name",
      "tech_stack": "Comma-separated technologies",
      "description": "1–3 line description focused on relevance to JD"
    }}
  ],
  "leadership_signals": true,
  "leadership_justification": "Why leadership/ownership was or was not detected",
  "candidate_fit_summary": "2–3 lines explaining suitability strictly vs the JD",
  "fit_score": 1,
  "fit_score_reason": "Plain reason tied directly to JD requirements",
  "eligibility_status": "Eligible" or "Not Eligible",
  "eligibility_reason": "Clear justification grounded in JD"
}}

STRICT RULES:
- Output MUST be valid JSON.
- Use ONLY the keys defined above.
- Do NOT invent data; use 'Unknown' or empty strings when missing.
- Date format MUST be 'YYYY-MM', 'Present', or 'Unknown'.
- The "job_description" field MUST echo the JD verbatim from above.
- Keep explanations concise and practical.
"""

    # Dynamically load API key from llm_config.json
    # Always use the central configs/llm_config.json
    config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../configs/llm_config.json'))
    try:
        with open(config_path, 'r') as f:
            llm_config = json.load(f)
            provider = llm_config.get('provider', 'openrouter')
            api_key = llm_config.get('api_key')
            model = llm_config.get('model')
            base_url = llm_config.get('base_url')
            # Only require api_key if provider is not ollama
            if provider != 'ollama' and not api_key:
                raise ValueError('API key not found in llm_config.json')
    except Exception as e:
        raise RuntimeError(f'Error loading llm_config.json: {e}')

    # Use config values for provider/model/base_url
    if provider == 'ollama':
        # Default Ollama base URL if not set
        if not base_url:
            base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
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
                # Ollama returns streaming JSON objects - we need to concatenate all content
                lines = response.text.strip().splitlines()
                full_content = ""
                
                for line in lines:
                    if line.strip():
                        try:
                            obj = json.loads(line)
                            if 'message' in obj and 'content' in obj['message']:
                                full_content += obj['message']['content']
                        except Exception:
                            continue
                
                if not full_content:
                    print('[WARNING] Ollama returned no content. Raw response:')
                    print(response.text)
                    return {"fit_score": 1, "fit_score_reason": "Could not analyze resume properly - empty response from AI", "eligibility_status": "Not Eligible", "eligibility_reason": "AI returned empty response - cannot determine if background is relevant", "work_experience_raw": "Could not extract work experience"}
                
                # Clean the concatenated content
                cleaned = full_content.strip()
                
                # Remove markdown code blocks if present
                if cleaned.startswith("```json"):
                    cleaned = cleaned[7:].strip()
                elif cleaned.startswith("```"):
                    first_newline = cleaned.find('\n')
                    if first_newline != -1:
                        cleaned = cleaned[first_newline + 1:].strip()
                    else:
                        cleaned = cleaned[3:].strip()
                        
                if cleaned.endswith("```"):
                    cleaned = cleaned[:-3].strip()
                
                # Print for debugging
                print('[DEBUG] Full concatenated Ollama content:')
                print(cleaned)
                
                if not cleaned:
                    print('[ERROR] Ollama content is empty after cleaning. Raw response:')
                    print(response.text)
                    return {"fit_score": 1, "fit_score_reason": "Could not analyze resume properly - unable to assess relevance to job", "eligibility_status": "Not Eligible", "eligibility_reason": "Resume processing failed - cannot determine if background is relevant", "work_experience_raw": "Could not extract work experience"}
                
                try:
                    return json.loads(cleaned)
                except Exception as e:
                    print(f'[ERROR] Ollama JSON parsing error: {e}')
                    print('[ERROR] Raw Ollama response:')
                    print(response.text)
                    print('[ERROR] Cleaned content:')
                    print(cleaned)
                    
                    # Try to extract basic info manually if JSON parsing fails
                    return {
                        "full_name": "Unknown", 
                        "email": "", 
                        "phone_number": "", 
                        "total_experience_years": 0,
                        "roles": [],
                        "work_experience_raw": "Could not extract work experience due to parsing error",
                        "skills": {},
                        "projects": [],
                        "leadership_signals": False,
                        "leadership_justification": "",
                        "candidate_fit_summary": "Unable to analyze due to AI response parsing error",
                        "fit_score": 1, 
                        "fit_score_reason": "Resume analysis failed - unable to parse AI response", 
                        "eligibility_status": "Not Eligible", 
                        "eligibility_reason": "Could not parse AI response to assess if background is relevant to this role"
                    }
            except Exception as e:
                print(f'[ERROR] Ollama response parsing error: {e}')
                print('[ERROR] Raw Ollama response:')
                print(response.text)
                
                # Return complete fallback structure
                return {
                    "full_name": "Unknown", 
                    "email": "", 
                    "phone_number": "", 
                    "total_experience_years": 0,
                    "roles": [],
                    "work_experience_raw": "Could not extract work experience due to parsing error",
                    "skills": {},
                    "projects": [],
                    "leadership_signals": False,
                    "leadership_justification": "",
                    "candidate_fit_summary": "Unable to analyze due to AI response parsing error",
                    "fit_score": 1, 
                    "fit_score_reason": f"Ollama response parsing error: {e}", 
                    "eligibility_status": "Not Eligible", 
                    "eligibility_reason": "System error prevented resume analysis"
                }
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
        try:
            response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data, timeout=120)
        except requests.exceptions.Timeout:
            print("[ERROR] OpenRouter API request timed out after 120 seconds")
            return {"fit_score": 1, "fit_score_reason": "OpenRouter API timeout - unable to analyze resume", "eligibility_status": "Not Eligible", "eligibility_reason": "System timeout prevented resume analysis", "work_experience_raw": "Could not extract work experience due to timeout"}
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] OpenRouter API request failed: {e}")
            return {"fit_score": 1, "fit_score_reason": "OpenRouter API connection failed", "eligibility_status": "Not Eligible", "eligibility_reason": "System error prevented resume analysis", "work_experience_raw": "Could not extract work experience due to connection error"}
        
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
                
                # Try to parse JSON
                try:
                    return json.loads(cleaned.strip())
                except json.JSONDecodeError as je:
                    print(f"[ERROR] JSON parsing failed: {je}")
                    print(f"[ERROR] Raw content: {raw}")
                    print(f"[ERROR] Cleaned content: {cleaned}")
                    
                    # Return complete fallback structure
                    return {
                        "full_name": "Unknown", 
                        "email": "", 
                        "phone_number": "", 
                        "total_experience_years": 0,
                        "roles": [],
                        "work_experience_raw": "Could not extract work experience due to JSON parsing error",
                        "skills": {},
                        "projects": [],
                        "leadership_signals": False,
                        "leadership_justification": "",
                        "candidate_fit_summary": "Unable to analyze due to AI response JSON parsing error",
                        "fit_score": 1, 
                        "fit_score_reason": f"AI response parsing failed - JSON error: {je}", 
                        "eligibility_status": "Not Eligible", 
                        "eligibility_reason": "Resume analysis incomplete - cannot determine if candidate's background is relevant"
                    }
            except Exception as e:
                print(f"[ERROR] OpenRouter response processing failed: {e}")
                return {
                    "full_name": "Unknown", 
                    "email": "", 
                    "phone_number": "", 
                    "total_experience_years": 0,
                    "roles": [],
                    "work_experience_raw": "Could not extract work experience due to processing error",
                    "skills": {},
                    "projects": [],
                    "leadership_signals": False,
                    "leadership_justification": "",
                    "candidate_fit_summary": "Unable to analyze due to system error",
                    "fit_score": 1, 
                    "fit_score_reason": f"OpenRouter response processing failed: {e}", 
                    "eligibility_status": "Not Eligible", 
                    "eligibility_reason": "System error prevented resume analysis"
                }
        else:
            raise RuntimeError(f"OpenRouter API error: {response.status_code} {response.text}")
