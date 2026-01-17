'use client';

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import {
  getLanguagePreference,
  saveLanguagePreference,
} from '../utils/language';
import styles from '../styles/Page.module.css';

interface LanguageToggleProps {
  onLanguageChange: (language: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  onLanguageChange,
}) => {
  const [language, setLanguage] = useState<Language>('en-GB');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLanguage = getLanguagePreference();
    setLanguage(savedLanguage);
    onLanguageChange(savedLanguage);
  }, [onLanguageChange]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    saveLanguagePreference(newLanguage, false);
    onLanguageChange(newLanguage);
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className={styles.languageToggle} role="group" aria-label="Language selection">
      <button
        className={`${styles.languageButton} ${language === 'en-GB' ? styles.active : ''}`}
        onClick={() => handleLanguageChange('en-GB')}
        aria-pressed={language === 'en-GB'}
        aria-label="Switch to UK English"
      >
        <span role="img" aria-label="UK flag">
          🇬🇧
        </span>
        <span>UK</span>
      </button>
      <button
        className={`${styles.languageButton} ${language === 'en-US' ? styles.active : ''}`}
        onClick={() => handleLanguageChange('en-US')}
        aria-pressed={language === 'en-US'}
        aria-label="Switch to US English"
      >
        <span role="img" aria-label="US flag">
          🇺🇸
        </span>
        <span>US</span>
      </button>
    </div>
  );
};
