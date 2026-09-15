// Verifie que « ce membre est a jour » repose sur quelque chose de solide.
//
// LE DEFAUT QUI A MOTIVE CE FICHIER. Savoir si un membre avait paye se lisait
// dans la DESCRIPTION de l'ecriture : l'ecran des membres ecrivait
// « Cotisation - Septembre 2026 », le filtre cherchait « septembre 2026 »
// dedans. Mais l'ecran des Finances laissait taper la description a la main,
// avec « Cotisation mensuelle » pour categorie par defaut. Une cotisation
// encaissee depuis cet ecran n'etait donc jamais comptee : l'argent entrait,
// le membre restait affiche comme redevable, et rien ne le signalait.
//
// Ce que ces controles protegent : le texte ecrit et le texte relu viennent
// du meme endroit, et la relecture reste tolerante pour les ecritures
// anciennes, tapees quand ce n'etait pas le cas.
//
//   node scripts/test-cotisations.mjs

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = fs.mkdtempSync(path.join(RACINE, "node_modules/.cache-ksn-cotis-"));
process.on("exit", () => fs.rmSync(tmp, { recursive: true, force: true }));
execFileSync(
  path.join(RACINE, "node_modules/.bin/tsc"),
  ["lib/cotisations.ts", "--outDir", tmp, "--module", "esnext", "--target", "es2022",
   "--moduleResolution", "bundler", "--skipLibCheck"],
  { cwd: RACINE, stdio: "inherit" }
);
for (const f of fs.readdirSync(tmp).filter((f) => f.endsWith(".js"))) {
  const p = path.join(tmp, f);
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(/from "(\.\/[^"]+)"/g, 'from "$1.mjs"'));
  fs.renameSync(p, p.replace(/\.js$/, ".mjs"));
}
const C = await import(path.join(tmp, "cotisations.mjs"));

let ok = 0, ko = 0;
const dit = (bon, texte) => (bon ? (ok++, console.log("  ✅", texte)) : (ko++, console.log("  ❌", texte)));

const MEMBRE = "m-aminata";
const ecriture = (extra) => ({
  id: Math.random().toString(36).slice(2),
  type: "income",
  category: C.CATEGORIE_COTISATION,
  amount: 500,
  date: "2026-09-12",
  memberId: MEMBRE,
  ...extra,
});

console.log("\n── Le texte écrit est le texte relu ──");
{
  // Les DEUX ecrans passent desormais par descriptionCotisation().
  const depuisLesMembres = ecriture({ description: C.descriptionCotisation("Septembre", 2026) });
  const depuisLesFinances = ecriture({ description: C.descriptionCotisation("Septembre", 2026) });
  dit(C.aPayeCotisation([depuisLesMembres], MEMBRE, "Septembre", 2026),
    "Une cotisation saisie depuis la fiche du membre est reconnue");
  dit(C.aPayeCotisation([depuisLesFinances], MEMBRE, "Septembre", 2026),
    "Une cotisation saisie depuis les Finances aussi — c'est ce qui ne marchait pas");
}

console.log("\n── Le défaut d'origine ──");
dit(!C.aPayeCotisation([ecriture({ description: "" })], MEMBRE, "Septembre", 2026),
  "Une description VIDE ne compte pas — c'était le cas le plus courant");
dit(!C.aPayeCotisation([ecriture({ description: "reçu de Moussa" })], MEMBRE, "Septembre", 2026),
  "Une note libre sans période ne compte pas non plus");
dit(!C.aPayeCotisation([ecriture({ description: undefined })], MEMBRE, "Septembre", 2026),
  "Une description absente ne fait pas tomber la lecture");

console.log("\n── Tolérance pour les écritures anciennes ──");
// Elles ont ete tapees a la main, avant que la description soit generee.
dit(C.aPayeCotisation([ecriture({ description: "cotisation septembre 2026" })], MEMBRE, "Septembre", 2026),
  "Sans majuscule");
dit(C.aPayeCotisation([ecriture({ description: "Cotisation AOUT 2026" })], MEMBRE, "Août", 2026),
  "Sans accent : « AOUT » vaut « Août »");
dit(C.aPayeCotisation([ecriture({ description: "Cotisation du mois de Septembre 2026, payée en retard" })], MEMBRE, "Septembre", 2026),
  "Noyée dans une phrase");

console.log("\n── Ce qui ne doit PAS compter ──");
dit(!C.aPayeCotisation([ecriture({ description: C.descriptionCotisation("Août", 2026) })], MEMBRE, "Septembre", 2026),
  "Le mois d'avant ne paie pas le mois en cours");
dit(!C.aPayeCotisation([ecriture({ description: C.descriptionCotisation("Septembre", 2025) })], MEMBRE, "Septembre", 2026),
  "Ni la même période de l'année précédente");
dit(!C.aPayeCotisation([ecriture({ memberId: "m-autre", description: C.descriptionCotisation("Septembre", 2026) })], MEMBRE, "Septembre", 2026),
  "La cotisation d'un autre membre ne compte pas pour celui-ci");
dit(!C.aPayeCotisation([ecriture({ type: "expense", description: C.descriptionCotisation("Septembre", 2026) })], MEMBRE, "Septembre", 2026),
  "Une DÉPENSE portant le même libellé ne vaut pas paiement");
dit(!C.aPayeCotisation([ecriture({ category: "Don général", description: C.descriptionCotisation("Septembre", 2026) })], MEMBRE, "Septembre", 2026),
  "Un don ne tient pas lieu de cotisation");

console.log("\n── Frais d'inscription ──");
const inscription = { ...ecriture({}), category: C.CATEGORIE_INSCRIPTION, description: "" };
dit(C.aPayeInscription([inscription], MEMBRE),
  "Ils ne dépendent ni du mois ni de la description — ils se paient une fois");
dit(!C.aPayeInscription([inscription], "m-autre"),
  "Et restent rattachés à leur membre");

console.log("\n── Les douze mois ──");
dit(C.MOIS.length === 12, `La liste en compte douze (${C.MOIS.length})`);
dit(C.MOIS.every((m, i) =>
  C.aPayeCotisation([ecriture({ description: C.descriptionCotisation(m, 2026) })], MEMBRE, m, 2026)),
  "Chacun des douze s'écrit et se relit correctement");

console.log(`\n═══ ${ok} réussis, ${ko} échoués ═══`);
process.exit(ko ? 1 : 0);
