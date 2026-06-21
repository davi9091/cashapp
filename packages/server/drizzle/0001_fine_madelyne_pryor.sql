CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`currency` text NOT NULL,
	`balance_cents` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer,
	`name` text NOT NULL,
	`icon` text,
	`color` text,
	`parent_id` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `group_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`joined_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer NOT NULL,
	`account_id` integer NOT NULL,
	`category_id` integer,
	`name` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`currency` text NOT NULL,
	`billing_cycle` text NOT NULL,
	`billing_day` integer NOT NULL,
	`next_billing_date` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`category_id` integer,
	`amount_cents` integer NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`date` integer NOT NULL,
	`created_by_user_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transfer_pairs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`from_transaction_id` integer NOT NULL,
	`to_transaction_id` integer NOT NULL,
	FOREIGN KEY (`from_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
-- Seed default system categories (group_id IS NULL = available to all groups)
INSERT INTO categories (name, icon, color, parent_id, group_id) VALUES
  ('Food & Drink',  '🍔', '#F97316', NULL, NULL),
  ('Transport',     '🚗', '#3B82F6', NULL, NULL),
  ('Housing',       '🏠', '#8B5CF6', NULL, NULL),
  ('Health',        '🏥', '#EF4444', NULL, NULL),
  ('Entertainment', '🎬', '#EC4899', NULL, NULL),
  ('Shopping',      '🛍️', '#F59E0B', NULL, NULL),
  ('Income',        '💰', '#22C55E', NULL, NULL),
  ('Savings',       '🏦', '#06B6D4', NULL, NULL),
  ('Education',     '📚', '#6366F1', NULL, NULL),
  ('Travel',        '✈️', '#14B8A6', NULL, NULL);
INSERT INTO categories (name, icon, color, parent_id, group_id) VALUES
  ('Groceries',      '🛒', '#F97316', 1, NULL),
  ('Restaurants',    '🍽️', '#F97316', 1, NULL),
  ('Coffee',         '☕',  '#F97316', 1, NULL),
  ('Public Transit', '🚌', '#3B82F6', 2, NULL),
  ('Fuel',           '⛽', '#3B82F6', 2, NULL),
  ('Parking',        '🅿️', '#3B82F6', 2, NULL),
  ('Rent',           '🔑', '#8B5CF6', 3, NULL),
  ('Utilities',      '💡', '#8B5CF6', 3, NULL),
  ('Internet',       '📡', '#8B5CF6', 3, NULL),
  ('Medical',        '🩺', '#EF4444', 4, NULL),
  ('Pharmacy',       '💊', '#EF4444', 4, NULL),
  ('Gym',            '🏋️', '#EF4444', 4, NULL),
  ('Streaming',      '📺', '#EC4899', 5, NULL),
  ('Games',          '🎮', '#EC4899', 5, NULL),
  ('Events',         '🎟️', '#EC4899', 5, NULL),
  ('Clothing',       '👗', '#F59E0B', 6, NULL),
  ('Electronics',    '📱', '#F59E0B', 6, NULL),
  ('Salary',         '💼', '#22C55E', 7, NULL),
  ('Freelance',      '🧑‍💻', '#22C55E', 7, NULL),
  ('Investment',     '📈', '#22C55E', 7, NULL);
