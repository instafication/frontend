import type { RequestHandler } from './$types';
import { DatabaseManager } from '$lib/server/databasemanager';
import {
	sendEmail,
	SendEmailWhenUserIsCreated,
	sendLaundryNotification
} from '$lib/Managers/EmailManager';
import type { Scraper } from '$lib/drizzle/types';
import type { JsonValue } from 'type-fest';

export interface postTemplate {
	company: string;
	services: string[];
	params: postParamsSssb;
}
export interface postParamsSssb {
	date: string; //
	time: string; // Unix timestamp
	area: string; //
}

async function HandleSssb(scraper: Scraper): Promise<Response> {
	const params = scraper.params as JsonValue;
	const area =
		params && typeof params === 'object' && 'area' in params
			? (params as { area: string }).area
			: '';
	const paramDate =
		params && typeof params === 'object' && 'date' in params
			? (params as { date: string }).date
			: '';
	const paramTime =
		params && typeof params === 'object' && 'time' in params
			? (params as { time: string }).time
			: '';
	console.log(`[Scraper] New data from ${area}: ${`${paramDate} ${paramTime}`}.`);

	const now = new Date();
	now.setUTCHours(now.getUTCHours() + 2);
	const currentYear = now.getFullYear();
	const dateString = `${paramDate} ${paramTime}`;

	console.log(dateString);
	console.log(`${paramDate} ${paramTime}`);
	const [, , date, monthName, startTime]: any | null = dateString.match(
		/([A-ZÅÄÖ]{3})\s(\d+)\s([A-Z]{3})\s(\d\d:\d\d)/
	);

	const monthNames = [
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
	];
	const monthNumber = monthNames.indexOf(monthName) + 1;
	const fullDateString = `${currentYear}-${monthNumber.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}T${startTime}:00`;
	const dateObj = new Date(fullDateString);
	dateObj.setUTCHours(dateObj.getUTCHours() + 2);
	const unixTimestamp = dateObj.getTime() / 1000;

	console.log('Now: ', now);
	console.log('Laundry time: ', dateObj);
	console.log('Now - Laundry time: ', Math.abs(dateObj.getTime() - now.getTime()));
	console.log('Now - Laundry time: ', Math.abs(dateObj.getTime() - now.getTime()) < 259200000);

	console.log(`[/api/callback/scraper] Date string: ${fullDateString}`);
	console.log(`[/api/callback/scraper] Unix timestamp: ${unixTimestamp}`);
	console.log(`[/api/callback/scraper] Date string: ${dateObj.toString()}`);

	console.log(scraper.company);
	console.log('area', area);
	const storedLastUpdated: number = await DatabaseManager.Scraper.getLastUpdated('area', area);
	console.log(`Last updated: ${storedLastUpdated}`);

	// Check if the stored date and time is the same as the new one
	if (storedLastUpdated === dateObj.getTime()) {
		console.log('[Scraper] New data is the same as the stored data, no SMS sent.');
		return new Response('New data is the same as the stored data, no SMS sent.', { status: 200 });
	}

	// Check if the stored date and time is the same as the new one and if dateObj is more close than 3 days from now:
	if (
		storedLastUpdated !== dateObj.getTime() &&
		Math.abs(dateObj.getTime() - now.getTime()) < 259200000
	) {
		console.log(
			'[/api/callback/scraper] Date is not same as before and is more close then 3 days from now. SMS sent to all active users.'
		);
		console.log('Ceckpoint 1: ', area);
		const updated: boolean = await DatabaseManager.Scraper.updateLastUpdatedByCompanyAndParam(
			'area',
			area,
			dateObj.getTime()
		);
		console.log('Updated last_update: ', updated);

		// Add the notification to notifications table
		const notificationTitle: string = `Ny tid och datum i ${area}`;
		const notificationMessage: string = `Ny tid och datum i ${area}: ${`${paramDate} ${paramTime}`}.`;
		const notificationArea: string = area;
		const notificationDate: string = dateObj.toString();
		const success = await DatabaseManager.Notifications.createNotification({
			title: notificationTitle,
			body: notificationMessage,
			area: notificationArea,
			date: notificationDate
		});
		console.log(`[/api/callback/scraper] Notification created: ${success}`);

		try {
			const usersByArea: any = await DatabaseManager.Services.getUserIdsByOptions('area', area);
			if (usersByArea.length > 0) {
				const userIds: string[] = usersByArea.map((user: any) => user.user);
				console.log('[/api/callback/scraper] Users with setting activated: ');
				console.log(usersByArea);
				console.log('[/api/callback/scraper] UserIds: ');
				console.log(userIds);
				const usersWithCredits: any[] =
					await DatabaseManager.Profiles.getUsersWithCreditsByUserIds(userIds);
				console.log('[/api/callback/scraper] usersWithCredits: ');
				console.log(usersWithCredits);

				for (const user of usersWithCredits) {
					console.log('[/api/callback/scraper] User found and active for area with credits: ');
					console.log(user);

					// Check notification method by service
					usersByArea.forEach(async (userInside: any) => {
						if (userInside.user === user.id) {
							// Calculate the difference in minutes
							const differenceInSeconds = Math.abs(dateObj.getTime() - now.getTime()) / 1000;

							console.log(`[+] Difference in seconds: ${differenceInSeconds}`);
							console.log(
								`[+] Is free time more close than user setting: ${differenceInSeconds < userInside.notificationWithinTime}`
							);

							if (differenceInSeconds > userInside.notificationWithinTime) {
								console.log(
									`[/api/callback/scraper] Free time is more far away, user configuration (sec): ${userInside.notificationWithinTime}`
								);
							} else {
								const success = await DatabaseManager.Profiles.removeOneCreditFromUserID(user.id);
								const credits = await DatabaseManager.Profiles.getUserCreditsByID(user.id);

								console.log(
									`[/api/callback/scraper] Sending laundry notification email to: '${user.email}' for area: '${area}'`
								);
								if (userInside.notificationMethod === 'e-post' && userInside.user == user.id) {
									const hasSent = await sendLaundryNotification(
										user.email,
										area,
										paramDate,
										paramTime
									);
								} else if (userInside.service === 'SMS' && userInside.user === user.id) {
									//const hasSent = await sendSMS(user.id, message);
									console.log('[/api/callback/scraper] SMS not sent!');
								} else {
									console.log(
										`[/api/callback/scraper] No notification method found for user: ${userInside.id}`
									);
								}
							}
						}
					});

					//await SmsManager.sendSMS(user.id, message);
				}
			} else {
				console.log(
					`[/api/callback/scraper] No users found with setting activated for area: ${area}`
				);
			}
		} catch (error: any) {
			console.log(`[/api/callback/scraper] No users for area found: ${error.cause}`);
		}

		return new Response(
			'Date is not same as before and is more close then 3 days from now. SMS sent to all active users.',
			{ status: 200 }
		);
	} else {
		console.log('[/api/callback/scraper] New data is not closer to now than 3 days, no SMS sent.');
		return new Response('New data is not closer to now than 3 days, no SMS sent.', { status: 200 });
	}
}

