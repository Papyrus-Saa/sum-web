import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  de: {
    translation: {
      language: 'Sprache',
      mainTitle: 'Finde deinen Reifencode in wenigen Sekunden',
      toggleTheme: 'Design ändern',
      welcome: 'Willkommen',
      theme: 'Design',
      // Search
      searchPlaceholder: 'Code (z.B. 100) oder Größe (z.B. 205/55R16)',
      searchInputLabel: 'Reifencode oder -größe suchen',
      searchButton: 'Suchen',
      searching: 'Suche läuft...',
      searchHint: 'Gib einen Reifencode wie "100" oder eine Reifengröße wie "205/55R16" ein',
      // Results
      tireSize: 'Reifengröße',
      tireCode: 'Reifencode',
      code: 'Code',
      normalized: 'Normalisiert',
      original: 'Original',
      variant: 'Variante',
      availableVariants: 'Verfügbare Varianten',
      copyToClipboard: 'In Zwischenablage kopieren',
      copy: 'Kopieren',
      copied: 'Kopiert!',
      // Warnings
      warning_variant_not_found:
        'Die angegebene Variante wurde nicht gefunden, aber hier ist die Basisgröße',
      // Errors
      error_tire_code_not_found: 'Reifencode nicht gefunden',
      error_tire_size_not_found: 'Reifengröße nicht gefunden',
      error_tire_size_already_exists: 'Reifengröße existiert bereits',
      error_tire_variant_not_found: 'Reifenvariante nicht gefunden',
      error_invalid_tire_size_format: 'Ungültiges Reifengrößenformat',
      error_invalid_tire_code_format: 'Ungültiges Reifencode-Format',
      error_missing_required_fields: 'Erforderliche Felder fehlen',
      error_internal_server: 'Interner Serverfehler',
      error_network: 'Netzwerkfehler. Bitte überprüfe deine Internetverbindung.',
      error_unknown: 'Ein unbekannter Fehler ist aufgetreten',
      error_invalid_search_input:
        'Ungültige Eingabe. Bitte gib einen Reifencode (z.B. "100") oder eine Reifengröße (z.B. "205/55R16") ein'
    }
  },
  en: {
    translation: {
      language: 'Language',
      mainTitle: 'Find Your Tire Code in Seconds',
      toggleTheme: 'Toggle Theme',
      welcome: 'Welcome',
      theme: 'Theme',
      // Search
      searchPlaceholder: 'Code (e.g. 100) or size (e.g. 205/55R16)',
      searchInputLabel: 'Search for tire code or size',
      searchButton: 'Search',
      searching: 'Searching...',
      searchHint: 'Enter a tire code like "100" or a tire size like "205/55R16"',
      // Results
      tireSize: 'Tire Size',
      tireCode: 'Tire Code',
      code: 'Code',
      normalized: 'Normalized',
      original: 'Original',
      variant: 'Variant',
      availableVariants: 'Available Variants',
      copyToClipboard: 'Copy to clipboard',
      copy: 'Copy',
      copied: 'Copied!',
      // Warnings
      warning_variant_not_found: 'The specified variant was not found, but here is the base size',
      // Errors
      error_tire_code_not_found: 'Tire code not found',
      error_tire_size_not_found: 'Tire size not found',
      error_tire_size_already_exists: 'Tire size already exists',
      error_tire_variant_not_found: 'Tire variant not found',
      error_invalid_tire_size_format: 'Invalid tire size format',
      error_invalid_tire_code_format: 'Invalid tire code format',
      error_missing_required_fields: 'Missing required fields',
      error_internal_server: 'Internal server error',
      error_network: 'Network error. Please check your connection.',
      error_unknown: 'An unknown error occurred',
      error_invalid_search_input:
        'Invalid input. Please enter a tire code (e.g. "100") or a tire size (e.g. "205/55R16")'
    }
  },
  es: {
    translation: {
      language: 'Idioma',
      mainTitle: 'Encuentra tu código de neumáticos en segundos',
      toggleTheme: 'Cambiar Tema',
      welcome: 'Bienvenido',
      theme: 'Tema',
      // Search
      searchPlaceholder: 'Código (ej. 100) o tamaño (ej. 205/55R16)',
      searchInputLabel: 'Buscar código o tamaño de neumático',
      searchButton: 'Buscar',
      searching: 'Buscando...',
      searchHint: 'Ingresa un código de neumático como "100" o un tamaño como "205/55R16"',
      // Results
      tireSize: 'Tamaño de Neumático',
      tireCode: 'Código de Neumático',
      code: 'Código',
      normalized: 'Normalizado',
      original: 'Original',
      variant: 'Variante',
      availableVariants: 'Variantes Disponibles',
      copyToClipboard: 'Copiar al portapapeles',
      copy: 'Copiar',
      copied: '¡Copiado!',
      // Warnings
      warning_variant_not_found:
        'La variante especificada no se encontró, pero aquí está el tamaño base',
      // Errors
      error_tire_code_not_found: 'Código de neumático no encontrado',
      error_tire_size_not_found: 'Tamaño de neumático no encontrado',
      error_tire_size_already_exists: 'El tamaño de neumático ya existe',
      error_tire_variant_not_found: 'Variante de neumático no encontrada',
      error_invalid_tire_size_format: 'Formato de tamaño de neumático no válido',
      error_invalid_tire_code_format: 'Formato de código de neumático no válido',
      error_missing_required_fields: 'Faltan campos obligatorios',
      error_internal_server: 'Error interno del servidor',
      error_network: 'Error de red. Por favor verifica tu conexión a internet.',
      error_unknown: 'Ocurrió un error desconocido',
      error_invalid_search_input:
        'Entrada no válida. Por favor ingresa un código de neumático (ej. "100") o un tamaño (ej. "205/55R16")'
    }
  }
};

// Initialize synchronously to avoid hydration mismatch
if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources,
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });
}

export default i18next;
