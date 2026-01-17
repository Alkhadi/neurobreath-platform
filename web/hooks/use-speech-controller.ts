/**
 * Speech Controller Hook for NeuroBreath Buddy
 * Integrated with unified TTS engine from Phase 1
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTTSPreferences } from '@/lib/user-preferences/useTTSPreferences';
import { speak as engineSpeak, stop as engineStop, getIsSpeaking } from '@/lib/tts/engine';

export interface UseSpeechControllerReturn {
  speak: (messageId: string, text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  speakingMessageId: string | null;
}

export function useSpeechController(): UseSpeechControllerReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const { ttsSettings } = useTTSPreferences();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check speaking state periodically
  useEffect(() => {
    checkIntervalRef.current = setInterval(() => {
      const speaking = getIsSpeaking();
      if (!speaking && isSpeaking) {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      }
    }, 200);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isSpeaking]);

  // Stop any ongoing speech
  const stop = useCallback(() => {
    engineStop();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Speak text for a specific message
  const speak = useCallback((messageId: string, text: string) => {
    // Only speak if TTS is enabled
    if (!ttsSettings.enabled) {
      return;
    }

    // Stop any ongoing speech first
    stop();

    engineSpeak(text, {
      settings: ttsSettings,
      onStart: () => {
        setIsSpeaking(true);
        setSpeakingMessageId(messageId);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      },
      onError: (error) => {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      },
    });
  }, [ttsSettings, stop]);

  return {
    speak,
    stop,
    isSpeaking,
    speakingMessageId,
  };
}
