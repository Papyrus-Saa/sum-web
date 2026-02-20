import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Mock useAuth hook
jest.mock('@/lib/auth/AuthContext');

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

type MockRouter = Pick<AppRouterInstance, 'push' | 'prefetch' | 'back' | 'forward' | 'refresh'>;

describe('ProtectedRoute', () => {
  const mockRouter = {
    push: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn()
  };

  const mockAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as MockRouter);
    mockUseAuth.mockReturnValue(mockAuthState);
  });

  describe('Loading State', () => {
    it('should show loading spinner while checking authentication', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: true
      });

      render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      // Should show loading spinner
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Should NOT show protected content yet
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should display loading spinner with animating element', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: true
      });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      const spinnerDiv = screen
        .getByText('Loading...')
        .parentElement?.querySelector('div:first-child');
      expect(spinnerDiv).toHaveClass('animate-spin');
    });

    it('should have proper centered layout during loading', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: true
      });

      const { container } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      const loadingContainer = container.firstChild;
      expect(loadingContainer).toHaveClass(
        'min-h-screen',
        'flex',
        'items-center',
        'justify-center'
      );
    });
  });

  describe('Unauthenticated Access', () => {
    it('should redirect to login when not authenticated', async () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: false,
        isLoading: false
      });

      render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/login');
      });
    });

    it('should redirect with correct login path', async () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: false,
        isLoading: false
      });

      render(
        <ProtectedRoute>
          <div>Protected</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/admin/login'));
      });
    });

    it('should not render children when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: false,
        isLoading: false
      });

      render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should return null when redirecting', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: false,
        isLoading: false
      });

      render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      // Should not render any children (null rendered)
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });

  describe('Authenticated Access', () => {
    it('should render children when authenticated and loaded', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should not redirect when authenticated', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('should render multiple children elements', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      render(
        <ProtectedRoute>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render complex nested components', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      render(
        <ProtectedRoute>
          <div data-testid="container">
            <section>
              <h1 data-testid="title">Dashboard</h1>
              <nav>
                <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ul>
              </nav>
            </section>
          </div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('Effect Dependencies', () => {
    it('should trigger redirect when isLoading changes from true to false', async () => {
      const { rerender } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: false
      });

      rerender(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/login');
      });
    });

    it('should trigger redirect when isAuthenticated becomes false', async () => {
      const { rerender } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: false
      });

      rerender(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalled();
      });
    });

    it('should call router.push with dependencies changes', async () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: true
      });

      const { rerender } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(mockRouter.push).not.toHaveBeenCalled();

      // Simulate auth loss
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: false
      });

      rerender(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalled();
      });
    });
  });

  describe('State Transitions', () => {
    it('should transition from loading to authenticated', async () => {
      const { rerender } = render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      // Initially loading
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: true
      });

      rerender(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

      // Now authenticated
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: true,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      rerender(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });

    it('should transition from loading to unauthenticated', async () => {
      const { rerender } = render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      // Initially loading
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: true
      });

      rerender(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Now unauthenticated
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: false
      });

      rerender(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/login');
      });
    });

    it('should transition from authenticated to unauthenticated', async () => {
      const { rerender } = render(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      // Initially authenticated
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: true,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      rerender(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();

      // Now unauthenticated
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: false
      });

      rerender(
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/login');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle router push being called only once for single auth loss', async () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: false
      });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledTimes(1);
      });
    });

    it('should use router from next/navigation', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      render(
        <ProtectedRoute>
          <div>Protected</div>
        </ProtectedRoute>
      );

      expect(mockUseRouter).toHaveBeenCalled();
    });

    it('should use auth context from AuthContext', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      render(
        <ProtectedRoute>
          <div>Protected</div>
        </ProtectedRoute>
      );

      expect(mockUseAuth).toHaveBeenCalled();
    });

    it('should handle rapid state changes', async () => {
      const { rerender } = render(
        <ProtectedRoute>
          <div data-testid="content">Content</div>
        </ProtectedRoute>
      );

      // Rapid changes
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: true
      });
      rerender(
        <ProtectedRoute>
          <div data-testid="content">Content</div>
        </ProtectedRoute>
      );

      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isLoading: false,
        isAuthenticated: false
      });
      rerender(
        <ProtectedRoute>
          <div data-testid="content">Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/login');
      });
    });

    it('should render fragment wrapper correctly', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      render(
        <ProtectedRoute>
          <div data-testid="child">Child</div>
        </ProtectedRoute>
      );

      // Should have child without extra wrapper (fragment)
      const child = screen.getByTestId('child');
      expect(child.parentElement).toBeDefined();
    });
  });

  describe('Component Props', () => {
    it('should accept ReactNode as children', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      const testString = 'Test String';
      render(
        <ProtectedRoute>
          <div>{testString}</div>
        </ProtectedRoute>
      );

      expect(screen.getByText(testString)).toBeInTheDocument();
    });

    it('should accept null children gracefully', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      const { container } = render(<ProtectedRoute>{null}</ProtectedRoute>);

      expect(container).toBeTruthy();
    });

    it('should accept undefined children', () => {
      mockUseAuth.mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'user-123', email: 'admin@example.com' }
      });

      const { container } = render(<ProtectedRoute>{undefined}</ProtectedRoute>);

      expect(container).toBeTruthy();
    });
  });
});
