import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "../src/lib/db";
import { seed } from "../src/lib/seed";

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");

  const shouldSeed = process.argv.includes("--seed");
  if (shouldSeed) {
    console.log("Seeding data...");
    await seed();
    console.log("Seed complete.");
  }
}

main().catch(console.error);
