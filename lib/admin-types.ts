export type UserRole = "admin" | "commission";

export type Permission =
  | "gallery.write"
  | "articles.write"
  | "salaatu.write"
  | "menu.write"
  | "users.write"
  | "members.write";

export const ALL_PERMISSIONS: Permission[] = [
  "gallery.write",
  "articles.write",
  "salaatu.write",
  "menu.write",
  "users.write",
  "members.write",
];

export const PERMISSION_LABELS: Record<Permission, string> = {
  "gallery.write": "Galerie photos (ajouter / supprimer)",
  "articles.write": "Articles / blog (publier)",
  "salaatu.write": "Salaatu du jour (mettre à jour)",
  "menu.write": "Menu de navigation (éditer)",
  "users.write": "Utilisateurs (créer / modifier)",
  "members.write": "Membres du Dahira (gérer + cartes)",
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
