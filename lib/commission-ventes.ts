// Ventes de la commission — le comptoir de la boutique.
//
// POURQUOI ICI ET PAS DANS L'ONGLET ACTIVITES ?
// Produire n'est pas vendre. L'onglet Activites suit les LOTS : une fournee de
// cafe, un lot achete pour un evenement — ce qu'on a engage, ce qu'il reste.
// Ici on suit les VENTES : qui a achete quoi, pour combien, et la facture qui
// en sort. Ce sont deux registres differents, et les melanger empecherait de
// repondre a la seule question qui compte au moment du bilan : combien
// avons-nous encaisse ?
//
// Chaque vente fait DEUX choses en une seule operation : elle s'inscrit au
// registre, et elle entre dans la caisse de la commission. Si l'une des deux
// echoue, aucune ne passe — sans quoi le solde mentirait.
//
// RAPPEL : la caisse de la commission n'a AUCUN rapport avec les finances
// nationales du Dahira.

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

/** Moyens d'encaissement au comptoir. */
export const MOYENS_VENTE = ["Espèces", "Wave", "Orange Money", "Free Money"] as const;

export type LigneVente = {
  designation: string;
  quantite: number;
  prixUnitaire: number;
};

export type Vente = {
  id: string;
  commission: string;
  /** Numero de facture, lisible : FA-2026-0007. */
  numero: string;
  date: string;
  clientNom: string;
  clientTelephone: string;
  lignes: LigneVente[];
  /** Recopie a l'enregistrement : une facture ne se recalcule pas apres coup,
   *  sinon une correction de prix changerait un document deja remis au client. */
  total: number;
  moyen: string;
  note: string;
  createdAt: number;
  createdBy: string;
  /** Ecriture d'entree creee dans la caisse de la commission. */
  ecritureId: string;

  /** Une vente annulee reste au registre, barree. */
  annulee: boolean;
  annuleePar: string;
  annuleeAt: number;
  motifAnnulation: string;
};

export const totalLignes = (l: LigneVente[]) =>
  l.reduce((s, x) => s + Math.max(0, x.quantite) * Math.max(0, x.prixUnitaire), 0);

export type BilanVentes = {
  /** Encaisse, hors ventes annulees. */
  encaisse: number;
  nombre: number;
  annulees: number;
  /** Nombre d'articles vendus, toutes lignes confondues. */
  articles: number;
};

export function bilanVentes(ventes: Vente[]): BilanVentes {
  const vivantes = ventes.filter((v) => !v.annulee);
  return {
    encaisse: vivantes.reduce((s, v) => s + v.total, 0),
    nombre: vivantes.length,
    annulees: ventes.length - vivantes.length,
    articles: vivantes.reduce(
      (s, v) => s + v.lignes.reduce((q, l) => q + Math.max(0, l.quantite), 0),
      0
    ),
  };
}

/** Prochain numero de facture de l'annee en cours.
 *
 *  Il se deduit de ce qui existe deja : pas de compteur separe qui pourrait
 *  diverger du registre. Deux personnes qui enregistrent une vente a la meme
 *  seconde obtiendraient le meme numero — au comptoir d'une boutique tenue par
 *  une personne a la fois, le risque est theorique, et le doublon serait
 *  cosmetique : ni la caisse ni le total n'en dependent. */
export function prochainNumero(ventes: Vente[], annee = new Date().getFullYear()): string {
  const prefixe = `FA-${annee}-`;
  const dernier = ventes
    .filter((v) => v.numero?.startsWith(prefixe))
    .map((v) => parseInt(v.numero.slice(prefixe.length), 10))
    .filter((n) => Number.isFinite(n))
    .reduce((m, n) => Math.max(m, n), 0);
  return `${prefixe}${String(dernier + 1).padStart(4, "0")}`;
}

/* ═══ Lecture ══════════════════════════════════════════════════════════ */

