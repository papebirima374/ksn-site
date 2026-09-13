// Source unique des commissions du Dahira.
//
// Liste arretee en septembre 2026 : le Secretariat et l'Administratif ont ete
// fusionnes en une seule commission. Toute page qui affiche, liste ou cible une
// commission (formulaires de rapport, espace admin, fiches imprimables) doit
// lire cette liste et rien d'autre.

export type Commission = {
  /** Identifiant stable, utilise dans l'URL du formulaire et dans Firestore.
   *  Ne jamais le modifier : les liens deja envoyes cesseraient de fonctionner. */
  slug: string;
  nom: string;
  mission: string;
  emoji: string;
  /** Responsable de la commission, d'apres le Bureau (voir lib/bureau.ts).
   *  Le NOM est public — il figure au document officiel du Bureau. Le NUMERO,
   *  lui, ne doit jamais arriver ici : ce fichier est importe par des pages
   *  publiques, donc tout ce qu'il contient part dans le JavaScript envoye a
   *  n'importe quel visiteur. Les numeros vivent cote serveur, dans
   *  app/api/commission-contacts/route.ts. */
  responsable?: string;
  /** Le releve du bisub Salaatu 'Alaa Nabii ne concerne qu'une commission :
   *  Education et Culture en a la charge. Ailleurs, la section n'est pas
   *  masquee « au cas ou » — elle n'existe pas du tout, pour ne pas faire
   *  croire aux autres qu'on attend un chiffre d'elles. */
  bilanSalaatu?: boolean;
};

export const COMMISSIONS: Commission[] = [
  {
    slug: "education-culture",
    nom: "Éducation et Culture",
    mission:
      "Renforcer le lien spirituel des membres à travers le Coran, les Khassidas, le Salaatu quotidien, les conférences et l'éducation islamique.",
    emoji: "📚",
    responsable: "Serigne Mame Cheikh Anta Sall",
    bilanSalaatu: true,
  },
  {
    slug: "finances",
    nom: "Finances",
    mission:
      "Gestion transparente des cotisations, des dons, de la comptabilité et du financement des activités du Dahira.",
    emoji: "💰",
    responsable: "Serigne Massamba Mbaye",
  },
  {
    slug: "social-developpement",
    nom: "Social et Développement",
    mission:
      "Solidarité communautaire, assistance aux membres, projets sociaux et actions de développement.",
    emoji: "🤝",
    responsable: "Serigne Cheikhouna Sock",
  },
  {
    slug: "organisation",
    nom: "Organisation",
    mission:
      "Coordination des événements, logistique, journées spirituelles, rencontres et activités du Dahira.",
    emoji: "🏛️",
    responsable: "Serigne Assane Samb",
  },
  {
    slug: "communication",
    nom: "Communication",
    mission:
      "Annonces officielles, réseaux sociaux, médias, publications et rayonnement numérique du Dahira.",
    emoji: "📢",
    responsable: "Serigne Birima Gueye",
  },
  {
    slug: "secretariat-administratif",
    nom: "Secrétariat et Administratif",
    mission:
      "Comptes-rendus, organisation des réunions, archivage, correspondance officielle, démarches institutionnelles et suivi des dossiers.",
    emoji: "📝",
    responsable: "Sokhna Khady Ndiaye",
  },
];

export function getCommission(slug: string): Commission | undefined {
  return COMMISSIONS.find((c) => c.slug === slug);
}

/** La commission tient-elle le decompte des Salaatu ? */
export function aBilanSalaatu(slug: string): boolean {
  return getCommission(slug)?.bilanSalaatu === true;
}

export function commissionNom(slug: string): string {
  return getCommission(slug)?.nom ?? slug;
}

/** Noms officiels, dans l'ordre. C'est cette valeur (le nom, pas le slug) qui
 *  est stockee dans users/<uid>.commission — historique du projet. */
export const COMMISSION_NAMES = COMMISSIONS.map((c) => c.nom);

/** Anciens libelles encore presents dans Firestore, rattaches a la liste
 *  actuelle. Septembre 2026 : le Secretariat et l'Administratif ont fusionne.
 *  « Relations Exterieures » ne figure plus dans la liste transmise : les
 *  comptes qui la portent restent sans commission jusqu'a reaffectation par
 *  l'administrateur, plutot que d'etre rattaches au hasard. */
const ANCIENS_NOMS: Record<string, string> = {
  "Éducation & Culture": "education-culture",
  "Sociale & Développement": "social-developpement",
  "Administratif": "secretariat-administratif",
  "Secrétariat": "secretariat-administratif",
};

/** Slug d'une commission a partir du nom stocke sur un compte.
 *  Renvoie null si le compte n'a pas de commission reconnue. */
export function slugFromNom(nom: string | null | undefined): string | null {
  if (!nom) return null;
  const exact = COMMISSIONS.find((c) => c.nom === nom);
  if (exact) return exact.slug;
  return ANCIENS_NOMS[nom] ?? null;
}
