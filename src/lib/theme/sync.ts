import type { Theme } from "./types";
import { CLASS_NAME, STORAGE_KEY } from "./constants";

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add(CLASS_NAME);
  } else {
    root.classList.remove(CLASS_NAME);
  }
}

export function getStoredTheme(): Theme | null {
  try {
    return localStorage.getItem(STORAGE_KEY) as Theme | null;
  } catch {
    return null;
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Handle storage full or private mode
  }
}

export function getSystemPreference(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getInitialTheme(): Theme {
  const stored = getStoredTheme();
  if (stored) {
    return stored;
  }

  return getSystemPreference();
}
