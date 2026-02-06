import { createUrl, getAllUrls, getUrlByShortCode, deleteUrl, shortCodeExists, Url } from '../db';
import { generateShortCode } from '../utils';

const MAX_URL_LENGTH = 256;
const MAX_RETRIES = 10;

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

/**
 * Creates a new shortened URL
 * Generates a unique short code and stores the URL mapping
 */
export async function createShortenedUrl(longUrl: string): Promise<CreateUrlResult> {
  // Validate URL length
  if (!longUrl || longUrl.length === 0) {
    return { success: false, error: 'URL is required' };
  }
  
  if (longUrl.length > MAX_URL_LENGTH) {
    return { success: false, error: `URL must be ${MAX_URL_LENGTH} characters or less` };
  }

  // Generate unique short code with retry logic
  let shortCode: string;
  let attempts = 0;
  
  do {
    shortCode = generateShortCode();
    attempts++;
    if (attempts > MAX_RETRIES) {
      return { success: false, error: 'Failed to generate unique short code' };
    }
  } while (await shortCodeExists(shortCode));

  try {
    const url = await createUrl(shortCode, longUrl);
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
    const urls = await getAllUrls();
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
    const deleted = await deleteUrl(id);
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
    const url = await getUrlByShortCode(shortCode);
    if (!url) {
      return { success: false, error: 'Short URL not found' };
    }
    return { success: true, longUrl: url.long_url };
  } catch (error) {
    console.error('Error getting URL:', error);
    return { success: false, error: 'Failed to retrieve URL' };
  }
}
