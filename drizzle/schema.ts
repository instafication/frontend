import {
  sqliteTable,
  text,
  integer,
  unique
} from 'drizzle-orm/sqlite-core';
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

export const services = sqliteTable(
  'services',
  {
    id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
    user: text('user').notNull(),
    name: text('name').notNull(),
    notificationMethod: text('notification_method').notNull(),
    notificationWithinTime: text('notification_within_time').notNull(),
    options: text('options', { mode: 'json' }).default("{}")  // store flexible JSON blob
  },
  (t) => [unique("services_user_name_unique").on(t.user, t.name)]
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
