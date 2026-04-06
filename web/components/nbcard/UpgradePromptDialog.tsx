"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Crown, Zap } from "lucide-react";
import {
  ONE_TIME_PLANS,
  MONTHLY_PLANS,
  formatGbp,
  planPriceLabel,
  type NbcardPlan,
} from "@/lib/nb-card/plans";

interface UpgradePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradePromptDialog({
  open,
  onOpenChange,
}: UpgradePromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Crown className="h-5 w-5 text-amber-500" />
            Upgrade your NB-Card storage
          </DialogTitle>
          <DialogDescription>
            Free accounts can save up to 2 cards. Upgrade for more storage and
            unlimited saved cards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* One-time plans */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              One-time payment
              <span className="ml-1 text-[10px] font-normal text-green-700 bg-green-50 rounded-full px-1.5 py-0.5">
                Best value
              </span>
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              Pay once, keep your storage permanently.
            </p>
            <div className="space-y-1.5">
              {ONE_TIME_PLANS.filter((p) => p.available).map((plan) => (
                <PlanRow key={plan.id} plan={plan} />
              ))}
            </div>
          </div>

          <Separator />

          {/* Monthly plans */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Monthly subscription
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              Lower upfront cost. Storage active while subscribed.
            </p>
            <div className="space-y-1.5">
              {MONTHLY_PLANS.filter((p) => p.available).map((plan) => (
                <PlanRow key={plan.id} plan={plan} />
              ))}
            </div>
          </div>

          {/* Payment pending notice */}
          <p className="text-[11px] text-gray-400 text-center pt-1">
            Payment processing is coming soon. Plans shown for preview.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function PlanRow({ plan }: { plan: NbcardPlan }) {
  const monthlyEquiv =
    plan.purchaseType === "one-time" && plan.oneTimePriceGbp != null
      ? ` (≈ ${formatGbp(Math.round(plan.oneTimePriceGbp / 12))}/mo)`
      : null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:border-purple-300 hover:bg-purple-50/40 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {plan.displayName}
          <span className="ml-1.5 text-xs font-normal text-gray-500">
            {plan.storageGb} GB
          </span>
        </p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-gray-800">
        {planPriceLabel(plan)}
      </span>
      {monthlyEquiv && (
        <span className="shrink-0 text-[10px] text-green-700">{monthlyEquiv}</span>
      )}
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 text-xs h-7 px-3"
        disabled
        title="Payment processing coming soon"
      >
        Select
      </Button>
    </div>
  );
}
