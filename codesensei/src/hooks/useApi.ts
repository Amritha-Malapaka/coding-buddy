/**
 * React hooks for API data fetching with loading/error states
 */

import { useState, useEffect, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = []
): ApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetchFn();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }, [fetchFn]);

  useEffect(() => {
    fetch();
  }, deps);

  return { ...state, refetch: fetch };
}

export function useProgress() {
  const { progressApi } = require('@/lib/api');
  return useApi(() => progressApi.get(), []);
}

export function useInterviewProblem() {
  const { interviewApi } = require('@/lib/api');
  return useApi(() => interviewApi.getProblem(), []);
}

export function useAnalysisHistory() {
  const { analysisApi } = require('@/lib/api');
  return useApi(() => analysisApi.getHistory(), []);
}

export function useInterviewAttempts() {
  const { interviewApi } = require('@/lib/api');
  return useApi(() => interviewApi.getAttempts(), []);
}
