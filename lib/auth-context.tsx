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
  sendPasswordResetEmail,
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
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const configured = isFirebaseConfigured();
  const [loading, setLoading] = useState(configured);

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
    if (!configured) return;
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

  async function checkEmailRegistered(email: string): Promise<boolean> {
    const db = getDb();
    try {
      const usersSnap = await getDocs(query(collection(db, "users"), limit(1)));
      if (usersSnap.empty) {
        return true; // Bootstrap mode
      }
      
      const targetEmail = email.toLowerCase().trim();

      // 1. Try exact match first (fast index check)
      const qExact = query(
        collection(db, "members"),
        where("email", "==", email.trim()),
        limit(1)
      );
      const snapExact = await getDocs(qExact);
      if (!snapExact.empty) {
        return true;
      }

      // 2. Try lowercase exact match in case database is already lowercased
      if (email.trim() !== targetEmail) {
        const qLower = query(
          collection(db, "members"),
          where("email", "==", targetEmail),
          limit(1)
        );
        const snapLower = await getDocs(qLower);
        if (!snapLower.empty) {
          return true;
        }
      }

      // 3. Fallback: Search all members in-memory (case-insensitive) to ensure it works for all existing users with capitalized emails
      const allMembersSnap = await getDocs(collection(db, "members"));
      const match = allMembersSnap.docs.some(doc => {
        const mEmail = doc.data().email;
        return mEmail && mEmail.toLowerCase().trim() === targetEmail;
      });
      
      return match;
    } catch {
      return false;
    }
  }

  async function signIn(email: string, password: string) {
    const auth = getFirebaseAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/invalid-credential" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        const isRegistered = await checkEmailRegistered(email);
        if (isRegistered) {
          const db = getDb();
          const q = query(
            collection(db, "users"),
            where("email", "==", email.trim()),
            limit(1)
          );
          const userSnap = await getDocs(q);
          if (userSnap.empty) {
            throw new Error(
              "DÉFINIR_MOT_DE_PASSE: Votre e-mail est reconnu comme membre, mais vous n'avez pas encore défini de mot de passe sur le site. Veuillez vous rendre sur l'onglet 'Inscription' pour configurer votre mot de passe et activer votre accès."
            );
          }
        }
      }
      throw error;
    }
  }

  async function signUp(email: string, password: string, displayName?: string) {
    const auth = getFirebaseAuth();
    // 1. Create the user first (this signs them in)
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    try {
      // 2. Now that they are authenticated, they have permissions to read members!
      const isRegistered = await checkEmailRegistered(email);
      if (!isRegistered) {
        // Not a registered member - delete their auth account and throw
        await cred.user.delete();
        throw new Error(
          "Cet e-mail n'est pas répertorié dans la liste officielle des membres de KSN. Veuillez contacter l'administration pour vous inscrire."
        );
      }

      // 3. Update profile if needed
      if (displayName) {
        try {
          await updateProfile(cred.user, { displayName });
        } catch {
          // non-fatal
        }
      }
    } catch (err) {
      // Clean up the created account if verification fails or errors occur
      try {
        if (auth.currentUser) {
          await auth.currentUser.delete();
        }
      } catch {
        // ignore
      }
      throw err;
    }
  }

  async function signOut() {
    const auth = getFirebaseAuth();
    await fbSignOut(auth);
  }

  async function resetPassword(email: string) {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email.trim());
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
        resetPassword,
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
