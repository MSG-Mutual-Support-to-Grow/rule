from abc import ABC, abstractmethod

class BaseLLMProvider(ABC):    
    def init(self, model: str, api_key: str | None = None):
        self.model = model
        self.api_key = api_key

@abstractmethod
def invoke(self, prompt: str) -> str:
    pass