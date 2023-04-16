import { trpc } from '$lib/trpc/client';
import type { scrapers } from '@prisma/client';




async function getAllScrapers(): Promise<scrapers[]> {
    const scrapers = await trpc.get_all_scrapers.query();
    return scrapers
}


export { getAllScrapers }