"use client";

import { ReactNode, useEffect, useState } from "react";
import i18next from "./config";


if (!i18next.isInitialized) {
  i18next.init({
    resources: i18next.options.resources,
    lng: i18next.options.lng,
    fallbackLng: i18next.options.fallbackLng,
    interpolation: i18next.options.interpolation,
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(i18next.isInitialized);

  useEffect(() => {
    let isMounted = true;

    if (i18next.isInitialized) {
      if (isMounted) {
        setReady(true);
      }
      return;
    }

    const handleInitialized = () => {
      if (isMounted) {
        setReady(true);
      }
    };

    i18next.on("initialized", handleInitialized);

    return () => {
      isMounted = false;
      i18next.off("initialized", handleInitialized);
    };
  }, []);

  return <>{children}</>;
}
