CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`date` integer DEFAULT (strftime('%s','now')),
	`area` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`name` text,
	`phone` text,
	`credits` integer DEFAULT 3,
	`subscription_expiration_date` text,
	`raw_user_meta_data` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_email_unique` ON `profiles` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_phone_unique` ON `profiles` (`phone`);--> statement-breakpoint
CREATE TABLE `scrapers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company` text,
	`frequency` integer DEFAULT 5,
	`last_update` integer,
	`last_ping` integer,
	`services` text DEFAULT '[]',
	`params` text DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`name` text NOT NULL,
	`notification_method` text NOT NULL,
	`notification_within_time` text NOT NULL,
	`options` text DEFAULT '{}'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_user_name_unique` ON `services` (`user`,`name`);