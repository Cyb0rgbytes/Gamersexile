import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

/* OpenNext adapter config for Cloudflare Workers. The R2 incremental cache
 * backs ISR (time-based revalidation such as the MEE6 leaderboard). */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
