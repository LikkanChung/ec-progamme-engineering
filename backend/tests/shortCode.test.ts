import { generateShortCode } from '../src/utils/shortCode';

describe('generateShortCode', () => {
  it('should generate a code of default length (5)', () => {
    const code = generateShortCode();
    expect(code).toHaveLength(5);
  });

  it('should generate a code of specified length', () => {
    const code = generateShortCode(8);
    expect(code).toHaveLength(8);
  });

  it('should only contain alphanumeric characters', () => {
    const code = generateShortCode();
    expect(code).toMatch(/^[A-Za-z0-9]+$/);
  });

  it('should generate unique codes', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateShortCode());
    }
    // With 62^5 = 916,132,832 combinations, 100 codes should be unique
    expect(codes.size).toBe(100);
  });
});