export const POST = (async ({ request }) => {
	try {
		const scraper: Scraper = await request.json();
		console.log('[/api/callback/scraper] Received scraper data:', JSON.stringify(scraper, null, 2));

		if (scraper.company === 'Stockholms Studentbostäder') {
			const params: postParamsSssb = JSON.parse(JSON.stringify(scraper.params));

			if (params === undefined) {
				console.log('[!] Missing params');
				return new Response('Missing params', { status: 400 });
			} else if (params.area === undefined) {
				console.log('[!] Missing area');
				return new Response('Missing area', { status: 400 });
			} else if (params.date === undefined) {
				console.log('[!] Missing date');
				return new Response('Missing date', { status: 400 });
			} else if (params.time === undefined) {
				console.log('[!] Missing time');
				return new Response('Missing time', { status: 400 });
			}

			console.log(scraper.params);
			console.log(`[+] Scraper: ${scraper.company}`);
			const exists = await DatabaseManager.Scraper.existsByCompanyNameAndParamValue(
				'area',
				params.area
			);
			console.log(`[+] Scraper exists: ${exists}`);

			if (exists === false) {
				await DatabaseManager.Scraper.createScraper(scraper);
				console.log(`[+] Scraper created: ${scraper.company} (${scraper.id}) `);
			}

			const updated: boolean =
				await DatabaseManager.Scraper.updatePingTimestampByCompanyNameAndParamValue(
					'area',
					params.area,
					Date.now()
				);
			console.log(`[+] Scraper ping updated: ${updated}`);

			try {
				const response: Response = await HandleSssb(scraper);
				console.log(`[+] Scraper response: ${response.status} (${response.statusText})`);
				return response;
			} catch (handlerError) {
				console.error(`[/api/callback/scraper] Error in HandleSssb: ${handlerError}`);
				return new Response(`Internal server error in handler: ${handlerError}`, { status: 500 });
			}
		} else {
			console.log(`[!] Unknown company: ${scraper.company}`);
			return new Response('Unknown service', { status: 400 });
		}
	} catch (error) {
		console.error(`[/api/callback/scraper] Error processing request: ${error}`);
		return new Response(`Internal server error: ${error}`, { status: 500 });
	}
}) satisfies RequestHandler;
