import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, addDoc, collection, deleteDoc } from "firebase/firestore";
import fs from "node:fs";

const env = await initializeTestEnvironment({
  projectId: "ksn-rules-test",
  firestore: { rules: fs.readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8080 },
});

// Comptes de test : le doc users/<uid> porte le role et la commission.
await env.withSecurityRulesDisabled(async (c) => {
  const db = c.firestore();
  await setDoc(doc(db, "users/admin1"), { role: "admin", permissions: [] });
  await setDoc(doc(db, "users/sec1"), { role: "commission", commission: "Secrétariat et Administratif", permissions: [] });
  await setDoc(doc(db, "users/fin1"), { role: "commission", commission: "Finances", permissions: [] });
  await setDoc(doc(db, "users/anc1"), { role: "commission", commission: "Secrétariat", permissions: [] }); // ancien libelle
  await setDoc(doc(db, "users/membre1"), { role: "member", permissions: [] });
  await setDoc(doc(db, "commissionDossiers/finances"), { commission: "finances", responsable: "X" });
  await setDoc(doc(db, "commissionDossiers/communication"), { commission: "communication", responsable: "Y" });
  await setDoc(doc(db, "comptesRendus/cr-brouillon"), { titre: "Brouillon", publie: false, date: "2026-09-19" });
  await setDoc(doc(db, "comptesRendus/cr-publie"), { titre: "Publié", publie: true, date: "2026-09-19" });
  await setDoc(doc(db, "commissionReports/r1"), { commission: "finances", responsable: "Z", createdAt: 1 });
});

const as = (uid) => env.authenticatedContext(uid).firestore();
const anon = () => env.unauthenticatedContext().firestore();

let ok = 0, ko = 0;
async function t(nom, p) {
  try { await p; console.log("  ✅", nom); ok++; }
  catch (e) { console.log("  ❌", nom, "—", String(e.message).split("\n")[0].slice(0, 110)); ko++; }
}

const rapportValide = {
  commission: "finances", responsable: "Moi", telephone: "+221770000000",
  activites: "Des activités", propositions: "Une proposition",
  difficultes: "", salaatuPrecisions: "", cellules: "", moyens: "", divers: "",
  membres: null, salaatu: null, cellulesActives: null, createdAt: Date.now(),
};

console.log("\n── Dossiers de commission ──");
await t("Finances lit SON dossier", assertSucceeds(getDoc(doc(as("fin1"), "commissionDossiers/finances"))));
await t("Finances ECRIT son dossier", assertSucceeds(setDoc(doc(as("fin1"), "commissionDossiers/finances"), { responsable: "A" }, { merge: true })));
await t("Finances NE LIT PAS le dossier de Communication", assertFails(getDoc(doc(as("fin1"), "commissionDossiers/communication"))));
await t("Finances N'ECRIT PAS le dossier de Communication", assertFails(setDoc(doc(as("fin1"), "commissionDossiers/communication"), { responsable: "pirate" }, { merge: true })));
await t("Secrétariat lit le dossier de Finances", assertSucceeds(getDoc(doc(as("sec1"), "commissionDossiers/finances"))));
await t("Secrétariat N'ECRIT PAS le dossier de Finances", assertFails(setDoc(doc(as("sec1"), "commissionDossiers/finances"), { responsable: "B" }, { merge: true })));
await t("Admin lit n'importe quel dossier", assertSucceeds(getDoc(doc(as("admin1"), "commissionDossiers/communication"))));
await t("Ancien libellé « Secrétariat » donne bien l'accès Secrétariat", assertSucceeds(getDoc(doc(as("anc1"), "commissionDossiers/finances"))));
await t("Un simple membre ne lit aucun dossier", assertFails(getDoc(doc(as("membre1"), "commissionDossiers/finances"))));
await t("Un visiteur anonyme ne lit aucun dossier", assertFails(getDoc(doc(anon(), "commissionDossiers/finances"))));

console.log("\n── Rapports transmis (formulaire public) ──");
await t("Un visiteur anonyme PEUT envoyer un rapport valide", assertSucceeds(addDoc(collection(anon(), "commissionReports"), rapportValide)));
await t("Rapport refusé si la commission n'existe pas", assertFails(addDoc(collection(anon(), "commissionReports"), { ...rapportValide, commission: "relations-exterieures" })));
await t("Rapport refusé sans responsable", assertFails(addDoc(collection(anon(), "commissionReports"), { ...rapportValide, responsable: "" })));
await t("Rapport refusé sans compte rendu", assertFails(addDoc(collection(anon(), "commissionReports"), { ...rapportValide, activites: "" })));
await t("Rapport refusé si un texte dépasse 4000 caractères", assertFails(addDoc(collection(anon(), "commissionReports"), { ...rapportValide, activites: "x".repeat(4001) })));
await t("Un visiteur anonyme NE LIT PAS les rapports", assertFails(getDoc(doc(anon(), "commissionReports/r1"))));
await t("Une commission NE LIT PAS les rapports", assertFails(getDoc(doc(as("fin1"), "commissionReports/r1"))));
await t("Le Secrétariat lit les rapports", assertSucceeds(getDoc(doc(as("sec1"), "commissionReports/r1"))));

console.log("\n── Relances ──");
await t("Le Secrétariat écrit une relance", assertSucceeds(setDoc(doc(as("sec1"), "agRelances/finances"), { at: 1, by: "sec" })));
await t("Finances voit SA relance", assertSucceeds(getDoc(doc(as("fin1"), "agRelances/finances"))));
await t("Finances NE RELANCE PAS", assertFails(setDoc(doc(as("fin1"), "agRelances/communication"), { at: 1, by: "x" })));

console.log("\n── Comptes rendus ──");
await t("Le Secrétariat écrit un compte rendu", assertSucceeds(setDoc(doc(as("sec1"), "comptesRendus/cr-brouillon"), { titre: "T", publie: false }, { merge: true })));
await t("Une commission lit un compte rendu PUBLIÉ", assertSucceeds(getDoc(doc(as("fin1"), "comptesRendus/cr-publie"))));
await t("Une commission NE LIT PAS un brouillon", assertFails(getDoc(doc(as("fin1"), "comptesRendus/cr-brouillon"))));
await t("Une commission N'ÉCRIT PAS de compte rendu", assertFails(setDoc(doc(as("fin1"), "comptesRendus/cr-publie"), { titre: "pirate" }, { merge: true })));
await t("Un visiteur anonyme ne lit aucun compte rendu", assertFails(getDoc(doc(anon(), "comptesRendus/cr-publie"))));

console.log(`\n═══ ${ok} réussis, ${ko} échoués ═══`);
await env.cleanup();
process.exit(ko ? 1 : 0);
