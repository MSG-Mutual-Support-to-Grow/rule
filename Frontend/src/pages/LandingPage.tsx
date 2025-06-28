import { useState } from "react";
import UploadCard from "../components/UploadCard";
import OutputViewer from "../components/OutputViewer";
import Sidebar from "../components/Sidebar";
import BlurText from "../blocks/BlurText";
import { mockCandidateData } from "../const/mockdata"; // make sure this exists

export default function LandingPage() {
  const [outputData, setOutputData] = useState<object>(mockCandidateData); // 👈 Set mock data initially

  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    console.log("Uploaded files:", files);
    // For now: Set mock data regardless of actual file
    setOutputData(mockCandidateData);
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
          text="Smart Resume Intelligence"
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

        <div className="mt-10 w-full max-w-4xl">
          <OutputViewer data={outputData} />
        </div>
      </main>
    </div>
  );
}
