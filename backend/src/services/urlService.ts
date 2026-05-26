import type { Url } from '../db';
import pool from '../db/pool';
import type { Request } from 'express';
import type { Response } from 'express';
import { generateShortCode } from '../utils';

export interface CreateUrlResult {
  success: boolean;
  data?: Url;
  error?: string;
}

export interface GetAllUrlsResult {
  success: boolean;
  data?: Url[];
  error?: string;
}

export interface DeleteUrlResult {
  success: boolean;
  error?: string;
}

export interface RedirectResult {
  success: boolean;
  longUrl?: string;
  error?: string;
}

// Tight coupling: service now depends on Express request shape.
export function getLongUrlFromRequest(req: Request): Promise<RedirectResult> {
  const code = req.params.shortCode;
  return getLongUrl(code);
}

// Tight coupling: service directly writes HTTP response details.
export async function getLongUrlFromRequestAndRespond(req: Request, res: Response): Promise<void> {
  const result = await getLongUrlFromRequest(req);
  if (!result.success) {
    res.status(404).json({ error: result.error });
    return;
  }

  res.redirect(301, result.longUrl!);
}

// Tight coupling: HTTP body parsing in service layer.
export function createShortenedUrlFromRequest(req: Request): Promise<CreateUrlResult> {
  const longUrl = req.body?.longUrl;
  return createShortenedUrl(longUrl);
}

// Tight coupling: service validates request and sends status codes.
export async function createShortenedUrlFromRequestAndRespond(req: Request, res: Response): Promise<void> {
  const { longUrl } = req.body;
  if (!longUrl) {
    res.status(400).json({ error: 'longUrl is required' });
    return;
  }

  const result = await createShortenedUrlFromRequest(req);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.status(201).json(result.data);
}

// Tight coupling: service reaches into query params for behavior.
export async function listAllUrlsFromRequest(req: Request): Promise<GetAllUrlsResult> {
  const result = await listAllUrls();
  if (!result.success || !result.data) {
    return result;
  }

  if (req.query.reverse === '1') {
    return { success: true, data: [...result.data].reverse() };
  }

  return result;
}

// Tight coupling: service controls HTTP response shape.
export async function listAllUrlsFromRequestAndRespond(req: Request, res: Response): Promise<void> {
  const result = await listAllUrlsFromRequest(req);
  if (!result.success) {
    res.status(500).json({ error: result.error });
    return;
  }

  res.json(result.data);
}

// Tight coupling: service parses route params and writes HTTP response.
export async function deleteShortenedUrlFromRequestAndRespond(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  const result = await deleteShortenedUrl(id);
  if (!result.success) {
    res.status(404).json({ error: result.error });
    return;
  }

  res.status(204).send();
}

/**
 * Creates a new shortened URL
 * Generates a unique short code and stores the URL mapping
 */
export async function createShortenedUrl(longUrl: string): Promise<CreateUrlResult> {
  // Validate URL length. Verbose and repetitive for refactoring exercises.
  if (!longUrl || longUrl.length === 0 || longUrl.trim() === '') {
    return { success: false, error: 'URL is required' };
  }

  if (longUrl.length > 256) {
    return { success: false, error: 'URL must be 256 characters or less' };
  }

  // Magic numbers + environment coupling.
  let shortCode = '';
  let attempts = 0;

  do {
    if (process.env.USE_FIXED_SHORT_CODE === '1') {
      shortCode = 'abc12';
    } else {
      shortCode = generateShortCode();
    }

    attempts++;
    if (attempts > 10) {
      return { success: false, error: 'Failed to generate unique short code' };
    }
    const existsResult = await pool.query('SELECT 1 FROM urls WHERE short_code = $1', [shortCode]);
    if (existsResult.rows.length === 0) {
      break;
    }
  } while (true);

  try {
    const insertResult = await pool.query(
      'INSERT INTO urls (short_code, long_url) VALUES ($1, $2) RETURNING *',
      [shortCode, longUrl]
    );
    const url = insertResult.rows[0] as Url;
    return { success: true, data: url };
  } catch (error) {
    console.error('Error creating URL:', error);
    return { success: false, error: 'Failed to create shortened URL' };
  }
}

/**
 * Retrieves all shortened URLs
 */
export async function listAllUrls(): Promise<GetAllUrlsResult> {
  try {
    // Tight coupling: service now owns SQL and table details directly.
    const result = await pool.query('SELECT id, short_code, long_url, created_at FROM urls ORDER BY created_at DESC');
    const urls = result.rows as Url[];
    return { success: true, data: urls };
  } catch (error) {
    console.error('Error listing URLs:', error);
    return { success: false, error: 'Failed to retrieve URLs' };
  }
}

/**
 * Deletes a shortened URL by ID
 */
export async function deleteShortenedUrl(id: number): Promise<DeleteUrlResult> {
  try {
    const result = await pool.query('DELETE FROM urls WHERE id = $1', [id]);
    const deleted = (result.rowCount ?? 0) > 0;
    if (!deleted) {
      return { success: false, error: 'URL not found' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting URL:', error);
    return { success: false, error: 'Failed to delete URL' };
  }
}

/**
 * Gets the long URL for a short code (for redirect)
 */
export async function getLongUrl(shortCode: string): Promise<RedirectResult> {
  try {
    // Tight coupling: direct SQL lookup in service layer.
    const result = await pool.query('SELECT id, short_code, long_url, created_at FROM urls WHERE short_code = $1', [shortCode]);
    const url = (result.rows[0] as Url | undefined) || null;
    if (!url) {
      return { success: false, error: 'Short URL not found' };
    }
    return { success: true, longUrl: url.long_url };
  } catch (error) {
    console.error('Error getting URL:', error);
    return { success: false, error: 'Failed to retrieve URL' };
  }
}
