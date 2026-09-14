import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, addDoc, collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
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
  await setDoc(doc(db, "users/org1"), { role: "commission", commission: "Organisation", permissions: [] });
  await setDoc(doc(db, "users/soc1"), { role: "commission", commission: "Social et Développement", permissions: [] });
  await setDoc(doc(db, "commissionAides/a-soc"), { commission: "social-developpement", membreNom: "X Y", montant: 10000, motif: "Maladie", date: "2026-09-01", createdAt: 1 });
  await setDoc(doc(db, "users/anc1"), { role: "commission", commission: "Secrétariat", permissions: [] }); // ancien libelle
  await setDoc(doc(db, "users/membre1"), { role: "member", permissions: [] });
  await setDoc(doc(db, "commissionDossiers/finances"), { commission: "finances", responsable: "X" });
  await setDoc(doc(db, "commissionDossiers/communication"), { commission: "communication", responsable: "Y" });
  await setDoc(doc(db, "comptesRendus/cr-brouillon"), { titre: "Brouillon", publie: false, date: "2026-09-19" });
  await setDoc(doc(db, "comptesRendus/cr-publie"), { titre: "Publié", publie: true, date: "2026-09-19" });
  await setDoc(doc(db, "commissionReports/r1"), { commission: "finances", responsable: "Z", createdAt: 1 });
  await setDoc(doc(db, "commissionMessages/m-fin"), { commission: "finances", auteur: "A", role: "commission", texte: "Bonjour", createdAt: 1 });
  await setDoc(doc(db, "commissionMessages/m-com"), { commission: "communication", auteur: "B", role: "commission", texte: "Salut", createdAt: 1 });
  await setDoc(doc(db, "commissionCaisse/c-fin"), { commission: "finances", sens: "entree", montant: 5000, motif: "Cotisation", date: "2026-09-01", createdAt: 1, createdBy: "X" });
  await setDoc(doc(db, "commissionCaisse/c-org"), { commission: "organisation", sens: "entree", montant: 3000, motif: "Cotisation", date: "2026-09-01", createdAt: 1, createdBy: "Y" });
  await setDoc(doc(db, "commissionMembres/organisation_M001"), { commission: "organisation", matricule: "M001", nom: "A B", telephone: "+221770000000", role: "membre", ajouteLe: 1 });
  await setDoc(doc(db, "commissionReunions/r-org"), { commission: "organisation", titre: "Préparation", date: "2026-09-20", createdAt: 1 });

  // Versements : un en attente d'accusé vers Organisation, un déjà accusé.
  const versementBase = {
    de: "finances", montant: 150000, motif: "Dotation Journée Salaatu",
    moyen: "Espèces", reference: "", date: "2026-09-10", envoyePar: "Trésorier",
    envoyeAt: 1, ecritureEmetteur: "c-fin", observation: "",
    ecritureDestinataire: "", annulePar: "", annuleAt: 0, motifAnnulation: "",
  };
  await setDoc(doc(db, "commissionTransferts/v-attente"), { ...versementBase, vers: "organisation", statut: "envoye", recuPar: "", recuAt: 0 });
  await setDoc(doc(db, "commissionTransferts/v-attente2"), { ...versementBase, vers: "organisation", statut: "envoye", recuPar: "", recuAt: 0 });
  await setDoc(doc(db, "commissionTransferts/v-attente3"), { ...versementBase, vers: "organisation", statut: "envoye", recuPar: "", recuAt: 0 });
  await setDoc(doc(db, "commissionTransferts/v-recu"), { ...versementBase, vers: "communication", statut: "recu", recuPar: "Responsable", recuAt: 2, ecritureDestinataire: "c-com" });

  // Notifications : une nominative, une adressée à une commission.
  await setDoc(doc(db, "notifications/n-org"), { recipientUid: "", recipientCommission: "organisation", type: "transfert_envoye", title: "Versement", body: "150 000 F", read: false, createdAt: 1 });
  await setDoc(doc(db, "notifications/n-fin"), { recipientUid: "fin1", type: "info", title: "Bonjour", body: "…", read: false, createdAt: 1 });
  // Compte SANS commission : la règle ne doit pas échouer sur une clé absente.
  await setDoc(doc(db, "notifications/n-membre"), { recipientUid: "membre1", type: "info", title: "Pour toi", body: "…", read: false, createdAt: 1 });
  await setDoc(doc(db, "notifications/n-autre"), { recipientUid: "admin1", type: "info", title: "Pas pour toi", body: "…", read: false, createdAt: 1 });
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

