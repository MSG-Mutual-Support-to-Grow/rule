import requests

from ..base_provider import BaseLLMProvider
from ..utils import parse_llm_response


class OpenRouterProvider(BaseLLMProvider):
    # Add a static list of supported models
    AVAILABLE_MODELS = [
        "anthropic/claude-3.5-sonnet",
        "anthropic/claude-3-haiku",
        "anthropic/claude-3-opus",
        "openai/gpt-4o",
        "openai/gpt-4o-mini",
        "openai/gpt-4-turbo",
        "mistralai/mistral-small",
        "mistralai/mistral-large",
        "meta-llama/llama-3-70b-instruct",
        "meta-llama/llama-3-8b-instruct",
        "google/gemini-flash-1.5",
        "google/gemini-pro-1.5",
    ]

    def __init__(self, model: str, api_key: str | None = None):
        super().__init__(model, api_key)

    def send_prompt(self, prompt: str) -> dict | None:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost",
        }

        data = {
            "model": self.model,
            "temperature": 0.0,
            "messages": [{"role": "user", "content": prompt}],
        }

        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=120,
            )

            if response.status_code == 200:
                return parse_llm_response(response, provider_name="OpenRouter")
            else:
                print("[❌ OpenRouter API Error]", response.status_code)
                print("🔎", response.text)
                return None
        except Exception as e:
            print("[❌ OpenRouter Request Failed]", e)
            return None

    @staticmethod
    def list_models():
        """Return available OpenRouter models"""
        return OpenRouterProvider.AVAILABLE_MODELS
