import { ResumeBatchResponse } from "../../lib/api";

interface Props {
  data: ResumeBatchResponse;
  onViewDetails?: (resumeId: string) => void;
}

export default function BatchResultsViewer({ data, onViewDetails }: Props) {
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
            Ranked Resumes (by Fit Score)
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">Candidate Name</th>
                  <th className="px-6 py-3">File Name</th>
                  <th className="px-6 py-3">Fit Score</th>
                  <th className="px-6 py-3">Fit Reason</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.ranked_resumes.map((resume, index) => (
                  <tr key={resume.resume_id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {resume.candidate_name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {resume.filename}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        resume.fit_score >= 80 
                          ? 'bg-green-100 text-green-800'
                          : resume.fit_score >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {resume.fit_score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate" title={resume.fit_score_reason}>
                      {resume.fit_score_reason}
                    </td>
                    <td className="px-6 py-4">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(resume.resume_id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