console.log("\n── Fil de discussion ──");
const msg = (commission, texte = "Un message") => ({ commission, auteur: "Moi", role: "commission", texte, createdAt: Date.now() });
await t("Finances lit SON fil", assertSucceeds(getDoc(doc(as("fin1"), "commissionMessages/m-fin"))));
await t("Finances NE LIT PAS le fil de Communication", assertFails(getDoc(doc(as("fin1"), "commissionMessages/m-com"))));
await t("Finances écrit dans SON fil", assertSucceeds(addDoc(collection(as("fin1"), "commissionMessages"), msg("finances"))));
await t("Finances N'ÉCRIT PAS dans le fil de Communication", assertFails(addDoc(collection(as("fin1"), "commissionMessages"), msg("communication"))));
await t("Le Secrétariat lit le fil de Finances", assertSucceeds(getDoc(doc(as("sec1"), "commissionMessages/m-fin"))));
await t("Le Secrétariat répond dans le fil de Finances", assertSucceeds(addDoc(collection(as("sec1"), "commissionMessages"), { ...msg("finances"), role: "secretariat" })));
await t("Message vide refusé", assertFails(addDoc(collection(as("fin1"), "commissionMessages"), msg("finances", ""))));
await t("Message de plus de 2000 caractères refusé", assertFails(addDoc(collection(as("fin1"), "commissionMessages"), msg("finances", "x".repeat(2001)))));
await t("Un message ne peut pas être réécrit", assertFails(setDoc(doc(as("fin1"), "commissionMessages/m-fin"), { texte: "modifié" }, { merge: true })));
await t("Un visiteur anonyme ne lit aucun fil", assertFails(getDoc(doc(anon(), "commissionMessages/m-fin"))));

console.log("\n── Circuit de transmission ──");
await t("Finances transmet SON dossier", assertSucceeds(setDoc(doc(as("fin1"), "commissionDossiers/finances"), { statut: "transmis", transmisAt: Date.now() }, { merge: true })));
await t("Le Secrétariat fait suivre au Président", assertSucceeds(setDoc(doc(as("sec1"), "commissionDossiers/finances"), { statut: "valide", valideAt: Date.now() }, { merge: true })));
await t("Communication ne transmet pas le dossier de Finances", assertFails(setDoc(doc(as("fin1"), "commissionDossiers/communication"), { statut: "transmis" }, { merge: true })));
await t("Le Secrétariat NE RÉÉCRIT PAS le contenu du dossier", assertFails(setDoc(doc(as("sec1"), "commissionDossiers/finances"), { responsable: "réécrit par le secrétariat" }, { merge: true })));
await t("Le Secrétariat renvoie le dossier pour complément", assertSucceeds(setDoc(doc(as("sec1"), "commissionDossiers/finances"), { statut: "brouillon", transmisAt: null }, { merge: true })));

// Les lectures ci-dessus portent sur UN document. Une page, elle, interroge
// une COLLECTION : Firestore evalue alors la regle sur chaque document
// candidat et refuse la requete entiere des qu'un seul echoue. Une regle qui
// laisse passer un getDoc peut donc refuser la liste — d'ou ces tests.
console.log("\n── Requêtes de collection (ce que font vraiment les pages) ──");
await t("Admin liste les comptes rendus", assertSucceeds(getDocs(collection(as("admin1"), "comptesRendus"))));
await t("Secrétariat liste les comptes rendus", assertSucceeds(getDocs(collection(as("sec1"), "comptesRendus"))));
await t("Une commission REFUSÉE sur la liste complète (à cause des brouillons)",
  assertFails(getDocs(collection(as("fin1"), "comptesRendus"))));
await t("Une commission liste les comptes rendus PUBLIÉS",
  assertSucceeds(getDocs(query(collection(as("fin1"), "comptesRendus"), where("publie", "==", true)))));
await t("Finances liste SON fil",
  assertSucceeds(getDocs(query(collection(as("fin1"), "commissionMessages"), where("commission", "==", "finances")))));
await t("Finances REFUSÉE sur le fil complet",
  assertFails(getDocs(collection(as("fin1"), "commissionMessages"))));
