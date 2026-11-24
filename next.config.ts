import type { NextConfig } from "next";

/* gamersexile.net is canonical. Visitors on gamersexile.org (with or without
 * www) are sent to the same path on .net with a permanent 308, so links and
 * search rankings consolidate on one domain. Both domains must point at this
 * deployment in DNS / the host's domain settings for this to take effect. */
const ALT_HOSTS = ["gamersexile.org", "www.gamersexile.org", "www.gamersexile.net"];

/* Security headers on every page and API response. No full script CSP yet:
 * Clerk, Turnstile and Next's inline bootstrap would each need allow-listing;
 * frame-ancestors alone stops clickjacking of the captain/admin buttons. */
const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
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
