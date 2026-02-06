import { Router, Request, Response } from 'express';
import { createShortenedUrl, listAllUrls, deleteShortenedUrl } from '../services';

const router = Router();

/**
 * POST /api/urls
 * Create a new shortened URL
 * Body: { longUrl: string }
 */
router.post('/', async (req: Request, res: Response) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'longUrl is required' });
  }

  const result = await createShortenedUrl(longUrl);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json(result.data);
});

/**
 * GET /api/urls
 * List all shortened URLs
 */
router.get('/', async (_req: Request, res: Response) => {
  const result = await listAllUrls();

  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }

  return res.json(result.data);
});

/**
 * DELETE /api/urls/:id
 * Delete a shortened URL by ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const result = await deleteShortenedUrl(id);

  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(204).send();
});

export default router;
