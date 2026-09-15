// Caisse propre d'une commission.
//
// RÈGLE ABSOLUE : cette caisse n'a AUCUN rapport avec les finances nationales
// du Dahira (collection `finances`). Deux registres distincts, jamais
// additionnes, jamais croises. La page Finances du KSN ne lit pas cette
// collection, et firestore.rules interdit a une commission de toucher a celle
// d'une autre.
//
// Collection : commissionCaisse, un document par ecriture.
//
// Une erreur ne s'efface PAS : on l'annule par une ecriture inverse, qui
// reference l'originale. Une caisse dont on peut effacer les lignes ne vaut
// rien devant les membres — l'historique doit rester lisible et verifiable.

import { getDb } from "./firebase";
import { collection, addDoc, onSnapshot, query, where, limit } from "firebase/firestore";

export const MAX_MOTIF = 160;

export type Sens = "entree" | "sortie";

export type Ecriture = {
  id: string;
  commission: string;
  sens: Sens;
  /** En francs CFA, entier positif. Le sens porte le signe. */
  montant: number;
  motif: string;
  /** Renseigne quand l'ecriture concerne une personne : cotisation, aide… */
  membreMatricule: string;
  membreNom: string;
  /** Date de l'operation (AAAA-MM-JJ), qui n'est pas forcement celle de la
   *  saisie : on enregistre souvent le lendemain. */
  date: string;
  createdAt: number;
  createdBy: string;
  /** Renseigne sur une ecriture d'annulation : l'ecriture qu'elle annule. */
  annuleId: string;
};

export function soldeDe(ecritures: Ecriture[]): number {
  return ecritures.reduce((s, e) => s + (e.sens === "entree" ? e.montant : -e.montant), 0);
}

export function totalPar(ecritures: Ecriture[], sens: Sens): number {
  return ecritures.filter((e) => e.sens === sens).reduce((s, e) => s + e.montant, 0);
}

/** Identifiants des ecritures deja annulees : l'affichage les barre au lieu
 *  de les cacher. */
export function annulees(ecritures: Ecriture[]): Set<string> {
  return new Set(ecritures.map((e) => e.annuleId).filter(Boolean));
}

/** Une ecriture d'annulation : celle qui compense une autre. */
export const estAnnulation = (e: Ecriture) => Boolean(e.annuleId);

/** Les ecritures qui comptent vraiment : ni annulees, ni annulations.
 *
 *  Le solde est le meme qu'on les retire ou non — une paire s'annule. Mais les
 *  totaux « entres » et « sortis », eux, mentiraient : une entree de 3 000 F
 *  saisie par erreur puis annulee afficherait 3 000 entres ET 3 000 sortis,
 *  pour un mouvement qui n'a jamais eu lieu. */
export function vivantes(ecritures: Ecriture[]): Ecriture[] {
  const mortes = annulees(ecritures);
  return ecritures.filter((e) => !estAnnulation(e) && !mortes.has(e.id));
}

/** Nombre d'operations annulees — les paires, pas les lignes. */
export const nombreAnnulees = (ecritures: Ecriture[]) => annulees(ecritures).size;

export const fcfa = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F";

export function subscribeCaisse(
  slug: string,
  cb: (l: Ecriture[]) => void,
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
    // Le tri se fait en memoire, sur la date d'operation puis la saisie.
    query(collection(db, "commissionCaisse"), where("commission", "==", slug), limit(1000)),
    (snap) =>
      cb(
        snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Ecriture, "id">) }))
          .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1))
      ),
    (e) => onErreur?.(e as Error)
  );
}

type Saisie = {
  sens: Sens;
  montant: number;
  motif: string;
  date: string;
  membreMatricule?: string;
  membreNom?: string;
};

export async function ajouterEcriture(
  slug: string,
  s: Saisie,
  parQui: string
): Promise<void> {
  const db = getDb();
  const montant = Math.max(1, Math.floor(Math.abs(s.montant)));
  await addDoc(collection(db, "commissionCaisse"), {
    commission: slug,
    sens: s.sens,
    montant,
    motif: s.motif.trim().slice(0, MAX_MOTIF),
    membreMatricule: (s.membreMatricule ?? "").slice(0, 60),
    membreNom: (s.membreNom ?? "").slice(0, 120),
    date: s.date,
    createdAt: Date.now(),
    createdBy: parQui.slice(0, 120),
    annuleId: "",
  });
}

/** Annule une ecriture par son inverse. L'originale reste dans l'historique :
 *  c'est ce qui permet de retracer ce qui s'est passe. */
export async function annulerEcriture(e: Ecriture, parQui: string): Promise<void> {
  const db = getDb();
  await addDoc(collection(db, "commissionCaisse"), {
    commission: e.commission,
    sens: e.sens === "entree" ? "sortie" : "entree",
    montant: e.montant,
    motif: `Annulation — ${e.motif}`.slice(0, MAX_MOTIF),
    membreMatricule: e.membreMatricule,
    membreNom: e.membreNom,
    date: new Date().toISOString().slice(0, 10),
    createdAt: Date.now(),
    createdBy: parQui.slice(0, 120),
    annuleId: e.id,
  });
}
