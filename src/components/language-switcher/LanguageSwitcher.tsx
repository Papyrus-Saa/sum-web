"use client";

import { Languages } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AVAILABLE_LANGUAGES } from "@/i18n/languages";

interface LanguageSwitcherProps {
  label?: string;
}

const LanguageSwitcher = ({ label }: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (locale: string) => {
    i18n.changeLanguage(locale);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm hover:bg-hover-l dark:hover:bg-hover-d rounded py-1 md:py-2 sm:px-3 cursor-pointer w-max"
        aria-label={t('language')}
        title={t('language')}
        role="button"
        data-testid="language-switcher"
      >
        <div className="px-3 sm:px-0">
          <Languages size={15} />
        </div>
        <span className="hidden sm:block">{t('language')}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-primary md:bg-primary/10 border border-primary/20 rounded z-50">
          {AVAILABLE_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="w-full text-left px-4 py-2 cursor-pointer hover:bg-primary/20 text-sm"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
