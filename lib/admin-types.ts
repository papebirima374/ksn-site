export type UserRole = "admin" | "commission" | "member";

export type Permission =
  | "gallery.write"
  | "articles.write"
  | "salaatu.write"
  | "library.write"
  | "menu.write"
  | "users.write"
  | "members.write"
  | "finances.write"
  | "boutique.write"
  | "education.write";

export const ALL_PERMISSIONS: Permission[] = [
  "gallery.write",
  "articles.write",
  "salaatu.write",
  "library.write",
  "menu.write",
  "users.write",
  "members.write",
  "finances.write",
  "boutique.write",
  "education.write",
];

/** Commissions officielles du Dahira KSN. Source unique reutilisee par
 *  le formulaire de creation, l'edition et la section publique. */
export const COMMISSIONS_LIST = [
  "Éducation & Culture",
  "Finances",
  "Sociale & Développement",
  "Organisation",
  "Communication",
  "Relations Extérieures",
  "Administratif",
  "Secrétariat",
] as const;

export type CommissionName = (typeof COMMISSIONS_LIST)[number];

export const PERMISSION_LABELS: Record<Permission, string> = {
  "gallery.write": "Galerie photos (ajouter / supprimer)",
  "articles.write": "Articles / blog (publier)",
  "salaatu.write": "Salaatu du jour (mettre à jour)",
  "library.write": "Bibliothèque des Salaats (gérer)",
  "menu.write": "Menu de navigation (éditer)",
  "users.write": "Utilisateurs (créer / modifier)",
  "members.write": "Membres du Dahira (gérer + cartes)",
  "finances.write": "Finances du Dahira (commission finance)",
  "boutique.write": "Boutique (produits + commandes)",
  "education.write": "Éducation & Culture (Tazawwud, leçons, audio)",
};

export type AppUser = {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  commission?: string;
  permissions: Permission[];
  createdAt?: number;
  /** Statut membre KSN officiel — détecté via lookup members/* par email/tél.
   *  PURE INFORMATION : ne déverrouille rien sur le site. Affichage badge. */
  memberStatus?: MemberStatus;
  memberId?: string;
  memberMatricule?: string;
  phone?: string;
  /** Photo de profil (URL Firebase Storage). Entièrement OPTIONNELLE. */
  photoURL?: string;
  photoStoragePath?: string;
  /** Achats premium — chacun débloque une section payante du site.
   *  Indépendant du statut membre KSN (chacun paie sa biblio). */
  premiumAccess?: {
    salaatuLibrary?: PremiumUnlock;
    // futures sections premium à ajouter ici :
    // tazawwudAudio?: PremiumUnlock;
    // ...
  };
};

/** Une déblocage premium individuel attaché à un user. */
export type PremiumUnlock = {
  /** Quand l'accès a été validé par l'admin. */
  unlockedAt: number;
  /** Référence de la commande premium qui a débloqué. */
  purchaseId: string;
  /** Montant payé en FCFA (snapshot). */
  amount: number;
  /** Identifiant de transaction Wave (saisi par l'admin lors de la validation). */
  transactionId?: string;
};

/** Identifiants des produits premium du site.
 *  Chaque clé débloque une section payante indépendante. */
export type PremiumProductKey = "salaatuLibrary";

export const PREMIUM_PRODUCTS: Record<
  PremiumProductKey,
  { label: string; amount: number; description: string; perks: string[] }
> = {
  salaatuLibrary: {
    label: "Bibliothèque des Salaatu",
    amount: 1000, // FCFA
    description:
      "Accès permanent et illimité à toute la bibliothèque des Salaatu sacrés.",
    perks: [
      "Lecture intégrale de tous les Salaats",
      "Salaatu du jour rotatif",
      "Catégorisation, recherche et favoris",
      "Accès à vie, partout, sur tous tes appareils",
    ],
  },
};

/** Demande d'achat premium déposée par un utilisateur après paiement Wave.
 *  Stockée dans la collection `premium_purchases`. */
export type PremiumPurchaseStatus =
  | "pending_review" // soumis, en attente de validation admin
  | "completed" // admin a confirmé → user débloqué
  | "rejected"; // admin a refusé (notes obligatoires)

