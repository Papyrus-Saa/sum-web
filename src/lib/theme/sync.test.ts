import { describe, it, expect, beforeEach, vi } from 'vitest';
import { applyTheme, getStoredTheme, saveTheme, getSystemPreference } from '../sync';
import { STORAGE_KEY, CLASS_NAME } from '../constants';

describe('Theme Sync Utils', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove(CLASS_NAME);
  });

  describe('applyTheme', () => {
    it('should add dark class when theme is dark', () => {
      applyTheme('dark');
      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(true);
    });

    it('should remove dark class when theme is light', () => {
      document.documentElement.classList.add(CLASS_NAME);
      applyTheme('light');
      expect(document.documentElement.classList.contains(CLASS_NAME)).toBe(false);
    });
  });

  describe('getStoredTheme', () => {
    it('should return stored theme from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('should return null if no theme is stored', () => {
      expect(getStoredTheme()).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      expect(getStoredTheme()).toBeNull();
    });
  });

  describe('saveTheme', () => {
    it('should save theme to localStorage', () => {
      saveTheme('dark');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    });

    it('should handle localStorage errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      expect(() => saveTheme('dark')).not.toThrow();
    });
  });

  describe('getSystemPreference', () => {
    it('should return dark if system prefers dark mode', () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
      } as MediaQueryList);
      expect(getSystemPreference()).toBe('dark');
    });

    it('should return light if system prefers light mode', () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: false,
      } as MediaQueryList);
      expect(getSystemPreference()).toBe('light');
    });
  });
});