await t("Secrétariat liste les rapports transmis", assertSucceeds(getDocs(collection(as("sec1"), "commissionReports"))));
await t("Secrétariat liste tous les dossiers", assertSucceeds(getDocs(collection(as("sec1"), "commissionDossiers"))));
await t("Une commission REFUSÉE sur la liste des dossiers",
  assertFails(getDocs(collection(as("fin1"), "commissionDossiers"))));

console.log("\n── Caisse de commission (séparée des finances nationales) ──");
const ecriture = (commission, extra = {}) => ({
  commission, sens: "entree", montant: 2000, motif: "Cotisation",
  date: "2026-09-15", createdAt: Date.now(), createdBy: "Moi", annuleId: "", ...extra });
await t("Finances écrit dans SA caisse", assertSucceeds(addDoc(collection(as("fin1"), "commissionCaisse"), ecriture("finances"))));
await t("Finances lit SA caisse", assertSucceeds(getDocs(query(collection(as("fin1"), "commissionCaisse"), where("commission", "==", "finances")))));
await t("Finances N'ÉCRIT PAS dans la caisse d'Organisation", assertFails(addDoc(collection(as("fin1"), "commissionCaisse"), ecriture("organisation"))));
await t("Finances NE LIT PAS la caisse d'Organisation", assertFails(getDoc(doc(as("fin1"), "commissionCaisse/c-org"))));
await t("Une écriture ne se modifie jamais", assertFails(setDoc(doc(as("fin1"), "commissionCaisse/c-fin"), { montant: 999999 }, { merge: true })));
await t("Une écriture ne s'efface pas (on l'annule)", assertFails(deleteDoc(doc(as("fin1"), "commissionCaisse/c-fin"))));
await t("Montant nul refusé", assertFails(addDoc(collection(as("fin1"), "commissionCaisse"), ecriture("finances", { montant: 0 }))));
await t("Montant négatif refusé", assertFails(addDoc(collection(as("fin1"), "commissionCaisse"), ecriture("finances", { montant: -500 }))));
await t("Sens inventé refusé", assertFails(addDoc(collection(as("fin1"), "commissionCaisse"), ecriture("finances", { sens: "cadeau" }))));
await t("Le Secrétariat lit la caisse d'une commission", assertSucceeds(getDoc(doc(as("sec1"), "commissionCaisse/c-fin"))));
await t("Le Secrétariat N'ÉCRIT PAS dans une caisse", assertFails(addDoc(collection(as("sec1"), "commissionCaisse"), ecriture("finances"))));
await t("Un visiteur anonyme ne voit aucune caisse", assertFails(getDoc(doc(anon(), "commissionCaisse/c-fin"))));

console.log("\n── Membres de commission et convocations ──");
await t("Organisation ajoute un membre", assertSucceeds(setDoc(doc(as("org1"), "commissionMembres/organisation_M002"), { commission: "organisation", matricule: "M002", nom: "C D", telephone: "+221770000001", role: "membre", ajouteLe: Date.now() })));
await t("Finances N'AJOUTE PAS un membre à Organisation", assertFails(setDoc(doc(as("fin1"), "commissionMembres/organisation_M003"), { commission: "organisation", matricule: "M003", nom: "E F", telephone: "", role: "membre", ajouteLe: Date.now() })));
await t("Finances NE LIT PAS les membres d'Organisation", assertFails(getDoc(doc(as("fin1"), "commissionMembres/organisation_M001"))));
await t("Organisation crée une réunion", assertSucceeds(addDoc(collection(as("org1"), "commissionReunions"), { commission: "organisation", titre: "Point caisse", date: "2026-09-25", createdAt: Date.now() })));
await t("Finances crée aussi ses réunions (toutes les commissions)", assertSucceeds(addDoc(collection(as("fin1"), "commissionReunions"), { commission: "finances", titre: "Point", date: "2026-09-25", createdAt: Date.now() })));
await t("Finances NE CRÉE PAS de réunion pour Organisation", assertFails(addDoc(collection(as("fin1"), "commissionReunions"), { commission: "organisation", titre: "Pirate", date: "2026-09-25", createdAt: Date.now() })));
await t("Le Secrétariat lit les réunions d'une commission", assertSucceeds(getDoc(doc(as("sec1"), "commissionReunions/r-org"))));

console.log("\n── Activités et aides (Social et Développement) ──");
const lot = (commission, extra = {}) => ({
  commission, type: "production", libelle: "Fournée de café", date: "2026-09-10",
  quantite: 200, coutTotal: 40000, prixUnitaire: 500, quantiteVendue: 180,
  createdAt: Date.now(), createdBy: "Moi", ...extra });
