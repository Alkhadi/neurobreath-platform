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

/**
 * Parse a service-account JSON string from an env var.
 * Handles:
 *  - plain JSON string
 *  - base64-encoded JSON (common on Vercel / CI)
 *  - \\n literal sequences in private_key (Vercel double-escaping)
 */
function parseServiceAccountKey(raw: string): Record<string, unknown> | null {
  // 1. Try direct JSON parse
  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // 2. Maybe base64-encoded
    try {
      const decoded = Buffer.from(raw, "base64").toString("utf-8");
      if (decoded.startsWith("{")) {
        parsed = JSON.parse(decoded);
      }
    } catch {
      // neither worked
    }
  }

  if (!parsed || typeof parsed !== "object") return null;

  // Normalise private_key: replace literal \\n with real newlines
  if (typeof parsed.private_key === "string") {
    parsed.private_key = (parsed.private_key as string).replace(/\\n/g, "\n");
  }

  return parsed;
}

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
    const serviceAccount = parseServiceAccountKey(raw);
    if (serviceAccount) {
      try {
        _adminApp = initializeApp({ credential: cert(serviceAccount) });
        return _adminApp;
      } catch (err) {
        console.error("[firebase-admin] Failed to initialise from parsed service account:", err);
        return null;
      }
    }
    console.error(
      "[firebase-admin] FIREBASE_SERVICE_ACCOUNT_KEY is set but could not be parsed as JSON or base64. " +
      "Ensure the value is a single-line JSON string (or base64-encoded JSON). " +
      "Multiline raw JSON in .env files is not supported by dotenv."
    );
    return null;
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
