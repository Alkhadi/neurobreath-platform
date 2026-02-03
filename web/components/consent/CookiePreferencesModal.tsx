'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { useConsent } from '@/lib/consent/useConsent';
import { LEGAL_CONFIG } from '@/lib/legal/legalConfig';
import { useUniversalProgress } from '@/contexts/UniversalProgressContext';

interface CookiePreferencesModalProps {
  onClose: () => void;
}

export function CookiePreferencesModal({ onClose }: CookiePreferencesModalProps) {
  const { consent, updateConsent } = useConsent();
  const { resetProgress } = useUniversalProgress();
  const [functional, setFunctional] = useState(consent.functional);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    updateConsent({ essential: true, functional, analytics });
    onClose();
  };

  const handleAcceptAll = () => {
    setFunctional(true);
    setAnalytics(true);
    updateConsent({ essential: true, functional: true, analytics: true });
    onClose();
  };

  const handleRejectAll = () => {
    setFunctional(false);
    setAnalytics(false);
    updateConsent({ essential: true, functional: false, analytics: false });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="cookie-modal-title"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 id="cookie-modal-title" className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Cookie Preferences
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            aria-label="Close cookie preferences"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-6">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            We use cookies and local storage to provide a great experience. You can choose which categories to enable. 
            Changes take effect immediately.
          </p>

          {/* Progress controls */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">Progress</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  If you enable Functional storage, we can save completed activities on this device. If you're signed in, we can also
                  store progress in your account so it’s available across devices.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  You can delete your progress at any time.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => resetProgress()}
                  className="px-4 py-2 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  Reset progress
                </button>
                <button
                  type="button"
                  onClick={() => resetProgress({ withdrawConsent: true })}
                  className="px-4 py-2 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Withdraw consent
                </button>
              </div>
            </div>
          </div>

          {/* Essential */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {LEGAL_CONFIG.cookieCategories.essential.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {LEGAL_CONFIG.cookieCategories.essential.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Examples: {LEGAL_CONFIG.cookieCategories.essential.examples.join(', ')}
                </p>
              </div>
              <div className="ml-4">
                <div className="flex items-center h-10">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 opacity-50 cursor-not-allowed"
                    aria-label="Essential cookies (always enabled)"
                  />
                  <span className="ml-2 text-xs text-slate-500">Always on</span>
                </div>
              </div>
            </div>
          </div>

          {/* Functional */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {LEGAL_CONFIG.cookieCategories.functional.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {LEGAL_CONFIG.cookieCategories.functional.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Examples: {LEGAL_CONFIG.cookieCategories.functional.examples.join(', ')}
                </p>
              </div>
              <div className="ml-4">
                <div className="flex items-center h-10">
                  <input
                    type="checkbox"
                    checked={functional}
                    onChange={(e) => setFunctional(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Enable functional cookies"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {LEGAL_CONFIG.cookieCategories.analytics.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {LEGAL_CONFIG.cookieCategories.analytics.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Examples: {LEGAL_CONFIG.cookieCategories.analytics.examples.join(', ')}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950 p-2 rounded">
                  <strong>Note:</strong> Currently not used. This option is for future use only.
                </p>
              </div>
              <div className="ml-4">
                <div className="flex items-center h-10">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Enable analytics cookies"
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            For more information, see our <Link href="/uk/legal/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">Cookie Policy</Link> and{' '}
            <Link href="/uk/legal/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-2 justify-end">
          <button
            type="button"
            onClick={handleRejectAll}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
