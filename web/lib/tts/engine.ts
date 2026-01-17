/**
 * TTS (Text-to-Speech) Engine
 * 
 * Unified speech synthesis engine using Web Speech API.
 * Respects user preferences from unified state.
 */

import { TTSSettings } from '../user-preferences/schema';
import { sanitizeForTTS } from './sanitize';

// Speech state
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentUtterance: SpeechSynthesisUtterance | null = null;
let isSpeaking = false;

/**
 * Check if Web Speech API is available
 */
export function isTTSAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Get available voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isTTSAvailable()) return [];
  return window.speechSynthesis.getVoices();
}

/**
 * Find best voice based on settings
 */
function selectVoice(settings: TTSSettings): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  
  if (voices.length === 0) return null;

  // If specific voice requested
  if (settings.voice && settings.voice !== 'system') {
    const match = voices.find((v) => v.name === settings.voice);
    if (match) return match;
  }

  // Prefer UK voice if requested
  if (settings.preferUKVoice) {
    const ukVoice = voices.find(
      (v) => v.lang.startsWith('en-GB') || v.lang.startsWith('en-UK')
    );
    if (ukVoice) return ukVoice;
  }

  // Default to first English voice
  const enVoice = voices.find((v) => v.lang.startsWith('en'));
  if (enVoice) return enVoice;

  // Fallback to first available
  return voices[0] || null;
}

/**
 * Speak options
 */
export interface SpeakOptions {
  settings?: Partial<TTSSettings>;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Speak text using TTS
 */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (!isTTSAvailable()) {
    console.warn('[TTS] Speech synthesis not available');
    options.onError?.(new Error('TTS not available'));
    return;
  }

  // Stop any current speech
  stop();

  // Default settings
  const settings: TTSSettings = {
    enabled: true,
    autoSpeak: false,
    rate: 1.0,
    voice: 'system',
    filterNonAlphanumeric: true,
    preferUKVoice: false,
    ...options.settings,
  };

  // Sanitize text if filtering enabled
  let textToSpeak = text;
  if (settings.filterNonAlphanumeric) {
    textToSpeak = sanitizeForTTS(text, {
      filterNonAlphanumeric: true,
      removeEmojis: true,
      removeSymbols: true,
    });
  }

  // Don't speak if text is empty after sanitization
  if (!textToSpeak.trim()) {
    console.warn('[TTS] No speakable text after sanitization');
    options.onEnd?.();
    return;
  }

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  
  // Apply settings
  utterance.rate = Math.max(0.8, Math.min(1.2, settings.rate));
  
  const voice = selectVoice(settings);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }

  // Event handlers
  utterance.onstart = () => {
    isSpeaking = true;
    currentUtterance = utterance;
    options.onStart?.();
  };

  utterance.onend = () => {
    isSpeaking = false;
    currentUtterance = null;
    options.onEnd?.();
  };

  utterance.onerror = (event) => {
    isSpeaking = false;
    currentUtterance = null;
    console.error('[TTS] Speech error:', event);
    options.onError?.(new Error(`Speech synthesis error: ${event.error}`));
  };

  // Speak
  try {
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('[TTS] Failed to speak:', error);
    options.onError?.(error as Error);
  }
}

/**
 * Stop current speech immediately
 */
export function stop(): void {
  if (!isTTSAvailable()) return;

  try {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    currentUtterance = null;
  } catch (error) {
    console.error('[TTS] Failed to stop speech:', error);
  }
}

/**
 * Pause current speech
 */
export function pause(): void {
  if (!isTTSAvailable()) return;

  try {
    window.speechSynthesis.pause();
  } catch (error) {
    console.error('[TTS] Failed to pause speech:', error);
  }
}

/**
 * Resume paused speech
 */
export function resume(): void {
  if (!isTTSAvailable()) return;

  try {
    window.speechSynthesis.resume();
  } catch (error) {
    console.error('[TTS] Failed to resume speech:', error);
  }
}

/**
 * Check if currently speaking
 */
export function getIsSpeaking(): boolean {
  return isSpeaking;
}

/**
 * Initialize voices (call on app load)
 * Voices may not be immediately available on some browsers
 */
export function initializeTTS(): Promise<void> {
  return new Promise((resolve) => {
    if (!isTTSAvailable()) {
      resolve();
      return;
    }

    // Load voices
    const voices = getAvailableVoices();
    
    if (voices.length > 0) {
      resolve();
      return;
    }

    // Wait for voices to load (some browsers load them async)
    window.speechSynthesis.onvoiceschanged = () => {
      resolve();
    };

    // Fallback timeout
    setTimeout(resolve, 1000);
  });
}
