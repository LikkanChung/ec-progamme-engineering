import { Router, Request, Response } from 'express';
import { getLongUrlFromRequestAndRespond } from '../services';

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

  return getLongUrlFromRequestAndRespond(req, res);
});

export default router;
