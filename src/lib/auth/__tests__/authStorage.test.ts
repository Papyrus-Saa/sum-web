import { authStorage } from '../authStorage';

describe('authStorage', () => {
  // Mock user data for testing
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com'
  };

  const mockAccessToken = 'mock-access-token-jwt';
  const mockRefreshToken = 'mock-refresh-token-jwt';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
    localStorage.clear();
  });

  describe('setAuth', () => {
    it('should store access token, refresh token, and user data', () => {
      authStorage.setAuth(mockAccessToken, mockRefreshToken, mockUser);

      expect(localStorage.getItem('tirecode_access_token')).toBe(mockAccessToken);
      expect(localStorage.getItem('tirecode_refresh_token')).toBe(mockRefreshToken);
      expect(localStorage.getItem('tirecode_user')).toBe(JSON.stringify(mockUser));
    });

    it('should handle JSON serialization correctly', () => {
      const complexUser = {
        id: 'user-456',
        email: 'complex@test.com'
      };

      authStorage.setAuth(mockAccessToken, mockRefreshToken, complexUser);

      const storedUser = localStorage.getItem('tirecode_user');
      expect(storedUser).toBe(JSON.stringify(complexUser));
      expect(JSON.parse(storedUser!)).toEqual(complexUser);
    });

    it('should do nothing when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      // Should not throw
      expect(() => {
        authStorage.setAuth(mockAccessToken, mockRefreshToken, mockUser);
      }).not.toThrow();

      global.window = originalWindow;
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock localStorage.setItem to throw error
      jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });

      // Should not throw, should log error
      authStorage.setAuth(mockAccessToken, mockRefreshToken, mockUser);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save auth data:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getAccessToken', () => {
    it('should return access token when it exists', () => {
      localStorage.setItem('tirecode_access_token', mockAccessToken);

      const token = authStorage.getAccessToken();

      expect(token).toBe(mockAccessToken);
    });

    it('should return null when access token does not exist', () => {
      const token = authStorage.getAccessToken();

      expect(token).toBeNull();
    });

    it('should return null when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const token = authStorage.getAccessToken();

      expect(token).toBeNull();

      global.window = originalWindow;
    });

    it('should return null when localStorage throws error', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      const token = authStorage.getAccessToken();

      expect(token).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return refresh token when it exists', () => {
      localStorage.setItem('tirecode_refresh_token', mockRefreshToken);

      const token = authStorage.getRefreshToken();

      expect(token).toBe(mockRefreshToken);
    });

    it('should return null when refresh token does not exist', () => {
      const token = authStorage.getRefreshToken();

      expect(token).toBeNull();
    });

    it('should return null when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const token = authStorage.getRefreshToken();

      expect(token).toBeNull();

      global.window = originalWindow;
    });

    it('should return null when localStorage throws error', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      const token = authStorage.getRefreshToken();

      expect(token).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return user data when it exists', () => {
      localStorage.setItem('tirecode_user', JSON.stringify(mockUser));

      const user = authStorage.getUser();

      expect(user).toEqual(mockUser);
    });

    it('should return null when user data does not exist', () => {
      const user = authStorage.getUser();

      expect(user).toBeNull();
    });

    it('should return null when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const user = authStorage.getUser();

      expect(user).toBeNull();

      global.window = originalWindow;
    });

    it('should return null when JSON.parse fails', () => {
      localStorage.setItem('tirecode_user', 'invalid-json{');

      const user = authStorage.getUser();

      expect(user).toBeNull();
    });

    it('should return null when localStorage throws error', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      const user = authStorage.getUser();

      expect(user).toBeNull();
    });

    it('should handle empty string in localStorage', () => {
      localStorage.setItem('tirecode_user', '');

      const user = authStorage.getUser();

      expect(user).toBeNull();
    });
  });

  describe('clearAuth', () => {
    it('should remove all auth data from localStorage', () => {
      // Set all auth data
      localStorage.setItem('tirecode_access_token', mockAccessToken);
      localStorage.setItem('tirecode_refresh_token', mockRefreshToken);
      localStorage.setItem('tirecode_user', JSON.stringify(mockUser));

      // Clear auth
      authStorage.clearAuth();

      // Verify all removed
      expect(localStorage.getItem('tirecode_access_token')).toBeNull();
      expect(localStorage.getItem('tirecode_refresh_token')).toBeNull();
      expect(localStorage.getItem('tirecode_user')).toBeNull();
    });

    it('should do nothing when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      // Should not throw
      expect(() => {
        authStorage.clearAuth();
      }).not.toThrow();

      global.window = originalWindow;
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock localStorage.removeItem to throw error
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      // Should not throw, should log error
      authStorage.clearAuth();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to clear auth data:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should not affect other localStorage keys', () => {
      // Set auth data
      localStorage.setItem('tirecode_access_token', mockAccessToken);
      localStorage.setItem('tirecode_user', JSON.stringify(mockUser));

      // Set other unrelated data
      localStorage.setItem('other_app_data', 'should-remain');

      // Clear auth only
      authStorage.clearAuth();

      // Auth data should be gone
      expect(localStorage.getItem('tirecode_access_token')).toBeNull();
      expect(localStorage.getItem('tirecode_user')).toBeNull();

      // Other data should remain
      expect(localStorage.getItem('other_app_data')).toBe('should-remain');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      localStorage.setItem('tirecode_access_token', mockAccessToken);

      const isAuth = authStorage.isAuthenticated();

      expect(isAuth).toBe(true);
    });

    it('should return false when access token does not exist', () => {
      const isAuth = authStorage.isAuthenticated();

      expect(isAuth).toBe(false);
    });

    it('should return false when access token is empty string', () => {
      localStorage.setItem('tirecode_access_token', '');

      const isAuth = authStorage.isAuthenticated();

      expect(isAuth).toBe(false);
    });

    it('should return false when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const isAuth = authStorage.isAuthenticated();

      expect(isAuth).toBe(false);

      global.window = originalWindow;
    });

    it('should return true even when user data is missing (token-based auth)', () => {
      // Only set access token, no user data
      localStorage.setItem('tirecode_access_token', mockAccessToken);

      const isAuth = authStorage.isAuthenticated();

      expect(isAuth).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete login flow', () => {
      // Login: set auth
      authStorage.setAuth(mockAccessToken, mockRefreshToken, mockUser);

      // Check authenticated
      expect(authStorage.isAuthenticated()).toBe(true);

      // Get tokens
      expect(authStorage.getAccessToken()).toBe(mockAccessToken);
      expect(authStorage.getRefreshToken()).toBe(mockRefreshToken);

      // Get user
      expect(authStorage.getUser()).toEqual(mockUser);
    });

    it('should handle complete logout flow', () => {
      // Setup: user is logged in
      authStorage.setAuth(mockAccessToken, mockRefreshToken, mockUser);
      expect(authStorage.isAuthenticated()).toBe(true);

      // Logout: clear auth
      authStorage.clearAuth();

      // Verify logged out
      expect(authStorage.isAuthenticated()).toBe(false);
      expect(authStorage.getAccessToken()).toBeNull();
      expect(authStorage.getRefreshToken()).toBeNull();
      expect(authStorage.getUser()).toBeNull();
    });

    it('should handle token refresh flow', () => {
      // Initial login
      authStorage.setAuth(mockAccessToken, mockRefreshToken, mockUser);

      // Refresh token (update tokens, keep user)
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';
      authStorage.setAuth(newAccessToken, newRefreshToken, mockUser);

      // Verify tokens updated
      expect(authStorage.getAccessToken()).toBe(newAccessToken);
      expect(authStorage.getRefreshToken()).toBe(newRefreshToken);
      expect(authStorage.getUser()).toEqual(mockUser);
      expect(authStorage.isAuthenticated()).toBe(true);
    });
  });
});
