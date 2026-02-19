"use client";

import { useState, useEffect, useCallback } from "react";
import type { Theme } from "./types";
import { applyTheme, getInitialTheme, saveTheme } from "./sync";

export function useThemeState() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    saveTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, mounted };
}
