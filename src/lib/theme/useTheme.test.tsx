import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTheme } from '../useTheme';
import { ThemeProvider } from '../ThemeProvider';

describe('useTheme Hook', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it('should provide initial theme state', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBeDefined();
  });

  it('should toggle between light and dark themes', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).not.toBe(initialTheme);
  });

  it('should set specific theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within ThemeProvider');
  });
});
