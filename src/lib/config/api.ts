/**
 * API Configuration
 * Centralized configuration for API requests
 */

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000, // 10 seconds
  endpoints: {
    // Public lookup
    lookup: '/api/v1/lookup',
    suggestions: '/api/v1/lookup/suggestions',
    // Auth
    login: '/api/v1/admin/auth/login',
    refresh: '/api/v1/admin/auth/refresh',
    logout: '/api/v1/admin/auth/logout',
    // Admin mappings
    mappings: '/api/v1/admin/mappings',
    mappingById: (id: string) => `/api/v1/admin/mappings/${id}`,
    // Admin import
    import: '/api/v1/admin/import',
    importStatus: (jobId: string) => `/api/v1/admin/import/${jobId}`,
    // Admin analytics
    analyticsOverview: '/api/v1/admin/analytics/overview',
    analyticsTopSearches: '/api/v1/admin/analytics/top-searches'
  }
} as const;

/**
 * Tire size pattern regex
 * Matches patterns like: 205/55R16, 205/55r16
 */
export const TIRE_SIZE_PATTERN = /^\d{3}\/\d{2}[rR]\d{2}/;

/**
 * Tire code pattern regex
 * Matches pure numbers (e.g., 100, 205)
 */
export const TIRE_CODE_PATTERN = /^\d+$/;

/**
 * Tire variant pattern regex
 * Matches patterns like: 91V, 94W at the end of string
 * Capture groups: (load_index)(speed_index)
 */
export const TIRE_VARIANT_PATTERN = /\s+(\d{2,3})([A-Z])$/;
