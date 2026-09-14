// Preparation d'une journee : le tableau de bord de la commission Organisation.
//
// C'est elle qui monte les tentes, loue la sonorisation, nourrit l'assemblee et
// ramene les invites. Avant chaque grande journee, la meme question revient :
// qui fait quoi, pour quand, et avec quel budget ? Elle se reglait sur un
// cahier ou dans un groupe WhatsApp, ou la reponse se perd entre deux messages.
//
// Une tache porte donc les quatre seules choses qui comptent le jour J :
//   ce qu'il faut faire · qui s'en charge · pour quand · combien c'est prevu
//
// Le budget PREVU et la DEPENSE reelle vivent cote a cote : c'est l'ecart entre
// les deux qui se discute en reunion, pas le total seul. La depense n'entre PAS
// d'elle-meme dans la caisse — on saisit la sortie depuis l'onglet Caisse quand
// l'argent sort vraiment, sinon un budget previsionnel viderait la caisse sur
// le papier avant d'avoir rien achete.

import { getDb } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  limit,
} from "firebase/firestore";

export type StatutTache = "a_faire" | "en_cours" | "fait" | "bloque";

export const LIBELLE_TACHE: Record<StatutTache, string> = {
  a_faire: "À faire",
  en_cours: "En cours",
  fait: "Fait",
  bloque: "Bloqué",
};

/** Ordre d'affichage : ce qui reste a traiter d'abord, ce qui est fini a la
 *  fin. Un tableau qui ouvre sur les taches terminees ne sert a personne. */
export const ORDRE_STATUT: StatutTache[] = ["bloque", "en_cours", "a_faire", "fait"];

export type Tache = {
  id: string;
  commission: string;
  libelle: string;
  detail: string;
  /** Nom de la personne chargee — pas un compte : les membres d'une commission
   *  n'en ont pas. On le choisit dans la liste des membres, ou on l'ecrit. */
  responsable: string;
  responsableTelephone: string;
  /** AAAA-MM-JJ, ou vide quand rien n'est fixe. */
  echeance: string;
  /** Budget prevu, en francs CFA. */
  budget: number;
  /** Depense reellement engagee. */
  depense: number;
  statut: StatutTache;
  createdAt: number;
  createdBy: string;
  updatedAt: number;
};

/* ═══ Chiffres ═════════════════════════════════════════════════════════ */

export type BilanPreparation = {
  total: number;
  faites: number;
  /** Ni faites, ni bloquees : ce qui avance. */
  enCours: number;
  bloquees: number;
  budget: number;
  depense: number;
  /** Positif : il reste de la marge. Negatif : on a depasse. */
  ecart: number;
  /** Taches en retard, hors celles deja faites. */
  enRetard: number;
  /** 0 a 100. */
  avancement: number;
};

export function estEnRetard(t: Tache, aujourdhui = new Date().toISOString().slice(0, 10)): boolean {
  return !!t.echeance && t.statut !== "fait" && t.echeance < aujourdhui;
}

export function bilanPreparation(taches: Tache[]): BilanPreparation {
  const faites = taches.filter((t) => t.statut === "fait").length;
  const bloquees = taches.filter((t) => t.statut === "bloque").length;
  const budget = taches.reduce((s, t) => s + t.budget, 0);
  const depense = taches.reduce((s, t) => s + t.depense, 0);
  return {
    total: taches.length,
    faites,
    enCours: taches.filter((t) => t.statut === "en_cours").length,
    bloquees,
    budget,
    depense,
    ecart: budget - depense,
    enRetard: taches.filter((t) => estEnRetard(t)).length,
    avancement: taches.length ? Math.round((faites / taches.length) * 100) : 0,
  };
}

/** Tri d'affichage : le plus urgent en haut. Une tache bloquee passe devant,
 *  puis la plus proche de son echeance ; celles sans date ferment la marche. */
