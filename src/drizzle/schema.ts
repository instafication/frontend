import { pgTable, varchar, integer, json, uuid, bigint, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 255 }).unique(),
  credits: integer('credits').default(3),
  subscription_expiration_date: varchar('subscription_expiration_date', { length: 255 }),
  raw_user_meta_data: json('raw_user_meta_data'),
});

export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  user: varchar('user', { length: 255 }).notNull(), // UUID
  name: varchar('name', { length: 255 }).notNull(), // Service name
  notification: varchar('notification', { length: 255 }).notNull(), // "Email or SMS"
  notificationWithin: varchar('notification_within', { length: 255 }).notNull(), // "Timestamp, notification within 1 hour, within 1 day or 2 days"
  options: json('options').default({}), // Options for the service
}, (table) => {
  return {
    user_name_unique: primaryKey({ columns: [table.user, table.name] }),
  };
});

export const scrapers = pgTable('scrapers', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  company: varchar('company', { length: 255 }), // Example Stockholms Studentbostäder
  frequency: integer('frequency').default(5), // Example 5, how often to scrape in minutes
  last_update: bigint('last_update', { mode: 'bigint' }), // Example 1620000000, latest booking time found
  last_ping: bigint('last_ping', { mode: 'bigint' }), // Example 1620000000, latest callback from scraper
  services: text('services').array().default([]), // Example ["Laundry, "Renting", "Parking"]
  params: json('params').default({}), // Example {"area": "medicinaren"}
});

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(), // Example 'Ny notification'
  body: varchar('body', { length: 255 }).notNull(), // Example 'Ny tid hittad!'
  date: timestamp('date').defaultNow(), // Example 2021-05-01T00:00:00.000Z
  area: varchar('area', { length: 255 }).notNull(), // Example medicinaren
});