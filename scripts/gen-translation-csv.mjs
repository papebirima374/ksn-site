// Génère les fichiers CSV de traduction (Wolof + toutes langues) à partir de
// lib/i18n/translations.ts — pour traduction/relecture manuelle dans Excel/Sheets.
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("lib/i18n/translations.ts", "utf8");
const langs = ["fr", "wo", "en", "it", "es", "ar"];

const pos = {};
for (const l of langs) pos[l] = src.indexOf("\n  " + l + ": {");
const ordered = langs.slice().sort((a, b) => pos[a] - pos[b]);

function extract(lang) {
  const i = ordered.indexOf(lang);
  const start = pos[lang];
  const end = i + 1 < ordered.length ? pos[ordered[i + 1]] : src.length;
  const chunk = src.slice(start, end);
  const map = {};
  const re = /"([^"]+)":\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(chunk))) {
    map[m[1]] = m[2].replace(/\\"/g, '"').replace(/\\n/g, " ");
  }
  return map;
}

const data = {};
for (const l of langs) data[l] = extract(l);
const keys = Object.keys(data.fr);

const esc = (s) => '"' + String(s ?? "").replace(/"/g, '""') + '"';
const BOM = "﻿";

// 1) CSV Wolof : Clé | Français | Wolof actuel | Wolof corrigé (à remplir)
let wo = BOM + ["Cle", "Francais (reference)", "Wolof actuel", "Wolof corrige (a remplir)"].map(esc).join(",") + "\n";
for (const k of keys) wo += [k, data.fr[k], data.wo[k] || "", ""].map(esc).join(",") + "\n";
writeFileSync("traduction-wolof.csv", wo, "utf8");

// 2) CSV complet toutes langues (relecture)
let all = BOM + ["Cle", "Francais", "Wolof", "English", "Italiano", "Espanol", "Arabe"].map(esc).join(",") + "\n";
for (const k of keys) all += [k, data.fr[k], data.wo[k] || "", data.en[k] || "", data.it[k] || "", data.es[k] || "", data.ar[k] || ""].map(esc).join(",") + "\n";
writeFileSync("traduction-toutes-langues.csv", all, "utf8");

console.log("Clés exportées:", keys.length);
console.log("→ traduction-wolof.csv");
console.log("→ traduction-toutes-langues.csv");
