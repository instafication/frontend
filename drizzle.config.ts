import 'dotenv/config'; // make sure to install dotenv package
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    out: './src/drizzle',
    schema: './src/drizzle/schema.ts',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        host: "db.dkavcpubobbtovqtobkv.supabase.co",
        port: 5432,
        user: "postgres",
        password: process.env.DB_PASSWORD,   // emx1hmd6pek3wzw@BAT!
        ssl: { rejectUnauthorized: false },  // or the proper CA object
    },
    // Print all statements
    verbose: true,
});