const aide = (commission, extra = {}) => ({
  commission, membreMatricule: "M009", membreNom: "Fatou Ndiaye", membreTelephone: "+221770000009",
  motif: "Maladie", precisions: "", montant: 15000, date: "2026-09-12",
  createdAt: Date.now(), createdBy: "Moi", ...extra });

await t("Sociale enregistre une fournée", assertSucceeds(addDoc(collection(as("soc1"), "commissionActivites"), lot("social-developpement"))));
await t("Sociale enregistre un lot d'événement", assertSucceeds(addDoc(collection(as("soc1"), "commissionActivites"), lot("social-developpement", { type: "evenement" }))));
await t("Type de lot inventé refusé", assertFails(addDoc(collection(as("soc1"), "commissionActivites"), lot("social-developpement", { type: "troc" }))));
await t("Quantité négative refusée", assertFails(addDoc(collection(as("soc1"), "commissionActivites"), lot("social-developpement", { quantite: -5 }))));
await t("Finances N'ENREGISTRE PAS une activité pour Sociale", assertFails(addDoc(collection(as("fin1"), "commissionActivites"), lot("social-developpement"))));

await t("Sociale verse une aide", assertSucceeds(addDoc(collection(as("soc1"), "commissionAides"), aide("social-developpement"))));
await t("Aide sans montant refusée", assertFails(addDoc(collection(as("soc1"), "commissionAides"), aide("social-developpement", { montant: 0 }))));
await t("Aide sans membre refusée", assertFails(addDoc(collection(as("soc1"), "commissionAides"), aide("social-developpement", { membreNom: "" }))));
await t("Une aide ne se réécrit pas", assertFails(setDoc(doc(as("soc1"), "commissionAides/a-soc"), { montant: 1 }, { merge: true })));
await t("Une aide ne s'efface pas", assertFails(deleteDoc(doc(as("soc1"), "commissionAides/a-soc"))));
await t("Finances NE LIT PAS les aides de Sociale", assertFails(getDoc(doc(as("fin1"), "commissionAides/a-soc"))));
await t("Le Secrétariat lit les aides", assertSucceeds(getDoc(doc(as("sec1"), "commissionAides/a-soc"))));
await t("Sociale liste SES activités", assertSucceeds(getDocs(query(collection(as("soc1"), "commissionActivites"), where("commission", "==", "social-developpement")))));

console.log("\n── Versements entre commissions ──");
const versement = (extra = {}) => ({
  de: "finances", vers: "organisation", montant: 50000, motif: "Dotation",
  moyen: "Wave", reference: "TX-1", date: "2026-09-14", statut: "envoye",
  envoyePar: "Trésorier", envoyeAt: Date.now(), ecritureEmetteur: "x",
  recuPar: "", recuAt: 0, observation: "", ecritureDestinataire: "",
  annulePar: "", annuleAt: 0, motifAnnulation: "", ...extra });

await t("Finances verse à une autre commission", assertSucceeds(addDoc(collection(as("fin1"), "commissionTransferts"), versement())));
await t("Organisation NE S'AUTO-VERSE PAS au nom de Finances", assertFails(addDoc(collection(as("org1"), "commissionTransferts"), versement())));
await t("Une commission ne verse pas en son propre nom", assertFails(addDoc(collection(as("org1"), "commissionTransferts"), versement({ de: "organisation", vers: "communication" }))));
await t("Le Secrétariat ne verse pas non plus", assertFails(addDoc(collection(as("sec1"), "commissionTransferts"), versement())));
await t("Versement vers une commission inconnue refusé", assertFails(addDoc(collection(as("fin1"), "commissionTransferts"), versement({ vers: "relations-exterieures" }))));
await t("Versement de Finances vers Finances refusé", assertFails(addDoc(collection(as("fin1"), "commissionTransferts"), versement({ vers: "finances" }))));
await t("Montant nul refusé", assertFails(addDoc(collection(as("fin1"), "commissionTransferts"), versement({ montant: 0 }))));
await t("Versement créé déjà « reçu » refusé", assertFails(addDoc(collection(as("fin1"), "commissionTransferts"), versement({ statut: "recu", recuPar: "moi", recuAt: 1 }))));

