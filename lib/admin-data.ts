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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getDb, getBucket } from "./firebase";
import {
  Article,
  AppUser,
  FinanceEntry,
  GalleryItem,
  Member,
  MenuItem,
  Order,
  OrderStatus,
  Permission,
  Product,
  SalaatuDuJour,
  SalaatuLibraryItem,
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
  meta: { alt: string; category: GalleryItem["category"]; createdBy: string }
): Promise<GalleryItem> {
  const bucket = getBucket();
  const path = `gallery/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const r = ref(bucket, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  const db = getDb();
  const docRef = await addDoc(collection(db, "gallery"), {
    src: url,
    alt: meta.alt,
    category: meta.category,
    storagePath: path,
    createdAt: Date.now(),
    createdBy: meta.createdBy,
  });
  return {
    id: docRef.id,
    src: url,
    alt: meta.alt,
    category: meta.category,
    storagePath: path,
    createdAt: Date.now(),
    createdBy: meta.createdBy,
  };
}

export async function updateGalleryItem(
  id: string,
  patch: Partial<Pick<GalleryItem, "alt" | "category">>
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

export async function createMember(
  data: Omit<Member, "id" | "matricule" | "createdAt"> & {
    matricule?: string;
  }
): Promise<Member> {
  const db = getDb();
  const matricule = data.matricule || (await nextMatricule());
  const payload = stripUndefined({
    ...data,
    matricule,
    createdAt: Date.now(),
    joinedAt: data.joinedAt ?? Date.now(),
    status: data.status ?? ("actif" as const),
  });
  const docRef = await addDoc(collection(db, "members"), payload);
  return { id: docRef.id, ...(payload as Omit<Member, "id">) };
}

export async function updateMember(id: string, patch: Partial<Member>) {
  const db = getDb();
  await updateDoc(doc(db, "members", id), stripUndefined(patch));
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
