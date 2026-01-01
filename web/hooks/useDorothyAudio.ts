import { useRef, useCallback, useEffect, useState } from 'react';

// Exact letter timings from Dorothy's A-Z phonics audio (dorothy-alphabet-sounds.mp3)
// CRITICAL: The letter display should change based on the audio time
// During recap sequences, the display stays on the milestone letter (F, L, R, Z)
export interface LetterTiming {
  letter: string;
  start: number;        // When this letter's segment starts
  callEnd: number;      // When the initial call ends
  repeatStart: number;  // When the repeat starts
  repeatEnd: number;    // When the repeat ends
  end: number;          // When this letter's segment ends (including any recap)
  milestoneEnd?: number; // ONLY for F, L, R, Z - when the milestone should trigger (after full recap)
  recapStart?: number;   // When recap sequence starts (only for milestone letters)
}

// Letters that should play "phoneme-only" (clean sound) when tapped/clicked.
// For these, we prefer the repeat window (usually just the sound without extra phrasing).
const PHONEME_ONLY_LETTERS = new Set(['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);

export type LetterAudioWindow = { start: number; end: number };

export function getLetterPhonemeWindow(letter: string): LetterAudioWindow | undefined {
  const timing = getLetterTiming(letter);
  if (!timing) return undefined;

  const upper = letter.toUpperCase();
  if (PHONEME_ONLY_LETTERS.has(upper)) {
    // Trim slightly to avoid bleeding into surrounding words/next letter.
    const start = Math.max(0, timing.repeatStart);
    const end = Math.max(start, timing.repeatEnd - 0.05);
    return { start, end };
  }

  // Default "call" window.
  const start = Math.max(0, timing.start);
  const end = Math.max(start, timing.callEnd - 0.05);
  return { start, end };
}

// Delay before transitioning to next letter image (prevents premature display)
export const LETTER_TRANSITION_DELAY = 2.0; // 2 seconds delay

// Phase types for visual indicator
export type AudioPhase = 'intro' | 'call' | 'repeat' | 'recap' | 'transition';

// Get current audio phase for a letter based on time
export function getAudioPhase(currentTime: number): { phase: AudioPhase; letter: string } {
  const arr = DOROTHY_LETTER_TIMINGS;
  
  // During intro
  if (currentTime < arr[0].start) {
    return { phase: 'intro', letter: 'A' };
  }
  
  for (let i = 0; i < arr.length; i++) {
    const t = arr[i];
    
    // Check if we're in recap phase for milestone letters
    if (t.recapStart && currentTime >= t.recapStart && currentTime < (t.milestoneEnd || t.end)) {
      return { phase: 'recap', letter: t.letter };
    }
    
    // Check if we're in this letter's time range
    const nextStart = arr[i + 1]?.start ?? Infinity;
    if (currentTime >= t.start && currentTime < nextStart) {
      // Determine phase within this letter
      if (currentTime < t.callEnd) {
        return { phase: 'call', letter: t.letter };
      } else if (currentTime >= t.repeatStart && currentTime < t.repeatEnd) {
        return { phase: 'repeat', letter: t.letter };
      } else if (currentTime >= t.repeatEnd && currentTime < (t.recapStart || nextStart)) {
        return { phase: 'transition', letter: t.letter };
      } else {
        return { phase: 'call', letter: t.letter };
      }
    }
  }
  
  return { phase: 'transition', letter: 'Z' };
}

export const DOROTHY_INTRO = { start: 0, end: 7.9 };

// IMPORTANT TIMING RULES:
// 1. Letter display changes when we reach the START time of the NEXT letter
// 2. During recap sequences (after F, L, R, Z), the display STAYS on the milestone letter
// 3. milestoneEnd triggers AFTER Dorothy finishes saying ALL recap letters
// 4. recapStart marks when "now let's repeat X-Y together" begins

export const DOROTHY_LETTER_TIMINGS: LetterTiming[] = [
  // ============ A-F SEGMENT (Bronze milestone) ============
  { letter: "A", start: 7.9,   callEnd: 10.74, repeatStart: 11.36, repeatEnd: 13.12, end: 15.26 },
  { letter: "B", start: 15.26, callEnd: 17.9,  repeatStart: 18.22, repeatEnd: 19.94, end: 21.82 },
  { letter: "C", start: 21.82, callEnd: 24.48, repeatStart: 25.06, repeatEnd: 26.44, end: 27.88 },
  { letter: "D", start: 27.88, callEnd: 30.4,  repeatStart: 30.88, repeatEnd: 32.42, end: 33.78 },
  { letter: "E", start: 33.78, callEnd: 36.44, repeatStart: 37.24, repeatEnd: 38.54, end: 40.08 },
  // F: Individual sound ends ~44.58, then "now let's repeat A-F together" at ~45.0
  // Recap sounds: A~47.0, B~48.5, C~50.0, D~51.5, E~53.0, F~54.5 ends ~56.0
  // Then transition phrase before G starts at 62.38
  { 
    letter: "F", 
    start: 40.08, 
    callEnd: 42.58, 
    repeatStart: 43.18, 
    repeatEnd: 44.58, 
    end: 62.38, 
    recapStart: 45.0,
    milestoneEnd: 56.5 // After F sound in recap finishes
  },
  
  // ============ G-L SEGMENT (Silver milestone) ============
  // G starts after Bronze milestone transition
  // CRITICAL: end time = when Dorothy FINISHES saying "now you repeat G" (not when she starts next letter)
  { letter: "G", start: 62.38, callEnd: 64.8,  repeatStart: 65.2,  repeatEnd: 68.5,  end: 69.0 },
  { letter: "H", start: 69.0,  callEnd: 71.5,  repeatStart: 72.0,  repeatEnd: 75.0,  end: 75.5 },
  { letter: "I", start: 75.5,  callEnd: 78.0,  repeatStart: 78.5,  repeatEnd: 81.5,  end: 82.0 },
  { letter: "J", start: 82.0,  callEnd: 84.5,  repeatStart: 85.0,  repeatEnd: 88.0,  end: 88.5 },
  { letter: "K", start: 88.5,  callEnd: 91.0,  repeatStart: 91.5,  repeatEnd: 94.5,  end: 95.0 },
  // L: Individual sound ends ~99.0, then "now let's repeat G-L together"
  // Recap sequence: G~101.0, H~103.0, I~105.0, J~107.0, K~109.0, L~111.0 ends ~113.0
  // Transition phrase before M starts at ~116.5
  { 
    letter: "L", 
    start: 95.0, 
    callEnd: 97.5, 
    repeatStart: 98.0, 
    repeatEnd: 99.5, 
    end: 116.5, 
    recapStart: 100.0,
    milestoneEnd: 113.5 // After L sound in recap finishes completely
  },

  // ============ M-R SEGMENT (Gold milestone) ============
  // M starts after Silver milestone transition
  // CRITICAL: end time = when Dorothy FINISHES the full repeat sequence for each letter
  { letter: "M", start: 116.5,  callEnd: 119.0,  repeatStart: 119.5,  repeatEnd: 122.5,  end: 123.0 },
  { letter: "N", start: 123.0,  callEnd: 125.5,  repeatStart: 126.0,  repeatEnd: 129.0,  end: 129.5 },
  { letter: "O", start: 129.5,  callEnd: 132.0,  repeatStart: 132.5,  repeatEnd: 135.5,  end: 136.0 },
  { letter: "P", start: 136.0,  callEnd: 138.5,  repeatStart: 139.0,  repeatEnd: 142.0,  end: 142.5 },
  { letter: "Q", start: 142.5,  callEnd: 145.0,  repeatStart: 145.5,  repeatEnd: 148.5,  end: 149.0 },
  // R: Individual sound ends ~152.5, then "now let's repeat M-R together"
  // Recap sequence: M~154.5, N~156.5, O~158.5, P~160.5, Q~162.5, R~164.5 ends ~166.5
  // Transition phrase before S starts at ~170.0
  { 
    letter: "R", 
    start: 149.0, 
    callEnd: 151.5, 
    repeatStart: 152.0, 
    repeatEnd: 153.5, 
    end: 170.0, 
    recapStart: 154.0,
    milestoneEnd: 167.0 // After R sound in recap finishes completely
  },

  // ============ S-Z SEGMENT (Platinum milestone) ============
  // CRITICAL: These timings must precisely match Dorothy's audio
  // Each letter follows: start -> callEnd -> repeatStart -> repeatEnd -> end
  // The end time = when the next letter starts (for smooth transitions)
  { letter: "S", start: 170.0,  callEnd: 172.8,  repeatStart: 173.2,  repeatEnd: 175.8,  end: 176.5 },
  { letter: "T", start: 176.5,  callEnd: 179.3,  repeatStart: 179.7,  repeatEnd: 182.3,  end: 183.0 },
  { letter: "U", start: 183.0,  callEnd: 185.8,  repeatStart: 186.2,  repeatEnd: 188.8,  end: 189.5 },
  { letter: "V", start: 189.5,  callEnd: 192.3,  repeatStart: 192.7,  repeatEnd: 195.3,  end: 196.0 },
  { letter: "W", start: 196.0,  callEnd: 198.8,  repeatStart: 199.2,  repeatEnd: 201.8,  end: 202.5 },
  { letter: "X", start: 202.5,  callEnd: 205.3,  repeatStart: 205.7,  repeatEnd: 208.3,  end: 209.0 },
  { letter: "Y", start: 209.0,  callEnd: 211.8,  repeatStart: 212.2,  repeatEnd: 214.8,  end: 215.5 },
  // Z: Individual sound ends ~219.5, then "now let's repeat S-Z together"
  // Recap sequence: S~221.5, T~223.5, U~225.5, V~227.5, W~229.5, X~231.5, Y~233.5, Z~235.5 ends ~238.0
  // Audio ends at ~240.0
  { 
    letter: "Z", 
    start: 215.5, 
    callEnd: 218.3, 
    repeatStart: 218.7, 
    repeatEnd: 220.3, 
    end: 240.0, 
    recapStart: 221.5,
    milestoneEnd: 238.5 // After Z sound in recap finishes completely - triggers platinum
  }
];

// Vowel timings from dorothy-vowels.mp3
export interface VowelTiming {
  vowel: string;
  start: number;
  end: number;
}

export const DOROTHY_VOWEL_TIMINGS: VowelTiming[] = [
  { vowel: "a", start: 0.0, end: 2.5 },
  { vowel: "e", start: 2.5, end: 5.0 },
  { vowel: "i", start: 5.0, end: 7.5 },
  { vowel: "o", start: 7.5, end: 10.0 },
  { vowel: "u", start: 10.0, end: 12.5 }
];

// Letter data with words and emojis
export const PHONICS_LETTER_DATA: Record<string, { word: string; emoji: string }> = {
  A: { word: "apple", emoji: "🍎" },
  B: { word: "ball", emoji: "⚽" },
  C: { word: "cat", emoji: "🐱" },
  D: { word: "dog", emoji: "🐶" },
  E: { word: "egg", emoji: "🥚" },
  F: { word: "fish", emoji: "🐟" },
  G: { word: "goat", emoji: "🐐" },
  H: { word: "hat", emoji: "🎩" },
  I: { word: "igloo", emoji: "🏔️" },
  J: { word: "jam", emoji: "🍓" },
  K: { word: "kite", emoji: "🪁" },
  L: { word: "lion", emoji: "🦁" },
  M: { word: "milk", emoji: "🥛" },
  N: { word: "nose", emoji: "👃" },
  O: { word: "orange", emoji: "🍊" },
  P: { word: "pen", emoji: "🖊️" },
  Q: { word: "queen", emoji: "👑" },
  R: { word: "rabbit", emoji: "🐇" },
  S: { word: "sun", emoji: "☀️" },
  T: { word: "top", emoji: "🧢" },
  U: { word: "umbrella", emoji: "🌂" },
  V: { word: "van", emoji: "🚐" },
  W: { word: "web", emoji: "🕸️" },
  X: { word: "box", emoji: "📦" },
  Y: { word: "yo-yo", emoji: "🪀" },
  Z: { word: "zebra", emoji: "🦓" }
};

// Get timing for a specific letter
export function getLetterTiming(letter: string): LetterTiming | undefined {
  return DOROTHY_LETTER_TIMINGS.find(t => t.letter === letter.toUpperCase());
}

// Milestone letters and their segments
const MILESTONE_LETTERS = ['F', 'L', 'R', 'Z'];

// Find which letter INDEX should be displayed at a given audio time
// CRITICAL RULES:
// 1. Letter changes when audio time reaches the NEXT letter's start time PLUS the delay
// 2. During recap sequences, display STAYS on the milestone letter (F, L, R, Z)
// 3. Added LETTER_TRANSITION_DELAY to prevent premature letter image display
export function findLetterIndexForTime(currentTime: number): number {
  const arr = DOROTHY_LETTER_TIMINGS;
  
  // During intro (before letter A starts)
  if (currentTime < arr[0].start) {
    return 0; // Show A during intro
  }
  
  // Find which letter's time range we're in
  for (let i = 0; i < arr.length; i++) {
    const currentLetter = arr[i];
    const nextLetter = arr[i + 1];
    
    // Check if we're in a recap sequence for a milestone letter
    // During recap, the display should stay on the milestone letter
    if (currentLetter.recapStart && currentTime >= currentLetter.recapStart) {
      // We're in the recap section - stay on this milestone letter
      // until the next letter's segment starts (with delay)
      if (nextLetter) {
        // Add delay before transitioning after recap
        if (currentTime < nextLetter.start + LETTER_TRANSITION_DELAY) {
          return i; // Stay on milestone letter during its recap and transition
        }
      } else {
        // Last letter (Z) - stay on Z during its recap and after
        return i;
      }
    }
    
    // Normal case: letter is active from its start until next letter's start + delay
    if (nextLetter) {
      // The key fix: don't change to next letter until delay after next letter starts
      // This means we stay on current letter longer
      if (currentTime >= currentLetter.start && currentTime < nextLetter.start + LETTER_TRANSITION_DELAY) {
        return i;
      }
    } else {
      // Last letter (Z) - active from its start to the end
      if (currentTime >= currentLetter.start) {
        return i;
      }
    }
  }
  
  // Fallback to last letter
  return arr.length - 1;
}

// Check if a milestone should trigger at the given time
// Returns the milestone letter if should trigger, null otherwise
export function checkMilestoneTime(currentTime: number, triggeredMilestones: Set<string>): string | null {
  for (const letter of MILESTONE_LETTERS) {
    if (triggeredMilestones.has(letter)) continue;
    
    const timing = DOROTHY_LETTER_TIMINGS.find(t => t.letter === letter);
    if (!timing?.milestoneEnd) continue;
    
    // Trigger milestone when we reach milestoneEnd time
    // This should be AFTER the full recap sequence completes
    if (currentTime >= timing.milestoneEnd) {
      return letter;
    }
  }
  
  return null;
}

// Hook for playing Dorothy's alphabet sounds
export function useDorothyAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetEndRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/audio/dorothy-alphabet-sounds.mp3');
    audioRef.current.preload = 'auto';

    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      if (targetEndRef.current == null) return;
      // Pause as soon as we cross the segment end.
      if (audioRef.current.currentTime >= targetEndRef.current) {
        audioRef.current.pause();
        targetEndRef.current = null;
        setIsPlaying(false);
      }
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
  }, []);

  const playWindow = useCallback((letter: string, window: LetterAudioWindow, playbackRate = 1): number => {
    if (!audioRef.current) return 0;

    // Clear any existing timeout + target end
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    targetEndRef.current = null;

    const audio = audioRef.current;
    audio.playbackRate = playbackRate;

    const durationMs = Math.max(0, (window.end - window.start) * 1000 / playbackRate);
    audio.currentTime = window.start;
    targetEndRef.current = window.end;
    audio.play().catch(console.error);

    setIsPlaying(true);
    setCurrentLetter(letter.toUpperCase());

    // Fallback safety stop (in case timeupdate doesn't fire while buffered)
    stopTimeoutRef.current = setTimeout(() => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      targetEndRef.current = null;
      setIsPlaying(false);
    }, durationMs + 150);

    return durationMs;
  }, []);

  // Play just the "call" portion of a letter (the initial sound)
  const playLetterCall = useCallback((letter: string, playbackRate = 1): number => {
    const timing = getLetterTiming(letter);
    if (!timing) return 0;
    return playWindow(letter, { start: timing.start, end: timing.callEnd }, playbackRate);
  }, [playWindow]);

  // Play a "phoneme-only" window when available (used for S–Z tap/click accuracy)
  const playLetterPhoneme = useCallback((letter: string, playbackRate = 1): number => {
    const window = getLetterPhonemeWindow(letter);
    if (!window) return 0;
    return playWindow(letter, window, playbackRate);
  }, [playWindow]);

  // Play full letter segment (call + repeat)
  const playLetterFull = useCallback((letter: string, playbackRate = 1): number => {
    const timing = getLetterTiming(letter);
    if (!timing) return 0;
    return playWindow(letter, { start: timing.start, end: timing.repeatEnd }, playbackRate);
  }, [playWindow]);

  // Stop playback
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
    }
    targetEndRef.current = null;
    setIsPlaying(false);
    setCurrentLetter(null);
  }, []);

  // Get audio element for advanced control
  const getAudioElement = useCallback(() => audioRef.current, []);

  return {
    playLetterCall,
    playLetterPhoneme,
    playLetterFull,
    stop,
    isPlaying,
    currentLetter,
    getAudioElement
  };
}

// Hook for playing Dorothy's vowel sounds
export function useDorothyVowelAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio('/audio/dorothy-vowels.mp3');
    audioRef.current.preload = 'auto';
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
  }, []);

  const playVowel = useCallback((vowel: string): number => {
    if (!audioRef.current) return 0;
    
    const timing = DOROTHY_VOWEL_TIMINGS.find(t => t.vowel === vowel.toLowerCase());
    if (!timing) return 0;
    
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    
    const duration = (timing.end - timing.start) * 1000;
    
    audioRef.current.currentTime = timing.start;
    audioRef.current.play().catch(console.error);
    setIsPlaying(true);
    
    stopTimeoutRef.current = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }, duration);
    
    return duration;
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
    }
    setIsPlaying(false);
  }, []);

  return { playVowel, stop, isPlaying };
}