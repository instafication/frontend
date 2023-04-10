import type { RequestHandler } from './$types';
import { DatabaseManager } from '../../../../lib/server/managers/databasemanager';
import { sendEmail, SendEmailWhenUserIsCreated } from '../../../../lib/Managers/EmailManager';

interface Template {
	service: string; // Servicename, example: ["Stockholms Studentbostäder", "Hertz Freerider"]
	params: {};
}

interface Sssb {
	area: string; //[Medicinaren, Jerum]
	date: string; //2021-09-01
	time: string; //12:00
}
async function HandleSssb(request: RequestHandler, data: Sssb): Promise<Response> {

	console.log(data);

	const area = data.area;
	const now = new Date();
	const dateString = `${data.date} ${data.time}`;
	const currentYear = new Date().getFullYear();
	const [, , date, monthName, startTime]: any | null = dateString.match(/([A-ZÅÄÖ]{3})\s(\d+)\s([A-Z]{3})\s(\d\d:\d\d)/);

	const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	const monthNumber = monthNames.indexOf(monthName) + 1;

	const fullDateString = `${currentYear}-${monthNumber.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}T${startTime}:00`;
	const dateObj = new Date(fullDateString);
	const unixTimestamp = dateObj.getTime() / 1000;

	// console.log("[/api/callback/scraper] Date string: " + fullDateString);
	// console.log("[/api/callback/scraper] Unix timestamp: " + unixTimestamp);
	// console.log("[/api/callback/scraper] Date string: " + dateObj.toString());

	let dataExists = await DatabaseManager.Scraper.idExists(area);
	if (dataExists == false) {
		await DatabaseManager.Scraper.createArea(area, dateObj.getTime());
	}
	const storedLastUpdated: number | null = await DatabaseManager.Scraper.getLastUpdated(area);
	console.log("Last updated: " + storedLastUpdated?.last_update);
	console.log(dateObj.getTime());



	// Check if the stored date and time is the same as the new one
	if (dataExists && storedLastUpdated?.last_update == dateObj.getTime()) {
		console.log("[Scraper] New data is the same as the stored data, no SMS sent.");
		return new Response('New data is the same as the stored data, no SMS sent.', { status: 200 });
	}

	// Check if the stored date and time is the same as the new one and if dateObj is more close than 3 days from now:
	if (dataExists && storedLastUpdated.last_update != dateObj.getTime() &&
		Math.abs(dateObj.getTime() - now.getTime()) < 259200000) {

		console.log("[/api/callback/scraper] Date is not same as before and is more close then 3 days from now. SMS sent to all active users.")


		await DatabaseManager.Scraper.updateLastUpdated(area, dateObj.getTime());

		// Add the notification to notifications table
		const notificationTitle: string = `Ny tid och datum i ${area}`;
		const notificationMessage: string = `Ny tid och datum i ${area}: ${data.date + ' ' + data.time}.`;
		const notificationArea: string = area;
		const notificationDate: string = dateObj.toString();
		const success = await DatabaseManager.Notifications.createNotification({
			title: notificationTitle,
			body: notificationMessage,
			area: notificationArea,
			date: notificationDate,
		});
		console.log("[/api/callback/scraper] Notification created: " + success);

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
					const message = `Blinksms.se har hittat en ny tvättid i ${area}: ${data.date + ' ' + data.time}. Om du vill boka denna tid logga in som vanligt via SSSB`;

					// Check notification method by service
					usersByArea.forEach(async (userInside: any) => {

						if (userInside.user == user.id) {

							// Calculate the difference in minutes
							const differenceInSeconds = Math.abs(dateObj.getTime() - now.getTime()) / (1000);


							console.log("[+] Difference in seconds: " + differenceInSeconds);
							console.log("[+] Is free time more close than user setting: " + (differenceInSeconds < userInside.notificationWithin));


							if (differenceInSeconds > userInside.notificationWithin) {
								console.log("[/api/callback/scraper] Free time is more far away, user configuration (sec): " + userInside.notificationWithin);
							} else {

								const success = await DatabaseManager.Profiles.removeOneCreditFromUserID(user.id);
								const credits = await DatabaseManager.Profiles.getUserCreditsByID(user.id);

								console.log("[/api/callback/scraper] Sending trigger to: " + user.id + " with message: " + message);
								if (userInside.notification == "Email" && userInside.user == user.id) {
									const hasSent = await sendEmail(user.email, message);
									console.log("[/api/callback/scraper] Email sent1: " + hasSent);
								} else if (userInside.service == "SMS" && userInside.user == user.id) {
									//const hasSent = await sendSMS(user.id, message);
									console.log("[/api/callback/scraper] SMS not sent!");
								} else {
									console.log("[/api/callback/scraper] No notification method found for user: " + userInside.id);
								}

							}
						}
					});



					//await SmsManager.sendSMS(user.id, message);
				}
			} else {
				console.log("[/api/callback/scraper] No users found with setting activated for area: " + area);
			}

		} catch (error: any) {
			console.log("[/api/callback/scraper] No users for area found: " + error.cause);
		}

		return new Response('Date is not same as before and is more close then 3 days from now. SMS sent to all active users.', { status: 200 });

	} else {
		console.log("[/api/callback/scraper] New data is not closer to now than 3 days, no SMS sent.");
		return new Response('New data is not closer to now than 3 days, no SMS sent.', { status: 200 });
	}

	return new Response('OK', { status: 200 });
}

interface Hertz {
	from: string; //Stockholm
	to: string; //Göteborg
}
async function HandleHertz(request: RequestHandler, params: Hertz): Promise<Response> {


	// const sent: boolean = await sendEmail("Hertz Freerider", "marti.pa.jakobsson@icloud.com", "new_booking_time");
	// console.log("Sent: " + sent);

	// if (sent) {
	// 	return new Response('200', { status: 200 });
	// } else {
	// 	return new Response('400', { status: 400 });
	// }
	return new Response('OK', { status: 200 });

}

export const POST = (async ({ request }) => {

	const data: Template = await request.json();
	const service: string = data.service; // "Stockholms Studentbostäder" | "Hertz Freerider"
	console.log(data);

	if (service == "Stockholms Studentbostäder") {
		let params = data.params as Sssb;
		if (params == undefined) {
			console.log("[!] Missing params");
			return new Response('Missing params', { status: 400 });
		} else if (params.area == undefined) {
			console.log("[!] Missing area");
			return new Response('Missing area', { status: 400 });
		} else if (params.date == undefined) {
			console.log("[!] Missing date");
			return new Response('Missing date', { status: 400 });
		} else if (params.time == undefined) {
			console.log("[!] Missing time");
			return new Response('Missing time', { status: 400 });
		}

		const response: Response = await HandleSssb(request, params as Sssb);
		return response;

	} else if (service == "Hertz Freerider") {
		let params = data.params as Hertz;
		const response: Response = await HandleHertz(request, params as Hertz);
		return response;
	} else {
		console.log("[!] Unknown service: " + service);
		return new Response('Unknown service', { status: 400 });
	}

}) satisfies RequestHandler;
