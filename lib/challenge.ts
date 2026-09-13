// Source unique pour le compteur du challenge "1 milliard de Salaatu".
//
// Le total affiche est le total REEL : il vit dans Firestore (settings/challenge)
// et il est alimente par deux voies — les contributions saisies par les visiteurs
// (contributeSalaatu) et les releves ajoutes par l'admin (addToChallengeTotal).
// Il n'y a pas d'estimation ni de simulation : tant que rien n'a ete saisi,
// le compteur vaut 0.

export const CHALLENGE_TARGET = 1_000_000_000; // 1 milliard

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

/** AJOUTE (admin) un nombre au total, sans le remplacer. Journalisé dans
 *  l'historique pour pouvoir annuler. Ex : relevé d'un nouveau lot depuis l'app. */
export async function addToChallengeTotal(amount: number, label = "Ajout admin"): Promise<void> {
  const db = getDb();
  const amt = Math.floor(amount);
  if (!amt) return;
  const batch = writeBatch(db);
  const logRef = doc(collection(db, "challengeContributions"));
  batch.set(logRef, { amount: amt, name: label, createdAt: Date.now(), source: "admin" });
  batch.set(
    doc(db, "settings", "challenge"),
    { total: increment(amt), updatedAt: Date.now() },
    { merge: true }
  );
  await batch.commit();
}

// ─── Date du Gàmmu (compte à rebours) ───────────────────────────────────────
// Stockée dans settings/challenge.gammuDate (ISO). Défaut : à ajuster par l'admin
// selon l'observation lunaire (nuit du 11→12 Rabiʿ al-Awwal 1448).
export const GAMMU_DEFAULT_ISO = "2026-08-27T20:00:00+00:00";

export type ChallengeSettings = { total: number; gammuDate: string };

export async function getChallengeSettings(): Promise<ChallengeSettings> {
  const db = getDb();
  const snap = await getDoc(doc(db, "settings", "challenge"));
  const d = snap.data() as { total?: number; gammuDate?: string } | undefined;
  return {
    total: typeof d?.total === "number" ? d.total : 0,
    gammuDate: d?.gammuDate || GAMMU_DEFAULT_ISO,
  };
}

/** Abonnement temps réel à la date du Gàmmu (pour le compte à rebours). */
export function subscribeGammuDate(cb: (iso: string) => void): () => void {
  const db = getDb();
  return onSnapshot(
    doc(db, "settings", "challenge"),
    (snap) => {
      const d = snap.data() as { gammuDate?: string } | undefined;
      cb(d?.gammuDate || GAMMU_DEFAULT_ISO);
    },
    () => cb(GAMMU_DEFAULT_ISO)
  );
}

export async function setGammuDate(iso: string): Promise<void> {
  const db = getDb();
  await setDoc(
    doc(db, "settings", "challenge"),
    { gammuDate: iso, updatedAt: Date.now() },
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
