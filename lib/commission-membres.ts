// Membres d'une commission, et convocations aux reunions.
//
// Les membres de commission N'ONT PAS DE COMPTE sur le site : seuls les
// responsables en ont un. On ne cree donc ni invitation ni connexion — on
// tient une liste, piochee dans les membres du Dahira deja enregistres, avec
// juste ce qu'il faut pour convoquer et pour tenir la caisse : nom, telephone,
// role dans la commission.
//
// Consequence directe sur les notifications : la cloche du site s'adresse a un
// COMPTE. Elle ne peut donc pas atteindre ces membres. Les convocations leur
// partent par WhatsApp ; la cloche sert aux responsables, au Secretariat et a
// la Presidence.
//
// Collections :
//   commissionMembres/<slug>_<matricule>  — la liste
//   commissionReunions/<id>               — les reunions et leurs convocations

import { getDb } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  limit,
} from "firebase/firestore";

/* ═══ Membres ══════════════════════════════════════════════════════════ */

export type RoleCommission = "responsable" | "tresorier" | "membre";

export const LIBELLE_ROLE: Record<RoleCommission, string> = {
  responsable: "Responsable",
  tresorier: "Trésorier",
  membre: "Membre",
};

export type MembreCommission = {
  id: string;
  commission: string;
  matricule: string;
  /** Identifiant de la fiche members/<id> d'ou vient la personne. Il sert de
   *  cle de secours quand le matricule manque — tous les membres du Dahira
   *  n'en ont pas. */
  refMembre: string;
  nom: string;
  telephone: string;
  role: RoleCommission;
  ajouteLe: number;
  ajoutePar: string;
};

/** L'identifiant combine la commission et la cle de la personne : ajouter deux
 *  fois la meme ecrase la premiere entree au lieu de la dupliquer.
 *
 *  La cle est le matricule quand il existe — c'est le numero que tout le monde
 *  connait — et, a defaut, l'identifiant de sa fiche. Sans ce repli, TOUS les
 *  membres sans matricule partageaient la meme cle « slug_ » : le deuxieme
 *  ajoute effacait le premier, en silence. */
const idMembre = (slug: string, cle: string) =>
  `${slug}_${cle}`.replace(/[^A-Za-z0-9_-]/g, "-");

/** Cle d'identite d'une personne dans une commission. */
export const cleMembre = (m: { matricule?: string; refMembre?: string }) =>
  (m.matricule ?? "").trim() || (m.refMembre ?? "").trim();

export function subscribeMembresCommission(
  slug: string,
  cb: (l: MembreCommission[]) => void,
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
    query(collection(db, "commissionMembres"), where("commission", "==", slug), limit(500)),
    (snap) =>
      cb(
        snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<MembreCommission, "id">) }))
          .sort((a, b) => a.nom.localeCompare(b.nom, "fr"))
      ),
    (e) => onErreur?.(e as Error)
  );
}

export async function ajouterMembre(
  slug: string,
  m: {
    matricule: string;
    /** Identifiant de la fiche members/<id> : cle de secours sans matricule. */
    refMembre?: string;
    nom: string;
    telephone: string;
    role?: RoleCommission;
  },
  parQui: string
): Promise<void> {
  const cle = cleMembre(m);
  if (!cle) throw new Error("Ce membre n'a ni matricule ni fiche : impossible de l'identifier.");
  const db = getDb();
  await setDoc(doc(db, "commissionMembres", idMembre(slug, cle)), {
    commission: slug,
    matricule: m.matricule.slice(0, 60),
    refMembre: (m.refMembre ?? "").slice(0, 60),
    nom: m.nom.slice(0, 120),
    telephone: (m.telephone ?? "").slice(0, 40),
    role: m.role ?? "membre",
    ajouteLe: Date.now(),
    ajoutePar: parQui.slice(0, 120),
  });
}

export async function changerRole(id: string, role: RoleCommission): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, "commissionMembres", id), { role }, { merge: true });
}

export async function retirerMembre(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "commissionMembres", id));
}

/* ═══ Reunions et convocations ═════════════════════════════════════════ */

export type Reunion = {
  id: string;
  commission: string;
  titre: string;
  date: string;
  heure: string;
  lieu: string;
  ordreDuJour: string;
  /** Date d'envoi de la derniere convocation, et par qui. */
  convoqueLe: number | null;
  convoquePar: string;
  createdAt: number;
  createdBy: string;
};

export function subscribeReunions(
  slug: string,
  cb: (l: Reunion[]) => void,
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
    query(collection(db, "commissionReunions"), where("commission", "==", slug), limit(200)),
    (snap) =>
      cb(
        snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Reunion, "id">) }))
          .sort((a, b) => (a.date < b.date ? 1 : -1))
      ),
    (e) => onErreur?.(e as Error)
  );
}

export async function creerReunion(
  slug: string,
  r: { titre: string; date: string; heure: string; lieu: string; ordreDuJour: string },
  parQui: string
): Promise<void> {
  const db = getDb();
  await addDoc(collection(db, "commissionReunions"), {
    commission: slug,
    titre: r.titre.trim().slice(0, 160) || "Réunion de commission",
    date: r.date,
    heure: r.heure.slice(0, 10),
    lieu: r.lieu.trim().slice(0, 160),
    ordreDuJour: r.ordreDuJour.trim().slice(0, 2000),
    convoqueLe: null,
    convoquePar: "",
    createdAt: Date.now(),
    createdBy: parQui.slice(0, 120),
  });
}

export async function supprimerReunion(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "commissionReunions", id));
}

/** Trace l'envoi des convocations. L'envoi lui-meme part sur WhatsApp, depuis
 *  le telephone du responsable : les membres n'ont pas de compte, la cloche du
 *  site ne peut pas les atteindre. */
export async function marquerConvoque(id: string, parQui: string): Promise<void> {
  const db = getDb();
  await setDoc(
    doc(db, "commissionReunions", id),
    { convoqueLe: Date.now(), convoquePar: parQui.slice(0, 120) },
    { merge: true }
  );
}

/** Message de convocation, pret pour WhatsApp. */
export function texteConvocation(r: Reunion, nomCommission: string): string {
  const d = r.date
    ? new Date(r.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  return (
    `As-salaamu 'alaykum.\n\n` +
    `*${r.titre}* — commission ${nomCommission}\n` +
    `📅 ${d}${r.heure ? ` à ${r.heure}` : ""}\n` +
    (r.lieu ? `📍 ${r.lieu}\n` : "") +
    (r.ordreDuJour ? `\n*Ordre du jour*\n${r.ordreDuJour}\n` : "") +
    `\nVotre présence est vivement souhaitée.\nJazaakumu Laahu khayran.`
  );
}

/** Lien WhatsApp vers UNE personne, message deja redige. */
export function lienConvocation(telephone: string, texte: string): string {
  const num = (telephone ?? "").replace(/\D+/g, "");
  const t = encodeURIComponent(texte);
  return num ? `https://wa.me/${num}?text=${t}` : `https://wa.me/?text=${t}`;
}
