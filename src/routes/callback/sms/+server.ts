import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EmailManager } from '../../../lib/Managers/EmailManager';
import { DatabaseManager } from '$lib/server/managers/databasemanager';
// import { SmsManager } from '../../../../lib/Managers/SmsManager';
import qs from 'query-string';

export const POST = (async ({ request }) => {

    const jsonData = qs.parse(await request.text());

    const customersNumber: string = jsonData.from?.toString() || "";	// Phone number from which the SMS was sent
    const myNumber = jsonData.to;
    const message = jsonData.message?.toString().toLowerCase().trim();	// The message sent
    const command = message?.split(" ")[0]; // start or stop
    let area: string = "";
    let UUID: string = "";

    if (command === "start" && message?.split(" ")[1] !== undefined) {
        area = message?.split(" ")[1].toLowerCase(); // area = ['Medicinaren', 'Jerum', 'Lappkärrsberget']
    }

    console.log(jsonData);
    console.log("SMS from: " + customersNumber);
    console.log("SMS to: " + myNumber);
    console.log("SMS message: " + message);
    console.log("SMS command: " + command)


    EmailManager.sendEmail("SMS from: " + customersNumber, "SMS received from " + customersNumber + " with message: " + message);
    const userExists = await DatabaseManager.Profiles.userExistsByPhone(customersNumber);
    console.log(userExists);

    if (userExists === false && command === "start") {
        if (area !== undefined && area !== null && area !== "" && (area === "medicinaren" || area === "jerum" || area === "lappkärrsberget")) {
            const createdSuccess = await DatabaseManager.Profiles.createUser({ phone: customersNumber, area: area, active: true });
            console.log("Created new by phone: " + createdSuccess);

            const message = `Du har nu startat notiser för ${area}. Du har 6 notiser kvar. Därefter måste du skicka 'Betala' för att köpa nya notiser.`
            //await smsManager.sendSMS(customersNumber, message)
            console.log("[+] Created new user: " + customersNumber);
            return new Response(message, { status: 200 });
        } else {
            const message = `Du måste ange vilket område. Skriv: Start [Medicinaren/Jerum/Lappkärrsberget]. Exempelvis: Start Medicinaren`;
            //await smsManager.sendSMS(customersNumber, message)
            console.log("[+] User tried to start without area: " + customersNumber);
            return new Response(message, { status: 200 });
        }
    }

    if (command === "start" && userExists) {

        await DatabaseManager.Profiles.setUserActiveByPhone(customersNumber, true);
        const credits = await DatabaseManager.Profiles.getCreditsByPhone(customersNumber);
        const message = `Du har nu startat notiser. Du har ${credits} notiser kvar. Därefter måste du skicka 'Betala' för att köpa nya notiser. Svara 'Stop' för att stänga av notiser.`;
        //await SmsManager.sendSMS(customersNumber, message)
        console.log(`[!] User exists, started notifications for area ${area}: ` + customersNumber);
        return new Response(message, { status: 200 });

    } else if (command === "stop" && userExists) {

        const credits = await DatabaseManager.Profiles.getUserIdByPhone(customersNumber);
        await DatabaseManager.Profiles.setUserActiveByPhone(customersNumber, false)
        const message = `Du har nu stängt av notiser. Svara 'Start' för att starta notiser igen. Du har ${credits} notiser kvar. Därefter måste du skicka 'Betala' för att köpa nya notiser.`;
        //await SmsManager.sendSMS(customersNumber, message);
        console.log("[!] User exists, stopped notifications: " + customersNumber);
        return new Response(message, { status: 200 });
    } else if (command === "stop" && !userExists) {
        const message = "Du måste e.x. skicka 'Start Medicinaren' för att registrera ditt nummer och få notiser.";
        //await SmsManager.sendSMS(customersNumber, message);
        return new Response(message, { status: 200 });
    } else if (command === "betala" && userExists) {
        const message = "Du kan betala via Swish och Revolut. Svara '1' för att betala med Swish och '2' för att betala med Revolut.";
        //await SmsManager.sendSMS(customersNumber, message);
        return new Response(message, { status: 200 });
    }

    return json(jsonData);

}) satisfies RequestHandler;
