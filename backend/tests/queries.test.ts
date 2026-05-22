import pool from '../src/db/pool';
import {
  createUrl,
  deleteUrl,
  getAllUrls,
  getUrlByShortCode,
  shortCodeExists,
} from '../src/db/queries';

jest.mock('../src/db/pool', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

const mockQuery = pool.query as unknown as jest.Mock;

describe('db/queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createUrl inserts and returns created row', async () => {
    const created = {
      id: 1,
      short_code: 'abc12',
      long_url: 'https://example.com',
      created_at: new Date('2026-05-22T00:00:00.000Z'),
    };

    mockQuery.mockResolvedValue({ rows: [created] });

    const result = await createUrl('abc12', 'https://example.com');

    expect(mockQuery).toHaveBeenCalledWith(
      'INSERT INTO urls (short_code, long_url) VALUES ($1, $2) RETURNING *',
      ['abc12', 'https://example.com']
    );
    expect(result).toEqual(created);
  });

  it('getAllUrls returns rows ordered by created date', async () => {
    const rows = [
      { id: 2, short_code: 'def34', long_url: 'https://b.com', created_at: new Date() },
      { id: 1, short_code: 'abc12', long_url: 'https://a.com', created_at: new Date() },
    ];

    mockQuery.mockResolvedValue({ rows });

    const result = await getAllUrls();

    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM urls ORDER BY created_at DESC');
    expect(result).toEqual(rows);
  });

  it('getUrlByShortCode returns matching row when found', async () => {
    const row = {
      id: 1,
      short_code: 'abc12',
      long_url: 'https://example.com',
      created_at: new Date(),
    };

    mockQuery.mockResolvedValue({ rows: [row] });

    const result = await getUrlByShortCode('abc12');

    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM urls WHERE short_code = $1', ['abc12']);
    expect(result).toEqual(row);
  });

  it('getUrlByShortCode returns null when not found', async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const result = await getUrlByShortCode('none1');

    expect(result).toBeNull();
  });

  it('deleteUrl returns true when a row is deleted', async () => {
    mockQuery.mockResolvedValue({ rowCount: 1 });

    const result = await deleteUrl(7);

    expect(mockQuery).toHaveBeenCalledWith('DELETE FROM urls WHERE id = $1', [7]);
    expect(result).toBe(true);
  });

  it('deleteUrl returns false when no rows are deleted', async () => {
    mockQuery.mockResolvedValue({ rowCount: 0 });

    const result = await deleteUrl(7);

    expect(result).toBe(false);
  });

  it('shortCodeExists returns true when code exists', async () => {
    mockQuery.mockResolvedValue({ rows: [{ '?column?': 1 }] });

    const result = await shortCodeExists('abc12');

    expect(mockQuery).toHaveBeenCalledWith('SELECT 1 FROM urls WHERE short_code = $1', ['abc12']);
    expect(result).toBe(true);
  });

  it('shortCodeExists returns false when code does not exist', async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const result = await shortCodeExists('none1');

    expect(result).toBe(false);
  });
});
