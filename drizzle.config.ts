import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'drizzle-kit';
import toml from 'toml';

function readWranglerToml() {
	try {
		const filePath = path.resolve(process.cwd(), 'wrangler.toml');
		const content = fs.readFileSync(filePath, 'utf8');
		return toml.parse(content) as Record<string, unknown>;
	} catch (_) {
		return null;
	}
}

const wrangler = readWranglerToml();
const useD1 = process.env.DRIZZLE_USE_D1 === '1' || process.env.DRIZZLE_USE_D1 === 'true';

const d1AccountId = process.env.CLOUDFLARE_ACCOUNT_ID || wrangler?.vars?.CLOUDFLARE_ACCOUNT_ID;
const d1DatabaseId = process.env.CLOUDFLARE_DATABASE_ID || wrangler?.d1_databases?.[0]?.database_id;
const d1Token = process.env.CLOUDFLARE_D1_TOKEN || wrangler?.vars?.CLOUDFLARE_D1_TOKEN;

export default defineConfig({
	schema: './drizzle/schema.ts',
	dialect: 'sqlite',
	...(useD1 && d1AccountId && d1DatabaseId && d1Token
		? {
				driver: 'd1-http' as const,
				dbCredentials: {
					accountId: d1AccountId,
					databaseId: d1DatabaseId,
					token: d1Token
				}
			}
		: { dbCredentials: { url: 'file:./dev.db' } }),
	verbose: true,
	strict: true,
	out: './drizzle/migrations'
});
