// Composition du Bureau du Dahira Kippaangog Salaatu 'Alaa Nabii.
//
// Source : le RENOUVELLEMENT du bureau, transmis par la Presidence en
// septembre 2026. Il remplace le document « LE BUREAU » (Touba, 2024) : la
// composition y est desormais organisee par COMMISSION, et non plus par
// « Secretaire a… ». Les attributions restent celles de l'article 3 du
// Reglement Interieur (11 mai 2025).
//
// DEUX PRECAUTIONS, POUR UN DOCUMENT QUI NOMME DES PERSONNES REELLES :
//
//  1. Les noms sont repris TELS QUE la Presidence les a ecrits. Aucun titre
//     (« Serigne », « Sokhna ») n'a ete ajoute la ou le document n'en portait
//     pas : se tromper de titre sur une piece officielle est pire que de n'en
//     mettre aucun. Seule l'orthographe wolof « soxna » a ete rendue par
//     « Sokhna », et les majuscules normalisees.
//
//  2. Le poste de Secretaire Administratif revient au premier adjoint,
//     SOKHNA MAMAN NENE SAMB ayant demissionne. Elle ne figure donc pas ici,
//     conformement a la decision de la Presidence.

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
    adjoints: ["Sokhna Aminata Thioune", "Serigne Mbacké Gueye"],
  },
];

/** Le Secretariat : charniere entre les commissions et la Presidence. */
export const SECRETARIATS: Poste[] = [
  {
    titre: "Secrétaire Administratif",
    titulaire: "El Hadji Malick Mbaye",
    role:
      "Gère les adhésions, les documents et la délivrance des cartes de membres. Recueille les rapports des commissions et les transmet à la Présidence.",
    adjoints: ["Sokhna Daba Niang", "Assane Samb"],
  },
];

/** Les cinq commissions, dans l'ordre du document de renouvellement. */
export const COMMISSIONS_BUREAU: Poste[] = [
  {
    titre: "Commission Finances",
    titulaire: "Serigne Massamba Mbaye",
    role: "Gère la caisse du Dahira, les cotisations et les versements aux commissions.",
    adjoints: ["Sokhna Anta Mbacké", "Sidi Leye"],
  },
  {
    titre: "Commission Organisation",
    titulaire: "Serigne Saliou Lô",
    role: "Planifie les événements, la logistique et les journées du Dahira.",
    adjoints: ["Fallou Dieng", "Fatou Niass", "Ibrahima Signane"],
  },
  {
    titre: "Commission Sociale",
    titulaire: "Serigne Cheikhouna Sock",
    role: "Solidarité entre les membres, aides sociales, boutique et activités économiques.",
    adjoints: ["Sokhna Khady Ndiaye", "Khadim Mboup"],
  },
  {
    titre: "Commission Culture",
    titulaire: "Mame Cheikh Anta Sall",
    role:
      "Développe les activités éducatives et culturelles, et tient le relevé du bisub Salaatu 'Alaa Nabii.",
    adjoints: ["Sokhna Diop", "Soda Diop", "Modou Sougou", "Ndeye Arame Diouf"],
  },
  {
    titre: "Commission Communication",
    titulaire: "Modou Thiaré",
    role: "Assure la communication interne et externe, les annonces et le rayonnement numérique.",
    adjoints: ["Fallou Konté", "Abdou Lahade Dieng", "Serigne Cheikh Gueye"],
  },
];

/** Signataires du Reglement Interieur et des Statuts.
 *  Le Reglement a ete adopte le 11 mai 2025 ; les signatures portees ici sont
 *  celles des postes en vigueur apres le renouvellement. */
export const SIGNATAIRES = [
  { role: "Président d'Honneur", nom: "Serigne Bassirou Touré" },
  { role: "Président", nom: "Serigne Birima Gueye" },
  { role: "Secrétaire Administratif", nom: "El Hadji Malick Mbaye" },
  { role: "Commission Finances", nom: "Serigne Massamba Mbaye" },
];
