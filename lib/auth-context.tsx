"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { getFirebaseAuth, getDb, isFirebaseConfigured } from "./firebase";
import { AppUser, ALL_PERMISSIONS, UserRole } from "./admin-types";

type AuthState = {
  user: AppUser | null;
  firebaseUser: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  async function loadUserDoc(fbUser: User): Promise<AppUser> {
    const db = getDb();
    const ref = doc(db, "users", fbUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // Bootstrap: if no admin exists yet anywhere in users/, this account
      // becomes the founding admin. Otherwise it's a regular member account.
      let role: UserRole = "member";
      let permissions: typeof ALL_PERMISSIONS = [];
      try {
        const adminSnap = await getDocs(
          query(
            collection(db, "users"),
            where("role", "==", "admin"),
            limit(1)
          )
        );
        if (adminSnap.empty) {
          role = "admin";
          permissions = ALL_PERMISSIONS;
        }
      } catch {
        // If the read fails (rules block listing), fall back to member.
      }

      const docPayload: Record<string, unknown> = {
        email: fbUser.email ?? "",
        role,
        permissions,
        createdAt: serverTimestamp(),
      };
      if (fbUser.displayName) docPayload.displayName = fbUser.displayName;
      await setDoc(ref, docPayload);

      return {
        uid: fbUser.uid,
        email: fbUser.email ?? "",
        displayName: fbUser.displayName ?? undefined,
        role,
        permissions,
        createdAt: Date.now(),
      };
    }

    const data = snap.data() as Partial<AppUser>;
    return {
      uid: fbUser.uid,
      email: fbUser.email ?? data.email ?? "",
      displayName: data.displayName ?? fbUser.displayName ?? undefined,
      role: data.role ?? "member",
      commission: data.commission,
      permissions: data.permissions ?? [],
      createdAt: data.createdAt,
    };
  }

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const u = await loadUserDoc(fbUser);
          setUser(u);
        } catch (e) {
          console.error("Failed to load user doc", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [configured]);

  async function signIn(email: string, password: string) {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email: string, password: string, displayName?: string) {
    const auth = getFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      try {
        await updateProfile(cred.user, { displayName });
      } catch {
        // non-fatal
      }
    }
  }

  async function signOut() {
    const auth = getFirebaseAuth();
    await fbSignOut(auth);
  }

  async function refresh() {
    if (firebaseUser) setUser(await loadUserDoc(firebaseUser));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        configured,
        signIn,
        signUp,
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
