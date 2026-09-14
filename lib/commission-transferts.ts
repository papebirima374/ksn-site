// Versements de la commission Finances vers les autres commissions.
//
// LE CIRCUIT, EN UNE PHRASE
//   Finances verse → la somme sort de SA caisse → la commission destinataire
//   accuse reception → la somme entre dans SA caisse.
//
// POURQUOI L'ACCUSE DE RECEPTION ?
// Parce que l'argent circule de la main a la main, en dehors du site. Tant que
// le destinataire n'a pas confirme, la commission Finances sait qu'elle a
// remis quelque chose mais pas qu'il est arrive. C'est exactement ce que le
// registre doit montrer : « envoye le 3, recu le 5 par Untel ». Un versement
// qui reste « en attente » trop longtemps est une question a poser, pas une
// ligne a corriger en silence.
//
// L'ecriture d'entree n'est donc PAS creee au depart : elle nait de l'accuse
// de reception, et c'est le destinataire lui-meme qui l'ecrit dans sa caisse.
// Les regles Firestore ne lui permettraient de toute facon pas d'ecrire dans
// la caisse d'une autre commission — et c'est heureux.
//
// RAPPEL : ces caisses de commission n'ont AUCUN rapport avec les finances
// nationales du Dahira (collection `finances`). Un versement circule d'une
// caisse de commission a une autre, rien de plus.

import { getDb } from "./firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  limit,
  writeBatch,
} from "firebase/firestore";
import { commissionNom } from "./commissions";

/** Seule la commission Finances verse. Le slug est fige ici pour que la
 *  regle Firestore et le code disent la meme chose. */
export const EMETTRICE = "finances";

export type StatutTransfert = "envoye" | "recu" | "annule";

export const LIBELLE_TRANSFERT: Record<StatutTransfert, string> = {
  envoye: "En attente d'accusé de réception",
  recu: "Réception accusée",
  annule: "Annulé",
};

/** Moyens de remise reellement utilises par le Dahira. */
export const MOYENS = ["Espèces", "Wave", "Orange Money", "Virement", "Chèque"] as const;

export type Transfert = {
  id: string;
  /** Slug de la commission emettrice — toujours `finances` aujourd'hui. */
  de: string;
  /** Slug de la commission destinataire. */
  vers: string;
  montant: number;
  motif: string;
  moyen: string;
  /** Reference de la remise : numero Wave, numero de cheque, « de la main a
   *  la main »… C'est la piece qui permet de retrouver l'operation ailleurs. */
  reference: string;
  /** Date de la remise (AAAA-MM-JJ), pas forcement celle de la saisie. */
  date: string;
  statut: StatutTransfert;

  envoyePar: string;
  envoyeAt: number;
  /** Ecriture de sortie creee dans la caisse de l'emettrice. */
  ecritureEmetteur: string;

  /** Renseignes a l'accuse de reception. */
  recuPar: string;
  recuAt: number;
  observation: string;
  /** Ecriture d'entree creee dans la caisse du destinataire. */
  ecritureDestinataire: string;

  /** Renseignes a l'annulation d'un versement jamais recu. */
  annulePar: string;
  annuleAt: number;
  motifAnnulation: string;
};

/* ═══ Lecture ══════════════════════════════════════════════════════════ */

function abonner(
  champ: "de" | "vers",
  slug: string,
  cb: (t: Transfert[]) => void,
  onErreur?: (e: Error) => void
): () => void {
  let db;
  try {
    db = getDb();
  } catch (e) {
    onErreur?.(e as Error);
    return () => {};
  }
  return onSnapshot(
    // Pas d'orderBy : combine au filtre, il exigerait un index composite.
    query(collection(db, "commissionTransferts"), where(champ, "==", slug), limit(500)),
    (snap) => cb(trier(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Transfert, "id">) })))),
    (e) => onErreur?.(e as Error)
  );
}

const trier = (l: Transfert[]) =>
  l.sort((a, b) => (a.date === b.date ? b.envoyeAt - a.envoyeAt : a.date < b.date ? 1 : -1));

/** Versements emis par une commission (en pratique : Finances). */
export const subscribeVersementsEmis = (
  slug: string,
  cb: (t: Transfert[]) => void,
  onErreur?: (e: Error) => void
) => abonner("de", slug, cb, onErreur);

/** Versements recus — ou attendus — par une commission. */
export const subscribeVersementsRecus = (
  slug: string,
  cb: (t: Transfert[]) => void,
  onErreur?: (e: Error) => void
) => abonner("vers", slug, cb, onErreur);

/** Tout le registre. Reserve a l'administrateur et au Secretariat : eux seuls
 *  ont le droit de lire les versements de toutes les commissions. */
export function subscribeTousLesVersements(
  cb: (t: Transfert[]) => void,
  onErreur?: (e: Error) => void
): () => void {
  let db;
  try {
    db = getDb();
  } catch (e) {
    onErreur?.(e as Error);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "commissionTransferts"), limit(1000)),
    (snap) => cb(trier(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Transfert, "id">) })))),
    (e) => onErreur?.(e as Error)
  );
}

/* ═══ Chiffres ═════════════════════════════════════════════════════════ */

export type BilanVersements = {
  /** Remis, quel que soit l'etat de l'accuse. */
  verse: number;
  /** Dont la reception a ete accusee. */
  recu: number;
  /** Remis mais pas encore accuse. */
  attente: number;
  nombre: number;
  nombreAttente: number;
};

