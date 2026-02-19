export const AVAILABLE_LANGUAGES = [
  { code: 'de', label: 'DE', nativeName: 'Deutsch' },
  { code: 'en', label: 'EN', nativeName: 'English' },
  { code: 'es', label: 'ES', nativeName: 'Español' }
] as const;

export type LanguageCode = (typeof AVAILABLE_LANGUAGES)[number]['code'];
