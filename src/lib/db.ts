import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1';

let _db: DrizzleD1Database | undefined;

export const initDB = (env: Env): DrizzleD1Database => {
	if (!_db) _db = drizzle(env.DB);
	return _db;
};

export const db = (): DrizzleD1Database => {
	if (!_db) throw new Error('DB has not been initialised yet.');
	return _db;
};
