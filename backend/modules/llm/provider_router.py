from .handlers.openrouter_handler import OpenRouterProvider
from .handlers.ollama_handler import OllamaProvider
from .base_provider import BaseLLMProvider

# Registry of supported providers
PROVIDER_REGISTRY = {
    "openrouter": OpenRouterProvider,
    "ollama": OllamaProvider
}

def get_provider(provider_name: str, model: str, api_key: str | None = None) -> BaseLLMProvider:
    provider_name = provider_name.lower()

    if provider_name not in PROVIDER_REGISTRY:
        raise ValueError(f"Unsupported provider: {provider_name}")

    provider_class = PROVIDER_REGISTRY[provider_name]
    return provider_class(model=model, api_key=api_key)
