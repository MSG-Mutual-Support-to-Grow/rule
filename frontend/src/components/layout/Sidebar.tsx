import { useState } from "react";
import { Folder, Cog } from "lucide-react";
import SettingsModal from "./settings/SettingsModal"; // make sure path is correct

export default function Sidebar() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {/* Hover zone to show sidebar */}
      <div
        className="fixed inset-y-0 left-0 w-2 z-20"
        onMouseEnter={() => setVisible(true)}
      />

      {/* Glassmorphic Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-black/60 backdrop-blur-md shadow-lg transform ${
          visible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-30`}
        onMouseLeave={() => setVisible(false)}
      >
        <div className="flex flex-col justify-between h-full p-6 text-white">
          <div className="space-y-10">
            <h1 className="text-2xl font-bold">ResumeAI</h1>

            <button className="flex items-center space-x-2 hover:text-blue-200">
              <Folder size={20} />
              <span>Sessions</span>
            </button>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 hover:text-blue-200"
          >
            <Cog size={20} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
