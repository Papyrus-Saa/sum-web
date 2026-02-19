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

  const title = !mounted || !ready ? DEFAULT_TRANSLATIONS.mainTitle : t('mainTitle');

  return (
    <div className="">
      <main className="flex flex-col items-center justify-center">
        <h1 className="font-semibold text-center px-1 sm:text-xl md:text-2xl lg:text-3xl lg:max-w-2xl">
          {title}
        </h1>
      </main>
    </div>
  );
}
