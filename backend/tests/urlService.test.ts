import * as urlService from '../src/services/urlService';
import * as db from '../src/db/queries';
import * as utils from '../src/utils/shortCode';

// Mock the database module
jest.mock('../src/db/queries');
jest.mock('../src/utils/shortCode');

const mockDb = db as jest.Mocked<typeof db>;
const mockUtils = utils as jest.Mocked<typeof utils>;

describe('urlService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createShortenedUrl', () => {
    it('should create a shortened URL successfully', async () => {
      const mockUrl = {
        id: 1,
        short_code: 'abc12',
        long_url: 'https://example.com',
        created_at: new Date(),
      };

      mockUtils.generateShortCode.mockReturnValue('abc12');
      mockDb.shortCodeExists.mockResolvedValue(false);
      mockDb.createUrl.mockResolvedValue(mockUrl);

      const result = await urlService.createShortenedUrl('https://example.com');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUrl);
      expect(mockDb.createUrl).toHaveBeenCalledWith('abc12', 'https://example.com');
    });

    it('should return error when URL is empty', async () => {
      const result = await urlService.createShortenedUrl('');

      expect(result.success).toBe(false);
      expect(result.error).toBe('URL is required');
    });

    it('should return error when URL exceeds maximum length', async () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(250);
      const result = await urlService.createShortenedUrl(longUrl);

      expect(result.success).toBe(false);
      expect(result.error).toBe('URL must be 256 characters or less');
    });

    it('should regenerate short code if it already exists', async () => {
      const mockUrl = {
        id: 1,
        short_code: 'xyz99',
        long_url: 'https://example.com',
        created_at: new Date(),
      };

      mockUtils.generateShortCode
        .mockReturnValueOnce('abc12')
        .mockReturnValueOnce('xyz99');
      mockDb.shortCodeExists
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      mockDb.createUrl.mockResolvedValue(mockUrl);

      const result = await urlService.createShortenedUrl('https://example.com');

      expect(result.success).toBe(true);
      expect(mockUtils.generateShortCode).toHaveBeenCalledTimes(2);
    });
  });

  describe('listAllUrls', () => {
    it('should return all URLs', async () => {
      const mockUrls = [
        { id: 1, short_code: 'abc12', long_url: 'https://example.com', created_at: new Date() },
        { id: 2, short_code: 'def34', long_url: 'https://test.com', created_at: new Date() },
      ];

      mockDb.getAllUrls.mockResolvedValue(mockUrls);

      const result = await urlService.listAllUrls();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUrls);
    });

    it('should handle database errors', async () => {
      mockDb.getAllUrls.mockRejectedValue(new Error('Database error'));

      const result = await urlService.listAllUrls();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to retrieve URLs');
    });
  });

  describe('deleteShortenedUrl', () => {
    it('should delete URL successfully', async () => {
      mockDb.deleteUrl.mockResolvedValue(true);

      const result = await urlService.deleteShortenedUrl(1);

      expect(result.success).toBe(true);
      expect(mockDb.deleteUrl).toHaveBeenCalledWith(1);
    });

    it('should return error when URL not found', async () => {
      mockDb.deleteUrl.mockResolvedValue(false);

      const result = await urlService.deleteShortenedUrl(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('URL not found');
    });
  });

  describe('getLongUrl', () => {
    it('should return long URL for valid short code', async () => {
      const mockUrl = {
        id: 1,
        short_code: 'abc12',
        long_url: 'https://example.com',
        created_at: new Date(),
      };

      mockDb.getUrlByShortCode.mockResolvedValue(mockUrl);

      const result = await urlService.getLongUrl('abc12');

      expect(result.success).toBe(true);
      expect(result.longUrl).toBe('https://example.com');
    });

    it('should return error for non-existent short code', async () => {
      mockDb.getUrlByShortCode.mockResolvedValue(null);

      const result = await urlService.getLongUrl('zzzzz');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Short URL not found');
    });
  });
});
