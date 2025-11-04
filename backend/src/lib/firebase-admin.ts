import * as admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

let app: admin.app.App | undefined;

/**
 * Initialize Firebase Admin SDK
 * Supports two methods:
 * 1. Service account JSON file (for local development)
 * 2. Environment variables (for production deployment)
 */
function initializeFirebaseAdmin(): admin.app.App {
  if (app) {
    return app;
  }

  try {
    // Method 1: Try to load from service account file
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    
    if (serviceAccountPath) {
      try {
        const serviceAccountFile = readFileSync(
          join(process.cwd(), serviceAccountPath),
          "utf-8"
        );
        const serviceAccount = JSON.parse(serviceAccountFile);

        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });

        console.log("[Firebase Admin] Initialized with service account file");
        return app;
      } catch (fileError) {
        console.warn(
          "[Firebase Admin] Could not load service account file:",
          serviceAccountPath
        );
      }
    }

    // Method 2: Try to initialize with environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (projectId && privateKey && clientEmail) {
      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey: privateKey.replace(/\\n/g, "\n"),
          clientEmail,
        }),
      });

      console.log("[Firebase Admin] Initialized with environment variables");
      return app;
    }

    throw new Error(
      "Firebase Admin SDK credentials not found. Please set FIREBASE_SERVICE_ACCOUNT_PATH or provide FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables."
    );
  } catch (error) {
    console.error("[Firebase Admin] Initialization error:", error);
    throw error;
  }
}

/**
 * Get the Firebase Admin Auth instance
 */
export function getAdminAuth(): admin.auth.Auth {
  const firebaseApp = initializeFirebaseAdmin();
  return firebaseApp.auth();
}

/**
 * Get the Firebase Admin Firestore instance
 */
export function getAdminFirestore(): admin.firestore.Firestore {
  const firebaseApp = initializeFirebaseAdmin();
  return firebaseApp.firestore();
}

/**
 * Verify a Firebase ID token
 * @param idToken - The Firebase ID token to verify
 * @returns The decoded token
 */
export async function verifyIdToken(idToken: string) {
  const auth = getAdminAuth();
  return auth.verifyIdToken(idToken);
}

/**
 * Get user by UID
 * @param uid - The user's UID
 * @returns The user record
 */
export async function getUserByUid(uid: string) {
  const auth = getAdminAuth();
  return auth.getUser(uid);
}

/**
 * Extract token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns The extracted token or null
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  // Support both "Bearer <token>" and just "<token>"
  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }
  
  return authHeader;
}