export function bilanVersements(l: Transfert[]): BilanVersements {
  const vivants = l.filter((t) => t.statut !== "annule");
  const recus = vivants.filter((t) => t.statut === "recu");
  const attente = vivants.filter((t) => t.statut === "envoye");
  const somme = (x: Transfert[]) => x.reduce((s, t) => s + t.montant, 0);
  return {
    verse: somme(vivants),
    recu: somme(recus),
    attente: somme(attente),
    nombre: vivants.length,
    nombreAttente: attente.length,
  };
}

/* ═══ Ecriture ═════════════════════════════════════════════════════════ */

const entier = (v: number) => Math.max(0, Math.floor(Math.abs(v || 0)));
const coupe = (v: string, n: number) => (v ?? "").trim().slice(0, n);

/** Verse une somme a une autre commission.
 *
 *  Le versement ET la sortie de caisse partent dans le meme lot : soit les
 *  deux passent, soit aucun. Un versement enregistre sans sortie de caisse
 *  ferait mentir le solde de la commission Finances. */
export async function verser(
  de: string,
  v: {
    vers: string;
    montant: number;
    motif: string;
    moyen: string;
    reference: string;
    date: string;
  },
  parQui: string
): Promise<string> {
  if (v.vers === de) throw new Error("Une commission ne se verse pas a elle-meme.");
  const db = getDb();
  const montant = Math.max(1, entier(v.montant));
  const lot = writeBatch(db);

  const refTransfert = doc(collection(db, "commissionTransferts"));
  const refEcriture = doc(collection(db, "commissionCaisse"));

  lot.set(refEcriture, {
    commission: de,
    sens: "sortie",
    montant,
    motif: `Versement — ${commissionNom(v.vers)}${v.motif ? ` — ${v.motif}` : ""}`.slice(0, 160),
    membreMatricule: "",
    membreNom: "",
    date: v.date,
    createdAt: Date.now(),
    createdBy: coupe(parQui, 120),
    annuleId: "",
  });

  lot.set(refTransfert, {
    de,
    vers: v.vers,
    montant,
    motif: coupe(v.motif, 300),
    moyen: coupe(v.moyen, 40),
    reference: coupe(v.reference, 80),
    date: v.date,
    statut: "envoye",
    envoyePar: coupe(parQui, 120),
    envoyeAt: Date.now(),
    ecritureEmetteur: refEcriture.id,
    recuPar: "",
    recuAt: 0,
    observation: "",
    ecritureDestinataire: "",
    annulePar: "",
    annuleAt: 0,
    motifAnnulation: "",
  });

  await lot.commit();
  return refTransfert.id;
}

/** Accuse reception d'un versement. C'est le destinataire qui ecrit — dans sa
 *  propre caisse, et nulle part ailleurs. */
export async function accuserReception(
  t: Transfert,
  observation: string,
  parQui: string
): Promise<void> {
  if (t.statut !== "envoye") throw new Error("Ce versement n'attend plus d'accuse de reception.");
  const db = getDb();
  const lot = writeBatch(db);

  const refEcriture = doc(collection(db, "commissionCaisse"));
  lot.set(refEcriture, {
    commission: t.vers,
    sens: "entree",
    montant: t.montant,
    motif: `Versement reçu — ${commissionNom(t.de)}${t.motif ? ` — ${t.motif}` : ""}`.slice(0, 160),
    membreMatricule: "",
    membreNom: "",
    date: new Date().toISOString().slice(0, 10),
    createdAt: Date.now(),
    createdBy: coupe(parQui, 120),
    annuleId: "",
  });

  lot.update(doc(db, "commissionTransferts", t.id), {
    statut: "recu",
    recuPar: coupe(parQui, 120),
    recuAt: Date.now(),
    observation: coupe(observation, 300),
    ecritureDestinataire: refEcriture.id,
  });

  await lot.commit();
}

/** Annule un versement que le destinataire n'a jamais accuse.
 *
 *  Rien n'est efface : le versement reste au registre, marque « annule », et
 *  la sortie de caisse est compensee par une entree du meme montant. Un
 *  registre dont on peut faire disparaitre une ligne ne vaut rien devant
 *  l'assemblee. */
export async function annulerVersement(
  t: Transfert,
  motifAnnulation: string,
  parQui: string
): Promise<void> {
  if (t.statut !== "envoye")
    throw new Error("Seul un versement en attente d'accuse peut etre annule.");
  const db = getDb();
  const lot = writeBatch(db);

  lot.set(doc(collection(db, "commissionCaisse")), {
    commission: t.de,
    sens: "entree",
    montant: t.montant,
    motif: `Annulation du versement — ${commissionNom(t.vers)}`.slice(0, 160),
    membreMatricule: "",
    membreNom: "",
    date: new Date().toISOString().slice(0, 10),
    createdAt: Date.now(),
    createdBy: coupe(parQui, 120),
    annuleId: t.ecritureEmetteur,
  });

  lot.update(doc(db, "commissionTransferts", t.id), {
    statut: "annule",
    annulePar: coupe(parQui, 120),
    annuleAt: Date.now(),
    motifAnnulation: coupe(motifAnnulation, 300),
  });

  await lot.commit();
}
