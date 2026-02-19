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
        <div className="">
          <Header />
          {children}
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
