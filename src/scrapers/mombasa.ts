import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedEvent } from '../types/event.js';

function cleanText(text: string): string {
  return text.replace(/[\n\t\r]+/g, '').trim();
}

const dateRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon\.|Tue\.|Wed\.|Thu\.|Fri\.|Sat\.|Sun\.) \d{1,2}(st|nd|rd|th) [A-Za-z]+$/;

function standardizeMonth(rawDate: string): string {
  return rawDate.replace(/Dezember|Decembar|Decembre|Decembru|Diciembre/gi, 'December');
}

export async function getMombasaEvents(): Promise<ScrapedEvent[]> {
  try {
    const response = await axios.get(process.env.EVENTS_SOURCE_TWO_URL!, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response type:', typeof response.data);
    
    if (!response.data) {
      console.error('Empty response received');
      return [];
    }

    const html = response.data;
    const $ = cheerio.load(html);
    const groupedEvents: Record<string, ScrapedEvent[]> = {};
    const seenEvents = new Set<string>();

  $('td').each((i, el) => {
    const $element = $(el);

    const dateElement = $element.find('font[color="#FFFFFF"]');
    if (dateElement.length) {
      let rawDate = cleanText(dateElement.text());
      rawDate = standardizeMonth(rawDate);
      if (dateRegex.test(rawDate)) {
        if (!groupedEvents[rawDate]) groupedEvents[rawDate] = [];
      }
    }

    $element.find('a[href^="Pics/"]').each((j, eventEl) => {
      const $event = $(eventEl);
      const imageUrl = 'https://whats-on-mombasa.com/' + $event.attr('href');
      const venue = cleanText($event.find('b font').first().text());
      const eventName = cleanText($event.parent().find('font').not('b font').text());

      if (imageUrl && venue && eventName) {
        const lastValidDate = Object.keys(groupedEvents).pop();
        if (lastValidDate) {
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

    const events = Object.values(groupedEvents).flat();
    console.log(`Found ${events.length} events in Mombasa`);
    return events;
  } catch (error) {
    console.error('Error in getMombasaEvents:', error);
    return [];
  }
}