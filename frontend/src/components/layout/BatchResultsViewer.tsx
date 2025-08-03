import { useState } from "react";
import { ResumeBatchResponse, getAnalysis, ResumeAnalysisResult } from "../../lib/api";
import OutputViewer from "./OutputViewer";

interface Props {
  data: ResumeBatchResponse;
}

export default function BatchResultsViewer({ data }: Props) {
  const [selectedResume, setSelectedResume] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResumeClick = async (resumeId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await getAnalysis(resumeId);
      setSelectedResume(analysis);
    } catch (err) {
      console.error("Failed to fetch analysis:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedResume(null);
    setError(null);
  };

  // If a resume is selected, show its detailed analysis
  if (selectedResume) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            ← Back to Batch Results
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Detailed Analysis</h2>
        </div>
        <OutputViewer data={selectedResume} />
      </div>
    );
  }
  return (
    <div className="w-full space-y-6">
      {/* Summary Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Batch Processing Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{data.total_processed}</div>
            <div className="text-sm text-gray-600">Total Files</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{data.successful_analyses}</div>
            <div className="text-sm text-gray-600">Successful</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{data.failed_analyses}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>
      </div>

      {/* Successful Results */}
      {data.ranked_resumes.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Ranked Resumes (by Fit Score) - Click to View Details
          </h3>
          
          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading analysis...</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {data.ranked_resumes.map((resume, index) => (
              <div
                key={resume.resume_id}
                onClick={() => handleResumeClick(resume.resume_id)}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-medium">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{resume.candidate_name}</h4>
                        <p className="text-sm text-gray-600">{resume.filename}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        resume.fit_score >= 8 
                          ? 'bg-green-100 text-green-800'
                          : resume.fit_score >= 6
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Fit Score: {resume.fit_score}/10
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed">{resume.fit_score_reason}</p>
                    </div>
                  </div>
                  
                  <div className="ml-4 text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failed Files */}
      {data.failed_files.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            Failed Files
          </h3>
          
          <div className="space-y-3">
            {data.failed_files.map((failure, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-red-800">{failure.filename}</div>
                    <div className="text-sm text-red-600 mt-1">{failure.error}</div>
                  </div>
                  {failure.resume_id && (
                    <div className="text-xs text-gray-500">
                      ID: {failure.resume_id}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
