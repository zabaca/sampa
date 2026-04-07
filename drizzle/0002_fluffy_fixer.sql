CREATE TABLE `class_colors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`class_name` text NOT NULL,
	`color_key` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `class_colors_class_name_unique` ON `class_colors` (`class_name`);
