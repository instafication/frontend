import {
  sqliteTable,
  text,
  integer,
  unique
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/* ─────────── profiles ─────────── */
export const profiles = sqliteTable('profiles', {
  // D1 has no native UUID type, so store them as TEXT
  id: text('id').primaryKey(),

  email: text('email').unique(),
  name: text('name'),
  phone: text('phone').unique(),

  credits: integer('credits').default(3),

  // store as TEXT (ISO or Unix-seconds string) – SQLite has no TIMESTAMPTZ
  subscription_expiration_date: text('subscription_expiration_date'),
  raw_user_meta_data: text('raw_user_meta_data', { mode: 'json' })             // TEXT + JSON affinity
});

/* ─────────── services ───────────
     single PK on id,
     composite UNIQUE on (user, name)
────────────────────────────────── */
export const services = sqliteTable(
  'services',
  {
    id: text('id').primaryKey(),            // generate UUID in app code

    user: text('user').notNull(),
    name: text('name').notNull(),

    notificationMethod: text('notification_method').notNull(),
    notificationWithinTime: text('notification_within_time').notNull(),

    options: text('options', { mode: 'json' }).default("{}")  // store flexible JSON blob
  },
  (t) => [unique("services_user_name_unique").on(t.user, t.name)]
);

/* ─────────── scrapers ─────────── */
export const scrapers = sqliteTable('scrapers', {
  // AUTOINCREMENT integer primary key
  id: integer('id').primaryKey({ autoIncrement: true }),

  company: text('company'),

  frequency: integer('frequency').default(5),

  // 64-bit Unix-ms timestamps fit in SQLite INTEGER
  last_update: integer('last_update', { mode: 'number' }),
  last_ping: integer('last_ping', { mode: 'number' }),

  // SQLite lacks ARRAY → keep an array as JSON TEXT
  services: text('services', { mode: 'json' }).default('[]'),

  params: text('params', { mode: 'json' }).default('{}')
});

/* ─────────── notifications ─────────── */
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),   // UUID string

  title: text('title').notNull(),
  body: text('body').notNull(),

  // SQLite timestamp -> INTEGER seconds (change to ms if you prefer)
  date: integer('date', { mode: 'number' })
    .default(sql`(strftime('%s','now'))`),    // unix-seconds at insert

  area: text('area').notNull()
});
