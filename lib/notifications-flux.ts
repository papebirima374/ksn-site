// Flux temps reel des notifications d'un utilisateur.
//
// Une notification peut etre adressee de deux facons :
//   - a une PERSONNE, par son uid (demande premium validee, certification)
//   - a une COMMISSION, par son slug (un versement attend un accuse de
//     reception) — voir notifierCommission() dans lib/admin-data.ts
//
// Firestore ne sait pas faire un « OU » entre deux champs dans une seule
// requete : il faut deux ecoutes, et les fusionner ici. Les trois surfaces qui
// affichent des notifications (la cloche, le bandeau surgissant, la page
// /notifications) passent donc par cette fonction, et une seule.

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getDb } from "./firebase";
import type { AppNotification } from "./admin-types";

const lire = (id: string, data: unknown): AppNotification =>
  ({ id, ...(data as Omit<AppNotification, "id">) }) as AppNotification;

export function subscribeMesNotifications(
  uid: string,
  /** Slug de la commission du compte, ou null s'il n'est rattache a aucune. */
  commissionSlug: string | null,
  cb: (n: AppNotification[]) => void,
  onErreur?: (e: Error) => void
): () => void {
  let db;
  try {
    db = getDb();
  } catch (e) {
    onErreur?.(e as Error);
    return () => {};
  }

  // Deux sources, fusionnees a chaque arrivee. On garde le dernier etat de
  // chacune plutot que de tout relire : l'ecoute qui n'a pas bouge reste
  // valable.
  let perso: AppNotification[] = [];
  let commission: AppNotification[] = [];

  const pousser = () => {
    const parId = new Map<string, AppNotification>();
    for (const n of [...perso, ...commission]) parId.set(n.id, n);
    cb(
      [...parId.values()].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    );
  };

  const stops = [
    onSnapshot(
      query(collection(db, "notifications"), where("recipientUid", "==", uid)),
      (snap) => {
        perso = snap.docs.map((d) => lire(d.id, d.data()));
        pousser();
      },
      (e) => onErreur?.(e as Error)
    ),
  ];

  if (commissionSlug) {
    stops.push(
      onSnapshot(
        query(
          collection(db, "notifications"),
          where("recipientCommission", "==", commissionSlug)
        ),
        (snap) => {
          commission = snap.docs.map((d) => lire(d.id, d.data()));
          pousser();
        },
        (e) => onErreur?.(e as Error)
      )
    );
  }

  return () => stops.forEach((f) => f());
}
