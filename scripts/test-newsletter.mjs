// Verifie le traitement de la liste d'information : dedoublonnage, tri,
// export CSV.
//
// Pourquoi : la collection « newsletter » contient un document par
// INSCRIPTION, pas par personne. Une meme adresse peut y figurer plusieurs
// fois, certains documents n'ont pas de date, d'autres pas d'adresse du tout.
// Ce qu'on affiche au President doit tenir debout malgre ca — et surtout ne
// jamais PERDRE une adresse en chemin, ce qui ne se verrait pas.
//
//   node scripts/test-newsletter.mjs

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* Meme procede que scripts/verifier-impression.mjs : on compile le vrai
   fichier TypeScript plutot que d'en tester une copie qui pourrait diverger. */
const tmp = fs.mkdtempSync(path.join(RACINE, "node_modules/.cache-ksn-news-"));
process.on("exit", () => fs.rmSync(tmp, { recursive: true, force: true }));
execFileSync(
  path.join(RACINE, "node_modules/.bin/tsc"),
  ["lib/newsletter.ts", "--outDir", tmp, "--module", "esnext", "--target", "es2022",
   "--moduleResolution", "bundler", "--skipLibCheck"],
  { cwd: RACINE, stdio: "inherit" }
);
for (const f of fs.readdirSync(tmp).filter((f) => f.endsWith(".js"))) {
  const p = path.join(tmp, f);
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(/from "(\.\/[^"]+)"/g, 'from "$1.mjs"'));
  fs.renameSync(p, p.replace(/\.js$/, ".mjs"));
}
const N = await import(path.join(tmp, "newsletter.mjs"));

let ok = 0, ko = 0;
const dit = (bon, texte) => (bon ? (ok++, console.log("  ✅", texte)) : (ko++, console.log("  ❌", texte)));

const J = 86400000;
const hier = Date.now() - J;
const avantHier = Date.now() - 2 * J;
const vieux = Date.now() - 300 * J;

/* ── Le jeu d'essai : la collection telle qu'elle est, pas telle qu'on
      aimerait qu'elle soit ────────────────────────────────────────────── */
const brut = [
  { id: "d1", email: "aminata@example.sn", source: "pied de page", subscribedAt: hier },
  // La meme personne, reinscrite deux fois de plus, dont une par l'ancienne
  // liste d'attente Education.
  { id: "d2", email: "AMINATA@example.sn ", source: "pied de page", subscribedAt: avantHier },
  { id: "d3", email: "aminata@example.sn", source: "education_waitlist", subscribedAt: vieux },
  { id: "d4", email: "moussa@example.sn", source: "pied de page", subscribedAt: avantHier },
  // Sans date : les tout premiers documents. C'est EUX que orderBy() aurait
  // fait disparaitre.
  { id: "d5", email: "fatou@example.sn", source: "", subscribedAt: null },
  // Document abime : pas d'adresse. Inexploitable, mais il ne doit pas
  // faire tomber le reste.
  { id: "d6", email: "", source: "pied de page", subscribedAt: hier },
];

const abonnes = N.dedoublonner(brut);

console.log("\n── Dédoublonnage ──");
dit(abonnes.length === 3, `3 personnes distinctes derrière 6 documents (obtenu : ${abonnes.length})`);
dit(
  abonnes.every((a) => a.email === a.email.trim().toLowerCase()),
  "Les adresses sont normalisées — « AMINATA@… » et « aminata@… » sont la même personne"
);
const aminata = abonnes.find((a) => a.email === "aminata@example.sn");
dit(aminata?.documents.length === 3, `Les 3 inscriptions d'Aminata sont regroupées (obtenu : ${aminata?.documents.length})`);
dit(
  aminata?.sources.length === 2 && aminata.sources.includes("education_waitlist"),
  "Ses deux origines sont conservées, pas seulement la dernière"
);
dit(aminata?.depuis === vieux, "On retient depuis QUAND elle nous suit, pas sa dernière réinscription");

console.log("\n── Rien ne se perd ──");
// Le vrai danger : une adresse qui disparait sans message. On recompte.
const adressesEntrantes = new Set(
  brut.map((b) => b.email.trim().toLowerCase()).filter(Boolean)
);
const adressesSortantes = new Set(abonnes.map((a) => a.email));
dit(
  adressesEntrantes.size === adressesSortantes.size
    && [...adressesEntrantes].every((e) => adressesSortantes.has(e)),
  `Toutes les adresses lisibles ressortent (${adressesSortantes.size}/${adressesEntrantes.size})`
);
dit(
  abonnes.some((a) => a.email === "fatou@example.sn"),
  "Celle qui n'a PAS de date d'inscription est présente — c'est le piège d'orderBy()"
);
dit(
  !abonnes.some((a) => a.email === ""),
  "Le document sans adresse est écarté, sans faire tomber les autres"
);
const totalDocs = abonnes.reduce((n, a) => n + a.documents.length, 0);
dit(totalDocs === 5, `Les 5 documents exploitables sont rattachés à quelqu'un (obtenu : ${totalDocs})`);

console.log("\n── Ordre d'affichage ──");
dit(abonnes[abonnes.length - 1].email === "fatou@example.sn",
  "Les inscriptions sans date finissent la liste au lieu d'en être exclues");
const dates = abonnes.filter((a) => a.depuis !== null).map((a) => a.depuis);
dit(dates.every((d, i) => i === 0 || dates[i - 1] >= d), "Les plus récentes d'abord");

console.log("\n── Export CSV ──");
const csv = N.versCSV(abonnes);
dit(csv.startsWith("﻿"), "Le fichier commence par un BOM — sans lui, Excel abîme les accents");
dit(csv.split("\r\n").filter(Boolean).length === abonnes.length + 1,
  "Une ligne d'en-tête plus une ligne par personne");
dit(csv.includes(";"), "Séparateur point-virgule — Excel français attend celui-là, pas la virgule");
dit(csv.includes("date inconnue"), "Une date absente se dit, elle ne s'invente pas");
dit(csv.includes("Liste d'attente Éducation"),
  "L'origine est traduite en français lisible, pas laissée en « education_waitlist »");
// Le piege classique de tout CSV : un guillemet dans une valeur.
const piege = N.versCSV([{ email: 'gui"llemet@example.sn', depuis: hier, sources: [], documents: ["x"] }]);
dit(piege.includes('"gui""llemet@example.sn"'), "Un guillemet dans une adresse est échappé, la colonne ne se décale pas");

console.log("\n── Liste d'adresses ──");
const liste = N.versListeAdresses(abonnes);
dit(liste.split("\n").length === abonnes.length, "Une adresse par ligne, prête pour un champ Cci");
dit(!liste.includes(";") && !liste.includes(","), "Aucun séparateur parasite");

console.log(`\n═══ ${ok} réussis, ${ko} échoués ═══`);
process.exit(ko ? 1 : 0);
