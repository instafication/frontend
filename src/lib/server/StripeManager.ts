// import type { RequestHandler } from "@sveltejs/kit";
// //import { stripe } from "../../routes/webhook/+server"
// import { STRIPE_SECRET_KEY } from '$env/static/private'
// import Stripe from "stripe";

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
//     apiVersion: "2025-07-30.basil",
//     typescript: true,
// });


// async function createPortalByEmail(email: string): Promise<string> {

//     const configuration = await stripe.billingPortal.configurations.create({
//         features: {
//             customer_update: {
//                 allowed_updates: ["email", "tax_id"],
//                 enabled: true,
//             },
//             invoice_history: { enabled: true },
//         },
//         business_profile: {
//             privacy_policy_url: "https://example.com/privacy",
//             terms_of_service_url: "https://example.com/terms",
//         },
//     });

//     const customers = await stripe.customers.search({
//         query: `email:'${email}'`,
//     });

//     if (customers.data.length === 0) {

//         return "";

//     } else {

//         const customerId: string = customers.data[0].id;
//         const session = await stripe.billingPortal.sessions.create({
//             customer: customerId,
//             return_url: "https://Instafication.se",
//         });

//         return session.url;
//     }


// }

// export { createPortalByEmail };