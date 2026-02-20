// API Types for TireCode Backend

// ===== Lookup =====
export type TireVariant = {
  loadIndex: number | null;
  speedIndex: string | null;
};

export type LookupResponse = {
  code: string;
  sizeNormalized: string;
  sizeRaw: string;
  variant?: { loadIndex: number; speedIndex: string };
  variants?: TireVariant[];
  warning?: string;
};

export type LookupSuggestionsResponse = Array<{
  sizeNormalized: string;
  searchCount: number;
}>;

// ===== Auth =====
export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  user: {
    id: string;
    email: string;
  };
};

export type LogoutResponse = {
  success: true;
};

// ===== Admin Mappings =====
export type CreateMappingRequest = {
  sizeRaw: string;
  loadIndex?: number;
  speedIndex?: string;
};

export type UpdateMappingRequest = {
  sizeRaw?: string;
  loadIndex?: number;
  speedIndex?: string;
};

export type MappingResponse = {
  id: string;
  codePublic: string;
  sizeRaw: string;
  sizeNormalized: string;
};

// ===== CSV Import =====
export type CsvImportResponse = {
  jobId: string;
  message: string;
  rowCount: number;
};

export type ImportJobStatusResponse = {
  id: string;
  state: string;
  progress?: {
    current: number;
    total: number;
  };
  result?: {
    processed: number;
    errors: string[];
  };
};

// ===== Analytics =====
export type AnalyticsOverviewResponse = {
  totalSearches: number;
  successfulSearches: number;
  failedSearches: number;
  successRate: string;
  searchesByType: Array<{ type: string; count: number }>;
  recentSearches: Array<{
    query: string;
    queryType: string;
    resultFound: boolean;
    createdAt: string;
  }>;
};

export type TopSearchesResponse = Array<{
  query: string;
  queryType: string;
  resultFound: boolean;
  count: number;
}>;

// ===== API Error =====
export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
};
