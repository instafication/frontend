import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/drizzle/schema.ts',
    out: './src/drizzle',
    /* ── use the Supabase Session pooler URL (IPv4 compatible) ── */
    dbCredentials: {
        url: process.env.DATABASE_URL!, // e.g. "postgresql://postgres.<project_ref>:<pw>@aws-0-eu-north-1.pooler.supabase.com:5432/postgres?sslmode=no-verify"
    },
    verbose: true,
});
