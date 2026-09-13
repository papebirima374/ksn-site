// Reglement Interieur et Statuts Officiels du Dahira Kippaangog Salaatu 'Alaa
// Nabii, adoptes a Touba le dimanche 11 mai 2025.
//
// Le texte est repris FIDELEMENT du document officiel : ne pas reformuler, ne
// pas « moderniser » la langue. Seule la mise en forme est libre. Le PDF signe
// reste telechargeable depuis la page — c'est lui qui fait foi.

export type Article = {
  numero: number;
  titre: string;
  /** Paragraphes du corps de l'article. */
  texte?: string[];
  /** Points enumeres, quand l'article en comporte. */
  points?: string[];
};

export const REGLEMENT: Article[] = [
  {
    numero: 1,
    titre: "Objet",
    texte: [
      "Le Kippaangog Salaatu'Alaa Nabii vise à encourager la prédication, l'invocation et l'amour du Prophète Muhammad ﷺ par la pratique régulière du Salatou, la lecture de Khassida, les Azkâr, et les lectures coraniques.",
      "Nous nous engageons à comptabiliser collectivement les Salatou via notre application mobile obligatoire pour chaque membre, et à dédier chaque semaine ces prières en adiya pour l'âme lumineuse du Prophète Muhammad ﷺ. Chaque membre doit impérativement et obligatoirement prier sur le Prophète Muhammad ﷺ, car c'est l'essence même de notre dahira.",
    ],
    points: ["Chaque membre est tenu de faire un minimum de 1000 Salaatu'Alaa Nabii par jour."],
  },
  {
    numero: 2,
    titre: "Organisation",
    points: [
      "Activités principales sur notre plateforme WhatsApp.",
      "Journée annuelle de rencontre spirituelle Salaatu'Alaa Nabii.",
      "Assemblées générales organisées deux fois par an, de manière décentralisée dans différentes régions selon les concertations du Bureau.",
    ],
  },
  {
    numero: 3,
    titre: "Instances",
    texte: [
      "Le Bureau est composé des postes ci-dessous, chacun avec ses attributions. Voir la composition nominative dans l'organigramme du Dahira.",
    ],
  },
  {
    numero: 4,
    titre: "Membres",
    texte: [
      "Tout musulman respectueux du Prophète Muhammad ﷺ peut adhérer. L'activité régulière, la prière sur le Prophète ﷺ et l'utilisation de l'application sont obligatoires.",
      "L'adhésion entraîne acceptation des statuts et du règlement intérieur.",
    ],
    points: [
      "Acquérir une carte de membre obligatoire à 1000 F CFA.",
      "Verser une cotisation mensuelle obligatoire de 500 F CFA.",
      "Renouveler son engagement chaque année avec 500 F CFA, contre reçu.",
      "Protection des données : les informations nominatives sont traitées de façon confidentielle et non publiées en ligne.",
    ],
  },
  {
    numero: 5,
    titre: "Discipline",
    texte: [
      "Le respect mutuel, la fraternité et l'amour du Prophète ﷺ sont obligatoires. Toute faute grave sera examinée par le Bureau, avec possibilité de suspension ou radiation.",
    ],
  },
  {
    numero: 6,
    titre: "Fonction Financière",
    texte: [
      "Le Président, le Trésorier, ou tout membre du Bureau (en cas de direction collégiale), veille au respect des grands équilibres financiers du dahira.",
    ],
  },
  {
    numero: 7,
    titre: "Modalités d'engagement des dépenses",
    texte: [
      "Les membres du Bureau peuvent effectuer toutes dépenses utiles à la mission du dahira. Pour tout engagement supérieur à 300 000 F CFA, un document écrit doit être signé par le Président et le Trésorier.",
    ],
  },
  {
    numero: 8,
    titre: "Délégation de signature",
    texte: [
      "Des délégations de signature peuvent être attribuées par écrit à un autre membre du Bureau ou à un comptable en cas d'indisponibilité.",
    ],
  },
  {
    numero: 9,
    titre: "Modification du règlement",
    texte: ["Toute modification devra être validée par l'Assemblée Générale."],
  },
];

export const STATUTS: Article[] = [
  {
    numero: 1,
    titre: "Constitution",
    texte: [
      "Le Dahira Kippaangog Salaatu'Alaa Nabii a été fondé le 02 janvier 2021 à Touba, pour promouvoir la prière sur le Prophète Muhammad ﷺ et renforcer la fraternité spirituelle entre musulmans.",
    ],
  },
  {
    numero: 2,
    titre: "Siège social",
    texte: ["Le siège est fixé à Touba, et peut être transféré ou étendu par décision du Bureau."],
  },
  { numero: 3, titre: "Durée", texte: ["La durée du Dahira est illimitée."] },
  {
    numero: 4,
    titre: "Membres",
    points: [
      "Membres actifs : participent aux activités et à la comptabilisation des Salatou.",
      "Membres bienfaiteurs : soutiennent moralement et financièrement.",
      "L'adhésion implique acceptation des statuts et du règlement intérieur.",
    ],
  },
  {
    numero: 5,
    titre: "Ressources",
    points: [
      "Cotisations (dont 500 F CFA mensuels et 500 F CFA annuels de renouvellement).",
      "Dons, legs, subventions.",
      "Revenus issus d'activités licites.",
    ],
  },
  {
    numero: 6,
    titre: "Bureau",
    points: ["Élu pour un an, renouvelable.", "Le Bureau exécute les décisions de l'Assemblée Générale."],
  },
  {
    numero: 7,
    titre: "Assemblée Générale",
    points: [
      "Se tient deux fois par an.",
      "Peut être décentralisée selon concertation du Bureau.",
      "Valide les comptes, oriente les réformes et décisions majeures.",
    ],
  },
  {
    numero: 8,
    titre: "Dissolution",
    texte: [
      "En cas de dissolution, les biens du Dahira seront remis à une organisation islamique partageant les mêmes valeurs.",
    ],
  },
];

/** Les chiffres que les membres viennent chercher en premier. */
export const REPERES = [
  { valeur: "1 000", unite: "Salaatu / jour", detail: "Minimum par membre (art. 1)" },
  { valeur: "1 000 F", unite: "Carte de membre", detail: "Obligatoire, une fois (art. 4)" },
  { valeur: "500 F", unite: "par mois", detail: "Cotisation obligatoire (art. 4)" },
  { valeur: "500 F", unite: "par an", detail: "Renouvellement, contre reçu (art. 4)" },
];

export const ADOPTION = {
  lieu: "Touba",
  date: "Dimanche 11 mai 2025",
  fondation: "02 janvier 2021",
};
