import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
  limit,
  where,
  deleteField,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { createUserWithEmailAndPassword, signOut, deleteUser } from "firebase/auth";
import { getDb, getBucket, getSecondaryAuth } from "./firebase";
import {
  Article,
  AppUser,
  PremiumPurchase,
  PremiumPurchaseStatus,
  PremiumProductKey,
  PremiumUnlock,
  AppNotification,
  NotificationType,
  NotificationPreferences,
  NotificationChannel,
  NOTIFICATION_TYPE_CATEGORY,
  PREMIUM_PRODUCTS,
  FinanceEntry,
  GalleryItem,
  Member,
  MemberStatus,
  MenuItem,
  OfficialDocument,
  Order,
  OrderStatus,
  Permission,
  Product,
  SalaatuDuJour,
  SalaatuLibraryItem,
  Testimonial,
  UserRole,
} from "./admin-types";
import { SALAATU_FULL_SEED } from "./salaatu-full-seed";

// ============ GALLERY ============

export async function listGallery(): Promise<GalleryItem[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "gallery"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, "id">) }));
}

export async function uploadGalleryImage(
  file: File,
  meta: {
    alt: string;
    category: GalleryItem["category"];
    createdBy: string;
    year?: string;
  }
): Promise<GalleryItem> {
  const bucket = getBucket();
  const path = `gallery/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const r = ref(bucket, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  const db = getDb();
  const data: Record<string, unknown> = {
    src: url,
    alt: meta.alt,
    category: meta.category,
    storagePath: path,
    createdAt: Date.now(),
    createdBy: meta.createdBy,
  };
  if (meta.year) data.year = meta.year;
  const docRef = await addDoc(collection(db, "gallery"), data);
  return {
    id: docRef.id,
    src: url,
    alt: meta.alt,
    category: meta.category,
    year: meta.year,
    storagePath: path,
    createdAt: Date.now(),
    createdBy: meta.createdBy,
  };
}

export async function updateGalleryItem(
  id: string,
  patch: Partial<Pick<GalleryItem, "alt" | "category" | "year">>
) {
  const db = getDb();
  await updateDoc(doc(db, "gallery", id), patch);
}

export async function deleteGalleryItem(item: GalleryItem) {
  const db = getDb();
  if (item.storagePath) {
    try {
      await deleteObject(ref(getBucket(), item.storagePath));
    } catch {
      // ignore — fichier déjà supprimé
    }
  }
  await deleteDoc(doc(db, "gallery", item.id));
}

// ============ MÉDIAS DU CHALLENGE (annonces / Jour J) ============

export type ChallengeMedia = {
  id: string;
  type: "annonce" | "jourj";
  src: string;
  storagePath: string;
  comment: string;
  createdAt: number;
  createdBy?: string;
};

export async function listChallengeMedia(): Promise<ChallengeMedia[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "challengeMedia"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ChallengeMedia, "id">),
  }));
}

export async function addChallengeMedia(
  file: File,
  meta: { type: ChallengeMedia["type"]; comment: string; createdBy: string }
): Promise<ChallengeMedia> {
  const bucket = getBucket();
  const path = `challenge/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const r = ref(bucket, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  const db = getDb();
  const data = {
    type: meta.type,
    src: url,
    storagePath: path,
    comment: meta.comment.trim(),
    createdAt: Date.now(),
    createdBy: meta.createdBy,
  };
  const docRef = await addDoc(collection(db, "challengeMedia"), data);
  return { id: docRef.id, ...data };
}

export async function deleteChallengeMedia(item: ChallengeMedia) {
  const db = getDb();
  if (item.storagePath) {
    try {
      await deleteObject(ref(getBucket(), item.storagePath));
    } catch {
      /* fichier déjà supprimé */
    }
  }
  await deleteDoc(doc(db, "challengeMedia", item.id));
}

// ============ ARTICLES ============

export async function listArticles(): Promise<Article[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "articles"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Article, "id">) }));
}

export async function getArticle(id: string): Promise<Article | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, "articles", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Article, "id">) };
}

