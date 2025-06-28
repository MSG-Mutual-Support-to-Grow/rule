import { useState } from "react";
import UploadCard from "../components/UploadCard";
import OutputViewer from "../components/OutputViewer";
import Sidebar from "../components/Sidebar";
import BlurText from "../blocks/BlurText";

export default function LandingPage() {
  const [outputData, setOutputData] = useState<object | null>(null);

  const handleUpload = (type: "file" | "folder") => {
    setOutputData({ example: "Parsed resume output…" });
  };

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden text-white flex ">
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
            onUpload={(files) => {
              console.log("File uploaded:", files);
            }}
          />

          <UploadCard
            title="Upload Folder"
            description="Upload a folder of resumes"
            folder
            onUpload={(files) => {
              console.log("Folder uploaded:", files);
            }}
          />
        </div>

        {outputData && (
          <div className="mt-10 w-full max-w-3xl">
            <OutputViewer data={outputData} />
          </div>
        )}
      </main>
    </div>
  );
}
