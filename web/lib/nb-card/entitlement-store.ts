"use client";

/**
 * Client-side Firestore reader for NB-Card entitlement.
 *
 * Reads the user's active plan from Firestore: users/{uid}.entitlement.planId
 * Falls back to null (free) when Firestore is unavailable or doc missing.
 */

import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

export async function loadUserPlanId(uid: string): Promise<string | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    const planId = data?.entitlement?.planId;
    return typeof planId === "string" ? planId : null;
  } catch (err) {
    console.error("[entitlement-store] Failed to load plan:", err);
    return null;
  }
}
