CREATE TABLE `classes` (
	`id` text PRIMARY KEY NOT NULL,
	`program` text NOT NULL,
	`day` text NOT NULL,
	`time` text NOT NULL,
	`name` text NOT NULL,
	`invite_only` integer DEFAULT 0 NOT NULL,
	`age_group` text,
	`location` text
);
--> statement-breakpoint
CREATE TABLE `program_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`program` text NOT NULL,
	`note` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
