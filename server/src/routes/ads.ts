import { Router, Request, Response } from 'express';
import { createAd, getAllAds, deleteAd } from '../db/queries';

const router = Router();

// POST /api/ads
router.post('/', async (req: Request, res: Response) => {
  const { title, type, area_place_id, area_main_text, area_secondary_text, price, description } =
    req.body;

  if (!title || !type || !area_place_id || !area_main_text || !area_secondary_text || !price) {
    res.status(400).json({ error: 'All fields except description are required' });
    return;
  }

  const allowedTypes = ['rent', 'buy', 'exchange', 'donation'];
  if (!allowedTypes.includes(type)) {
    res.status(400).json({ error: 'Invalid listing type' });
    return;
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    res.status(400).json({ error: 'Price must be a positive number' });
    return;
  }

  try {
    const ad = await createAd({
      title: title.trim(),
      type,
      area_place_id,
      area_main_text,
      area_secondary_text,
      price: parsedPrice,
      description: description?.trim() || undefined,
    });

    res.status(201).json(ad);
  } catch (err) {
    console.error('Error saving ad:', err);
    res.status(500).json({ error: 'Failed to save ad' });
  }
});

// GET /api/ads
router.get('/', async (_req: Request, res: Response) => {
  try {
    const ads = await getAllAds();
    res.json(ads);
  } catch (err) {
    console.error('Error fetching ads:', err);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

// DELETE /api/ads/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ad id' });
    return;
  }

  try {
    const deleted = await deleteAd(id);

    if (!deleted) {
      res.status(404).json({ error: 'Ad not found' });
      return;
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting ad:', err);
    res.status(500).json({ error: 'Failed to delete ad' });
  }
});

export default router;