"use client";

import Header from "@/components/header/Header";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/i18n/I18nProvider";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <div className="bg-main-l dark:bg-main-d text-main-d dark:text-main-l min-h-screen">
          <Header />
          {children}
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
