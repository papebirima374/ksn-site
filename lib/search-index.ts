/** Index statique de recherche du site KSN.
 *  Toutes les entrees recherchables (pages, sections FAQ, commissions...)
 *  sont listees ici. La recherche est 100% client-side, instantanee. */

export type SearchCategory =
  | "Page"
  | "Espace membre"
  | "Événement"
  | "FAQ"
  | "Commission"
  | "Légal";

export type SearchEntry = {
  /** Titre principal affiché dans les résultats */
  title: string;
  /** Description courte (1-2 lignes) */
  description: string;
  /** URL de destination (relative) */
  url: string;
  /** Catégorie pour le groupement visuel */
  category: SearchCategory;
  /** Mots-clés pour booster le scoring (synonymes, variations) */
  keywords: string[];
};

export const SEARCH_INDEX: SearchEntry[] = [
  // ─── PAGES PRINCIPALES ───────────────────────────────────────────
  {
    title: "Accueil",
    description: "Page d'accueil du Dahira KSN — Challenge 1 Milliard, Journée Salaatu, commissions.",
    url: "/",
    category: "Page",
    keywords: ["home", "accueil", "ksn", "dahira", "principal"],
  },
  {
    title: "Le Dahira",
    description: "Présentation institutionnelle du Dahira Kippangog Salaatu ʿAlaa Nabii.",
    url: "/dahira",
    category: "Page",
    keywords: ["dahira", "organisation", "présentation", "qui sommes-nous"],
  },
  {
    title: "Notre Histoire",
    description: "Fondation 2021 à Touba, jalons clés, valeurs du Dahira KSN.",
    url: "/notre-histoire",
    category: "Page",
    keywords: ["histoire", "fondation", "2021", "origines", "timeline", "valeurs"],
  },
  {
    title: "Spiritualité",
    description: "Bibliothèque des Salaatu, prières quotidiennes, contenu spirituel.",
    url: "/spiritualite",
    category: "Page",
    keywords: ["spiritualité", "salaatu", "prière", "bibliothèque", "spirituel"],
  },
  {
    title: "Challenge 1 Milliard",
    description: "Compteur live du défi : un milliard de Salaatu offerts au Prophète ﷺ.",
    url: "/challenge",
    category: "Événement",
    keywords: ["challenge", "milliard", "compteur", "défi", "salaatu", "live"],
  },
  {
    title: "Journée Salaatu ʿAlaa Nabii",
    description: "Événement annuel — 26 décembre 2026 à Touba. Programme, lieu, inscriptions.",
    url: "/journee-salaatu",
    category: "Événement",
    keywords: ["journée", "salaatu", "alaa nabii", "26 décembre", "touba", "événement", "annuel", "rassemblement"],
  },
  {
    title: "Média",
    description: "Galerie photos, vidéos YouTube, archives des événements.",
    url: "/media",
    category: "Page",
    keywords: ["média", "photos", "vidéos", "galerie", "youtube", "archives"],
  },
  {
    title: "Boutique",
    description: "Produits officiels du Dahira KSN (cafés, livres, vêtements).",
    url: "/boutique",
    category: "Page",
    keywords: ["boutique", "shop", "achat", "produits", "café", "vêtements"],
  },
  {
    title: "Blog",
    description: "Articles spirituels, actualités du Dahira, réflexions.",
    url: "/blog",
    category: "Page",
    keywords: ["blog", "articles", "actualités", "news"],
  },
  {
    title: "Contact",
    description: "Formulaire de contact + WhatsApp + adresse Touba.",
    url: "/contact",
    category: "Page",
    keywords: ["contact", "joindre", "téléphone", "email", "whatsapp", "écrire"],
  },
  {
    title: "FAQ",
    description: "Réponses aux 18 questions les plus fréquentes sur le Dahira KSN.",
    url: "/faq",
    category: "Page",
    keywords: ["faq", "questions", "réponses", "aide", "help"],
  },

  // ─── ESPACE MEMBRE ───────────────────────────────────────────────
  {
    title: "Devenir membre",
    description: "Formulaire d'inscription au Dahira KSN — cotisation 1 000 FCFA/an.",
    url: "/inscription",
    category: "Espace membre",
    keywords: ["inscription", "adhésion", "rejoindre", "membre", "cotisation", "1000 fcfa"],
  },
  {
    title: "Mon espace membre",
    description: "Connexion à votre profil — carte CR-80, matricule, paiement.",
    url: "/espace-membre",
    category: "Espace membre",
    keywords: ["espace membre", "login", "connexion", "profil", "carte"],
  },
  {
    title: "Faire un don",
    description: "Soutenir financièrement le Dahira — Wave, Orange Money, Stripe, PayPal.",
    url: "/don",
    category: "Espace membre",
    keywords: ["don", "donation", "soutenir", "financier", "wave", "orange money", "stripe", "paypal", "contribuer"],
  },

  // ─── SECTIONS FAQ (deep links) ───────────────────────────────────
  {
    title: "Comment devenir membre du Dahira ?",
    description: "Inscription en ligne + cotisation 1 000 FCFA + accès espace membre.",
    url: "/faq#adhésion-et-espace-membre",
    category: "FAQ",
    keywords: ["devenir membre", "comment", "inscription", "adhésion", "rejoindre"],
  },
  {
    title: "Combien coûte la cotisation ?",
    description: "1 000 FCFA par an (environ 1,50 €).",
    url: "/faq#adhésion-et-espace-membre",
    category: "FAQ",
    keywords: ["prix", "coût", "tarif", "combien", "cotisation", "montant"],
  },
  {
    title: "Comment recevoir ma carte de membre ?",
    description: "La carte CR-80 apparaît dans votre espace membre après paiement.",
    url: "/faq#adhésion-et-espace-membre",
    category: "FAQ",
    keywords: ["carte", "carte membre", "cr-80", "imprimer", "matricule"],
  },
  {
    title: "Qu'est-ce que le Challenge 1 Milliard ?",
    description: "Notre défi spirituel collectif : 1 milliard de Salaatu cumulés.",
    url: "/faq#challenge-1-milliard-de-salaatu",
    category: "FAQ",
    keywords: ["challenge", "milliard", "défi", "qu'est-ce"],
  },
  {
    title: "Quand a lieu la Journée Salaatu ?",
    description: "26 décembre 2026 à Touba. Programme détaillé sur la page dédiée.",
    url: "/faq#journée-salaatu-ʿalaa-nabii",
    category: "FAQ",
    keywords: ["date journée", "quand", "26 décembre", "2026"],
  },
  {
    title: "Quels moyens de paiement acceptez-vous ?",
    description: "Wave, Orange Money, UBA (Sénégal) + Stripe, PayPal (international).",
    url: "/faq#dons-et-paiements",
    category: "FAQ",
    keywords: ["paiement", "moyens", "wave", "orange money", "uba", "stripe", "paypal", "carte bancaire"],
  },

  // ─── COMMISSIONS ─────────────────────────────────────────────────
  {
    title: "Commission Éducation & Culture",
    description: "Coran, Khassidas, Salaatu quotidien, conférences, éducation islamique.",
    url: "/dahira#commissions",
    category: "Commission",
    keywords: ["éducation", "culture", "coran", "khassida", "enseignement"],
  },
  {
    title: "Commission Finances",
    description: "Gestion des cotisations, dons, comptabilité, financement.",
    url: "/dahira#commissions",
    category: "Commission",
    keywords: ["finances", "argent", "comptabilité", "trésorerie", "budget"],
  },
  {
    title: "Commission Sociale & Développement",
    description: "Solidarité communautaire, assistance, projets sociaux.",
    url: "/dahira#commissions",
    category: "Commission",
    keywords: ["sociale", "social", "développement", "solidarité", "aide"],
  },
  {
    title: "Commission Organisation",
    description: "Coordination des événements, logistique, journées spirituelles.",
    url: "/dahira#commissions",
    category: "Commission",
    keywords: ["organisation", "logistique", "événements"],
  },
  {
    title: "Commission Communication",
    description: "Annonces officielles, réseaux sociaux, médias, publications.",
    url: "/dahira#commissions",
    category: "Commission",
    keywords: ["communication", "réseaux sociaux", "presse", "média"],
  },
  {
    title: "Commission Relations Extérieures",
    description: "Partenariats, représentation institutionnelle, international.",
    url: "/dahira#commissions",
    category: "Commission",
    keywords: ["relations extérieures", "partenariats", "international", "diplomatie"],
  },
  {
    title: "Commission Administratif",
    description: "Gestion administrative, démarches institutionnelles, conformité.",
    url: "/dahira#commissions",
    category: "Commission",
    keywords: ["administratif", "administration", "démarches", "conformité"],
  },
  {
    title: "Commission Secrétariat",
    description: "Comptes-rendus, réunions, archivage, correspondance officielle.",
    url: "/dahira#commissions",
    category: "Commission",
    keywords: ["secrétariat", "comptes-rendus", "réunions", "archives"],
  },

  // ─── PAGES LÉGALES ───────────────────────────────────────────────
  {
    title: "Mentions légales",
    description: "Informations légales sur l'organisation et le site.",
    url: "/mentions-legales",
    category: "Légal",
    keywords: ["mentions légales", "legal", "éditeur"],
  },
  {
    title: "Politique de confidentialité",
    description: "Comment nous protégeons vos données personnelles (RGPD).",
    url: "/confidentialite",
    category: "Légal",
    keywords: ["confidentialité", "rgpd", "données personnelles", "privacy"],
  },
  {
    title: "CGU — Conditions Générales d'Utilisation",
    description: "Règles d'utilisation du site KSN.",
    url: "/cgu",
    category: "Légal",
    keywords: ["cgu", "conditions générales", "utilisation"],
  },
  {
    title: "CGV — Conditions Générales de Vente",
    description: "Conditions applicables aux achats sur la boutique.",
    url: "/cgv",
    category: "Légal",
    keywords: ["cgv", "vente", "achat", "boutique"],
  },
  {
    title: "Cookies",
    description: "Notre politique de cookies et traceurs.",
    url: "/cookies",
    category: "Légal",
    keywords: ["cookies", "traceurs"],
  },
];

