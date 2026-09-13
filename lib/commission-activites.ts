// Activites economiques et aides sociales d'une commission.
//
// Concu pour Social et Developpement, qui produit et vend (le cafe), revend
// lors des evenements, et puise dans SA caisse pour aider un membre malade ou
// qui traverse un evenement familial.
//
// Deux collections :
//   commissionActivites — les lots : une fournee de cafe, un lot d'evenement
//   commissionAides     — les aides versees a un membre
//
// RAPPEL : la caisse de la commission n'a aucun rapport avec les finances
// nationales. Une aide sort de LEUR caisse, pas de celle du Dahira.

import { getDb } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  limit,
  writeBatch,
} from "firebase/firestore";

/* ═══ Lots : production et revente ═════════════════════════════════════ */

export type TypeLot = "production" | "evenement";

export const LIBELLE_LOT: Record<TypeLot, string> = {
  production: "Production",
  evenement: "Revente d'événement",
};

/** Un lot couvre les deux activites, qui ont la meme forme : on engage un
 *  cout, on produit ou on achete une quantite, on en vend une partie a un
 *  prix unitaire. La marge et le restant se deduisent — on ne les stocke pas,
 *  pour qu'ils ne puissent jamais contredire les chiffres saisis. */
export type Lot = {
  id: string;
  commission: string;
  type: TypeLot;
  libelle: string;
  date: string;
  /** Produite (une fournee) ou achetee (un lot d'evenement). */
  quantite: number;
  /** Cout total engage : ingredients, achat en gros, transport. */
  coutTotal: number;
  prixUnitaire: number;
  quantiteVendue: number;
  createdAt: number;
  createdBy: string;
};

export const recette = (l: Lot) => l.quantiteVendue * l.prixUnitaire;
export const marge = (l: Lot) => recette(l) - l.coutTotal;
export const restant = (l: Lot) => Math.max(0, l.quantite - l.quantiteVendue);

export type BilanActivites = {
  lots: number;
  cout: number;
  recette: number;
  marge: number;
  invendus: number;
};

export function bilanActivites(lots: Lot[]): BilanActivites {
  return lots.reduce<BilanActivites>(
    (b, l) => ({
      lots: b.lots + 1,
      cout: b.cout + l.coutTotal,
      recette: b.recette + recette(l),
      marge: b.marge + marge(l),
      invendus: b.invendus + restant(l),
    }),
    { lots: 0, cout: 0, recette: 0, marge: 0, invendus: 0 }
  );
}

export function subscribeLots(
  slug: string,
  cb: (l: Lot[]) => void,
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
    query(collection(db, "commissionActivites"), where("commission", "==", slug), limit(500)),
    (snap) =>
      cb(
        snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Lot, "id">) }))
          .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1))
      ),
    (e) => onErreur?.(e as Error)
  );
}

const entier = (v: number) => Math.max(0, Math.floor(Math.abs(v || 0)));

export async function ajouterLot(
  slug: string,
  l: {
    type: TypeLot;
    libelle: string;
    date: string;
    quantite: number;
    coutTotal: number;
    prixUnitaire: number;
    quantiteVendue: number;
  },
  parQui: string
): Promise<void> {
  const db = getDb();
  await addDoc(collection(db, "commissionActivites"), {
    commission: slug,
    type: l.type,
    libelle: l.libelle.trim().slice(0, 160),
    date: l.date,
    quantite: entier(l.quantite),
    coutTotal: entier(l.coutTotal),
    prixUnitaire: entier(l.prixUnitaire),
    quantiteVendue: entier(l.quantiteVendue),
    createdAt: Date.now(),
    createdBy: parQui.slice(0, 120),
  });
}

export async function supprimerLot(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "commissionActivites", id));
}

/* ═══ Aides sociales ═══════════════════════════════════════════════════ */

export const MOTIFS_AIDE = [
  "Maladie",
  "Événement familial",
  "Décès",
  "Naissance",
  "Mariage",
  "Scolarité",
  "Autre",
] as const;

export type Aide = {
  id: string;
  commission: string;
  membreMatricule: string;
  membreNom: string;
  /** Seuls le nom et le telephone du membre sont repris ici : c'est tout ce
   *  dont la commission a besoin pour verser une aide et faire le suivi. */
  membreTelephone: string;
  motif: string;
  precisions: string;
  montant: number;
  date: string;
  createdAt: number;
  createdBy: string;
};

export function subscribeAides(
  slug: string,
  cb: (l: Aide[]) => void,
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
    query(collection(db, "commissionAides"), where("commission", "==", slug), limit(500)),
    (snap) =>
      cb(
        snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Aide, "id">) }))
          .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1))
      ),
    (e) => onErreur?.(e as Error)
  );
}

/** Verse une aide ET sort le montant de la caisse, en une seule operation.
 *
 *  Les deux ecritures partent dans le meme lot : soit tout passe, soit rien.
 *  Sans cela une aide pourrait etre enregistree sans sortir de la caisse — le
 *  solde mentirait, et personne ne saurait pourquoi. */
export async function verserAide(
  slug: string,
  a: {
    membreMatricule: string;
    membreNom: string;
    membreTelephone: string;
    motif: string;
    precisions: string;
    montant: number;
    date: string;
  },
  parQui: string
): Promise<void> {
  const db = getDb();
  const montant = Math.max(1, entier(a.montant));
  const lot = writeBatch(db);

  lot.set(doc(collection(db, "commissionAides")), {
    commission: slug,
    membreMatricule: a.membreMatricule.slice(0, 60),
    membreNom: a.membreNom.slice(0, 120),
    membreTelephone: a.membreTelephone.slice(0, 40),
    motif: a.motif.slice(0, 80),
    precisions: a.precisions.trim().slice(0, 500),
    montant,
    date: a.date,
    createdAt: Date.now(),
    createdBy: parQui.slice(0, 120),
  });

  lot.set(doc(collection(db, "commissionCaisse")), {
    commission: slug,
    sens: "sortie",
    montant,
    motif: `Aide — ${a.motif} — ${a.membreNom}`.slice(0, 160),
    membreMatricule: a.membreMatricule.slice(0, 60),
    membreNom: a.membreNom.slice(0, 120),
    date: a.date,
    createdAt: Date.now(),
    createdBy: parQui.slice(0, 120),
    annuleId: "",
  });

  await lot.commit();
}

/** Une aide ne s'efface pas : elle a bouge la caisse. Pour corriger, on annule
 *  l'ecriture de caisse correspondante depuis l'onglet Caisse. */
export const totalAides = (aides: Aide[]) => aides.reduce((s, a) => s + a.montant, 0);
