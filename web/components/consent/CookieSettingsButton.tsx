'use client';

import { useState, useEffect } from 'react';
import { CookiePreferencesModal } from './CookiePreferencesModal';

type CookieSettingsWindow = Window & { __openCookieSettings?: () => void };

export function CookieSettingsButton() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Expose global function for footer link
    if (typeof window !== 'undefined') {
      const win = window as CookieSettingsWindow;
      win.__openCookieSettings = () => {
        setShowModal(true);
      };
    }
  }, []);

  if (!showModal) return null;

  return <CookiePreferencesModal onClose={() => setShowModal(false)} />;
}