await t("Organisation lit les versements qu'elle reçoit", assertSucceeds(getDocs(query(collection(as("org1"), "commissionTransferts"), where("vers", "==", "organisation")))));
await t("Finances liste ce qu'elle a versé", assertSucceeds(getDocs(query(collection(as("fin1"), "commissionTransferts"), where("de", "==", "finances")))));
await t("Le Secrétariat lit tout le registre", assertSucceeds(getDocs(collection(as("sec1"), "commissionTransferts"))));
await t("Organisation NE LIT PAS un versement fait à Communication", assertFails(getDoc(doc(as("org1"), "commissionTransferts/v-recu"))));
await t("Un visiteur anonyme ne lit aucun versement", assertFails(getDoc(doc(anon(), "commissionTransferts/v-attente"))));

const accuse = { statut: "recu", recuPar: "Responsable Org", recuAt: Date.now(), observation: "Reçu en espèces", ecritureDestinataire: "e1" };
await t("Organisation N'ACCUSE PAS un versement destiné à Communication", assertFails(updateDoc(doc(as("org1"), "commissionTransferts/v-recu"), accuse)));
await t("Finances N'ACCUSE PAS réception à la place du destinataire", assertFails(updateDoc(doc(as("fin1"), "commissionTransferts/v-attente"), accuse)));
await t("L'accusé ne peut pas changer le montant", assertFails(updateDoc(doc(as("org1"), "commissionTransferts/v-attente"), { ...accuse, montant: 1 })));
await t("Organisation accuse réception de SON versement", assertSucceeds(updateDoc(doc(as("org1"), "commissionTransferts/v-attente"), accuse)));
await t("Un versement déjà accusé ne se ré-accuse pas", assertFails(updateDoc(doc(as("org1"), "commissionTransferts/v-attente"), accuse)));

const annule = { statut: "annule", annulePar: "Trésorier", annuleAt: Date.now(), motifAnnulation: "Erreur de montant" };
await t("Organisation N'ANNULE PAS un versement", assertFails(updateDoc(doc(as("org1"), "commissionTransferts/v-attente2"), annule)));
await t("Finances annule un versement jamais accusé", assertSucceeds(updateDoc(doc(as("fin1"), "commissionTransferts/v-attente2"), annule)));
await t("Finances N'ANNULE PAS un versement déjà accusé", assertFails(updateDoc(doc(as("fin1"), "commissionTransferts/v-recu"), annule)));
await t("Un versement ne s'efface pas", assertFails(deleteDoc(doc(as("fin1"), "commissionTransferts/v-attente3"))));
await t("L'administrateur peut supprimer en dernier recours", assertSucceeds(deleteDoc(doc(as("admin1"), "commissionTransferts/v-attente3"))));

console.log("\n── Notifications adressées à une commission ──");
await t("Organisation lit la notification adressée à sa commission", assertSucceeds(getDoc(doc(as("org1"), "notifications/n-org"))));
await t("Organisation liste les notifications de sa commission", assertSucceeds(getDocs(query(collection(as("org1"), "notifications"), where("recipientCommission", "==", "organisation")))));
await t("Finances NE LIT PAS la notification d'Organisation", assertFails(getDoc(doc(as("fin1"), "notifications/n-org"))));
await t("Finances lit toujours SA notification nominative", assertSucceeds(getDoc(doc(as("fin1"), "notifications/n-fin"))));
await t("Organisation marque comme lue la notification de sa commission", assertSucceeds(updateDoc(doc(as("org1"), "notifications/n-org"), { read: true, readAt: Date.now() })));
await t("Un visiteur anonyme ne lit aucune notification", assertFails(getDoc(doc(anon(), "notifications/n-org"))));
// Un compte sans commission (simple membre) : la règle interroge monSlug(),
// dont le champ est absent. Sans accès protégé, TOUTE la règle échouerait —
// y compris pour ses propres notifications.
await t("Un membre sans commission lit SA notification", assertSucceeds(getDoc(doc(as("membre1"), "notifications/n-membre"))));
await t("Un membre sans commission liste SES notifications", assertSucceeds(getDocs(query(collection(as("membre1"), "notifications"), where("recipientUid", "==", "membre1")))));
await t("Un membre ne lit pas la notification d'un autre", assertFails(getDoc(doc(as("membre1"), "notifications/n-autre"))));
await t("Un membre sans commission NE LIT PAS une notification de commission", assertFails(getDoc(doc(as("membre1"), "notifications/n-org"))));

console.log(`\n═══ ${ok} réussis, ${ko} échoués ═══`);
await env.cleanup();
process.exit(ko ? 1 : 0);
