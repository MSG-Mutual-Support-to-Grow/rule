import { useState, useEffect } from "react";
import UploadCard from "../components/layout/UploadCard";
import OutputViewer from "../components/layout/OutputViewer";
import BatchResultsViewer from "../components/layout/BatchResultsViewer";
import Sidebar from "../components/layout/Sidebar";
import JobDescriptionBox from "@/components/layout/JobDescriptionEditor";
import BlurText from "../blocks/BlurText";
import { uploadResume, uploadResumeBatch, ResumeAnalysisResult, ResumeBatchResponse, getJobDescription } from "../lib/api";
import toast from "react-hot-toast";

export default function LandingPage() {
  const [outputData, setOutputData] = useState<ResumeAnalysisResult | null>(null);
  const [batchData, setBatchData] = useState<ResumeBatchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'individual' | 'batch'>('individual');
  const [showJobDescriptionAlert, setShowJobDescriptionAlert] = useState(false);

  // Check if job description exists
  useEffect(() => {
    const checkJobDescription = async () => {
      try {
        const result = await getJobDescription();
        if (!result.success || !result.job_description?.trim()) {
          setShowJobDescriptionAlert(true);
        }
      } catch (error) {
        // If API fails, check localStorage
        const saved = localStorage.getItem("job_description");
        if (!saved?.trim()) {
          setShowJobDescriptionAlert(true);
        }
      }
    };

    checkJobDescription();
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check if all files are PDFs
    const invalidFiles = Array.from(files).filter(file => !file.name.toLowerCase().endsWith(".pdf"));
    if (invalidFiles.length > 0) {
      const errorMsg = `Please upload only PDF files. Invalid files: ${invalidFiles.map(f => f.name).join(", ")}`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputData(null);
    setBatchData(null);

    try {
      if (files.length === 1) {
        // Individual upload
        setUploadMode('individual');
        const result = await uploadResume(files[0]);
        setOutputData(result);
        toast.success("Resume processed successfully!");
      } else {
        // Batch upload
        setUploadMode('batch');
        const result = await uploadResumeBatch(files);
        setBatchData(result);
        toast.success(`${result.successful_analyses} resume(s) processed successfully!`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = err instanceof Error
        ? err.message
        : "An error occurred while processing the resume(s)";
      setError(errorMsg);
      toast.error(errorMsg);
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
          Upload resumes individually or in bulk. Let AI parse and export structured data instantly.
        </p>

        {/* Job Description Alert */}
        {showJobDescriptionAlert && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg max-w-2xl mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">⚠️ No Job Description Set</p>
                <p className="text-sm mt-1">
                  For better analysis results, please add a job description below. 
                  This helps AI compare candidates against specific requirements.
                </p>
              </div>
              <button
                onClick={() => setShowJobDescriptionAlert(false)}
                className="text-yellow-600 hover:text-yellow-800 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Upload UI */}
        <div className="flex flex-wrap justify-center gap-6">
          <UploadCard
            title="Upload Single Resume"
            description="Click to upload one PDF resume"
            onUpload={handleUpload}
          />
          <UploadCard
            title="Upload Folder"
            description="Click to upload a folder containing resumes"
            onUpload={handleUpload}
            folder={true}
          />
        </div>

        {/* 📝 Job Description Box */}
        <div className="w-full max-w-4xl">
          <JobDescriptionBox />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">
              Processing resume{uploadMode === 'batch' ? 's' : ''}...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md mx-auto">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Individual Upload Output */}
        {outputData && !isLoading && uploadMode === 'individual' && (
          <div className="mt-10 w-full max-w-4xl">
            <OutputViewer data={outputData} />
          </div>
        )}

        {/* Batch Upload Output */}
        {batchData && !isLoading && uploadMode === 'batch' && (
          <div className="mt-10 w-full max-w-6xl">
            <BatchResultsViewer data={batchData} />
          </div>
        )}
      </main>
    </div>
  );
}
