// Verifie la chaine des relances WhatsApp, de bout en bout.
//
// Trois choses peuvent la casser SANS QUE RIEN NE LE DISE :
//
//  1. Une cle qui ne correspond a aucune commission. La recherche renvoie
//     alors « indefini », WhatsApp s'ouvre sans destinataire, et on croit
//     avoir relance quelqu'un. Une faute de frappe suffit.
//
//  2. Un numero mal forme. « 77 670 54 86 » sans l'indicatif donne un lien
//     wa.me qui ne mene nulle part — la page s'ouvre, vide.
//
//  3. UN NUMERO QUI FUIT DANS LE JAVASCRIPT PUBLIC. C'est le plus grave.
//     Les numeros vivent dans une route d'API, qui ne s'execute que sur le
//     serveur. Le jour ou quelqu'un les deplace dans lib/ « pour simplifier »,
//     ils partent dans le bundle telechargeable par n'importe quel visiteur,
//     et plus rien ne les rattrape.
//
//   npm run build     (necessaire pour le controle 3)
//   node scripts/test-contacts.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROUTE = path.join(RACINE, "app/api/commission-contacts/route.ts");

let ok = 0, ko = 0;
const dit = (bon, texte) => (bon ? (ok++, console.log("  ✅", texte)) : (ko++, console.log("  ❌", texte)));

const route = fs.readFileSync(ROUTE, "utf8");
const bloc = route.match(/const CONTACTS[^{]*\{([\s\S]*?)\n\};/)?.[1];
if (!bloc) {
  console.error("Le bloc CONTACTS est introuvable — la route a-t-elle change de forme ?");
  process.exit(1);
}
const paires = [...bloc.matchAll(/^\s*"?([a-z-]+)"?\s*:\s*"([^"]+)"/gm)].map((m) => [m[1], m[2]]);

/* ── 1. Chaque commission, et seulement elles ────────────────────────── */
console.log("\n── Les clés correspondent aux commissions ──");
const commissions = fs.readFileSync(path.join(RACINE, "lib/commissions.ts"), "utf8");
const slugs = [...commissions.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
const cles = paires.map(([c]) => c);

dit(slugs.length > 0, `${slugs.length} commissions déclarées dans lib/commissions.ts`);
const sansNumero = slugs.filter((s) => !cles.includes(s));
dit(sansNumero.length === 0,
  sansNumero.length
    ? `Commissions sans numéro — leur relance partira sans destinataire : ${sansNumero.join(", ")}`
    : "Chaque commission a un numéro");
const orphelines = cles.filter((c) => !slugs.includes(c));
dit(orphelines.length === 0,
  orphelines.length
    ? `Clés qui ne correspondent à aucune commission (faute de frappe ?) : ${orphelines.join(", ")}`
    : "Aucune clé orpheline");

/* ── 2. Le lien que chaque relance produit ───────────────────────────── */
console.log("\n── Le lien wa.me est composable ──");
// Indicatif senegalais + prefixe mobile (70/75/76/77/78) + 7 chiffres.
const FORME = /^221(7[05678])\d{7}$/;
for (const [slug, tel] of paires) {
  const chiffres = tel.replace(/\D+/g, "");
  dit(FORME.test(chiffres), `${slug} → https://wa.me/${chiffres}`);
}

/* ── 3. Rien ne fuit cote visiteur ───────────────────────────────────── */
console.log("\n── Aucun numéro dans le JavaScript public ──");
const STATIC = path.join(RACINE, ".next/static");
if (!fs.existsSync(STATIC)) {
  console.log("  ⏭  .next/static absent — lancez `npm run build` pour ce contrôle");
} else {
  // Toutes les ecritures plausibles du meme numero.
  const formes = (n) => [n, n.replace(/\s/g, ""), n.replace(/\D/g, "")];
  const cibles = [...new Set(paires.flatMap(([, tel]) => formes(tel)))].filter((t) => t.length > 8);

  const fuites = [];
  (function parcourir(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) parcourir(f);
      else if (/\.(js|json|html|txt|map|css)$/.test(e.name)) {
        const contenu = fs.readFileSync(f, "latin1");
        for (const t of cibles) {
          if (contenu.includes(t)) fuites.push(`${path.relative(RACINE, f)} contient ${t}`);
        }
      }
    }
  })(STATIC);

  dit(fuites.length === 0,
    fuites.length
      ? `FUITE — ces numéros sont téléchargeables par n'importe quel visiteur :\n     ${fuites.join("\n     ")}`
      : `Les ${paires.length} numéros restent côté serveur (${cibles.length} écritures cherchées dans .next/static)`);
}

console.log(`\n═══ ${ok} réussis, ${ko} échoués ═══`);
process.exit(ko ? 1 : 0);
