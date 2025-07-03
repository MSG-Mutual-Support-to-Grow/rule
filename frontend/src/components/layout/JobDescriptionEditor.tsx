import { useState, useEffect } from "react";

export default function JobDescriptionBox() {
  const [description, setDescription] = useState("");
  const [isEditable, setIsEditable] = useState(true);

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

  const handleSave = () => {
    localStorage.setItem("job_description", description);
    localStorage.setItem("jd_locked", "true");
    setIsEditable(false);
  };

  const handleEdit = () => {
    setIsEditable(true);
    localStorage.setItem("jd_locked", "false");
  };

  const handleClear = () => {
    localStorage.removeItem("job_description");
    localStorage.removeItem("jd_locked");
    setDescription("");
    setIsEditable(true);
  };

  return (
    <div className="mt-10 w-full max-w-4xl bg-black/40 border border-white/20 rounded-lg backdrop-blur-md p-6 shadow text-left">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-white">Job Description</h2>
        <div className="space-x-2">
          {isEditable ? (
            <button
              onClick={handleSave}
              className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
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
