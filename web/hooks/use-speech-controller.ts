/**
 * Speech Controller Hook for NeuroBreath Buddy
 * Centralized TTS/audio playback management with stop functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { sanitizeForTTS } from '@/lib/speech/sanitizeForTTS';

export interface UseSpeechControllerReturn {
  speak: (messageId: string, text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  speakingMessageId: string | null;
}

export function useSpeechController(): UseSpeechControllerReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any ongoing speech
  const stop = useCallback(() => {
    // Stop Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Stop HTML Audio Element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Clear utterance reference
    utteranceRef.current = null;

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
    // Stop any ongoing speech first
    stop();

    const cleanText = sanitizeForTTS(text, { locale: 'en-GB' });

    if (!cleanText) return;

    // Check if Web Speech API is available
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          setIsSpeaking(true);
          setSpeakingMessageId(messageId);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
          utteranceRef.current = null;
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(false);
          setSpeakingMessageId(null);
          utteranceRef.current = null;
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Failed to initialize speech:', error);
      }
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }, [stop]);

  return {
    speak,
    stop,
    isSpeaking,
    speakingMessageId,
  };
}
