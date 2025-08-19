# 📱 Instafication - Smart Booking Notifications

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-3982CE?style=for-the-badge&logo=Drizzle&logoColor=black)](<[https://Drizzle.io/](https://orm.drizzle.team/)>)

Instafication is a smart notification service that monitors booking systems and instantly alerts you via SMS or email when new appointment slots become available. Never miss a booking opportunity again!

## ✨ Features

- 🔔 **Real-time Notifications** - Get instant SMS/email alerts when bookings become available
- 🏠 **Multi-Service Support** - Monitor laundry, parking, rental bookings and more
- 🌍 **Internationalization** - Available in multiple languages (Swedish, English)
- 💳 **Flexible Pricing** - Pay-per-use or monthly subscription options
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔐 **Secure Authentication** - Google OAuth and email/password login
- ⚡ **High-Performance Scraping** - Efficient monitoring with configurable intervals
- 🎯 **Smart Filtering** - Get notifications only for your preferred areas and timeframes

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x or higher (Bun 1.2+ recommended)
- Cloudflare D1 database
- BetterAuth (email/password) with Drizzle ORM
- Stripe account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/instafication/frontend.git
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory (values are examples):

   ```env
   BETTER_AUTH_SECRET=your_random_secret
   # Public analytics (optional)
   PUBLIC_POSTHOG_KEY=phc_xxx
   PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. **Set up the database**

   ```bash
   # Generate migrations from the Drizzle schema
   bun run generate
   
   # Apply to the local SQLite file (dev.db) or to D1 if configured
   bun run push
   ```

5. **Apply D1 migrations (remote D1)**
   If you're targeting a remote Cloudflare D1, ensure you have valid credentials in `wrangler.toml` or env variables used by `drizzle.config.ts`, then:
   ```bash
   bun run migrate:prod
   ```

6. **Start the development server**
   ```bash
   # Option A: Vite dev server (no CF bindings, good for UI work)
   bun run dev
   
   # Option B: Full Cloudflare Workers dev with D1 bindings
   bunx wrangler dev --x-remote-bindings --port=5173 --local --persist-to=.wrangler/state
   ```

Visit `http://localhost:5173` to see the application running!

## 🛠️ Development

### Available Scripts

- `bun run build` - Build for production
- `bun run dev` - Start development server
- `bun run deploy` - Deploy project to Cloudflare

### Project Structure

```
src/
├── lib/
│   ├── Components/          # Reusable Svelte components
│   ├── Managers/           # Business logic managers
│   ├── server/             # Server-side utilities
│   ├── i18n.ts            # Internationalization
│   └── translations.ts    # Translation strings
├── routes/
│   ├── +layout.svelte     # Main layout
│   ├── +page.svelte       # Landing page
│   ├── [...api]/          # API routes
│   ├── payment/           # Payment handling
│   └── webhook/           # Webhook endpoints
└── app.html               # HTML template
```

### Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS + Flowbite + Bits UI/shadcn-svelte ports
- **Database**: Cloudflare D1 with Drizzle ORM
- **Authentication**: BetterAuth (D1 + Drizzle)
- **Payments**: Stripe integration
- **Deployment**: Cloudflare Workers support
- **Email**: Resend integration

### Authentication

- Email/password is enabled with BetterAuth. In development, email verification is disabled.
- On successful sign‑up, a session cookie is set and the UI auto‑logs in. No activation email is sent in dev.
- Key endpoints (served under `basePath` `/api/auth`):
  - POST `/api/auth/sign-up/email` with `{ email, password }`
  - POST `/api/auth/sign-in/email` with `{ email, password }`

## 📊 Database Schema

Core tables include:

- Product tables: `profiles`, `services`, `scrapers`, `notifications`
- Auth tables (BetterAuth): `users`, `sessions`, `accounts`, `verifications`, `apikeys`

Generated auth schema lives at `drizzle/generated.auth.schema.ts`. If you upgrade BetterAuth and need to refresh the schema, regenerate with the BetterAuth CLI.

## 🔧 Configuration

### Service Configuration

Users can configure:

- Notification method (Email)
- Notification timing (1 hour, 1 day, 2 days in advance)
- Service areas (e.g., specific housing areas)
- Service types (laundry, parking, rentals)

### Scraper Configuration

Administrators can configure:

- Scraping frequency (minutes)
- Target companies/services
- Service parameters
- Monitoring areas

## 🚀 Deployment

### Cloudflare

1. Install Wrangler: `bun i -g wrangler`
2. Configure `wrangler.toml`
3. Run: `bun run deploy`

Optional envs used by `drizzle.config.ts` when pushing via HTTP driver:

```bash
export DRIZZLE_USE_D1=1
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_DATABASE_ID=...
export CLOUDFLARE_D1_TOKEN=...
```

### Troubleshooting

- If sign‑up returns 4xx due to schema mismatches, regenerate and push migrations, then apply to remote D1:
  - `bun run generate && bun run push` (local) or `bun run migrate:prod` (remote)
- To inspect D1 during dev:
  - `wrangler d1 execute prod --remote --command "PRAGMA table_info('users');"`

## 💰 Pricing Model

Instafication offers two pricing tiers:

1. **Pay-per-notification**: 9 SEK for 2 notifications
2. **Monthly subscription**: 19 SEK/month for unlimited notifications (30-day free trial)

## 🌐 Supported Services

Currently supports:

- **Stockholms Studentbostäder (SSSB)** - Laundry booking monitoring
- More services coming soon!

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (Rome)
- Add JSDoc comments for complex functions
- Use semantic commit messages

### Webhooks

- Stripe payment webhooks
- Notification delivery webhooks

## 🔐 Security

- All API routes are protected with authentication
- Sensitive data is encrypted
- CORS properly configured
- Rate limiting on API endpoints

## 📄 License

MIT License — see `LICENSE` for details.


---

Made with ❤️ by the Instafication team
