"use client";

import { ReactNode } from "react";
import { ThemeContext } from "./context";
import { useThemeState } from "./useThemeState";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setTheme, toggleTheme } = useThemeState();

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
