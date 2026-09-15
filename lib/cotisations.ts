// Les cotisations et frais d'inscription d'un membre.
//
// POURQUOI CE FICHIER EXISTE. Savoir si un membre est a jour se lit dans les
// ecritures de la tresorerie, et cela reposait sur une CHAINE DE CARACTERES :
// l'ecran des membres construisait « Cotisation - Septembre 2026 », et le
// filtre « cotisation payee » cherchait « septembre 2026 » dans la
// description. Les deux etaient ecrits a deux endroits differents, avec deux
// listes de mois recopiees.
//
// Or l'ecran des Finances, lui, laisse saisir la description A LA MAIN — et
// « Cotisation mensuelle » y est meme la categorie par defaut. Une cotisation
// encaissee depuis cet ecran, avec une description libre ou vide, n'etait donc
// JAMAIS comptee : l'argent etait enregistre, et le membre restait affiche
// comme n'ayant pas paye. Sans le moindre message.
//
// Tout ce qui touche a cette correspondance vit desormais ici : une seule
// liste de mois, une seule facon d'ecrire la description, une seule facon de
// la relire.

import type { FinanceEntry } from "./admin-types";

export const CATEGORIE_COTISATION = "Cotisation mensuelle";
export const CATEGORIE_INSCRIPTION = "Frais d'inscription";

export const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
] as const;

export type Mois = (typeof MOIS)[number];

export const moisCourant = (): Mois => MOIS[new Date().getMonth()];
export const anneeCourante = (): number => new Date().getFullYear();

/** La description enregistree avec l'ecriture. Un seul endroit l'ecrit. */
export function descriptionCotisation(mois: string, annee: number): string {
  return `Cotisation - ${mois} ${annee}`;
}

/** Sans accent ni casse : « Août » saisi « aout » reste le meme mois, et une
 *  ecriture ancienne tapee a la main a une chance d'etre reconnue. */
const sansAccent = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** L'ecriture est-elle la cotisation de ce mois-la, pour ce membre ?
 *
 *  On accepte toute description qui nomme le mois ET l'annee : la notre
 *  (« Cotisation - Septembre 2026 ») comme celles tapees a la main avant que
 *  l'ecran des Finances ne genere le texte lui-meme. */
export function estCotisationDe(
  e: FinanceEntry,
  memberId: string,
  mois: string,
  annee: number
): boolean {
  if (e.memberId !== memberId) return false;
  if (e.type !== "income") return false;
  if (e.category !== CATEGORIE_COTISATION) return false;
  const texte = sansAccent(e.description ?? "");
  return texte.includes(sansAccent(mois)) && texte.includes(String(annee));
}

/** Le membre est-il a jour pour le mois en cours ? */
export function aPayeCotisation(
  entries: FinanceEntry[],
  memberId: string,
  mois: string = moisCourant(),
  annee: number = anneeCourante()
): boolean {
  return entries.some((e) => estCotisationDe(e, memberId, mois, annee));
}

/** Les frais d'inscription ne se paient qu'une fois : ni mois, ni annee. */
export function aPayeInscription(entries: FinanceEntry[], memberId: string): boolean {
  return entries.some(
    (e) =>
      e.memberId === memberId &&
      e.type === "income" &&
      e.category === CATEGORIE_INSCRIPTION
  );
}
