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
  | "boutique.write";

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
};

export type AppUser = {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  commission?: string;
  permissions: Permission[];
  createdAt?: number;
  memberStatus?: MemberStatus;
  memberId?: string;
  memberMatricule?: string;
  phone?: string;
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
