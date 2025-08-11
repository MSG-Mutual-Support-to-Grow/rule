import requests
import os
from ..base_provider import BaseLLMProvider
from ..utils import parse_llm_response

class OllamaProvider(BaseLLMProvider):
    def __init__(self, model: str, api_key: str | None = None):
        super().__init__(model, api_key)
        # Get Ollama base URL from environment variable, fallback to localhost
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    
    def send_prompt(self, prompt: str) -> dict | None:
        url = f"{self.base_url}/api/chat"

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

    @staticmethod
    def list_models():
        """Return available Ollama models from local machine"""
        try:
            # Get Ollama base URL from environment variable, fallback to localhost
            base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
            response = requests.get(f"{base_url}/api/tags")
            if response.status_code == 200:
                data = response.json()
                # Extract model names from the response
                models = [model["name"] for model in data.get("models", [])]
                
                # If no models found, return a helpful message
                if not models:
                    return ["No models installed - Run 'ollama pull <model_name>' to install models"]
                
                return models
            else:
                print("[❌ Ollama API Error when fetching models]", response.status_code)
                return ["Ollama server not responding - Make sure Ollama is running"]
        except Exception as e:
            print("[❌ Failed to fetch Ollama models]", e)
            return ["Ollama not available - Install and start Ollama service"]
