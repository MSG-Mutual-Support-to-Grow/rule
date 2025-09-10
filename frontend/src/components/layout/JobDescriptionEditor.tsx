import { useState, useEffect } from "react";
import { saveJobDescription, getJobDescription } from "../../lib/api";
import toast from "react-hot-toast";

export default function JobDescriptionBox() {
  const [description, setDescription] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  // Load saved JD and lock state
  useEffect(() => {
    const loadJobDescription = async () => {
      setIsLoading(true);
      try {
        // First try to load from backend API
        const result = await getJobDescription();
        
        if (result.success && result.job_description) {
          setDescription(result.job_description);
          // If we have data from backend, mark as saved/locked
          setIsEditable(false);
          localStorage.setItem("job_description", result.job_description);
          localStorage.setItem("jd_locked", "true");
        } else {
          // No data in backend, check localStorage as fallback
          const saved = localStorage.getItem("job_description");
          const locked = localStorage.getItem("jd_locked");
          
          if (saved) {
            setDescription(saved);
            if (locked === "true") setIsEditable(false);
          }
        }
      } catch (error) {
        console.error("Failed to load job description from backend:", error);
        // Fallback to localStorage on error
        const saved = localStorage.getItem("job_description");
        const locked = localStorage.getItem("jd_locked");
        
        if (saved) {
          setDescription(saved);
          if (locked === "true") setIsEditable(false);
        }
        
        setSaveMessage("Failed to load from server, using local data");
        setTimeout(() => setSaveMessage(""), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobDescription();
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
      toast.success("Job description saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save job description:", error);
      const errorMessage = `Failed to save: ${error instanceof Error ? error.message : "Unknown error"}`;
      setSaveMessage(errorMessage);
      toast.error(errorMessage);
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
    localStorage.setItem("jd_locked", "false");
  };

  const handleReload = async () => {
    setIsLoading(true);
    setSaveMessage("");
    
    try {
      const result = await getJobDescription();
      
      if (result.success && result.job_description) {
        setDescription(result.job_description);
        setIsEditable(false);
        localStorage.setItem("job_description", result.job_description);
        localStorage.setItem("jd_locked", "true");
        setSaveMessage("Job description reloaded from server!");
      } else {
        setSaveMessage("No job description found on server");
        setDescription("");
        setIsEditable(true);
        localStorage.removeItem("job_description");
        localStorage.removeItem("jd_locked");
      }
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Failed to reload job description:", error);
      setSaveMessage(`Failed to reload: ${error instanceof Error ? error.message : "Unknown error"}`);
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
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
    <div className="mt-10 w-full max-w-4xl bg-black/70 border border-white/20 rounded-lg backdrop-blur-md p-6 shadow text-left">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-white">Job Description</h2>
        <div className="space-x-2">
          {isLoading ? (
            <div className="text-sm text-gray-400 px-3 py-1">Loading...</div>
          ) : isEditable ? (
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
          {!isLoading && (
            <>
              <button
                onClick={handleReload}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Reload
              </button>
              <button
                onClick={handleClear}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Clear
              </button>
            </>
          )}
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
        disabled={!isEditable || isLoading}
        placeholder={isLoading ? "Loading job description..." : "Paste or type your job description here..."}
        rows={8}
        className={`w-full p-4 bg-white/10 border border-white/30 text-white placeholder-gray-400 rounded resize-none focus:outline-none ${
          isEditable && !isLoading ? "focus:ring-2 focus:ring-blue-500" : "opacity-50 cursor-not-allowed"
        }`}
        style={{ color: 'white' }}
      />
    </div>
  );
}
