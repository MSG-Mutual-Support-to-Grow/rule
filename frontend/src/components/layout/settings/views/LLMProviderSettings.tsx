import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type ProviderKey = keyof typeof PROVIDERS;

const PROVIDERS = {
  OpenAI: ["gpt-4", "gpt-3.5-turbo"],
  Mistral: ["mistral-7b", "mixtral-8x7b"],
  Gemini: ["gemini-pro", "gemini-ultra"],
  Ollama: ["DeepSeek-r1", "Claude-A1"],
} as const;

const STORAGE_KEY = "llm_settings";

export default function LLMProviderSettings() {
  const navigate = useNavigate();

  const [provider, setProvider] = useState<ProviderKey>("OpenAI");
  const [model, setModel] = useState<string>(PROVIDERS["OpenAI"][0]);
  const [apiKey, setApiKey] = useState<string>("");

  // Load existing settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      if (config.provider && PROVIDERS[config.provider as ProviderKey]) {
        setProvider(config.provider);
        setModel(config.model || PROVIDERS[config.provider as ProviderKey][0]);
        setApiKey(config.apiKey || "");
      }
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error(provider === "Ollama" ? "Base URL is required" : "API key is required");
      return;
    }

    const config = { provider, model, apiKey };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    toast.success("Settings saved successfully");

    setTimeout(() => navigate("#"), 1000); // slight delay to show toast
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl backdrop-blur-md p-8 text-white shadow-lg w-full max-w-3xl justify-center mx-auto">
      <h2 className="text-2xl font-bold mb-6">LLM Provider Settings</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Provider Select */}
        <div>
          <label className="block text-sm font-medium mb-2">LLM Provider</label>
          <select
            value={provider}
            onChange={(e) => {
              const selected = e.target.value as ProviderKey;
              setProvider(selected);
              setModel(PROVIDERS[selected][0]);
            }}
            className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {(Object.keys(PROVIDERS) as ProviderKey[]).map((prov) => (
              <option key={prov} value={prov}>
                {prov}
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
            {PROVIDERS[provider].map((mod: string) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        {/* API Key / Base URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {provider === "Ollama" ? "Base URL" : "API Key"}
          </label>
          <input
            type={provider === "Ollama" ? "url" : "password"}
            placeholder={
              provider === "Ollama"
                ? "http://localhost:11434"
                : "Enter your API key"
            }
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 text-right">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
