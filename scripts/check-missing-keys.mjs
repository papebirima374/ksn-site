// Vérifie que chaque clé t("...") utilisée dans le code existe dans le bloc FR
// du dictionnaire (sinon la clé brute s'affiche à l'écran).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const dict = readFileSync("lib/i18n/translations.ts", "utf8");
const frBlock = dict.slice(dict.indexOf("fr: {"), dict.indexOf("wo: {"));
const frKeys = new Set([...frBlock.matchAll(/"([a-z0-9_.]+)":/g)].map((m) => m[1]));

const files = [];
function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(e)) files.push(p);
  }
}
walk("app");
walk("components");

let bad = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/\bt\(\s*"([a-z0-9_.]+)"/g)) {
    if (m[1].endsWith(".") || m[1].endsWith("_")) continue; // clé dynamique t("prefix" + x)
    if (!frKeys.has(m[1])) {
      console.log(`MANQUANTE  ${m[1]}  →  ${f}`);
      bad++;
    }
  }
}
console.log(bad === 0 ? "✓ Toutes les clés utilisées existent en FR" : `\n${bad} clé(s) manquante(s)`);
