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
You are a highly intelligent AI assistant specialized in technical recruitment. Your job is to **analyze whether a candidate's resume is logically and practically relevant** to a given job description. You must use industry knowledge, pattern recognition, and smart matching—not just keyword comparison.

---

**JOB DESCRIPTION:**
{job_description}

---

**CANDIDATE RESUME**
Plain Text:

{resume_text}

---

### INTELLIGENT MATCHING CRITERIA:

1. **Relevance Check**: Does the candidate's experience logically align with the job duties?
2. **Skill Transferability**: Are there transferable skills or technologies?
3. **Industry Awareness**: Is the background common in the target industry?
4. **Common Sense Fit**: A full-stack dev is relevant for web roles, a sales rep is not.
5. **Practical Reasoning**: Don't expect exact wording—evaluate if the candidate could reasonably succeed in the role.

---

### EVALUATION PRINCIPLES:

* Understand the **intent** behind the job, not just the keywords.
* Detect **equivalent tools or frameworks** (e.g., React ~ Angular, Django ~ Express).
* Consider **overall experience level**, role history, and growth signals.
* Recognize leadership or initiative when stated or implied.

---

### MATCHING EXAMPLES:

✓ Job: "Frontend web app" + Resume: "React, UI/UX work, SPAs" → RELEVANT
✓ Job: "Backend APIs" + Resume: "Node.js, DB design, RESTful services" → RELEVANT
✗ Job: "DevOps role" + Resume: "Marketing, SEO, social media" → NOT RELEVANT
✗ Job: "Data Engineer" + Resume: "Retail sales, no technical background" → NOT RELEVANT

---

### OUTPUT REQUIREMENTS:

Return **ONLY a valid JSON** response in the structure below (no extra text, no markdown, no headings):

{{
  "full_name": "...",
  "email": "...",
  "phone_number": "...",
  "total_experience_years": ...,
  "roles": [
    {{
      "title": "...",
      "company": "...",
      "duration": "...",
      "start_date": "...",
      "end_date": "..."
    }}
  ],
  "work_experience_raw": "...",
  "skills": {{
    "skill_name": {{
      "source": "...",
      "years": "..."
    }}
  }},
  "projects": [
    {{
      "name": "...",
      "tech_stack": "...",
      "description": "..."
    }}
  ],
  "leadership_signals": true,
  "leadership_justification": "...",
  "candidate_fit_summary": "...",
  "fit_score": ...,
  "fit_score_reason": "...",
  "eligibility_status": "...",
  "eligibility_reason": "..."
}}

---

### OUTPUT RULES:

* **fit_score**: Integer 1–10
  8–10 = Strong fit
  5–7 = Moderate/reasonable fit
  1–4 = Poor fit or irrelevant

* **eligibility_status**:
  * "Eligible" if skills/experience logically align or are transferable
  * "Not Eligible" if experience is unrelated or irrelevant

* **eligibility_reason**: Use clear, practical explanation why they qualify or don't.

---

### FINAL TASK:

Analyze the resume and job description using smart reasoning. Then return the structured JSON output as described—**no commentary or markdown, only valid JSON.**
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
                    return {"fit_score": 1, "fit_score_reason": "Resume analysis failed - unable to parse AI response", "eligibility_status": "Not Eligible", "eligibility_reason": "Could not parse AI response to assess if background is relevant to this role", "work_experience_raw": "Could not extract work experience"}
            except Exception as e:
                print(f'[ERROR] Ollama response parsing error: {e}')
                print('[ERROR] Raw Ollama response:')
                print(response.text)
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
                return json.loads(cleaned)
            except Exception as e:
                print("[WARNING] Mistral returned invalid JSON. Falling back.")
                return {"fit_score": 1, "fit_score_reason": "AI response parsing failed - unable to assess job relevance properly", "eligibility_status": "Not Eligible", "eligibility_reason": "Resume analysis incomplete - cannot determine if candidate's background is relevant", "work_experience_raw": "Could not extract work experience"}
        else:
            raise RuntimeError(f"OpenRouter API error: {response.status_code} {response.text}")
