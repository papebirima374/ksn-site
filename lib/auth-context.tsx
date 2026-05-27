"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
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
import { AppUser, ALL_PERMISSIONS, UserRole, MemberStatus } from "./admin-types";

const PHONE_EMAIL_DOMAIN = "ksn-member.com";

/** Convert any phone input to digits only, then to the virtual email Firebase
 *  Auth expects ("tel-<digits>@ksn-member.com"). Returns null if input is
 *  obviously not a phone (too short, contains @, etc.). */
export function phoneToVirtualEmail(input: string): string | null {
  const digits = input.replace(/\D+/g, "");
  if (digits.length < 7) return null;
  if (input.includes("@")) return null;
  return `tel-${digits}@${PHONE_EMAIL_DOMAIN}`;
}

/** True if the identifier is a phone (only digits / +) and not an email. */
export function isPhoneIdentifier(id: string): boolean {
  if (id.includes("@")) return false;
  const cleaned = id.replace(/[+\s\-().]/g, "");
  return /^\d{7,}$/.test(cleaned);
}

/** Resolve any identifier (email or phone) to a Firebase Auth email. */
export function resolveAuthEmail(identifier: string): {
  email: string;
  phone?: string;
} | null {
  const id = identifier.trim();
  if (id.includes("@")) return { email: id.toLowerCase() };
  if (isPhoneIdentifier(id)) {
    const virt = phoneToVirtualEmail(id);
    if (!virt) return null;
    const digits = id.replace(/\D+/g, "");
    return { email: virt, phone: digits };
  }
  return null;
}

/** Detect if a Firebase user signed up via phone (virtual email pattern). */
export function userPhone(u: User): string | null {
  const email = u.email ?? "";
  const m = email.match(/^tel-(\d+)@/);
  return m ? m[1] : null;
}

type AuthState = {
  user: AppUser | null;
  firebaseUser: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (
    identifier: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (identifier: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  const loadUserDoc = useCallback(async (fbUser: User): Promise<AppUser> => {
    const db = getDb();
    const ref = doc(db, "users", fbUser.uid);
    const snap = await getDoc(ref);

    const phone = userPhone(fbUser);

    if (!snap.exists()) {
      // Bootstrap: first ever account → founding admin. All others → member.
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
        // ignore — rules may block listing, fall back to "member"
      }

      const docPayload: Record<string, unknown> = {
        email: fbUser.email ?? "",
        role,
        permissions,
        createdAt: serverTimestamp(),
      };
      if (fbUser.displayName) docPayload.displayName = fbUser.displayName;
      if (phone) docPayload.phone = phone;
      await setDoc(ref, docPayload);

      return {
        uid: fbUser.uid,
        email: fbUser.email ?? "",
        displayName: fbUser.displayName ?? undefined,
        role,
        permissions,
        createdAt: Date.now(),
        phone: phone ?? undefined,
        memberStatus: "inactif",
      };
    }

    const data = snap.data() as Partial<AppUser> & { phone?: string };

    // Try to enrich with the linked members/* row to surface memberStatus +
    // matricule directly in useAuth. Best effort — silent on permission errors.
    let memberId: string | undefined;
    let memberStatus: MemberStatus | undefined = "inactif";
    let memberMatricule: string | undefined;

    try {
      const emailKey = (fbUser.email ?? data.email ?? "").toLowerCase();
      const matchingPhone = phone ?? data.phone;

      const candidates: { field: string; value: string }[] = [];
      if (matchingPhone) candidates.push({ field: "telephone", value: matchingPhone });
      if (emailKey) candidates.push({ field: "email", value: emailKey });

      for (const c of candidates) {
        const ms = await getDocs(
          query(collection(db, "members"), where(c.field, "==", c.value), limit(1))
        ).catch(() => null);
        if (ms && !ms.empty) {
          const d = ms.docs[0];
          const md = d.data();
          memberId = d.id;
          memberStatus = (md.status as MemberStatus) ?? "actif";
          memberMatricule = md.matricule;
          break;
        }
      }
    } catch {
      // ignore
    }

    return {
      uid: fbUser.uid,
      email: fbUser.email ?? data.email ?? "",
      displayName: data.displayName ?? fbUser.displayName ?? undefined,
      role: data.role ?? "member",
      commission: data.commission,
      permissions: data.permissions ?? [],
      createdAt: data.createdAt,
      phone: phone ?? data.phone,
      memberId,
      memberStatus,
      memberMatricule,
    };
  }, []);

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
  }, [configured, loadUserDoc]);

  async function signIn(identifier: string, password: string) {
    const auth = getFirebaseAuth();
    const resolved = resolveAuthEmail(identifier);
    if (!resolved)
      throw new Error("Identifiant invalide. Saisissez un email ou un numéro.");
    await signInWithEmailAndPassword(auth, resolved.email, password);
  }

  async function signUp(
    identifier: string,
    password: string,
    displayName?: string
  ) {
    const auth = getFirebaseAuth();
    const resolved = resolveAuthEmail(identifier);
    if (!resolved)
      throw new Error(
        "Identifiant invalide. Saisissez un email valide ou un numéro de téléphone."
      );
    const cred = await createUserWithEmailAndPassword(
      auth,
      resolved.email,
      password
    );
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

  async function resetPassword(identifier: string) {
    const auth = getFirebaseAuth();
    const resolved = resolveAuthEmail(identifier);
    if (!resolved) throw new Error("Identifiant invalide.");
    // Pour les comptes téléphone, l'email virtuel n'est jamais réellement
    // reçu — on lève une erreur "PHONE_ACCOUNT" pour que l'UI bascule sur le
    // bouton WhatsApp à la place.
    if (identifier.includes("@") === false) {
      const err = new Error("PHONE_ACCOUNT");
      throw err;
    }
    await sendPasswordResetEmail(auth, resolved.email);
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
        resetPassword,
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
