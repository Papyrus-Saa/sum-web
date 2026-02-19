"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { DEFAULT_TRANSLATIONS } from "@/i18n/defaultTranslations";

export default function Home() {
  const { t, ready } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = !mounted || !ready ? DEFAULT_TRANSLATIONS.mainTitle : t('mainTitle');

  return (
    <div className="flex flex-col">
      <main className="flex flex-1 items-center justify-center px-6">
        {content}
      </main>
    </div>
  );
}