export async function createArticle(
  data: Omit<Article, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const db = getDb();
  const now = Date.now();
  const docRef = await addDoc(collection(db, "articles"), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateArticle(id: string, patch: Partial<Article>) {
  const db = getDb();
  await updateDoc(doc(db, "articles", id), {
    ...patch,
    updatedAt: Date.now(),
  });
}

export async function deleteArticle(id: string) {
  const db = getDb();
  await deleteDoc(doc(db, "articles", id));
}

export async function uploadArticleImage(file: File): Promise<string> {
  const bucket = getBucket();
  const path = `articles/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const r = ref(bucket, path);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

export async function uploadArticleCover(file: File): Promise<string> {
  return uploadArticleImage(file);
}

// ============ SALAATU DU JOUR ============

export async function getSalaatuDuJour(): Promise<SalaatuDuJour | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, "salaatu", "today"));
  if (!snap.exists()) return null;
  return snap.data() as SalaatuDuJour;
}

export async function saveSalaatuDuJour(s: Omit<SalaatuDuJour, "lastUpdated">) {
  const db = getDb();
  await setDoc(doc(db, "salaatu", "today"), {
    ...s,
    lastUpdated: Date.now(),
  });
}

// ============ MENU ============

export async function listMenu(): Promise<MenuItem[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "menuItems"), orderBy("order", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MenuItem, "id">) }));
}

export async function createMenuItem(data: Omit<MenuItem, "id">): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, "menuItems"), data);
  return docRef.id;
}

export async function updateMenuItem(id: string, patch: Partial<MenuItem>) {
  const db = getDb();
  await updateDoc(doc(db, "menuItems", id), patch);
}

export async function deleteMenuItem(id: string) {
  const db = getDb();
  await deleteDoc(doc(db, "menuItems", id));
}

// ============ USERS ============

export async function listUsers(): Promise<AppUser[]> {
  const db = getDb();
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      email: data.email ?? "",
      displayName: data.displayName,
      role: (data.role as UserRole) ?? "commission",
      commission: data.commission,
      permissions: (data.permissions as Permission[]) ?? [],
      createdAt: data.createdAt,
    };
  });
}

export async function updateUserPermissions(
  uid: string,
  patch: { role?: UserRole; permissions?: Permission[]; commission?: string; displayName?: string }
) {
  const db = getDb();
  await updateDoc(doc(db, "users", uid), patch);
}

export async function createUserDoc(
  uid: string,
  data: { email: string; displayName?: string; role: UserRole; commission?: string; permissions: Permission[] }
) {
  const db = getDb();
  await setDoc(doc(db, "users", uid), { ...data, createdAt: serverTimestamp() });
}

export async function deleteUserDoc(uid: string) {
  const db = getDb();
  await deleteDoc(doc(db, "users", uid));
}

/** Cree un compte Firebase Auth + le doc Firestore en une seule operation,
 *  SANS deconnecter l'admin courant (utilise une instance Firebase secondaire).
 *  Retourne l'UID du nouveau user.
 *  Erreurs typiques :
 *    - "auth/email-already-in-use" : email deja pris
 *    - "auth/weak-password" : moins de 6 caracteres
 *    - "auth/invalid-email" : format invalide */
export async function createUserAccount(
  email: string,
  password: string,
  profile: {
    displayName?: string;
    role: UserRole;
    commission?: string;
    permissions: Permission[];
  }
): Promise<string> {
  const secondaryAuth = getSecondaryAuth();
  // 1) Cree le compte Auth via l'instance secondaire (n'affecte pas la session admin)
  const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  const uid = cred.user.uid;
  // 2) Cree le profil Firestore. Si l'ecriture echoue (ex. regles), on
  //    supprime le compte Auth orphelin pour permettre un nouvel essai avec
  //    le meme email (sinon "auth/email-already-in-use").
  try {
    await createUserDoc(uid, {
      email,
      displayName: profile.displayName,
      role: profile.role,
      commission: profile.commission,
      permissions: profile.permissions,
    });
  } catch (e) {
    try { await deleteUser(cred.user); } catch { /* compte deja parti / non supprimable */ }
    try { await signOut(secondaryAuth); } catch { /* ignore */ }
    throw e;
  }
  // 3) Sign-out de l'instance secondaire (l'instance principale reste connectee)
  await signOut(secondaryAuth);
  return uid;
}

// ============ MEMBERS ============

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== "") out[k] = v;
  }
  return out as T;
}

function padMatricule(n: number): string {
  return "KSN-" + String(n).padStart(4, "0");
}

export async function nextMatricule(): Promise<string> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "members"), orderBy("matricule", "desc"), limit(1))
  );
  if (snap.empty) return padMatricule(1);
  const top = snap.docs[0].data() as Member;
  const raw = (top.matricule ?? "").replace(/\D/g, "");
  const n = parseInt(raw || "0", 10);
  return padMatricule(Number.isFinite(n) ? n + 1 : 1);
}

export async function listMembers(): Promise<Member[]> {
  const db = getDb();
  // PAS d'orderBy sur `matricule`.
  //
  // Firestore EXCLUT d'une requête triée tout document auquel le champ de tri
  // manque. Un membre saisi sans matricule — ou importé d'ailleurs — n'était
  // donc pas « mal classé » : il n'existait pas. Silencieusement, sans erreur,
  // partout où cette fonction sert : l'annuaire, le tableau de bord, le choix
  // du bénéficiaire d'une aide, et jusqu'à la détection des doublons, qui
  // laissait passer les doublons qu'elle ne voyait pas.
  //
  // Le tri se fait donc en mémoire, et les membres sans matricule ferment la
  // marche au lieu de disparaître.
  const snap = await getDocs(collection(db, "members"));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Member, "id">) }))
    .sort((a, b) => {
      const ma = (a.matricule ?? "").trim();
      const mb = (b.matricule ?? "").trim();
      if (!ma && !mb) return `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`, "fr");
      if (!ma) return 1;
      if (!mb) return -1;
      return ma.localeCompare(mb, "fr", { numeric: true });
    });
}

export async function getMember(id: string): Promise<Member | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, "members", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Member, "id">) };
}

export async function getMemberByMatricule(matricule: string): Promise<Member | null> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "members"), where("matricule", "==", matricule.trim()), limit(1))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Member, "id">) };
}

// ─── Cartes publiques (vérification QR) ────────────────────────────────────
// Collection publique exposant UNIQUEMENT les champs nécessaires à la
// vérification d'une carte de membre : aucun email, téléphone, adresse, etc.
// Permet de verrouiller la collection `members` (données privées) tout en
// gardant la vérification publique fonctionnelle.
export type PublicCard = {
  matricule: string;
  prenom: string;
  nom: string;
  status: MemberStatus;
  photo?: string;
  region?: string;
  ville?: string;
  createdAt: number;
};

/** Écrit/maj la carte publique d'un membre actif (clé = matricule).
 *  Ne fait rien pour les membres "en_attente"/sans matricule réel. */
export async function syncPublicCard(member: Partial<Member>): Promise<void> {
  const matricule = member.matricule?.trim();
  if (!matricule || matricule === "PENDING" || member.status !== "actif") return;
  const db = getDb();
  const card = stripUndefined({
    matricule,
    prenom: member.prenom ?? "",
    nom: member.nom ?? "",
    status: member.status,
    photo: member.photo,
    region: member.region,
    ville: member.ville,
    createdAt: member.createdAt ?? Date.now(),
  });
  await setDoc(doc(db, "publicCards", matricule), card, { merge: true });
}

/** Lecture publique d'une carte par matricule (utilisée par /verifier-carte). */
export async function getPublicCardByMatricule(
  matricule: string
): Promise<PublicCard | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, "publicCards", matricule.trim()));
  if (!snap.exists()) return null;
  return snap.data() as PublicCard;
}

/** Backfill : génère les cartes publiques manquantes pour tous les membres
 *  actifs. À appeler depuis l'espace admin (lecture members = admin). */
export async function backfillPublicCards(): Promise<number> {
  const members = await listMembers();
  let count = 0;
  for (const m of members) {
    if (m.status === "actif" && m.matricule && m.matricule !== "PENDING") {
      await syncPublicCard(m);
      count++;
    }
  }
  return count;
}

/** Migrates all members with purely numeric matricules to KSN- prefixed matricules.
 * Also deletes the old publicCard and creates a new one, and updates associated finances. */
export async function migratePreviousMatricules(): Promise<number> {
  const db = getDb();
  const members = await listMembers();
  let count = 0;
  for (const m of members) {
    const matricule = (m.matricule ?? "").trim();
    if (matricule && /^\d+$/.test(matricule) && matricule !== "PENDING") {
      const oldMatricule = matricule;
      const n = parseInt(oldMatricule, 10);
      if (!Number.isFinite(n)) continue;
      const newMatricule = padMatricule(n);

      // 1. Update the member document
      await updateDoc(doc(db, "members", m.id), { matricule: newMatricule });

      // 2. Delete old public card if it exists
      await deleteDoc(doc(db, "publicCards", oldMatricule));

      // 3. Write new public card
      const updatedMember = { ...m, matricule: newMatricule };
      await syncPublicCard(updatedMember);

      // 4. Update associated finances
      const snapFinances = await getDocs(
        query(collection(db, "finances"), where("memberMatricule", "==", oldMatricule))
      );
      for (const fDoc of snapFinances.docs) {
        await updateDoc(doc(db, "finances", fDoc.id), { memberMatricule: newMatricule });
      }

      count++;
    }
  }
  return count;
}


function normalizePhone(p?: string): string {
  return (p ?? "").replace(/\D+/g, "");
}

/** Throws if another member already uses the same email or telephone. */
export async function assertNoDuplicateMember(args: {
  email?: string;
  telephone?: string;
  excludeId?: string;
}): Promise<void> {
  const db = getDb();
  const email = args.email?.trim().toLowerCase();
  const phone = normalizePhone(args.telephone);

  if (email) {
    const snap = await getDocs(
      query(collection(db, "members"), where("email", "==", email), limit(2))
    );
    const dup = snap.docs.find((d) => d.id !== args.excludeId);
    if (dup) throw new Error("Cette adresse email est déjà utilisée par un autre membre.");
  }
  if (phone) {
    const snap = await getDocs(
      query(collection(db, "members"), where("telephoneNormalized", "==", phone), limit(2))
    );
    const dup = snap.docs.find((d) => d.id !== args.excludeId);
    if (dup) throw new Error("Ce numéro de téléphone est déjà utilisé par un autre membre.");
  }
}

export async function createMember(
  data: Omit<Member, "id" | "matricule" | "createdAt"> & {
    matricule?: string;
  },
  opts?: { skipContactDuplicateCheck?: boolean }
): Promise<Member> {
  const db = getDb();
  // Duplicate guard — désactivé pour les imports en masse (cartes de membre),
  // où l'identité fiable est le matricule/sourceUid et où des proches peuvent
  // légitimement partager un même numéro de téléphone.
  if (!opts?.skipContactDuplicateCheck) {
    await assertNoDuplicateMember({
      email: data.email,
      telephone: data.telephone,
    });
  }
  // Only "actif" members get a real matricule. "en_attente" placeholders
  // are tagged with "PENDING" so they don't burn a sequence number until
  // the admin validates them.
  const isPending = data.status === "en_attente";
  const matricule = data.matricule || (isPending ? "PENDING" : await nextMatricule());
  const payload = stripUndefined({
    ...data,
    matricule,
    telephoneNormalized: normalizePhone(data.telephone),
    emailLower: data.email?.trim().toLowerCase(),
    createdAt: Date.now(),
    joinedAt: data.joinedAt ?? Date.now(),
    status: data.status ?? ("actif" as const),
  });
  const docRef = await addDoc(collection(db, "members"), payload);
  const created = { id: docRef.id, ...(payload as Omit<Member, "id">) };
  try { await syncPublicCard(created); } catch { /* non bloquant */ }
  return created;
}

/** Promotes an en_attente member to actif and assigns a real matricule. */
export async function validateMember(id: string): Promise<string> {
  const db = getDb();
  const matricule = await nextMatricule();
  await updateDoc(doc(db, "members", id), {
    status: "actif",
    matricule,
    validatedAt: Date.now(),
  });
  try {
    const snap = await getDoc(doc(db, "members", id));
    if (snap.exists()) await syncPublicCard({ id, ...(snap.data() as Omit<Member, "id">) });
  } catch { /* non bloquant */ }
  return matricule;
}

/**
 * Self-activation after a member declares they paid the Wave cotisation.
 * Optimistically promotes them to actif + generates a matricule. The
 * Firestore rule must allow the row owner to flip status en_attente → actif
 * for themselves. Admin reconciliation happens after via the Wave merchant
 * dashboard.
 */
export async function selfActivateMember(id: string): Promise<string> {
  const db = getDb();
  const matricule = await nextMatricule();
  await updateDoc(doc(db, "members", id), {
    status: "actif",
    matricule,
    selfActivatedAt: Date.now(),
    paymentClaimed: true,
  });
  try {
    const snap = await getDoc(doc(db, "members", id));
    if (snap.exists()) await syncPublicCard({ id, ...(snap.data() as Omit<Member, "id">) });
  } catch { /* non bloquant */ }
  return matricule;
}

export async function updateMember(id: string, patch: Partial<Member>) {
  const db = getDb();
  if (patch.email || patch.telephone) {
    await assertNoDuplicateMember({
      email: patch.email,
      telephone: patch.telephone,
      excludeId: id,
    });
  }
  const finalPatch: Record<string, unknown> = stripUndefined({ ...patch });
  if (patch.telephone !== undefined) {
    finalPatch.telephoneNormalized = normalizePhone(patch.telephone);
  }
  if (patch.email !== undefined) {
    finalPatch.emailLower = patch.email?.trim().toLowerCase();
  }
  await updateDoc(doc(db, "members", id), finalPatch);
  // Resync la carte publique (nom, photo, statut, région... peuvent changer)
  try {
    const snap = await getDoc(doc(db, "members", id));
    if (snap.exists()) await syncPublicCard({ id, ...(snap.data() as Omit<Member, "id">) });
  } catch { /* non bloquant */ }
}

export async function deleteMember(member: Member) {
  const db = getDb();
  if (member.photoPath) {
    try {
      await deleteObject(ref(getBucket(), member.photoPath));
    } catch {
      // ignore — photo déjà supprimée
    }
  }
  await deleteDoc(doc(db, "members", member.id));
  // Supprime aussi la carte publique associée
  if (member.matricule && member.matricule !== "PENDING") {
    try { await deleteDoc(doc(db, "publicCards", member.matricule)); } catch { /* ignore */ }
  }
}

/** Supprime TOUS les membres (et leurs cartes publiques). Destructif :
 *  à n'utiliser que pour un ré-import complet. Retourne le nombre supprimé. */
export async function deleteAllMembers(): Promise<number> {
  const members = await listMembers();
  let n = 0;
  for (const m of members) {
    await deleteMember(m);
    n++;
  }
  return n;
}

export async function uploadMemberPhoto(file: File): Promise<{
  url: string;
  path: string;
}> {
  const bucket = getBucket();
  const path = `members/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const r = ref(bucket, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  return { url, path };
}

/** Upload photo de profil pour un compte SITE (≠ photo carte membre).
 *  Stocke dans users/{uid}.photoURL — totalement optionnel. */
export async function uploadUserProfilePhoto(
  userId: string,
  file: File
): Promise<{ url: string; storagePath: string }> {
  const bucket = getBucket();
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-").slice(0, 50);
  const path = `users_profile/${userId}/${Date.now()}-${safe}`;
  const r = ref(bucket, path);
  await uploadBytes(r, file, { contentType: file.type || "image/jpeg" });
  const url = await getDownloadURL(r);

  // Récupère l'éventuelle ancienne photo pour la supprimer du Storage.
  const db = getDb();
  const snap = await getDoc(doc(db, "users", userId));
  if (snap.exists()) {
    const old = (snap.data() as { photoStoragePath?: string }).photoStoragePath;
    if (old && old !== path) {
      await deleteObject(ref(bucket, old)).catch(() => undefined);
    }
  }
  await updateDoc(doc(db, "users", userId), {
    photoURL: url,
    photoStoragePath: path,
    updatedAt: Date.now(),
  });
  return { url, storagePath: path };
}

/** Supprime la photo de profil d'un compte site. */
export async function removeUserProfilePhoto(userId: string): Promise<void> {
  const db = getDb();
  const snap = await getDoc(doc(db, "users", userId));
  if (!snap.exists()) return;
  const old = (snap.data() as { photoStoragePath?: string }).photoStoragePath;
  if (old) {
    const bucket = getBucket();
    await deleteObject(ref(bucket, old)).catch(() => undefined);
  }
  await updateDoc(doc(db, "users", userId), {
    photoURL: deleteField(),
    photoStoragePath: deleteField(),
    updatedAt: Date.now(),
  });
}

export type ImportMember = {
  sourceUid?: string;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  profession?: string;
  region?: string;
  ville?: string;
  pays?: string;
  domicile?: string;
  dateNaissance?: string;
  photo?: string;
  matricule?: string;
};

export type ImportReport = {
  inserted: number;
  skipped: number;
  errors: string[];
};

// ============ SALAATU LIBRARY ============

export async function listSalaatuLibrary(): Promise<SalaatuLibraryItem[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "salaatuLibrary"), orderBy("order", "asc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SalaatuLibraryItem, "id">),
  }));
}