export function subscribeVentes(
  slug: string,
  cb: (v: Vente[]) => void,
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
    // Pas d'orderBy : combine au filtre il exigerait un index composite.
    query(collection(db, "commissionVentes"), where("commission", "==", slug), limit(1000)),
    (snap) =>
      cb(
        snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Vente, "id">) }))
          .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1))
      ),
    (e) => onErreur?.(e as Error)
  );
}

/* ═══ Ecriture ═════════════════════════════════════════════════════════ */

const entier = (v: number) => Math.max(0, Math.floor(Math.abs(v || 0)));
const coupe = (v: string, n: number) => (v ?? "").trim().slice(0, n);

/** Enregistre une vente et l'encaisse, en une seule operation. */
export async function enregistrerVente(
  slug: string,
  v: {
    numero: string;
    date: string;
    clientNom: string;
    clientTelephone: string;
    lignes: LigneVente[];
    moyen: string;
    note: string;
  },
  parQui: string
): Promise<Vente> {
  const lignes = v.lignes
    .filter((l) => l.designation.trim() && l.quantite > 0)
    .map((l) => ({
      designation: coupe(l.designation, 120),
      quantite: entier(l.quantite),
      prixUnitaire: entier(l.prixUnitaire),
    }));
  if (lignes.length === 0) throw new Error("Une facture a besoin d'au moins une ligne.");

  const total = totalLignes(lignes);
  if (total <= 0) throw new Error("Le total de la vente est nul.");

  const db = getDb();
  const lot = writeBatch(db);
  const refVente = doc(collection(db, "commissionVentes"));
  const refEcriture = doc(collection(db, "commissionCaisse"));

  lot.set(refEcriture, {
    commission: slug,
    sens: "entree",
    montant: total,
    motif: `Vente ${v.numero}${v.clientNom ? ` — ${v.clientNom}` : ""}`.slice(0, 160),
    membreMatricule: "",
    membreNom: coupe(v.clientNom, 120),
    date: v.date,
    createdAt: Date.now(),
    createdBy: coupe(parQui, 120),
    annuleId: "",
  });

  const vente: Omit<Vente, "id"> = {
    commission: slug,
    numero: coupe(v.numero, 40),
    date: v.date,
    clientNom: coupe(v.clientNom, 120),
    clientTelephone: coupe(v.clientTelephone, 40),
    lignes,
    total,
    moyen: coupe(v.moyen, 40),
    note: coupe(v.note, 300),
    createdAt: Date.now(),
    createdBy: coupe(parQui, 120),
    ecritureId: refEcriture.id,
    annulee: false,
    annuleePar: "",
    annuleeAt: 0,
    motifAnnulation: "",
  };
  lot.set(refVente, vente);

  await lot.commit();
  return { id: refVente.id, ...vente };
}

/** Annule une vente : la facture reste au registre, barree, et la caisse est
 *  compensee par une sortie du meme montant. Une vente qu'on pourrait effacer
 *  ne vaudrait rien devant les membres. */
export async function annulerVente(
  v: Vente,
  motifAnnulation: string,
  parQui: string
): Promise<void> {
  if (v.annulee) throw new Error("Cette vente est deja annulee.");
  const db = getDb();
  const lot = writeBatch(db);

  lot.set(doc(collection(db, "commissionCaisse")), {
    commission: v.commission,
    sens: "sortie",
    montant: v.total,
    motif: `Annulation de la vente ${v.numero}`.slice(0, 160),
    membreMatricule: "",
    membreNom: v.clientNom,
    date: new Date().toISOString().slice(0, 10),
    createdAt: Date.now(),
    createdBy: coupe(parQui, 120),
    annuleId: v.ecritureId,
  });

  lot.update(doc(db, "commissionVentes", v.id), {
    annulee: true,
    annuleePar: coupe(parQui, 120),
    annuleeAt: Date.now(),
    motifAnnulation: coupe(motifAnnulation, 300),
  });

  await lot.commit();
}
