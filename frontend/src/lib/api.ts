// API configuration and utility functions
const API_BASE_URL = 'http://localhost:8000';

export interface ResumeAnalysisResult {
  full_name: string;
  email: string;
  phone_number: string;
  total_experience_years: number;
  roles: Array<{
    title: string;
    company: string;
    years: number;
  }>;
  skills: Record<string, {
    source: string;
    years: string;
  }>;
  projects: Array<{
    name: string;
    tech_stack: string | string[];
    description: string;
  }>;
  leadership_signals: boolean;
  leadership_justification: string;
  candidate_fit_summary: string;
  eligibility_status: string;
  eligibility_reason: string;
}

export interface ResumeBatchItem {
  resume_id: string;
  file_name: string;
  fit_score: number;
}

export const uploadResume = async (file: File): Promise<ResumeAnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload-resume/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export default {
  uploadResume,
};

export const uploadResumeBatch = async (files: FileList): Promise<ResumeBatchItem[]> => {
  const formData = new FormData();

  Array.from(files).forEach(file => {
    formData.append('files', file); // Match FastAPI's expected field name: 'files'
  });

  const response = await fetch(`${API_BASE_URL}/upload-resume-batch/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.ranked_resumes;
};
