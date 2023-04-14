import { SECRET_STRIPE_PUBLISHABLE_KEY, SECRET_STRIPE_SECRET_KEY, SECRET_STRIPE_WEBHOOK_SECRET } from '$env/static/private'
import { signUp } from '$lib/Managers/AuthManager'
import { SendEmailWhenUserIsCreated, sendEmail, SendEmailWhenSubscriptionProlonged } from '$lib/Managers/EmailManager'
import { DatabaseManager } from '$lib/server/managers/databasemanager.js';
import { json } from "@sveltejs/kit";
import Stripe from "stripe";


const stripe = new Stripe(SECRET_STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
    typescript: true,
});



class RandomEmailGenerator {
    private static readonly ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    private static readonly DOMAIN_EXTENSIONS = ['.com', '.org', '.net', '.io', '.co'];

    private static generateRandomString(length: number): string {
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * this.ALPHABET.length);
            result += this.ALPHABET[randomIndex];
        }
        return result;
    }

    public static generateEmail(): string {
        const localPartLength = Math.floor(Math.random() * 10) + 1;
        const domainLength = Math.floor(Math.random() * 5) + 5;

        const localPart = this.generateRandomString(localPartLength);
        const domain = this.generateRandomString(domainLength);
        const domainExtension = this.DOMAIN_EXTENSIONS[Math.floor(Math.random() * this.DOMAIN_EXTENSIONS.length)];

        return `${localPart}@${domain}${domainExtension}`;
    }
}


async function prolong(invoice: Stripe.Invoice): Promise<boolean> {

    //intent.email = "martin.pa.jakobsson@icloud.com";
    //intent.email = RandomEmailGenerator.generateEmail();
    //console.log(`🔔 Webhook received: ${intent.object} ${intent.status}!`);
    //console.log('💰 Payment captured!');
    //console.log(intent);

    if (invoice.customer_email !== null) {

        const email: string = invoice.customer_email;

        console.log("👤 Email found: ", email);
        console.log("✅ Product purchased: ", invoice.lines.data[0].description);

        const userCreated: boolean = await signUp(email, "Sweden2023!!", true)
        if (!userCreated) {

            const prolonged: boolean = await DatabaseManager.Profiles.ProlongSubscriptionByEmail(email, 30);
            if (prolonged) {
                const emailSent: boolean = await SendEmailWhenSubscriptionProlonged(email, "Blinksms – Din prenumeration är nu förlängd!", "Hej, din prenumeration har nu förlängts med 30 dagar!");
                console.log("📧 Email sent: ", emailSent);
                console.log(`✅ ${email} subscription has been prolonged: ${prolonged}`);
            } else {
                const emailSent: boolean = await SendEmailWhenSubscriptionProlonged(email, "Blinksms – Din prenumeration går inte förlänga", "Hej, din prenumeration går inte förlängas. Vänligen kontakta oss på: hej@blinksms.se eller i Discord-kanalen för att komma vidare.");
                console.log("📧 Email sent: ", emailSent);
                console.log("❌ User subscription could not be prolonged: ", email);
                return false;
            }

        } else {
            console.log("✅ New premium account has been created: ", email);
            const emailSent: boolean = await SendEmailWhenUserIsCreated(email, "Välkommen till Blinksms premium! 🎉", "Välkommen till Blinksms premium. Du kan nu logga in med samma email som du använde vid betalning. Lösenordet är detsamma som din email.");
            console.log("📧 Email sent: ", emailSent);
        }

    } else {
        console.error('Email not found in PaymentIntent');
        return false;
    }

    return true;
}
async function refill(intent: Stripe.PaymentIntent): Promise<boolean> {

    //intent.email = "martin.pa.jakobsson@icloud.com";
    //intent.email = RandomEmailGenerator.generateEmail();
    console.log(`🔔 Webhook received: ${intent.object} ${intent.status}!`);
    console.log('💰 Payment captured!');
    console.log(intent);

    if (intent.customer_details.email !== null) {

        console.log("👤 Email found: ", intent.customer_details.email);
        console.log("[+] Product purchased: ", intent.metadata.plan);
        console.log(intent);

        const userCreated: boolean = await signUp(intent.customer_details.email, "Sweden2023!!", true)
        if (!userCreated) {

            const prolonged: boolean = await DatabaseManager.Profiles.ProlongSubscriptionByEmail(intent.customer_details.email, 30);
            console.log("📝 User subscription has been prolonged 30 days from now: ", prolonged);
            if (prolonged) {
                const emailSent: boolean = await SendEmailWhenSubscriptionProlonged(intent.customer_details.email, "Blinksms – Välkommen till Premium!", "Hej, premium har nu aktiveras för ditt konto. Du har nu 30 dagar på dig att testa tjänsten. Om du inte vill fortsätta med tjänsten så kommer din prenumeration att avslutas automatiskt efter 30 dagar. Du kan alltid välja att avsluta prenumerationen tidigare genom att logga in på ditt konto och avsluta prenumerationen. Om du vill fortsätta med tjänsten så behöver du inte göra något. Din prenumeration kommer att förlängas automatiskt efter 30 dagar. Du kommer då få en ny faktura på ditt konto. Du kan alltid välja att avsluta prenumerationen genom att logga in på ditt konto och avsluta prenumerationen.");
                console.log("📧 Email sent: ", emailSent);

            } else {
                console.log("📧 User subscription could not be prolonged: ", intent.customer_details.email);
            }

        } else {
            console.log("📧 New premium account has been created: ", intent.customer_details.email);
        }



    } else {
        console.error('Email not found in PaymentIntent');
    }
}



