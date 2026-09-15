// Verifie l'attribution des numeros de membre, sur l'emulateur Firestore.
//
// LE DEFAUT QUI A MOTIVE CE FICHIER. nextMatricule() demandait a Firestore le
// plus grand matricule — orderBy("matricule","desc"), limit(1). Deux pieges :
//
//   1. Un membre en attente porte le matricule litteral « PENDING », pour ne
//      pas bruler un numero avant sa validation. Or « PENDING » se classe
//      APRES « KSN-… » dans l'ordre des chaines. La requete le renvoyait, il
//      ne contenait aucun chiffre, et le compte repartait de KSN-0001 — deja
//      attribue. Tant qu'UNE adhesion restait en attente, chaque validation
//      fabriquait un doublon sur une carte de membre officielle.
//
//   2. Une requete ordonnee EXCLUT les documents auxquels le champ manque.
//
// Ces controles reproduisent les deux et verifient la correction.
//
//   firebase emulators:exec --only firestore --project ksn-matricules \
//     "node scripts/test-matricules.mjs"

import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, setDoc, deleteDoc, getDocs, collection, query, orderBy, limit } from "firebase/firestore";

const env = await initializeTestEnvironment({
  projectId: "ksn-matricules",
  firestore: {
    rules: "rules_version='2';service cloud.firestore{match /databases/{d}/documents{match /{p=**}{allow read,write:if true;}}}",
    host: "127.0.0.1",
    port: 8080,
  },
});

let ok = 0, ko = 0;
const dit = (bon, texte) => (bon ? (ok++, console.log("  ✅", texte)) : (ko++, console.log("  ❌", texte)));

const padMatricule = (n) => "KSN-" + String(n).padStart(4, "0");
const db = () => env.authenticatedContext("admin").firestore();

async function peupler(membres) {
  await env.withSecurityRulesDisabled(async (c) => {
    const d = c.firestore();
    // On SUPPRIME les documents du scenario precedent plutot que de les vider :
    // un document vide reste un document, et il fausserait les comptes affiches.
    const anciens = await getDocs(collection(d, "members"));
    await Promise.all(anciens.docs.map((x) => deleteDoc(doc(d, "members", x.id))));
    for (const [id, m] of Object.entries(membres)) await setDoc(doc(d, "members", id), m);
  });
}

/** La version corrigee : tout lire, chercher le maximum en memoire. */
async function nextMatricule() {
  const snap = await getDocs(collection(db(), "members"));
  let max = 0;
  for (const d of snap.docs) {
    const brut = (d.data().matricule ?? "").replace(/\D/g, "");
    if (!brut) continue;
    const n = parseInt(brut, 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return padMatricule(max + 1);
}

/** L'ancienne, gardee pour montrer ce qu'elle produisait. */
async function ancienneVersion() {
  const snap = await getDocs(query(collection(db(), "members"), orderBy("matricule", "desc"), limit(1)));
  if (snap.empty) return padMatricule(1);
  const raw = (snap.docs[0].data().matricule ?? "").replace(/\D/g, "");
  const n = parseInt(raw || "0", 10);
  return padMatricule(Number.isFinite(n) ? n + 1 : 1);
}

console.log("\n── Le piège « PENDING » ──");
await peupler({
  m1: { matricule: "KSN-0001", prenom: "Aminata", status: "actif" },
  m2: { matricule: "KSN-0042", prenom: "Moussa", status: "actif" },
  m3: { matricule: "PENDING", prenom: "Fatou", status: "en_attente" },
});
{
  const avant = await ancienneVersion();
  const apres = await nextMatricule();
  dit(avant === "KSN-0001", `L'ancienne version rendait ${avant} — un doublon de KSN-0001`);
  dit(apres === "KSN-0043", `La nouvelle rend ${apres}, à la suite de KSN-0042`);
}

console.log("\n── Le membre sans matricule ──");
await peupler({
  m1: { matricule: "KSN-0007", prenom: "Aminata", status: "actif" },
  m2: { prenom: "Sans matricule", status: "actif" }, // champ absent
});
{
  const tousOrdonnes = await getDocs(query(collection(db(), "members"), orderBy("matricule", "desc")));
  const tous = await getDocs(collection(db(), "members"));
  dit(tousOrdonnes.size < tous.size,
    `Une requête ordonnée n'en voit que ${tousOrdonnes.size} sur ${tous.size} — le champ manquant exclut le document`);
  dit((await nextMatricule()) === "KSN-0008", "La nouvelle version n'en est pas dérangée");
}

console.log("\n── Les cas ordinaires ──");
await peupler({});
dit((await nextMatricule()) === "KSN-0001", "Base vide : le premier membre reçoit KSN-0001");

await peupler({
  m1: { matricule: "KSN-0001", status: "actif" },
  m2: { matricule: "KSN-0002", status: "actif" },
  m3: { matricule: "KSN-0003", status: "actif" },
});
dit((await nextMatricule()) === "KSN-0004", "Suite continue : après KSN-0003 vient KSN-0004");

await peupler({
  m1: { matricule: "KSN-0001", status: "actif" },
  m2: { matricule: "KSN-0009", status: "actif" }, // un trou dans la suite
});
dit((await nextMatricule()) === "KSN-0010",
  "Avec un trou dans la suite, on repart du PLUS GRAND, jamais du nombre de membres");

await peupler({
  m1: { matricule: "KSN-0100", status: "actif" },
  m2: { matricule: "PENDING", status: "en_attente" },
  m3: { matricule: "PENDING", status: "en_attente" },
  m4: { matricule: "", status: "en_attente" },
  m5: { prenom: "Sans champ" },
});
dit((await nextMatricule()) === "KSN-0101",
  "Plusieurs en attente, un matricule vide et un champ absent : la suite reste juste");

console.log(`\n═══ ${ok} réussis, ${ko} échoués ═══`);
await env.cleanup();
process.exit(ko ? 1 : 0);
