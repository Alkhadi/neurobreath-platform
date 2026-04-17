/**
 * Server-side Firebase Auth token verification for API routes.
 *
 * Usage:
 *   const verified = await verifyAuthToken(req);
 *   // verified.uid is the authenticated user's UID (or null for unauthenticated)
 */

import { getAdminAuth } from "@/lib/firebase-admin";

export interface VerifiedAuth {
  uid: string | null;
  plan: "guest" | "free" | "pro";
  isAnonymous: boolean;
}

/**
 * Extract and verify a Firebase ID token from the Authorization header.
 * Returns { uid: null } when no token is provided or verification fails —
 * callers decide whether to allow unauthenticated access.
 */
export async function verifyAuthToken(
  req: Request,
): Promise<VerifiedAuth> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return { uid: null, plan: "guest", isAnonymous: true };
  }

  const token = header.slice(7);
  const auth = getAdminAuth();
  if (!auth) {
    console.warn("[buddy/auth] Firebase Admin Auth not configured — treating as guest");
    return { uid: null, plan: "guest", isAnonymous: true };
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      plan: "free", // plan resolution happens via Firestore lookup if needed
      isAnonymous: decoded.firebase?.sign_in_provider === "anonymous",
    };
  } catch (err) {
    console.warn("[buddy/auth] Token verification failed:", err);
    return { uid: null, plan: "guest", isAnonymous: true };
  }
}
