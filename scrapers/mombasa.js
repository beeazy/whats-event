const axios = require('axios');
const cheerio = require('cheerio');

// Utility function to clean text
function cleanText(text) {
    return text.replace(/[\n\t\r]+/g, '').trim();
}

// Regular expression to match dates in the format "Day DDth Month"
const dateRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon\.|Tue\.|Wed\.|Thu\.|Fri\.|Sat\.|Sun\.) \d{1,2}(st|nd|rd|th) [A-Za-z]+$/;

async function getMombasaEvents() {
    const response = await axios.get('https://whats-on-mombasa.com/');
    const html = response.data;

    const $ = cheerio.load(html);
    const groupedEvents = [];

    const seenEvents = new Set(); // Set to store unique event combinations

    $('td').each((i, el) => {
        const $element = $(el);

        // Look for the date element
        const dateElement = $element.find('font[color="#FFFFFF"]');
        if (dateElement.length) {
            const rawDate = cleanText(dateElement.text());
            if (dateRegex.test(rawDate)) {
                // Add the event date to the groupedEvents object if it's valid
                if (!groupedEvents[rawDate]) groupedEvents[rawDate] = [];
            }
        }

        // Loop through the event links
        $element.find('a[href^="Pics/"]').each((j, eventEl) => {
            const $event = $(eventEl);
            const imageUrl = 'https://whats-on-mombasa.com/' + $event.attr('href');
            const venue = cleanText($event.find('b font').first().text());
            const eventName = cleanText($event.parent().find('font').not('b font').text());

            if (imageUrl && venue && eventName) {
                const lastValidDate = Object.keys(groupedEvents).pop();
                if (lastValidDate) {
                    // Create a unique key based on event details
                    const uniqueKey = `${eventName}-${venue}-${imageUrl}`;
                    if (!seenEvents.has(uniqueKey)) {
                        seenEvents.add(uniqueKey);
                        groupedEvents[lastValidDate].push({
                            eventDetails: eventName,
                            venue,
                            imageUrl,
                            city: 'Mombasa',
                            date: lastValidDate
                        });
                    }
                }
            }
        });
    });

    // Flatten the groupedEvents object into an array
    const uniqueEvents = Object.values(groupedEvents).flat();

    return uniqueEvents;
}

module.exports = { getMombasaEvents };