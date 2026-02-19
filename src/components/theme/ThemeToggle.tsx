"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useTranslation } from "react-i18next";
import IconComponent from "../ui/icons/IconComponent";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`${t('toggleTheme')}`}
      className="p-2 cursor-pointer"
      title={t('toggleTheme')}
    >
      {theme === "light" ? <IconComponent icon={<Moon size={15} />} /> : <IconComponent icon={<Sun size={15} />} />}
    </button>
  );
}