export type PremiumPurchase = {
  id: string;
  userId: string;
  userEmail?: string;
  userPhone?: string;
  userDisplayName?: string;
  productKey: PremiumProductKey;
  amount: number; // FCFA
  method: "wave" | "orange-money" | "manual";
  /** ID/référence transaction Wave fourni par l'utilisateur. */
  applicantTransactionRef?: string;
  /** Note libre de l'utilisateur (capture d'écran via URL, message…). */
  applicantNote?: string;
  status: PremiumPurchaseStatus;
  /** Admin qui a validé/refusé. */
  reviewerUid?: string;
  reviewerName?: string;
  /** Notes admin (raison du refus, vérification, etc.). */
  reviewerNotes?: string;
  /** Transaction Wave confirmée par l'admin. */
  confirmedTransactionId?: string;
  createdAt: number;
  reviewedAt?: number;
};

// ════════════════════════════════════════════════════════════════════
//   ÉDUCATION & CULTURE — Tazawwud et autres ouvrages
// ════════════════════════════════════════════════════════════════════

export type EducationLanguage = "fr" | "en" | "ar" | "it" | "es" | "wo";

export type EducationPublishStatus = "draft" | "preview" | "published";

/** Module éducatif (chapitre du Tazawwud par exemple). */
export type EducationModule = {
  id: string;
  /** Slug court pour URL : "fondements", "tahara", ... */
  slug: string;
  /** Titre par langue. FR est toujours rempli. */
  title: Partial<Record<EducationLanguage, string>>;
  /** Titre arabe (calligraphie) — affiché en hero du module. */
  titleArabic?: string;
  /** Description courte (1-2 phrases). */
  description: Partial<Record<EducationLanguage, string>>;
  /** Icône emoji ou clé sémantique : "seedling", "water", "salat"... */
  iconKey?: string;
  /** Ordre d'affichage (1, 2, 3, ...). */
  order: number;
  publishStatus: EducationPublishStatus;
  /** Œuvre source : "tazawwud", "massalik", "custom", ... */
  sourceWork: string;
  createdAt: number;
  updatedAt?: number;
};

/** Audio attaché à une leçon, par langue + provider. */
export type EducationLessonAudio = {
  /** URL publique Firebase Storage. */
  url: string;
  /** Path dans Storage pour suppression. */
  storagePath: string;
  /** Hash du contenu texte au moment de la génération. Permet de
   *  détecter si le texte a changé et qu'il faut régénérer. */
  contentHash: string;
  voiceId: string;
  provider: "google" | "edge" | "manual_upload";
  durationSec: number;
  sizeBytes: number;
  generatedAt: number;
};

export type QuizOption = {
  id: string; // Ex: "A", "B", "C", "D"
  text: Partial<Record<EducationLanguage, string>>;
};

export type QuizQuestion = {
  id: string;
  question: Partial<Record<EducationLanguage, string>>;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: Partial<Record<EducationLanguage, string>>;
};

export type EducationLessonQuiz = {
  questions: QuizQuestion[];
};

/** Leçon individuelle (sous un module). */
export type EducationLesson = {
  id: string;
  moduleId: string;
  slug: string;
  /** Numéro affiché : 1.1, 1.2, 2.3, etc. */
  reference: string;
  /** Ordre dans le module (1, 2, 3, ...). */
  order: number;
  title: Partial<Record<EducationLanguage, string>>;
  titleArabic?: string;
  /** Intention spirituelle (Niya) — court paragraphe avant la leçon. */
  intention?: Partial<Record<EducationLanguage, string>>;
  /** Corps principal de la leçon, format Markdown. */
  content: Partial<Record<EducationLanguage, string>>;
  /** Citation centrale (verset / hadith / Serigne Touba). */
  citation?: {
    author?: string;
    sourceRef?: string; // ex: "Coran 33:56"
    arabic?: string;
    translations?: Partial<Record<EducationLanguage, string>>;
  };
  /** Application pratique dans la vie quotidienne. */
  application?: Partial<Record<EducationLanguage, string>>;
  /** Rappel à mémoriser (1 phrase). */
  reminder?: Partial<Record<EducationLanguage, string>>;
  /** Audio par langue. */
  audio?: Partial<Record<EducationLanguage, EducationLessonAudio>>;
  /** Illustrations uploadées (images pédagogiques). */
  illustrations?: Array<{
    url: string;
    storagePath: string;
    caption?: string;
    alt?: string;
    order?: number;
  }>;
  /** Temps de lecture estimé en minutes. */
  readingTimeMin?: number;
  quiz?: EducationLessonQuiz;
  publishStatus: EducationPublishStatus;
  /** Vue gratuite pour tous (true) ou réservée membres actifs. */
  publicAccess: boolean;
  createdAt: number;
  updatedAt?: number;
};

