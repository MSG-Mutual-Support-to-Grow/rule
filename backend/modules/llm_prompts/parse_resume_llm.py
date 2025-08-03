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
You are an intelligent recruiter assistant AI. Your job is to logically and practically assess if a candidate's skills and experience are relevant to the job requirements. Use common sense and industry knowledge.

JOB DESCRIPTION:
{job_description}

INTELLIGENT MATCHING RULES:
1. LOGICAL RELEVANCE: Consider if the candidate's experience is logically relevant to the job role
2. TRANSFERABLE SKILLS: Recognize when skills are transferable and applicable
3. INDUSTRY KNOWLEDGE: Use practical understanding of what qualifications make sense for different roles
4. COMMON SENSE: A full-stack developer IS relevant for web development, but a sales executive is NOT
5. PRACTICAL SCORING: Be reasonable - don't expect exact keyword matches, look for logical fit

SMART ANALYSIS APPROACH:
- Understand the ESSENCE of what the job requires (not just keywords)
- Recognize relevant experience even if not exactly worded the same way
- Consider if the candidate's background logically prepares them for this role
- Be practical about skill overlap and transferability

LOGICAL EXAMPLES:
✓ Job: "Web development with HTML, CSS, JS" + Candidate: "Full-stack developer with React, Node.js" → RELEVANT
✓ Job: "Web applications" + Candidate: "Frontend developer, responsive design" → RELEVANT  
✓ Job: "Software development" + Candidate: "Backend engineer, API development" → RELEVANT
✗ Job: "Web development" + Candidate: "Sales executive, CRM management" → NOT RELEVANT
✗ Job: "Web development" + Candidate: "Data scientist, machine learning only" → NOT RELEVANT
✗ Job: "Technical role" + Candidate: "Marketing manager, social media" → NOT RELEVANT

BE SMART, NOT RIGID:
- If someone has relevant technical background, give them credit
- Don't penalize for using different but equivalent technologies
- Focus on whether they can realistically do the job
- Consider experience level and growth potential

Analyze the following resume text and extract the candidate's details in valid JSON format with these fields:

- full_name (string)
- email (string)
- phone_number (string)
- total_experience_years (int)
- roles (list of {{title, company, duration, start_date, end_date}}) - Extract exactly as written in resume
- work_experience_raw (string): Extract the complete work experience section exactly as written in the PDF
- skills (dict: key=skill name, value={{source: how skill was acquired, years: if mentioned or estimated}})
- projects (list of {{name, tech_stack, description}})
- leadership_signals (bool)
- leadership_justification (string: sentence or phrase from the resume that indicates leadership, if any)
- candidate_fit_summary (1–2 sentence summary of how candidate's background relates to job requirements)
- fit_score (integer from 1 to 10): Use logical reasoning - relevant experience should score 6-10, irrelevant should score 1-4
- fit_score_reason (string): Logical explanation of why the candidate's experience is or isn't relevant to this job
- eligibility_status (string): "Eligible" if candidate has logically relevant experience, "Not Eligible" if completely unrelated
- eligibility_reason (string): Practical explanation of how candidate's background relates to job requirements

REASONING LOGIC:
- Ask yourself: "Could this person realistically do this job based on their background?"
- Consider: Technical skills, relevant experience, similar roles, transferable knowledge
- Be practical: Someone with related technical experience should be eligible
- Be sensible: Someone from completely different field (sales, marketing, unrelated domains) should not be eligible

Return ONLY valid JSON in the following format and nothing else (no explanation, no markdown, no extra text):

{{
  "full_name": ...,
  "email": ...,
  "phone_number": ...,
  "total_experience_years": ...,
  "roles": [...],
  "work_experience_raw": "...",
  "skills": {{ ... }},
  "projects": [...],
  "leadership_signals": ...,
  "leadership_justification": "...",
  "candidate_fit_summary": "...",
  "fit_score": ...,
  "fit_score_reason": "...",
  "eligibility_status": "...",
  "eligibility_reason": "..."
}}

Resume:
{resume_text}
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
                # Ollama may return multiple JSON objects separated by newlines
                lines = response.text.strip().splitlines()
                message_content = None
                for line in reversed(lines):
                    try:
                        obj = json.loads(line)
                        if 'message' in obj and 'content' in obj['message']:
                            message_content = obj['message']['content']
                            break
                    except Exception:
                        continue
                if message_content is None:
                    print('[WARNING] Ollama returned no valid message content. Raw response:')
                    print(response.text)
                    raise ValueError('No valid message content found in Ollama response')
                cleaned = message_content.strip()
                if cleaned.startswith("```"):
                    cleaned = cleaned.strip('`').strip()
                # Print raw cleaned result for debugging
                print('[DEBUG] Raw cleaned Ollama result:')
                print(cleaned)
                if not cleaned:
                    print('[ERROR] Ollama returned empty response after cleaning. Raw response:')
                    print(response.text)
                    return {"fit_score": 2, "fit_score_reason": "Could not analyze resume properly - unable to assess relevance to job", "eligibility_status": "Not Eligible", "eligibility_reason": "Resume processing failed - cannot determine if background is relevant", "work_experience_raw": "Could not extract work experience"}
                try:
                    return json.loads(cleaned)
                except Exception as e:
                    print(f'[ERROR] Ollama response parsing error: {e}')
                    print('[ERROR] Raw Ollama response:')
                    print(response.text)
                    print('[ERROR] Cleaned Ollama result:')
                    print(cleaned)
                    return {"fit_score": 2, "fit_score_reason": "Resume analysis failed - unable to determine relevance to job requirements", "eligibility_status": "Not Eligible", "eligibility_reason": "Could not parse resume to assess if background is relevant to this role", "work_experience_raw": "Could not extract work experience"}
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
                return json.loads(cleaned)
            except Exception as e:
                print("[WARNING] Mistral returned invalid JSON. Falling back.")
                return {"fit_score": 2, "fit_score_reason": "AI response parsing failed - unable to assess job relevance properly", "eligibility_status": "Not Eligible", "eligibility_reason": "Resume analysis incomplete - cannot determine if candidate's background is relevant", "work_experience_raw": "Could not extract work experience"}
        else:
            raise RuntimeError(f"OpenRouter API error: {response.status_code} {response.text}")
