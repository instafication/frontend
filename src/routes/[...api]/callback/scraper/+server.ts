import type { RequestHandler } from './$types';
import { DatabaseManager } from '../../../../lib/server/databasemanager';
import { sendEmail, SendEmailWhenUserIsCreated } from '../../../../lib/Managers/EmailManager';
import type { Prisma, scrapers } from '@prisma/client';


export interface postTemplate {
	company: string;
	services: string[];
	params: postParamsSssb;
};
export interface postParamsSssb {
	date: string; //
	time: string; // Unix timestamp
	area: string; //
}

async function HandleSssb(scraper: scrapers): Promise<Response> {

	const params: Prisma.JsonArray = scraper.params;
	const area = params.area;
	console.log(`[Scraper] New data from ${area}: ${`${params.date} ${params.time}`}.`);

	const now = new Date();
	const currentYear = now.getFullYear();
	const dateString = `${params.date} ${params.time}`;

	console.log(dateString);
	console.log(`${params.date} ${params.time}`);
	const [, , date, monthName, startTime]: any | null = dateString.match(/([A-ZÅÄÖ]{3})\s(\d+)\s([A-Z]{3})\s(\d\d:\d\d)/);

	const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	const monthNumber = monthNames.indexOf(monthName) + 1;

	const timezoneOffset = 2; // GMT+2
	const startTimeWithOffset = new Date(startTime);
	startTimeWithOffset.setHours(startTimeWithOffset.getHours() + timezoneOffset);
	const fullDateString = `${currentYear}-${monthNumber.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}T${startTimeWithOffset.toISOString().slice(11, 16)}:00+02:00`;
	//const fullDateString = `${currentYear}-${monthNumber.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}T${startTime}:00`;
	const dateObj = new Date(fullDateString)
	//dateObj.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
	const unixTimestamp = dateObj.getTime() / 1000;

	console.log(`[/api/callback/scraper] Date string: ${fullDateString}`);
	console.log(`[/api/callback/scraper] Unix timestamp: ${unixTimestamp}`);
	console.log(`[/api/callback/scraper] Date string: ${dateObj.toString()}`);

	console.log(scraper.company);
	console.log("area", area);
	const storedLastUpdated: number = await DatabaseManager.Scraper.getLastUpdated("area", area);
	console.log(`Last updated: ${storedLastUpdated}`);


	// Check if the stored date and time is the same as the new one
	if (storedLastUpdated === dateObj.getTime()) {
		console.log("[Scraper] New data is the same as the stored data, no SMS sent.");
		return new Response('New data is the same as the stored data, no SMS sent.', { status: 200 });
	}

	// Check if the stored date and time is the same as the new one and if dateObj is more close than 3 days from now:
	if (storedLastUpdated !== dateObj.getTime() && Math.abs(dateObj.getTime() - now.getTime()) < 259200000) {

		console.log("[/api/callback/scraper] Date is not same as before and is more close then 3 days from now. SMS sent to all active users.")
		console.log("Ceckpoint 1: ", area);
		const updated: boolean = await DatabaseManager.Scraper.updateLastUpdatedByCompanyAndParam("area", area, dateObj.getTime());
		console.log("Updated last_update: ", updated);

		// Add the notification to notifications table
		const notificationTitle: string = `Ny tid och datum i ${area}`;
		const notificationMessage: string = `Ny tid och datum i ${area}: ${`${params.date} ${params.time}`}.`;
		const notificationArea: string = area;
		const notificationDate: string = dateObj.toString();
		const success = await DatabaseManager.Notifications.createNotification({
			title: notificationTitle,
			body: notificationMessage,
			area: notificationArea,
			date: notificationDate,
		});
		console.log(`[/api/callback/scraper] Notification created: ${success}`);

		try {



			const usersByArea: any = await DatabaseManager.Services.getUserIdsByOptions("area", area);
			if (usersByArea.length > 0) {
				const userIds: string[] = usersByArea.map((user: any) => user.user);
				console.log("[/api/callback/scraper] Users with setting activated: ");
				console.log(usersByArea);
				console.log("[/api/callback/scraper] UserIds: ");
				console.log(userIds);
				const usersWithCredits: any[] = await DatabaseManager.Profiles.getUsersWithCreditsByUserIds(userIds);
				console.log("[/api/callback/scraper] usersWithCredits: ");
				console.log(usersWithCredits);

				for (const user of usersWithCredits) {

					console.log("[/api/callback/scraper] User found and active for area with credits: ");
					console.log(user);
					const message = `Blinksms.se har hittat en ny tvättid i ${area}: ${`${params.date} ${params.time}`}. Om du vill boka denna tid logga in som vanligt via SSSB`;

					// Check notification method by service
					usersByArea.forEach(async (userInside: any) => {

						if (userInside.user === user.id) {

							// Calculate the difference in minutes
							const differenceInSeconds = Math.abs(dateObj.getTime() - now.getTime()) / (1000);


							console.log(`[+] Difference in seconds: ${differenceInSeconds}`);
							console.log(`[+] Is free time more close than user setting: ${(differenceInSeconds < userInside.notificationWithin)}`);


							if (differenceInSeconds > userInside.notificationWithin) {
								console.log(`[/api/callback/scraper] Free time is more far away, user configuration (sec): ${userInside.notificationWithin}`);
							} else {

								const success = await DatabaseManager.Profiles.removeOneCreditFromUserID(user.id);
								const credits = await DatabaseManager.Profiles.getUserCreditsByID(user.id);

								console.log(`[/api/callback/scraper] Sending trigger to: ${user.id} with message: ${message}`);
								if (userInside.notification === "Email" && userInside.user == user.id) {
									const hasSent = await sendEmail(user.email, message);
									console.log(`[/api/callback/scraper] Email sent1: ${hasSent}`);
								} else if (userInside.service === "SMS" && userInside.user === user.id) {
									//const hasSent = await sendSMS(user.id, message);
									console.log("[/api/callback/scraper] SMS not sent!");
								} else {
									console.log(`[/api/callback/scraper] No notification method found for user: ${userInside.id}`);
								}

							}
						}
					});



					//await SmsManager.sendSMS(user.id, message);
				}
			} else {
				console.log(`[/api/callback/scraper] No users found with setting activated for area: ${area}`);
			}

		} catch (error: any) {
			console.log(`[/api/callback/scraper] No users for area found: ${error.cause}`);
		}

		return new Response('Date is not same as before and is more close then 3 days from now. SMS sent to all active users.', { status: 200 });

	} else {
		console.log("[/api/callback/scraper] New data is not closer to now than 3 days, no SMS sent.");
		return new Response('New data is not closer to now than 3 days, no SMS sent.', { status: 200 });
	}

}



