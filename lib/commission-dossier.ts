// Dossier de travail d'une commission.
//
// Collection : commissionDossiers, un document par commission (l'identifiant
// du document EST le slug de la commission). Contrairement a
// commissionReports — une piece transmise, figee une fois envoyee — le dossier
// est un document vivant : la commission le reprend autant de fois qu'elle
// veut jusqu'a l'assemblee.
//
// Acces (cf. firestore.rules) :
//   - la commission concernee : lecture + ecriture de SON dossier
//   - le Secretariat et l'administrateur : lecture de tous les dossiers
//   - personne d'autre

import { getDb } from "./firebase";
import { doc, onSnapshot, setDoc, collection, query, getDocs } from "firebase/firestore";

/** Une ligne de liste. L'identifiant sert de cle React et permet de supprimer
 *  une ligne au milieu sans decaler les autres. */
export type Ligne = { id: string; texte: string };

export type Cellule = { id: string; nom: string; effectif: string; etat: string };

export type Proposition = { id: string; titre: string; detail: string; moyens: string };

export type Dossier = {
  commission: string;
  responsable: string;
  telephone: string;
  membres: string;
  activites: Ligne[];
  difficultes: Ligne[];
  salaatu: string;
  salaatuPrecisions: string;
  cellules: Cellule[];
  propositions: Proposition[];
  divers: Ligne[];
  updatedAt: number | null;
  updatedBy: string;
};

export function nouvelId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function dossierVide(commission: string): Dossier {
  return {
    commission,
    responsable: "",
    telephone: "",
    membres: "",
    activites: [{ id: nouvelId(), texte: "" }],
    difficultes: [{ id: nouvelId(), texte: "" }],
    salaatu: "",
    salaatuPrecisions: "",
    cellules: [{ id: nouvelId(), nom: "", effectif: "", etat: "" }],
    propositions: [{ id: nouvelId(), titre: "", detail: "", moyens: "" }],
    divers: [{ id: nouvelId(), texte: "" }],
    updatedAt: null,
    updatedBy: "",
  };
}

/** Complete un document Firestore partiel. Un dossier enregistre par une
 *  version anterieure peut ne pas avoir tous les champs : on ne veut pas que
 *  la page plante pour autant. */
function normaliser(commission: string, d: Partial<Dossier> | undefined): Dossier {
  const base = dossierVide(commission);
  if (!d) return base;
  const liste = <T extends { id: string }>(v: unknown, defaut: T[]): T[] =>
    Array.isArray(v) && v.length ? (v as T[]) : defaut;
  return {
    commission,
    responsable: d.responsable ?? "",
    telephone: d.telephone ?? "",
    membres: d.membres ?? "",
    activites: liste(d.activites, base.activites),
    difficultes: liste(d.difficultes, base.difficultes),
    salaatu: d.salaatu ?? "",
    salaatuPrecisions: d.salaatuPrecisions ?? "",
    cellules: liste(d.cellules, base.cellules),
    propositions: liste(d.propositions, base.propositions),
    divers: liste(d.divers, base.divers),
    updatedAt: d.updatedAt ?? null,
    updatedBy: d.updatedBy ?? "",
  };
}

/** Abonnement au dossier d'une commission.
 *
 *  ATTENTION : la page n'applique que le PREMIER instantane recu, pour ne pas
 *  ecraser ce que la personne est en train de taper. Si deux membres de la
 *  meme commission editent en meme temps, le dernier a enregistrer gagne —
 *  le champ updatedBy dit alors qui a enregistre en dernier. Suffisant pour
 *  un dossier tenu par un responsable ; a revoir si l'edition devient
 *  reellement collaborative. */
export function subscribeDossier(
  slug: string,
  cb: (d: Dossier) => void,
  onErreur?: (e: Error) => void
): () => void {
  const db = getDb();
  return onSnapshot(
    doc(db, "commissionDossiers", slug),
    (snap) => cb(normaliser(slug, snap.data() as Partial<Dossier> | undefined)),
    (e) => onErreur?.(e as Error)
  );
}

export async function enregistrerDossier(d: Dossier, parQui: string): Promise<void> {
  const db = getDb();
  await setDoc(
    doc(db, "commissionDossiers", d.commission),
    { ...d, updatedAt: Date.now(), updatedBy: parQui.slice(0, 120) },
    { merge: true }
  );
}

/** Tous les dossiers (Secretariat / administrateur). */
export async function lireTousLesDossiers(): Promise<Dossier[]> {
  const db = getDb();
  const snap = await getDocs(query(collection(db, "commissionDossiers")));
  return snap.docs.map((d) => normaliser(d.id, d.data() as Partial<Dossier>));
}

/** Une ligne vide ne doit pas partir a l'impression ni au decompte. */
export const nonVide = (t: string) => t.trim().length > 0;
