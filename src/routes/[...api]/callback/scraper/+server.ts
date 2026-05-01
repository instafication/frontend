import { sendLaundryNotification } from '$lib/Managers/EmailManager';
import {
	notification_Create,
	profile_GetUsersWithCreditsByIds,
	scraper_Create,
	scraper_ExistsByArea,
	scraper_GetLastUpdateByArea,
	scraper_UpdateLastPingByOptionsKeyValue,
	scraper_UpdateLastUpdateByOptionsKeyValue,
	service_GetUserIdsByOptions
} from '../../../db.remote';
import type { RequestHandler } from './$types';

/* --------------------------- Payload interfaces --------------------------- */

export interface postTemplate {
	company: string;
	services: string[];
	params: postParamsSssb;
}
export interface postParamsSssb {
	date: string; // e.g. "MON 8 SEP"
	time: string; // e.g. "13:00-16:10"
	area: string; // e.g. "kungshamra"
}

/* ------------------------------ Utilities -------------------------------- */

// Parse "MON 8 SEP" + "13:00-16:10" -> booking start timestamp (ms)
// NOTE: simple "+2h to force CET/CEST" like your original. Consider a real TZ lib later.
const MONTHS = [
	'JAN',
	'FEB',
	'MAR',
	'APR',
	'MAY',
	'JUN',
	'JUL',
	'AUG',
	'SEP',
	'OCT',
	'NOV',
	'DEC'
] as const;
function parseCETDateTime(paramDate: string, paramTime: string): number {
	const m = `${paramDate} ${paramTime}`.match(/([A-ZÅÄÖ]{3})\s(\d{1,2})\s([A-Z]{3})\s(\d\d:\d\d)/);
	if (!m) throw new Error(`Unparseable date/time: "${paramDate}" "${paramTime}"`);
	const date = Number(m[2]);
	const month = m[3] as (typeof MONTHS)[number];
	const start = m[4];
	const idx = MONTHS.indexOf(month);
	if (idx < 0) throw new Error(`Unknown month: ${month}`);
	const year = new Date().getFullYear();
	const iso = `${year}-${String(idx + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}T${start}:00`;
	const dt = new Date(iso);
	dt.setUTCHours(dt.getUTCHours() + 2); // simplistic CET/CEST push
	return dt.getTime();
}

/* ------------------------ Business handler (local) ------------------------ */

async function HandleSssb(scraperPayload: postTemplate): Promise<Response> {
	const { params } = scraperPayload;
	const area = params.area ?? '';
	const paramDate = params.date ?? '';
	const paramTime = params.time ?? '';

	console.log(`[Scraper] New data from ${area}: ${paramDate} ${paramTime}.`);

	// Parse date & time (CET/CEST simplified)
	const bookingTs = parseCETDateTime(paramDate, paramTime);
	const nowMs = Date.now();

	// Duplicate/age checks
	const storedLastUpdated = await scraper_GetLastUpdateByArea({ key: 'area', value: area }).run();
	if (storedLastUpdated === bookingTs) {
		console.log('[Scraper] Duplicate data – skipping.');
		return new Response('Duplicate data', { status: 200 });
	}

	const withinThreeDays = Math.abs(bookingTs - nowMs) < 3 * 24 * 60 * 60 * 1000;
	if (!withinThreeDays) {
		console.log('[Scraper] New slot is >3 days away – skipping notifications.');
		// Still persist so future duplicates are ignored
		await scraper_UpdateLastUpdateByOptionsKeyValue({
			key: 'area',
			value: area,
			unixTimestamp: bookingTs
		});
		return new Response('Slot is too far in the future', { status: 200 });
	}

	// Persist new timestamp
	await scraper_UpdateLastUpdateByOptionsKeyValue({
		key: 'area',
		value: area,
		unixTimestamp: bookingTs
	});

	// Create notification row
	await notification_Create({
		title: `Ny tid och datum i ${area}`,
		body: `Ny tid och datum i ${area}: ${paramDate} ${paramTime}.`,
		area,
		// If your notifications.date expects seconds, pass Math.floor(bookingTs/1000)
		date: Math.floor(bookingTs / 1000)
	});

	// Notify users
	try {
		const services = await service_GetUserIdsByOptions({ key: 'area', value: area }).run();
		if (!services.length) {
			console.log(`[Scraper] No users configured for area: ${area}`);
			return new Response('No interested users', { status: 200 });
		}

		const userIds = services.map((s) => s.user);
		const profiles = await profile_GetUsersWithCreditsByIds(userIds).run();

		for (const profile of profiles) {
			const serviceCfg = services.find((s) => s.user === profile.id);
			if (!serviceCfg) continue;

			const diffSec = Math.abs(bookingTs - nowMs) / 1000;
			if (diffSec > Number(serviceCfg.notificationWithinTime)) continue;

			if (serviceCfg.notificationMethod === 'e-post') {
				console.log(
					`[Scraper] Sending email to: ${profile.email} for area: ${area}, date: ${paramDate}, time: ${paramTime}`
				);
				try {
					await sendLaundryNotification(profile.email ?? '', area, paramDate, paramTime);
					console.log(
						`[Scraper] Email sent to: ${profile.email} for area: ${area}, date: ${paramDate}, time: ${paramTime}`
					);
				} catch (e) {
					console.warn('[Scraper] sendLaundryNotification failed (continuing):', e);
				}
			} else if (serviceCfg.notificationMethod === 'SMS') {
				console.log(
					`[Scraper] SMS queued for: ${profile.id}, area: ${area}, date: ${paramDate}, time: ${paramTime}`
				);
			}
		}
	} catch (err) {
		console.error(`[Scraper] Error while sending notifications: ${err}`);
	}

	return new Response('Notifications processed', { status: 200 });
}

/* ----------------------------- POST handler ------------------------------ */

export const POST: RequestHandler = (async ({ request }) => {
	try {
		// Parse payload (request.json() is fine; your payload is valid)
		const scraper = (await request.json()) as postTemplate;
		console.log('[Scraper] Incoming payload:', JSON.stringify(scraper, null, 2));

		if (scraper.company !== 'Stockholms Studentbostäder') {
			return new Response('Unknown service', { status: 400 });
		}

		const params = scraper.params;
		if (!params?.area || !params?.date || !params?.time) {
			return new Response('Missing required params', { status: 400 });
		}

		/* Ensure scraper row exists (D1/SQLite json_extract) */
		const exists = await scraper_ExistsByArea({ key: 'area', value: params.area }).run();
		if (!exists) {
			const now = Date.now();
			await scraper_Create({
				company: scraper.company,
				frequency: (scraper as any).frequency ?? 5,
				services: (scraper as any).services ?? [],
				params: (scraper as any).params ?? {},
				last_ping: now,
				last_update: now
			});
			console.log(`[Scraper] New scraper row created for area ${params.area}`);
			// (No early return; continue to normal handling)
		}

		/* Always bump last_ping */
		await scraper_UpdateLastPingByOptionsKeyValue({
			key: 'area',
			value: params.area,
			unixTimestamp: Date.now()
		});
		console.log(`[Scraper] Last ping updated for area ${params.area}`);

		/* Main business logic */
		return await HandleSssb(scraper);
	} catch (error) {
		console.error(`[Scraper] Unhandled error: ${error}`);
		return new Response(
			`Internal error: ${error instanceof Error ? error.message : String(error)}`,
			{ status: 500 }
		);
	}
}) satisfies RequestHandler;
