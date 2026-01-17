/**
 * Guest Preferences Hook
 * 
 * Composable hook for managing guest profile preferences
 * (locale, reading level, accessibility settings).
 */

'use client';

import { useUserPreferences } from './useUserPreferences';
import type {
  GuestPreferences,
  RegionPreference,
  ReadingLevel,
  ReducedMotionPreference,
  TextSizePreference,
  ContrastPreference,
} from './schema';

export function useGuestPreferences() {
  const { state, updateState } = useUserPreferences();

  const setRegionPreference = (regionPreference: RegionPreference) => {
    updateState({
      preferences: {
        ...state.preferences,
        regionPreference,
      },
    });
  };

  const setReadingLevel = (readingLevel: ReadingLevel) => {
    updateState({
      preferences: {
        ...state.preferences,
        readingLevel,
      },
    });
  };

  const setDyslexiaMode = (enabled: boolean) => {
    updateState({
      preferences: {
        ...state.preferences,
        dyslexiaMode: enabled,
      },
    });
  };

  const setReducedMotion = (reducedMotion: ReducedMotionPreference) => {
    updateState({
      preferences: {
        ...state.preferences,
        reducedMotion,
      },
    });
  };

  const setTextSize = (textSize: TextSizePreference) => {
    updateState({
      preferences: {
        ...state.preferences,
        textSize,
      },
    });
  };

  const setContrast = (contrast: ContrastPreference) => {
    updateState({
      preferences: {
        ...state.preferences,
        contrast,
      },
    });
  };

  const setPreferences = (partial: Partial<GuestPreferences>) => {
    updateState({
      preferences: {
        ...state.preferences,
        ...partial,
      },
    });
  };

  return {
    preferences: state.preferences,
    setRegionPreference,
    setReadingLevel,
    setDyslexiaMode,
    setReducedMotion,
    setTextSize,
    setContrast,
    setPreferences,
  };
}
