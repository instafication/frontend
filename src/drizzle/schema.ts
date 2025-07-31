import {
  pgTable,
  varchar,
  integer,
  json,
  uuid,
  bigint,
  text,
  timestamp,
  uniqueIndex,              // ← import this helper
} from 'drizzle-orm/pg-core';

/* ─────────── profiles ─────────── */
export const profiles = pgTable('profiles', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 255 }).unique(),
  credits: integer('credits').default(3),
  subscription_expiration_date: varchar('subscription_expiration_date', { length: 255 }),
  raw_user_meta_data: json('raw_user_meta_data'),
});

/* ─────────── services ───────────
     single PK on id,
     composite UNIQUE on (user, name)
────────────────────────────────── */
export const services = pgTable(
  'services',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    user: varchar('user', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),

    notificationMethod: varchar('notification_method', { length: 255 }).notNull(),
    notificationWithinTime: varchar('notification_within_time', { length: 255 }).notNull(),
    options: json('options').default({}),
  },
  (t) => ({
    userNameUnique: uniqueIndex('services_user_name_unique').on(t.user, t.name),
  }),
);

/* ─────────── scrapers ─────────── */
export const scrapers = pgTable('scrapers', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  company: varchar('company', { length: 255 }),
  frequency: integer('frequency').default(5),
  last_update: bigint('last_update', { mode: 'bigint' }),
  last_ping: bigint('last_ping', { mode: 'bigint' }),
  services: text('services').array().default([]),
  params: json('params').default({}),
});

/* ─────────── notifications ─────────── */
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  body: varchar('body', { length: 255 }).notNull(),
  date: timestamp('date').defaultNow(),
  area: varchar('area', { length: 255 }).notNull(),
});
