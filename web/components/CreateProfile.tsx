/**
 * CreateProfile Component
 *
 * LEGACY WRAPPER: This component now wraps the new OnboardingCard with OnboardingGate.
 *
 * IMPORTANT: This component maintains backward compatibility but uses the new
 * gated onboarding system internally.
 *
 * For new implementations, prefer using OnboardingCard directly with OnboardingGate.
 */

'use client';

import { OnboardingGate } from '@/components/OnboardingGate';
import { OnboardingCard } from '@/components/OnboardingCard';

export function CreateProfile() {
  return (
    <OnboardingGate>
      <OnboardingCard />
    </OnboardingGate>
  );
}
