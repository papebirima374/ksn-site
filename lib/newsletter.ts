// Les inscrits a la lettre d'information.
//
// Collection Firestore : « newsletter ». Un document par inscription, pas
// par personne : le pied de page cree un document a chaque envoi du
// formulaire, sans verifier si l'adresse est deja connue. Une meme personne
// qui s'inscrit trois fois produit donc trois documents. C'est voulu — la
// verification cote client couterait une lecture a chaque visiteur, et le
// dedoublonnage se fait tres bien ici, a la lecture.
//
// DEUX SOURCES ont alimente cette collection :
//   « pied de page »        — le formulaire du pied de page du site
//   « education_waitlist »  — l'ancienne liste d'attente de la section
//                             Education, retiree en septembre 2026
//
// ATTENTION, un piege deja rencontre ailleurs dans ce projet : ne JAMAIS
// trier cette collection avec orderBy("subscribedAt"). Une requete ordonnee
// EXCLUT silencieusement les documents auxquels le champ manque. Les
// premieres inscriptions n'ont pas toutes une date ; elles disparaitraient
// de la liste sans le moindre message. On lit tout, on trie en memoire.

import { getDb } from "./firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export type Inscrit = {
  id: string;
  email: string;
  /** D'ou vient l'inscription. Absent sur les tout premiers documents. */
  source: string;
  /** Millisecondes. null quand le champ manque — et il manque parfois. */
  subscribedAt: number | null;
};

/** Une personne, avec toutes ses inscriptions regroupees. */
export type Abonne = {
  email: string;
  /** La PREMIERE fois que l'adresse est apparue. null si aucune date connue. */
  depuis: number | null;
  /** Les provenances, sans doublon. */
  sources: string[];
  /** Les identifiants de tous les documents portant cette adresse : il faut
   *  les supprimer tous pour desinscrire reellement quelqu'un. */
  documents: string[];
};

const LIBELLE_SOURCE: Record<string, string> = {
  "pied de page": "Pied de page",
  education_waitlist: "Liste d'attente Éducation",
};

export function libelleSource(s: string): string {
  return LIBELLE_SOURCE[s] ?? (s || "Origine inconnue");
}

/** Lit toute la collection. Aucun orderBy — voir l'avertissement en tete. */
export async function listerInscrits(): Promise<Inscrit[]> {
  const db = getDb();
  const snap = await getDocs(collection(db, "newsletter"));
  return snap.docs.map((d) => {
    const v = d.data() as Record<string, unknown>;
    const ts = v.subscribedAt;
    return {
      id: d.id,
      email: typeof v.email === "string" ? v.email.trim().toLowerCase() : "",
      source: typeof v.source === "string" ? v.source : "",
      subscribedAt: typeof ts === "number" && Number.isFinite(ts) ? ts : null,
    };
  });
}

/** Regroupe les inscriptions par adresse. Les plus recentes d'abord ; celles
 *  sans date connue finissent la liste plutot que d'etre jetees. */
export function dedoublonner(inscrits: Inscrit[]): Abonne[] {
  const par = new Map<string, Abonne>();

  for (const brut of inscrits) {
    // On renormalise ICI, meme si listerInscrits() l'a deja fait. Deux
    // adresses qui ne different que par une majuscule ou une espace sont la
    // MEME personne : si le regroupement se fie a un nettoyage fait ailleurs,
    // il suffit qu'un autre appelant l'oublie pour qu'elle apparaisse deux
    // fois dans la liste — et deux fois dans l'envoi.
    const i: Inscrit = { ...brut, email: (brut.email ?? "").trim().toLowerCase() };
    if (!i.email) continue; // document abime : pas d'adresse, rien a en faire
    const deja = par.get(i.email);
    if (!deja) {
      par.set(i.email, {
        email: i.email,
        depuis: i.subscribedAt,
        sources: i.source ? [i.source] : [],
        documents: [i.id],
      });
      continue;
    }
    deja.documents.push(i.id);
    if (i.source && !deja.sources.includes(i.source)) deja.sources.push(i.source);
    // On garde la PLUS ANCIENNE date : c'est depuis ce jour-la que la
    // personne nous suit, meme si elle s'est reinscrite depuis.
    if (i.subscribedAt !== null && (deja.depuis === null || i.subscribedAt < deja.depuis)) {
      deja.depuis = i.subscribedAt;
    }
  }

  return [...par.values()].sort((a, b) => {
    if (a.depuis === null && b.depuis === null) return a.email.localeCompare(b.email);
    if (a.depuis === null) return 1;
    if (b.depuis === null) return -1;
    return b.depuis - a.depuis;
  });
}

/** Desinscrit une adresse : supprime TOUS ses documents, pas seulement un.
 *  Ne rien laisser derriere, sinon la personne reapparait a la relecture. */
export async function desinscrire(abonne: Abonne): Promise<void> {
  const db = getDb();
  await Promise.all(abonne.documents.map((id) => deleteDoc(doc(db, "newsletter", id))));
}

const dateFr = (ms: number) =>
  new Date(ms).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

/** Fichier CSV, separateur point-virgule : c'est ce qu'attend Excel en
 *  configuration francaise. Avec la virgule, tout atterrit dans une colonne.
 *  Le BOM en tete fait afficher correctement les accents a Excel. */
export function versCSV(abonnes: Abonne[]): string {
  const echapper = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lignes = [
    ["Adresse e-mail", "Inscrit depuis", "Origine", "Nombre d'inscriptions"]
      .map(echapper)
      .join(";"),
  ];
  for (const a of abonnes) {
    lignes.push(
      [
        echapper(a.email),
        echapper(a.depuis === null ? "date inconnue" : dateFr(a.depuis)),
        echapper(a.sources.map(libelleSource).join(" + ") || "Origine inconnue"),
        echapper(String(a.documents.length)),
      ].join(";")
    );
  }
  return "﻿" + lignes.join("\r\n") + "\r\n";
}

/** Les adresses seules, une par ligne : le format que reclament la plupart
 *  des outils d'envoi (Brevo, Mailchimp) et le champ Cci d'une messagerie. */
export function versListeAdresses(abonnes: Abonne[]): string {
  return abonnes.map((a) => a.email).join("\n");
}

/** Declenche le telechargement d'un fichier cote navigateur. */
export function telecharger(contenu: string, nomFichier: string, type: string): void {
  const blob = new Blob([contenu], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomFichier;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Liberer l'objet tout de suite couperait le telechargement dans certains
  // navigateurs : on laisse une seconde.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
