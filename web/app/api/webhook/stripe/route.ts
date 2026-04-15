import { NextRequest } from "next/server";
import Stripe from "stripe";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { ALL_PLANS } from "@/lib/nb-card/plans";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

/**
 * Stripe webhook handler for NB-Card plan fulfillment.
 *
 * Events handled:
 * - checkout.session.completed → activate plan entitlement
 * - customer.subscription.deleted → reset to free plan
 *
 * Entitlement is written to Firestore: users/{uid} (root doc).
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    console.error("[webhook/stripe] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return Response.json({ error: "Not configured." }, { status: 503 });
  }

  // Read raw body for signature verification
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook/stripe] Signature verification failed:", err);
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  const db = getAdminFirestore();
  if (!db) {
    console.error("[webhook/stripe] Firebase Admin not configured — cannot persist entitlement");
    return Response.json({ error: "Entitlement persistence not configured." }, { status: 503 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(db, session);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(db, subscription);
      break;
    }
    default:
      // Acknowledge unhandled events without error
      break;
  }

  return Response.json({ received: true });
}

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(
  db: FirebaseFirestore.Firestore,
  session: Stripe.Checkout.Session,
) {
  const planId = session.metadata?.nb_plan_id;
  const uid = session.metadata?.nb_firebase_uid;

  if (!planId || !uid) {
    console.warn("[webhook/stripe] checkout.session.completed missing metadata", {
      planId,
      uid,
      sessionId: session.id,
    });
    return;
  }

  const plan = ALL_PLANS.get(planId);
  if (!plan || plan.purchaseType === "free") {
    console.warn("[webhook/stripe] Invalid plan in checkout metadata:", planId);
    return;
  }

  const entitlementData: Record<string, unknown> = {
    planId,
    purchaseType: plan.purchaseType,
    storageGb: plan.storageGb,
    maxSavedCards: plan.maxSavedCards,
    stripeCustomerId: session.customer ?? null,
    stripeSessionId: session.id,
    activatedAt: FieldValue.serverTimestamp(),
    status: "active",
  };

  // For subscriptions, store the subscription ID for later cancellation handling
  if (plan.purchaseType === "monthly" && session.subscription) {
    entitlementData.stripeSubscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription.id;
  }

  try {
    await db.doc(`users/${uid}`).set(
      { entitlement: entitlementData },
      { merge: true },
    );
    console.log("[webhook/stripe] Entitlement activated:", { uid, planId });

    // Sync supporter status to the supporters collection
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
    await db.collection(COLLECTIONS.SUPPORTERS).doc(uid).set(
      {
        uid,
        stripeCustomerId: customerId ?? null,
        email: session.customer_details?.email ?? null,
        status: "active",
        planId,
        activatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    console.log("[webhook/stripe] Supporter synced:", { uid, planId });
  } catch (err) {
    console.error("[webhook/stripe] Failed to write entitlement:", err);
  }
}

async function handleSubscriptionDeleted(
  db: FirebaseFirestore.Firestore,
  subscription: Stripe.Subscription,
) {
  const uid = subscription.metadata?.nb_firebase_uid;

  if (!uid) {
    console.warn(
      "[webhook/stripe] subscription.deleted missing nb_firebase_uid metadata",
      { subscriptionId: subscription.id },
    );
    return;
  }

  try {
    // Read current entitlement to verify it matches this subscription
    const userDoc = await db.doc(`users/${uid}`).get();
    const current = userDoc.data()?.entitlement;

    if (
      current?.stripeSubscriptionId &&
      typeof subscription.id === "string" &&
      current.stripeSubscriptionId !== subscription.id
    ) {
      // Different subscription — don't reset (user may have upgraded)
      return;
    }

    await db.doc(`users/${uid}`).set(
      {
        entitlement: {
          planId: "free",
          purchaseType: "free",
          storageGb: null,
          maxSavedCards: 2,
          stripeSubscriptionId: null,
          status: "cancelled",
          cancelledAt: FieldValue.serverTimestamp(),
        },
      },
      { merge: true },
    );

    // Sync supporter cancellation
    await db.collection(COLLECTIONS.SUPPORTERS).doc(uid).set(
      {
        status: "cancelled",
        cancelledAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    console.log("[webhook/stripe] Subscription cancelled, reset to free:", { uid });
  } catch (err) {
    console.error("[webhook/stripe] Failed to reset entitlement:", err);
  }
}
