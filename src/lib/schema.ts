import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const classes = sqliteTable("classes", {
  id: text("id").primaryKey(),
  program: text("program").notNull(),
  day: text("day").notNull(),
  time: text("time").notNull(),
  name: text("name").notNull(),
  invite_only: integer("invite_only").default(0).notNull(),
  age_group: text("age_group"),
  location: text("location"),
});

export const locations = sqliteTable("locations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  is_default: integer("is_default").default(0).notNull(),
});

export const classColors = sqliteTable("class_colors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  class_name: text("class_name").notNull().unique(),
  color_key: text("color_key").notNull(),
});

export const programNotes = sqliteTable("program_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  program: text("program").notNull(),
  note: text("note").notNull(),
  sort_order: integer("sort_order").default(0).notNull(),
});
