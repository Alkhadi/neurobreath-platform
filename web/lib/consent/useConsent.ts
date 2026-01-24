'use client';

import { useState, useEffect } from 'react';
import { getConsent, hasConsent, saveConsent, type ConsentState } from '@/lib/consent/consentStore';

/**
 * React hook for accessing and updating consent state
 */
export function useConsent() {
  const [consent, setConsent] = useState<ConsentState>(() => getConsent());
  const [hasSavedConsent, setHasSavedConsent] = useState<boolean>(false);

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

  const updateConsent = (newConsent: Omit<ConsentState, 'timestamp' | 'version'>) => {
    saveConsent(newConsent);
    setConsent(getConsent());
    setHasSavedConsent(true);
  };

  return {
    consent,
    hasSavedConsent,
    updateConsent,
  };
}
