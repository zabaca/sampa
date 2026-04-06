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

export const programNotes = sqliteTable("program_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  program: text("program").notNull(),
  note: text("note").notNull(),
  sort_order: integer("sort_order").default(0).notNull(),
});
