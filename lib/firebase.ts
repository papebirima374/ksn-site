import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase n'est pas configuré. Ajoutez les variables NEXT_PUBLIC_FIREBASE_* dans .env.local et redémarrez."
    );
  }
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getFirebaseApp());
  return _auth;
}

export function getDb(): Firestore {
  if (!_db) _db = getFirestore(getFirebaseApp());
  return _db;
}

export function getBucket(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getFirebaseApp());
  return _storage;
}

/** Cree (ou recupere) une instance Firebase SECONDAIRE.
 *  Utilisee pour creer un compte Auth depuis l'admin sans deconnecter
 *  l'admin courant (createUserWithEmailAndPassword sur l'instance
 *  principale logge automatiquement le nouveau user). */
let _secondaryApp: FirebaseApp | null = null;
let _secondaryAuth: Auth | null = null;

export function getSecondaryAuth(): Auth {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase n'est pas configuré.");
  }
  if (!_secondaryApp) {
    const existing = getApps().find((a) => a.name === "Secondary");
    _secondaryApp = existing ?? initializeApp(firebaseConfig, "Secondary");
  }
  if (!_secondaryAuth) {
    _secondaryAuth = getAuth(_secondaryApp);
  }
  return _secondaryAuth;
}
