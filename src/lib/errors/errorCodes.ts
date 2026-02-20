/**
 * Error codes returned by the backend API
 * These match the ErrorCode enum in the backend
 */
export enum ErrorCode {
  // Tire codes
  TIRE_CODE_NOT_FOUND = 'TIRE_CODE_NOT_FOUND',
  TIRE_SIZE_NOT_FOUND = 'TIRE_SIZE_NOT_FOUND',
  TIRE_SIZE_ALREADY_EXISTS = 'TIRE_SIZE_ALREADY_EXISTS',
  TIRE_VARIANT_NOT_FOUND = 'TIRE_VARIANT_NOT_FOUND',

  // Validation
  INVALID_TIRE_SIZE_FORMAT = 'INVALID_TIRE_SIZE_FORMAT',
  INVALID_TIRE_CODE_FORMAT = 'INVALID_TIRE_CODE_FORMAT',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS',

  // General
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * User-friendly error message translation keys
 * These keys should exist in i18n translations
 */
export const ERROR_MESSAGE_KEYS: Record<ErrorCode, string> = {
  [ErrorCode.TIRE_CODE_NOT_FOUND]: 'error_tire_code_not_found',
  [ErrorCode.TIRE_SIZE_NOT_FOUND]: 'error_tire_size_not_found',
  [ErrorCode.TIRE_SIZE_ALREADY_EXISTS]: 'error_tire_size_already_exists',
  [ErrorCode.TIRE_VARIANT_NOT_FOUND]: 'error_tire_variant_not_found',
  [ErrorCode.INVALID_TIRE_SIZE_FORMAT]: 'error_invalid_tire_size_format',
  [ErrorCode.INVALID_TIRE_CODE_FORMAT]: 'error_invalid_tire_code_format',
  [ErrorCode.MISSING_REQUIRED_FIELDS]: 'error_missing_required_fields',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'error_internal_server',
  [ErrorCode.NETWORK_ERROR]: 'error_network',
  [ErrorCode.UNKNOWN_ERROR]: 'error_unknown'
};
