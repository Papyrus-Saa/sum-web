export const DEFAULT_TRANSLATIONS = {
  mainTitle: 'Finde deinen Reifencode in wenigen Sekunden',
  language: 'Sprache',
  toggleTheme: 'Design ändern',
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
} as const;

export type TranslationKey = keyof typeof DEFAULT_TRANSLATIONS;
