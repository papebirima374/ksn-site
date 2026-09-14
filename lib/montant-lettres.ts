// Montant ecrit en toutes lettres, pour les factures.
//
// Une facture porte toujours la somme en chiffres ET en lettres : c'est ce qui
// la rend opposable, parce qu'un chiffre se retouche d'un trait de stylo, pas
// une phrase. L'usage senegalais l'attend sur toute piece commerciale.
//
// Orthographe francaise classique (pas rectifiee) : « quatre-vingts »,
// « deux cents », « soixante-et-onze », et l'accord qui tombe des qu'un autre
// nombre suit — « quatre-vingt-un », « deux cent trois ».

const UNITES = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
  "dix-sept", "dix-huit", "dix-neuf",
];

// 70 et 90 se construisent sur 60 et 80 : « soixante-dix », « quatre-vingt-dix ».
const DIZAINES = [
  "", "", "vingt", "trente", "quarante", "cinquante",
  "soixante", "soixante", "quatre-vingt", "quatre-vingt",
];

/** 0 a 99. */
function petit(n: number): string {
  if (n < 20) return UNITES[n];
  const d = Math.floor(n / 10);
  const u = n % 10;
  // Soixante-dix et quatre-vingt-dix comptent jusqu'a dix-neuf.
  if (d === 7 || d === 9) {
    if (d === 7 && u === 1) return "soixante-et-onze";
    return `${DIZAINES[d]}-${UNITES[10 + u]}`;
  }
  if (u === 0) return d === 8 ? "quatre-vingts" : DIZAINES[d];
  // « quatre-vingt-un », sans « et ».
  if (u === 1 && d !== 8) return `${DIZAINES[d]}-et-un`;
  return `${DIZAINES[d]}-${UNITES[u]}`;
}

/** 0 a 999. */
function moyen(n: number): string {
  if (n < 100) return petit(n);
  const c = Math.floor(n / 100);
  const r = n % 100;
  if (r === 0) return c === 1 ? "cent" : `${UNITES[c]} cents`;
  return c === 1 ? `cent ${petit(r)}` : `${UNITES[c]} cent ${petit(r)}`;
}

const TRANCHES: [number, string][] = [
  [1_000_000_000, "milliard"],
  [1_000_000, "million"],
  [1_000, "mille"],
];

/** Le nombre en toutes lettres, sans l'unite monetaire. */
export function enLettres(n: number): string {
  const entier = Math.floor(Math.abs(n || 0));
  if (entier === 0) return "zéro";

  let reste = entier;
  const mots: string[] = [];

  for (const [valeur, mot] of TRANCHES) {
    const q = Math.floor(reste / valeur);
    if (q === 0) continue;
    if (mot === "mille") {
      // « mille » est invariable, et « un mille » ne se dit pas.
      mots.push(q === 1 ? "mille" : `${moyen(q)} mille`);
    } else {
      mots.push(`${moyen(q)} ${mot}${q > 1 ? "s" : ""}`);
    }
    reste %= valeur;
  }

  if (reste > 0) mots.push(moyen(reste));
  return mots.join(" ");
}

/** La formule complete portee au bas d'une facture. */
export function montantEnLettres(n: number): string {
  return `${enLettres(n)} francs CFA`;
}
