import { X } from "lucide-react";
import { useState } from "react";
import ThemeSettings from "./views/ThemeSettings";
import LLMProviderSettings from "./views/LLMProviderSettings";
// import LanguageSettings from "./LanguageSettings";
// import PrivacySettings from "./PrivacySettings";
// import NotificationSettings from "./NotificationSettings";
import SettingCard from "./SettingCard";
import { Moon, Languages, Lock, Bell,FileBox } from "lucide-react";

const settingOptions = [
  { key: "theme", title: "Theme", description: "Toggle dark/light mode.", icon: <Moon /> },
  { key: "language", title: "Language", description: "Set your preferred language.", icon: <Languages /> },
  { key: "privacy", title: "Privacy", description: "Manage privacy settings.", icon: <Lock /> },
  { key: "notifications", title: "Notifications", description: "Control alerts.", icon: <Bell /> },
  { key: "llmProvider", title: "LLM Provider", description: "Configure LLM provider settings.", icon: <FileBox /> },
];

export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeSetting, setActiveSetting] = useState<string | null>(null);

  if (!open) return null;

  const renderContent = () => {
    switch (activeSetting) {
      case "theme": return <ThemeSettings />;
      case "llmProvider": return <LLMProviderSettings />;
      // case "language": return <LanguageSettings />;
      // case "privacy": return <PrivacySettings />;
      // case "notifications": return <NotificationSettings />;
      default: return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {settingOptions.map((opt) => (
            <SettingCard
              key={opt.key}
              title={opt.title}
              description={opt.description}
              icon={opt.icon}
              onClick={() => setActiveSetting(opt.key)}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative z-50 bg-black/50 rounded-lg shadow-xl w-full max-w-4xl p-6 text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">{activeSetting ? "Settings > " + activeSetting : "Settings"}</h2>
          <button onClick={activeSetting ? () => setActiveSetting(null) : onClose}>
            <X className="w-5 h-5 text-white hover:text-gray" />
          </button>
        </div>

        {/* Dynamic Setting Panel */}
        {renderContent()}
      </div>
    </div>
  );
}
