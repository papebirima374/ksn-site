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
import { commissionNom } from "./commissions";
import { notifierCommission } from "./admin-data";

/** Slug du Secretariat, destinataire de tous les dossiers transmis. */
const SECRETARIAT = "secretariat-administratif";

/** Une ligne de liste. L'identifiant sert de cle React et permet de supprimer
 *  une ligne au milieu sans decaler les autres. */
export type Ligne = { id: string; texte: string };

export type Proposition = { id: string; titre: string; detail: string; moyens: string };

/** Parcours d'un dossier :
 *   brouillon  — la commission y travaille, personne d'autre n'a a le lire
 *   transmis   — la commission l'a envoye au Secretariat
 *   valide     — le Secretariat l'a transmis au President
 *  Le dossier reste modifiable apres transmission : l'assemblee passee, la
 *  commission continue de s'en servir pour echanger. Un retour en arriere est
 *  donc possible, ce n'est pas un circuit a sens unique. */
export type StatutDossier = "brouillon" | "transmis" | "valide";

export const LIBELLE_STATUT: Record<StatutDossier, string> = {
  brouillon: "Brouillon — visible de la commission seule",
  transmis: "Transmis au Secrétariat",
  valide: "Transmis au Président par le Secrétariat",
};

export type Dossier = {
  commission: string;
  responsable: string;
  telephone: string;
  membres: string;
  activites: Ligne[];
  difficultes: Ligne[];
  salaatu: string;
  salaatuPrecisions: string;
  /** Les cellules ne sont pas un recensement : c'est un point a DISCUTER en
   *  assemblee. Une seule colonne, ou chacun dit ce qu'il en pense. */
  cellules: Ligne[];
  propositions: Proposition[];
  divers: Ligne[];
  statut: StatutDossier;
  transmisAt: number | null;
  transmisPar: string;
  valideAt: number | null;
  validePar: string;
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
    cellules: [{ id: nouvelId(), texte: "" }],
    propositions: [{ id: nouvelId(), titre: "", detail: "", moyens: "" }],
    divers: [{ id: nouvelId(), texte: "" }],
    statut: "brouillon",
    transmisAt: null,
    transmisPar: "",
    valideAt: null,
    validePar: "",
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
    statut: d.statut ?? "brouillon",
    transmisAt: d.transmisAt ?? null,
    transmisPar: d.transmisPar ?? "",
    valideAt: d.valideAt ?? null,
    validePar: d.validePar ?? "",
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
  let db;
  try {
    db = getDb();
  } catch (e) {
    onErreur?.(e as Error);
    return () => {};
  }
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

/** Prevenir sans jamais bloquer.
 *
 *  Le circuit etait MUET : une commission transmettait son dossier sans que le
 *  Secretariat en sache rien, et surtout, le Secretariat le renvoyait pour
 *  complement sans que la commission l'apprenne. Son dossier redevenait un
 *  brouillon, et le travail s'arretait la, faute d'avoir ete prevenu.
 *
 *  La notification ne fait pas partie du circuit : si elle echoue, le
 *  changement d'etat reste valable — il se voit dans les deux espaces. */
async function prevenir(
  commission: string,
  titre: string,
  corps: string,
  lien: string
): Promise<void> {
  try {
    await notifierCommission({
      commission,
      type: "dossier_circuit",
      title: titre,
      body: corps,
      link: lien,
    });
  } catch {
    /* sans effet sur le circuit */
  }
}

/** La commission envoie son dossier au Secretariat. */
export async function transmettreDossier(slug: string, parQui: string): Promise<void> {
  const db = getDb();
  await setDoc(
    doc(db, "commissionDossiers", slug),
    { statut: "transmis", transmisAt: Date.now(), transmisPar: parQui.slice(0, 120) },
    { merge: true }
  );
  await prevenir(
    SECRETARIAT,
    `Dossier reçu — ${commissionNom(slug)}`,
    `${commissionNom(slug)} vient de transmettre son dossier${parQui ? ` (${parQui})` : ""}.`,
    "/admin/rapports"
  );
}

/** Le Secretariat fait suivre au President. */
export async function validerDossier(slug: string, parQui: string): Promise<void> {
  const db = getDb();
  await setDoc(
    doc(db, "commissionDossiers", slug),
    { statut: "valide", valideAt: Date.now(), validePar: parQui.slice(0, 120) },
    { merge: true }
  );
  await prevenir(
    slug,
    "Votre dossier est remis au Président",
    `Le Secrétariat a fait suivre votre dossier${parQui ? ` (${parQui})` : ""}.`,
    "/admin/ma-commission"
  );
}

/** Retour en brouillon : le Secretariat renvoie le dossier a la commission
 *  pour complement. */
export async function renvoyerDossier(slug: string, parQui: string): Promise<void> {
  const db = getDb();
  await setDoc(
    doc(db, "commissionDossiers", slug),
    { statut: "brouillon", transmisAt: null, transmisPar: parQui.slice(0, 120) },
    { merge: true }
  );
  await prevenir(
    slug,
    "Votre dossier vous est renvoyé",
    `Le Secrétariat demande un complément avant de le faire suivre au Président${
      parQui ? ` (${parQui})` : ""
    }. Reprenez-le, puis transmettez-le à nouveau.`,
    "/admin/ma-commission"
  );
}

/** Tous les dossiers en temps reel (Secretariat / administrateur). */
export function subscribeTousLesDossiers(
  cb: (l: Dossier[]) => void
): () => void {
  let db;
  try {
    db = getDb();
  } catch {
    cb([]);
    return () => {};
  }
  return onSnapshot(
    collection(db, "commissionDossiers"),
    (snap) => cb(snap.docs.map((x) => normaliser(x.id, x.data() as Partial<Dossier>))),
    () => cb([])
  );
}
