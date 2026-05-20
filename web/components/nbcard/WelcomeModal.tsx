"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { hasCompletedOnboarding, markOnboardingComplete } from "@/lib/nb-card/onboarding";

interface WelcomeModalProps {
  hasExistingCards: boolean;
  onCreateCard: () => void;
  onUseExample: () => void;
}

export function WelcomeModal({ hasExistingCards, onCreateCard, onUseExample }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Phase 1 Sensory Cleanse: do NOT auto-open the welcome modal.
    // Interruptive modals on page load have been removed. Onboarding is
    // surfaced via inline CTAs on the NB-Card hub; the dialog now only
    // opens when explicitly triggered by user action.
    if (!hasCompletedOnboarding() && !hasExistingCards) {
      // Mark as complete on first mount so no future auto-open is attempted.
      markOnboardingComplete();
    }
  }, [hasExistingCards]);

  const handleClose = () => {
    markOnboardingComplete();
    setIsOpen(false);
  };

  const handleCreateCard = () => {
    markOnboardingComplete();
    setIsOpen(false);
    onCreateCard();
  };

  const handleUseExample = () => {
    markOnboardingComplete();
    setIsOpen(false);
    onUseExample();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            Welcome to NB-Card!
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700 pt-2">
            Create a share-ready card in under 60 seconds. No sign-up required &mdash; your data stays on this device.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              <strong className="text-blue-700">Saved locally.</strong> This card is stored on this device only &mdash;
              nothing is uploaded unless you share.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:gap-3">
          <Button
            onClick={handleCreateCard}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm px-4 py-2.5 min-h-[44px]"
          >
            Create My Card
          </Button>
          <Button
            onClick={handleUseExample}
            variant="outline"
            className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 text-sm px-4 py-2.5 min-h-[44px]"
          >
            Use Example Template
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-900 text-sm px-4 py-2.5 min-h-[44px]"
          >
            <a href={`/uk/login?callbackUrl=${encodeURIComponent("/resources/nb-card")}`}>
              Sign in to save across devices
            </a>
          </Button>
        </DialogFooter>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close welcome"
        >
          <X className="h-5 w-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
