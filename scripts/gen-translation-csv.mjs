// Prepare le travail du traducteur wolof.
//
// L'ANCIENNE VERSION exportait les 670 cles du site, a plat. Le traducteur
// devait lire les 670 lignes pour deviner lesquelles attendaient quelque
// chose — alors que plus de la moitie sont deja faites. On ne sort donc ici
// que CE QUI RESTE A FAIRE, range par page, avec l'etat de chaque ligne.
//
// Deux etats possibles, et ils ne demandent pas le meme effort :
//   ABSENT              la cle n'existe pas en wolof. Le site retombe sur le
//                       francais (cf. translate() dans translations.ts), donc
//                       rien n'est casse : c'est juste du francais affiche a
//                       quelqu'un qui a choisi le wolof.
//   FRANCAIS TEL QUEL   la cle existe, mais son contenu est le texte francais
//                       recopie. Trompeur : le site se croit traduit.
//
// Produit trois fichiers :
//   traduction-wolof.csv            ce qui reste a traduire, a remplir
//   traduction-wolof-faite.csv      ce qui est deja en wolof, pour relecture
//   traduction-toutes-langues.csv   les six langues cote a cote
//
//   node scripts/gen-translation-csv.mjs

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

/** Ou ce texte apparait sur le site. Le traducteur a besoin de savoir de quoi
 *  il parle : « Boutique » ne se traduit pas pareil en titre de menu et en
 *  bouton d'achat. */
const SECTIONS = {
  nav: "Barre de navigation", footer: "Pied de page", site: "Identite du site",
  hero: "Accueil — banniere", stats: "Accueil — chiffres", banner: "Accueil — bandeau",
  compteur: "Accueil — compteur Salaatu", appksn: "Accueil — application mobile",
  social: "Reseaux sociaux", cta: "Boutons d'appel", modal: "Fenetres surgissantes",
  section: "Titres de section", tabs: "Onglets", shield: "Mentions de securite",
  ledahira: "Page Le Dahira", dahirapage: "Page Le Dahira", dahiratabs: "Page Le Dahira — onglets",
  presidence: "Page Le Dahira — presidence", motpresident: "Page Le Dahira — mot du President",
  organigramme: "Page Le Dahira — organigramme", commissions: "Page Commissions",
  documents: "Documents officiels", histoire: "Page Notre Histoire",
  temoignages: "Temoignages", spiritualite: "Page Spiritualite",
  salaatu: "Salaatu du jour", library: "Bibliotheque des Salaats",
  challenge: "Page Challenge", contrib: "Challenge — contribution",
  challmedia: "Challenge — media", countdown: "Compte a rebours",
  journee: "Page Journee Salaatu", month: "Mois de l'annee",
  media: "Page Media", mediapage: "Page Media", gallery: "Galerie photos",
  faq: "Page FAQ", contact: "Page Contact", contactpage: "Page Contact",
  don: "Page Faire un don", join: "Rejoindre le Dahira", inscription: "Page Inscription",
};
const section = (cle) => SECTIONS[cle.split(".")[0]] ?? cle.split(".")[0];

/** Variables a NE PAS traduire : elles sont remplacees par un nombre ou un
 *  nom au moment de l'affichage. Traduire « {count} » casse la phrase. */
const variables = (t) => [...new Set(t.match(/\{[a-zA-Z_]+\}/g) ?? [])].join(" ");

const esc = (s) => '"' + String(s ?? "").replace(/"/g, '""') + '"';
const BOM = "﻿";
const ligne = (cells) => cells.map(esc).join(";") + "\r\n";

const aFaire = [];
const faites = [];
for (const k of keys) {
  const fr = (data.fr[k] ?? "").trim();
  const wo = (data.wo[k] ?? "").trim();
  if (!wo) aFaire.push([k, fr, "ABSENT"]);
  else if (wo === fr) aFaire.push([k, fr, "FRANCAIS TEL QUEL"]);
  else faites.push([k, fr, wo]);
}
// Par page, puis par cle : le traducteur avance ecran par ecran.
aFaire.sort((a, b) => section(a[0]).localeCompare(section(b[0])) || a[0].localeCompare(b[0]));

let f1 = BOM + ligne(["Page / section", "Cle", "Francais", "Etat", "Ne pas traduire", "WOLOF (a remplir)"]);
for (const [k, fr, etat] of aFaire) f1 += ligne([section(k), k, fr, etat, variables(fr), ""]);
writeFileSync("traduction-wolof.csv", f1, "utf8");

let f2 = BOM + ligne(["Page / section", "Cle", "Francais", "Wolof actuel", "WOLOF corrige (si besoin)"]);
for (const [k, fr, wo] of faites.sort((a, b) => section(a[0]).localeCompare(section(b[0])) || a[0].localeCompare(b[0])))
  f2 += ligne([section(k), k, fr, wo, ""]);
writeFileSync("traduction-wolof-faite.csv", f2, "utf8");

let f3 = BOM + ligne(["Cle", "Francais", "Wolof", "English", "Italiano", "Espanol", "Arabe"]);
for (const k of keys)
  f3 += ligne([k, data.fr[k], data.wo[k] ?? "", data.en[k] ?? "", data.it[k] ?? "", data.es[k] ?? "", data.ar[k] ?? ""]);
writeFileSync("traduction-toutes-langues.csv", f3, "utf8");

const absents = aFaire.filter((r) => r[2] === "ABSENT").length;
console.log(`${keys.length} clés au total`);
console.log(`  déjà en wolof        : ${faites.length}`);
console.log(`  à traduire           : ${aFaire.length}  (${absents} absentes, ${aFaire.length - absents} restées en français)`);
console.log("");
console.log("Par page, ce qui reste à faire :");
const parPage = {};
for (const [k] of aFaire) parPage[section(k)] = (parPage[section(k)] ?? 0) + 1;
for (const [p, n] of Object.entries(parPage).sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(n).padStart(3)}  ${p}`);
console.log("");
console.log("→ traduction-wolof.csv            ce qui reste, à remplir");
console.log("→ traduction-wolof-faite.csv      le déjà-fait, pour relecture");
console.log("→ traduction-toutes-langues.csv   les six langues côte à côte");
