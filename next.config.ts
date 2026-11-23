import type { NextConfig } from "next";

/* gamersexile.net is canonical. Visitors on gamersexile.org (with or without
 * www) are sent to the same path on .net with a permanent 308, so links and
 * search rankings consolidate on one domain. Both domains must point at this
 * deployment in DNS / the host's domain settings for this to take effect. */
const ALT_HOSTS = ["gamersexile.org", "www.gamersexile.org", "www.gamersexile.net"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return ALT_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://gamersexile.net/:path*",
      permanent: true,
    }));
  },
};

export default nextConfig;

/* Local dev: expose the Cloudflare bindings from wrangler.jsonc (D1, R2)
 * to `next dev` through getCloudflareContext(), backed by local Miniflare
 * storage in .wrangler/. No effect on production builds. */
import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
