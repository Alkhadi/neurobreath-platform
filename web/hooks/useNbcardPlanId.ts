"use client";

/**
 * Reads the user's active NB-Card plan ID from Firestore.
 *
 * Returns null (free tier) when:
 * - user is not authenticated
 * - Firestore is unavailable
 * - no entitlement document exists
 */

import { useState, useEffect } from "react";
import { loadUserPlanId } from "@/lib/nb-card/entitlement-store";

export function useNbcardPlanId(uid: string | null): string | null {
  const [planId, setPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setPlanId(null);
      return;
    }
    let cancelled = false;
    loadUserPlanId(uid).then((id) => {
      if (!cancelled) setPlanId(id);
    });
    return () => { cancelled = true; };
  }, [uid]);

  return planId;
}
