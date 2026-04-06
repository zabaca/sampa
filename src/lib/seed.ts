import { db } from "./db";
import { classes, programNotes, locations } from "./schema";
import { isNull } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

export const seedClasses: InferInsertModel<typeof classes>[] = [
  // ── Adult BJJ (a1–a34) ───────────────────────────────────────
  // Monday
  { id: "a1", program: "Adult BJJ", day: "Mon", time: "5:15 AM", name: "No-Gi", invite_only: 0, age_group: null, location: null },
  { id: "a2", program: "Adult BJJ", day: "Mon", time: "6:15 AM", name: "Fundamental", invite_only: 0, age_group: null, location: null },
  { id: "a3", program: "Adult BJJ", day: "Mon", time: "11:30 AM", name: "All Levels", invite_only: 0, age_group: null, location: null },
  { id: "a4", program: "Adult BJJ", day: "Mon", time: "5:00 PM", name: "Fundamental", invite_only: 0, age_group: null, location: null },
  { id: "a5", program: "Adult BJJ", day: "Mon", time: "6:10 PM", name: "Advanced", invite_only: 1, age_group: null, location: null },
  { id: "a6", program: "Adult BJJ", day: "Mon", time: "7:15 PM", name: "Wrestling", invite_only: 0, age_group: null, location: null },

  // Tuesday
  { id: "a7", program: "Adult BJJ", day: "Tue", time: "5:15 AM", name: "Fundamental", invite_only: 0, age_group: null, location: null },
  { id: "a8", program: "Adult BJJ", day: "Tue", time: "6:15 AM", name: "No-Gi", invite_only: 0, age_group: null, location: null },
  { id: "a9", program: "Adult BJJ", day: "Tue", time: "11:30 AM", name: "Open Mat", invite_only: 0, age_group: null, location: null },
  { id: "a10", program: "Adult BJJ", day: "Tue", time: "5:00 PM", name: "No-Gi", invite_only: 0, age_group: null, location: null },
  { id: "a11", program: "Adult BJJ", day: "Tue", time: "6:10 PM", name: "Competition Training", invite_only: 1, age_group: null, location: null },

  // Wednesday
  { id: "a12", program: "Adult BJJ", day: "Wed", time: "5:15 AM", name: "No-Gi", invite_only: 0, age_group: null, location: null },
  { id: "a13", program: "Adult BJJ", day: "Wed", time: "6:15 AM", name: "Fundamental", invite_only: 0, age_group: null, location: null },
  { id: "a14", program: "Adult BJJ", day: "Wed", time: "11:30 AM", name: "All Levels", invite_only: 0, age_group: null, location: null },
  { id: "a15", program: "Adult BJJ", day: "Wed", time: "5:00 PM", name: "Fundamental", invite_only: 0, age_group: null, location: null },
  { id: "a16", program: "Adult BJJ", day: "Wed", time: "6:10 PM", name: "Advanced", invite_only: 1, age_group: null, location: null },
  { id: "a17", program: "Adult BJJ", day: "Wed", time: "7:15 PM", name: "Positional Drilling", invite_only: 0, age_group: null, location: null },

  // Thursday
  { id: "a18", program: "Adult BJJ", day: "Thu", time: "5:15 AM", name: "Fundamental", invite_only: 0, age_group: null, location: null },
  { id: "a19", program: "Adult BJJ", day: "Thu", time: "6:15 AM", name: "No-Gi", invite_only: 0, age_group: null, location: null },
  { id: "a20", program: "Adult BJJ", day: "Thu", time: "11:30 AM", name: "Open Mat", invite_only: 0, age_group: null, location: null },
  { id: "a21", program: "Adult BJJ", day: "Thu", time: "5:00 PM", name: "No-Gi", invite_only: 0, age_group: null, location: null },
  { id: "a22", program: "Adult BJJ", day: "Thu", time: "6:10 PM", name: "Competition Training", invite_only: 1, age_group: null, location: null },

  // Friday
  { id: "a23", program: "Adult BJJ", day: "Fri", time: "5:15 AM", name: "No-Gi", invite_only: 0, age_group: null, location: null },
  { id: "a24", program: "Adult BJJ", day: "Fri", time: "6:15 AM", name: "Fundamental", invite_only: 0, age_group: null, location: null },
  { id: "a25", program: "Adult BJJ", day: "Fri", time: "11:30 AM", name: "Open Mat", invite_only: 0, age_group: null, location: null },
  { id: "a26", program: "Adult BJJ", day: "Fri", time: "5:00 PM", name: "All Levels", invite_only: 0, age_group: null, location: null },
  { id: "a27", program: "Adult BJJ", day: "Fri", time: "6:10 PM", name: "No-Gi", invite_only: 0, age_group: null, location: null },

  // Saturday
  { id: "a28", program: "Adult BJJ", day: "Sat", time: "8:00 AM", name: "Fundamental", invite_only: 0, age_group: null, location: null },
  { id: "a29", program: "Adult BJJ", day: "Sat", time: "9:15 AM", name: "No-Gi", invite_only: 0, age_group: null, location: null },
  { id: "a30", program: "Adult BJJ", day: "Sat", time: "10:30 AM", name: "Open Mat", invite_only: 0, age_group: null, location: null },

  // Sunday
  { id: "a31", program: "Adult BJJ", day: "Sun", time: "9:00 AM", name: "Open Mat", invite_only: 0, age_group: null, location: null },
  { id: "a32", program: "Adult BJJ", day: "Sun", time: "10:15 AM", name: "Fundamental", invite_only: 0, age_group: null, location: null },
  { id: "a33", program: "Adult BJJ", day: "Sun", time: "11:30 AM", name: "All Levels", invite_only: 0, age_group: null, location: null },
  { id: "a34", program: "Adult BJJ", day: "Sun", time: "12:30 PM", name: "Competition Training", invite_only: 1, age_group: null, location: null },

  // ── Youth BJJ (y1–y34) ───────────────────────────────────────
  // Monday
  { id: "y1", program: "Youth BJJ", day: "Mon", time: "3:30 PM", name: "Little Champions", invite_only: 0, age_group: "Ages 4-7", location: "Room B" },
  { id: "y2", program: "Youth BJJ", day: "Mon", time: "4:30 PM", name: "Youth Fundamental", invite_only: 0, age_group: "Ages 8-12", location: null },
  { id: "y3", program: "Youth BJJ", day: "Mon", time: "5:30 PM", name: "Teens BJJ", invite_only: 0, age_group: "Ages 13-17", location: null },
  { id: "y4", program: "Youth BJJ", day: "Mon", time: "4:30 PM", name: "Youth No-Gi", invite_only: 0, age_group: "Ages 8-12", location: "Room B" },

  // Tuesday
  { id: "y5", program: "Youth BJJ", day: "Tue", time: "3:30 PM", name: "Tiny Grapplers", invite_only: 0, age_group: "Ages 3-5", location: "Room B" },
  { id: "y6", program: "Youth BJJ", day: "Tue", time: "4:30 PM", name: "Youth Fundamental", invite_only: 0, age_group: "Ages 8-12", location: null },
  { id: "y7", program: "Youth BJJ", day: "Tue", time: "5:30 PM", name: "Teens No-Gi", invite_only: 0, age_group: "Ages 13-17", location: null },
  { id: "y8", program: "Youth BJJ", day: "Tue", time: "4:30 PM", name: "Little Champions", invite_only: 0, age_group: "Ages 4-7", location: "Room B" },

  // Wednesday
  { id: "y9", program: "Youth BJJ", day: "Wed", time: "3:30 PM", name: "Little Champions", invite_only: 0, age_group: "Ages 4-7", location: "Room B" },
  { id: "y10", program: "Youth BJJ", day: "Wed", time: "4:30 PM", name: "Youth Fundamental", invite_only: 0, age_group: "Ages 8-12", location: null },
  { id: "y11", program: "Youth BJJ", day: "Wed", time: "5:30 PM", name: "Teens BJJ", invite_only: 0, age_group: "Ages 13-17", location: null },
  { id: "y12", program: "Youth BJJ", day: "Wed", time: "4:30 PM", name: "Youth Competition", invite_only: 1, age_group: "Ages 8-12", location: "Room B" },

  // Thursday
  { id: "y13", program: "Youth BJJ", day: "Thu", time: "3:30 PM", name: "Tiny Grapplers", invite_only: 0, age_group: "Ages 3-5", location: "Room B" },
  { id: "y14", program: "Youth BJJ", day: "Thu", time: "4:30 PM", name: "Youth Fundamental", invite_only: 0, age_group: "Ages 8-12", location: null },
  { id: "y15", program: "Youth BJJ", day: "Thu", time: "5:30 PM", name: "Teens No-Gi", invite_only: 0, age_group: "Ages 13-17", location: null },
  { id: "y16", program: "Youth BJJ", day: "Thu", time: "4:30 PM", name: "Little Champions", invite_only: 0, age_group: "Ages 4-7", location: "Room B" },

  // Friday
  { id: "y17", program: "Youth BJJ", day: "Fri", time: "3:30 PM", name: "Little Champions", invite_only: 0, age_group: "Ages 4-7", location: "Room B" },
  { id: "y18", program: "Youth BJJ", day: "Fri", time: "4:30 PM", name: "Youth All Levels", invite_only: 0, age_group: "Ages 8-12", location: null },
  { id: "y19", program: "Youth BJJ", day: "Fri", time: "5:30 PM", name: "Teens BJJ", invite_only: 0, age_group: "Ages 13-17", location: null },
  { id: "y20", program: "Youth BJJ", day: "Fri", time: "4:30 PM", name: "Youth No-Gi", invite_only: 0, age_group: "Ages 8-12", location: "Room B" },

  // Saturday
  { id: "y21", program: "Youth BJJ", day: "Sat", time: "9:00 AM", name: "Tiny Grapplers", invite_only: 0, age_group: "Ages 3-5", location: "Room B" },
  { id: "y22", program: "Youth BJJ", day: "Sat", time: "9:00 AM", name: "Little Champions", invite_only: 0, age_group: "Ages 4-7", location: null },
  { id: "y23", program: "Youth BJJ", day: "Sat", time: "10:00 AM", name: "Youth Fundamental", invite_only: 0, age_group: "Ages 8-12", location: null },
  { id: "y24", program: "Youth BJJ", day: "Sat", time: "10:00 AM", name: "Youth No-Gi", invite_only: 0, age_group: "Ages 8-12", location: "Room B" },
  { id: "y25", program: "Youth BJJ", day: "Sat", time: "11:00 AM", name: "Teens BJJ", invite_only: 0, age_group: "Ages 13-17", location: null },
  { id: "y26", program: "Youth BJJ", day: "Sat", time: "11:00 AM", name: "Youth Competition", invite_only: 1, age_group: "Ages 10-15", location: "Room B" },

  // Sunday
  { id: "y27", program: "Youth BJJ", day: "Sun", time: "9:00 AM", name: "Little Champions", invite_only: 0, age_group: "Ages 4-7", location: null },
  { id: "y28", program: "Youth BJJ", day: "Sun", time: "9:00 AM", name: "Tiny Grapplers", invite_only: 0, age_group: "Ages 3-5", location: "Room B" },
  { id: "y29", program: "Youth BJJ", day: "Sun", time: "10:00 AM", name: "Youth Fundamental", invite_only: 0, age_group: "Ages 8-12", location: null },
  { id: "y30", program: "Youth BJJ", day: "Sun", time: "10:00 AM", name: "Youth No-Gi", invite_only: 0, age_group: "Ages 8-12", location: "Room B" },
  { id: "y31", program: "Youth BJJ", day: "Sun", time: "11:00 AM", name: "Teens BJJ", invite_only: 0, age_group: "Ages 13-17", location: null },
  { id: "y32", program: "Youth BJJ", day: "Sun", time: "11:00 AM", name: "Teens No-Gi", invite_only: 0, age_group: "Ages 13-17", location: "Room B" },
  { id: "y33", program: "Youth BJJ", day: "Sun", time: "12:00 PM", name: "Youth Open Mat", invite_only: 0, age_group: "All Ages", location: null },
  { id: "y34", program: "Youth BJJ", day: "Sun", time: "12:00 PM", name: "Youth Competition", invite_only: 1, age_group: "Ages 10-15", location: "Room B" },

  // ── Striking (s1–s23) ────────────────────────────────────────
  // Monday
  { id: "s1", program: "Striking", day: "Mon", time: "6:00 AM", name: "Muay Thai", invite_only: 0, age_group: null, location: null },
  { id: "s2", program: "Striking", day: "Mon", time: "12:00 PM", name: "Boxing", invite_only: 0, age_group: null, location: null },
  { id: "s3", program: "Striking", day: "Mon", time: "5:00 PM", name: "Kickboxing", invite_only: 0, age_group: null, location: null },
  { id: "s4", program: "Striking", day: "Mon", time: "6:10 PM", name: "Muay Thai", invite_only: 0, age_group: null, location: null },

  // Tuesday
  { id: "s5", program: "Striking", day: "Tue", time: "6:00 AM", name: "Boxing", invite_only: 0, age_group: null, location: null },
  { id: "s6", program: "Striking", day: "Tue", time: "5:00 PM", name: "Muay Thai", invite_only: 0, age_group: null, location: null },
  { id: "s7", program: "Striking", day: "Tue", time: "6:10 PM", name: "Striking Fundamentals", invite_only: 0, age_group: null, location: null },

  // Wednesday
  { id: "s8", program: "Striking", day: "Wed", time: "6:00 AM", name: "Muay Thai", invite_only: 0, age_group: null, location: null },
  { id: "s9", program: "Striking", day: "Wed", time: "12:00 PM", name: "Boxing", invite_only: 0, age_group: null, location: null },
  { id: "s10", program: "Striking", day: "Wed", time: "5:00 PM", name: "Kickboxing", invite_only: 0, age_group: null, location: null },
  { id: "s11", program: "Striking", day: "Wed", time: "6:10 PM", name: "Muay Thai", invite_only: 0, age_group: null, location: null },

  // Thursday
  { id: "s12", program: "Striking", day: "Thu", time: "6:00 AM", name: "Boxing", invite_only: 0, age_group: null, location: null },
  { id: "s13", program: "Striking", day: "Thu", time: "5:00 PM", name: "Muay Thai", invite_only: 0, age_group: null, location: null },
  { id: "s14", program: "Striking", day: "Thu", time: "6:10 PM", name: "Striking Fundamentals", invite_only: 0, age_group: null, location: null },

  // Friday
  { id: "s15", program: "Striking", day: "Fri", time: "6:00 AM", name: "Muay Thai", invite_only: 0, age_group: null, location: null },
  { id: "s16", program: "Striking", day: "Fri", time: "12:00 PM", name: "Boxing", invite_only: 0, age_group: null, location: null },
  { id: "s17", program: "Striking", day: "Fri", time: "5:00 PM", name: "Kickboxing", invite_only: 0, age_group: null, location: null },
  { id: "s18", program: "Striking", day: "Fri", time: "6:10 PM", name: "Muay Thai Advanced", invite_only: 1, age_group: null, location: null },

  // Saturday
  { id: "s19", program: "Striking", day: "Sat", time: "8:00 AM", name: "Boxing", invite_only: 0, age_group: null, location: null },
  { id: "s20", program: "Striking", day: "Sat", time: "9:15 AM", name: "Muay Thai", invite_only: 0, age_group: null, location: null },
  { id: "s21", program: "Striking", day: "Sat", time: "10:30 AM", name: "Kickboxing", invite_only: 0, age_group: null, location: null },

  // Sunday
  { id: "s22", program: "Striking", day: "Sun", time: "10:00 AM", name: "Striking Fundamentals", invite_only: 0, age_group: null, location: null },
  { id: "s23", program: "Striking", day: "Sun", time: "11:15 AM", name: "Muay Thai Sparring", invite_only: 1, age_group: null, location: null },
];