export async function getSalaatuLibraryItem(
  id: string
): Promise<SalaatuLibraryItem | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, "salaatuLibrary", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<SalaatuLibraryItem, "id">) };
}

export async function createSalaatuLibraryItem(
  data: Omit<SalaatuLibraryItem, "id" | "createdAt">
): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, "salaatuLibrary"), {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateSalaatuLibraryItem(
  id: string,
  patch: Partial<SalaatuLibraryItem>
) {
  const db = getDb();
  await updateDoc(doc(db, "salaatuLibrary", id), patch);
}

export async function deleteSalaatuLibraryItem(id: string) {
  const db = getDb();
  await deleteDoc(doc(db, "salaatuLibrary", id));
}

// ============ FINANCES ============

export async function listFinanceEntries(): Promise<FinanceEntry[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "finances"), orderBy("date", "desc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<FinanceEntry, "id">),
  }));
}

export async function createFinanceEntry(
  data: Omit<FinanceEntry, "id" | "recordedAt">
): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, "finances"), {
    ...data,
    recordedAt: Date.now(),
  });
  return docRef.id;
}

export async function updateFinanceEntry(
  id: string,
  patch: Partial<FinanceEntry>
) {
  const db = getDb();
  await updateDoc(doc(db, "finances", id), patch);
}

