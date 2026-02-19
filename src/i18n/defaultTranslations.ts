
export const DEFAULT_TRANSLATIONS = {
  mainTitle: 'Finde deinen Reifencode in wenigen Sekunden',
  language: 'Sprache',
  toggleTheme: 'Design ändern'
} as const;

export type TranslationKey = keyof typeof DEFAULT_TRANSLATIONS;
