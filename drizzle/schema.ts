import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

export const profiles = sqliteTable('profiles', {
	id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
	email: text('email').unique(),
	name: text('name'),
	phone: text('phone').unique(),
	credits: integer('credits').default(3),
	subscription_expiration_date: text('subscription_expiration_date'),
	raw_user_meta_data: text('raw_user_meta_data', { mode: 'json' })
});

export const services = sqliteTable(
	'services',
	{
		id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
		user: text('user').notNull(),
		name: text('name').notNull(),
		notificationMethod: text('notification_method').notNull(),
		notificationWithinTime: text('notification_within_time').notNull(),
		options: text('options', { mode: 'json' }).default('{}')
	},
	(t) => [unique('services_user_name_unique').on(t.user, t.name)]
);

export const scrapers = sqliteTable('scrapers', {
	id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
	company: text('company'),
	frequency: integer('frequency').default(5),
	last_update: integer('last_update', { mode: 'number' }),
	last_ping: integer('last_ping', { mode: 'number' }),
	services: text('services', { mode: 'json' }).default('[]'),
	params: text('params', { mode: 'json' }).default('{}')
});

export const notifications = sqliteTable('notifications', {
	id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
	title: text('title').notNull(),
	body: text('body').notNull(),
	date: integer('date', { mode: 'number' }).default(sql`(strftime('%s','now'))`),
	area: text('area').notNull()
});

// ---------------------------------------------------------------------------
//  BetterAuth core tables (SQLite). If you use @better-auth/cli, prefer
//  generating these to a separate file and importing instead of inlining.
// ---------------------------------------------------------------------------
export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	email_verified: integer('email_verified', { mode: 'boolean' }).default(sql`0`),
	name: text('name'),
	image: text('image'),
	role: text('role'),
	banned: integer('banned', { mode: 'boolean' }),
	ban_reason: text('ban_reason'),
	ban_expires: integer('ban_expires', { mode: 'number' }),
	created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	user_id: text('user_id').notNull(),
	expires_at: integer('expires_at', { mode: 'number' }).notNull(),
	created_at: integer('session_created_at', { mode: 'number' }).default(sql`(strftime('%s','now'))`)
});

export const accounts = sqliteTable(
	'accounts',
	{
		id: text('id').primaryKey(),
		user_id: text('user_id').notNull(),
		provider_id: text('provider_id').notNull(),
		provider_user_id: text('provider_user_id').notNull(),
		access_token: text('access_token'),
		refresh_token: text('refresh_token'),
		expires_at: integer('expires_at', { mode: 'number' }),
		password: text('password')
	},
	(t) => [unique('provider_user').on(t.provider_id, t.provider_user_id)]
);

export const verification_tokens = sqliteTable(
	'verification_tokens',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires_at: integer('vt_expires_at', { mode: 'number' }).notNull()
	},
	(t) => [unique('identifier_token').on(t.identifier, t.token)]
);

import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
// ---------------------------------------------------------------------------
//  Valibot schemas & types (generated via drizzle-valibot)
// ---------------------------------------------------------------------------
import * as v from 'valibot';

/* PROFILES */
export const ProfileSelectSchema = createSelectSchema(profiles);
export const ProfileInsertSchema = createInsertSchema(profiles);
export const ProfileUpdateSchema = createUpdateSchema(profiles);

export type Profile = v.InferOutput<typeof ProfileSelectSchema>;
export type ProfileInsert = v.InferInput<typeof ProfileInsertSchema>;
export type ProfileUpdate = v.InferInput<typeof ProfileUpdateSchema>;

/* SERVICES
   – We want `notificationWithinTime` as a number when inserting/updating,
	 even though the column is stored as TEXT in SQLite.
*/
export const ServiceSelectSchema = createSelectSchema(services);
export const ServiceInsertSchema = createInsertSchema(services, {
	notificationWithinTime: v.number() // overwrite field schema
});
export const ServiceUpdateSchema = createUpdateSchema(services, {
	notificationWithinTime: v.optional(v.number())
});

export type Service = v.InferOutput<typeof ServiceSelectSchema>;
export type ServiceInsert = v.InferInput<typeof ServiceInsertSchema>;
export type ServiceUpdate = v.InferInput<typeof ServiceUpdateSchema>;

/* SCRAPERS */
export const ScraperSelectSchema = createSelectSchema(scrapers);
export const ScraperInsertSchema = createInsertSchema(scrapers);
export const ScraperUpdateSchema = createUpdateSchema(scrapers);

export type Scraper = v.InferOutput<typeof ScraperSelectSchema>;
export type ScraperInsert = v.InferInput<typeof ScraperInsertSchema>;
export type ScraperUpdate = v.InferInput<typeof ScraperUpdateSchema>;

/* NOTIFICATIONS */
export const NotificationSelectSchema = createSelectSchema(notifications);
export const NotificationInsertSchema = createInsertSchema(notifications);
export const NotificationUpdateSchema = createUpdateSchema(notifications);

export type Notification = v.InferOutput<typeof NotificationSelectSchema>;
export type NotificationInsert = v.InferInput<typeof NotificationInsertSchema>;
export type NotificationUpdate = v.InferInput<typeof NotificationUpdateSchema>;
