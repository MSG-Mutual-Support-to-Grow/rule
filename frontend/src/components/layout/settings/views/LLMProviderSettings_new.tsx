import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  getLLMConfig, 
  updateLLMConfig, 
  getProviderModels,
  resetLLMConfig 
} from "../../../../lib/api";

interface ProviderData {
  available_providers: string[];
  provider_models: Record<string, string[]>;
  current_config: {
    provider: string;
    model: string;
    has_api_key?: boolean;
    base_url?: string;
  };
}

export default function LLMProviderSettings() {
  const navigate = useNavigate();

  const [provider, setProvider] = useState<string>("openrouter");
  const [model, setModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("http://localhost:11434");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [providerData, setProviderData] = useState<ProviderData | null>(null);

  // Load provider data and current config
  useEffect(() => {
    loadProviderData();
  }, []);

  const loadProviderData = async () => {
    try {
      setLoading(true);
      console.log("Loading provider data..."); // Debug log
      const data = await getLLMConfig();
      console.log("Provider data received:", data); // Debug log
      setProviderData(data);
      
      // Set current config
      if (data.current_config) {
        console.log("Setting current config:", data.current_config); // Debug log
        setProvider(data.current_config.provider);
        setModel(data.current_config.model);
        setBaseUrl(data.current_config.base_url || "http://localhost:11434");
        // Don't load API key from backend for security
      }
      
      // Set default model if none selected
      if (!data.current_config?.model && data.provider_models[data.current_config?.provider || 'openrouter']) {
        setModel(data.provider_models[data.current_config?.provider || 'openrouter'][0]);
      }
      
    } catch (error) {
      console.error("Failed to load provider data:", error);
      toast.error(`Failed to load LLM provider data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = async (newProvider: string) => {
    setProvider(newProvider);
    
    // Load models for new provider
    if (providerData?.provider_models[newProvider]) {
      setModel(providerData.provider_models[newProvider][0] || "");
    } else {
      try {
        const data = await getProviderModels(newProvider);
        setModel(data.models[0] || "");
      } catch (error) {
        console.error("Failed to load models:", error);
        toast.error(`Failed to load models for ${newProvider}`);
      }
    }
  };

  const handleRefreshModels = async () => {
    toast.success("Models are loaded from provider handlers automatically");
    await loadProviderData();
  };

  const handleSave = async () => {
    if (!apiKey.trim() && provider !== "ollama") {
      toast.error(provider === "ollama" ? "Base URL is required" : "API key is required");
      return;
    }

    try {
      setSaving(true);
      const result = await updateLLMConfig({
        provider,
        model,
        api_key: apiKey || undefined,
        base_url: baseUrl || undefined
      });

      if (result.success) {
        toast.success("Settings saved successfully");
        // Reload data to get updated config
        await loadProviderData();
        setTimeout(() => navigate("#"), 1000);
      } else {
        toast.error(`Failed to save: ${result.message}`);
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const result = await resetLLMConfig();
      if (result.success) {
        toast.success("Settings reset to default");
        await loadProviderData();
        setApiKey(""); // Clear API key field
      } else {
        toast.error(`Failed to reset: ${result.message}`);
      }
    } catch (error) {
      console.error("Reset failed:", error);
      toast.error("Failed to reset settings");
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 border border-white/20 rounded-xl backdrop-blur-md p-8 text-white shadow-lg w-full max-w-3xl justify-center mx-auto">
        <div className="text-center">Loading LLM provider settings...</div>
      </div>
    );
  }

  // Show error state if no provider data
  if (!providerData) {
    return (
      <div className="bg-white/10 border border-white/20 rounded-xl backdrop-blur-md p-8 text-white shadow-lg w-full max-w-3xl justify-center mx-auto">
        <div className="text-center text-red-400">
          <h3 className="text-lg font-semibold mb-2">Unable to load LLM settings</h3>
          <p className="text-sm">Make sure the backend server is running on port 8000</p>
          <button 
            onClick={loadProviderData}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl backdrop-blur-md p-8 text-white shadow-lg w-full max-w-3xl justify-center mx-auto">
      <h2 className="text-2xl font-bold mb-6">LLM Provider Settings</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Provider Select */}
        <div>
          <label className="block text-sm font-medium mb-2">LLM Provider</label>
          <select
            value={provider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {providerData?.available_providers?.map((prov) => (
              <option key={prov} value={prov}>
                {prov.charAt(0).toUpperCase() + prov.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Model Select */}
        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {(providerData?.provider_models[provider] || []).map((mod: string) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        {/* API Key / Base URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {provider === "ollama" ? "Base URL" : "API Key"}
          </label>
          <input
            type={provider === "ollama" ? "url" : "password"}
            placeholder={
              provider === "ollama"
                ? "http://localhost:11434"
                : "Enter your API key"
            }
            value={provider === "ollama" ? baseUrl : apiKey}
            onChange={(e) => provider === "ollama" ? setBaseUrl(e.target.value) : setApiKey(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
        >
          Reset to Default
        </button>
        
        <button
          onClick={handleRefreshModels}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition"
        >
          Refresh Models
        </button>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-md transition"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Current Config Display */}
      {providerData?.current_config && (
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Current Configuration:</h3>
          <div className="text-xs text-gray-300">
            <p>Provider: {providerData.current_config.provider}</p>
            <p>Model: {providerData.current_config.model}</p>
            <p>API Key: {providerData.current_config.has_api_key ? "✅ Set" : "❌ Not set"}</p>
            {provider === "ollama" && (
              <p>Base URL: {providerData.current_config.base_url || "Not set"}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
