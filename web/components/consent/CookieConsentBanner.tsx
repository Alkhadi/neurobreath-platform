'use client';

import { useState, useEffect } from 'react';
import { useConsent } from '@/lib/consent/useConsent';
import { CookiePreferencesModal } from './CookiePreferencesModal';

export function CookieConsentBanner() {
  const { hasSavedConsent, updateConsent, isSyncingFromAccount } = useConsent();
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show banner only if consent not yet saved
    if (!hasSavedConsent && !isSyncingFromAccount) {
      // Delay slightly for better UX (avoid flash on page load)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasSavedConsent, isSyncingFromAccount]);

  const handleAcceptAll = () => {
    updateConsent({ essential: true, functional: true, analytics: true });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    updateConsent({ essential: true, functional: false, analytics: false });
    setIsVisible(false);
  };

  const handleManagePreferences = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsVisible(false); // Hide banner after preferences saved
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t-2 border-slate-200 dark:border-slate-700 shadow-lg"
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
      >
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <h2 id="cookie-banner-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                We value your privacy
              </h2>
              <p id="cookie-banner-description" className="text-sm text-slate-700 dark:text-slate-300">
                We use cookies and local storage to provide essential functionality and, with your consent, to enhance your experience. 
                We do not use third-party advertising. Optional analytics (e.g. Vercel Analytics) are only enabled if you consent.
                You can manage your preferences at any time.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Reject all
              </button>
              <button
                type="button"
                onClick={handleManagePreferences}
                className="px-6 py-2.5 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-900 dark:text-slate-100 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Manage preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && <CookiePreferencesModal onClose={handleModalClose} />}
    </>
  );
}
