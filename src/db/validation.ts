import { z } from 'zod';

export const eventSchema = z.object({
  eventDetails: z.string().min(1),
  venue: z.string().min(1).max(255),
  imageUrl: z.string().url(),
  city: z.string().min(1).max(100),
  date: z.string().transform((str) => new Date(str)),
});

export type Event = z.infer<typeof eventSchema>;