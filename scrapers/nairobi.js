const axios = require('axios');
const cheerio = require('cheerio');

// Utility function to clean text
function cleanText(text) {
  return text.replace(/[\n\t\r]+/g, '').trim();
}

// Regular expression to match dates in the format "Day DDth Month"
const dateRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \d{1,2}(st|nd|rd|th) [A-Za-z]+$/;

async function getNairobiEvents() {
  const response = await axios.get('https://whats-on-nairobi.com/');
  const html = response.data;

  const $ = cheerio.load(html);
  const groupedEvents = {}; // Object to store events grouped by date
  const seenEvents = new Set(); // Set to store unique event keys

  $('td').each((i, el) => {
    const $element = $(el);

    // Find the date element
    const dateElement = $element.find('font[color="#FFFFFF"]');
    if (dateElement.length) {
      const rawDate = cleanText(dateElement.text());
      if (dateRegex.test(rawDate)) {
        // Initialize the date key in groupedEvents if not already present
        if (!groupedEvents[rawDate]) groupedEvents[rawDate] = [];
      }
    }

    // Find event links and details
    $element.find('a[href^="PICS/"]').each((j, eventEl) => {
      const $event = $(eventEl);
      const imageUrl = 'https://whats-on-nairobi.com/' + $event.attr('href');
      const venue = cleanText($event.find('font').first().text());
      const eventName = cleanText($event.find('font').last().text());

      if (imageUrl && venue && eventName) {
        // Get the last valid date
        const lastValidDate = Object.keys(groupedEvents).pop();
        if (lastValidDate) {
          // Create a unique key to ensure no duplicates
          const uniqueKey = `${eventName}-${venue}-${imageUrl}`;
          if (!seenEvents.has(uniqueKey)) {
            seenEvents.add(uniqueKey);
            groupedEvents[lastValidDate].push({
              eventDetails: eventName,
              venue,
              imageUrl,
              city: 'Nairobi',
              date: lastValidDate,
            });
          }
        }
      }
    });
  });

  // Flatten groupedEvents into a single array
  const uniqueEvents = Object.values(groupedEvents).flat();

  return uniqueEvents;
}

module.exports = { getNairobiEvents };
