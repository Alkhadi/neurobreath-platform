/**
 * User Preferences Provider
 * 
 * Loads unified state, provides context, and applies accessibility preferences
 * via data attributes on html/body elements (no inline CSS).
 */

'use client';

import React, { createContext, useEffect, useState, useCallback } from 'react';
import {
  loadUserPreferences,
  saveUserPreferencesDebounced,
  exportUserPreferences,
  importUserPreferences,
  resetUserPreferences as resetStorage,
} from '../../lib/user-preferences/storage';
import type { UserPreferencesState } from '../../lib/user-preferences/schema';
import { DEFAULT_USER_PREFERENCES_STATE } from '../../lib/user-preferences/schema';
import { initializeTTS } from '../../lib/tts/engine';

// Context type
export interface UserPreferencesContextValue {
  state: UserPreferencesState;
  updateState: (partial: Partial<UserPreferencesState>) => void;
  exportPreferences: () => string;
  importPreferences: (json: string) => void;
  resetPreferences: () => void;
  isLoaded: boolean;
}

export const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(null);

interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export function UserPreferencesProvider({ children }: UserPreferencesProviderProps) {
  const [state, setState] = useState<UserPreferencesState>(DEFAULT_USER_PREFERENCES_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial state
  useEffect(() => {
    const loadedState = loadUserPreferences();
    setState(loadedState);
    setIsLoaded(true);

    // Initialize TTS
    initializeTTS().catch((error) => {
      console.error('[UserPreferences] Failed to initialize TTS:', error);
    });
  }, []);

  // Apply preferences to DOM via data attributes
  useEffect(() => {
    if (!isLoaded || typeof document === 'undefined' || !state?.preferences) return;

    const html = document.documentElement;

    // Dyslexia mode
    if (state.preferences.dyslexiaMode) {
      html.setAttribute('data-dyslexia', 'on');
    } else {
      html.removeAttribute('data-dyslexia');
    }

    // Reading level
    html.setAttribute('data-reading-level', state.preferences.readingLevel);

    // Text size
    if (state.preferences.textSize !== 'system') {
      html.setAttribute('data-text-size', state.preferences.textSize);
    } else {
      html.removeAttribute('data-text-size');
    }

    // Contrast
    if (state.preferences.contrast !== 'system') {
      html.setAttribute('data-contrast', state.preferences.contrast);
    } else {
      html.removeAttribute('data-contrast');
    }

    // Reduced motion
    if (state.preferences.reducedMotion === 'on') {
      html.setAttribute('data-reduced-motion', 'on');
    } else if (state.preferences.reducedMotion === 'off') {
      html.setAttribute('data-reduced-motion', 'off');
    } else {
      html.removeAttribute('data-reduced-motion');
    }
  }, [state.preferences, isLoaded]);

  // Update state with debounced persistence
  const updateState = useCallback(
    (partial: Partial<UserPreferencesState>) => {
      setState((prev) => {
        const newState = {
          ...prev,
          ...partial,
          updatedAt: new Date().toISOString(),
        };
        saveUserPreferencesDebounced(newState);
        return newState;
      });
    },
    []
  );

  // Export preferences
  const exportPreferences = useCallback(() => {
    return exportUserPreferences(state);
  }, [state]);

  // Import preferences
  const importPreferences = useCallback((json: string) => {
    try {
      const imported = importUserPreferences(json);
      setState(imported);
    } catch (error) {
      console.error('[UserPreferences] Import failed:', error);
      throw error;
    }
  }, []);

  // Reset preferences
  const resetPreferences = useCallback(() => {
    const fresh = resetStorage();
    setState(fresh);
  }, []);

  const contextValue: UserPreferencesContextValue = {
    state,
    updateState,
    exportPreferences,
    importPreferences,
    resetPreferences,
    isLoaded,
  };

  return (
    <UserPreferencesContext.Provider value={contextValue}>
      {children}
    </UserPreferencesContext.Provider>
  );
}
