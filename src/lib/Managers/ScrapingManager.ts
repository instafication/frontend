import { trpc } from '$lib/trpc/client';
import type { Scraper } from '$lib/drizzle/types';




async function getAllScrapers(): Promise<Scraper[]> {
    const scrapers = await trpc.get_all_scrapers.query();
    return scrapers
}


export { getAllScrapers }