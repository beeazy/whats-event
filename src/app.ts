import express, { Request, Response } from 'express';
import "./schedulers/eventScheduler.js";
import { getCategories } from "./scrapers/kbevents.js";
import { getCityEventsBySource, getKBEvents } from './services/eventService.js';
import eventRoutes from './routes/eventRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/events-nairobi', async (_req: Request, res: Response) => {
  try {
    const events = await getCityEventsBySource('nairobi');
    res.json(events);
  } catch (error) {
    console.error('Error fetching Nairobi events:', error);
    res.status(500).json({ error: 'Failed to fetch Nairobi events' });
  }
});

app.get('/events-mombasa', async (_req: Request, res: Response) => {
  try {
    const events = await getCityEventsBySource('mombasa');
    res.json(events);
  } catch (error) {
    console.error('Error fetching Mombasa events:', error);
    res.status(500).json({ error: 'Failed to fetch Mombasa events' });
  }
});

app.get('/events', async (_req: Request, res: Response) => {
  try {
    const events = await getCityEventsBySource('all');
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get("/events-kb", async (_req: Request, res: Response) => {
  try {
    const events = await getKBEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching Kenya Buzz events:', error);
    res.status(500).json({ error: 'Failed to fetch Kenya Buzz events' });
  }
});

app.get("/categories-kb", async (_req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.use('/api/events', eventRoutes);

// Error handling middleware
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;