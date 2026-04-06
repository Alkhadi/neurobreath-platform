"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Crown, Zap, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FREE_PLAN,
  ONE_TIME_PLANS,
  MONTHLY_PLANS,
  formatGbp,
  planPriceLabel,
  type NbcardPlan,
} from "@/lib/nb-card/plans";
import { startCheckout } from "@/lib/stripe/checkout-client";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useState } from "react";

// ─── Main page (wrapped in Suspense for useSearchParams) ─────────────────────

export function PricingPageClient() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  );
}

function PricingContent() {
  const params = useSearchParams();
  const success = params.get("success") === "true";
  const cancelled = params.get("cancelled") === "true";
  const successPlan = params.get("plan");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#0f172a]">
      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-amber-400 mb-6">
            <Crown className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            NB-Card Plans
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Save, organise, and access your NB-Cards across devices. Free
            accounts can save up to 2 cards. Upgrade for unlimited cards and
            cloud storage.
          </p>
        </div>
      </section>

      {/* Status banners */}
      {success && (
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-green-800">Payment successful</p>
              <p className="text-sm text-green-700 mt-1">
                Thank you! Your{" "}
                {successPlan ? `${successPlan} ` : ""}plan is being activated.
                It may take a moment to appear on your account.
              </p>
            </div>
          </div>
        </div>
      )}

      {cancelled && (
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-gray-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-gray-800">Checkout cancelled</p>
              <p className="text-sm text-gray-600 mt-1">
                No payment was taken. You can choose a plan below whenever
                you&apos;re ready.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans grid */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        {/* Free plan */}
        <div className="mb-12">
          <FreePlanCard />
        </div>

        {/* One-time plans */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              One-time purchase
            </h2>
            <Badge variant="success" className="text-[10px]">
              Best value
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Pay once, keep your storage permanently. No recurring charges.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ONE_TIME_PLANS.filter((p) => p.available).map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        <Separator className="mb-12" />

        {/* Monthly plans */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Monthly subscription
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Lower upfront cost. Storage is active while your subscription is
            active.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MONTHLY_PLANS.filter((p) => p.available).map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="max-w-2xl mx-auto text-center space-y-2 text-xs text-gray-400 dark:text-gray-500">
          <p>One-time plans are permanent — pay once and your storage never expires.</p>
          <p>Monthly plans stay active while your subscription is active.</p>
          <p>Free users can save up to 2 cards.</p>
          <p>
            All payments are handled securely by{" "}
            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              Stripe
            </a>
            . We never see or store your card details.
          </p>
        </div>
      </section>
    </main>
  );
}

// ─── Free plan card ──────────────────────────────────────────────────────────

function FreePlanCard() {
  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Free
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Save up to {FREE_PLAN.maxSavedCards} cards locally or in the cloud.
            No account required for local storage.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">£0</p>
          <p className="text-xs text-gray-400">forever</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Plan card with checkout CTA ─────────────────────────────────────────────

function PlanCard({ plan }: { plan: NbcardPlan }) {
  const { user, status } = useFirebaseAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthlyEquiv =
    plan.purchaseType === "one-time" && plan.oneTimePriceGbp != null
      ? formatGbp(Math.round(plan.oneTimePriceGbp / 12))
      : null;

  async function handleSelect() {
    if (!user?.uid || status !== "authenticated") {
      setError("Please sign in to upgrade.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await startCheckout(plan.id, user.uid);
    if (result.url) {
      window.location.href = result.url;
    } else {
      setError(result.error ?? "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {plan.displayName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {plan.storageGb} GB storage
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {planPriceLabel(plan)}
            </p>
            {monthlyEquiv && (
              <p className="text-[10px] text-green-600">≈ {monthlyEquiv}/mo</p>
            )}
          </div>
        </div>

        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-4">
          <li>✓ Unlimited saved cards</li>
          <li>✓ Cloud sync across devices</li>
          <li>
            ✓{" "}
            {plan.purchaseType === "one-time"
              ? "Permanent — never expires"
              : "Active while subscribed"}
          </li>
        </ul>

        <Button
          onClick={handleSelect}
          disabled={loading}
          className="w-full"
          size="sm"
        >
          {loading ? "Redirecting…" : "Select"}
        </Button>

        {error && (
          <p className="text-xs text-red-600 mt-2 text-center">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
