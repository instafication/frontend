
# 📱 Instafication - Smart Booking Notifications

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)

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

- Node.js 18.x or higher
- PostgreSQL database
- Supabase account (for authentication)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/instafication/frontend.git
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PUBLIC_DATABASE_URL=your_postgresql_connection_string
   PUBLIC_DIRECT_URL=your_postgresql_direct_connection_string
   PUBLIC_SUPABASE_URL=your_supabase_project_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Configure Supabase triggers**
   Run this SQL in your Supabase SQL editor:
   ```sql
   -- Create function to handle new user registration
   create function public.handle_new_user()
   returns trigger
   language plpgsql
   security definer set search_path = public
   as $$
   begin
     insert into public.profiles (id, email)
     values (new.id, new.email);
     return new;
   end;
   $$;

   -- Create trigger for new user registration
   create trigger on_auth_user_created
     after insert on auth.users
     for each row execute procedure public.handle_new_user();
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to see the application running!

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server (Vercel)
- `npm run dev:vite` - Start Vite development server
- `npm run dev:cloudflare` - Start Cloudflare Pages development
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run rome:format` - Format code with Rome

### Project Structure

```
src/
├── lib/
│   ├── Components/          # Reusable Svelte components
│   ├── Managers/           # Business logic managers
│   ├── server/             # Server-side utilities
│   ├── trpc/              # tRPC API routes
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
- **Styling**: Tailwind CSS + Flowbite components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **API**: tRPC for type-safe APIs
- **Payments**: Stripe integration
- **Deployment**: Vercel, Cloudflare Workers support
- **Email**: Sendinblue integration

## 📊 Database Schema

The application uses four main database tables:

- **`profiles`** - User profiles and subscription data
- **`services`** - User service subscriptions and preferences
- **`scrapers`** - Monitoring configuration for different booking systems
- **`notifications`** - Historical notification data

## 🔧 Configuration

### Service Configuration

Users can configure:
- Notification method (SMS/Email)
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

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Cloudflare Workers

1. Install Wrangler: `npm i -g wrangler`
2. Configure `wrangler.toml`
3. Run: `npm run dev:cloudflare`

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

## 📝 API Documentation

### tRPC Routes

The application uses tRPC for type-safe API communication. Key endpoints:

- User management
- Service configuration
- Notification handling
- Payment processing

### Webhooks

- Stripe payment webhooks
- Notification delivery webhooks

## 🔐 Security

- All API routes are protected with authentication
- Sensitive data is encrypted
- CORS properly configured
- Rate limiting on API endpoints

## 📄 License

This project is proprietary software. All rights reserved.

## 🚧 Roadmap

- [ ] iOS/Android mobile apps
- [ ] More booking service integrations
- [ ] Advanced notification filtering
- [ ] Calendar integration
- [ ] Multi-user accounts for families

---

Made with ❤️ by the Instafication team
