// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { createAuth } from './lib/server/auth';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			language: string;
			db: DrizzleD1Database;
			auth: ReturnType<typeof createAuth>;
			user?: unknown;
		}
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
		// interface PageData {}
	}
}

export {};
