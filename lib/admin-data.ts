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
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getDb, getBucket, getSecondaryAuth } from "./firebase";
import {
  Article,
  AppUser,
  EducationLesson,
  EducationLessonAudio,
  EducationModule,
  EducationLanguage,
  EducationCertification,
  EducationCertificationStatus,
  FinanceEntry,
  GalleryItem,
  Member,
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

export async function uploadArticleCover(file: File): Promise<string> {
  const bucket = getBucket();
  const path = `articles/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const r = ref(bucket, path);
  await uploadBytes(r, file);
  return getDownloadURL(r);
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
  // 2) Cree le profil Firestore
  await createUserDoc(uid, {
    email,
    displayName: profile.displayName,
    role: profile.role,
    commission: profile.commission,
    permissions: profile.permissions,
  });
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
  return String(n).padStart(4, "0");
}

export async function nextMatricule(): Promise<string> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "members"), orderBy("matricule", "desc"), limit(1))
  );
  if (snap.empty) return padMatricule(1);
  const top = snap.docs[0].data() as Member;
  const n = parseInt(top.matricule ?? "0", 10);
  return padMatricule(Number.isFinite(n) ? n + 1 : 1);
}

export async function listMembers(): Promise<Member[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "members"), orderBy("matricule", "asc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Member, "id">),
  }));
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
  }
): Promise<Member> {
  const db = getDb();
  // Duplicate guard
  await assertNoDuplicateMember({
    email: data.email,
    telephone: data.telephone,
  });
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
  return { id: docRef.id, ...(payload as Omit<Member, "id">) };
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
  }

  // Find current highest matricule so we keep numbering sequential.
  let next = parseInt((await nextMatricule()).replace(/^0+/, "") || "1", 10);

  for (const r of raw) {
    const sourceKey = r.sourceUid ? `uid:${r.sourceUid}` : null;
    const emailKey = r.email ? `email:${r.email.toLowerCase()}` : null;
    const telKey = r.telephone
      ? `tel:${r.telephone.replace(/\D+/g, "")}`
      : null;
    if (
      (sourceKey && existingByKey.has(sourceKey)) ||
      (emailKey && existingByKey.has(emailKey)) ||
      (telKey && existingByKey.has(telKey))
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
      });
      report.inserted++;
      if (sourceKey) existingByKey.add(sourceKey);
      if (emailKey) existingByKey.add(emailKey);
      if (telKey) existingByKey.add(telKey);
    } catch (e) {
      report.errors.push(
        e instanceof Error ? e.message : "Erreur inconnue à l'import"
      );
    }
  }

  return report;
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

// ============ EDUCATION — MODULES ============

export async function listEducationModules(): Promise<EducationModule[]> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "education_modules"), orderBy("order", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EducationModule, "id">) }));
}

export async function getEducationModule(id: string): Promise<EducationModule | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, "education_modules", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<EducationModule, "id">) };
}

export async function createEducationModule(
  data: Omit<EducationModule, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const db = getDb();
  const ref = await addDoc(collection(db, "education_modules"), {
    ...data,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function updateEducationModule(
  id: string,
  patch: Partial<Omit<EducationModule, "id" | "createdAt">>
): Promise<void> {
  const db = getDb();
  await updateDoc(
    doc(db, "education_modules", id),
    stripUndefinedDeep({
      ...patch,
      updatedAt: Date.now(),
    })
  );
}

export async function deleteEducationModule(id: string): Promise<void> {
  const db = getDb();
  // Supprime aussi toutes les lecons du module
  const lessonsSnap = await getDocs(
    query(collection(db, "education_lessons"), where("moduleId", "==", id))
  );
  await Promise.all(lessonsSnap.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(doc(db, "education_modules", id));
}

// ============ EDUCATION — LECONS ============

export async function listEducationLessons(moduleId?: string): Promise<EducationLesson[]> {
  const db = getDb();
  // NB : on n'utilise pas orderBy dans la query Firestore lorsqu'il y a
  // un where(), car cela necessite un composite index. On trie cote
  // client, c'est largement assez rapide pour ~25 lecons.
  const baseQuery = moduleId
    ? query(collection(db, "education_lessons"), where("moduleId", "==", moduleId))
    : query(collection(db, "education_lessons"));
  const snap = await getDocs(baseQuery);
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<EducationLesson, "id">),
  }));
  items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return items;
}

export async function getEducationLesson(id: string): Promise<EducationLesson | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, "education_lessons", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<EducationLesson, "id">) };
}

export async function createEducationLesson(
  data: Omit<EducationLesson, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const db = getDb();
  const ref = await addDoc(collection(db, "education_lessons"), {
    ...data,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function updateEducationLesson(
  id: string,
  patch: Partial<Omit<EducationLesson, "id" | "createdAt">>
): Promise<void> {
  const db = getDb();
  await updateDoc(
    doc(db, "education_lessons", id),
    stripUndefinedDeep({
      ...patch,
      updatedAt: Date.now(),
    })
  );
}

export async function deleteEducationLesson(id: string): Promise<void> {
  const db = getDb();
  // Recupere la lecon pour supprimer aussi les audios Storage
  const snap = await getDoc(doc(db, "education_lessons", id));
  if (snap.exists()) {
    const lesson = snap.data() as EducationLesson;
    if (lesson.audio) {
      const paths = Object.values(lesson.audio)
        .map((a) => a?.storagePath)
        .filter(Boolean) as string[];
      await Promise.all(
        paths.map((p) =>
          deleteObject(ref(getBucket(), p)).catch(() => undefined)
        )
      );
    }
  }
  await deleteDoc(doc(db, "education_lessons", id));
}

/** Upload un buffer audio dans Storage + attache à la leçon Firestore. */
export async function attachLessonAudio(
  lessonId: string,
  language: EducationLanguage,
  audioBlob: Blob,
  meta: {
    contentHash: string;
    voiceId: string;
    provider: "google" | "edge" | "manual_upload";
    durationSec: number;
  }
): Promise<EducationLessonAudio> {
  const bucket = getBucket();
  const path = `education_audio/${lessonId}/${language}-${meta.contentHash.slice(0, 12)}.mp3`;
  const r = ref(bucket, path);
  await uploadBytes(r, audioBlob, { contentType: "audio/mpeg" });
  const url = await getDownloadURL(r);
  const audio: EducationLessonAudio = {
    url,
    storagePath: path,
    contentHash: meta.contentHash,
    voiceId: meta.voiceId,
    provider: meta.provider,
    durationSec: meta.durationSec,
    sizeBytes: audioBlob.size,
    generatedAt: Date.now(),
  };
  // Patch la leçon avec le nouvel audio (en supprimant l'ancien Storage)
  const lesson = await getEducationLesson(lessonId);
  if (lesson?.audio?.[language]?.storagePath
      && lesson.audio[language]?.storagePath !== path) {
    await deleteObject(ref(bucket, lesson.audio[language]!.storagePath)).catch(() => undefined);
  }
  const db = getDb();
  await updateDoc(doc(db, "education_lessons", lessonId), {
    [`audio.${language}`]: audio,
    updatedAt: Date.now(),
  });
  return audio;
}

/** Calcule un hash court d'un texte (pour cache invalidation). */
export async function computeContentHash(text: string): Promise<string> {
  // Utilise SubtleCrypto en navigateur
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Supprime un audio spécifique d'une leçon (Storage + maj Firestore). */
export async function deleteLessonAudio(
  lessonId: string,
  language: EducationLanguage
): Promise<void> {
  const lesson = await getEducationLesson(lessonId);
  if (!lesson || !lesson.audio?.[language]) return;

  const storagePath = lesson.audio[language]!.storagePath;
  if (storagePath) {
    const bucket = getBucket();
    await deleteObject(ref(bucket, storagePath)).catch(() => undefined);
  }

  const db = getDb();
  await updateDoc(doc(db, "education_lessons", lessonId), {
    [`audio.${language}`]: deleteField(),
    updatedAt: Date.now(),
  });
}

// ============ EDUCATION — ILLUSTRATIONS (images pédagogiques) ============

type LessonIllustration = NonNullable<
  EducationLesson["illustrations"]
>[number];

/** Upload une image illustrative dans Storage + push dans le tableau
 *  lesson.illustrations. */
export async function attachLessonIllustration(
  lessonId: string,
  file: File,
  meta?: { caption?: string; alt?: string }
): Promise<LessonIllustration> {
  const bucket = getBucket();
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .slice(0, 60);
  const path = `education_illustrations/${lessonId}/${Date.now()}-${safeName}`;
  const r = ref(bucket, path);
  await uploadBytes(r, file, { contentType: file.type || "image/jpeg" });
  const url = await getDownloadURL(r);

  const lesson = await getEducationLesson(lessonId);
  const existing = lesson?.illustrations || [];
  const newIllustration: LessonIllustration = {
    url,
    storagePath: path,
    caption: meta?.caption,
    alt: meta?.alt,
    order: existing.length,
  };

  const db = getDb();
  await updateDoc(
    doc(db, "education_lessons", lessonId),
    stripUndefinedDeep({
      illustrations: [...existing, newIllustration],
      updatedAt: Date.now(),
    })
  );

  return newIllustration;
}

/** Supprime une illustration (Storage + tableau Firestore). */
export async function deleteLessonIllustration(
  lessonId: string,
  storagePath: string
): Promise<void> {
  const lesson = await getEducationLesson(lessonId);
  if (!lesson?.illustrations) return;

  const bucket = getBucket();
  await deleteObject(ref(bucket, storagePath)).catch(() => undefined);

  const remaining = lesson.illustrations.filter(
    (i) => i.storagePath !== storagePath
  );
  const db = getDb();
  await updateDoc(doc(db, "education_lessons", lessonId), {
    illustrations: remaining.map((i, idx) => ({ ...i, order: idx })),
    updatedAt: Date.now(),
  });
}

/** Met à jour la légende et/ou alt d'une illustration. */
export async function updateLessonIllustration(
  lessonId: string,
  storagePath: string,
  patch: { caption?: string; alt?: string }
): Promise<void> {
  const lesson = await getEducationLesson(lessonId);
  if (!lesson?.illustrations) return;
  const updated = lesson.illustrations.map((i) =>
    i.storagePath === storagePath ? { ...i, ...patch } : i
  );
  const db = getDb();
  await updateDoc(
    doc(db, "education_lessons", lessonId),
    stripUndefinedDeep({
      illustrations: updated,
      updatedAt: Date.now(),
    })
  );
}

/** Réorganise (move up/down) les illustrations. */
export async function reorderLessonIllustration(
  lessonId: string,
  storagePath: string,
  direction: "up" | "down"
): Promise<void> {
  const lesson = await getEducationLesson(lessonId);
  if (!lesson?.illustrations) return;
  const arr = [...lesson.illustrations];
  const idx = arr.findIndex((i) => i.storagePath === storagePath);
  if (idx < 0) return;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= arr.length) return;
  [arr[idx], arr[swapWith]] = [arr[swapWith], arr[idx]];
  const reindexed = arr.map((i, n) => ({ ...i, order: n }));
  const db = getDb();
  await updateDoc(doc(db, "education_lessons", lessonId), {
    illustrations: reindexed,
    updatedAt: Date.now(),
  });
}

// ============ EDUCATION — FILL TAZAWWUD CONTENT ============

/** Remplit toutes les lecons du Tazawwud avec le contenu prepare
 *  (lib/education/tazawwud-content.ts). Match les lecons par leur
 *  champ "reference" (ex: "6.1"). Necessite que seedTazawwud() ait
 *  ete execute au prealable.
 *
 *  Retourne le nombre de lecons remplies. Si une lecon a deja du
 *  contenu, elle est ECRASEE (idempotent / utile pour reapplique
 *  des corrections).
 *
 *  Cette fonction NE MODIFIE PAS les audios existants (ils sont
 *  attaches au contentHash et seront simplement obsoletes). */
export async function fillTazawwudContent(opts?: {
  overrideExisting?: boolean;
}): Promise<{ filled: number; skipped: number; notFound: string[] }> {
  const override = opts?.overrideExisting ?? true;
  const { TAZAWWUD_CONTENT } = await import("./education/tazawwud-content");
  const allLessons = await listEducationLessons();
  const byRef = new Map(allLessons.map((l) => [l.reference, l]));

  let filled = 0;
  let skipped = 0;
  const notFound: string[] = [];

  for (const c of TAZAWWUD_CONTENT) {
    const lesson = byRef.get(c.reference);
    if (!lesson) {
      notFound.push(c.reference);
      continue;
    }
    const hasContent = Boolean(lesson.content?.fr?.trim());
    if (hasContent && !override) {
      skipped++;
      continue;
    }
    await updateEducationLesson(lesson.id, {
      titleArabic: c.titleArabic,
      intention: { ...lesson.intention, fr: c.intention },
      content: { ...lesson.content, fr: c.content },
      citation: c.citation
        ? {
            author: c.citation.author,
            sourceRef: c.citation.sourceRef,
            arabic: c.citation.arabic,
            translations: {
              ...lesson.citation?.translations,
              fr: c.citation.translationFr,
            },
          }
        : lesson.citation,
      application: { ...lesson.application, fr: c.application },
      reminder: { ...lesson.reminder, fr: c.reminder },
    });
    filled++;
  }

  return { filled, skipped, notFound };
}

// ============ EDUCATION — PUBLISH ALL ============

/** Passe TOUS les modules et leçons (ou seulement Tazawwud) en
 *  statut "published" en un clic. Pratique apres le premier seed
 *  + remplissage de contenu pour ouvrir au public d'un coup. */
export async function publishAllTazawwud(): Promise<{
  modules: number;
  lessons: number;
}> {
  const [modules, lessons] = await Promise.all([
    listEducationModules(),
    listEducationLessons(),
  ]);
  let modulesUpdated = 0;
  let lessonsUpdated = 0;

  for (const m of modules) {
    if (m.publishStatus !== "published") {
      await updateEducationModule(m.id, { publishStatus: "published" });
      modulesUpdated++;
    }
  }
  for (const l of lessons) {
    if (l.publishStatus !== "published") {
      await updateEducationLesson(l.id, {
        publishStatus: "published",
        publicAccess: true,
      });
      lessonsUpdated++;
    }
  }
  return { modules: modulesUpdated, lessons: lessonsUpdated };
}

// ============ EDUCATION — CERTIFICATIONS (validation orale) ============

/** Crée une demande de certification après que l'apprenant ait
 *  validé toutes les leçons du Tazawwud. Statut initial =
 *  "pending_review" — un membre de la Commission Éducation devra
 *  réaliser un entretien (physique ou téléphonique) avant de
 *  délivrer le certificat PDF. */
export async function createCertificationRequest(
  data: Omit<
    EducationCertification,
    "id" | "createdAt" | "updatedAt" | "status" | "validatedAt" | "certificateNumber"
  >
): Promise<string> {
  const db = getDb();
  const ref = await addDoc(collection(db, "educationCertifications"), {
    ...data,
    status: "pending_review" as EducationCertificationStatus,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function listCertifications(
  filterStatus?: EducationCertificationStatus
): Promise<EducationCertification[]> {
  const db = getDb();
  const snap = await getDocs(collection(db, "educationCertifications"));
  const items = snap.docs.map(
    (d) =>
      ({
        id: d.id,
        ...(d.data() as Omit<EducationCertification, "id">),
      } as EducationCertification)
  );
  const filtered = filterStatus
    ? items.filter((c) => c.status === filterStatus)
    : items;
  filtered.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  return filtered;
}

export async function getCertification(
  id: string
): Promise<EducationCertification | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, "educationCertifications", id));
  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...(snap.data() as Omit<EducationCertification, "id">),
  };
}

/** Marque une demande comme validée après entretien oral.
 *  Génère un numéro de certificat KSN-TZW-{YYYY}-{rand}. */
export async function approveCertification(
  id: string,
  examiner: { uid: string; name: string },
  oralExamDate: string,
  notes?: string
): Promise<string> {
  const certNumber = `KSN-TZW-${new Date().getFullYear()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
  const db = getDb();
  await updateDoc(
    doc(db, "educationCertifications", id),
    stripUndefinedDeep({
      status: "oral_passed" as EducationCertificationStatus,
      examinerUid: examiner.uid,
      examinerName: examiner.name,
      oralExamDate,
      examinerNotes: notes,
      certificateNumber: certNumber,
      validatedAt: Date.now(),
      updatedAt: Date.now(),
    })
  );
  return certNumber;
}

export async function rejectCertification(
  id: string,
  examiner: { uid: string; name: string },
  notes: string
): Promise<void> {
  const db = getDb();
  await updateDoc(
    doc(db, "educationCertifications", id),
    stripUndefinedDeep({
      status: "rejected" as EducationCertificationStatus,
      examinerUid: examiner.uid,
      examinerName: examiner.name,
      examinerNotes: notes,
      updatedAt: Date.now(),
    })
  );
}

export async function scheduleCertificationExam(
  id: string,
  oralExamDate: string,
  notes?: string
): Promise<void> {
  const db = getDb();
  await updateDoc(
    doc(db, "educationCertifications", id),
    stripUndefinedDeep({
      status: "scheduled" as EducationCertificationStatus,
      oralExamDate,
      examinerNotes: notes,
      updatedAt: Date.now(),
    })
  );
}

// ============ EDUCATION — SEED TAZAWWUD ============

/** Insère les 6 modules + 25 leçons skeletons du Tazawwud.
 *  À appeler une fois depuis l'admin si la base est vide. */
export async function seedTazawwud(): Promise<{ modules: number; lessons: number }> {
  const existing = await listEducationModules();
  if (existing.length > 0) {
    throw new Error("Des modules existent déjà — refusé pour éviter l'écrasement.");
  }

  const TAZAWWUD_SEED = [
    {
      slug: "fondements",
      titleFr: "Les Fondements de la Foi",
      titleArabic: "أصول الإيمان",
      iconKey: "seedling",
      lessons: [
        "Les piliers de l'Islam",
        "Les piliers de la foi",
        "La connaissance d'Allah",
        "La connaissance du Prophète ﷺ",
      ],
    },
    {
      slug: "tahara",
      titleFr: "La Purification",
      titleArabic: "الطهارة",
      iconKey: "water",
      lessons: [
        "Les types d'eau",
        "L'ablution (Wudu)",
        "La grande purification (Ghusl)",
        "Le tayammum",
      ],
    },
    {
      slug: "salat",
      titleFr: "La Prière",
      titleArabic: "الصلاة",
      iconKey: "prayer",
      lessons: [
        "Les 5 prières obligatoires (Farata)",
        "Conditions de validité",
        "Piliers et obligations (Wajibat)",
        "Actes recommandés (Sunna)",
        "Ce qui annule la prière",
      ],
    },
    {
      slug: "sawm-zakat-hajj",
      titleFr: "Jeûne, Zakat et Hajj",
      titleArabic: "الصوم والزكاة والحج",
      iconKey: "moon",
      lessons: [
        "Le jeûne (Sawm) — règles essentielles",
        "Ce qui rompt le jeûne",
        "La Zakat — obligations et bénéficiaires",
        "Le pèlerinage (Hajj) — vue d'ensemble",
      ],
    },
    {
      slug: "adab",
      titleFr: "Adab & Akhlaq",
      titleArabic: "الآداب والأخلاق",
      iconKey: "flower",
      lessons: [
        "Éthique au quotidien",
        "Comportements louables",
        "Comportements blâmables",
        "Le rapport aux parents et aux aînés",
      ],
    },
    {
      slug: "salaatu",
      titleFr: "La Salaatu sur le Prophète ﷺ",
      titleArabic: "الصلاة على النبي ﷺ",
      iconKey: "star",
      lessons: [
        "Le commandement divin (Coran 33:56)",
        "Les vertus de la Salaatu (10x récompense)",
        "Les formules enseignées par le Prophète ﷺ",
        "La pratique communautaire — le sens du Dahira KSN",
      ],
    },
  ];

  const DETAILED_LESSONS_SEEDS: Record<string, Partial<EducationLesson>> = {
    "1.1": {
      title: {
        fr: "Les piliers de l'Islam",
        wo: "Yoonu Lislaam (Pilier yi)",
      },
      intention: {
        fr: "Prendre conscience des cinq piliers qui soutiennent notre soumission et guident nos actions physiques au service du Créateur.",
        wo: "Xam li tegu yoonu Lislaam ngir dëgëral sunu ngëm ci sunu jëf.",
      },
      content: {
        fr: "L'Islam est fondé sur cinq piliers fondamentaux que chaque croyant doit accomplir pour consolider sa foi et sa soumission à Allah. Ces piliers sont :\n\n1. **La Profession de Foi (Chahada)** : Attester qu'il n'y a de divinité d'Allah et que Muhammad est Son messager.\n2. **La Prière (Salat)** : Accomplir les cinq prières quotidiennes.\n3. **L'Aumône Légale (Zakat)** : Purifier ses biens en donnant aux nécessiteux.\n4. **Le Jeûne (Sawm)** : Jeûner durant le mois béni de Ramadan.\n5. **Le Pèlerinage (Hajj)** : Se rendre à la Mecque une fois dans sa vie pour ceux qui en ont les moyens physiques et financiers.\n\nDans le *Tazawwudu-ss-Sighar*, Serigne Touba nous exhorte dès la jeunesse à accorder une importance capitale à l'apprentissage et à la pratique de ces cinq fondements.",
        wo: "Lislaam dafa tegu ci juróomi ponk yu mag:\n\n1. **Sereere si (Chahada)** : Sereere ne amul keneen ku fi yalla ku dul Allah te Muhammad mi ngi fi ab yonentam.\n2. **Julli gi (Salat)** : Di julli juróomi yoon bës bu ne.\n3. **Asaka ji (Zakat)** : Joxe asaka.\n4. **Koor gi (Sawm)** : Woor weeru Koor.\n5. **Aj gi (Hajj)** : Dem Aj Màkka ci ku ko man.\n\nSerigne Touba ci téereem *Tazawwudu-ss-Sighar* dafa ñuy sàkku ñu jox ponk yi cër bu mag ci sunu ndaw.",
      },
      citation: {
        author: "Le Prophète Muhammad ﷺ",
        sourceRef: "Hadith (Rapporté par Muslim)",
        arabic: "بُنِيَ الإسْلامُ علَى خَمْسٍ",
        translations: {
          fr: "L'Islam est bâti sur cinq [piliers].",
          wo: "Lislaam juróomi ponk la tegu.",
        },
      },
      application: {
        fr: "Passez en revue votre assiduité sur chacun de ces cinq piliers. Aujourd'hui, faites l'effort particulier de parfaire l'intention de vos prières.",
        wo: "Saytul say julli ak say ponk. Tey jéema rafatal say niia ci sa julli.",
      },
      reminder: {
        fr: "L'Islam est un édifice qui repose sur la mise en pratique harmonieuse de ses cinq piliers.",
        wo: "Lislaam tabax la buy tegu ci ponk yi ko dëgëral.",
      },
      quiz: {
        questions: [
          {
            id: "1.1-q1",
            question: {
              fr: "Combien y a-t-il de piliers de l'Islam ?",
              wo: "Ñata ponki Lislaam lañu ?",
            },
            options: [
              { id: "A", text: { fr: "3", wo: "3" } },
              { id: "B", text: { fr: "5", wo: "5" } },
              { id: "C", text: { fr: "6", wo: "6" } },
              { id: "D", text: { fr: "7", wo: "7" } },
            ],
            correctOptionId: "B",
            explanation: {
              fr: "L'Islam repose sur 5 piliers : Chahada, Salat, Zakat, Sawm et Hajj.",
              wo: "Lislaam juróomi ponk la tegu: Chahada, Salat, Zakat, Sawm ak Hajj.",
            },
          },
          {
            id: "1.1-q2",
            question: {
              fr: "Quel est le premier pilier de l'Islam ?",
              wo: "Ban ponk mooy bu jiitu ci Lislaam ?",
            },
            options: [
              { id: "A", text: { fr: "La Prière (Salat)", wo: "Julli gi (Salat)" } },
              { id: "B", text: { fr: "L'Aumône (Zakat)", wo: "Asaka ji (Zakat)" } },
              { id: "C", text: { fr: "La Profession de Foi (Chahada)", wo: "Sereere si (Chahada)" } },
            ],
            correctOptionId: "C",
            explanation: {
              fr: "La Profession de Foi (Chahada) est le premier pilier, l'attestation qu'il n'y a de divinité d'Allah et que Muhammad est Son messager.",
              wo: "Sereere si (Chahada) mooy ponk bu jiitu ci bépp jëf ngir duggu ci Lislaam.",
            },
          },
        ],
      },
      publishStatus: "published",
      publicAccess: true,
    },
    "1.2": {
      title: {
        fr: "Les piliers de la foi",
        wo: "Ponk yi dëgëral Ngëm (Imân)",
      },
      intention: {
        fr: "Ancrer sa croyance dans les six piliers de la foi pour stabiliser son cœur face aux épreuves de la vie.",
        wo: "Ngëm ci ponk yi dëgëral xol bi ci jafé-jafé yi.",
      },
      content: {
        fr: "La Foi (Imân) est la dimension intérieure et spirituelle de la religion. Elle repose sur six piliers intangibles :\n\n1. **La croyance en Allah** : Croire en Son existence, Son unicité et Ses attributs de perfection.\n2. **La croyance en Ses Anges** : Êtres créés de lumière, entièrement dévoués à l'obéissance divine.\n3. **La croyance en Ses Livres** : Les Écritures révélées aux prophètes (la Torah, l'Évangile, les Psaumes et le Saint Coran).\n4. **La croyance en Ses Messagers** : Les prophètes envoyés pour guider l'humanité, de Adam à Muhammad ﷺ.\n5. **La croyance au Jour Dernier** : La résurrection, le jugement final et la vie éternelle.\n6. **La croyance au Destin (Al-Qadar)** : Accepter que tout ce qui se produit relève de la volonté et de la science d'Allah.\n\nSerigne Touba souligne que ces piliers sont indispensables pour purifier l'âme et s'élever vers la droiture.",
        wo: "Ngëm (Imân) mooy li nekk ci biir xol bi. Juróom-benni ponk la am:\n\n1. **Gëm Yalla** : Gëm ne am na, kenn la te mat na mboolem mat.\n2. **Gëm Malaaka yi** : Créatures yu ñu liggéeye ci leer te dëgër ci sañ-sañu Yalla.\n3. **Gëm Téere yi** : Mboolem téere yi wacc ci yonent yi (Tawret, Linjil, Zabur, ak Alxuraan).\n4. **Gëm Yonent yi** : Ñi Yalla yoni ngir nite ñi, jiitu ci Adam ba ci seex bi Muhammad ﷺ.\n5. **Gëm bësu Allaxira** : Dekki gi ak àtte bi.\n6. **Gëm Dogal bi (Al-Qadar)** : Gëm ne lépp li am ci dogalu Yalla la jogé.\n\nSerigne Touba dafa dëgëral ne ponk yi ñooy dundal xol bi.",
      },
      citation: {
        author: "Le Prophète Muhammad ﷺ",
        sourceRef: "Hadith (Rapporté par Muslim)",
        arabic: "أَنْ تُؤْمِنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ",
        translations: {
          fr: "[La foi consiste] à croire en Allah, en Ses Anges, en Ses Livres, en Ses Messagers, au Jour Dernier, et au Destin, qu'il soit favorable ou défavorable.",
          wo: "Ngëm mooy nga gëm Yalla, Malaaka yi, Téere yi, Yonent yi, bësu Allaxira, ak dogal bi, lu la ci neex ak lu la ci naxari.",
        },
      },
      application: {
        fr: "Méditez sur la présence des Anges autour de vous, écrivant vos actions et priant pour votre pardon. Cela favorise la présence d'esprit dans vos actions.",
        wo: "Xalaatal ne Malaaka yi ñi ngi lay dundal te di bind say jëf, loolu dafay joxe worma ci sa dund.",
      },
      reminder: {
        fr: "La foi est une certitude du cœur, prononcée par la langue et mise en œuvre par les membres.",
        wo: "Ngëm mooy lu dëgër ci xol bi, di ko wax ci làmmiñ bi te di ko jëfe ci say cër.",
      },
      quiz: {
        questions: [
          {
            id: "1.2-q1",
            question: {
              fr: "Combien y a-t-il de piliers de la foi (Imân) ?",
              wo: "Ñata ponki ngëm (Imân) lañu ?",
            },
            options: [
              { id: "A", text: { fr: "5", wo: "5" } },
              { id: "B", text: { fr: "6", wo: "6" } },
              { id: "C", text: { fr: "7", wo: "7" } },
            ],
            correctOptionId: "B",
            explanation: {
              fr: "La foi repose sur 6 piliers : croire en Allah, Ses Anges, Ses Livres, Ses Prophètes, le Jour Dernier et le Destin.",
              wo: "Ngëm juróom-benni ponk la tegu: croire en Allah, malaaka yi, téere yi, yonent yi, bësu allaxira ak dogal bi.",
            },
          },
        ],
      },
      publishStatus: "published",
      publicAccess: true,
    },
    "1.3": {
      title: {
        fr: "La connaissance d'Allah (Tawhîd)",
        wo: "Xam Yalla (Tawhîd)",
      },
      intention: {
        fr: "Comprendre les attributs indispensables d'Allah pour parfaire son monothéisme et purifier sa dévotion.",
        wo: "Xam mbaxu Yalla ngir rafatal sa jaamu.",
      },
      content: {
        fr: "Le Tawhîd (l'unicité divine) est le premier devoir de tout croyant responsable. Dans le *Tazawwudu-ss-Sighar*, Serigne Touba insiste sur l'importance de connaître les attributs indispensables de notre Créateur :\n\n* **Le Savant (Al-'Alîm)** : Sa science englobe tout ce qui existe.\n* **Le Vivant (Al-Hayy)** : Sa vie est éternelle, sans début ni fin.\n* **L'Audiant (Al-Samî')** : Il entend les moindres murmures.\n* **Le Voyant (Al-Basîr)** : Il observe toute chose, même dans l'obscurité.\n* **Le Parlant (Al-Mutakallim)** : Sa parole est un attribut de perfection.\n\nÀ l'inverse, des attributs de manque tels que la pluralité, la mort, l'impuissance, la surdité ou la cécité sont incompatibles avec Sa Majesté. La connaissance de ces attributs protège le croyant du doute et renforce sa certitude.",
        wo: "Tawhîd mooy ponk bu jiitu ci jaamu yalla. Serigne Touba dafa sàkku ñu xam melokani sunu Boroom:\n\n* **Boroom Xam-xam bi (Al-'Alîm)** : Xam-xamam dëgër na ci lépp.\n* **Kiy Dund (Al-Hayy)** : Dundam amul fu mu tàmbale amul fu mu yem.\n* **Kiy Degg (Al-Samî')** : Dafa degg lépp, lu nu gum-gumi sàx.\n* **Kiy Guiss (Al-Basîr)** : Dafa guiss lépp, sax ci nixi lëndëm.\n* **Kiy Wax (Al-Mutakallim)** : Waxam melokan u mat la.\n\nTe yalla sàllahu wa sallam mat na melokan yi te du am lu koy manke.",
      },
      citation: {
        author: "Serigne Touba",
        sourceRef: "Tazawwudu-ss-Sighar v. 32-34",
        arabic: "لَهُ صِفَاتُ ذَاتِهِ الْعَلِيَّةْ ... فَهْوَ الْعَلِيمُ وَالْحَيُw الْسَّمِيعُ الْبَصِيرُ",
        translations: {
          fr: "Il possède les attributs de Son Essence Sublime... Il est le Savant, le Vivant, l'Audiant, le Voyant.",
          wo: "Am na melokani Yëgëm yu kawe... moom mooy kiy xam, kiy dund, kiy degg, kiy guiss.",
        },
      },
      application: {
        fr: "Prenez conscience que rien de ce que vous faites n'échappe à la science et au regard d'Allah. Agissez avec excellence (Ihsân) comme si vous Le voyiez.",
        wo: "Xamal ne li nga fene mënul nëbbu ci Boroom bi, jaamul ko worma.",
      },
      reminder: {
        fr: "Connaître les attributs d'Allah est la clé de voûte de la sincérité et de la paix intérieure.",
        wo: "Xam melokani yalla mooy mayé ngëm bu dëgër ak tàj xol.",
      },
      publishStatus: "published",
      publicAccess: true,
    },
    "1.4": {
      title: {
        fr: "La connaissance du Prophète ﷺ",
        wo: "Xam Yonent bi ﷺ",
      },
      intention: {
        fr: "Étudier les qualités morales et spirituelles des messagers d'Allah pour renforcer notre amour et notre imitation du Prophète Muhammad ﷺ.",
        wo: "Xam melokani Yonent yi ngir gën leen a bëgg ak a roy.",
      },
      content: {
        fr: "Les Envoyés d'Allah sont les modèles par excellence pour l'humanité. Pour parfaire notre foi, nous devons croire en l'authenticité de leur message et connaître les qualités qui leur sont indispensables :\n\n1. **La Sincérité (Al-Sidq)** : Ils ne disent que la vérité.\n2. **La Fidélité (Al-Amana)** : Ils sont préservés des péchés et dignes de confiance.\n3. **La Transmission (Al-Tablîgh)** : Ils transmettent l'intégralité du message sans rien cacher.\n\nÀ l'inverse, le mensonge, la trahison ou la dissimulation leur sont impossibles. Pour prouver leur sincerity, Allah les a soutenus par des miracles évidents. Le Prophète Muhammad ﷺ, le sceau des prophètes, incarne ces qualités à la perfection absolue.",
        wo: "Yonent yi ñooy royu-way yi ñu yoni ci nite ñi. Ñu war leen a gëm ci ponk yi:\n\n1. **Dëgg (Al-Sidq)** : Dëgg rekk lañuy wax.\n2. **Kollëre (Al-Amana)** : Ñu wóolu leen te yalla dafa leen musal ci bépp bàkkar.\n3. **Jottali (Al-Tablîgh)** : Jottali nañu mboolem téere yi sans nëbbu dara.\n\nNax, fen, ak trahison mënul am ci ñoom. Yonent bi Muhammad ﷺ, sceau bu yonent yi, moo matal melokan yi mboolem.",
      },
      citation: {
        author: "Serigne Touba",
        sourceRef: "Tazawwudu-ss-Sighar v. 58-59",
        arabic: "وَفِي حَقِّهِمُ الصِّدْقُ وَالْأَمَانَةُ وَالتَّبْلِيغُ مُعْتَبَرٌ",
        translations: {
          fr: "À leur égard, la Sincérité, la Fidélité et la Transmission sont nécessaires.",
          wo: "Ci ñoom dëgg, kolëre ak jottali ponk yu war lañu.",
        },
      },
      application: {
        fr: "Faites vivre la Sunna dans votre journée en pratiquant une parole véridique et en honorant vos engagements, à l'image du Prophète ﷺ.",
        wo: "Royil yonent bi ci say wax ak say jëf, dëggal ak wóoloo.",
      },
      reminder: {
        fr: "Aimer le Prophète ﷺ, c'est croire en son message et s'efforcer d'adopter ses nobles caractères.",
        wo: "Bëgg yonent bi ﷺ mooy gëm li mu indi te roy melokanam yu rafet.",
      },
      publishStatus: "published",
      publicAccess: true,
    },
  };

  let lessonsCount = 0;

  for (let m = 0; m < TAZAWWUD_SEED.length; m++) {
    const moduleSeed = TAZAWWUD_SEED[m];
    const moduleId = await createEducationModule({
      slug: moduleSeed.slug,
      title: { fr: moduleSeed.titleFr },
      titleArabic: moduleSeed.titleArabic,
      description: { fr: `Découvrez les enseignements fondamentaux de cette section.` },
      iconKey: moduleSeed.iconKey,
      order: m + 1,
      publishStatus: "published",
      sourceWork: "tazawwud",
    });

    for (let l = 0; l < moduleSeed.lessons.length; l++) {
      const lessonTitle = moduleSeed.lessons[l];
      const ref = `${m + 1}.${l + 1}`;
      const detailedSeed = DETAILED_LESSONS_SEEDS[ref];

      await createEducationLesson({
        moduleId,
        slug: `${moduleSeed.slug}-${l + 1}`,
        reference: ref,
        order: l + 1,
        title: detailedSeed?.title || { fr: lessonTitle },
        intention: detailedSeed?.intention || { fr: "" },
        content: detailedSeed?.content || { fr: "" },
        citation: detailedSeed?.citation || undefined,
        application: detailedSeed?.application || undefined,
        reminder: detailedSeed?.reminder || undefined,
        quiz: detailedSeed?.quiz || undefined,
        publishStatus: detailedSeed?.publishStatus || "draft",
        publicAccess: detailedSeed?.publicAccess ?? false,
      });
      lessonsCount++;
    }
  }

  return { modules: TAZAWWUD_SEED.length, lessons: lessonsCount };
}