export const seedProgramNotes: { program: string; note: string; sort_order: number }[] = [
  { program: "Adult BJJ", note: "All adult classes require a gi unless specified as No-Gi.", sort_order: 1 },
  { program: "Adult BJJ", note: "Advanced and Competition classes are invite-only. Speak with an instructor for access.", sort_order: 2 },
  { program: "Adult BJJ", note: "Open Mat is available to all belt levels.", sort_order: 3 },
  { program: "Youth BJJ", note: "Please arrive 10 minutes early for youth classes.", sort_order: 1 },
  { program: "Youth BJJ", note: "Competition classes require instructor approval.", sort_order: 2 },
  { program: "Youth BJJ", note: "Room B classes are held in the secondary training area.", sort_order: 3 },
  { program: "Striking", note: "All striking classes require hand wraps and gloves.", sort_order: 1 },
  { program: "Striking", note: "Sparring sessions require headgear and mouthguard.", sort_order: 2 },
  { program: "Striking", note: "Advanced Muay Thai is invite-only.", sort_order: 3 },
];

export const seedLocations: InferInsertModel<typeof locations>[] = [
  { name: "Main Mat", is_default: 1 },
  { name: "Room B", is_default: 0 },
];

export async function seed() {
  await db.delete(programNotes);
  await db.delete(classes);
  await db.delete(locations);
  await db.insert(locations).values(seedLocations);
  await db.insert(classes).values(seedClasses);
  // Set null locations to the default
  const defaultLoc = seedLocations.find((l) => l.is_default === 1);
  if (defaultLoc) {
    await db.update(classes).set({ location: defaultLoc.name }).where(isNull(classes.location));
  }
  await db.insert(programNotes).values(seedProgramNotes);
}
