export type UserRole = "admin" | "commission" | "member";

export type Permission =
  | "gallery.write"
  | "articles.write"
  | "salaatu.write"
  | "library.write"
  | "menu.write"
  | "users.write"
  | "members.write"
  | "finances.write";

export const ALL_PERMISSIONS: Permission[] = [
  "gallery.write",
  "articles.write",
  "salaatu.write",
  "library.write",
  "menu.write",
  "users.write",
  "members.write",
  "finances.write",
];

export const PERMISSION_LABELS: Record<Permission, string> = {
  "gallery.write": "Galerie photos (ajouter / supprimer)",
  "articles.write": "Articles / blog (publier)",
  "salaatu.write": "Salaatu du jour (mettre à jour)",
  "library.write": "Bibliothèque des Salaats (gérer)",
  "menu.write": "Menu de navigation (éditer)",
  "users.write": "Utilisateurs (créer / modifier)",
  "members.write": "Membres du Dahira (gérer + cartes)",
  "finances.write": "Finances du Dahira (commission finance)",
};

export type AppUser = {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  commission?: string;
  permissions: Permission[];
  createdAt?: number;
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
  category: "gamou" | "conferences" | "evenements" | "activites";
  storagePath?: string;
  createdAt: number;
  createdBy: string;
};

export type SalaatuDuJour = {
  arabic: string;
  translit: string;
  translation: string;
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

export type MemberStatus = "actif" | "inactif";

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
