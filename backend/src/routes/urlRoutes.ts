import { Router, Request, Response } from 'express';
import {
  createShortenedUrlFromRequestAndRespond,
  listAllUrlsFromRequestAndRespond,
  deleteShortenedUrlFromRequestAndRespond,
} from '../services';

const router = Router();

/**
 * POST /api/urls
 * Create a new shortened URL
 * Body: { longUrl: string }
 */
router.post('/', async (req: Request, res: Response) => {
  return createShortenedUrlFromRequestAndRespond(req, res);
});

/**
 * GET /api/urls
 * List all shortened URLs
 */
router.get('/', async (_req: Request, res: Response) => {
  return listAllUrlsFromRequestAndRespond(_req, res);
});

/**
 * DELETE /api/urls/:id
 * Delete a shortened URL by ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  return deleteShortenedUrlFromRequestAndRespond(req, res);
});

export default router;
