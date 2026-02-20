"use client";

import Header from "@/components/header/Header";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/i18n/I18nProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <div className="">
            <Header />
            {children}
          </div>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
