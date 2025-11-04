import { initializeApp, type FirebaseApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
  type UserCredential,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;

const isConfigReady = Object.values(firebaseConfig).every(Boolean);

function ensureApp(): FirebaseApp | undefined {
  if (!isConfigReady) {
    console.info("[firebase] Missing env vars. Skip Firebase bootstrap for now.");
    return undefined;
  }

  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }

  return app;
}

export function getFirebaseAuth(): Auth | undefined {
  if (!auth) {
    const instance = ensureApp();
    if (!instance) return undefined;
    auth = getAuth(instance);
  }
  return auth;
}

export function getFirestoreInstance(): Firestore | undefined {
  if (!firestore) {
    const instance = ensureApp();
    if (!instance) return undefined;
    firestore = getFirestore(instance);
  }
  return firestore;
}

export function getStorageBucket(): FirebaseStorage | undefined {
  if (!storage) {
    const instance = ensureApp();
    if (!instance) return undefined;
    storage = getStorage(instance);
  }
  return storage;
}

export async function signInWithGoogle(): Promise<UserCredential | undefined> {
  const instance = getFirebaseAuth();
  if (!instance) {
    throw new Error("Firebase config missing. Provide Vite env vars to enable auth.");
  }

  const provider = new GoogleAuthProvider();
  return signInWithPopup(instance, provider);
}

export async function signInWithEmail(email: string, password: string) {
  const instance = getFirebaseAuth();
  if (!instance) {
    throw new Error("Firebase config missing. Provide Vite env vars to enable auth.");
  }

  return signInWithEmailAndPassword(instance, email, password);
}

export async function registerWithEmail(email: string, password: string) {
  const instance = getFirebaseAuth();
  if (!instance) {
    throw new Error("Firebase config missing. Provide Vite env vars to enable auth.");
  }

  return createUserWithEmailAndPassword(instance, email, password);
}

export async function resetPassword(email: string) {
  const instance = getFirebaseAuth();
  if (!instance) {
    throw new Error("Firebase config missing. Provide Vite env vars to enable auth.");
  }

  return sendPasswordResetEmail(instance, email);
}
