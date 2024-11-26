const express = require('express');
const { getNairobiEvents } = require('./scrapers/nairobi');
const { getMombasaEvents } = require('./scrapers/mombasa');

const app = express();
const port = 3000;

app.get('/events-nairobi', async (req, res) => {
  try {
    const events = await getNairobiEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching Nairobi events:', error);
    res.status(500).json({ error: 'Failed to fetch Nairobi events' });
  }
});

app.get('/events-mombasa', async (req, res) => {
  try {
    const events = await getMombasaEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching Mombasa events:', error);
    res.status(500).json({ error: 'Failed to fetch Mombasa events' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
