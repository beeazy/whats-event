import { getEvents } from './kbevents.js';
import { getNairobiEvents } from './nairobi.js';
import { getMombasaEvents } from './mombasa.js';

export async function fetchKBEvents() {
    return await getEvents();
}

export async function fetchCityEvents() {
    const nairobiEvents = await getNairobiEvents();
    const mombasaEvents = await getMombasaEvents();
    return [...nairobiEvents, ...mombasaEvents];
}