import { trpc } from '$lib/trpc/client';




async function getAllScrapers() {
    const scrapers = await trpc.get_all_scrapers.query();
    return scrapers
}


export { getAllScrapers }