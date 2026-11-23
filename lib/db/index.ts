import "server-only";
import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

/* One place to get a typed Drizzle client over the D1 binding `DB`.
 * Works in Server Components, Server Actions and Route Handlers, in
 * production (Workers) and in `next dev` (local Miniflare D1, see
 * next.config.ts). Async form is safe in statically rendered code too. */

export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}

/** The R2 bucket holding uploaded clips and thumbnails. */
export async function getClipsBucket() {
  const { env } = await getCloudflareContext({ async: true });
  return env.CLIPS;
}

export { schema };
