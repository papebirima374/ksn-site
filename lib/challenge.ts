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
