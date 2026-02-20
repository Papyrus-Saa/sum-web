import { useState, useCallback, useEffect, useRef } from 'react';
import { API_CONFIG } from '@/lib/config/api';
import { authStorage } from '@/lib/auth/authStorage';
import type { CsvImportResponse, ImportJobStatusResponse } from '@/types/api';

const { baseUrl, endpoints } = API_CONFIG;

export function useImportJob() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<ImportJobStatusResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const uploadAbortControllerRef = useRef<AbortController | null>(null);
  const statusAbortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (uploadAbortControllerRef.current) {
        uploadAbortControllerRef.current.abort();
      }
      if (statusAbortControllerRef.current) {
        statusAbortControllerRef.current.abort();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const uploadCsv = useCallback(async (file: File): Promise<boolean> => {
    // Cancel previous upload if exists
    if (uploadAbortControllerRef.current) {
      uploadAbortControllerRef.current.abort();
    }

    setIsUploading(true);
    setError(null);

    // Create new AbortController for this upload
    uploadAbortControllerRef.current = new AbortController();

    try {
      const token = authStorage.getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${baseUrl}${endpoints.import}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
        signal: uploadAbortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `Upload failed: ${response.status}`);
      }

      const data: CsvImportResponse = await response.json();
      setJobId(data.jobId);
      return true;
    } catch (err) {
      // Ignore abort errors (user initiated)
      if (err instanceof Error && err.name === 'AbortError') {
        return false;
      }

      const message = err instanceof Error ? err.message : 'Failed to upload CSV';
      setError(message);
      return false;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const fetchJobStatus = useCallback(async (id: string): Promise<void> => {
    // Cancel previous status request if exists
    if (statusAbortControllerRef.current) {
      statusAbortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    statusAbortControllerRef.current = new AbortController();

    try {
      const token = authStorage.getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${baseUrl}${endpoints.importStatus(id)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: statusAbortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch status: ${response.status}`);
      }

      const data: ImportJobStatusResponse = await response.json();
      setStatus(data);

      // Stop polling if job is complete or failed
      if (data.state === 'completed' || data.state === 'failed') {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    } catch (err) {
      // Ignore abort errors (polling will continue)
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const message = err instanceof Error ? err.message : 'Failed to fetch job status';
      setError(message);
    }
  }, []);

  const startPolling = useCallback(
    (id: string) => {
      // Clear existing interval if any
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      // Fetch immediately
      fetchJobStatus(id);

      // Poll every 2 seconds
      pollingIntervalRef.current = setInterval(() => {
        fetchJobStatus(id);
      }, 2000);
    },
    [fetchJobStatus]
  );

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const resetJob = useCallback(() => {
    stopPolling();
    setJobId(null);
    setStatus(null);
    setError(null);
  }, [stopPolling]);

  // Start polling when jobId changes
  useEffect(() => {
    if (jobId) {
      startPolling(jobId);
    }

    return () => {
      stopPolling();
    };
  }, [jobId, startPolling, stopPolling]);

  return {
    jobId,
    status,
    isUploading,
    error,
    uploadCsv,
    resetJob
  };
}
