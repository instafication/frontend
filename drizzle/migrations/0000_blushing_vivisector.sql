CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`expires_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provider_user` ON `accounts` (`provider_id`,`provider_user_id`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY DEFAULT lower(hex(randomblob(16))) NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`date` integer DEFAULT (strftime('%s','now')),
	`area` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY DEFAULT lower(hex(randomblob(16))) NOT NULL,
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
	`id` text PRIMARY KEY DEFAULT lower(hex(randomblob(16))) NOT NULL,
	`company` text,
	`frequency` integer DEFAULT 5,
	`last_update` integer,
	`last_ping` integer,
	`services` text DEFAULT '[]',
	`params` text DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY DEFAULT lower(hex(randomblob(16))) NOT NULL,
	`user` text NOT NULL,
	`name` text NOT NULL,
	`notification_method` text NOT NULL,
	`notification_within_time` text NOT NULL,
	`options` text DEFAULT '{}'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_user_name_unique` ON `services` (`user`,`name`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`session_created_at` integer DEFAULT (strftime('%s','now'))
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT 0,
	`name` text,
	`image` text,
	`created_at` integer DEFAULT (strftime('%s','now')),
	`updated_at` integer DEFAULT (strftime('%s','now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`vt_expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `identifier_token` ON `verification_tokens` (`identifier`,`token`);