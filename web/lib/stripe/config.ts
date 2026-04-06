/**
 * Stripe configuration for NB-Card premium plans.
 *
 * Each plan maps to a Stripe Price ID via an env var (server-only).
 * Price IDs must be created in the Stripe Dashboard first, then added
 * to the deployment environment. If a Price ID is missing, checkout
 * for that plan will return a 503 with a truthful message.
 */

import type { NbcardPlan } from "@/lib/nb-card/plans";

/** Server-only mapping: NB-Card plan ID → Stripe Price ID env var value. */
const PLAN_ENV_MAP: Record<string, string> = {
  "starter-once": "STRIPE_PRICE_STARTER_ONCE",
  "basic-once": "STRIPE_PRICE_BASIC_ONCE",
  "plus-once": "STRIPE_PRICE_PLUS_ONCE",
  "pro-once": "STRIPE_PRICE_PRO_ONCE",
  "advanced-once": "STRIPE_PRICE_ADVANCED_ONCE",
  "max-once": "STRIPE_PRICE_MAX_ONCE",
  "starter-monthly": "STRIPE_PRICE_STARTER_MONTHLY",
  "basic-monthly": "STRIPE_PRICE_BASIC_MONTHLY",
  "plus-monthly": "STRIPE_PRICE_PLUS_MONTHLY",
  "pro-monthly": "STRIPE_PRICE_PRO_MONTHLY",
  "advanced-monthly": "STRIPE_PRICE_ADVANCED_MONTHLY",
  "max-monthly": "STRIPE_PRICE_MAX_MONTHLY",
};

/** Get the Stripe Price ID for a given plan, or null if not configured. */
export function getStripePriceId(planId: string): string | null {
  const envKey = PLAN_ENV_MAP[planId];
  if (!envKey) return null;
  return process.env[envKey] ?? null;
}

/** Get checkout mode for a plan ("payment" for one-time, "subscription" for monthly). */
export function getCheckoutMode(
  plan: NbcardPlan,
): "payment" | "subscription" {
  return plan.purchaseType === "monthly" ? "subscription" : "payment";
}
