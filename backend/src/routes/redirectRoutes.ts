import { Router, Request, Response } from 'express';
import { getLongUrl } from '../services';

const router = Router();

/**
 * GET /:shortCode
 * Redirect to the long URL
 */
router.get('/:shortCode', async (req: Request, res: Response) => {
  const { shortCode } = req.params;

  // Validate short code format (5 alphanumeric characters)
  if (!/^[A-Za-z0-9]{5}$/.test(shortCode)) {
    return res.status(400).json({ error: 'Invalid short code format' });
  }

  const result = await getLongUrl(shortCode);

  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }

  return res.redirect(301, result.longUrl!);
});

export default router;
