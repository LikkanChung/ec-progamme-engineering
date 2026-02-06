import pool from './pool';

export interface Url {
  id: number;
  short_code: string;
  long_url: string;
  created_at: Date;
}

export async function createUrl(shortCode: string, longUrl: string): Promise<Url> {
  const result = await pool.query(
    'INSERT INTO urls (short_code, long_url) VALUES ($1, $2) RETURNING *',
    [shortCode, longUrl]
  );
  return result.rows[0];
}

export async function getAllUrls(): Promise<Url[]> {
  const result = await pool.query(
    'SELECT * FROM urls ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function getUrlByShortCode(shortCode: string): Promise<Url | null> {
  const result = await pool.query(
    'SELECT * FROM urls WHERE short_code = $1',
    [shortCode]
  );
  return result.rows[0] || null;
}

export async function deleteUrl(id: number): Promise<boolean> {
  const result = await pool.query(
    'DELETE FROM urls WHERE id = $1',
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function shortCodeExists(shortCode: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT 1 FROM urls WHERE short_code = $1',
    [shortCode]
  );
  return result.rows.length > 0;
}
