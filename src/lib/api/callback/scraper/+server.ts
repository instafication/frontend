import type { RequestHandler } from './$types';
import { DatabaseManager } from '$lib/server/databasemanager';

export const POST = (async ({ request }) => {

		const data = await request.json();
		const area = data.area;
		const now = new Date();
		const dateString = `${data.date} ${data.time}`;
		const currentYear = new Date().getFullYear();
		const [, , date, monthName, startTime]: any | null = dateString.match(/([A-Z]{3})\s(\d+)\s([A-Z]{3})\s(\d\d:\d\d)/);

		const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
		const monthNumber = monthNames.indexOf(monthName) + 1;

		const fullDateString = `${currentYear}-${monthNumber.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}T${startTime}:00`;
		const dateObj = new Date(fullDateString);
		const unixTimestamp = dateObj.getTime() / 1000;

		console.log("[Scraper] Date string: " + fullDateString);
		console.log("[Scraper] Unix timestamp: " + unixTimestamp);
		console.log("[Scraper] Date string: " + dateObj.toString());

		let dataExists = await DatabaseManager.Scraper.idExists(area);
		if (dataExists == false) {
			DatabaseManager.Scraper.createArea(area, dateObj.getTime());
		}
		const storedLastUpdated: any | null = await DatabaseManager.Scraper.getLastUpdated(area);
		console.log(storedLastUpdated.last_update);
		console.log(dateObj.getTime());
	
		
		
		// Check if the stored date and time is the same as the new one
		if (dataExists && storedLastUpdated?.last_update == dateObj.getTime()) {
			console.log("[Scraper] New data is the same as the stored data, no SMS sent.");
			return new Response('New data is the same as the stored data, no SMS sent.', { status: 200 });
		}

		// Check if the stored date and time is the same as the new one and if dateObj is more close than 3 days from now:
		if (dataExists && storedLastUpdated.last_update != dateObj.getTime() &&
			Math.abs(dateObj.getTime() - now.getTime()) < 259200000) {
			
			console.log("[Scraper] Date is not same as before and is more close then 3 days from now. SMS sent to all active users.")
			

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
				const users = await DatabaseManager.Profiles.getActiveUsersByArea(area);
				for (const user of users) {

					console.log("[+] User found: " + user.id);
					await DatabaseManager.Profiles.removeOneCreditFromUserID(user.id);
					const credits = await DatabaseManager.Profiles.getUserCreditsByID(user.id);
					const message = `Blinksms.se har hittat en ny tid och datum i ${area}: ${data.date + ' ' + data.time}. Svara "Stop" om du vill sluta leta tvättid och få notiser. Om du vill boka denna tid logga in som vanligt via SSSB. Du har ${credits} notiser kvar. Därefter måste du köpa fler notiser via "Betala".`;
					console.log("[+] Sending SMS to: " + user.id + " with message: " + message);
					//await SmsManager.sendSMS(user.id, message);
				}

			} catch (error: any) {
				console.log("[Scraper] Error: " + error.cause);
			}

			return new Response('Date is not same as before and is more close then 3 days from now. SMS sent to all active users.', { status: 200 });

		} else {
			console.log("[Scraper] New data is not closer to now than 3 days, no SMS sent.");
			return new Response('New data is not closer to now than 3 days, no SMS sent.', { status: 200 });
		}
	
		return new Response('OK', { status: 200 });

}) satisfies RequestHandler;
	