export async function deleteFinanceEntry(id: string) {
  const db = getDb();
  await deleteDoc(doc(db, "finances", id));
}

export function financeStats(entries: FinanceEntry[]) {
  let totalIncome = 0;
  let totalExpense = 0;
  for (const e of entries) {
    if (e.type === "income") totalIncome += e.amount;
    else totalExpense += e.amount;
  }
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    count: entries.length,
  };
}

// ============ BOUTIQUE — PRODUCTS ============

export async function listProducts(opts?: {
  onlyVisible?: boolean;
}): Promise<Product[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "products"), orderBy("createdAt", "desc"))
  );
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Product, "id">),
  }));
  if (opts?.onlyVisible) return items.filter((p) => p.visible !== false);
  return items;
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt">
): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, "products"), {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, patch: Partial<Product>) {
  const db = getDb();
  await updateDoc(doc(db, "products", id), patch);
}

export async function deleteProduct(p: Product) {
  const db = getDb();
  if (p.imagePath) {
    try {
      await deleteObject(ref(getBucket(), p.imagePath));
    } catch {}
  }
  await deleteDoc(doc(db, "products", p.id));
}

export async function uploadProductImage(file: File): Promise<{
  url: string;
  path: string;
}> {
  const bucket = getBucket();
  const path = `products/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const r = ref(bucket, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  return { url, path };
}

// ============ BOUTIQUE — ORDERS ============

export async function listOrders(): Promise<Order[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "orders"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Order, "id">),
  }));
}

export async function createOrder(
  data: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }
): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, "orders"), {
    ...data,
    status: data.status ?? "pending",
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const db = getDb();
  await updateDoc(doc(db, "orders", id), { status });
}

// ============ MEMBERS IMPORT ============

export async function importMembersFromJson(
  raw: ImportMember[],
  createdBy: string
): Promise<ImportReport> {
  const report: ImportReport = { inserted: 0, skipped: 0, errors: [] };
  const existing = await listMembers();
  const existingByKey = new Set<string>();
  for (const m of existing) {
    if (m.sourceUid) existingByKey.add(`uid:${m.sourceUid}`);
    if (m.email) existingByKey.add(`email:${m.email.toLowerCase()}`);
    if (m.telephone) existingByKey.add(`tel:${m.telephone.replace(/\D+/g, "")}`);
    // Garde-fou matricule : jamais deux membres avec le même matricule.
    if (m.matricule && m.matricule !== "PENDING") {
      const cleanMatStr = m.matricule.replace(/\D/g, "");
      if (cleanMatStr) existingByKey.add(`mat:${parseInt(cleanMatStr, 10)}`);
    }
  }

  // Find current highest matricule so we keep numbering sequential.
  const nextRaw = (await nextMatricule()).replace(/\D/g, "");
  let next = parseInt(nextRaw || "1", 10);

  for (const r of raw) {
    const sourceKey = r.sourceUid ? `uid:${r.sourceUid}` : null;
    const emailKey = r.email ? `email:${r.email.toLowerCase()}` : null;
    const telKey = r.telephone
      ? `tel:${r.telephone.replace(/\D+/g, "")}`
      : null;
    // Matricule fourni déjà pris → on n'écrase jamais (anti-doublon strict).
    const cleanRMatStr = r.matricule ? r.matricule.replace(/\D/g, "") : "";
    const matKey = cleanRMatStr ? `mat:${parseInt(cleanRMatStr, 10)}` : null;
    // Identité explicite = matricule ou sourceUid. Si elle existe, le téléphone
    // n'est PAS un critère de doublon (familles partageant un numéro).
    const hasExplicitId = Boolean(matKey || sourceKey);
    if (matKey && existingByKey.has(matKey)) {
      report.skipped++;
      report.errors.push(`Matricule ${r.matricule} déjà présent — ignoré.`);
      continue;
    }
    if (
      (sourceKey && existingByKey.has(sourceKey)) ||
      (emailKey && existingByKey.has(emailKey)) ||
      (!hasExplicitId && telKey && existingByKey.has(telKey))
    ) {
      report.skipped++;
      continue;
    }
    if (!r.prenom && !r.nom) {
      report.errors.push(
        `Membre ignoré: prénom et nom vides (sourceUid=${r.sourceUid ?? "?"})`
      );
      continue;
    }
    try {
      const matricule = r.matricule || padMatricule(next++);
      await createMember({
        matricule,
        prenom: r.prenom ?? "",
        nom: r.nom ?? "",
        email: r.email,
        telephone: r.telephone,
        profession: r.profession,
        region: r.region,
        ville: r.ville,
        pays: r.pays,
        domicile: r.domicile,
        dateNaissance: r.dateNaissance,
        photo: r.photo,
        sourceUid: r.sourceUid,
        status: "actif",
        createdBy,
      }, { skipContactDuplicateCheck: true });
      report.inserted++;
      if (sourceKey) existingByKey.add(sourceKey);
      if (emailKey) existingByKey.add(emailKey);
      if (telKey) existingByKey.add(telKey);
      const cleanNewMatStr = matricule.replace(/\D/g, "");
      if (cleanNewMatStr) existingByKey.add(`mat:${parseInt(cleanNewMatStr, 10)}`);
    } catch (e) {
      report.errors.push(
        e instanceof Error ? e.message : "Erreur inconnue à l'import"
      );
    }
  }

  return report;
}

/** Réparation en masse : recopie `domicile` → `ville` pour les membres dont la
 *  ville est vide (cas des cartes PDF importées avec la localité dans domicile).
 *  Idempotent : ne touche que les fiches où ville est absente. */
export async function backfillVilleFromDomicile(): Promise<{ updated: number; skipped: number }> {
  const members = await listMembers();
  let updated = 0;
  let skipped = 0;
  for (const m of members) {
    const ville = (m.ville ?? "").trim();
    const domicile = (m.domicile ?? "").trim();
    if (!ville && domicile) {
      await updateMember(m.id, { ville: domicile });
      updated++;
    } else {
      skipped++;
    }
  }
  return { updated, skipped };
}

export async function importSalaatuFullLibrary(): Promise<void> {
  const db = getDb();
  const colRef = collection(db, "salaatuLibrary");
  const existing = await listSalaatuLibrary();

  for (const s of SALAATU_FULL_SEED) {
    if (existing.some((e) => e.title === s.title)) continue;
    await addDoc(colRef, {
      ...s,
      createdAt: Date.now(),
    });
  }
}

export async function checkMemberEmailExists(email: string): Promise<boolean> {
  const db = getDb();
  const q = query(
    collection(db, "members"),
    where("email", "==", email),
    limit(1)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function checkDuplicateEmailOrPhone(
  email?: string,
  telephone?: string,
  excludeMemberId?: string
): Promise<{ emailDuplicate: boolean; phoneDuplicate: boolean }> {
  const members = await listMembers();
  
  const targetEmail = email ? email.toLowerCase().trim() : "";
  const targetPhone = telephone ? telephone.replace(/\D+/g, "") : "";
  
  let emailDuplicate = false;
  let phoneDuplicate = false;
  
  for (const m of members) {
    if (excludeMemberId && m.id === excludeMemberId) continue;
    
    if (targetEmail && m.email && m.email.toLowerCase().trim() === targetEmail) {
      emailDuplicate = true;
    }
    
    if (targetPhone && m.telephone && m.telephone.replace(/\D+/g, "") === targetPhone) {
      phoneDuplicate = true;
    }
  }
  
  return { emailDuplicate, phoneDuplicate };
}

export async function getStreamingLink(): Promise<string> {
  const db = getDb();
  try {
    const snap = await getDoc(doc(db, "config", "streaming"));
    if (snap.exists()) {
      return snap.data().url || "";
    }
  } catch (err) {
    console.error("Error reading streaming link:", err);
  }
  return "";
}

export async function saveStreamingLink(url: string): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, "config", "streaming"), {
    url,
    updatedAt: Date.now(),
  });
}

export type YoutubeLink = {
  id: string;
  url: string;
  title: string;
  year?: string;
  createdAt: number;
};

export async function listYoutubeLinks(): Promise<YoutubeLink[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "youtube_links"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<YoutubeLink, "id">) }));
}

export async function addYoutubeLink(url: string, title: string, year?: string): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, "youtube_links"), {
    url,
    title,
    year: year || null,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function deleteYoutubeLink(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "youtube_links", id));
}

// ============ PARAMETRES JOURNEE SALAATU ============

export type JourneeSettings = {
  /** Date ISO complete de l'evenement (ex: "2026-12-26T08:00:00.000Z") */
  dateIso: string;
  /** Libelle affichable de la date (ex: "26 décembre 2026") */
  label: string;
  /** Lieu (par defaut "Touba, Sénégal") */
  location?: string;
  updatedAt?: number;
};

/** Recupere la date de la prochaine Journee depuis Firestore.
 *  Retourne null si non defini -> les composants utilisent leur fallback. */
export async function getJourneeSettings(): Promise<JourneeSettings | null> {
  const db = getDb();
  try {
    const snap = await getDoc(doc(db, "settings", "journee"));
    if (!snap.exists()) return null;
    const data = snap.data();
    if (!data.dateIso || !data.label) return null;
    return {
      dateIso: data.dateIso,
      label: data.label,
      location: data.location,
      updatedAt: data.updatedAt,
    };
  } catch (err) {
    console.error("Error reading journee settings:", err);
    return null;
  }
}

export async function saveJourneeSettings(settings: JourneeSettings): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, "settings", "journee"), {
    ...settings,
    updatedAt: Date.now(),
  });
}

// ============ TEMOIGNAGES ============

/** Liste tous les temoignages, tries par order croissant.
 *  Le public Temoignages.tsx filtre les non-visibles cote client. */
export async function listTestimonials(): Promise<Testimonial[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "testimonials"), orderBy("order", "asc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Testimonial, "id">),
  }));
}

export async function createTestimonial(
  data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, "testimonials"), {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Omit<Testimonial, "id" | "createdAt">>
): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, "testimonials", id), {
    ...patch,
    updatedAt: Date.now(),
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "testimonials", id));
}

// ============ DOCUMENTS OFFICIELS ============

/** Liste tous les documents officiels, tries par order. */
export async function listOfficialDocuments(): Promise<OfficialDocument[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "documents"), orderBy("order", "asc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<OfficialDocument, "id">),
  }));
}

/** Upload un PDF dans Firebase Storage + cree le doc Firestore.
 *  Path Storage : documents/{timestamp}-{filename-sanitized} */
export async function uploadOfficialDocument(
  file: File,
  meta: {
    title: string;
    description: string;
    order: number;
    createdBy: string;
  }
): Promise<OfficialDocument> {
  const bucket = getBucket();
  const safeName = file.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "_");
  const path = `documents/${Date.now()}-${safeName}`;
  const r = ref(bucket, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  const db = getDb();
  const data = {
    title: meta.title,
    description: meta.description,
    url,
    storagePath: path,
    filename: file.name,
    sizeBytes: file.size,
    mimeType: file.type || "application/octet-stream",
    order: meta.order,
    visible: true,
    createdAt: Date.now(),
    createdBy: meta.createdBy,
  };
  const docRef = await addDoc(collection(db, "documents"), data);
  return { id: docRef.id, ...data };
}

export async function updateOfficialDocument(
  id: string,
  patch: Partial<Pick<OfficialDocument, "title" | "description" | "order" | "visible">>
): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, "documents", id), {
    ...patch,
    updatedAt: Date.now(),
  });
}

export async function deleteOfficialDocument(item: OfficialDocument): Promise<void> {
  const db = getDb();
  if (item.storagePath) {
    try {
      await deleteObject(ref(getBucket(), item.storagePath));
    } catch {
      // ignore — fichier deja supprime
    }
  }
  await deleteDoc(doc(db, "documents", item.id));
}

/** Nettoie recursivement les valeurs undefined avant un updateDoc().
 *  Different de stripUndefined() (line 279) qui est shallow et strip
 *  aussi les chaines vides : ici on est deep et on garde les "". */
function stripUndefinedDeep<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map((v) => stripUndefinedDeep(v)) as unknown as T;
  }
  if (typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (v === undefined) continue;
      out[k] = stripUndefinedDeep(v);
    }
    return out as T;
  }
  return obj;
}

// ============ NOTIFICATIONS — Centre in-app temps réel ============
//
// Architecture :
//  - 1 document = 1 destinataire (recipientUid)
//  - Pour un broadcast (ex: notifier tous les admins), on fan-out :
//    on liste les UIDs cibles et on crée N documents
//  - Le UI utilise onSnapshot sur where("recipientUid","==", myUid)
//    pour le temps réel (badge cloche, dropdown notifs)
// ─────────────────────────────────────────────────────────────────────

const NOTIF_COLLECTION = "notifications";

/** Récupère les préférences notifications d'un user (best-effort).
 *  Si non disponibles (règles, doc absent…), renvoie un objet vide
 *  ce qui équivaut à "tout activé" par défaut. */
async function getRecipientPreferences(
  uid: string
): Promise<NotificationPreferences> {
  try {
    const db = getDb();
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return {};
    const data = snap.data() as { notificationPreferences?: NotificationPreferences };
    return data.notificationPreferences || {};
  } catch {
    return {};
  }
}

/** Vrai si l'user accepte de recevoir ce type de notif sur ce canal.
 *  La règle est OPT-OUT : tout est activé sauf désactivation explicite. */
function shouldNotify(
  prefs: NotificationPreferences,
  type: NotificationType,
  channel: NotificationChannel
): boolean {
  // Canal explicitement désactivé ?
  if (prefs.channels?.[channel] === false) return false;
  // Catégorie explicitement désactivée ?
  const category = NOTIFICATION_TYPE_CATEGORY[type];
  if (category && prefs.categories?.[category] === false) return false;
  return true;
}

/** Met à jour les préférences notif du user courant. */
export async function updateNotificationPreferences(
  uid: string,
  prefs: NotificationPreferences
): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, "users", uid), {
    notificationPreferences: prefs,
    updatedAt: Date.now(),
  });
}

/** Insère une notification simple pour UN utilisateur — en respectant
 *  ses préférences. Si l'user a désactivé "inApp" pour cette catégorie,
 *  la notification N'EST PAS CRÉÉE. */
export async function createNotification(data: {
  recipientUid: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  meta?: Record<string, string | number | boolean>;
}): Promise<string | null> {
  // Vérifie les préférences in-app du destinataire
  const prefs = await getRecipientPreferences(data.recipientUid);
  if (!shouldNotify(prefs, data.type, "inApp")) {
    return null;
  }
  const db = getDb();
  const ref = await addDoc(
    collection(db, NOTIF_COLLECTION),
    stripUndefinedDeep({
      ...data,
      read: false,
      createdAt: Date.now(),
    })
  );
  return ref.id;
}

/** Notifie une COMMISSION plutot qu'une personne.
 *
 *  POURQUOI CE SECOND CHEMIN ?
 *  createNotification() a besoin de l'identifiant du destinataire, et de lire
 *  ses preferences. Or un responsable de commission n'a pas le droit de lire
 *  users/* : il ne peut donc ni connaitre l'uid de son homologue, ni consulter
 *  ses preferences. Adresser la commission — par son slug — leve les deux
 *  obstacles, et la notification survit au changement de responsable.
 *
 *  Ces messages sont operationnels (un versement attend un accuse de
 *  reception), pas promotionnels : ils ne passent pas par le filtre des
 *  preferences, qu'on ne pourrait de toute facon pas lire.
 */
export async function notifierCommission(data: {
  /** SLUG de la commission destinataire (cf. lib/commissions.ts). */
  commission: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  meta?: Record<string, string | number | boolean>;
}): Promise<string | null> {
  const { commission, ...reste } = data;
  if (!commission) return null;
  const db = getDb();
  const ref = await addDoc(
    collection(db, NOTIF_COLLECTION),
    stripUndefinedDeep({
      ...reste,
      recipientUid: "",
      recipientCommission: commission,
      read: false,
      createdAt: Date.now(),
    })
  );
  return ref.id;
}

/** Fan-out d'une notification vers tous les utilisateurs ayant une
 *  permission donnée (ex: notifier tous les "users.write" qu'une
 *  nouvelle demande premium est arrivée).
 *
 *  Best-effort : si l'utilisateur courant n'a pas le droit de lister
 *  les users (cas où c'est un user lambda qui poste une demande
 *  premium), on swallow l'erreur silencieusement — l'admin pourra
 *  toujours voir la demande dans son tableau de bord. La notif
 *  est une feature pour rendre le workflow plus rapide, pas une
 *  source de vérité. */
export async function broadcastNotificationToPerm(
  permission: string,
  data: Omit<Parameters<typeof createNotification>[0], "recipientUid">
): Promise<number> {
  try {
    const users = await listUsers();
    const recipients = users.filter(
      (u) =>
        u.role === "admin" ||
        (u.permissions && u.permissions.includes(permission as never))
    );
    await Promise.all(
      recipients.map((u) =>
        createNotification({ ...data, recipientUid: u.uid })
      )
    );
    return recipients.length;
  } catch {
    // Les règles peuvent refuser à un user lambda de lire users/*
    // → la notif admin ne sera pas fan-outée, c'est OK
    return 0;
  }
}

/** Liste les notifications du user (les + récentes en premier). */
export async function listMyNotifications(
  recipientUid: string,
  max = 30
): Promise<AppNotification[]> {
  const db = getDb();
  const snap = await getDocs(
    query(
      collection(db, NOTIF_COLLECTION),
      where("recipientUid", "==", recipientUid)
    )
  );
  const items = snap.docs.map(
    (d) =>
      ({ id: d.id, ...(d.data() as Omit<AppNotification, "id">) } as AppNotification)
  );
  items.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  return items.slice(0, max);
}

export async function markNotificationRead(id: string): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, NOTIF_COLLECTION, id), {
    read: true,
    readAt: Date.now(),
  });
}

export async function markAllNotificationsRead(
  recipientUid: string,
  /** Slug de la commission du compte, pour ne pas laisser derriere soi les
   *  notifications adressees a la commission (un versement a accuser). */
  recipientCommission?: string | null
): Promise<number> {
  const db = getDb();
  const lots = [
    query(
      collection(db, NOTIF_COLLECTION),
      where("recipientUid", "==", recipientUid),
      where("read", "==", false)
    ),
    ...(recipientCommission
      ? [
          query(
            collection(db, NOTIF_COLLECTION),
            where("recipientCommission", "==", recipientCommission),
            where("read", "==", false)
          ),
        ]
      : []),
  ];
  const snaps = await Promise.all(lots.map((q) => getDocs(q)));
  const docs = snaps.flatMap((s) => s.docs);
  await Promise.all(docs.map((d) => updateDoc(d.ref, { read: true, readAt: Date.now() })));
  return docs.length;
}

// ============ PREMIUM — Achats avec validation manuelle ============
//
// Architecture :
//  1. L'utilisateur (connecté) clique "Débloquer" sur la page premium
//  2. Il paye 1000 FCFA via Wave (lien externe)
//  3. Il revient sur le site et soumet une preuve (ID transaction)
//     → createPremiumPurchase() crée un doc status="pending_review"
//  4. Un admin avec permission "users.write" voit la demande dans
//     /admin/premium/paiements et clique Valider/Refuser
//  5. approvePremiumPurchase() écrit users/{uid}.premiumAccess.<key>
//     → l'utilisateur a accès à vie sur tous ses appareils
// ─────────────────────────────────────────────────────────────────────

const PREMIUM_COLLECTION = "premium_purchases";

export async function createPremiumPurchase(data: {
  userId: string;
  userEmail?: string;
  userPhone?: string;
  userDisplayName?: string;
  productKey: PremiumProductKey;
  amount: number;
  method: "wave" | "orange-money" | "manual";
  applicantTransactionRef?: string;
  applicantNote?: string;
}): Promise<string> {
  const db = getDb();
  // IMPORTANT : Firestore refuse les champs undefined. On strip avant addDoc
  // pour éviter les "Function addDoc() called with invalid data".
  const ref = await addDoc(
    collection(db, PREMIUM_COLLECTION),
    stripUndefinedDeep({
      ...data,
      status: "pending_review" as PremiumPurchaseStatus,
      createdAt: Date.now(),
    })
  );

  // ─── Notifications ─────────────────────────────────────────────────
  const productLabel =
    PREMIUM_PRODUCTS[data.productKey]?.label || "Premium";
  const userName =
    data.userDisplayName || data.userEmail || data.userPhone || "Un utilisateur";

  // 1. Confirmation pour le user (le rassure que sa demande est bien partie)
  await createNotification({
    recipientUid: data.userId,
    type: "info",
    title: "Demande premium reçue",
    body: `Votre demande pour ${productLabel} est en attente de validation par la Commission KSN (sous 24h).`,
    link: "/premium/bibliotheque",
    meta: { purchaseId: ref.id, productKey: data.productKey },
  }).catch((e) => console.warn("notify user create-purchase failed", e));

  // 2. Broadcast aux admins (best-effort : si user lambda ne peut pas
  //    lister les users, on swallow)
  await broadcastNotificationToPerm("users.write", {
    type: "premium_request_new",
    title: "Nouveau paiement premium à valider",
    body: `${userName} a soumis une demande pour ${productLabel} (${data.amount.toLocaleString("fr-FR")} FCFA).`,
    link: "/admin/premium/paiements",
    meta: { purchaseId: ref.id, productKey: data.productKey },
  }).catch((e) => console.warn("notify admins create-purchase failed", e));

  return ref.id;
}

/** Liste TOUTES les commandes (filtre côté client par défaut, ou via status). */
export async function listPremiumPurchases(
  status?: PremiumPurchaseStatus
): Promise<PremiumPurchase[]> {
  const db = getDb();
  const snap = await getDocs(collection(db, PREMIUM_COLLECTION));
  const items = snap.docs.map(
    (d) =>
      ({ id: d.id, ...(d.data() as Omit<PremiumPurchase, "id">) } as PremiumPurchase)
  );
  const filtered = status ? items.filter((p) => p.status === status) : items;
  filtered.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  return filtered;
}

export async function listUserPremiumPurchases(
  userId: string
): Promise<PremiumPurchase[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, PREMIUM_COLLECTION), where("userId", "==", userId))
  );
  const items = snap.docs.map(
    (d) => ({ id: d.id, ...(d.data() as Omit<PremiumPurchase, "id">) } as PremiumPurchase)
  );
  items.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  return items;
}

export async function getPremiumPurchase(
  id: string
): Promise<PremiumPurchase | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, PREMIUM_COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<PremiumPurchase, "id">) };
}

/** Valide la commande + débloque la section premium chez l'utilisateur.
 *  Opération en deux écritures (Firestore n'a pas de transaction
 *  multi-document sans `runTransaction` ici — c'est acceptable au
 *  volume du KSN). */
export async function approvePremiumPurchase(
  purchaseId: string,
  reviewer: { uid: string; name: string },
  confirmedTransactionId: string,
  notes?: string
): Promise<void> {
  const purchase = await getPremiumPurchase(purchaseId);
  if (!purchase) throw new Error("Commande introuvable");
  if (purchase.status === "completed") return; // idempotent

  const db = getDb();
  const unlock: PremiumUnlock = {
    unlockedAt: Date.now(),
    purchaseId,
    amount: purchase.amount,
    transactionId: confirmedTransactionId,
  };
  // 1. Écriture sur users/{uid}.premiumAccess.<key>
  await updateDoc(doc(db, "users", purchase.userId), {
    [`premiumAccess.${purchase.productKey}`]: unlock,
    updatedAt: Date.now(),
  });
  // 2. Mise à jour du doc purchase
  await updateDoc(
    doc(db, PREMIUM_COLLECTION, purchaseId),
    stripUndefinedDeep({
      status: "completed" as PremiumPurchaseStatus,
      reviewerUid: reviewer.uid,
      reviewerName: reviewer.name,
      reviewerNotes: notes,
      confirmedTransactionId,
      reviewedAt: Date.now(),
    })
  );

  // 3. Notification au user
  const productLabel =
    PREMIUM_PRODUCTS[purchase.productKey]?.label || "Premium";
  await createNotification({
    recipientUid: purchase.userId,
    type: "premium_request_approved",
    title: `Macha'Allah, ${productLabel} débloqué !`,
    body: `Votre paiement a été validé par la Commission KSN. L'accès est ouvert à vie sur tous vos appareils.`,
    link:
      purchase.productKey === "salaatuLibrary"
        ? "/spiritualite#bibliotheque"
        : "/premium/bibliotheque",
    meta: { purchaseId, productKey: purchase.productKey },
  }).catch((e) => console.warn("notify approve failed", e));
}

export async function rejectPremiumPurchase(
  purchaseId: string,
  reviewer: { uid: string; name: string },
  notes: string
): Promise<void> {
  const purchase = await getPremiumPurchase(purchaseId);
  if (!purchase) throw new Error("Commande introuvable");

  const db = getDb();
  await updateDoc(
    doc(db, PREMIUM_COLLECTION, purchaseId),
    stripUndefinedDeep({
      status: "rejected" as PremiumPurchaseStatus,
      reviewerUid: reviewer.uid,
      reviewerName: reviewer.name,
      reviewerNotes: notes,
      reviewedAt: Date.now(),
    })
  );

  // Notification au user
  const productLabel =
    PREMIUM_PRODUCTS[purchase.productKey]?.label || "Premium";
  await createNotification({
    recipientUid: purchase.userId,
    type: "premium_request_rejected",
    title: `Demande ${productLabel} à revoir`,
    body: `Votre paiement n'a pas pu être validé. Note de la Commission : « ${notes} ». Vous pouvez reprendre.`,
    link: "/premium/bibliotheque",
    meta: { purchaseId, productKey: purchase.productKey },
  }).catch((e) => console.warn("notify reject failed", e));
}

