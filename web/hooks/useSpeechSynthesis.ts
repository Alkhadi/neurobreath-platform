import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string, options?: SpeakOptions) => void;
  cancel: () => void;
  speaking: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  rate: number;
  setRate: (rate: number) => void;
}

interface SpeakOptions {
  rate?: number;
  pitch?: number;
  voice?: SpeechSynthesisVoice;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(0.9);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Prefer English voices
      const englishVoice = availableVoices.find(
        v => v.lang.startsWith('en') && v.name.includes('Female')
      ) || availableVoices.find(
        v => v.lang.startsWith('en')
      ) || availableVoices[0];
      
      if (englishVoice && !selectedVoice) {
        setSelectedVoice(englishVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [supported, selectedVoice]);

  const speak = useCallback((text: string, options?: SpeakOptions) => {
    if (!supported) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? rate;
    utterance.pitch = options?.pitch ?? 1;
    utterance.voice = options?.voice ?? selectedVoice;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [supported, rate, selectedVoice]);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return {
    speak,
    cancel,
    speaking,
    supported,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
  };
}
