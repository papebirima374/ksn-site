// Composition du Bureau du Dahira Kippaangog Salaatu 'Alaa Nabii.
//
// Source : document officiel « LE BUREAU » (Touba, 2024), complete par les
// attributions decrites a l'article 3 du Reglement Interieur (11 mai 2025).
//
// Mise a jour septembre 2026 : SERIGNE ELHADJI MALICK MBAYE est titulaire du
// poste de Secretaire a l'Administratif. On n'affiche que la composition en
// vigueur — les mouvements de personnes ne sont pas du ressort de cette page.

export type Poste = {
  titre: string;
  titulaire: string;
  /** Attribution, telle que definie a l'article 3 du Reglement Interieur. */
  role: string;
  adjoints: string[];
};

export const PRESIDENCE: Poste[] = [
  {
    titre: "Président d'Honneur",
    titulaire: "Serigne Bassirou Touré",
    role: "Responsable moral du Dahira, garant des orientations spirituelles.",
    adjoints: [],
  },
  {
    titre: "Président",
    titulaire: "Serigne Birima Gueye",
    role:
      "Conduit les réunions, représente le Dahira et veille à l'application des décisions. Il peut convoquer une réunion d'urgence en cas de force majeure.",
    adjoints: ["Sokhna Aminata Thioune — Adjointe"],
  },
];

export const SECRETARIATS: Poste[] = [
  {
    titre: "Secrétaire Générale",
    titulaire: "Sokhna Khady Ndiaye",
    role: "Coordonne les activités et prépare les rapports d'activités.",
    adjoints: ["Serigne Saliou Lo — 1er adjoint", "Sokhna Daba Niang — 2ème adjointe"],
  },
  {
    titre: "Secrétaire à l'Administratif",
    titulaire: "Serigne Elhadji Malick Mbaye",
    role: "Gère les adhésions, les documents et la délivrance des cartes de membres.",
    adjoints: ["Sokhna Ndeye Dieng — 2ème adjointe"],
  },
  {
    titre: "Secrétaire à l'Organisation",
    titulaire: "Serigne Assane Samb",
    role: "Planifie les événements et les activités du Dahira.",
    adjoints: [
      "Serigne Fallou Dieng — 1er adjoint",
      "Sokhna Amy Ndiaye — 2ème adjointe",
      "Serigne Adama Ndiaye — 3ème adjoint",
    ],
  },
  {
    titre: "Secrétaire chargé des Finances",
    titulaire: "Serigne Massamba Mbaye",
    role: "Gère les finances et la comptabilité du Dahira.",
    adjoints: ["Serigne Ousmane Sall — 1er adjoint", "Serigne Mouhamad Thiaré — 2ème adjoint"],
  },
  {
    titre: "Secrétaire aux Affaires Sociales, au Développement et aux Relations Extérieures",
    titulaire: "Serigne Cheikhouna Sock",
    role: "Initie les projets solidaires et représente le Dahira à l'extérieur.",
    adjoints: ["Sokhna Khady Ndiaye — 1ère adjointe", "Serigne Sidy Leye — 2ème adjoint"],
  },
  {
    titre: "Secrétaire de l'Éducation et à la Culture",
    titulaire: "Serigne Mame Cheikh Anta Sall",
    role: "Développe les activités éducatives et culturelles.",
    adjoints: ["Serigne Cheikhouna Sock — 1er adjoint", "Sokhna Diop — 2ème adjointe"],
  },
  {
    titre: "Secrétaire à la Communication",
    titulaire: "Serigne Birima Gueye",
    role: "Assure la communication interne et externe.",
    adjoints: ["Serigne Mouhamad Thiaré — 1er adjoint", "Serigne Cheikh Gueye — 2ème adjoint"],
  },
];

/** Signataires du Reglement Interieur et des Statuts (Touba, 11 mai 2025). */
export const SIGNATAIRES = [
  { role: "Président d'Honneur", nom: "Serigne Bassirou Touré" },
  { role: "Président", nom: "Serigne Birima Gueye" },
  { role: "Secrétaire Générale", nom: "Sokhna Khady Ndiaye" },
  { role: "Trésorier", nom: "Serigne Massamba Mbaye" },
];
