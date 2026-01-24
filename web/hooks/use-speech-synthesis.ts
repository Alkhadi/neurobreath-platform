import { useCallback, useEffect, useState } from 'react';
import { useTTSPreferences } from '@/lib/user-preferences/useTTSPreferences';
import { speak as engineSpeak, stop as engineStop, getIsSpeaking } from '@/lib/tts/engine';

function stripForSpeech(input: string): string {
  return String(input || '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function useSpeechSynthesis() {
  const { ttsSettings } = useTTSPreferences();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Keep UI state in sync if the engine stops unexpectedly.
  useEffect(() => {
    const id = setInterval(() => {
      const speaking = getIsSpeaking();
      // Sync both ways (tests and some browsers can miss callbacks).
      if (speaking !== isSpeaking) setIsSpeaking(speaking);
    }, 200);

    return () => clearInterval(id);
  }, [isSpeaking]);

  const stop = useCallback(() => {
    engineStop();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const speak = useCallback(
    (text: string) => {
      if (!ttsSettings?.enabled) return;
      const cleaned = stripForSpeech(text);
      if (!cleaned) return;

      stop();
      // Optimistically flip UI state so Listen/Stop is responsive even if
      // the underlying engine delays onStart.
      setIsSpeaking(true);
      engineSpeak(cleaned, {
        settings: ttsSettings,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [stop, ttsSettings]
  );

  return { speak, stop, isSpeaking };
}
