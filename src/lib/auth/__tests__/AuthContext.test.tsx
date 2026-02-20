import { render, screen, waitFor, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authStorage } from '../authStorage';

// Mock authStorage
jest.mock('../authStorage');

// Mock fetch globally
global.fetch = jest.fn(
  async () =>
    ({
      ok: true,
      status: 200,
      json: async () => ({})
    }) as Response
);

// Mock data
const mockUser = {
  id: 'user-123',
  email: 'admin@example.com'
};

const mockAuthResponse = {
  accessToken: 'access-token-jwt',
  refreshToken: 'refresh-token-jwt',
  expiresIn: 3600,
  user: mockUser
};

// Test component
function TestComponent() {
  try {
    const auth = useAuth();
    return (
      <div>
        <div data-testid="user">{auth.user?.email || 'not-authenticated'}</div>
        <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
        <div data-testid="isLoading">{auth.isLoading.toString()}</div>
        <button
          data-testid="login-btn"
          onClick={() => auth.login({ email: 'admin@example.com', password: 'password' })}
        >
          Login
        </button>
        <button data-testid="logout-btn" onClick={() => auth.logout()}>
          Logout
        </button>
        <button data-testid="refresh-btn" onClick={() => auth.refreshToken()}>
          Refresh
        </button>
      </div>
    );
  } catch (error) {
    return <div data-testid="error">{(error as Error).message}</div>;
  }
}

