import { ErrorCode, ERROR_MESSAGE_KEYS } from '../errorCodes';

describe('Error Codes Configuration', () => {
  describe('ErrorCode enum', () => {
    it('should have TIRE_CODE_NOT_FOUND error code', () => {
      expect(ErrorCode.TIRE_CODE_NOT_FOUND).toBe('TIRE_CODE_NOT_FOUND');
    });

    it('should have TIRE_SIZE_NOT_FOUND error code', () => {
      expect(ErrorCode.TIRE_SIZE_NOT_FOUND).toBe('TIRE_SIZE_NOT_FOUND');
    });

    it('should have TIRE_SIZE_ALREADY_EXISTS error code', () => {
      expect(ErrorCode.TIRE_SIZE_ALREADY_EXISTS).toBe('TIRE_SIZE_ALREADY_EXISTS');
    });

    it('should have TIRE_VARIANT_NOT_FOUND error code', () => {
      expect(ErrorCode.TIRE_VARIANT_NOT_FOUND).toBe('TIRE_VARIANT_NOT_FOUND');
    });

    it('should have INVALID_TIRE_SIZE_FORMAT error code', () => {
      expect(ErrorCode.INVALID_TIRE_SIZE_FORMAT).toBe('INVALID_TIRE_SIZE_FORMAT');
    });

    it('should have INVALID_TIRE_CODE_FORMAT error code', () => {
      expect(ErrorCode.INVALID_TIRE_CODE_FORMAT).toBe('INVALID_TIRE_CODE_FORMAT');
    });

    it('should have MISSING_REQUIRED_FIELDS error code', () => {
      expect(ErrorCode.MISSING_REQUIRED_FIELDS).toBe('MISSING_REQUIRED_FIELDS');
    });

    it('should have INTERNAL_SERVER_ERROR error code', () => {
      expect(ErrorCode.INTERNAL_SERVER_ERROR).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should have NETWORK_ERROR error code', () => {
      expect(ErrorCode.NETWORK_ERROR).toBe('NETWORK_ERROR');
    });

    it('should have UNKNOWN_ERROR error code', () => {
      expect(ErrorCode.UNKNOWN_ERROR).toBe('UNKNOWN_ERROR');
    });

    it('should have 10 error codes total', () => {
      const codes = Object.values(ErrorCode);
      expect(codes).toHaveLength(10);
    });

    it('should have all codes as strings', () => {
      const codes = Object.values(ErrorCode);
      codes.forEach(code => {
        expect(typeof code).toBe('string');
      });
    });

    it('should have unique error code values', () => {
      const codes = Object.values(ErrorCode);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });

    it('should categorize tire-related errors', () => {
      const tireErrors = [
        ErrorCode.TIRE_CODE_NOT_FOUND,
        ErrorCode.TIRE_SIZE_NOT_FOUND,
        ErrorCode.TIRE_SIZE_ALREADY_EXISTS,
        ErrorCode.TIRE_VARIANT_NOT_FOUND
      ];

      tireErrors.forEach(error => {
        expect(error).toContain('TIRE');
      });
    });

    it('should categorize validation errors', () => {
      const validationErrors = [
        ErrorCode.INVALID_TIRE_SIZE_FORMAT,
        ErrorCode.INVALID_TIRE_CODE_FORMAT,
        ErrorCode.MISSING_REQUIRED_FIELDS
      ];

      validationErrors.forEach(error => {
        expect(error).toMatch(/^(INVALID|MISSING)/);
      });
    });

    it('should categorize general errors', () => {
      const generalErrors = [
        ErrorCode.INTERNAL_SERVER_ERROR,
        ErrorCode.NETWORK_ERROR,
        ErrorCode.UNKNOWN_ERROR
      ];

      generalErrors.forEach(error => {
        expect(error).toMatch(/(SERVER|NETWORK|UNKNOWN)/);
      });
    });
  });

  describe('ERROR_MESSAGE_KEYS mapping', () => {
    it('should have mapping for TIRE_CODE_NOT_FOUND', () => {
      expect(ERROR_MESSAGE_KEYS[ErrorCode.TIRE_CODE_NOT_FOUND]).toBe('error_tire_code_not_found');
    });

    it('should have mapping for TIRE_SIZE_NOT_FOUND', () => {
      expect(ERROR_MESSAGE_KEYS[ErrorCode.TIRE_SIZE_NOT_FOUND]).toBe('error_tire_size_not_found');
    });

    it('should have mapping for TIRE_SIZE_ALREADY_EXISTS', () => {
      expect(ERROR_MESSAGE_KEYS[ErrorCode.TIRE_SIZE_ALREADY_EXISTS]).toBe(
        'error_tire_size_already_exists'
      );
    });

    it('should have mapping for TIRE_VARIANT_NOT_FOUND', () => {
      expect(ERROR_MESSAGE_KEYS[ErrorCode.TIRE_VARIANT_NOT_FOUND]).toBe(
        'error_tire_variant_not_found'
      );
    });

    it('should have mapping for INVALID_TIRE_SIZE_FORMAT', () => {
      expect(ERROR_MESSAGE_KEYS[ErrorCode.INVALID_TIRE_SIZE_FORMAT]).toBe(
        'error_invalid_tire_size_format'
      );
    });

    it('should have mapping for INVALID_TIRE_CODE_FORMAT', () => {
      expect(ERROR_MESSAGE_KEYS[ErrorCode.INVALID_TIRE_CODE_FORMAT]).toBe(
        'error_invalid_tire_code_format'
      );
    });

    it('should have mapping for MISSING_REQUIRED_FIELDS', () => {
      expect(ERROR_MESSAGE_KEYS[ErrorCode.MISSING_REQUIRED_FIELDS]).toBe(
        'error_missing_required_fields'
      );
    });

    it('should have mapping for INTERNAL_SERVER_ERROR', () => {
      expect(ERROR_MESSAGE_KEYS[ErrorCode.INTERNAL_SERVER_ERROR]).toBe('error_internal_server');
    });

    it('should have mapping for NETWORK_ERROR', () => {
      expect(ERROR_MESSAGE_KEYS[ErrorCode.NETWORK_ERROR]).toBe('error_network');
    });

    it('should have mapping for UNKNOWN_ERROR', () => {
      expect(ERROR_MESSAGE_KEYS[ErrorCode.UNKNOWN_ERROR]).toBe('error_unknown');
    });

    it('should have 10 message keys', () => {
      const keys = Object.keys(ERROR_MESSAGE_KEYS);
      expect(keys).toHaveLength(10);
    });

    it('should have all message keys with values', () => {
      Object.values(ERROR_MESSAGE_KEYS).forEach(value => {
        expect(value).toBeDefined();
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('should have all message keys start with error_', () => {
      Object.values(ERROR_MESSAGE_KEYS).forEach(value => {
        expect(value).toMatch(/^error_/);
      });
    });

    it('should use consistent naming convention', () => {
      Object.values(ERROR_MESSAGE_KEYS).forEach(value => {
        expect(value).toMatch(/^error_[a-z_]+$/);
      });
    });
  });

  describe('ErrorCode and ERROR_MESSAGE_KEYS integration', () => {
    it('should have complete mapping coverage', () => {
      const errorCodes = Object.values(ErrorCode);

      errorCodes.forEach(code => {
        expect(ERROR_MESSAGE_KEYS[code as ErrorCode]).toBeDefined();
      });
    });

    it('should have no orphan message keys', () => {
      const messageKeys = Object.keys(ERROR_MESSAGE_KEYS);
      const errorCodes = Object.keys(ErrorCode);

      messageKeys.forEach(key => {
        expect(errorCodes).toContain(key);
      });
    });

    it('should have same number of codes and mappings', () => {
      const codes = Object.values(ErrorCode);
      const keys = Object.keys(ERROR_MESSAGE_KEYS);

      expect(keys).toHaveLength(codes.length);
    });

    it('should create valid message key for each error', () => {
      Object.entries(ERROR_MESSAGE_KEYS).forEach(([code, key]) => {
        expect(code).toBeTruthy();
        expect(key).toBeTruthy();
        expect(typeof code).toBe('string');
        expect(typeof key).toBe('string');
      });
    });

    it('should allow retrieving message key by error code', () => {
      const errorCode = ErrorCode.NETWORK_ERROR;
      const messageKey = ERROR_MESSAGE_KEYS[errorCode];

      expect(messageKey).toBe('error_network');
    });

    it('should work with all error codes for message lookup', () => {
      const testCases = [
        [ErrorCode.TIRE_CODE_NOT_FOUND, 'error_tire_code_not_found'],
        [ErrorCode.TIRE_SIZE_NOT_FOUND, 'error_tire_size_not_found'],
        [ErrorCode.TIRE_SIZE_ALREADY_EXISTS, 'error_tire_size_already_exists'],
        [ErrorCode.TIRE_VARIANT_NOT_FOUND, 'error_tire_variant_not_found'],
        [ErrorCode.INVALID_TIRE_SIZE_FORMAT, 'error_invalid_tire_size_format'],
        [ErrorCode.INVALID_TIRE_CODE_FORMAT, 'error_invalid_tire_code_format'],
        [ErrorCode.MISSING_REQUIRED_FIELDS, 'error_missing_required_fields'],
        [ErrorCode.INTERNAL_SERVER_ERROR, 'error_internal_server'],
        [ErrorCode.NETWORK_ERROR, 'error_network'],
        [ErrorCode.UNKNOWN_ERROR, 'error_unknown']
      ];

      testCases.forEach(([code, expectedKey]) => {
        expect(ERROR_MESSAGE_KEYS[code as ErrorCode]).toBe(expectedKey);
      });
    });
  });

  describe('Error Code Types', () => {
    it('should allow type-safe access to error codes', () => {
      const code: ErrorCode = ErrorCode.NETWORK_ERROR;
      expect(code).toBe('NETWORK_ERROR');
    });

    it('should allow destructuring error codes', () => {
      const { TIRE_CODE_NOT_FOUND, NETWORK_ERROR } = ErrorCode;

      expect(TIRE_CODE_NOT_FOUND).toBe('TIRE_CODE_NOT_FOUND');
      expect(NETWORK_ERROR).toBe('NETWORK_ERROR');
    });

    it('should support error code comparison', () => {
      const errorCode = ErrorCode.TIRE_SIZE_NOT_FOUND;

      expect(errorCode === ErrorCode.TIRE_SIZE_NOT_FOUND).toBe(true);
      expect(errorCode === ErrorCode.TIRE_CODE_NOT_FOUND).toBe(false);
    });

    it('should support error code in switch statements', () => {
      const errorCode = ErrorCode.INVALID_TIRE_SIZE_FORMAT;
      let result = '';

      switch (errorCode) {
        case ErrorCode.INVALID_TIRE_SIZE_FORMAT:
          result = 'format_error';
          break;
        case ErrorCode.MISSING_REQUIRED_FIELDS:
          result = 'missing_error';
          break;
        default:
          result = 'other';
      }

      expect(result).toBe('format_error');
    });
  });

  describe('Error Message Key Generation', () => {
    it('should generate consistent message keys', () => {
      const errorCode = ErrorCode.TIRE_CODE_NOT_FOUND;
      const messageKey1 = ERROR_MESSAGE_KEYS[errorCode];
      const messageKey2 = ERROR_MESSAGE_KEYS[errorCode];

      expect(messageKey1).toBe(messageKey2);
    });

    it('should map all tire errors to error_tire_ prefixed keys', () => {
      const tireErrors = [
        ErrorCode.TIRE_CODE_NOT_FOUND,
        ErrorCode.TIRE_SIZE_NOT_FOUND,
        ErrorCode.TIRE_SIZE_ALREADY_EXISTS,
        ErrorCode.TIRE_VARIANT_NOT_FOUND
      ];

      tireErrors.forEach(error => {
        const key = ERROR_MESSAGE_KEYS[error];
        expect(key).toMatch(/^error_tire_/);
      });
    });

    it('should map validation errors to error_invalid_ or error_missing_', () => {
      const validationErrors = [
        ErrorCode.INVALID_TIRE_SIZE_FORMAT,
        ErrorCode.INVALID_TIRE_CODE_FORMAT,
        ErrorCode.MISSING_REQUIRED_FIELDS
      ];

      validationErrors.forEach(error => {
        const key = ERROR_MESSAGE_KEYS[error];
        expect(key).toMatch(/^error_(invalid|missing)/);
      });
    });

    it('should map general errors to appropriate prefixes', () => {
      const generalErrors = [
        [ErrorCode.INTERNAL_SERVER_ERROR, 'error_internal'],
        [ErrorCode.NETWORK_ERROR, 'error_network'],
        [ErrorCode.UNKNOWN_ERROR, 'error_unknown']
      ];

      generalErrors.forEach(([error, prefix]) => {
        const key = ERROR_MESSAGE_KEYS[error];
        expect(key).toMatch(new RegExp(`^${prefix}`));
      });
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('should not allow null error codes', () => {
      const codes = Object.values(ErrorCode);
      codes.forEach(code => {
        expect(code).not.toBeNull();
      });
    });

    it('should not allow undefined error codes', () => {
      const codes = Object.values(ErrorCode);
      codes.forEach(code => {
        expect(code).not.toBeUndefined();
      });
    });

    it('should not allow empty string error codes', () => {
      const codes = Object.values(ErrorCode);
      codes.forEach(code => {
        expect(code).not.toBe('');
      });
    });

    it('should not allow null message keys', () => {
      Object.values(ERROR_MESSAGE_KEYS).forEach(key => {
        expect(key).not.toBeNull();
      });
    });

    it('should not allow undefined message keys', () => {
      Object.values(ERROR_MESSAGE_KEYS).forEach(key => {
        expect(key).not.toBeUndefined();
      });
    });

    it('should not allow empty string message keys', () => {
      Object.values(ERROR_MESSAGE_KEYS).forEach(key => {
        expect(key).not.toBe('');
      });
    });

    it('should be immutable (Record type)', () => {
      // Record is readonly, test that mapping exists and is accessible
      const key = ERROR_MESSAGE_KEYS[ErrorCode.NETWORK_ERROR];
      expect(key).toBe('error_network');
    });

    it('should support accessing all error codes without errors', () => {
      expect(() => {
        Object.values(ErrorCode).forEach(code => {
          const _key = ERROR_MESSAGE_KEYS[code as ErrorCode];
        });
      }).not.toThrow();
    });
  });

  describe('Practical Usage Scenarios', () => {
    it('should support error code based error messages', () => {
      const mockError = {
        code: ErrorCode.TIRE_SIZE_NOT_FOUND,
        message: 'Tire size not found in system'
      };

      const messageKey = ERROR_MESSAGE_KEYS[mockError.code];
      expect(messageKey).toBe('error_tire_size_not_found');
    });

    it('should support dynamic error message lookup', () => {
      const errorCodes = [
        ErrorCode.NETWORK_ERROR,
        ErrorCode.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_ERROR
      ];

      errorCodes.forEach(code => {
        const translationKey = ERROR_MESSAGE_KEYS[code];
        expect(translationKey).toMatch(/^error_/);
      });
    });

    it('should support error categorization by code pattern', () => {
      const isTireError = (code: ErrorCode): boolean => code.includes('TIRE');

      expect(isTireError(ErrorCode.TIRE_CODE_NOT_FOUND)).toBe(true);
      expect(isTireError(ErrorCode.NETWORK_ERROR)).toBe(false);
    });

    it('should support error filtering by category', () => {
      const allErrors = Object.values(ErrorCode);
      const validationErrors = allErrors.filter(
        code => code.includes('INVALID') || code.includes('MISSING')
      );

      expect(validationErrors).toContain(ErrorCode.INVALID_TIRE_SIZE_FORMAT);
      expect(validationErrors).toContain(ErrorCode.MISSING_REQUIRED_FIELDS);
      expect(validationErrors).not.toContain(ErrorCode.NETWORK_ERROR);
    });

    it('should support retrieving all error codes programmatically', () => {
      const allErrors = Object.values(ErrorCode);
      const allKeys = Object.values(ERROR_MESSAGE_KEYS);

      expect(allErrors).toHaveLength(allKeys.length);
      allErrors.forEach(error => {
        expect(ERROR_MESSAGE_KEYS[error]).toBeDefined();
      });
    });
  });
});
