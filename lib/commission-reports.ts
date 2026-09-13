// Rapports de commission (Firestore).
//
// Collection : commissionReports
// Ecriture : publique mais BORNEE par firestore.rules (champs obligatoires,
//   longueurs maximales). Le formulaire vit sur un lien non reference, envoye
//   aux seuls responsables de commission.
// Lecture / suppression : admin uniquement.

import { getDb } from "./firebase";
import {
  doc,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

/** Longueurs maximales, reprises a l'identique dans firestore.rules.
 *  Toute modification ici doit etre repercutee dans les regles, sinon
 *  l'envoi est refuse cote serveur. */
export const MAX = {
  court: 120,
  long: 4000,
  nombre: 100_000_000,
} as const;

export type CommissionReport = {
  id: string;
  /** slug de lib/commissions.ts */
  commission: string;
  responsable: string;
  telephone: string;
  membres: number | null;

  /** 1. Compte rendu */
  activites: string;
  difficultes: string;

  /** 2. Bilan provisoire — bisub Salaatu 'Alaa Nabii */
  salaatu: number | null;
  salaatuPrecisions: string;

  /** 3. Cellules */
  cellulesActives: number | null;
  cellules: string;

  /** 4. Propositions pour la Journee Salaatu a venir */
  propositions: string;
  moyens: string;

  /** 5. Divers */
  divers: string;

  createdAt: number;
};

export type ReportDraft = Omit<CommissionReport, "id" | "createdAt">;

/** Envoi public du rapport. Renvoie l'identifiant du document cree, qui sert
 *  de numero de reference affiche au responsable apres l'envoi. */
export async function submitCommissionReport(draft: ReportDraft): Promise<string> {
  const db = getDb();
  const txt = (v: string, max: number) => (v ?? "").trim().slice(0, max);
  const num = (v: number | null) =>
    typeof v === "number" && Number.isFinite(v) && v >= 0
      ? Math.min(Math.floor(v), MAX.nombre)
      : null;

  const ref = await addDoc(collection(db, "commissionReports"), {
    commission: txt(draft.commission, MAX.court),
    responsable: txt(draft.responsable, MAX.court),
    telephone: txt(draft.telephone, MAX.court),
    membres: num(draft.membres),
    activites: txt(draft.activites, MAX.long),
    difficultes: txt(draft.difficultes, MAX.long),
    salaatu: num(draft.salaatu),
    salaatuPrecisions: txt(draft.salaatuPrecisions, MAX.long),
    cellulesActives: num(draft.cellulesActives),
    cellules: txt(draft.cellules, MAX.long),
    propositions: txt(draft.propositions, MAX.long),
    moyens: txt(draft.moyens, MAX.long),
    divers: txt(draft.divers, MAX.long),
    createdAt: Date.now(),
  });
  return ref.id;
}

/** Abonnement temps reel a tous les rapports recus (admin). */
export function subscribeCommissionReports(
  cb: (list: CommissionReport[]) => void
): () => void {
  const db = getDb();
  return onSnapshot(
    query(collection(db, "commissionReports"), orderBy("createdAt", "desc"), limit(400)),
    (snap) =>
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CommissionReport, "id">) }))),
    () => cb([])
  );
}

export async function deleteCommissionReport(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "commissionReports", id));
}
