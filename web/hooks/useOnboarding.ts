/**
 * useOnboarding Hook
 *
 * CRITICAL: This hook controls onboarding visibility throughout the app.
 *
 * Onboarding displays when:
 * - User has no learner profile in localStorage
 * - User has not dismissed/completed onboarding
 *
 * Onboarding hides when:
 * - User creates a profile (learnerProfile exists)
 * - User explicitly dismisses onboarding
 * - User completes onboarding flow
 *
 * MAINTENANCE NOTE:
 * - Do NOT modify visibility logic without updating all onboarding components
 * - Always test both first-time and returning user flows
 * - localStorage keys must remain consistent across the app
 */

import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface LearnerProfile {
  id: string;
  name: string;
  createdAt: string;
  // Add other profile fields as needed
}

interface OnboardingState {
  // Core visibility flags
  shouldShowOnboarding: boolean;
  hasProfile: boolean;
  isFirstVisit: boolean;

  // Actions
  completeOnboarding: () => void;
  dismissOnboarding: () => void;
  resetOnboarding: () => void; // For testing/debugging only
}

const STORAGE_KEYS = {
  LEARNER_PROFILE: 'learnerProfile',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  ONBOARDING_DISMISSED: 'onboardingDismissed',
} as const;

export function useOnboarding(): OnboardingState {
  const [mounted, setMounted] = useState(false);

  // Initialize with safe defaults for SSR
  const [learnerProfile] = useLocalStorage<LearnerProfile | null>(
    STORAGE_KEYS.LEARNER_PROFILE,
    null
  );

  const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage<boolean>(
    STORAGE_KEYS.ONBOARDING_COMPLETED,
    false
  );

  const [onboardingDismissed, setOnboardingDismissed] = useLocalStorage<boolean>(
    STORAGE_KEYS.ONBOARDING_DISMISSED,
    false
  );

  // Prevent hydration mismatch - only render after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Derived state: user has a profile
  const hasProfile = !!learnerProfile;

  // Derived state: is this a first-time visitor?
  const isFirstVisit = !hasProfile && !onboardingCompleted && !onboardingDismissed;

  /**
   * CRITICAL VISIBILITY LOGIC
   *
   * Onboarding should show ONLY when ALL of these are true:
   * 1. Component is mounted (prevent SSR issues)
   * 2. User has NO profile
   * 3. User has NOT completed onboarding
   * 4. User has NOT dismissed onboarding
   *
   * If ANY condition fails, onboarding must be hidden.
   */
  const shouldShowOnboarding = mounted && !hasProfile && !onboardingCompleted && !onboardingDismissed;

  /**
   * Complete onboarding
   * Called when user successfully creates a profile or finishes onboarding flow
   */
  const completeOnboarding = () => {
    setOnboardingCompleted(true);
  };

  /**
   * Dismiss onboarding
   * Called when user explicitly closes/skips onboarding
   * Allows them to use the app as guest without seeing onboarding again
   */
  const dismissOnboarding = () => {
    setOnboardingDismissed(true);
  };

  /**
   * Reset onboarding (TESTING/DEBUG ONLY)
   * DO NOT expose this in production UI
   */
  const resetOnboarding = () => {
    setOnboardingCompleted(false);
    setOnboardingDismissed(false);
  };

  return {
    shouldShowOnboarding,
    hasProfile,
    isFirstVisit,
    completeOnboarding,
    dismissOnboarding,
    resetOnboarding,
  };
}
