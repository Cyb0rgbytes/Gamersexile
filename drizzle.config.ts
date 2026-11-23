import { defineConfig } from "drizzle-kit";

/* Generates SQL migrations from lib/db/schema.ts into migrations/, which
 * wrangler applies to D1 (`npm run db:migrate:local` / `:remote`). */
export default defineConfig({
  dialect: "sqlite",
  schema: "./lib/db/schema.ts",
  out: "./migrations",
});
