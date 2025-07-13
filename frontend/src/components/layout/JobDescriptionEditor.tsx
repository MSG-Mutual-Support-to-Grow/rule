import { useState, useEffect } from "react";
import { saveJobDescription } from "../../lib/api";

export default function JobDescriptionBox() {
  const [description, setDescription] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Load saved JD and lock state
  useEffect(() => {
    const saved = localStorage.getItem("job_description");
    const locked = localStorage.getItem("jd_locked");

    if (saved) setDescription(saved);
    if (locked === "true") setIsEditable(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSave = async () => {
    if (!description.trim()) {
      setSaveMessage("Please enter a job description before saving.");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      // Save to backend API
      await saveJobDescription(description);
      
      // Also save to localStorage for offline access
      localStorage.setItem("job_description", description);
      localStorage.setItem("jd_locked", "true");
      
      setIsEditable(false);
      setSaveMessage("Job description saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save job description:", error);
      setSaveMessage(`Failed to save: ${error instanceof Error ? error.message : "Unknown error"}`);
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
    localStorage.setItem("jd_locked", "false");
  };

  const handleClear = async () => {
    try {
      // Clear from backend by saving empty description
      await saveJobDescription("");
      
      // Clear from localStorage
      localStorage.removeItem("job_description");
      localStorage.removeItem("jd_locked");
      
      setDescription("");
      setIsEditable(true);
      setSaveMessage("Job description cleared successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Failed to clear job description:", error);
      // Still clear locally even if backend fails
      localStorage.removeItem("job_description");
      localStorage.removeItem("jd_locked");
      setDescription("");
      setIsEditable(true);
      setSaveMessage("Cleared locally (backend clear failed)");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="mt-10 w-full max-w-4xl bg-black/40 border border-white/20 rounded-lg backdrop-blur-md p-6 shadow text-left">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-white">Job Description</h2>
        <div className="space-x-2">
          {isEditable ? (
            <button
              onClick={handleSave}
              disabled={isSaving || !description.trim()}
              className={`text-sm px-3 py-1 rounded ${
                isSaving || !description.trim()
                  ? "bg-gray-500 cursor-not-allowed text-gray-300"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleClear}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Clear
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={`mb-3 p-2 rounded text-sm ${
          saveMessage.includes("successfully") 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {saveMessage}
        </div>
      )}

      <textarea
        value={description}
        onChange={handleChange}
        disabled={!isEditable}
        placeholder="Paste or type your job description here..."
        rows={8}
        className={`w-full p-4 bg-white/10 border border-white/30 text-white rounded resize-none focus:outline-none ${
          isEditable ? "focus:ring-2 focus:ring-blue-500" : "opacity-50 cursor-not-allowed"
        }`}
      />
    </div>
  );
}
