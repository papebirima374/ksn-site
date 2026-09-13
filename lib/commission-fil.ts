// Fil de discussion d'une commission.
//
// L'assemblee passee, l'espace ne se ferme pas : la commission continue d'y
// echanger avec le Secretariat et le President. Chaque commission a son fil,
// que personne d'autre ne voit — a l'exception du Secretariat et du President,
// qui les lisent tous et peuvent y repondre.
//
// Collection : commissionMessages, un document par message. Un seul niveau,
// pas de sous-collection : les regles Firestore restent lisibles et une
// commission ne peut pas se retrouver a lire le fil d'une autre par un chemin
// detourne.

import { getDb } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
  limit,
} from "firebase/firestore";

export const MAX_MESSAGE = 2000;

export type Message = {
  id: string;
  commission: string;
  auteur: string;
  /** « commission », « secretariat » ou « presidence » — sert a colorer le
   *  message et a savoir qui parle, pas a donner des droits. */
  role: string;
  texte: string;
  createdAt: number;
};

export function subscribeFil(
  slug: string,
  cb: (l: Message[]) => void,
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
    // Pas d'orderBy ici : combine a un where, il exigerait un index composite
    // a creer a la main dans la console Firebase. Le tri se fait donc en
    // memoire — 300 messages au plus, c'est sans consequence.
    query(collection(db, "commissionMessages"), where("commission", "==", slug), limit(300)),
    (snap) =>
      cb(
        snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) }))
          .sort((a, b) => a.createdAt - b.createdAt)
      ),
    (e) => onErreur?.(e as Error)
  );
}

export async function envoyerMessage(
  slug: string,
  auteur: string,
  role: string,
  texte: string
): Promise<void> {
  const db = getDb();
  const t = texte.trim().slice(0, MAX_MESSAGE);
  if (!t) return;
  await addDoc(collection(db, "commissionMessages"), {
    commission: slug,
    auteur: auteur.slice(0, 120),
    role,
    texte: t,
    createdAt: Date.now(),
  });
}

export async function supprimerMessage(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "commissionMessages", id));
}
