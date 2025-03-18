import { pgTable, serial, text, timestamp, varchar, boolean, integer } from "drizzle-orm/pg-core";

// Table for KenyaBuzz events (existing)
export const kbEvents = pgTable("kb_events", {
  id: serial("id").primaryKey(),
  event_id: integer("event_id"),
  date: text("date"),
  start_date: text("start_date"),
  end_date: text("end_date"),
  name: text("name"),
  slug: text("slug"),
  description: text("description"),
  featured: boolean("featured").default(false),
  recurring: text("recurring"),
  frequency: integer("frequency"),
  poster: text("poster"),
  type: integer("type").default(0),
  price: text("price"),
  ticket_active: boolean("ticket_active").default(false),
  multiple_ticketing: boolean("multiple_ticketing").default(false),
  ticketing_url: text("ticketing_url"),
  status_id: integer("status_id"),
  is_virtual: boolean("is_virtual").default(false),
  location_id: integer("location_id"),
  contact_email: text("contact_email"),
  contact_phone: text("contact_phone"),
  contact_website: text("contact_website"),
  contact_address: text("contact_address"),
  location_name: text("location_name"),
  location_slug: text("location_slug"),
  recur_frequency: text("recur_frequency"),
  default_date: text("default_date"),
  created_at: timestamp("created_at").defaultNow(),
});

// New table for Mombasa and Nairobi events
export const cityEvents = pgTable("city_events", {
  id: serial("id").primaryKey(),
  eventDetails: text("event_details"),
  venue: varchar("venue", { length: 255 }),
  imageUrl: text("image_url"),
  city: varchar("city", { length: 100 }),
  date: text("date"),
  source: varchar("source", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
});

export type KBEventSchema = typeof kbEvents.$inferSelect;
export type NewKBEvent = typeof kbEvents.$inferInsert;
export type CityEventSchema = typeof cityEvents.$inferSelect;
export type NewCityEvent = typeof cityEvents.$inferInsert;
