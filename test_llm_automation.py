"""
Test script for LLM Automation System
Run this to validate the LLM provider automation functionality
"""

import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from backend.modules.llm.llm_automation import llm_automation

def test_llm_automation():
    print("🚀 Testing LLM Automation System")
    print("=" * 50)
    
    # Test 1: Get available providers
    print("\n1. Available Providers:")
    providers = llm_automation.get_available_providers()
    print(f"   Providers: {providers}")
    
    # Test 2: Get available models for each provider
    print("\n2. Available Models:")
    for provider in providers:
        models = llm_automation.get_available_models(provider)
        print(f"   {provider}: {models}")
    
    # Test 3: Get current config
    print("\n3. Current Configuration:")
    config = llm_automation.current_config
    print(f"   Provider: {config.get('provider')}")
    print(f"   Model: {config.get('model')}")
    print(f"   Has API Key: {bool(config.get('api_key'))}")
    print(f"   Base URL: {config.get('base_url')}")
    
    # Test 4: Update configuration
    print("\n4. Testing Configuration Update:")
    test_config = {
        "provider": "openrouter",
        "model": "anthropic/claude-3.5-sonnet",
        "api_key": "test-key-12345"
    }
    
    result = llm_automation.update_provider_config(**test_config)
    print(f"   Update Result: {result['success']}")
    print(f"   Message: {result['message']}")
    
    # Test 5: Get provider status
    print("\n5. Provider Status:")
    status = llm_automation.get_provider_status()
    print(f"   Available Providers: {len(status['available_providers'])}")
    print(f"   Provider Models: {len(status['provider_models'])}")
    print(f"   Current Provider: {status['current_config']['provider']}")
    
    # Test 6: Test connection (will likely fail without real API key)
    print("\n6. Testing Connection (Expected to fail without real API key):")
    test_result = llm_automation.test_provider_connection(
        provider="openrouter",
        model="anthropic/claude-3.5-sonnet",
        api_key="test-key"
    )
    print(f"   Success: {test_result['success']}")
    print(f"   Message: {test_result['message']}")
    
    print("\n" + "=" * 50)
    print("✅ LLM Automation System test completed!")
    print("\n📝 What was created:")
    print("   1. LLM Automation class in backend/modules/llm/llm_automation.py")
    print("   2. API endpoints in backend/api/main.py:")
    print("      - GET /api/llm/providers")
    print("      - GET /api/llm/config")
    print("      - POST /api/llm/config")
    print("      - POST /api/llm/test")
    print("      - POST /api/llm/prompt")
    print("      - GET /api/llm/models/{provider}")
    print("      - POST /api/llm/reset")
    print("   3. Updated frontend API functions in frontend/src/lib/api.ts")
    print("   4. Enhanced LLMProviderSettings component")
    print("   5. Fixed base provider class and handlers")

if __name__ == "__main__":
    test_llm_automation()
