import json
from typing import Optional

def parse_llm_response(response, provider_name: str = "LLM") -> Optional[dict]:
    try:
        raw = response.json()['choices'][0]['message']['content']
        cleaned = raw.strip()

        # Clean markdown block (```json ... ```)
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
        print(f"[❌ {provider_name} JSON Parse Error]", e)
        print("🔎 Raw LLM Output:\n", response.text if hasattr(response, 'text') else "")
        return None
