// Runs between `opennextjs-cloudflare build` and `deploy`.
//
// OpenNext copies every variable from the project's .env* files into
// .open-next/cloudflare/next-env.mjs, which ships inside the Worker bundle.
// That would put CLERK_SECRET_KEY (and anything else secret) into the
// Worker's source code in plain text. At runtime the Worker's own bindings
// (`wrangler secret put …`) take priority anyway, so only public values
// (NEXT_PUBLIC_*) need to stay in the file.
//
// After stripping, the whole bundle is scanned for anything that looks like a
// real Clerk secret key; if one is found the deploy stops.
import fs from "node:fs";
import path from "node:path";

const OUT = ".open-next";
const envFile = path.join(OUT, "cloudflare", "next-env.mjs");
if (!fs.existsSync(envFile)) {
  console.error(`[strip-build-secrets] ${envFile} not found; run the OpenNext build first.`);
  process.exit(1);
}

const mod = await import(`file://${path.resolve(envFile)}?t=${Date.now()}`);
const removed = new Set();
const lines = ["production", "development", "test"].map((mode) => {
  const vars = mod[mode] ?? {};
  const kept = Object.fromEntries(
    Object.entries(vars).filter(([key]) => {
      const keep = key.startsWith("NEXT_PUBLIC_");
      if (!keep) removed.add(key);
      return keep;
    }),
  );
  return `export const ${mode} = ${JSON.stringify(kept)};\n`;
});
fs.writeFileSync(envFile, lines.join(""));
console.log(`[strip-build-secrets] removed from bundle: ${[...removed].sort().join(", ") || "(nothing)"}`);

// Real Clerk secret keys are long; Clerk's own code only contains the bare
// prefixes ("sk_test_"), which this pattern does not match.
const SECRET_RE = /\bsk_(live|test)_[A-Za-z0-9]{20,}/;
const hits = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(m?js|json|html|rsc|body|meta|txt|map)$/.test(entry.name) && SECRET_RE.test(fs.readFileSync(p, "utf8"))) {
      hits.push(p);
    }
  }
})(OUT);

if (hits.length) {
  console.error("[strip-build-secrets] secret key material still present in:\n  " + hits.join("\n  "));
  process.exit(1);
}
console.log("[strip-build-secrets] bundle scan clean");
