import express from 'express';
import { fetchAndSaveEvents } from '../schedulers/eventScheduler.js';

const router = express.Router();

router.post('/fetch', async (req, res) => {
  try {
    const result = await fetchAndSaveEvents();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch and save events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;