// Verifie que les echecs se disent honnetement.
//
// LE DEFAUT QUI A MOTIVE CE FICHIER. Toute ecriture ratee dans les ecrans de
// commission annoncait la meme chose : « … impossible. Verifiez votre
// connexion. » Quelle qu'en soit la cause. Un refus de permission devenait un
// probleme de reseau, le responsable verifiait sa connexion, la trouvait
// bonne, et repartait en croyant que ca finirait par passer.
//
// C'est ainsi qu'une annulation d'ecriture de caisse a pu ne jamais avoir
// lieu, sans que personne ne comprenne pourquoi.
//
//   node scripts/test-messages.mjs

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = fs.mkdtempSync(path.join(RACINE, "node_modules/.cache-ksn-msg-"));
process.on("exit", () => fs.rmSync(tmp, { recursive: true, force: true }));
execFileSync(
  path.join(RACINE, "node_modules/.bin/tsc"),
  ["lib/message-erreur.ts", "--outDir", tmp, "--module", "esnext", "--target", "es2022",
   "--moduleResolution", "bundler", "--skipLibCheck"],
  { cwd: RACINE, stdio: "inherit" }
);
for (const f of fs.readdirSync(tmp).filter((f) => f.endsWith(".js"))) {
  const p = path.join(tmp, f);
  fs.renameSync(p, p.replace(/\.js$/, ".mjs"));
}
const M = await import(path.join(tmp, "message-erreur.mjs"));

let ok = 0, ko = 0;
const dit = (bon, texte) => (bon ? (ok++, console.log("  ✅", texte)) : (ko++, console.log("  ❌", texte)));

const erreur = (code) => Object.assign(new Error("échec"), { code });

console.log("\n── Chaque cause a son message ──");
{
  const refus = M.messageEcriture(erreur("permission-denied"), "l'annulation");
  dit(/REFUS/i.test(refus) && /règles Firestore/i.test(refus),
    "Un refus de permission le DIT, et nomme les règles Firestore");
  dit(!/connexion/i.test(refus),
    "… et n'accuse pas la connexion — c'était tout le défaut");
  dit(/rien n'a été enregistré/i.test(refus),
    "… et affirme que rien n'a été écrit, pour qu'on ne suppose pas le contraire");
}
{
  const reseau = M.messageEcriture(erreur("unavailable"), "l'enregistrement");
  dit(/connexion/i.test(reseau), "Une vraie panne de réseau parle bien de connexion");
}
{
  const session = M.messageEcriture(erreur("unauthenticated"), "l'envoi");
  dit(/reconnect/i.test(session), "Une session expirée demande de se reconnecter");
}
{
  const forme = M.messageEcriture(erreur("invalid-argument"), "l'enregistrement");
  dit(/défaut du site/i.test(forme),
    "Une forme de document refusée est présentée comme un défaut du site, pas de l'utilisateur");
}

console.log("\n── Ce qu'on ignore, on ne l'invente pas ──");
{
  const inconnu = M.messageEcriture(erreur("quelque-chose-de-nouveau"), "l'annulation");
  dit(/n'a PAS eu lieu/i.test(inconnu), "On affirme le seul fait certain : l'écriture n'a pas eu lieu");
  dit(inconnu.includes("quelque-chose-de-nouveau"),
    "Le code technique est donné, pour pouvoir être signalé");
  dit(!/connexion/i.test(inconnu), "Aucune cause inventée");
}
dit(M.messageEcriture(new Error("sans code"), "l'ajout").includes("n'a PAS eu lieu"),
  "Une erreur sans code reste lisible");
dit(typeof M.messageEcriture(undefined, "l'ajout") === "string",
  "Même une erreur absente produit un message");

console.log("\n── Les lectures aussi ──");
dit(/Accès refusé/i.test(M.messageLecture(erreur("permission-denied"), "les écritures")),
  "Un refus de lecture se distingue d'une indisponibilité");

console.log("\n── Aucun écran ne doit reprendre l'ancienne formule ──");
{
  // Le garde-fou qui compte : c'est la formule elle-meme qu'on bannit.
  const fichiers = [];
  const parcourir = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) parcourir(f);
      else if (f.endsWith(".tsx")) fichiers.push(f);
    }
  };
  parcourir(path.join(RACINE, "app/admin"));
  parcourir(path.join(RACINE, "components/admin"));
  const fautifs = fichiers.filter((f) =>
    /Vérifiez votre connexion/.test(fs.readFileSync(f, "utf8"))
  );
  dit(fautifs.length === 0,
    fautifs.length
      ? `Ces écrans accusent encore la connexion quoi qu'il arrive : ${fautifs.map((f) => path.relative(RACINE, f)).join(", ")}`
      : `Aucun des ${fichiers.length} écrans d'administration n'accuse la connexion à tort`);
}

console.log(`\n═══ ${ok} réussis, ${ko} échoués ═══`);
process.exit(ko ? 1 : 0);
