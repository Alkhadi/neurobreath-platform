/**
 * NB-Card plan definitions — central source of truth.
 *
 * Pricing is defined here; actual payment processing is NOT yet implemented.
 * The free-tier 2-card limit IS enforced. Storage quotas are scaffolded
 * for future enforcement once byte-accurate accounting is added.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type PlanPurchaseType = "free" | "one-time" | "monthly";

export interface NbcardPlan {
  /** Stable machine identifier, e.g. "free", "starter-once", "starter-monthly" */
  id: string;
  /** Human-readable label, e.g. "Starter" */
  displayName: string;
  /** How the plan is purchased */
  purchaseType: PlanPurchaseType;
  /** One-time price in GBP (pence for precision). null if free or monthly */
  oneTimePriceGbp: number | null;
  /** Monthly price in GBP (pence for precision). null if free or one-time */
  monthlyPriceGbp: number | null;
  /** Storage quota in GB. null = unlimited (never used today) */
  storageGb: number | null;
  /** Max saved cards. null = limited only by storage quota */
  maxSavedCards: number | null;
  /** Whether the plan is currently available for selection */
  available: boolean;
}

// ─── Plan catalogue ──────────────────────────────────────────────────────────

export const FREE_PLAN: NbcardPlan = {
  id: "free",
  displayName: "Free",
  purchaseType: "free",
  oneTimePriceGbp: null,
  monthlyPriceGbp: null,
  storageGb: null,
  maxSavedCards: 2,
  available: true,
};

/** One-time plans — permanent entitlement after single purchase */
export const ONE_TIME_PLANS: NbcardPlan[] = [
  { id: "starter-once",  displayName: "Starter",  purchaseType: "one-time", oneTimePriceGbp: 500,  monthlyPriceGbp: null, storageGb: 15,  maxSavedCards: null, available: true },
  { id: "basic-once",    displayName: "Basic",     purchaseType: "one-time", oneTimePriceGbp: 1000, monthlyPriceGbp: null, storageGb: 30,  maxSavedCards: null, available: true },
  { id: "plus-once",     displayName: "Plus",      purchaseType: "one-time", oneTimePriceGbp: 1500, monthlyPriceGbp: null, storageGb: 45,  maxSavedCards: null, available: true },
  { id: "pro-once",      displayName: "Pro",       purchaseType: "one-time", oneTimePriceGbp: 2000, monthlyPriceGbp: null, storageGb: 60,  maxSavedCards: null, available: true },
  { id: "advanced-once", displayName: "Advanced",  purchaseType: "one-time", oneTimePriceGbp: 2500, monthlyPriceGbp: null, storageGb: 75,  maxSavedCards: null, available: true },
  { id: "max-once",      displayName: "Max",       purchaseType: "one-time", oneTimePriceGbp: 3500, monthlyPriceGbp: null, storageGb: 100, maxSavedCards: null, available: true },
];

/** Monthly subscription plans — active only while subscription is current */
export const MONTHLY_PLANS: NbcardPlan[] = [
  { id: "starter-monthly",  displayName: "Starter",  purchaseType: "monthly", oneTimePriceGbp: null, monthlyPriceGbp: 99,  storageGb: 15,  maxSavedCards: null, available: true },
  { id: "basic-monthly",    displayName: "Basic",     purchaseType: "monthly", oneTimePriceGbp: null, monthlyPriceGbp: 199, storageGb: 30,  maxSavedCards: null, available: true },
  { id: "plus-monthly",     displayName: "Plus",      purchaseType: "monthly", oneTimePriceGbp: null, monthlyPriceGbp: 299, storageGb: 45,  maxSavedCards: null, available: true },
  { id: "pro-monthly",      displayName: "Pro",       purchaseType: "monthly", oneTimePriceGbp: null, monthlyPriceGbp: 399, storageGb: 60,  maxSavedCards: null, available: true },
  { id: "advanced-monthly",  displayName: "Advanced", purchaseType: "monthly", oneTimePriceGbp: null, monthlyPriceGbp: 499, storageGb: 75,  maxSavedCards: null, available: true },
  { id: "max-monthly",      displayName: "Max",       purchaseType: "monthly", oneTimePriceGbp: null, monthlyPriceGbp: 699, storageGb: 100, maxSavedCards: null, available: true },
];

/** All plans indexed by id for quick lookup */
export const ALL_PLANS: ReadonlyMap<string, NbcardPlan> = new Map(
  [FREE_PLAN, ...ONE_TIME_PLANS, ...MONTHLY_PLANS].map((p) => [p.id, p]),
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format pence as £X.XX */
export function formatGbp(pence: number): string {
  return `£${(pence / 100).toFixed(2).replace(/\.00$/, "")}`;
}

/** Human-readable price label for a plan */
export function planPriceLabel(plan: NbcardPlan): string {
  if (plan.purchaseType === "free") return "Free";
  if (plan.purchaseType === "one-time" && plan.oneTimePriceGbp != null) {
    return `${formatGbp(plan.oneTimePriceGbp)} once`;
  }
  if (plan.purchaseType === "monthly" && plan.monthlyPriceGbp != null) {
    return `${formatGbp(plan.monthlyPriceGbp)}/month`;
  }
  return "";
}
