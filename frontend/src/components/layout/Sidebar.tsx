import { useState } from "react";
import { Folder, Cog, Menu, X, BookOpen } from "lucide-react";
import SettingsModal from "./settings/SettingsModal"; // make sure path is correct

export default function Sidebar() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setVisible(!visible)}
        className="fixed top-4 left-4 z-40 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-black/80 transition-colors"
      >
        {visible ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Hover zone to show sidebar (only when not manually opened) */}
      {!visible && (
        <div
          className="fixed inset-y-0 left-0 w-2 z-20"
          onMouseEnter={() => setVisible(true)}
        />
      )}

      {/* Backdrop for mobile */}
      {visible && (
        <div
          className="fixed inset-0 bg-black/50 z-25 lg:hidden"
          onClick={() => setVisible(false)}
        />
      )}

      {/* Glassmorphic Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-black/60 backdrop-blur-md shadow-lg transform ${
          visible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-30`}
        onMouseLeave={() => !visible || setVisible(false)}
      >
        <div className="flex flex-col justify-between h-full p-6 text-white pt-16">
          <div className="space-y-10">
            <h1 className="text-2xl font-bold">RULE</h1>

            <div className="space-y-4">
              <a
                href="/docs"
                className="flex items-center space-x-2 hover:text-blue-200 transition-colors"
              >
                <BookOpen size={20} />
                <span>Documentation</span>
              </a>

              {/* <button className="flex items-center space-x-2 hover:text-blue-200">
                <Folder size={20} />
                <span>Sessions</span>
              </button> */}
            </div>
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
