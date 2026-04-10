import { db } from "../src/lib/db";
import { classes, programNotes, locations, classColors } from "../src/lib/schema";

const backupPath = process.argv[2];
if (!backupPath) {
  console.error("Usage: bun run scripts/restore.ts <backup-file>");
  process.exit(1);
}

const file = Bun.file(backupPath);
if (!(await file.exists())) {
  console.error(`File not found: ${backupPath}`);
  process.exit(1);
}

const data = await file.json();

// Clear existing data
await db.delete(programNotes);
await db.delete(classColors);
await db.delete(classes);
await db.delete(locations);

// Restore
if (data.locations?.length) await db.insert(locations).values(data.locations);
if (data.classes?.length) await db.insert(classes).values(data.classes);
if (data.classColors?.length) await db.insert(classColors).values(data.classColors);
if (data.programNotes?.length) await db.insert(programNotes).values(data.programNotes);

console.log(`Restored from ${backupPath}:`);
console.log(`  ${data.classes?.length ?? 0} classes`);
console.log(`  ${data.locations?.length ?? 0} locations`);
console.log(`  ${data.classColors?.length ?? 0} class colors`);
console.log(`  ${data.programNotes?.length ?? 0} program notes`);
