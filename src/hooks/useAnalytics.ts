import { useState, useCallback, useRef, useEffect } from 'react';
import { API_CONFIG } from '@/lib/config/api';
import { authStorage } from '@/lib/auth/authStorage';
import type { AnalyticsOverviewResponse, TopSearchesResponse } from '@/types/api';

const { baseUrl, endpoints } = API_CONFIG;

export function useAnalytics() {
  const [overview, setOverview] = useState<AnalyticsOverviewResponse | null>(null);
  const [topSearches, setTopSearches] = useState<TopSearchesResponse>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchOverview = useCallback(async (days: number = 7) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const token = authStorage.getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${baseUrl}${endpoints.analyticsOverview}?days=${days}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch overview: ${response.status}`);
      }

      const data: AnalyticsOverviewResponse = await response.json();
      setOverview(data);
    } catch (err) {
      // Ignore abort errors (user initiated)
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const message = err instanceof Error ? err.message : 'Failed to fetch analytics overview';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTopSearches = useCallback(async (days: number = 7, limit: number = 10) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const token = authStorage.getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(
        `${baseUrl}${endpoints.analyticsTopSearches}?days=${days}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: abortControllerRef.current.signal
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch top searches: ${response.status}`);
      }

      const data: TopSearchesResponse = await response.json();
      setTopSearches(data);
    } catch (err) {
      // Ignore abort errors (user initiated)
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const message = err instanceof Error ? err.message : 'Failed to fetch top searches';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async (days: number = 7) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const token = authStorage.getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const [overviewRes, topSearchesRes] = await Promise.all([
        fetch(`${baseUrl}${endpoints.analyticsOverview}?days=${days}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          signal: abortControllerRef.current.signal
        }),
        fetch(`${baseUrl}${endpoints.analyticsTopSearches}?days=${days}&limit=10`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          signal: abortControllerRef.current.signal
        })
      ]);

      if (!overviewRes.ok || !topSearchesRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [overviewData, topSearchesData] = await Promise.all([
        overviewRes.json() as Promise<AnalyticsOverviewResponse>,
        topSearchesRes.json() as Promise<TopSearchesResponse>
      ]);

      setOverview(overviewData);
      setTopSearches(topSearchesData);
    } catch (err) {
      // Ignore abort errors (user initiated)
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const message = err instanceof Error ? err.message : 'Failed to fetch analytics data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    overview,
    topSearches,
    isLoading,
    error,
    fetchOverview,
    fetchTopSearches,
    fetchAll
  };
}
