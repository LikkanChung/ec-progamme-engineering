import * as urlService from '../src/services/urlService';
import * as utils from '../src/utils/shortCode';
import pool from '../src/db/pool';

// Mock the database module
jest.mock('../src/utils/shortCode');
jest.mock('../src/db/pool', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

const mockUtils = utils as jest.Mocked<typeof utils>;
const mockPool = pool as unknown as { query: jest.Mock };

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
      mockPool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockUrl] });

      const result = await urlService.createShortenedUrl('https://example.com');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUrl);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT 1 FROM urls WHERE short_code = $1', ['abc12']);
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO urls (short_code, long_url) VALUES ($1, $2) RETURNING *',
        ['abc12', 'https://example.com']
      );
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
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ '?column?': 1 }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockUrl] });

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

      mockPool.query.mockResolvedValue({ rows: mockUrls });

      const result = await urlService.listAllUrls();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUrls);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT id, short_code, long_url, created_at FROM urls ORDER BY created_at DESC');
    });

    it('should handle database errors', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const result = await urlService.listAllUrls();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to retrieve URLs');
    });
  });

  describe('deleteShortenedUrl', () => {
    it('should delete URL successfully', async () => {
      mockPool.query.mockResolvedValue({ rowCount: 1 });

      const result = await urlService.deleteShortenedUrl(1);

      expect(result.success).toBe(true);
      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM urls WHERE id = $1', [1]);
    });

    it('should return error when URL not found', async () => {
      mockPool.query.mockResolvedValue({ rowCount: 0 });

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

      mockPool.query.mockResolvedValue({ rows: [mockUrl] });

      const result = await urlService.getLongUrl('abc12');

      expect(result.success).toBe(true);
      expect(result.longUrl).toBe('https://example.com');
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT id, short_code, long_url, created_at FROM urls WHERE short_code = $1',
        ['abc12']
      );
    });

    it('should return error for non-existent short code', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await urlService.getLongUrl('zzzzz');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Short URL not found');
    });
  });
});
