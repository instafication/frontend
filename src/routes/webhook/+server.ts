// import { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private'
// import { signUp } from '$lib/Managers/AuthManager'
// import { SendEmailWhenUserIsCreated, sendEmail, SendEmailWhenSubscriptionProlonged } from '$lib/Managers/EmailManager'
// import { DatabaseManager } from '$lib/server/databasemanager.js';
// import { json } from "@sveltejs/kit";
// import Stripe from "stripe";


// const stripe = new Stripe(STRIPE_SECRET_KEY, {
//     apiVersion: "2025-07-30.basil",
//     typescript: true,
// });


// class RandomEmailGenerator {
//     private static readonly ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     private static readonly DOMAIN_EXTENSIONS = ['.com', '.org', '.net', '.io', '.co'];

//     private static generateRandomString(length: number): string {
//         let result = '';
//         for (let i = 0; i < length; i++) {
//             const randomIndex = Math.floor(Math.random() * this.ALPHABET.length);
//             result += this.ALPHABET[randomIndex];
//         }
//         return result;
//     }

//     public static generateEmail(): string {
//         const localPartLength = Math.floor(Math.random() * 10) + 1;
//         const domainLength = Math.floor(Math.random() * 5) + 5;

//         const localPart = this.generateRandomString(localPartLength);
//         const domain = this.generateRandomString(domainLength);
//         const domainExtension = this.DOMAIN_EXTENSIONS[Math.floor(Math.random() * this.DOMAIN_EXTENSIONS.length)];

//         return `${localPart}@${domain}${domainExtension}`;
//     }
// }


// async function prolong(email: string): Promise<boolean> {


//     if (email !== null) {

//         console.log("👤 [prolong] Email found: ", email);
//         console.log("✅ [prolong] Product purchased: premium");

//         const userCreated: boolean = await signUp(email, email, true)
//         if (!userCreated) {

//             const prolonged: boolean = await DatabaseManager.Profiles.ProlongSubscriptionByEmail(email, 30);
//             if (prolonged) {
//                 const emailSent: boolean = await SendEmailWhenSubscriptionProlonged(email, "Instafication – Din prenumeration är nu förlängd! 🎉", "Hej, din prenumeration har nu förlängts med 30 dagar!");
//                 console.log("📧 [prolong]Email sent: ", emailSent);
//                 console.log(`✅ [prolong] ${email} has been prolonged: ${prolonged}`);
//             } else {
//                 const emailSent: boolean = await SendEmailWhenSubscriptionProlonged(email, "Instafication – Din prenumeration går inte förlänga 📞", "Hej, din prenumeration går inte förlängas. Vänligen kontakta oss på: Hello@Instafication.shop.");
//                 console.log("📧 [prolong] Email sent: ", emailSent);
//                 console.log("❌ [prolong] User subscription could not be prolonged: ", email);
//                 return false;
//             }

//         } else {
//             console.log("✅ New premium account has been created: ", email);
//             const emailSent: boolean = await SendEmailWhenUserIsCreated(email, "Välkommen till Instafication premium! 🎉", "Välkommen till Instafication premium. Du kan nu logga in med samma email som du använde vid betalning. Lösenordet är detsamma som din email.");
//             console.log("📧 [prolong]Email sent: ", emailSent);
//         }

//     } else {
//         console.error('❌ [prolong] Email is null');
//         return false;
//     }

//     return true;
// }
// async function refill(email: string): Promise<boolean> {

//     //intent.email = "martin.pa.jakobsson@icloud.com";
//     //intent.email = RandomEmailGenerator.generateEmail();
//     //console.log(`🔔 Webhook received: ${intent.object} ${intent.status}!`);
//     //console.log('💰 Payment captured!');
//     // console.log(intent);

//     if (email !== null) {

//         console.log("👤 Email found: ", email);
//         console.log("✅ Product purchased: credits");

//         const userCreated: boolean = await signUp(email, email, true)
//         if (!userCreated) {

//             const refilled: boolean = await DatabaseManager.Profiles.RefillByEmail(email, 2);
//             if (refilled) {
//                 const emailSent: boolean = await SendEmailWhenSubscriptionProlonged(email, "Instafication – Ditt konto har laddats på! 💰", "Hej, ditt konto har nu laddats på med två krediter som du direkt kan använda för notifikationer.");
//                 console.log("📧 [refilled] Email sent: ", emailSent);
//                 console.log(`✅ [refilled] ${email} has been refilled: ${refilled}`);
//             } else {
//                 const emailSent: boolean = await SendEmailWhenSubscriptionProlonged(email, "Instafication – Ditt konto går inte ladda på", "Hej, ditt konto går inte ladda på med nya krediter. Vänligen kontakta oss på: Hello@instafication.shop.");
//                 console.log("📧 [refilled] Email sent: ", emailSent);
//                 console.log("❌ [refilled] User account could not be refilled: ", email);
//                 return false;
//             }