export const POST = (async ({ request }) => {

	const scraper: scrapers = await request.json();

	if (scraper.company === "Stockholms Studentbostäder") {
		const params: postParamsSssb = JSON.parse(JSON.stringify(scraper.params));

		if (params === undefined) {
			console.log("[!] Missing params");
			return new Response('Missing params', { status: 400 });
		} else if (params.area === undefined) {
			console.log("[!] Missing area");
			return new Response('Missing area', { status: 400 });
		} else if (params.date === undefined) {
			console.log("[!] Missing date");
			return new Response('Missing date', { status: 400 });
		} else if (params.time === undefined) {
			console.log("[!] Missing time");
			return new Response('Missing time', { status: 400 });
		}

		console.log(scraper.params);
		console.log(`[+] Scraper: ${scraper.company}`);
		const exists = await DatabaseManager.Scraper.existsByCompanyNameAndParamValue("area", params.area);
		console.log(`[+] Scraper exists: ${exists}`);

		if (exists === false) {
			await DatabaseManager.Scraper.createScraper(scraper);
			console.log(`[+] Scraper created: ${scraper.company} (${scraper.id}) `);
		}

		const updated: boolean = await DatabaseManager.Scraper.updatePingTimestampByCompanyNameAndParamValue("area", params.area, Date.now());
		console.log(`[+] Scraper ping updated: ${updated}`);
		const response: Response = await HandleSssb(scraper);
		console.log(`[+] Scraper response: ${response.status} (${response.statusText})`);
		return response;

	} else {
		console.log(`[!] Unknown company: ${scraper.company}`);
		return new Response('Unknown service', { status: 400 });
	}

}) satisfies RequestHandler;

