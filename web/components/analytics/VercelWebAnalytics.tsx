'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useConsent } from '@/lib/consent/useConsent';

export function VercelWebAnalytics() {
  const { consent, hasSavedConsent, isSyncingFromAccount } = useConsent();

  // Default to off until consent is explicitly saved (or synced from account).
  if (!hasSavedConsent || isSyncingFromAccount) return null;
  if (!consent.analytics) return null;

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
