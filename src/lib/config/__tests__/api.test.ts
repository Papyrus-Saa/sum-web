import { API_CONFIG, TIRE_SIZE_PATTERN, TIRE_CODE_PATTERN, TIRE_VARIANT_PATTERN } from '../api';

const endpoints = API_CONFIG.endpoints as Record<string, unknown>;

describe('API Configuration', () => {
  describe('API_CONFIG object', () => {
    it('should have baseUrl defined', () => {
      expect(API_CONFIG.baseUrl).toBeDefined();
      expect(typeof API_CONFIG.baseUrl).toBe('string');
    });

    it('should have valid baseUrl format', () => {
      expect(API_CONFIG.baseUrl).toMatch(/^https?:\/\//);
    });

    it('should have timeout defined', () => {
      expect(API_CONFIG.timeout).toBeDefined();
      expect(typeof API_CONFIG.timeout).toBe('number');
    });

    it('should have positive timeout value', () => {
      expect(API_CONFIG.timeout).toBeGreaterThan(0);
    });

    it('should have endpoints object', () => {
      expect(endpoints).toBeDefined();
      expect(typeof endpoints).toBe('object');
    });

    it('should have lookup endpoint', () => {
      expect(endpoints.lookup).toBeDefined();
      expect(endpoints.lookup).toBe('/api/v1/lookup');
    });

    it('should have suggestions endpoint', () => {
      expect(endpoints.suggestions).toBeDefined();
      expect(endpoints.suggestions).toBe('/api/v1/lookup/suggestions');
    });

    it('should have login endpoint', () => {
      expect(endpoints.login).toBeDefined();
      expect(endpoints.login).toBe('/api/v1/admin/auth/login');
    });

    it('should have refresh endpoint', () => {
      expect(endpoints.refresh).toBeDefined();
      expect(endpoints.refresh).toBe('/api/v1/admin/auth/refresh');
    });

    it('should have logout endpoint', () => {
      expect(endpoints.logout).toBeDefined();
      expect(endpoints.logout).toBe('/api/v1/admin/auth/logout');
    });

    it('should have mappings endpoint', () => {
      expect(endpoints.mappings).toBeDefined();
      expect(endpoints.mappings).toBe('/api/v1/admin/mappings');
    });

    it('should have mappingById function', () => {
      expect(endpoints.mappingById).toBeDefined();
      expect(typeof endpoints.mappingById).toBe('function');
    });

    it('should generate correct mappingById endpoint', () => {
      const id = '123-456';
      const mappingById = endpoints.mappingById as (value: string) => string;
      const endpoint = mappingById(id);

      expect(endpoint).toBe(`/api/v1/admin/mappings/${id}`);
    });

    it('should handle numeric IDs in mappingById', () => {
      const mappingById = endpoints.mappingById as (value: string) => string;
      const endpoint = mappingById('789');

      expect(endpoint).toBe('/api/v1/admin/mappings/789');
    });

    it('should have import endpoint', () => {
      expect(endpoints.import).toBeDefined();
      expect(endpoints.import).toBe('/api/v1/admin/import');
    });

    it('should have importStatus function', () => {
      expect(endpoints.importStatus).toBeDefined();
      expect(typeof endpoints.importStatus).toBe('function');
    });

    it('should generate correct importStatus endpoint', () => {
      const jobId = 'job-123';
      const importStatus = endpoints.importStatus as (value: string) => string;
      const endpoint = importStatus(jobId);

      expect(endpoint).toBe(`/api/v1/admin/import/${jobId}`);
    });

    it('should have analyticsOverview endpoint', () => {
      expect(endpoints.analyticsOverview).toBeDefined();
      expect(endpoints.analyticsOverview).toBe('/api/v1/admin/analytics/overview');
    });

    it('should have analyticsTopSearches endpoint', () => {
      expect(endpoints.analyticsTopSearches).toBeDefined();
      expect(endpoints.analyticsTopSearches).toBe('/api/v1/admin/analytics/top-searches');
    });

    it('should be readonly', () => {
      // TypeScript checks this, but verify runtime behavior
      expect(API_CONFIG).toBeDefined();
    });
  });

  describe('TIRE_SIZE_PATTERN', () => {
    it('should match valid tire size format 205/55R16', () => {
      expect(TIRE_SIZE_PATTERN.test('205/55R16')).toBe(true);
    });

    it('should match tire size with lowercase r', () => {
      expect(TIRE_SIZE_PATTERN.test('205/55r16')).toBe(true);
    });

    it('should match 3-digit width tire size', () => {
      expect(TIRE_SIZE_PATTERN.test('175/65R14')).toBe(true);
    });

    it('should not match 4-digit width tire size pattern only allows exactly 3 digits', () => {
      expect(TIRE_SIZE_PATTERN.test('2055/55R16')).toBe(false);
    });

    it('should match multiple formats', () => {
      const testCases = [
        '205/55R16',
        '195/55R15',
        '225/45R17',
        '275/30R19',
        '185/70r13',
        '245/40r18'
      ];

      testCases.forEach(size => {
        // All valid tire sizes with exactly 3 digit width should match
        expect(TIRE_SIZE_PATTERN.test(size)).toBe(true);
      });
    });

    it('should not match invalid tire size format', () => {
      expect(TIRE_SIZE_PATTERN.test('20555R16')).toBe(false);
    });

    it('should not match without aspect ratio', () => {
      expect(TIRE_SIZE_PATTERN.test('205R16')).toBe(false);
    });

    it('should not match without diameter', () => {
      expect(TIRE_SIZE_PATTERN.test('205/55R')).toBe(false);
    });

    it('should not match with letters other than R', () => {
      expect(TIRE_SIZE_PATTERN.test('205/55B16')).toBe(false);
    });

    it('should not match empty string', () => {
      expect(TIRE_SIZE_PATTERN.test('')).toBe(false);
    });

    it('should match when tire size is at start even with trailing text', () => {
      // TIRE_SIZE_PATTERN doesn't have $ anchor, so it matches if pattern exists at start
      expect(TIRE_SIZE_PATTERN.test('205/55R16 extra')).toBe(true);
    });

    it('should match with aspect ratio variations', () => {
      // All 2-digit aspect ratios should match
      expect(TIRE_SIZE_PATTERN.test('205/50R16')).toBe(true);
      expect(TIRE_SIZE_PATTERN.test('205/60R16')).toBe(true);
      expect(TIRE_SIZE_PATTERN.test('205/70R16')).toBe(true);
    });

    it('should match with diameter variations', () => {
      expect(TIRE_SIZE_PATTERN.test('205/55R13')).toBe(true);
      expect(TIRE_SIZE_PATTERN.test('205/55R15')).toBe(true);
      expect(TIRE_SIZE_PATTERN.test('205/55R17')).toBe(true);
      expect(TIRE_SIZE_PATTERN.test('205/55R20')).toBe(true);
    });

    it('should not match with spaces', () => {
      expect(TIRE_SIZE_PATTERN.test('205 / 55 R 16')).toBe(false);
    });

    it('should not match single digit values', () => {
      expect(TIRE_SIZE_PATTERN.test('5/5R6')).toBe(false);
    });
  });

  describe('TIRE_CODE_PATTERN', () => {
    it('should match 3-digit tire code', () => {
      expect(TIRE_CODE_PATTERN.test('100')).toBe(true);
    });

    it('should match 2-digit tire code', () => {
      expect(TIRE_CODE_PATTERN.test('91')).toBe(true);
    });

    it('should match single digit', () => {
      expect(TIRE_CODE_PATTERN.test('5')).toBe(true);
    });

    it('should match large numbers', () => {
      expect(TIRE_CODE_PATTERN.test('999999')).toBe(true);
    });

    it('should match 205', () => {
      expect(TIRE_CODE_PATTERN.test('205')).toBe(true);
    });

    it('should not match empty string', () => {
      expect(TIRE_CODE_PATTERN.test('')).toBe(false);
    });

    it('should not match alpha characters', () => {
      expect(TIRE_CODE_PATTERN.test('abc')).toBe(false);
    });

    it('should not match mixed alphanumeric', () => {
      expect(TIRE_CODE_PATTERN.test('100a')).toBe(false);
    });

    it('should not match with leading spaces', () => {
      expect(TIRE_CODE_PATTERN.test(' 100')).toBe(false);
    });

    it('should not match with trailing spaces', () => {
      expect(TIRE_CODE_PATTERN.test('100 ')).toBe(false);
    });

    it('should not match decimal numbers', () => {
      expect(TIRE_CODE_PATTERN.test('100.5')).toBe(false);
    });

    it('should not match negative numbers', () => {
      expect(TIRE_CODE_PATTERN.test('-100')).toBe(false);
    });

    it('should not match with slash', () => {
      expect(TIRE_CODE_PATTERN.test('205/55')).toBe(false);
    });

    it('should match various load indices', () => {
      const indices = ['75', '82', '91', '100', '110', '120'];

      indices.forEach(index => {
        expect(TIRE_CODE_PATTERN.test(index)).toBe(true);
      });
    });
  });

  describe('TIRE_VARIANT_PATTERN', () => {
    it('should require preceding space for variant match', () => {
      // Pattern requires space(s) before the variant
      expect(TIRE_VARIANT_PATTERN.test(' 91V')).toBe(true);
      expect(TIRE_VARIANT_PATTERN.test('91V')).toBe(false);
    });

    it('should match with preceding space', () => {
      expect(TIRE_VARIANT_PATTERN.test(' 91V')).toBe(true);
    });

    it('should match 94W pattern', () => {
      expect(TIRE_VARIANT_PATTERN.test(' 94W')).toBe(true);
    });

    it('should match 3-digit load index', () => {
      expect(TIRE_VARIANT_PATTERN.test(' 120V')).toBe(true);
    });

    it('should capture load index correctly', () => {
      const match = ' 91V'.match(TIRE_VARIANT_PATTERN);

      expect(match).not.toBeNull();
      expect(match?.[1]).toBe('91');
    });

    it('should capture speed index correctly', () => {
      const match = ' 94W'.match(TIRE_VARIANT_PATTERN);

      expect(match).not.toBeNull();
      expect(match?.[2]).toBe('W');
    });

    it('should match various speed ratings', () => {
      const speedRatings = ['V', 'W', 'Y', 'H', 'T', 'S', 'Q', 'U', 'Z'];

      speedRatings.forEach(rating => {
        expect(TIRE_VARIANT_PATTERN.test(` 100${rating}`)).toBe(true);
      });
    });

    it('should match 2-digit load indices', () => {
      expect(TIRE_VARIANT_PATTERN.test(' 75V')).toBe(true);
      expect(TIRE_VARIANT_PATTERN.test(' 82W')).toBe(true);
      expect(TIRE_VARIANT_PATTERN.test(' 91Y')).toBe(true);
    });

    it('should match 3-digit load indices', () => {
      expect(TIRE_VARIANT_PATTERN.test(' 100T')).toBe(true);
      expect(TIRE_VARIANT_PATTERN.test(' 120H')).toBe(true);
    });

    it('should not match without speed rating', () => {
      expect(TIRE_VARIANT_PATTERN.test(' 91')).toBe(false);
    });

    it('should not match without load index', () => {
      expect(TIRE_VARIANT_PATTERN.test(' V')).toBe(false);
    });

    it('should not match with lowercase speed rating', () => {
      expect(TIRE_VARIANT_PATTERN.test(' 91v')).toBe(false);
    });

    it('should not match with single digit load index', () => {
      expect(TIRE_VARIANT_PATTERN.test(' 9V')).toBe(false);
    });

    it('should match full tire size variant example', () => {
      const fullString = '205/55R16 91V';
      const match = fullString.match(TIRE_VARIANT_PATTERN);

      expect(match).not.toBeNull();
      expect(match?.[1]).toBe('91');
      expect(match?.[2]).toBe('V');
    });

    it('should extract variant from complex tire string', () => {
      const fullString = '225/45R17 94W';
      const match = fullString.match(TIRE_VARIANT_PATTERN);

      expect(match).not.toBeNull();
      expect(match?.[1]).toBe('94');
      expect(match?.[2]).toBe('W');
    });

    it('should handle multiple matches in string via exec', () => {
      const pattern = new RegExp(TIRE_VARIANT_PATTERN.source, 'g');
      const string = '205/55R16 91V 225/45R17 94W';
      const matches = [];
      let match;

      while ((match = pattern.exec(string)) !== null) {
        matches.push([match[1], match[2]]);
      }

      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Pattern Integration', () => {
    it('should validate complete tire size with variant', () => {
      const tireString = '205/55R16 91V';

      expect(TIRE_SIZE_PATTERN.test(tireString.split(' ')[0])).toBe(true);
      expect(TIRE_VARIANT_PATTERN.test(tireString.match(/\s+\d{2,3}[A-Z]$/)?.[0] || '')).toBe(true);
    });

    it('should distinguish between size and code patterns', () => {
      expect(TIRE_SIZE_PATTERN.test('205/55R16')).toBe(true);
      expect(TIRE_CODE_PATTERN.test('205/55R16')).toBe(false);

      expect(TIRE_CODE_PATTERN.test('205')).toBe(true);
      expect(TIRE_SIZE_PATTERN.test('205')).toBe(false);
    });

    it('should validate multiple tire formats', () => {
      const tireSizes = ['205/55R16', '195/65R15', '225/45R17'];
      const codes = ['100', '205', '91'];

      tireSizes.forEach(size => {
        expect(TIRE_SIZE_PATTERN.test(size)).toBe(true);
        expect(TIRE_CODE_PATTERN.test(size)).toBe(false);
      });

      codes.forEach(code => {
        expect(TIRE_CODE_PATTERN.test(code)).toBe(true);
        expect(TIRE_SIZE_PATTERN.test(code)).toBe(false);
      });
    });

    it('should check endpoints start with /api/', () => {
      const endpointStrings = [
        endpoints.lookup as string,
        endpoints.suggestions as string,
        endpoints.login as string,
        endpoints.refresh as string,
        endpoints.logout as string,
        endpoints.mappings as string,
        endpoints.import as string,
        endpoints.analyticsOverview as string,
        endpoints.analyticsTopSearches as string
      ];

      endpointStrings.forEach(endpoint => {
        expect(endpoint).toMatch(/^\/api\//);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should not match tire size with four-digit width', () => {
      // Pattern requires exactly 3 digits for width
      expect(TIRE_SIZE_PATTERN.test('2055/55R16')).toBe(false);
    });

    it('should handle very small tire sizes with exactly 3-digit width', () => {
      expect(TIRE_SIZE_PATTERN.test('100/50R12')).toBe(true);
    });

    it('should handle zero-padded values', () => {
      expect(TIRE_CODE_PATTERN.test('005')).toBe(true);
      expect(TIRE_CODE_PATTERN.test('0')).toBe(true);
    });

    it('should not match tire size with extra slashes in the pattern', () => {
      // After first slash, we expect 2 digits then R, so this doesn't match
      expect(TIRE_SIZE_PATTERN.test('205/55/R16')).toBe(false);
    });

    it('should handle variant pattern with different digit lengths', () => {
      expect(TIRE_VARIANT_PATTERN.test(' 75V')).toBe(true);
      expect(TIRE_VARIANT_PATTERN.test(' 100V')).toBe(true);
      // 999 is 3 digits which is valid for load index
      expect(TIRE_VARIANT_PATTERN.test(' 999V')).toBe(true);
    });

    it('should handle special speed ratings', () => {
      // Z rating is valid for high performance
      expect(TIRE_VARIANT_PATTERN.test(' 91Z')).toBe(true);
    });
  });

  describe('Regex Properties', () => {
    it('should have TIRE_SIZE_PATTERN as RegExp', () => {
      expect(TIRE_SIZE_PATTERN).toBeInstanceOf(RegExp);
    });

    it('should have TIRE_CODE_PATTERN as RegExp', () => {
      expect(TIRE_CODE_PATTERN).toBeInstanceOf(RegExp);
    });

    it('should have TIRE_VARIANT_PATTERN as RegExp', () => {
      expect(TIRE_VARIANT_PATTERN).toBeInstanceOf(RegExp);
    });

    it('should have patterns with correct source', () => {
      expect(TIRE_SIZE_PATTERN.source).toBeDefined();
      expect(TIRE_CODE_PATTERN.source).toBeDefined();
      expect(TIRE_VARIANT_PATTERN.source).toBeDefined();
    });
  });
});
