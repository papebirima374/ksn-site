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
  updateDoc,
  addDoc,
  serverTimestamp,
  collection,
  query,
  where,
  limit,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { getFirebaseAuth, getDb, isFirebaseConfigured } from "./firebase";
import { AppUser, ALL_PERMISSIONS, UserRole } from "./admin-types";
import { checkDuplicateEmailOrPhone, nextMatricule, uploadMemberPhoto } from "./admin-data";

type AuthState = {
  user: AppUser | null;
  firebaseUser: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (emailOrPhone: string, password: string) => Promise<void>;
  signUp: (
    emailOrPhone: string,
    password: string,
    details: {
      prenom: string;
      nom: string;
      telephone?: string;
      domicile?: string;
      photoFile?: File | null;
      isActifRequest: boolean;
    }
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

    let role: UserRole = "member";
    let permissions: typeof ALL_PERMISSIONS = [];
    let commission: string | undefined;
    let displayName = fbUser.displayName ?? undefined;
    let createdAt = Date.now();
    let email = fbUser.email ?? "";

    if (snap.exists()) {
      const data = snap.data() as Partial<AppUser>;
      role = data.role ?? "member";
      commission = data.commission;
      permissions = data.permissions ?? [];
      createdAt = typeof data.createdAt === "number" ? data.createdAt : Date.now();
      displayName = data.displayName ?? displayName;
      email = data.email ?? email;
    } else {
      // Bootstrap: if no admin exists yet anywhere in users/, this account
      // becomes the founding admin. Otherwise it's a regular member account.
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
        email,
        role,
        permissions,
        createdAt: serverTimestamp(),
      };
      if (displayName) docPayload.displayName = displayName;
      await setDoc(ref, docPayload);
    }

    // Lookup member info in members collection
    let memberStatus: "actif" | "en_attente" | "inactif" = "inactif";
    let memberId: string | undefined;

    try {
      let foundMemberDoc: QueryDocumentSnapshot<DocumentData> | null = null;
      if (email.startsWith("tel-") && email.endsWith("@ksn-member.com")) {
        const phoneDigits = email.substring(4, email.indexOf("@"));
        const q = query(collection(db, "members"));
        const snapMembers = await getDocs(q);
        for (const d of snapMembers.docs) {
          const mTel = d.data().telephone;
          if (mTel && mTel.replace(/\D+/g, "") === phoneDigits) {
            foundMemberDoc = d;
            break;
          }
        }
      } else {
        const targetEmail = email.toLowerCase().trim();
        const qExact = query(
          collection(db, "members"),
          where("email", "==", email.trim()),
          limit(1)
        );
        const snapExact = await getDocs(qExact);
        if (!snapExact.empty) {
          foundMemberDoc = snapExact.docs[0];
        } else {
          const q = query(collection(db, "members"));
          const snapMembers = await getDocs(q);
          for (const d of snapMembers.docs) {
            const mEmail = d.data().email;
            if (mEmail && mEmail.toLowerCase().trim() === targetEmail) {
              foundMemberDoc = d;
              break;
            }
          }
        }
      }

      if (foundMemberDoc) {
        memberStatus = foundMemberDoc.data().status ?? "inactif";
        memberId = foundMemberDoc.id;
      }
    } catch (err) {
      console.error("Error looking up member doc during loadUserDoc", err);
    }

    return {
      uid: fbUser.uid,
      email,
      displayName,
      role,
      commission,
      permissions,
      createdAt,
      memberStatus,
      memberId,
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

  async function checkEmailOrPhoneRegistered(emailOrPhone: string): Promise<boolean> {
    const db = getDb();
    try {
      const usersSnap = await getDocs(query(collection(db, "users"), limit(1)));
      if (usersSnap.empty) {
        return true; // Bootstrap mode
      }
      
      const input = emailOrPhone.trim();
      const isEmail = input.includes("@");

      if (isEmail) {
        const targetEmail = input.toLowerCase();

        // 1. Try exact match first (fast index check)
        const qExact = query(
          collection(db, "members"),
          where("email", "==", input),
          limit(1)
        );
        const snapExact = await getDocs(qExact);
        if (!snapExact.empty) {
          return true;
        }

        // 2. Try lowercase exact match
        if (input !== targetEmail) {
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

        // 3. Fallback: Search all members in-memory (case-insensitive)
        const allMembersSnap = await getDocs(collection(db, "members"));
        return allMembersSnap.docs.some(doc => {
          const mEmail = doc.data().email;
          return mEmail && mEmail.toLowerCase().trim() === targetEmail;
        });
      } else {
        const targetDigits = input.replace(/\D+/g, "");
        if (!targetDigits) return false;

        // 1. Try exact match on telephone
        const qExact = query(
          collection(db, "members"),
          where("telephone", "==", input),
          limit(1)
        );
        const snapExact = await getDocs(qExact);
        if (!snapExact.empty) return true;

        // 2. Fallback: Search in-memory comparing digits
        const allMembersSnap = await getDocs(collection(db, "members"));
        return allMembersSnap.docs.some(doc => {
          const mTel = doc.data().telephone;
          if (!mTel) return false;
          const mDigits = mTel.replace(/\D+/g, "");
          if (mDigits === targetDigits) return true;
          if (mDigits.length >= 9 && targetDigits.endsWith(mDigits)) return true;
          if (targetDigits.length >= 9 && mDigits.endsWith(targetDigits)) return true;
          return false;
        });
      }
    } catch {
      return false;
    }
  }

  async function signIn(emailOrPhone: string, password: string) {
    const auth = getFirebaseAuth();
    const input = emailOrPhone.trim();
    const isEmail = input.includes("@");
    let email = input;
    if (!isEmail) {
      const cleaned = input.replace(/\D+/g, "");
      email = `tel-${cleaned}@ksn-member.com`;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/invalid-credential" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        const isRegistered = await checkEmailOrPhoneRegistered(input);
        if (isRegistered) {
          const db = getDb();
          const q = query(
            collection(db, "users"),
            where("email", "==", email),
            limit(1)
          );
          const userSnap = await getDocs(q);
          if (userSnap.empty) {
            throw new Error(
              `DÉFINIR_MOT_DE_PASSE: Votre ${isEmail ? "e-mail" : "numéro de téléphone"} est reconnu comme membre, mais vous n'avez pas encore défini de mot de passe sur le site. Veuillez vous rendre sur l'onglet 'Inscription' pour configurer votre mot de passe et activer votre accès.`
            );
          }
        }
      }
      throw error;
    }
  }

  async function signUp(
    emailOrPhone: string,
    password: string,
    details: {
      prenom: string;
      nom: string;
      telephone?: string;
      domicile?: string;
      photoFile?: File | null;
      isActifRequest: boolean;
    }
  ) {
    const auth = getFirebaseAuth();
    const db = getDb();
    const input = emailOrPhone.trim();
    const isEmail = input.includes("@");
    let email = input;
    if (!isEmail) {
      const cleaned = input.replace(/\D+/g, "");
      email = `tel-${cleaned}@ksn-member.com`;
    }

    // 1. Check if member exists and already has associated account
    let existingMember: QueryDocumentSnapshot<DocumentData> | null = null;
    if (isEmail) {
      const q = query(collection(db, "members"), where("email", "==", input), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        existingMember = snap.docs[0];
      } else {
        const targetEmail = input.toLowerCase().trim();
        const all = await getDocs(collection(db, "members"));
        existingMember = all.docs.find(d => d.data().email && d.data().email.toLowerCase().trim() === targetEmail);
      }
    } else {
      const cleaned = input.replace(/\D+/g, "");
      const all = await getDocs(collection(db, "members"));
      existingMember = all.docs.find(d => d.data().telephone && d.data().telephone.replace(/\D+/g, "") === cleaned);
    }

    if (existingMember) {
      const memberEmail = existingMember.data().email || `tel-${(existingMember.data().telephone || "").replace(/\D+/g, "")}@ksn-member.com`;
      const qUser = query(collection(db, "users"), where("email", "==", memberEmail), limit(1));
      const snapUser = await getDocs(qUser);
      if (!snapUser.empty) {
        throw new Error(`Ce ${isEmail ? "e-mail" : "numéro de téléphone"} est déjà lié à un compte utilisateur enregistré.`);
      }
    } else {
      // If member does not exist, check duplicate email/phone
      const { emailDuplicate, phoneDuplicate } = await checkDuplicateEmailOrPhone(
        isEmail ? input : undefined,
        isEmail ? details.telephone : input
      );
      if (isEmail && emailDuplicate) {
        throw new Error("Cette adresse e-mail est déjà attribuée à un membre.");
      }
      if (phoneDuplicate) {
        throw new Error("Ce numéro de téléphone est déjà attribué à un membre.");
      }
    }

    // 2. Create in Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    try {
      // 3. Upload photo now that we are authenticated
      let photoUrl = "";
      let photoPathValue = "";
      if (details.photoFile) {
        const { url, path } = await uploadMemberPhoto(details.photoFile);
        photoUrl = url;
        photoPathValue = path;
      }

      // 4. Create users doc
      const userRef = doc(db, "users", cred.user.uid);
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
        // ignore
      }

      await setDoc(userRef, {
        email,
        displayName: `${details.prenom} ${details.nom}`,
        role,
        permissions,
        createdAt: serverTimestamp(),
      });

      // 5. Create or update member doc
      const statusValue = details.isActifRequest ? "en_attente" : "inactif";
      if (existingMember) {
        const memberRef = doc(db, "members", existingMember.id);
        await updateDoc(memberRef, {
          prenom: details.prenom,
          nom: details.nom,
          telephone: isEmail ? (details.telephone || "") : input,
          domicile: details.domicile || "",
          photo: photoUrl || existingMember.data().photo || "",
          photoPath: photoPathValue || existingMember.data().photoPath || "",
          status: statusValue,
        });
      } else {
        const matricule = await nextMatricule();
        await addDoc(collection(db, "members"), {
          matricule,
          prenom: details.prenom,
          nom: details.nom,
          email: isEmail ? input : "",
          telephone: isEmail ? (details.telephone || "") : input,
          domicile: details.domicile || "",
          photo: photoUrl,
          photoPath: photoPathValue,
          status: statusValue,
          createdAt: Date.now(),
          createdBy: cred.user.uid,
        });
      }

      try {
        await updateProfile(cred.user, {
          displayName: `${details.prenom} ${details.nom}`,
          photoURL: photoUrl || undefined,
        });
      } catch {
        // ignore
      }
    } catch (err) {
      if (auth.currentUser) {
        await auth.currentUser.delete();
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
