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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getDb, getBucket } from "./firebase";
import {
  Article,
  AppUser,
  GalleryItem,
  MenuItem,
  Permission,
  SalaatuDuJour,
  UserRole,
} from "./admin-types";

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
