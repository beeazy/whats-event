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
  const groupedEvents = {};

  $('td').each((i, el) => {
    const $element = $(el);

    const dateElement = $element.find('font[color="#FFFFFF"]');
    if (dateElement.length) {
      const rawDate = cleanText(dateElement.text());
      if (dateRegex.test(rawDate)) {
        if (!groupedEvents[rawDate]) groupedEvents[rawDate] = [];
      }
    }

    $element.find('a[href^="PICS/"]').each((j, eventEl) => {
      const $event = $(eventEl);
      const imageUrl = 'https://whats-on-nairobi.com/' + $event.attr('href');
      const venue = cleanText($event.find('font').first().text());
      const eventDetails = cleanText($event.find('font').last().text());

      if (imageUrl && venue && eventDetails) {
        const lastValidDate = Object.keys(groupedEvents).pop();
        if (lastValidDate) {
          groupedEvents[lastValidDate].push({
            eventDetails,
            venue,
            imageUrl,
            date: lastValidDate,
          });
        }
      }
    });
  });

  return groupedEvents;
}

module.exports = { getNairobiEvents };
