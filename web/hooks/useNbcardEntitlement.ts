"use client";

import { useMemo } from "react";
import { FREE_PLAN, ALL_PLANS, type NbcardPlan } from "@/lib/nb-card/plans";

/**
 * User entitlement state for NB-Card.
 *
 * NOTE (2026-04-06): No payment processing exists yet. The active plan is
 * always FREE unless a planId is supplied (future: read from Firestore
 * user doc or server session). The free 2-card limit IS enforced.
 * Storage-byte quotas are scaffolded but NOT enforced.
 */

export interface NbcardEntitlement {
  /** The user's active plan */
  plan: NbcardPlan;
  /** Maximum saved cards allowed (null = storage-limited, treated as unlimited for now) */
  maxCards: number | null;
  /** Whether saving another card should be blocked */
  canSave: (currentCardCount: number) => boolean;
  /** Whether the user is on the free tier */
  isFree: boolean;
}

/**
 * Resolve entitlement for a given plan ID and current saved-card count.
 *
 * @param planId - active plan id (future: fetched from Firestore). Defaults to "free".
 */
export function useNbcardEntitlement(planId?: string | null): NbcardEntitlement {
  return useMemo(() => {
    const plan = (planId ? ALL_PLANS.get(planId) : null) ?? FREE_PLAN;
    const maxCards = plan.maxSavedCards;

    const canSave = (currentCardCount: number): boolean => {
      // If maxCards is null, no card-count limit (limited by storage quota in future)
      if (maxCards == null) return true;
      return currentCardCount < maxCards;
    };

    return {
      plan,
      maxCards,
      canSave,
      isFree: plan.id === "free",
    };
  }, [planId]);
}
