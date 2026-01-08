'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  loadPreferences,
  savePreferences,
  Preferences
} from '@/lib/progress-store-enhanced';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    audience: 'teacher',
    country: 'UK'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load on mount - only runs on client side
  useEffect(() => {
    setPreferences(loadPreferences());
    setIsLoading(false);
  }, []);

  const updateAudience = useCallback((audience: Preferences['audience']) => {
    const updated = { ...preferences, audience };
    savePreferences(updated);
    setPreferences(updated);
  }, [preferences]);

  const updateCountry = useCallback((country: Preferences['country']) => {
    const updated = { ...preferences, country };
    savePreferences(updated);
    setPreferences(updated);
  }, [preferences]);

  return {
    preferences,
    isLoading,
    updateAudience,
    updateCountry
  };
};
