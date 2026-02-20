'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode
} from 'react';
import type { AuthResponse, LoginRequest } from '@/types/api';
import { authStorage } from './authStorage';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Refresh access token using refresh token
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const refreshTokenValue = authStorage.getRefreshToken();

    if (!refreshTokenValue) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue })
      });

      if (!response.ok) {
        // Token expired or invalid - clear auth
        if (response.status === 401 || response.status === 403) {
          authStorage.clearAuth();
          setUser(null);
        }
        return false;
      }

      const data: AuthResponse = await response.json();
      authStorage.setAuth(data.accessToken, data.refreshToken, data.user);
      setUser(data.user);

      // Schedule next refresh before token expires (90% of expiresIn)
      const refreshTime = data.expiresIn * 0.9 * 1000;
      refreshTimeoutRef.current = setTimeout(() => {
        refreshToken();
      }, refreshTime);

      return true;
    } catch (error) {
      // Network error or other issue - don't clear auth yet
      // Only clear on explicit auth failure (401/403)
      if (error instanceof Error && error.name !== 'AbortError') {
        // Network errors: keep auth, user might be offline temporarily
        return false;
      }
      return false;
    }
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // Specific error messages based on status code
          if (response.status === 401) {
            throw new Error(errorData.error?.message || 'Invalid credentials');
          }
          if (response.status === 429) {
            throw new Error('Too many login attempts. Please try again later');
          }
          if (response.status >= 500) {
            throw new Error('Server error. Please try again later');
          }

          throw new Error(errorData.error?.message || 'Login failed');
        }

        const data: AuthResponse = await response.json();
        authStorage.setAuth(data.accessToken, data.refreshToken, data.user);
        setUser(data.user);

        // Schedule token refresh
        const refreshTime = data.expiresIn * 0.9 * 1000;
        refreshTimeoutRef.current = setTimeout(() => {
          refreshToken();
        }, refreshTime);
      } catch (error) {
        // Network errors (backend not running, CORS, etc.)
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error(
            `Cannot connect to server at ${API_BASE_URL}. Please check if the backend is running.`
          );
        }
        throw error;
      }
    },
    [refreshToken]
  );

  /**
   * Logout and clear tokens
   */
  const logout = useCallback(async () => {
    const accessToken = authStorage.getAccessToken();

    try {
      // Clear refresh timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }

      if (accessToken) {
        // Call logout endpoint (fire and forget)
        fetch(`${API_BASE_URL}/api/v1/admin/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).catch(() => {
          // Ignore errors on logout
        });
      }
    } finally {
      // Always clear local auth data
      authStorage.clearAuth();
      setUser(null);
    }
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authStorage.getUser();

      if (storedUser) {
        setUser(storedUser);
        // Try to refresh token on mount
        await refreshToken();
      }

      setIsLoading(false);
    };

    initAuth();
  }, [refreshToken]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
