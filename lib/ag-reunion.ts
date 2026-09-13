// Suivi de l'assemblee : relances aux commissions et compte rendu de reunion.
//
// Deux collections, toutes deux tenues par le Secretariat (et l'administrateur) :
//   agRelances/<slug>   — trace de la derniere relance envoyee a une commission
//   comptesRendus/<id>  — le compte rendu redige apres la reunion
//
// Les droits exacts sont dans firestore.rules. Resume : le Secretariat ecrit,
// les commissions lisent (leur propre relance, et les comptes rendus publies).

import { getDb } from "./firebase";
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

/* ═══ Relances ═════════════════════════════════════════════════════════ */

export type Relance = { at: number; by: string };

/** Toutes les relances, indexees par slug de commission. */
export function subscribeRelances(
  cb: (m: Record<string, Relance>) => void
): () => void {
  let db;
  try {
    db = getDb();
  } catch {
    cb({});
    return () => {};
  }
  return onSnapshot(
    collection(db, "agRelances"),
    (snap) => {
      const m: Record<string, Relance> = {};
      snap.docs.forEach((d) => (m[d.id] = d.data() as Relance));
      cb(m);
    },
    () => cb({})
  );
}

/** Enregistre qu'une relance vient d'etre envoyee. L'envoi lui-meme passe par
 *  WhatsApp (c'est le canal reel du Dahira) : on ne trace ici que la date, pour
 *  que le Secretariat sache qui a deja ete relance et quand. */
export async function marquerRelance(slug: string, parQui: string): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, "agRelances", slug), {
    at: Date.now(),
    by: parQui.slice(0, 120),
  });
}

/* ═══ Compte rendu de reunion ══════════════════════════════════════════ */

export type PointOdj = {
  id: string;
  titre: string;
  resume: string;
  decisions: string;
  responsable: string;
  echeance: string;
};

export type CompteRendu = {
  id: string;
  titre: string;
  date: string;
  lieu: string;
  presidence: string;
  secretaire: string;
  presents: string;
  excuses: string;
  points: PointOdj[];
  divers: string;
  /** Tant qu'un compte rendu n'est pas publie, seul le Secretariat le voit. */
  publie: boolean;
  updatedAt: number | null;
  updatedBy: string;
};

export function nouvelId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function pointVide(): PointOdj {
  return { id: nouvelId(), titre: "", resume: "", decisions: "", responsable: "", echeance: "" };
}

/** Points par defaut : l'ordre du jour de l'assemblee du 19 septembre 2026.
 *  Le Secretariat peut en ajouter, en retirer ou les renommer. */
export function compteRenduVide(id: string): CompteRendu {
  return {
    id,
    titre: "Assemblée Générale",
    date: "2026-09-19",
    lieu: "Tuuba Saam Kër Sëriñ Basiiru Ture",
    presidence: "",
    secretaire: "",
    presents: "",
    excuses: "",
    points: [
      { ...pointVide(), titre: "Compte rendu des commissions" },
      { ...pointVide(), titre: "Bilan provisoire des commissions (bisub Salaatu 'Alaa Nabii)" },
      { ...pointVide(), titre: "Mise au point sur les cellules" },
      { ...pointVide(), titre: "Divers" },
    ],
    divers: "",
    publie: false,
    updatedAt: null,
    updatedBy: "",
  };
}

function normaliser(id: string, d: Partial<CompteRendu> | undefined): CompteRendu {
  const base = compteRenduVide(id);
  if (!d) return base;
  return {
    ...base,
    ...d,
    id,
    points: Array.isArray(d.points) && d.points.length ? d.points : base.points,
  };
}

/** @param brouillonsInclus vrai pour le Secretariat et l'administrateur.
 *
 *  ATTENTION, ce parametre n'est pas cosmetique. La regle Firestore autorise
 *  la lecture d'un compte rendu non publie au seul Secretariat. Sur une
 *  REQUETE de collection, Firestore evalue la regle sur chaque document
 *  candidat et refuse la requete ENTIERE des qu'un seul echoue : une
 *  commission qui demanderait tous les comptes rendus serait donc refusee a
 *  cause des brouillons, alors meme qu'elle a le droit de lire les publies.
 *  D'ou le filtre `publie == true` ci-dessous, qui rend la requete
 *  demontrable pour la regle. */
export function subscribeComptesRendus(
  brouillonsInclus: boolean,
  cb: (l: CompteRendu[]) => void,
  onErreur?: (e: Error) => void
): () => void {
  let db;
  try {
    db = getDb();
  } catch {
    cb([]);
    return () => {};
  }
  const base = collection(db, "comptesRendus");
  return onSnapshot(
    // Pas d'orderBy : combine au filtre, il exigerait un index composite.
    brouillonsInclus ? query(base) : query(base, where("publie", "==", true)),
    (snap) =>
      cb(
        snap.docs
          .map((d) => normaliser(d.id, d.data() as Partial<CompteRendu>))
          .sort((a, b) => (a.date < b.date ? 1 : -1))
      ),
    (e) => onErreur?.(e as Error)
  );
}

export async function enregistrerCompteRendu(cr: CompteRendu, parQui: string): Promise<void> {
  const db = getDb();
  await setDoc(
    doc(db, "comptesRendus", cr.id),
    { ...cr, updatedAt: Date.now(), updatedBy: parQui.slice(0, 120) },
    { merge: true }
  );
}

export async function supprimerCompteRendu(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "comptesRendus", id));
}
