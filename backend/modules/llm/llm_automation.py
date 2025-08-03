"""
LLM Provider Automation System
Handles all LLM provider operations including configuration, testing, and management
"""

import json
import os
from typing import Dict, List, Optional, Any
from .provider_router import get_provider, PROVIDER_REGISTRY
from .base_provider import BaseLLMProvider

class LLMAutomation:
    def __init__(self, config_path: str = None):
        """Initialize LLM automation with optional config file path"""
        self.config_path = config_path or os.path.join(
            os.path.dirname(__file__), "..", "..", "..", "configs", "llm_config.json"
        )
        self.current_config = self.load_config()
    
    def _get_default_base_url(self, provider: str) -> str:
        """Get default base URL for each provider"""
        default_urls = {
            "ollama": "http://127.0.0.1:11434",  # Default Ollama localhost
            "openrouter": "https://openrouter.ai/api/v1/chat/completions",
            "openai": "https://api.openai.com/v1/chat/completions",
            "anthropic": "https://api.anthropic.com/v1/messages"
        }
        
        return default_urls.get(provider, "http://127.0.0.1:11434")
    
    def load_config(self) -> Dict[str, Any]:
        """Load LLM configuration from file"""
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                    # Auto-fix base_url if it doesn't match the provider
                    original_base_url = config.get("base_url", "")
                    config = self._validate_and_fix_config(config)
                    # Save if config was modified
                    if config.get("base_url") != original_base_url:
                        self.current_config = config  # Set temporarily for save_config
                        self.save_config(config)
                    return config
        except Exception as e:
            print(f"[⚠️ Config Load Error] {e}")
        
        # Return default config if file doesn't exist or fails to load
        return {
            "provider": "openrouter",
            "model": "anthropic/claude-3.5-sonnet",
            "api_key": "",
            "base_url": "https://openrouter.ai/api/v1/chat/completions"
        }
    
    def _validate_and_fix_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and auto-fix configuration base_url based on provider"""
        provider = config.get("provider", "openrouter")
        current_base_url = config.get("base_url", "")
        expected_base_url = self._get_default_base_url(provider)
        
        # Fix base_url if it doesn't match the provider
        if current_base_url != expected_base_url:
            print(f"[🔧 Config Fix] Updating base_url for {provider}: {current_base_url} -> {expected_base_url}")
            config["base_url"] = expected_base_url
            # We'll save after returning to avoid circular references
        
        return config
    
    def save_config(self, config: Dict[str, Any]) -> bool:
        """Save LLM configuration to file"""
        try:
            # Create config directory if it doesn't exist
            os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
            
            with open(self.config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            
            self.current_config = config
            print(f"[✅ Config Saved] Provider: {config.get('provider')}, Model: {config.get('model')}")
            return True
            
        except Exception as e:
            print(f"[❌ Config Save Error] {e}")
            return False
    
    def get_available_providers(self) -> List[str]:
        """Get list of all available LLM providers"""
        return list(PROVIDER_REGISTRY.keys())
    
    def get_available_models(self, provider: str) -> List[str]:
        """Get available models for a specific provider"""
        provider_name = provider.lower()
        
        if provider_name not in PROVIDER_REGISTRY:
            return []
        
        try:
            # Get the provider class and call its list_models method
            provider_class = PROVIDER_REGISTRY[provider_name]
            if hasattr(provider_class, 'list_models'):
                return provider_class.list_models()
            else:
                print(f"[⚠️ Warning] Provider {provider_name} does not have list_models method")
                return []
        except Exception as e:
            print(f"[❌ Error getting models for {provider}] {e}")
            return []
    
    def test_provider_connection(self, provider: str, model: str, api_key: str = None) -> Dict[str, Any]:
        """Test connection to a specific LLM provider"""
        try:
            # Get provider instance
            provider_instance = get_provider(provider, model, api_key)
            
            # Test with a simple prompt
            test_prompt = "Hello! Please respond with just 'Connection successful' if you can see this message."
            
            if hasattr(provider_instance, 'send_prompt'):
                result = provider_instance.send_prompt(test_prompt)
                
                if result:
                    return {
                        "success": True,
                        "message": "Provider connection successful",
                        "provider": provider,
                        "model": model,
                        "response_received": True
                    }
                else:
                    return {
                        "success": False,
                        "message": "Provider returned no response",
                        "provider": provider,
                        "model": model,
                        "error": "No response from provider"
                    }
            else:
                return {
                    "success": False,
                    "message": "Provider method not implemented",
                    "provider": provider,
                    "model": model,
                    "error": "send_prompt method not found"
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": f"Connection test failed: {str(e)}",
                "provider": provider,
                "model": model,
                "error": str(e)
            }
    
    def update_provider_config(self, provider: str, model: str, api_key: str = None, base_url: str = None) -> Dict[str, Any]:
        """Update provider configuration"""
        try:
            # Validate provider
            if provider.lower() not in self.get_available_providers():
                return {
                    "success": False,
                    "message": f"Unsupported provider: {provider}"
                }
            
            # Validate model
            available_models = self.get_available_models(provider)
            if available_models and model not in available_models:
                return {
                    "success": False,
                    "message": f"Model {model} not available for provider {provider}",
                    "available_models": available_models
                }
            
            # Auto-determine base_url if not provided
            if not base_url:
                base_url = self._get_default_base_url(provider.lower())
            
            # Create new config
            new_config = {
                "provider": provider.lower(),
                "model": model,
                "api_key": api_key or "",
                "base_url": base_url,
                "updated_at": json.dumps(None, default=str)  # Current timestamp as string
            }
            
            # Save configuration
            if self.save_config(new_config):
                return {
                    "success": True,
                    "message": "Provider configuration updated successfully",
                    "config": new_config
                }
            else:
                return {
                    "success": False,
                    "message": "Failed to save configuration"
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": f"Configuration update failed: {str(e)}",
                "error": str(e)
            }
    
    def get_current_provider(self) -> BaseLLMProvider:
        """Get the currently configured provider instance"""
        config = self.current_config
        return get_provider(
            config.get("provider", "openrouter"),
            config.get("model", "anthropic/claude-3.5-sonnet"),
            config.get("api_key")
        )
    
    def send_prompt_with_current_provider(self, prompt: str) -> Dict[str, Any]:
        """Send prompt using currently configured provider"""
        try:
            provider = self.get_current_provider()
            
            if hasattr(provider, 'send_prompt'):
                result = provider.send_prompt(prompt)
                
                if result:
                    return {
                        "success": True,
                        "result": result,
                        "provider": self.current_config.get("provider"),
                        "model": self.current_config.get("model")
                    }
                else:
                    return {
                        "success": False,
                        "message": "Provider returned no response",
                        "provider": self.current_config.get("provider"),
                        "model": self.current_config.get("model")
                    }
            else:
                return {
                    "success": False,
                    "message": "Provider method not implemented"
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": f"Prompt processing failed: {str(e)}",
                "error": str(e)
            }
    
    def get_provider_status(self) -> Dict[str, Any]:
        """Get comprehensive status of all providers"""
        status = {
            "current_config": self.current_config,
            "available_providers": self.get_available_providers(),
            "provider_models": {},
            "connection_status": {}
        }
        
        # Get models for each provider
        for provider in self.get_available_providers():
            status["provider_models"][provider] = self.get_available_models(provider)
        
        return status
    
    def reset_to_default(self) -> Dict[str, Any]:
        """Reset configuration to default settings"""
        default_config = {
            "provider": "openrouter",
            "model": "anthropic/claude-3.5-sonnet",
            "api_key": "",
            "base_url": "http://localhost:11434"
        }
        
        if self.save_config(default_config):
            return {
                "success": True,
                "message": "Configuration reset to default",
                "config": default_config
            }
        else:
            return {
                "success": False,
                "message": "Failed to reset configuration"
            }

# Global instance for easy access
llm_automation = LLMAutomation()
