/**
 * TTS Preferences Hook
 * 
 * Composable hook for managing text-to-speech settings.
 */

'use client';

import { useUserPreferences } from './useUserPreferences';
import type { TTSSettings } from './schema';

export function useTTSPreferences() {
  const { state, updateState } = useUserPreferences();

  const setTTSEnabled = (enabled: boolean) => {
    updateState({
      preferences: {
        ...state.preferences,
        tts: {
          ...state.preferences.tts,
          enabled,
        },
      },
    });
  };

  const setAutoSpeak = (autoSpeak: boolean) => {
    updateState({
      preferences: {
        ...state.preferences,
        tts: {
          ...state.preferences.tts,
          autoSpeak,
        },
      },
    });
  };

  const setRate = (rate: number) => {
    // Clamp between 0.8 and 1.2
    const clampedRate = Math.max(0.8, Math.min(1.2, rate));
    updateState({
      preferences: {
        ...state.preferences,
        tts: {
          ...state.preferences.tts,
          rate: clampedRate,
        },
      },
    });
  };

  const setVoice = (voice: string) => {
    updateState({
      preferences: {
        ...state.preferences,
        tts: {
          ...state.preferences.tts,
          voice,
        },
      },
    });
  };

  const setFilterNonAlphanumeric = (filter: boolean) => {
    updateState({
      preferences: {
        ...state.preferences,
        tts: {
          ...state.preferences.tts,
          filterNonAlphanumeric: filter,
        },
      },
    });
  };

  const setPreferUKVoice = (prefer: boolean) => {
    updateState({
      preferences: {
        ...state.preferences,
        tts: {
          ...state.preferences.tts,
          preferUKVoice: prefer,
        },
      },
    });
  };

  const setTTSSettings = (partial: Partial<TTSSettings>) => {
    updateState({
      preferences: {
        ...state.preferences,
        tts: {
          ...state.preferences.tts,
          ...partial,
        },
      },
    });
  };

  return {
    ttsSettings: state.preferences.tts,
    setTTSEnabled,
    setAutoSpeak,
    setRate,
    setVoice,
    setFilterNonAlphanumeric,
    setPreferUKVoice,
    setTTSSettings,
  };
}