// ════════════════════════════════════════════════════════════════════
//   CERTIFICATION TAZAWWUD — validation orale obligatoire par la
//   Commission Éducation avant délivrance du certificat PDF.
// ════════════════════════════════════════════════════════════════════

export type EducationCertificationStatus =
  | "pending_review" // Demande déposée, en attente de l'entretien oral
  | "scheduled"      // Entretien planifié
  | "oral_passed"    // Validé — certificat téléchargeable
  | "rejected";      // Refusé après entretien (à reprendre)

/** Demande de certification après complétion intégrale du Tazawwud.
 *  Stockée dans la collection Firestore "educationCertifications". */
export type EducationCertification = {
  id: string;
  /** Identité de l'apprenant — saisie au moment de la demande. */
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  country?: string;
  /** Disponibilités pour l'entretien (texte libre). */
  availability?: string;
  /** Statut courant de la demande. */
  status: EducationCertificationStatus;
  /** Examinateur (membre de la Commission Éducation). */
  examinerName?: string;
  examinerUid?: string;
  /** Date de l'entretien (ISO YYYY-MM-DD) une fois passé. */
  oralExamDate?: string;
  /** Notes de la Commission après entretien. */
  examinerNotes?: string;
  /** Numéro de certificat — généré à la validation. */
  certificateNumber?: string;
  /** Référence locale anonyme côté apprenant (localStorage). */
  applicantLocalRef?: string;
  createdAt: number;
  updatedAt?: number;
  validatedAt?: number;
};

/** Document officiel téléchargeable (PDF, DOC, etc.).
 *  Affiché dans la section "Documents Officiels KSN" du site public. */
export type OfficialDocument = {
  id: string;
  title: string;
  description: string;
  /** URL publique de téléchargement (Firebase Storage). */
  url: string;
  /** Path du fichier dans Firebase Storage (pour suppression). */
  storagePath: string;
  /** Nom de fichier original (affiché à l'utilisateur). */
  filename: string;
  /** Taille en octets (servira à afficher "2.0 Mo"). */
  sizeBytes: number;
  /** MIME type (ex: "application/pdf"). */
  mimeType: string;
  order: number;
  visible: boolean;
  createdAt: number;
  updatedAt?: number;
  createdBy: string;
};

/** Témoignage de membre affiché dans la section publique de l'accueil. */
export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  location: string;
  flag: string;
  since?: string;
  quote: string;
  /** Couleur d'accent de l'avatar (gradient). */
  accent: "green" | "gold" | "sand";
  /** Ordre d'affichage (les + petits en premier). 0 = nouveau. */
  order: number;
  /** Si false, le témoignage est masqué publiquement. */
  visible: boolean;
  createdAt: number;
  updatedAt?: number;
};

export type ArticleStatus = "draft" | "published";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: ArticleStatus;
  publishedAt?: number;
  authorId: string;
  authorName?: string;
  createdAt: number;
  updatedAt: number;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: "evenements" | "activites" | "journee" | "assemblee";
  /** Annee de l'evenement (surtout pour les editions de la Journee Salaatu).
   *  Format libre : "2024" / "2025" / "2025-12-26". */
  year?: string;
  storagePath?: string;
  createdAt: number;
  createdBy: string;
};

export type SalaatuMode = "auto" | "manual";

export type SalaatuDuJour = {
  mode?: SalaatuMode; // defaults to "auto" if absent
  arabic: string;
  translit: string;
  translation: string;
  title?: string;
  date?: string;
  lastUpdated: number;
  lastUpdatedBy: string;
};

