export const THEME_VALUES = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export type Theme = typeof THEME_VALUES[keyof typeof THEME_VALUES];

export const STORAGE_KEY = "theme-preference";
export const CLASS_NAME = "dark";
export const DEFAULT_THEME: Theme = THEME_VALUES.LIGHT;
