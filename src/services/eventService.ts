import { eq } from "drizzle-orm";
import { kbEvents, KBEventSchema, cityEvents, CityEventSchema } from "../db/schema.js";
import { drizzle } from "drizzle-orm/postgres-js";

const db = drizzle(process.env.DATABASE_URL!);

export async function saveKBEvents(eventsData: any): Promise<Partial<KBEventSchema>[]> {
  try {
    const events = eventsData.data;
    if (!Array.isArray(events)) {
      throw new Error('Invalid events data format');
    }

    // Get existing event IDs from the database
    const existingEvents = await db.select({ event_id: kbEvents.event_id })
      .from(kbEvents);
    const existingEventIds = new Set(existingEvents.map(e => e.event_id));

    // Filter out events that already exist
    const newEvents = events.filter(event => !existingEventIds.has(event.event_id));

    if (newEvents.length === 0) {
      return [];
    }

    const formattedEvents = newEvents.map(event => ({
      event_id: event.event_id,
      date: event.date,
      start_date: event.start_date,
      end_date: event.end_date,
      name: event.name,
      slug: event.slug,
      description: event.description,
      featured: event.featured,
      recurring: event.recurring,
      frequency: event.frequency,
      poster: event.poster,
      type: event.type,
      price: event.price,
      ticket_active: event.ticket_active,
      multiple_ticketing: event.multiple_ticketing,
      ticketing_url: event.ticketing_url,
      status_id: event.status_id,
      is_virtual: event.is_virtual,
      location_id: event.location_id,
      location_name: event.location_name,
    }));

    await db.insert(kbEvents).values(formattedEvents);
    return formattedEvents;
  } catch (error) {
    console.error('Error saving KB events:', error);
    throw error;
  }
}

export async function saveCityEvents(eventsData: any, source: string): Promise<Partial<CityEventSchema>[]> {
  try {
    const eventsArray = Array.isArray(eventsData) ? eventsData : [eventsData];
    
    // Get existing events from the database for this source
    const existingEvents = await db.select()
      .from(cityEvents)
      .where(eq(cityEvents.source, source));

    // Create a Set of existing event signatures (using combination of fields as unique identifier)
    const existingEventSignatures = new Set(
      existingEvents.map(event => 
        `${event.eventDetails}-${event.venue}-${event.date}-${event.source}`
      )
    );

    // Filter out events that already exist
    const newEvents = eventsArray.filter(event => {
      const eventSignature = `${event.eventDetails}-${event.venue}-${event.date}-${source}`;
      return !existingEventSignatures.has(eventSignature);
    });

    if (newEvents.length === 0) {
      return [];
    }

    const formattedEvents = newEvents.map(event => ({
      eventDetails: event.eventDetails,
      venue: event.venue,
      imageUrl: event.imageUrl,
      city: event.city,
      date: event.date,
      source
    }));

    await db.insert(cityEvents).values(formattedEvents);
    return formattedEvents;
  } catch (error) {
    console.error('Error saving city events:', error);
    throw error;
  }
}

export async function getCityEventsBySource(source: string): Promise<CityEventSchema[]> {

  if (source === 'all') {
    return await db.select().from(cityEvents);
  }
  return await db.select()
    .from(cityEvents)
    .where(eq(cityEvents.source, source));
}

export async function getKBEvents(): Promise<KBEventSchema[]> {
  return await db.select().from(kbEvents);
}

export async function getAllEvents(): Promise<(KBEventSchema | CityEventSchema)[]> {
  const [kbEventsList, cityEventsList] = await Promise.all([
    db.select().from(kbEvents),
    db.select().from(cityEvents)
  ]);
  return [...kbEventsList, ...cityEventsList];
}