export function trier(taches: Tache[]): Tache[] {
  return [...taches].sort((a, b) => {
    const rang = (t: Tache) => ORDRE_STATUT.indexOf(t.statut);
    if (rang(a) !== rang(b)) return rang(a) - rang(b);
    if (!a.echeance && !b.echeance) return b.createdAt - a.createdAt;
    if (!a.echeance) return 1;
    if (!b.echeance) return -1;
    return a.echeance < b.echeance ? -1 : 1;
  });
}

/* ═══ Lecture ══════════════════════════════════════════════════════════ */

export function subscribeTaches(
  slug: string,
  cb: (t: Tache[]) => void,
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
    query(collection(db, "commissionTaches"), where("commission", "==", slug), limit(500)),
    (snap) =>
      cb(trier(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Tache, "id">) })))),
    (e) => onErreur?.(e as Error)
  );
}

/* ═══ Ecriture ═════════════════════════════════════════════════════════ */

const entier = (v: number) => Math.max(0, Math.floor(Math.abs(v || 0)));
const coupe = (v: string, n: number) => (v ?? "").trim().slice(0, n);

export async function ajouterTache(
  slug: string,
  t: {
    libelle: string;
    detail: string;
    responsable: string;
    responsableTelephone: string;
    echeance: string;
    budget: number;
  },
  parQui: string
): Promise<void> {
  if (!t.libelle.trim()) throw new Error("Une tâche a besoin d'un intitulé.");
  const db = getDb();
  await addDoc(collection(db, "commissionTaches"), {
    commission: slug,
    libelle: coupe(t.libelle, 160),
    detail: coupe(t.detail, 600),
    responsable: coupe(t.responsable, 120),
    responsableTelephone: coupe(t.responsableTelephone, 40),
    echeance: t.echeance || "",
    budget: entier(t.budget),
    depense: 0,
    statut: "a_faire" as StatutTache,
    createdAt: Date.now(),
    createdBy: coupe(parQui, 120),
    updatedAt: Date.now(),
  });
}

/** Champs qu'on peut reprendre apres coup. L'auteur et la date de creation
 *  n'en font pas partie : ils disent d'ou vient la ligne. */
export type ModifTache = Partial<
  Pick<
    Tache,
    "libelle" | "detail" | "responsable" | "responsableTelephone" | "echeance" | "budget" | "depense" | "statut"
  >
>;

export async function modifierTache(id: string, patch: ModifTache): Promise<void> {
  const db = getDb();
  const propre: Record<string, unknown> = { updatedAt: Date.now() };
  if (patch.libelle !== undefined) propre.libelle = coupe(patch.libelle, 160);
  if (patch.detail !== undefined) propre.detail = coupe(patch.detail, 600);
  if (patch.responsable !== undefined) propre.responsable = coupe(patch.responsable, 120);
  if (patch.responsableTelephone !== undefined)
    propre.responsableTelephone = coupe(patch.responsableTelephone, 40);
  if (patch.echeance !== undefined) propre.echeance = patch.echeance || "";
  if (patch.budget !== undefined) propre.budget = entier(patch.budget);
  if (patch.depense !== undefined) propre.depense = entier(patch.depense);
  if (patch.statut !== undefined) propre.statut = patch.statut;
  await updateDoc(doc(db, "commissionTaches", id), propre);
}

export async function supprimerTache(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "commissionTaches", id));
}

/** Message a envoyer au responsable d'une tache, sur WhatsApp — le canal reel
 *  du Dahira, et le seul qui atteigne quelqu'un sans compte sur le site. */
export function texteRappel(t: Tache, nomCommission: string): string {
  const quand = t.echeance
    ? new Date(t.echeance).toLocaleDateString("fr-FR", { day: "2-digit", month: "long" })
    : null;
  return (
    `As-salaamu 'alaykum ${t.responsable}.\n\n` +
    `Rappel de la commission ${nomCommission} :\n« ${t.libelle} »` +
    (quand ? `\nÉchéance : ${quand}` : "") +
    (t.budget ? `\nBudget prévu : ${new Intl.NumberFormat("fr-FR").format(t.budget)} FCFA` : "") +
    `\n\nJazaakumu Laahu khayran.`
  );
}