export type MenuItem = {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
};

export type MemberStatus = "actif" | "en_attente" | "inactif";

export type Member = {
  id: string;
  matricule: string;
  prenom: string;
  nom: string;
  email?: string;
  telephone?: string;
  dateNaissance?: string;
  profession?: string;
  region?: string;
  ville?: string;
  pays?: string;
  domicile?: string;
  photo?: string;
  photoPath?: string;
  status: MemberStatus;
  notes?: string;
  joinedAt?: number;
  createdAt: number;
  createdBy?: string;
  // Optional: original ID/uid from the mobile app project, used to avoid
  // duplicates during the cross-project migration.
  sourceUid?: string;
};

/** Vérifie si l'utilisateur a débloqué une section premium spécifique. */
export function hasPremium(
  user: AppUser | null,
  productKey: PremiumProductKey
): boolean {
  if (!user) return false;
  // Les admins ont accès à tout le premium (pour modération / preview)
  if (user.role === "admin") return true;
  return Boolean(user.premiumAccess?.[productKey]?.unlockedAt);
}

export function hasPermission(user: AppUser | null, p: Permission): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.permissions.includes(p);
}

// ============ SALAATU LIBRARY ============

export type SalaatuLibraryItem = {
  id: string;
  title: string;
  category: string;
  arabic: string;
  transliteration?: string;
  translation?: string;
  benefits?: string[]; // bienfaits courts (1-2 lignes chacun)
  usageNotes?: string[]; // notes / secrets d'utilisation
  featured?: boolean; // si vrai, devient le Salaatu du jour
  order: number;
  createdAt: number;
  createdBy?: string;
};

export const SALAATU_CATEGORIES = [
  "Salaatu Ibrahimiyya",
  "Quotidien",
  "Vendredi",
  "Protection",
  "Élévation & Succès",
  "Subsistance",
  "Guérison",
  "Famille",
  "Autres",
];

// ============ FINANCES ============

export type FinanceType = "income" | "expense";

export const FINANCE_CATEGORIES: Record<FinanceType, string[]> = {
  income: [
    "Cotisation mensuelle",
    "Cotisation annuelle",
    "Don général",
    "Don événement",
    "Vente / Boutique",
    "Subvention",
    "Autres recettes",
  ],
  expense: [
    "Événement / Gamou",
    "Aide sociale",
    "Achat fournitures",
    "Transport",
    "Communication",
    "Loyer / Local",
    "Autres dépenses",
  ],
};

export const FINANCE_METHODS = [
  "Wave",
  "Orange Money",
  "Free Money",
  "Espèces",
  "Virement bancaire UBA",
  "Chèque",
  "Autre",
];

// ============ BOUTIQUE ============

export type ProductCategory = "cafe" | "book" | "physical";

export const PRODUCT_CATEGORIES: { id: ProductCategory; label: string; emoji: string }[] = [
  { id: "cafe", label: "Café G", emoji: "☕" },
  { id: "book", label: "Livres PDF", emoji: "📚" },
  { id: "physical", label: "Produits Physiques", emoji: "🎁" },
];

export type Product = {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number; // FCFA
  image?: string;
  imagePath?: string;
  stock?: number; // for physical only
  pdfUrl?: string; // for book only
  featured?: boolean;
  visible: boolean;
  createdAt: number;
};

export type OrderStatus = "pending" | "delivered" | "cancelled";

export type OrderItem = {
  productId: string;
  title: string;
  category: ProductCategory;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  paymentMethod: "wave" | "orange-money" | "card" | "paypal";
  transactionId?: string;
  total: number;
  status: OrderStatus;
  createdAt: number;
  notes?: string;
};

export const ORDER_PERMISSION = "boutique.write" as const;

export type FinanceEntry = {
  id: string;
  type: FinanceType;
  category: string;
  amount: number; // FCFA
  description?: string;
  reference?: string;
  date: string; // ISO date (YYYY-MM-DD)
  method?: string;
  memberId?: string; // si lié à un membre
  memberMatricule?: string;
  memberName?: string;
  recordedBy: string;
  recordedAt: number;
};
