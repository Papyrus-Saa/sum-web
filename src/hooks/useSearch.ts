'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { LookupResponse, ApiError } from '@/types/api';
import {
  API_CONFIG,
  TIRE_SIZE_PATTERN,
  TIRE_CODE_PATTERN,
  TIRE_VARIANT_PATTERN
} from '@/lib/config/api';
import { ErrorCode, ERROR_MESSAGE_KEYS } from '@/lib/errors/errorCodes';

type SearchType = 'code' | 'size' | null;

interface SearchState {
  data: LookupResponse | null;
  error: string | null;
  loading: boolean;
  searchType: SearchType;
}

/**
 * Detects if input is a tire code (number) or tire size (205/55R16 format)
 */
function detectSearchType(query: string): SearchType {
  const trimmed = query.trim();
  if (!trimmed) return null;

  // Check if it's a pure number (tire code)
  if (TIRE_CODE_PATTERN.test(trimmed)) {
    return 'code';
  }

  // Check if it matches tire size pattern
  if (TIRE_SIZE_PATTERN.test(trimmed)) {
    return 'size';
  }

  return null;
}

/**
 * Parses optional load index and speed index from input
 * Examples: "100 91V", "205/55R16 91V"
 */
function parseVariant(query: string): {
  cleanQuery: string;
  loadIndex?: string;
  speedIndex?: string;
} {
  const variantMatch = query.trim().match(TIRE_VARIANT_PATTERN);

  if (variantMatch) {
    const [fullMatch, li, si] = variantMatch;
    return {
      cleanQuery: query.replace(fullMatch, '').trim(),
      loadIndex: li,
      speedIndex: si
    };
  }

  return { cleanQuery: query.trim() };
}

export function useSearch() {
  const { t } = useTranslation();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [state, setState] = useState<SearchState>({
    data: null,
    error: null,
    loading: false,
    searchType: null
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const search = useCallback(
    async (query: string) => {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const { cleanQuery, loadIndex, speedIndex } = parseVariant(query);
      const searchType = detectSearchType(cleanQuery);

      if (!searchType) {
        setState({
          data: null,
          error: t('error_invalid_search_input'),
          loading: false,
          searchType: null
        });
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null, searchType }));

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      try {
        // Build query params
        const params = new URLSearchParams();
        if (searchType === 'code') {
          params.append('code', cleanQuery);
        } else {
          params.append('size', cleanQuery);
        }

        if (loadIndex && speedIndex) {
          params.append('li', loadIndex);
          params.append('si', speedIndex);
        }

        const response = await fetch(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.lookup}?${params.toString()}`,
          {
            method: 'GET',
            signal: abortControllerRef.current.signal
          }
        );

        if (!response.ok) {
          // Try to parse error response
          let errorData: ApiError | null = null;
          try {
            errorData = (await response.json()) as ApiError;
          } catch {
            // If JSON parsing fails, use status-based error
          }

          if (response.status === 404) {
            setState({
              data: null,
              error:
                searchType === 'code'
                  ? t(ERROR_MESSAGE_KEYS[ErrorCode.TIRE_CODE_NOT_FOUND])
                  : t(ERROR_MESSAGE_KEYS[ErrorCode.TIRE_SIZE_NOT_FOUND]),
              loading: false,
              searchType
            });
            return;
          }

          // Try to get error code from response body
          const errorCode = errorData?.error?.code as ErrorCode;
          const errorKey = errorCode ? ERROR_MESSAGE_KEYS[errorCode] : null;

          setState({
            data: null,
            error: errorKey ? t(errorKey) : t(ERROR_MESSAGE_KEYS[ErrorCode.UNKNOWN_ERROR]),
            loading: false,
            searchType
          });
          return;
        }

        const data = (await response.json()) as LookupResponse;
        setState({
          data,
          error: null,
          loading: false,
          searchType
        });
      } catch (error) {
        // Ignore abort errors (user initiated)
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        setState({
          data: null,
          error: t(ERROR_MESSAGE_KEYS[ErrorCode.NETWORK_ERROR]),
          loading: false,
          searchType
        });
      }
    },
    [t]
  );

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      data: null,
      error: null,
      loading: false,
      searchType: null
    });
  }, []);

  return {
    ...state,
    search,
    reset
  };
}
