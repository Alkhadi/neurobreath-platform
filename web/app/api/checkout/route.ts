import { NextRequest } from "next/server";
import Stripe from "stripe";
import { ALL_PLANS } from "@/lib/nb-card/plans";
import { getStripePriceId, getCheckoutMode } from "@/lib/stripe/config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Validate Stripe secret key
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return Response.json(
      { error: "Payment processing is not yet configured." },
      { status: 503 },
    );
  }

  // Parse request body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const planId = typeof body.planId === "string" ? body.planId : null;
  const uid = typeof body.uid === "string" ? body.uid : null;
  if (!planId) {
    return Response.json({ error: "Missing plan ID." }, { status: 400 });
  }
  if (!uid) {
    return Response.json({ error: "Missing user ID. Please sign in first." }, { status: 400 });
  }

  // Look up plan
  const plan = ALL_PLANS.get(planId);
  if (!plan || plan.purchaseType === "free") {
    return Response.json({ error: "Invalid plan." }, { status: 400 });
  }

  // Look up Stripe Price ID
  const priceId = getStripePriceId(planId);
  if (!priceId) {
    return Response.json(
      {
        error:
          "This plan is not yet available for purchase. Please check back soon.",
      },
      { status: 503 },
    );
  }

  // Create Stripe Checkout Session
  const stripe = new Stripe(secretKey);
  const mode = getCheckoutMode(plan);
  const origin = req.nextUrl.origin;

  try {
    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pricing?success=true&plan=${encodeURIComponent(planId)}`,
      cancel_url: `${origin}/pricing?cancelled=true`,
      metadata: { nb_plan_id: planId, nb_firebase_uid: uid },
    };

    // Propagate metadata to the subscription for cancellation handling
    if (mode === "subscription") {
      sessionParams.subscription_data = {
        metadata: { nb_plan_id: planId, nb_firebase_uid: uid },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return Response.json(
        { error: "Failed to create checkout session." },
        { status: 500 },
      );
    }

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe error:", err);
    return Response.json(
      { error: "Failed to create checkout session." },
      { status: 500 },
    );
  }
}
