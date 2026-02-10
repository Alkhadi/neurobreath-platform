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
    // Show welcome modal only if:
    // 1. User has not completed onboarding
    // 2. User has no existing cards
    // 3. This is their first visit
    if (!hasCompletedOnboarding() && !hasExistingCards) {
      // Small delay to avoid jarring immediate popup
      const timer = setTimeout(() => setIsOpen(true), 300);
      return () => clearTimeout(timer);
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
            Create a share-ready digital card in under 60 seconds. No sign-up — your data stays on this device.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong className="text-blue-700">Saved locally.</strong> This card is stored on this device only —
              nothing is uploaded unless you share.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            onClick={handleCreateCard}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
          >
            Create My Card
          </Button>
          <Button
            onClick={handleUseExample}
            variant="outline"
            className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Use Example Template
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