/** Normalise un texte pour la recherche : minuscules + sans accents.
 *  Permet de matcher "spiritualite" avec "Spiritualité" et "salaatu"
 *  avec "Salaatu". */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Recherche fuzzy dans l'index. Retourne les top N résultats scorés.
 *  Scoring :
 *    - Match exact dans titre = 50 pts
 *    - Match partiel dans titre = 20 pts
 *    - Match dans mots-clés = 15 pts
 *    - Match dans description = 5 pts
 *  Bonus : +5 par occurrence supplémentaire */
export function searchIndex(query: string, maxResults = 8): SearchEntry[] {
  const q = normalize(query.trim());
  if (q.length < 2) return [];

  const terms = q.split(/\s+/).filter((t) => t.length > 0);

  const scored = SEARCH_INDEX.map((entry) => {
    let score = 0;
    const ntitle = normalize(entry.title);
    const ndesc = normalize(entry.description);
    const nkeywords = entry.keywords.map(normalize);

    for (const term of terms) {
      // Match exact dans le titre (le mot est un mot complet)
      const titleWordRegex = new RegExp(`\\b${escapeRegex(term)}\\b`);
      if (titleWordRegex.test(ntitle)) score += 50;
      // Match partiel dans le titre
      else if (ntitle.includes(term)) score += 20;

      // Match dans les mots-clés
      for (const kw of nkeywords) {
        if (kw === term) score += 25;
        else if (kw.includes(term)) score += 10;
      }

      // Match dans la description
      if (ndesc.includes(term)) score += 5;
    }

    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.entry);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
