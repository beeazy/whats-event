import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedEvent } from '../types/event.js';

function cleanText(text: string): string {
  return text.replace(/[\n\t\r]+/g, '').trim();
}

const dateRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \d{1,2}(st|nd|rd|th) [A-Za-z]+$/;

function standardizeMonth(rawDate: string): string {
  return rawDate.replace(/Dezember|Decembar|Decembre|Decembru|Diciembre/gi, 'December');
}

export async function getNairobiEvents(): Promise<ScrapedEvent[]> {
  const response = await axios.get(process.env.EVENTS_SOURCE_ONE_URL!);
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

    $element.find('a[href^="PICS/"]').each((j, eventEl) => {
      const $event = $(eventEl);
      const imageUrl = 'https://whats-on-nairobi.com/' + $event.attr('href');
      const venue = cleanText($event.find('font').first().text());
      const eventName = cleanText($event.find('font').last().text());

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
              city: 'Nairobi',
              date: lastValidDate,
            });
          }
        }
      }
    });
  });
  
  const events = Object.values(groupedEvents).flat();
  console.log(`Found ${events.length} events in Nairobi`);

  return events;
}