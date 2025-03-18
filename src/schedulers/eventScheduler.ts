import cron from 'node-cron';
import { saveKBEvents, saveCityEvents } from '../services/eventService.js';
import { fetchKBEvents, fetchCityEvents } from "../scrapers/eventScraper.js";

export async function fetchAndSaveEvents() {
  try {
    console.log(
      "Starting event fetch at:",
      new Date().toISOString()
    );

    // Fetch and save KB Events
    const kbEventsData = await fetchKBEvents();
    await saveKBEvents(kbEventsData);
    console.log("KB Events saved successfully");

    // Fetch and save City Events
    const cityEventsData = await fetchCityEvents();
    await saveCityEvents(cityEventsData, "manual_fetch");
    console.log("City Events saved successfully");

    return { success: true, message: "Events fetched and saved successfully" };
  } catch (error) {
    console.error("Error in event fetch:", error);
    throw error;
  }
}

// Schedule tasks to run at 6 AM EAT (UTC+3)
cron.schedule(
  "0 6 * * *",
  fetchAndSaveEvents,
  {
    scheduled: true,
    timezone: "Africa/Nairobi",
  }
);

console.log('Event scheduler initialized');
