import { useState } from "react";
import UploadCard from "../components/layout/UploadCard";
import OutputViewer from "../components/layout/OutputViewer";
import Sidebar from "../components/layout/Sidebar";
import BlurText from "../blocks/BlurText";
import { uploadResume, ResumeAnalysisResult } from "../lib/api";

export default function LandingPage() {
  const [outputData, setOutputData] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError("Please upload a PDF file only.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputData(null);

    try {
      const result = await uploadResume(file);
      setOutputData(result);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing the resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center">
        <BlurText
  text="Resume Understanding Language Engine"
  delay={150}
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
  className="text-5xl md:text-6xl mb-6 text-black"
/>

        <p className="text-lg text-gray-700 max-w-xl mb-8">
          Upload resumes individually or in bulk. Let AI parse and export
          structured data instantly.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <UploadCard
            title="Upload File"
            description="Click or drag a single resume"
            onUpload={handleUpload}
          />

          {/* Optional: Enable this if you want folder upload */}
          {/* 
          <UploadCard
            title="Upload Folder"
            description="Upload a folder of resumes"
            folder
            onUpload={handleUpload}
          /> 
          */}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Processing resume...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md mx-auto">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {outputData && !isLoading && (
          <div className="mt-10 w-full max-w-4xl">
            <OutputViewer data={outputData} />
          </div>
        )}
      </main>
    </div>
  );
}
