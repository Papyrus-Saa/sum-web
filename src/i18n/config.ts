import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  de: {
    translation: {
      language: 'Sprache',
      mainTitle: 'Finde deinen Reifencode in wenigen Sekunden',
      toggleTheme: 'Design ändern',
      welcome: 'Willkommen',
      theme: 'Design'
    }
  },
  en: {
    translation: {
      language: 'Language',
      mainTitle: 'Find Your Tire Code in Seconds',
      toggleTheme: 'Toggle Theme',
      welcome: 'Welcome',
      theme: 'Theme'
    }
  },
  es: {
    translation: {
      language: 'Idioma',
      mainTitle: 'Encuentra tu código de neumáticos en segundos',
      toggleTheme: 'Cambiar Tema',
      welcome: 'Bienvenido',
      theme: 'Tema'
    }
  }
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;
