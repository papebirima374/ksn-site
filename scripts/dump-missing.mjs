import { readFileSync } from "node:fs";
const src = readFileSync("lib/i18n/translations.ts", "utf8");
const langs = ["fr", "wo", "en", "it", "es", "ar"];
const pos = {};
for (const l of langs) pos[l] = src.indexOf("\n  " + l + ": {");
const ord = langs.slice().sort((a, b) => pos[a] - pos[b]);
function map(l) {
  const i = ord.indexOf(l);
  const s = pos[l];
  const e = i + 1 < ord.length ? pos[ord[i + 1]] : src.length;
  const c = src.slice(s, e);
  const m = {};
  const re = /"([^"]+)":\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
  let x;
  while ((x = re.exec(c))) m[x[1]] = x[2];
  return m;
}
const FR = map("fr"), IT = map("it");
const missing = Object.keys(FR).filter((k) => !(k in IT));
for (const k of missing) console.log(k + " ||| " + FR[k]);
