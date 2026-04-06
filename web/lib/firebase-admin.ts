/**
 * Firebase Admin SDK — lazy initialisation for server-side use only.
 *
 * Used by the Stripe webhook to write entitlement data to Firestore.
 * Returns null when the service account env var is not configured.
 */

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let _adminApp: App | null = null;

function getAdminApp(): App | null {
  if (_adminApp) return _adminApp;

  const existing = getApps();
  if (existing.length > 0) {
    _adminApp = existing[0];
    return _adminApp;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  try {
    const serviceAccount = JSON.parse(raw);
    _adminApp = initializeApp({ credential: cert(serviceAccount) });
    return _adminApp;
  } catch (err) {
    console.error("[firebase-admin] Failed to initialise:", err);
    return null;
  }
}

/** Admin Firestore instance, or null when not configured. */
export function getAdminFirestore(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  return getFirestore(app);
}
