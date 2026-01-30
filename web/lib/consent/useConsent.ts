'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getConsent, hasConsent, saveConsent, type ConsentState } from '@/lib/consent/consentStore';

/**
 * React hook for accessing and updating consent state
 */
export function useConsent() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentState>(() => getConsent());
  const [hasSavedConsent, setHasSavedConsent] = useState<boolean>(false);
  const [isSyncingFromAccount, setIsSyncingFromAccount] = useState<boolean>(false);

  useEffect(() => {
    // Update state on mount (SSR hydration)
    const currentConsent = getConsent();
    const hasExistingConsent = hasConsent();
    
    console.log('[useConsent] Initial state:', { hasExistingConsent, currentConsent });
    
    setConsent(currentConsent);
    setHasSavedConsent(hasExistingConsent);

    // Listen for consent changes
    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentState>;
      setConsent(customEvent.detail);
      setHasSavedConsent(true);
    };

    window.addEventListener('consentchange', handleConsentChange);

    return () => {
      window.removeEventListener('consentchange', handleConsentChange);
    };
  }, []);

  // Opportunistically sync consent to/from the user's account so consent can be shared across devices.
  // We don't depend on `useSession()` here because this hook is used globally and must be safe during build.
  useEffect(() => {
    let active = true;

    (async () => {
      const localHas = hasConsent();

      // If the device already has consent, push it up to the account (best-effort; will no-op for anonymous users).
      if (localHas) {
        const local = getConsent();
        await fetch('/api/account/consent', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            functional: local.functional,
            analytics: local.analytics,
            version: local.version,
            timestamp: local.timestamp,
          }),
        }).catch(() => null);
        return;
      }

      // Otherwise, try to hydrate consent from the account.
      if (active) setIsSyncingFromAccount(true);

      const res = await fetch('/api/account/consent', { method: 'GET' }).catch(() => null);
      if (!res || !res.ok) return;

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; consent?: { functional?: boolean; analytics?: boolean } | null }
        | null;

      const serverConsent = data?.ok ? data?.consent : null;
      if (!serverConsent) return;

      // Save to the device store; this also sets hasSavedConsent via the event listener.
      saveConsent({
        essential: true,
        functional: !!serverConsent.functional,
        analytics: !!serverConsent.analytics,
      });
    })()
      .catch(() => null)
      .finally(() => {
        if (!active) return;
        setIsSyncingFromAccount(false);
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  const updateConsent = (newConsent: Omit<ConsentState, 'timestamp' | 'version'>) => {
    saveConsent(newConsent);
    setConsent(getConsent());
    setHasSavedConsent(true);

    const next = getConsent();
    fetch('/api/account/consent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        functional: next.functional,
        analytics: next.analytics,
        version: next.version,
        timestamp: next.timestamp,
      }),
    }).catch(() => null);
  };

  return {
    consent,
    hasSavedConsent,
    updateConsent,
    isSyncingFromAccount,
  };
}
