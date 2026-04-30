/**
 * API client for CodeSensei backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    credentials: 'include', // Include cookies for session
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Session API
export const sessionApi = {
  create: () => apiCall<{ session_id: string; created_at: string }>('/session', {
    method: 'POST',
  }),
};

// Progress API
export const progressApi = {
  get: () => apiCall<{
    problems_solved: number;
    current_streak: number;
    total_attempts: number;
    skill_data: Record<string, { solved: number; total: number }>;
    last_active: string;
  }>('/progress'),
  
  update: (data: {
    problems_solved?: number;
    current_streak?: number;
    total_attempts?: number;
  }) => apiCall('/progress/update', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  completeChallenge: (attempts: number = 1) => apiCall<{
    success: boolean;
    problems_solved: number;
    current_streak: number;
    message: string;
  }>('/challenge/complete', {
    method: 'POST',
    body: JSON.stringify({ attempts }),
  }),
};

// Analysis API
export const analysisApi = {
  analyze: (problem: string, code: string) => apiCall<{
    submission_id: string;
    analysis: {
      time_complexity: { complexity: string; confidence: string; reason: string };
      space_complexity: { complexity: string; confidence: string; reason: string };
      patterns: Array<{ name: string; type: string }>;
      bottlenecks: Array<{ type: string; issue: string; impact: string; fix: string }>;
      suggestions: Array<{ priority: string; category: string; suggestion: string; reason: string }>;
      metrics: { total_lines: number; code_lines: number; functions: number; loops: number; conditionals: number };
    };
    submitted_at: string;
  }>('/analyze', {
    method: 'POST',
    body: JSON.stringify({ problem, code }),
  }),
  
  getHistory: () => apiCall<{
    history: Array<{
      id: string;
      problem: string;
      analysis: unknown;
      created_at: string;
    }>;
  }>('/analyze/history'),
};

// Interview API
export const interviewApi = {
  getProblem: () => apiCall<{
    problem_id: number;
    title: string;
    difficulty: string;
    language: string;
    code: string;
    issues_count: number;
  }>('/interview/problem'),
  
  submitReview: (problemId: number, review: string) => apiCall<{
    success: boolean;
    score: number;
    feedback: {
      detected_issues: number;
      total_issues: number;
      missed_issues: Array<{ type: string; description: string; keywords: string[]; fix: string }>;
    };
    optimal_solution: string | null;
  }>('/interview/submit', {
    method: 'POST',
    body: JSON.stringify({ problem_id: problemId, review }),
  }),
  
  getAttempts: () => apiCall<{
    attempts: Array<{
      id: string;
      problem_id: number;
      score: number;
      created_at: string;
    }>;
    total_attempts: number;
    average_score: number;
  }>('/interview/attempts'),
};

// Health check
export const healthApi = {
  check: () => apiCall<{ status: string; service: string }>('/health'),
};
