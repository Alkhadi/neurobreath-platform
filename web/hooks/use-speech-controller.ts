/**
 * Speech Controller Hook for NeuroBreath Buddy
 * Centralized TTS/audio playback management with stop functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

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

  // Speak text for a specific message
  const speak = useCallback((messageId: string, text: string) => {
    // Stop any ongoing speech first
    stop();

    // Clean text for speech (remove markdown, links, etc.)
    const cleanText = text
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italic
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Extract link text
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/\n{3,}/g, '\n\n') // Reduce excessive newlines
      .replace(/•/g, '. ') // Replace bullets with periods
      .trim();

    if (!cleanText) {
      return;
    }

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
