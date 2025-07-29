import requests
from ..base_provider import BaseLLMProvider
from ..utils import parse_llm_response

class OpenRouterProvider(BaseLLMProvider):
    # Add a static list of supported models
    AVAILABLE_MODELS = [
        # Mistral models
        "mistralai/mistral-7b-instruct",
        "mistralai/mixtral-8x7b-instruct",
        "mistralai/mistral-small",
        "mistralai/mistral-medium",
        "mistralai/mistral-large",
        
        # Meta Llama models
        "meta-llama/llama-2-7b-chat",
        "meta-llama/llama-2-13b-chat",
        "meta-llama/llama-2-70b-chat",
        "meta-llama/llama-3-8b-instruct",
        "meta-llama/llama-3-70b-instruct",
        "meta-llama/llama-3.1-8b-instruct",
        "meta-llama/llama-3.1-70b-instruct",
        "meta-llama/llama-3.1-405b-instruct",
        
        # OpenAI models
        "openai/gpt-3.5-turbo",
        "openai/gpt-4",
        "openai/gpt-4-turbo",
        "openai/gpt-4o",
        "openai/gpt-4o-mini",
        
        # Google models
        "google/gemma-7b-it",
        "google/gemma-2-9b-it",
        "google/gemma-2-27b-it",
        "google/gemini-pro",
        "google/gemini-pro-vision",
        
        # Anthropic models
        "anthropic/claude-3-haiku",
        "anthropic/claude-3-sonnet",
        "anthropic/claude-3-opus",
        "anthropic/claude-3.5-sonnet",
        
        # Other popular models
        "openchat/openchat-7b",
        "nous-research/nous-hermes-2-mixtral-8x7b-dpo",
        "nousresearch/nous-hermes-llama2-13b",
        "phind/phind-codellama-34b",
        "cognitivecomputations/dolphin-mixtral-8x7b",
        "teknium/openhermes-2.5-mistral-7b",
        "microsoft/wizardlm-2-8x22b",
        
        # Code-focused models
        "codellama/codellama-34b-instruct",
        "codellama/codellama-70b-instruct",
        "deepseek/deepseek-coder-33b-instruct",
        
        # Legacy models (keeping for compatibility)
        "mistral",
        "llama-2-7b",
        "llama-2-13b", 
        "llama-2-70b",
        "gpt-3.5-turbo",
        "gpt-4",
        "mixtral-8x7b",
        "gemma-7b",
        "nous-hermes-llama2-13b",
        "openchat-3.5-0106",
        # Add more as needed
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
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        try:
            response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)

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
