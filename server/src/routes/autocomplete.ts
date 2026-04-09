import { Router, Request, Response } from 'express';

const router = Router();

// in memory cache
const cache = new Map<string, { data: unknown; cachedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const XE_AUTOCOMPLETE_URL =
  'https://oapaiqtgkr6wfbum252tswprwa0ausnb.lambda-url.eu-central-1.on.aws/';

// GET /api/autocomplete?input=nafplio
router.get('/', async (req: Request, res: Response) => {
  const input = req.query.input as string;

  if (!input || input.trim().length < 3) {
    res.status(400).json({ error: 'Input must be at least 3 characters' });
    return;
  }

  const cacheKey = input.trim().toLowerCase();

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    res.json(cached.data);
    return;
  }

  try {
    const controller = new AbortController();

    const response = await fetch(
      `${XE_AUTOCOMPLETE_URL}?input=${encodeURIComponent(input)}`,
      {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }
    );

    if (!response.ok) {
      throw new Error(`Autocomplete API responded with status ${response.status}`);
    }

    const data = await response.json();
    cache.set(cacheKey, { data, cachedAt: Date.now() });

    res.json(data);
  } catch (err) {
    console.error('Autocomplete fetch failed:', err);
    res.status(502).json({ error: 'Failed to fetch autocomplete results' });
  }
});

export default router;