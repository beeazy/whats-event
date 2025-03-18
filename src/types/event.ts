export interface Event {
  id?: number;
  eventDetails: string;
  venue: string;
  imageUrl: string;
  city: string;
  date: Date;
  createdAt?: Date;
  source: string;
}

export interface ScrapedEvent {
  eventDetails: string;
  venue: string;
  imageUrl: string;
  city: string;
  date: string;
}