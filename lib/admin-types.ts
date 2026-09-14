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

/** Commissions officielles du Dahira KSN.
 *  Source unique : lib/commissions.ts. Ne pas redefinir la liste ici — les
 *  deux ont diverge par le passe (8 ici, 6 la-bas) et les comptes se sont
 *  retrouves rattaches a des commissions qui n'existaient plus. */
export { COMMISSION_NAMES, slugFromNom } from "./commissions";
import { COMMISSION_NAMES as _NOMS } from "./commissions";

export const COMMISSIONS_LIST = _NOMS;

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
    // tazawwudAudio?: PremiumUnlock;
    // ...
  };
  /** Préférences de notifications (canaux + catégories). */
  notificationPreferences?: NotificationPreferences;
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
//   NOTIFICATIONS — Centre in-app temps réel
// ════════════════════════════════════════════════════════════════════

/** Types des événements de notification. Sert au routing UI
 *  (icône, couleur d'accent) et au filtrage. */
export type NotificationType =
  // Premium
  | "premium_request_new"      // user → admins : nouvelle demande déposée
  | "premium_request_approved" // admin → user : demande validée
  | "premium_request_rejected" // admin → user : demande refusée
  // Commissions — versements entre caisses de commission
  | "transfert_envoye"   // Finances → commission : un versement vous attend
  | "transfert_recu"     // commission → Finances : reception accusee
  | "dossier_circuit"    // le dossier avance, ou revient pour complement
  // Générique
  | "info"
  | "success"
  | "warning";

/** Canaux de notification disponibles côté user. */
export type NotificationChannel =
  | "inApp"      // cloche + toast (toujours actif)
  | "browser"    // notification système navigateur (nécessite permission)
  | "whatsapp"   // message WhatsApp automatique
  | "email";     // futur — nécessite SMTP

/** Catégories d'événements regroupés pour les préférences. */
export type NotificationCategory =
  | "premium"        // demandes/validations premium
  | "admin_alerts"   // alertes admin (broadcast)
  | "commission"     // vie des commissions (versements, circuit des dossiers)
  | "system";        // info/success/warning

/** Préférences de notification d'un utilisateur. Tout ce qui n'est
 *  pas explicitement à false est ON par défaut. */
export type NotificationPreferences = {
  /** Canaux activés. Le canal inApp est toujours actif et ne peut
   *  pas être désactivé — c'est notre garantie de fond. */
  channels?: Partial<Record<NotificationChannel, boolean>>;
  /** Catégories désactivées. Si une catégorie est ici à false,
   *  aucune notification de ce type ne sera produite pour cet user. */
  categories?: Partial<Record<NotificationCategory, boolean>>;
};

/** Mapping NotificationType → NotificationCategory pour les filtres. */
export const NOTIFICATION_TYPE_CATEGORY: Record<
  NotificationType,
  NotificationCategory
> = {
  premium_request_new: "admin_alerts",
  premium_request_approved: "premium",
  premium_request_rejected: "premium",
  transfert_envoye: "commission",
  transfert_recu: "commission",
  dossier_circuit: "commission",
  info: "system",
  success: "system",
  warning: "system",
};

/** Une notification ciblée vers UN utilisateur précis (recipientUid).
 *  Pour les broadcasts (ex. : tous les admins), on insère 1 doc par
 *  destinataire — c'est moins coûteux en règles de sécurité et plus
 *  simple à indexer (queries `where("recipientUid", "==", uid)`). */
export type AppNotification = {
  id: string;
  /** Destinataire nominatif. Vide quand la notification s'adresse a une
   *  commission plutot qu'a une personne (voir recipientCommission). */
  recipientUid: string;
  /** Destinataire collectif : le SLUG d'une commission. Tout compte rattache
   *  a cette commission la voit.
   *
   *  Pourquoi : un responsable de commission ne peut pas lire users/* — les
   *  regles le lui interdisent — donc il ne peut pas connaitre l'identifiant
   *  du responsable qu'il veut prevenir. Adresser la commission, et non la
   *  personne, resout le probleme et survit aux changements de responsable. */
  recipientCommission?: string;
  type: NotificationType;
  title: string;
  body: string;
  /** URL interne où mène le clic (ex: "/admin/premium/paiements"). */
  link?: string;
  /** Métadonnées libres (ex: { purchaseId, certId }). */
  meta?: Record<string, string | number | boolean>;
  read: boolean;
  readAt?: number;
  createdAt: number;
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

/** Photo de la galerie d'un article (affichee sous le texte). */
export type ArticleImage = {
  url: string;
  /** Legende facultative affichee sous la photo. */
  caption?: string;
};

/** Langues supportees pour un article multilingue. */
export type ArticleLang = "fr" | "ar" | "en" | "wo";

export const ARTICLE_LANGS: {
  id: ArticleLang;
  label: string;
  native: string;
  dir: "ltr" | "rtl";
}[] = [
  { id: "fr", label: "Francais", native: "Francais", dir: "ltr" },
  { id: "ar", label: "Arabe", native: "العربية", dir: "rtl" },
  { id: "en", label: "Anglais", native: "English", dir: "ltr" },
  { id: "wo", label: "Wolof", native: "Wolof", dir: "ltr" },
];

/** Contenu d'un article dans UNE langue donnee. */
export type ArticleTranslation = {
  title: string;
  excerpt: string;
  content: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  /** Photos supplementaires : galerie en bas d'article. */
  images?: ArticleImage[];
  status: ArticleStatus;
  publishedAt?: number;
  authorId: string;
  authorName?: string;
  createdAt: number;
  updatedAt: number;
  /** Langue des champs title/excerpt/content ci-dessus. Defaut "fr".
   *  Les anciens articles (sans ce champ) sont traites comme "fr". */
  primaryLang?: ArticleLang;
  /** Traductions additionnelles par langue (hors langue principale).
   *  Absent = article monolingue (comportement historique). */
  translations?: Partial<Record<ArticleLang, ArticleTranslation>>;
};

/** Renvoie la liste ordonnee des langues reellement disponibles pour un
 *  article : langue principale d'abord, puis traductions non vides. */
export function articleLangs(a: Pick<Article, "primaryLang" | "translations">): ArticleLang[] {
  const primary = a.primaryLang ?? "fr";
  const order: ArticleLang[] = ["fr", "ar", "en", "wo"];
  const has = (l: ArticleLang) => {
    if (l === primary) return true;
    const t = a.translations?.[l];
    return Boolean(t && (t.title?.trim() || t.content?.trim()));
  };
  return order.filter(has);
}

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
    "Frais d'inscription",
    "Cotisation annuelle",
    "Don général",
    "Don événement",
    "Vente / Boutique",
    "Subvention",
    // Un versement annule revient au compte principal : il faut une categorie
    // pour le dire, sinon la somme rentre sans qu'on sache d'ou.
    "Annulation de versement",
    "Autres recettes",
  ],
  expense: [
    "Événement / Gamou",
    // Somme remise a une commission pour qu'elle mene son travail. Elle sort
    // du compte principal — le Dahira n'en a qu'un.
    "Versement à une commission",
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
