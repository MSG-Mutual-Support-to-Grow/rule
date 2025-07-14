from abc import ABC, abstractmethod

class BaseLLMProvider(ABC):    
    def __init__(self, model: str, api_key: str | None = None):
        self.model = model
        self.api_key = api_key

    @abstractmethod
    def send_prompt(self, prompt: str) -> dict | None:
        pass