//         } else {
//             console.log("✅ [refilled] New account has been created and refilled: ", email);
//             const emailSent: boolean = await SendEmailWhenUserIsCreated(email, "Välkommen till Instafication! 🎉", "Välkommen till Instafication. Du kan nu logga in med samma email som du använde vid betalning. Lösenordet är detsamma som din email.");
//             console.log("📧 [refilled] Email sent: ", emailSent);
//         }

//     } else {
//         console.error('Email not found in PaymentIntent');
//         return false;
//     }

//     return true;
// }



// /** @type {import('./$types').RequestHandler} */
// export async function POST({ request }) {

//     let event: Stripe.Event;
//     const rawBody = await request.text()
//     const signature = request.headers.get('stripe-signature');

//     // console.log('Raw body:', req);
//     // console.log('Stripe signature header:', request.headers.get('stripe-signature'));
//     // console.log('Webhook secret:', STRIPE_WEBHOOK_SECRET);

//     try {
//         event = stripe.webhooks.constructEvent(
//             rawBody,
//             signature,
//             STRIPE_WEBHOOK_SECRET
//         );
//     } catch (err) {
//         console.log("⚠️ Webhook signature verification failed.");
//     }

//     // Extract the data from the event.
//     const data: Stripe.Event.Data = event.data;
//     const eventType: string = event.type;
//     let intent: Stripe.PaymentIntent;

//     if (eventType === 'checkout.session.completed') {

//         intent = data.object as Stripe.PaymentIntent;
//         const email: string = intent.customer_details.email;
//         console.log(`✅ ${intent.customer_details.name, intent.customer_details.email} paid ${intent.amount_total / 100} sek for: ${intent.metadata.plan}!`);

//         if (intent.metadata.plan === "basic") {

//             const refilled: boolean = await refill(email);
//             if (refilled) {
//                 console.log(`✅ [invoice.paid] ${email} refilled, paid with ${intent.payment_method_types[0]}`);
//             } else {
//                 console.log(`❌ [invoice.paid] ${email} could not be refilled, paid with ${intent.payment_method_types[0]}`);
//             }

//         } else if (intent.metadata.plan === "premium") {

//             const prolonged: boolean = await prolong(email);
//             if (prolonged) {
//                 console.log(`✅ [invoice.paid'] ${email} prolonged, paid with ${intent.payment_method_types[0]}`);
//             } else {
//                 console.log(`❌ [invoice.paid'] ${email} could not be prolonged, paid with ${intent.payment_method_types[0]}`);
//             }

//         } else {
//             console.log("❌ [checkout.session.completed] Unknown metadata plan: ", intent.metadata.plan);
//         }

//     } else if (eventType === 'invoice.paid') {

//         const invoice = data.object as Stripe.Invoice;
//         const email: string = invoice.customer_email;
//         console.log("💰 [invoice.paid'] Subscription renewal paid for: ", invoice.lines.data[0].plan?.product);

//         console.log(invoice);
//         //prod_NhwXD5rubTmHMw === Basic
//         //prod_NhZ5sps4EIDyae === Premium
//         if (invoice.lines.data[0].plan?.product === "prod_NhZ5sps4EIDyae") {

//             const prolonged: boolean = await prolong(email);
//             if (prolonged) {
//                 console.log(`✅ [invoice.paid'] ${email} prolonged`);
//             } else {
//                 console.log(`❌ [invoice.paid'] ${email} could not be prolonged`);
//             }

//         } else if (invoice.lines.data[0].plan?.product === "prod_NhwXD5rubTmHMw") {

//             const refilled: boolean = await refill(email);
//             if (refilled) {
//                 console.log(`✅ [invoice.paid] ${email} refilled`);
//             } else {
//                 console.log(`❌ [invoice.paid] ${email} could not be refilled`);
//             }

//         } else {
//             console.log("❌ [invoice.paid'] Unknown product: ", invoice.lines.data[0].plan?.product);
//             return json({ received: false });
//         }


//     } else if (eventType === 'payment_intent.payment_failed') {

//         intent = data.object as Stripe.PaymentIntent;
//         console.log(`🔔 [payment_intent.payment_failed] Webhook received: ${intent.object} ${intent.status}!`);
//         console.log("❌ [payment_intent.payment_failed] Payment failed for: ", intent.receipt_email);
//         return json({ received: false });

//     } else {

//         intent = data.object as Stripe.PaymentIntent;
//         console.log(`❌ Webhook not implemented: ${intent.object} ${intent.status}!`);
//         //console.log(intent);
//     }


//     return json({ received: true });

// };


// // export stripe };