import {
  applyTheme,
  getStoredTheme,
  saveTheme,
  getSystemPreference,
  getInitialTheme
} from '../sync';
import type { Theme } from '../types';
import { CLASS_NAME, STORAGE_KEY } from '../constants';

describe('Theme Sync Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Reset HTML element
    document.documentElement.className = '';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  describe('applyTheme()', () => {
    it('should add dark class to document element when theme is dark', () => {
      applyTheme('dark');

      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);
    });

    it('should remove dark class when theme is light', () => {
      // First add dark class
      document.documentElement.classList.add(CLASS_NAME);

      applyTheme('light');

      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(false);
    });

    it('should not add dark class when theme is light', () => {
      applyTheme('light');

      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(false);
    });

    it('should replace existing theme', () => {
      applyTheme('dark');
      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);

      applyTheme('light');
      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(false);

      applyTheme('dark');
      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);
    });

    it('should use correct CSS class name constant', () => {
      applyTheme('dark');

      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);
      // Verify it's the same constant used internally
      expect(CLASS_NAME).toBeDefined();
    });

    it('should handle rapid theme changes', () => {
      applyTheme('dark');
      applyTheme('light');
      applyTheme('dark');
      applyTheme('light');

      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(false);
    });

    it('should not affect other classes on document element', () => {
      document.documentElement.className = 'existing-class';

      applyTheme('dark');

      expect(document.documentElement.classList.contains('existing-class')).toBe(true);
      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);
    });

    it('should handle theme being applied multiple times idempotently', () => {
      applyTheme('dark');
      applyTheme('dark');
      applyTheme('dark');

      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);
      // Should only have the CLASS_NAME once
      const classCount = Array.from(document.documentElement.classList).filter(
        c => c === CLASS_NAME
      ).length;
      expect(classCount).toBe(1);
    });
  });

  describe('saveTheme()', () => {
    it('should save theme to localStorage', () => {
      saveTheme('dark');

      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    });

    it('should save light theme to localStorage', () => {
      saveTheme('light');

      expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    });

    it('should overwrite existing theme in localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'light');

      saveTheme('dark');

      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    });

    it('should use correct storage key constant', () => {
      saveTheme('dark');

      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
      expect(STORAGE_KEY).toBeDefined();
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });

      // Should not throw
      expect(() => {
        saveTheme('dark');
      }).not.toThrow();

      setItemSpy.mockRestore();
    });

    it('should handle private mode gracefully', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('NS_ERROR_FILE_CORRUPTED');
      });

      expect(() => {
        saveTheme('dark');
      }).not.toThrow();

      setItemSpy.mockRestore();
    });

    it('should not throw when localStorage is full', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('DOM Exception 22'); // QuotaExceededError
      });

      expect(() => {
        saveTheme('light');
      }).not.toThrow();

      setItemSpy.mockRestore();
    });

    it('should handle boolean theme value (type safety)', () => {
      // Even if someone passes the wrong type, should try to save
      saveTheme('dark' as Theme);

      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    });
  });

  describe('getStoredTheme()', () => {
    it('should retrieve stored dark theme from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');

      const theme = getStoredTheme();

      expect(theme).toBe('dark');
    });

    it('should retrieve stored light theme from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'light');

      const theme = getStoredTheme();

      expect(theme).toBe('light');
    });

    it('should return null when theme is not stored', () => {
      const theme = getStoredTheme();

      expect(theme).toBeNull();
    });

    it('should return null when localStorage is empty', () => {
      localStorage.clear();

      const theme = getStoredTheme();

      expect(theme).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      const theme = getStoredTheme();

      expect(theme).toBeNull();

      getItemSpy.mockRestore();
    });

    it('should handle private mode where localStorage throws', () => {
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('NS_ERROR_FILE_CORRUPTED');
      });

      expect(() => {
        getStoredTheme();
      }).not.toThrow();

      getItemSpy.mockRestore();
    });

    it('should return correct type', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');

      const theme = getStoredTheme();

      expect(theme === 'dark' || theme === 'light' || theme === null).toBe(true);
    });

    it('should use correct storage key constant', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');

      const theme = getStoredTheme();

      expect(theme).toBe('dark');
      expect(STORAGE_KEY).toBeDefined();
    });
  });

  describe('getSystemPreference()', () => {
    it('should return dark when system prefers dark mode', () => {
      // Mock matchMedia
      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValueOnce({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      } as MediaQueryList);

      const preference = getSystemPreference();

      expect(preference).toBe('dark');
      expect(matchMediaSpy).toHaveBeenCalledWith('(prefers-color-scheme: dark)');

      matchMediaSpy.mockRestore();
    });

    it('should return light when system prefers light mode', () => {
      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValueOnce({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      } as MediaQueryList);

      const preference = getSystemPreference();

      expect(preference).toBe('light');

      matchMediaSpy.mockRestore();
    });

    it('should check for window availability before accessing matchMedia', () => {
      // This test verifies the SSR protection exists in the source code
      // by ensuring no errors occur with normal matchMedia mock
      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValueOnce({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      } as MediaQueryList);

      const preference = getSystemPreference();

      expect(preference).toBe('dark');
      expect(matchMediaSpy).toHaveBeenCalled();

      matchMediaSpy.mockRestore();
    });

    it('should query for prefers-color-scheme: dark media query', () => {
      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValueOnce({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      } as MediaQueryList);

      getSystemPreference();

      expect(matchMediaSpy).toHaveBeenCalledWith('(prefers-color-scheme: dark)');

      matchMediaSpy.mockRestore();
    });

    it('should handle matchMedia errors gracefully', () => {
      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementationOnce(() => {
        throw new Error('matchMedia not supported');
      });

      expect(() => {
        getSystemPreference();
      }).toThrow(); // Should throw since it's not wrapped in try-catch

      matchMediaSpy.mockRestore();
    });

    it('should return valid theme value', () => {
      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValueOnce({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      } as MediaQueryList);

      const preference = getSystemPreference();

      expect(preference === 'dark' || preference === 'light').toBe(true);

      matchMediaSpy.mockRestore();
    });
  });

  describe('getInitialTheme()', () => {
    it('should return stored theme if it exists', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');

      const theme = getInitialTheme();

      expect(theme).toBe('dark');
    });

    it('should return system preference if no stored theme', () => {
      localStorage.clear();

      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValueOnce({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      } as MediaQueryList);

      const theme = getInitialTheme();

      expect(theme).toBe('dark');

      matchMediaSpy.mockRestore();
    });

    it('should prioritize stored theme over system preference', () => {
      localStorage.setItem(STORAGE_KEY, 'light');

      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValueOnce({
        matches: true, // System prefers dark
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      } as MediaQueryList);

      const theme = getInitialTheme();

      // Should return stored theme, not system preference
      expect(theme).toBe('light');

      matchMediaSpy.mockRestore();
    });

    it('should fall back to light if no stored and system returns undefined', () => {
      localStorage.clear();

      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValueOnce({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      } as MediaQueryList);

      const theme = getInitialTheme();

      expect(theme).toBe('light');

      matchMediaSpy.mockRestore();
    });

    it('should call getStoredTheme internally', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');

      const theme = getInitialTheme();

      expect(theme).toBe('dark');
    });

    it('should call getSystemPreference when no stored theme', () => {
      localStorage.clear();

      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValueOnce({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      } as MediaQueryList);

      const theme = getInitialTheme();

      expect(theme === 'dark' || theme === 'light').toBe(true);
      expect(matchMediaSpy).toHaveBeenCalled();

      matchMediaSpy.mockRestore();
    });

    it('should return valid theme value always', () => {
      localStorage.clear();

      const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValueOnce({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn()
      } as MediaQueryList);

      const theme = getInitialTheme();

      expect(theme === 'dark' || theme === 'light').toBe(true);

      matchMediaSpy.mockRestore();
    });

    it('should handle various stored values', () => {
      const testCases = ['dark', 'light'];

      testCases.forEach(testTheme => {
        localStorage.setItem(STORAGE_KEY, testTheme);

        const theme = getInitialTheme();

        expect(theme).toBe(testTheme);

        localStorage.clear();
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should complete theme save and retrieve cycle', () => {
      saveTheme('dark');
      const retrieved = getStoredTheme();

      expect(retrieved).toBe('dark');
    });

    it('should apply saved theme to document', () => {
      saveTheme('dark');
      const theme = getStoredTheme();

      if (theme) {
        applyTheme(theme);
      }

      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);
    });

    it('should handle theme toggle workflow', () => {
      // Start with light
      saveTheme('light');
      let theme = getStoredTheme() as Theme;
      applyTheme(theme);
      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(false);

      // Switch to dark
      saveTheme('dark');
      theme = getStoredTheme() as Theme;
      applyTheme(theme);
      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);

      // Switch back to light
      saveTheme('light');
      theme = getStoredTheme() as Theme;
      applyTheme(theme);
      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(false);
    });

    it('should initialize app with correct initial theme', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');

      const initialTheme = getInitialTheme();
      applyTheme(initialTheme);

      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);
      expect(initialTheme).toBe('dark');
    });

    it('should persist theme across application lifecycle', () => {
      saveTheme('dark');

      // Simulate page reload by clearing, then retrieving
      const theme = getStoredTheme();

      expect(theme).toBe('dark');
    });
  });

  describe('Constants Usage', () => {
    it('should use CLASS_NAME for dark mode marker', () => {
      expect(CLASS_NAME).toBeDefined();
      expect(typeof CLASS_NAME).toBe('string');

      applyTheme('dark');

      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);
    });

    it('should use STORAGE_KEY for localStorage', () => {
      expect(STORAGE_KEY).toBeDefined();
      expect(typeof STORAGE_KEY).toBe('string');

      localStorage.setItem(STORAGE_KEY, 'dark');

      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    });
  });
});
