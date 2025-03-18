import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

type KBEvent = any;

const api: AxiosInstance = axios.create({
  baseURL: process.env.PRIMARY_API_URL,
});

const categoryApi: AxiosInstance = axios.create({
  baseURL: process.env.SECONDARY_API_URL,
});

export async function getEvents(): Promise<any> {
    const response = await api.get("evntsAll");

    if (!response.data) {
      console.error('Empty response received');
      return [];
    }
  return response.data;
}

export async function getCategories(): Promise<any> {
  const response = await api.get("evntCategories");
  return response.data;
}

export async function getEventsByCategory(categorySlug: string): Promise<KBEvent[]> {
  const response = await categoryApi.get<KBEvent[]>(
    `events/list/all-category-events/${categorySlug}/1`
  );
  return response.data;
}