async function renderWithProvider(children: ReactNode = <TestComponent />) {
  render(<AuthProvider>{children}</AuthProvider>);

  await waitFor(() => {
    expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
  });
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (global.fetch as jest.Mock).mockClear();

    (authStorage.getUser as jest.Mock).mockReturnValue(null);
    (authStorage.getAccessToken as jest.Mock).mockReturnValue(null);
    (authStorage.getRefreshToken as jest.Mock).mockReturnValue(null);
    (authStorage.setAuth as jest.Mock).mockImplementation(() => {});
    (authStorage.clearAuth as jest.Mock).mockImplementation(() => {});
    (authStorage.isAuthenticated as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('AuthProvider', () => {
    it('should render children', async () => {
      await renderWithProvider(
        <>
          <div data-testid="child">Test Child</div>
          <TestComponent />
        </>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should provide auth context to children', async () => {
      await renderWithProvider();
      expect(screen.getByTestId('user')).toBeInTheDocument();
      expect(screen.getByTestId('isAuthenticated')).toBeInTheDocument();
    });

    it('should initialize with isLoading transitioning to false', async () => {
      await renderWithProvider();
    });

    it('should set user from authStorage on mount', async () => {
      const storedUser = { id: 'stored-user', email: 'stored@example.com' };
      (authStorage.getUser as jest.Mock).mockReturnValue(storedUser);

      await renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('stored@example.com');
      });
    });

    it('should initialize without stored user', async () => {
      (authStorage.getUser as jest.Mock).mockReturnValue(null);

      await renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });
    });
  });

  describe('useAuth hook', () => {
    it('should return auth context object', async () => {
      await renderWithProvider();
      expect(screen.getByTestId('isAuthenticated')).toBeInTheDocument();
      expect(screen.getByTestId('user')).toBeInTheDocument();
    });
  });

  describe('login()', () => {
    it('should login successfully with valid credentials', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAuthResponse
      } as Response);

      await renderWithProvider();

      const loginBtn = screen.getByTestId('login-btn');

      await act(async () => {
        loginBtn.click();
      });

      await waitFor(() => {
        expect(authStorage.setAuth).toHaveBeenCalledWith(
          mockAuthResponse.accessToken,
          mockAuthResponse.refreshToken,
          mockAuthResponse.user
        );
      });

      expect(screen.getByTestId('user')).toHaveTextContent('admin@example.com');
    });

    it('should schedule token refresh after login', async () => {
      jest.useFakeTimers();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAuthResponse
      } as Response);

      await renderWithProvider();

      const loginBtn = screen.getByTestId('login-btn');

      await act(async () => {
        loginBtn.click();
      });

      await waitFor(() => {
        expect(authStorage.setAuth).toHaveBeenCalled();
      });

      const expectedRefreshTime = mockAuthResponse.expiresIn * 0.9 * 1000;
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), expectedRefreshTime);

      setTimeoutSpy.mockRestore();
      jest.useRealTimers();
    });
  });

  describe('logout()', () => {
    it('should logout successfully', async () => {
      (authStorage.getAccessToken as jest.Mock).mockReturnValue('access-token');

      await renderWithProvider();

      const logoutBtn = screen.getByTestId('logout-btn');

      await act(async () => {
        logoutBtn.click();
        await new Promise(resolve => setTimeout(resolve, 200));
      });

      expect(authStorage.clearAuth).toHaveBeenCalled();
    });

    it('should clear auth even if logout endpoint fails', async () => {
      (authStorage.getAccessToken as jest.Mock).mockReturnValue('access-token');
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await renderWithProvider();

      const logoutBtn = screen.getByTestId('logout-btn');

      await act(async () => {
        logoutBtn.click();
      });

      await waitFor(() => {
        expect(authStorage.clearAuth).toHaveBeenCalled();
      });
    });

    it('should call logout endpoint with Bearer token', async () => {
      const accessToken = 'test-access-token';
      (authStorage.getAccessToken as jest.Mock).mockReturnValue(accessToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true } as Response);

      await renderWithProvider();

      const logoutBtn = screen.getByTestId('logout-btn');

      await act(async () => {
        logoutBtn.click();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/admin/auth/logout'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
        );
      });
    });

    it('should not call logout endpoint if no access token', async () => {
      (authStorage.getAccessToken as jest.Mock).mockReturnValue(null);

      await renderWithProvider();

      const logoutBtn = screen.getByTestId('logout-btn');

      await act(async () => {
        logoutBtn.click();
      });

      await waitFor(() => {
        expect(authStorage.clearAuth).toHaveBeenCalled();
      });
    });
  });

  describe('refreshToken()', () => {
    it('should refresh token successfully', async () => {
      const newAccessToken = 'new-access-token';
      const newAuthResponse = {
        ...mockAuthResponse,
        accessToken: newAccessToken
      };

      (authStorage.getRefreshToken as jest.Mock).mockReturnValue(mockAuthResponse.refreshToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => newAuthResponse
      } as Response);

      await renderWithProvider();

      const refreshBtn = screen.getByTestId('refresh-btn');

      await act(async () => {
        refreshBtn.click();
      });

      await waitFor(() => {
        expect(authStorage.setAuth).toHaveBeenCalledWith(
          newAccessToken,
          newAuthResponse.refreshToken,
          mockUser
        );
      });
    });

    it('should return false if no refresh token', async () => {
      (authStorage.getRefreshToken as jest.Mock).mockReturnValue(null);

      await renderWithProvider();

      const refreshBtn = screen.getByTestId('refresh-btn');

      await act(async () => {
        refreshBtn.click();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should clear auth on 401 response', async () => {
      (authStorage.getRefreshToken as jest.Mock).mockReturnValue(mockAuthResponse.refreshToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({})
      } as Response);

      await renderWithProvider();

      const refreshBtn = screen.getByTestId('refresh-btn');

      await act(async () => {
        refreshBtn.click();
      });

      await waitFor(() => {
        expect(authStorage.clearAuth).toHaveBeenCalled();
      });
    });

    it('should not clear auth on network error', async () => {
      (authStorage.getRefreshToken as jest.Mock).mockReturnValue(mockAuthResponse.refreshToken);
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await renderWithProvider();

      const refreshBtn = screen.getByTestId('refresh-btn');

      await act(async () => {
        refreshBtn.click();
      });

      expect(authStorage.clearAuth).not.toHaveBeenCalled();
    });

    it('should schedule next token refresh', async () => {
      jest.useFakeTimers();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      (authStorage.getRefreshToken as jest.Mock).mockReturnValue(mockAuthResponse.refreshToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAuthResponse
      } as Response);

      await renderWithProvider();

      const refreshBtn = screen.getByTestId('refresh-btn');

      await act(async () => {
        refreshBtn.click();
      });

      const expectedRefreshTime = mockAuthResponse.expiresIn * 0.9 * 1000;
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), expectedRefreshTime);

      setTimeoutSpy.mockRestore();
      jest.useRealTimers();
    });
  });

  describe('Token initialization on mount', () => {
    it('should call refreshToken when user is stored', async () => {
      (authStorage.getUser as jest.Mock).mockReturnValue(mockUser);
      (authStorage.getRefreshToken as jest.Mock).mockReturnValue(mockAuthResponse.refreshToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAuthResponse
      } as Response);

      await renderWithProvider();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/admin/auth/refresh'),
          expect.any(Object)
        );
      });
    });

    it('should not call refreshToken when no stored user', async () => {
      (authStorage.getUser as jest.Mock).mockReturnValue(null);

      await renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      expect(global.fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/admin/auth/refresh'),
        expect.any(Object)
      );
    });
  });

  describe('isAuthenticated derived value', () => {
    it('should be true when user exists', async () => {
      (authStorage.getUser as jest.Mock).mockReturnValue(mockUser);

      await renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });
    });

    it('should be false when user is null', async () => {
      (authStorage.getUser as jest.Mock).mockReturnValue(null);

      await renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });
    });
  });

  describe('API endpoints', () => {
    it('should call login endpoint with correct URL', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAuthResponse
      } as Response);

      await renderWithProvider();

      const loginBtn = screen.getByTestId('login-btn');

      await act(async () => {
        loginBtn.click();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/admin/auth/login'),
          expect.any(Object)
        );
      });
    });

    it('should call refresh endpoint with Content-Type header', async () => {
      (authStorage.getRefreshToken as jest.Mock).mockReturnValue(mockAuthResponse.refreshToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockAuthResponse
      } as Response);

      await renderWithProvider();

      const refreshBtn = screen.getByTestId('refresh-btn');

      await act(async () => {
        refreshBtn.click();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/admin/auth/refresh'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        );
      });
    });
  });
});
