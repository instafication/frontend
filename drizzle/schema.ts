
import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';


export const profiles = sqliteTable('profiles', {
	id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
	email: text('email').unique(),
	name: text('name'),
	phone: text('phone').unique(),
	credits: integer('credits').default(3),
	subscription_expiration_date: text('subscription_expiration_date'),
	raw_user_meta_data: text('raw_user_meta_data', { mode: 'json' })
});

export const services = sqliteTable('services', {
	id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
	user: text('user').notNull(),
	name: text('name').notNull(),
	notificationMethod: text('notification_method').notNull(),
	notificationWithinTime: text('notification_within_time').notNull(),
	options: text('options', { mode: 'json' }).default('{}')
}, (t) => [unique('services_user_name_unique').on(t.user, t.name)]);

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
//  Valibot schemas & types (generated via drizzle-valibot)
// ---------------------------------------------------------------------------
import * as v from 'valibot';
import {
	createSelectSchema,
	createInsertSchema,
	createUpdateSchema
} from 'drizzle-valibot';

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
	notificationWithinTime: v.number()          // overwrite field schema
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
