import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: process.env.TURSO_DATABASE_URL ? "turso" : "sqlite",
  dbCredentials: process.env.TURSO_DATABASE_URL
    ? { url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_DATABASE_TURSO_AUTH_TOKEN! }
    : { url: "file:local.db" },
});
