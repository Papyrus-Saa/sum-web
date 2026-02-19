"use client";

import { useEffect } from "react";

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme on mount
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (storedTheme) {
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Check system preference on first load
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    }
  }, []);

  return <>{children}</>;
}
