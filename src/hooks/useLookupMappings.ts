import { useState, useCallback } from 'react';

export interface LookupMapping {
  size_normalized: string;
  code_public: string;
  load_index?: string;
  speed_index?: string;
  codePublic: string;
  sizeNormalized: string;
}

export interface LookupMappingsState {
  data: LookupMapping[];
  filtered: LookupMapping[];
  loading: boolean;
  error: string | null;
  query: string;
}

export function useLookupMappings() {
  const [state, setState] = useState<LookupMappingsState>({
    data: [],
    filtered: [],
    // DTO recibido del backend
    loading: false,
    error: null,
    query: ''
  });

  const fetchMappings = useCallback(async (params?: Partial<LookupMapping>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const queryParams = new URLSearchParams();
      if (params?.code_public) queryParams.append('code_public', params.code_public);
      if (params?.size_normalized) queryParams.append('size_normalized', params.size_normalized);
      if (params?.load_index) queryParams.append('load_index', params.load_index);
      if (params?.speed_index) queryParams.append('speed_index', params.speed_index);
      const url = `/catalog/lookup${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, { method: 'GET' });

      const t =
        typeof window !== 'undefined' &&
        (window as unknown as { i18next?: { t: (key: string) => string } }).i18next
          ? (window as unknown as { i18next: { t: (key: string) => string } }).i18next.t
          : (key: string) => key;
      let data: unknown;
      try {
        data = await response.json();
      } catch {
        setState(prev => ({
          ...prev,
          loading: false,
          error: t('lookupMappingsErrorInvalidJSON')
        }));
        return;
      }
      let mappings: LookupMapping[] = [];
      if (Array.isArray(data)) {
        mappings = data as LookupMapping[];
      } else if (
        typeof data === 'object' &&
        data !== null &&
        'error' in (data as Record<string, unknown>)
      ) {
        mappings = [];
      } else if (typeof data === 'object' && data !== null) {
        mappings = [data as LookupMapping];
      }
      // Map to expected frontend shape
      const mapped = mappings.map(m => ({
        ...m,
        codePublic: m.code_public,
        sizeNormalized: m.size_normalized
      }));
      setState(prev => ({
        ...prev,
        data: mapped,
        filtered: mapped,
        loading: false,
        error: null
      }));
    } catch (error) {
      const t =
        typeof window !== 'undefined' &&
        (window as unknown as { i18next?: { t: (key: string) => string } }).i18next
          ? (window as unknown as { i18next: { t: (key: string) => string } }).i18next.t
          : (key: string) => key;
      setState(prev => ({
        ...prev,
        loading: false,
        error:
          t('lookupMappingsErrorGeneric') ||
          (error instanceof Error ? error.message : 'Error fetching mappings')
      }));
    }
  }, []);

  const setQuery = (query: string) => {
    setState(prev => ({
      ...prev,
      query,
      filtered: prev.data.filter(
        mapping =>
          mapping.codePublic.toLowerCase().includes(query.toLowerCase()) ||
          mapping.sizeNormalized.toLowerCase().includes(query.toLowerCase())
      )
    }));
  };

  return {
    ...state,
    fetchMappings,
    setQuery
  };
}
