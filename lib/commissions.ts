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
};

export const COMMISSIONS: Commission[] = [
  {
    slug: "education-culture",
    nom: "Éducation et Culture",
    mission:
      "Renforcer le lien spirituel des membres à travers le Coran, les Khassidas, le Salaatu quotidien, les conférences et l'éducation islamique.",
    emoji: "📚",
  },
  {
    slug: "finances",
    nom: "Finances",
    mission:
      "Gestion transparente des cotisations, des dons, de la comptabilité et du financement des activités du Dahira.",
    emoji: "💰",
  },
  {
    slug: "social-developpement",
    nom: "Social et Développement",
    mission:
      "Solidarité communautaire, assistance aux membres, projets sociaux et actions de développement.",
    emoji: "🤝",
  },
  {
    slug: "organisation",
    nom: "Organisation",
    mission:
      "Coordination des événements, logistique, journées spirituelles, rencontres et activités du Dahira.",
    emoji: "🏛️",
  },
  {
    slug: "communication",
    nom: "Communication",
    mission:
      "Annonces officielles, réseaux sociaux, médias, publications et rayonnement numérique du Dahira.",
    emoji: "📢",
  },
  {
    slug: "secretariat-administratif",
    nom: "Secrétariat et Administratif",
    mission:
      "Comptes-rendus, organisation des réunions, archivage, correspondance officielle, démarches institutionnelles et suivi des dossiers.",
    emoji: "📝",
  },
];

export function getCommission(slug: string): Commission | undefined {
  return COMMISSIONS.find((c) => c.slug === slug);
}

export function commissionNom(slug: string): string {
  return getCommission(slug)?.nom ?? slug;
}
