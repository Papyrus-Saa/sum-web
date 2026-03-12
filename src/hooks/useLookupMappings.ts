'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { API_CONFIG } from '@/lib/config/api';
import type { MappingResponse } from '@/types/api';

interface UseLookupMappingsState {
  data: MappingResponse[];
  loading: boolean;
  error: string | null;
  query: string;
}

export function useLookupMappings() {
  const [state, setState] = useState<UseLookupMappingsState>({
    data: [],
    loading: false,
    error: null,
    query: ''
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchMappings = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.mappings}`, {
        method: 'GET',
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch mappings: ${response.status}`);
      }

      const data = (await response.json()) as MappingResponse[];
      setState(prev => ({ ...prev, data, loading: false }));
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const message = err instanceof Error ? err.message : 'Failed to fetch mappings';
      setState(prev => ({ ...prev, error: message, loading: false }));
    }
  }, []);

  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  const filtered = useMemo(() => {
    const value = state.query.trim().toLowerCase();
    if (!value) return state.data;

    return state.data.filter(mapping => {
      const code = mapping.codePublic.toLowerCase();
      const size = mapping.sizeNormalized.toLowerCase();
      return code.includes(value) || size.includes(value);
    });
  }, [state.data, state.query]);

  return {
    data: state.data,
    filtered,
    loading: state.loading,
    error: state.error,
    query: state.query,
    setQuery,
    fetchMappings
  };
}
