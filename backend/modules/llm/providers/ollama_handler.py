import requests
from llm.base_provider import BaseLLMProvider
from ..utils import parse_llm_response

class OllamaProvider(BaseLLMProvider):
    def send_prompt(self, prompt: str) -> dict | None:
        url = "http://localhost:11434/api/chat"

        headers = {
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,  # e.g., "mistral", "llama3"
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": False  # We expect a single response
        }

        try:
            response = requests.post(url, headers=headers, json=payload)

            if response.status_code == 200:
                return parse_llm_response(response, provider_name="Ollama")
            else:
                print("[❌ Ollama API Error]", response.status_code)
                print("🔎", response.text)
                return None

        except Exception as e:
            print("[❌ Ollama Request Failed]", e)
            return None
