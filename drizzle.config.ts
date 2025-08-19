import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './drizzle/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: 'file:./dev.db' },
	verbose: true,
	strict: true,
	out: './drizzle/migrations'
});