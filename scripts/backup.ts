import { db } from "../src/lib/db";
import { classes, programNotes, locations, classColors } from "../src/lib/schema";

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outPath = `backups/backup-${timestamp}.json`;

const data = {
  exported_at: new Date().toISOString(),
  classes: await db.select().from(classes),
  locations: await db.select().from(locations),
  classColors: await db.select().from(classColors),
  programNotes: await db.select().from(programNotes),
};

await Bun.write(outPath, JSON.stringify(data, null, 2));
console.log(`Backup saved to ${outPath}`);
console.log(`  ${data.classes.length} classes`);
console.log(`  ${data.locations.length} locations`);
console.log(`  ${data.classColors.length} class colors`);
console.log(`  ${data.programNotes.length} program notes`);
