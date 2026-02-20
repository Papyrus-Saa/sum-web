/**
 * Auth Storage - Token Management
 * Handles secure storage and retrieval of authentication tokens
 */

const ACCESS_TOKEN_KEY = 'tirecode_access_token';
const REFRESH_TOKEN_KEY = 'tirecode_refresh_token';
const USER_KEY = 'tirecode_user';

export const authStorage = {
  /**
   * Save authentication data to localStorage
   */
  setAuth(accessToken: string, refreshToken: string, user: { id: string; email: string }) {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      // Silent fail - localStorage might be disabled
      console.error('Failed to save auth data:', error);
    }
  },

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Get user data
   */
  getUser(): { id: string; email: string } | null {
    if (typeof window === 'undefined') return null;

    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear all auth data
   */
  clearAuth() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
};
