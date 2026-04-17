/**
 * Firebase Admin SDK — lazy initialisation for server-side use only.
 *
 * Used by the Stripe webhook, /api/chat, and other server routes
 * to read/write Firestore and verify Firebase Auth tokens.
 *
 * Supports two credential modes (checked in order):
 *   1. FIREBASE_SERVICE_ACCOUNT_KEY — full JSON string
 *   2. FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY
 *
 * Returns null when neither is configured.
 */

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let _adminApp: App | null = null;

function getAdminApp(): App | null {
  if (_adminApp) return _adminApp;

  const existing = getApps();
  if (existing.length > 0) {
    _adminApp = existing[0];
    return _adminApp;
  }

  // Mode 1: full JSON service account
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw) {
    try {
      const serviceAccount = JSON.parse(raw);
      _adminApp = initializeApp({ credential: cert(serviceAccount) });
      return _adminApp;
    } catch (err) {
      console.error("[firebase-admin] Failed to initialise from JSON key:", err);
      return null;
    }
  }

  // Mode 2: individual env vars
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      _adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          // Vercel/Heroku double-escape newlines in env vars
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
      return _adminApp;
    } catch (err) {
      console.error("[firebase-admin] Failed to initialise from individual env vars:", err);
      return null;
    }
  }

  return null;
}

/** Admin Firestore instance, or null when not configured. */
export function getAdminFirestore(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  return getFirestore(app);
}

/** Admin Auth instance, or null when not configured. */
export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  if (!app) return null;
  return getAuth(app);
}
