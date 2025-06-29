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