/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    let event: Stripe.Event;
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature');

    //console.log('Raw body:', req);
    // console.log('Stripe signature header:', request.headers.get('stripe-signature'));
    // console.log('Webhook secret:', SECRET_STRIPE_WEBHOOK_SECRET);


    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            SECRET_STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log("⚠️ Webhook signature verification failed.");
    }

    // Extract the data from the event.
    const data: Stripe.Event.Data = event.data;
    const eventType: string = event.type;
    let intent: Stripe.PaymentIntent;

    if (eventType === 'checkout.session.completed') {

        intent = data.object as Stripe.PaymentIntent;

        //console.log(intent);
        console.log(`✅ ${intent.customer_details.name, intent.customer_details.email} paid ${intent.amount_total / 100} sek for: ${intent.metadata.plan}!`);

        if (intent.metadata.plan === "basic") {
            //refill(intent);
        } else if (intent.metadata.plan === "premium") {
            //prolong(intent);
        } else {
            console.log("❌ Unknown metadata plan: ", intent.metadata.plan);
        }

    } else if (eventType === 'invoice.paid') {

        const invoice = data.object as Stripe.Invoice;
        console.log("💰 [invoice.paid'] Subscription renewal paid for: ", invoice.lines.data[0].plan?.product);
        //console.log(invoice);
        // Make sure its the correct product (start of free trail).
        //prod_NhwXD5rubTmHMw === Basic
        //prod_NhZ5sps4EIDyae === Premium
        if (invoice.lines.data[0].plan?.product === "prod_NhZ5sps4EIDyae") {

            const prolonged: boolean = await prolong(invoice);
            if (prolonged) {
                console.log("✅ [invoice.paid'] Subscription prolonged for: ", invoice.lines.data[0].plan?.product);
            } else {
                console.log("❌ [invoice.paid'] Subscription could not be prolonged");
            }

        } else {
            console.log("❌ [invoice.paid'] Unknown product: ", invoice.lines.data[0].plan?.product);
            return json({ received: false });
        }


    } else if (eventType === 'payment_intent.payment_failed') {

        intent = data.object as Stripe.PaymentIntent;
        console.log(`🔔 Webhook received: ${intent.object} ${intent.status}!`);
        console.log('❌ Payment failed for: ', intent.receipt_email);
        return json({ received: false });

    } else {

        intent = data.object as Stripe.PaymentIntent;
        console.log(`❌ Webhook not implemented: ${intent.object} ${intent.status}!`);
        //console.log(intent);
        // Send email about declined payment

    }


    return json({ received: true });

};