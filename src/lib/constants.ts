export const PROGRAMS = ["Adult BJJ", "Youth BJJ", "Striking"] as const;
export type Program = (typeof PROGRAMS)[number];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Day = (typeof DAYS)[number];

export const DAY_FULL: Record<Day, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export const DAY_SHORT: Record<string, Day> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

// Derived from Drizzle schema — single source of truth
import type { InferSelectModel } from "drizzle-orm";
import type { classes } from "./schema";

export type ClassItem = InferSelectModel<typeof classes>;
