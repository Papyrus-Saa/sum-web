import { useState, useCallback, useRef, useEffect } from 'react';
import { API_CONFIG } from '@/lib/config/api';
import { authStorage } from '@/lib/auth/authStorage';
import type { MappingResponse, CreateMappingRequest, UpdateMappingRequest } from '@/types/api';

const { baseUrl, endpoints } = API_CONFIG;

export function useMappings() {
  const [mappings, setMappings] = useState<MappingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    setIsLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const token = authStorage.getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${baseUrl}${endpoints.mappings}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch mappings: ${response.status}`);
      }

      const data: MappingResponse[] = await response.json();
      setMappings(data);
    } catch (err) {
      // Ignore abort errors (user initiated)
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const message = err instanceof Error ? err.message : 'Failed to fetch mappings';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMapping = useCallback(
    async (
      data: CreateMappingRequest
    ): Promise<{ success: boolean; error?: string; message?: string }> => {
      setError(null);
      const controller = new AbortController();
      try {
        const token = authStorage.getAccessToken();
        if (!token) {
          throw new Error('No access token found');
        }
        const response = await fetch(`${baseUrl}${endpoints.mappings}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
          signal: controller.signal
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          return {
            success: false,
            error: errorData?.error?.message || `Failed to create mapping: ${response.status}`
          };
        }
        const newMapping: MappingResponse = await response.json();
        setMappings(prev => [newMapping, ...prev]);
        return { success: true, message: 'Mapping created successfully' };
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return { success: false, error: 'Aborted' };
        }
        const message = err instanceof Error ? err.message : 'Failed to create mapping';
        setError(message);
        return { success: false, error: message };
      }
    },
    []
  );

  const updateMapping = useCallback(
    async (
      id: string,
      data: UpdateMappingRequest
    ): Promise<{ success: boolean; error?: string; message?: string }> => {
      setError(null);
      const controller = new AbortController();
      try {
        const token = authStorage.getAccessToken();
        if (!token) {
          throw new Error('No access token found');
        }
        const response = await fetch(`${baseUrl}${endpoints.mappingById(id)}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
          signal: controller.signal
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          return {
            success: false,
            error: errorData?.error?.message || `Failed to update mapping: ${response.status}`
          };
        }
        const updatedMapping: MappingResponse = await response.json();
        setMappings(prev => prev.map(m => (m.id === id ? updatedMapping : m)));
        return { success: true, message: 'Mapping updated successfully' };
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return { success: false, error: 'Aborted' };
        }
        const message = err instanceof Error ? err.message : 'Failed to update mapping';
        setError(message);
        return { success: false, error: message };
      }
    },
    []
  );

  const deleteMapping = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string; message?: string }> => {
      setError(null);
      const controller = new AbortController();
      try {
        const token = authStorage.getAccessToken();
        if (!token) {
          throw new Error('No access token found');
        }
        const response = await fetch(`${baseUrl}${endpoints.mappingById(id)}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          return {
            success: false,
            error: errorData?.error?.message || `Failed to delete mapping: ${response.status}`
          };
        }
        setMappings(prev => prev.filter(m => m.id !== id));
        return { success: true, message: 'Mapping deleted successfully' };
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return { success: false, error: 'Aborted' };
        }
        const message = err instanceof Error ? err.message : 'Failed to delete mapping';
        setError(message);
        return { success: false, error: message };
      }
    },
    []
  );

  return {
    mappings,
    isLoading,
    error,
    fetchMappings,
    createMapping,
    updateMapping,
    deleteMapping
  };
}
