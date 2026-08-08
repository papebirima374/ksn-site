// Source unique pour le compteur du challenge "1 milliard de Salaatu".
//
// Architecture : le total reel vient (a terme) du projet Firebase KIPPAANGOG
// via une connexion cross-project lecture-seule. Tant qu'on n'a pas la config
// du dev mobile, on utilise une estimation animee basee sur le rythme de
// croissance reel de l'app : environ 7 000 000 Salaatu / semaine.
//
// Quand on aura la config KIPPAANGOG, on remplace simplement getChallengeStats
// par un getDoc(doc(kippaangogDb, "compteur/global")) — le reste de la page
// est totalement decouple.

export const CHALLENGE_TARGET = 1_000_000_000; // 1 milliard

// Point de depart : valeur plausible cumulee au 1er janvier 2026.
// L'app annonce ~7M/semaine de croissance.
const BASE_TOTAL_2026 = 250_000_000;
const BASE_TIMESTAMP_MS = new Date("2026-01-01T00:00:00Z").getTime();
const GROWTH_PER_SECOND = 7_000_000 / (7 * 24 * 60 * 60); // ~11.57 / sec

export type ChallengeStats = {
  total: number;
  thisWeek: number;
  today: number;
  thisMonth: number;
  lastMonth: number;
  contributors: number;
  /** true quand la connexion KIPPAANGOG sera en place */
  isLive: boolean;
};

/** Retourne une estimation animee du total cumule a l'instant T.
 *  Cette fonction sera remplacee par un fetch Firestore cross-project. */
export function estimatedChallengeStats(now = Date.now()): ChallengeStats {
  const secondsSinceBase = Math.max(0, (now - BASE_TIMESTAMP_MS) / 1000);
  const total = Math.floor(BASE_TOTAL_2026 + secondsSinceBase * GROWTH_PER_SECOND);

  // Cycles realistes (semaine, mois, jour) calcules a partir du rythme moyen.
  const secondsThisWeek = (() => {
    const d = new Date(now);
    const day = d.getUTCDay() || 7;
    return (
      (day - 1) * 86400 +
      d.getUTCHours() * 3600 +
      d.getUTCMinutes() * 60 +
      d.getUTCSeconds()
    );
  })();
  const secondsToday = (() => {
    const d = new Date(now);
    return d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds();
  })();
  const secondsThisMonth = (() => {
    const d = new Date(now);
    return (
      (d.getUTCDate() - 1) * 86400 +
      d.getUTCHours() * 3600 +
      d.getUTCMinutes() * 60 +
      d.getUTCSeconds()
    );
  })();

  return {
    total,
    thisWeek: Math.floor(secondsThisWeek * GROWTH_PER_SECOND),
    today: Math.floor(secondsToday * GROWTH_PER_SECOND),
    thisMonth: Math.floor(secondsThisMonth * GROWTH_PER_SECOND),
    lastMonth: Math.floor(30 * 24 * 3600 * GROWTH_PER_SECOND),
    contributors: 4324, // valeur app au moment du cadrage
    isLive: false,
  };
}

export function fmtNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

export function progressTowardTarget(total: number): number {
  return Math.min(100, (total / CHALLENGE_TARGET) * 100);
}

// ─── Compteur RÉEL (Firestore, piloté par l'admin) ──────────────────────────
// Document unique : settings/challenge = { total: number, updatedAt: number }.
// Lecture publique + écriture admin (déjà couvert par les règles settings/{id}).

import { getDb } from "./firebase";
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  collection,
  deleteDoc,
  query,
  orderBy,
  limit,
  writeBatch,
  increment,
} from "firebase/firestore";

/** Plafond par contribution (anti-abus) : un visiteur ajoute au plus ce nombre
 *  de Salaatu en une fois. L'admin peut toujours corriger/supprimer. */
export const MAX_CONTRIBUTION = 5000;

/** Abonnement temps réel au total du challenge. Renvoie une fonction
 *  de désabonnement. Le total vaut 0 tant que l'admin ne l'a pas défini. */
export function subscribeChallengeTotal(
  cb: (total: number, updatedAt: number | null) => void
): () => void {
  const db = getDb();
  return onSnapshot(
    doc(db, "settings", "challenge"),
    (snap) => {
      const d = snap.data() as { total?: number; updatedAt?: number } | undefined;
      cb(typeof d?.total === "number" ? d.total : 0, d?.updatedAt ?? null);
    },
    () => cb(0, null)
  );
}

/** Lecture ponctuelle (ex. pré-remplir le champ admin). */
export async function getChallengeTotal(): Promise<number> {
  const db = getDb();
  const snap = await getDoc(doc(db, "settings", "challenge"));
  const d = snap.data() as { total?: number } | undefined;
  return typeof d?.total === "number" ? d.total : 0;
}

/** Écriture (admin uniquement, contrôlé par les règles Firestore). */
export async function setChallengeTotal(total: number): Promise<void> {
  const db = getDb();
  await setDoc(
    doc(db, "settings", "challenge"),
    { total: Math.max(0, Math.floor(total)), updatedAt: Date.now() },
    { merge: true }
  );
}

// ─── Contributions des visiteurs ────────────────────────────────────────────
// Un visiteur ajoute son nombre de Salaatu : on incrémente le total (settings/
// challenge) ET on journalise la contribution (challengeContributions) pour que
// l'admin puisse consulter l'historique et supprimer une erreur.

export type Contribution = {
  id: string;
  amount: number;
  name?: string | null;
  createdAt: number;
};

/** Contribution publique : incrément borné du total + journalisation (atomique). */
export async function contributeSalaatu(amount: number, name?: string): Promise<number> {
  const db = getDb();
  const amt = Math.max(1, Math.min(MAX_CONTRIBUTION, Math.floor(amount)));
  const batch = writeBatch(db);
  const logRef = doc(collection(db, "challengeContributions"));
  batch.set(logRef, {
    amount: amt,
    name: (name ?? "").trim().slice(0, 40) || null,
    createdAt: Date.now(),
  });
  batch.set(
    doc(db, "settings", "challenge"),
    { total: increment(amt), updatedAt: Date.now() },
    { merge: true }
  );
  await batch.commit();
  return amt;
}

/** Historique des contributions (admin). */
export function subscribeContributions(
  cb: (list: Contribution[]) => void
): () => void {
  const db = getDb();
  return onSnapshot(
    query(collection(db, "challengeContributions"), orderBy("createdAt", "desc"), limit(300)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Contribution, "id">) }))),
    () => cb([])
  );
}

/** Suppression d'une contribution (admin) : retire le doc ET décrémente le total. */
export async function deleteContribution(id: string, amount: number): Promise<void> {
  const db = getDb();
  const batch = writeBatch(db);
  batch.delete(doc(db, "challengeContributions", id));
  batch.set(
    doc(db, "settings", "challenge"),
    { total: increment(-Math.abs(Math.floor(amount))), updatedAt: Date.now() },
    { merge: true }
  );
  await batch.commit();
}
