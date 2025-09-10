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
  filename: string;
  fit_score: number;
  fit_score_reason: string;
  candidate_name: string;
}

export interface ResumeBatchResponse {
  success: boolean;
  total_processed: number;
  successful_analyses: number;
  failed_analyses: number;
  ranked_resumes: ResumeBatchItem[];
  failed_files: Array<{
    filename: string;
    error: string;
    resume_id: string | null;
  }>;
}

export interface LLMConfig {
  current_config: {
    provider: string;
    model: string;
    api_key?: string;
    base_url?: string;
    has_api_key?: boolean;
  };
  available_providers: string[];
  provider_models: Record<string, string[]>;
}

export interface LLMProvider {
  name: string;
  models: string[];
}

export interface LLMPromptResult {
  success: boolean;
  result?: any;
  message?: string;
  provider?: string;
  model?: string;
  error?: string;
}

export const uploadResume = async (file: File): Promise<ResumeAnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload-resume/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.error || errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const uploadResumeBatch = async (files: FileList): Promise<ResumeBatchResponse> => {
  const formData = new FormData();
  Array.from(files).forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/api/upload-resume-batch/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const saveJobDescription = async (jobDescription: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/save-job-description/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ job_description: jobDescription }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.error || errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const getJobDescription = async (): Promise<{
  success: boolean;
  job_description: string;
  file_path?: string;
  message: string;
  error?: string;
}> => {
  const response = await fetch(`${API_BASE_URL}/api/get-job-description/`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    // Handle 404 as a valid case (no job description saved yet)
    if (response.status === 404) {
      return {
        success: false,
        job_description: "",
        message: result.message || "No job description found",
        error: result.error
      };
    }
    throw new Error(result.error || result.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return result;
};

export const getAnalysis = async (resumeId: string): Promise<ResumeAnalysisResult> => {
  const response = await fetch(`${API_BASE_URL}/api/get-analysis/${resumeId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// ========== LLM Provider API Functions ==========

export const getLLMConfig = async (): Promise<LLMConfig> => {
  const response = await fetch(`${API_BASE_URL}/api/llm/config`);
  if (!response.ok) {
    throw new Error(`Failed to get LLM config: ${response.statusText}`);
  }
  return response.json();
};

export const updateLLMConfig = async (config: {
  provider: string;
  model: string;
  api_key?: string;
  base_url?: string;
}): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/llm/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || `Failed to update LLM config: ${response.statusText}`);
  }
  return result;
};

export const sendLLMPrompt = async (prompt: string): Promise<LLMPromptResult> => {
  const response = await fetch(`${API_BASE_URL}/api/llm/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || `Failed to send LLM prompt: ${response.statusText}`);
  }
  return result;
};

export const getProviderModels = async (provider: string): Promise<{
  provider: string;
  models: string[];
}> => {
  const response = await fetch(`${API_BASE_URL}/api/llm/models/${provider}`);
  if (!response.ok) {
    throw new Error(`Failed to get models for provider ${provider}: ${response.statusText}`);
  }
  return response.json();
};

export const resetLLMConfig = async (): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/llm/reset`, {
    method: 'POST',
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || `Failed to reset LLM config: ${response.statusText}`);
  }
  return result;
};

// ========== Analytics API Functions ==========

export interface AnalyticsResponse {
  success: boolean;
  data?: any;
  message?: string;
  metadata?: any;
  timestamp?: string;
}

export const getAnalyticsMetrics = async (timeRange: string = 'month'): Promise<AnalyticsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/metrics?time_range=${timeRange}`);
  if (!response.ok) {
    throw new Error(`Failed to get analytics metrics: ${response.statusText}`);
  }
  return response.json();
};

export const getCandidateAnalytics = async (
  timeRange: string = 'month',
  limit: number = 100,
  offset: number = 0,
  sortBy: string = 'fit_score',
  sortOrder: string = 'desc'
): Promise<AnalyticsResponse> => {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: limit.toString(),
    offset: offset.toString(),
    sort_by: sortBy,
    sort_order: sortOrder
  });

  const response = await fetch(`${API_BASE_URL}/api/analytics/candidates?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to get candidate analytics: ${response.statusText}`);
  }
  return response.json();
};

export const getSkillsAnalysis = async (
  timeRange: string = 'month',
  topN: number = 20
): Promise<AnalyticsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/skills/analysis?time_range=${timeRange}&top_n=${topN}`);
  if (!response.ok) {
    throw new Error(`Failed to get skills analysis: ${response.statusText}`);
  }
  return response.json();
};

export const getDashboardSummary = async (timeRange: string = 'month'): Promise<AnalyticsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/dashboard/summary?time_range=${timeRange}`);
  if (!response.ok) {
    throw new Error(`Failed to get dashboard summary: ${response.statusText}`);
  }
  return response.json();
};

export const exportAnalyticsData = async (
  timeRange: string = 'month',
  format: 'json' | 'csv' = 'json'
): Promise<AnalyticsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/export?time_range=${timeRange}&format=${format}`);
  if (!response.ok) {
    throw new Error(`Failed to export analytics data: ${response.statusText}`);
  }
  return response.json();
};

export const compareCandidates = async (
  resumeIdA: string,
  resumeIdB: string,
  criteria: string = 'fit_score'
): Promise<AnalyticsResponse> => {
  const params = new URLSearchParams({
    resume_id_a: resumeIdA,
    resume_id_b: resumeIdB,
    criteria: criteria
  });

  const response = await fetch(`${API_BASE_URL}/api/analytics/compare?${params}`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error(`Failed to compare candidates: ${response.statusText}`);
  }
  return response.json();
};

export default {
  uploadResume,
  uploadResumeBatch,
  saveJobDescription,
  getJobDescription,
  getAnalysis,
  getLLMConfig,
  updateLLMConfig,
  sendLLMPrompt,
  getProviderModels,
  resetLLMConfig,
};
