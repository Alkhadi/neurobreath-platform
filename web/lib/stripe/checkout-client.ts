/**
 * Client-side helper to initiate Stripe checkout for an NB-Card plan.
 *
 * Calls the server-side /api/checkout endpoint which creates a Stripe
 * Checkout Session. Returns the redirect URL on success, or an error
 * message if the plan is not yet available.
 */

export interface CheckoutResult {
  url?: string;
  error?: string;
}

export async function startCheckout(planId: string, uid: string): Promise<CheckoutResult> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, uid }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Something went wrong. Please try again." };
    }

    return { url: data.url };
  } catch {
    return { error: "Network error. Please check your connection and try again." };
  }
}
