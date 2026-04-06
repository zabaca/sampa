import { db } from "../src/lib/db";
import { seed } from "../src/lib/seed";

async function migrate() {
  console.log("Creating tables...");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      program TEXT NOT NULL,
      day TEXT NOT NULL,
      time TEXT NOT NULL,
      name TEXT NOT NULL,
      invite_only INTEGER DEFAULT 0,
      age_group TEXT,
      location TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS program_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program TEXT NOT NULL,
      note TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `);

  console.log("Tables created. Seeding data...");
  await seed();

  const result = await db.execute("SELECT COUNT(*) as count FROM classes");
  console.log(`Seeded ${result.rows[0].count} classes.`);

  const notes = await db.execute("SELECT COUNT(*) as count FROM program_notes");
  console.log(`Seeded ${notes.rows[0].count} program notes.`);

  console.log("Migration complete!");
}

migrate().catch(console.error);
