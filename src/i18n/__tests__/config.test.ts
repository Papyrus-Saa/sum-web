import i18next from '../config';
import { AVAILABLE_LANGUAGES } from '../languages';

describe('i18n config', () => {
  describe('Initialization', () => {
    it('should initialize with default language DE', () => {
      expect(i18next.language).toBe('de');
    });

    it('should have all available languages configured', () => {
      const languages = AVAILABLE_LANGUAGES.map((l) => l.code);
      languages.forEach((lang) => {
        expect(i18next.hasResourceBundle(lang, 'translation')).toBe(true);
      });
    });

    it('should have fallback language set to DE', () => {
      const fallbackLng = i18next.options.fallbackLng;
      // fallbackLng can be string or array
      const fallback = Array.isArray(fallbackLng) ? fallbackLng[0] : fallbackLng;
      expect(fallback).toBe('de');
    });
  });

  describe('Translation keys', () => {
    it('should have all required translation keys for German', () => {
      const deTranslations = i18next.getResourceBundle('de', 'translation');
      const requiredKeys = [
        'language',
        'mainTitle',
        'toggleTheme',
      ];

      requiredKeys.forEach((key) => {
        expect(deTranslations).toHaveProperty(key);
        expect(deTranslations[key]).toBeTruthy();
      });
    });

    it('should have consistent keys across all languages', () => {
      const languages = AVAILABLE_LANGUAGES.map((l) => l.code);
      const deKeys = Object.keys(
        i18next.getResourceBundle('de', 'translation')
      ).sort();

      languages.forEach((lang) => {
        if (lang !== 'de') {
          const langKeys = Object.keys(
            i18next.getResourceBundle(lang, 'translation')
          ).sort();
          expect(langKeys).toEqual(deKeys);
        }
      });
    });
  });

  describe('Language switching', () => {
    it('should change language correctly', async () => {
      await i18next.changeLanguage('en');
      expect(i18next.language).toBe('en');

      await i18next.changeLanguage('es');
      expect(i18next.language).toBe('es');

      // Reset to default
      await i18next.changeLanguage('de');
    });

    it('should translate keys correctly', async () => {
      await i18next.changeLanguage('en');
      expect(i18next.t('language')).toBe('Language');

      await i18next.changeLanguage('es');
      expect(i18next.t('language')).toBe('Idioma');

      await i18next.changeLanguage('de');
      expect(i18next.t('language')).toBe('Sprache');
    });
  });

  describe('Interpolation', () => {
    it('should have escapeValue disabled', () => {
      expect(i18next.options.interpolation?.escapeValue).toBe(false);
    });
  });
});
