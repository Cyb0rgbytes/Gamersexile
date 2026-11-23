// Checks every language's dictionaries against English (the source).
// Reports keys missing in a language, keys that no longer exist in English,
// strings left identical to English (likely untranslated), and {placeholder}
// mismatches. Exit code 1 if anything is missing or broken.
//
//   npm run i18n:check            all languages
//   npm run i18n:check -- de ja   only these

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "dictionaries";
const SOURCE = "en";
const only = process.argv.slice(2);
const locales = readdirSync(ROOT).filter((d) => d !== SOURCE && (!only.length || only.includes(d)));
const namespaces = readdirSync(join(ROOT, SOURCE)).filter((f) => f.endsWith(".json"));

const flat = (obj, prefix = "", out = {}) => {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, out);
    // Arrays of plain strings (keywords, headline words) may differ in length
    // between languages, so they are compared as one value.
    else if (Array.isArray(v) && v.every((x) => typeof x !== "object")) out[key] = v.length ? v.join(" | ") : "";
    else if (Array.isArray(v)) v.forEach((item, i) => (item && typeof item === "object" ? flat(item, `${key}[${i}]`, out) : (out[`${key}[${i}]`] = item)));
    else out[key] = v;
  }
  return out;
};
const read = (l, ns) => {
  try {
    return JSON.parse(readFileSync(join(ROOT, l, ns), "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return {};
    throw new Error(`${l}/${ns}: ${e.message}`);
  }
};
const vars = (s) => (typeof s === "string" ? [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",") : "");

// Strings that may legitimately match English (names, codes, numbers).
const SAME_OK = /^(Discord|Twitch|YouTube|X|TikTok|MEE6|GG|LOL|IGL|AWPer|ADC|DPS|TBA|[0-9 .,:+\-–—/%#@]*|Gamer's Exile)$/;

let failed = false;
for (const l of locales) {
  let missing = 0, extra = 0, same = 0, broken = 0;
  const lines = [];
  for (const ns of namespaces) {
    const src = flat(read(SOURCE, ns));
    const tgt = flat(read(l, ns));
    for (const [k, v] of Object.entries(src)) {
      if (!(k in tgt) || tgt[k] === "") { missing++; lines.push(`  missing  ${ns}:${k}`); continue; }
      if (typeof v === "string" && tgt[k] === v && !SAME_OK.test(v) && v.length > 3) { same++; lines.push(`  same     ${ns}:${k}`); }
      if (vars(v) !== vars(tgt[k])) { broken++; lines.push(`  vars     ${ns}:${k}  expected {${vars(v)}}`); }
    }
    for (const k of Object.keys(tgt)) if (!(k in src)) { extra++; lines.push(`  stale    ${ns}:${k}`); }
  }
  if (missing || broken) failed = true;
  console.log(`${l.padEnd(6)} missing ${missing}  untranslated? ${same}  stale ${extra}  placeholder errors ${broken}`);
  if (process.env.VERBOSE) console.log(lines.join("\n"));
}
process.exit(failed ? 1 : 0);
