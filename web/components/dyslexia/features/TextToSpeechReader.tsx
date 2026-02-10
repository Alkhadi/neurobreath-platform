'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Volume2, Settings } from 'lucide-react';
import { sanitizeForTTS } from '@/lib/speech/sanitizeForTTS';

const sampleText = `Reading with dyslexia can be challenging, but with the right tools and support, it becomes much easier. Text-to-speech technology helps by reading text aloud, allowing you to focus on comprehension rather than decoding. You can adjust the speed and voice to match your preferences.`;

export function TextToSpeechReader() {
  const [text, setText] = useState(sampleText);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const highlightWord = (index: number) => {
    setCurrentPosition(index);
  };

  const speak = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const cleanText = sanitizeForTTS(text);
      if (!cleanText) {
        setIsPlaying(false);
        return;
      }
      const words = cleanText.split(' ');
      let wordIndex = 0;

      const speakNextWord = () => {
        if (wordIndex < words.length && isPlayingRef.current) {
          const utterance = new SpeechSynthesisUtterance(words[wordIndex]);
          utterance.rate = rate;
          utterance.pitch = pitch;
          if (voices[selectedVoice]) {
            utterance.voice = voices[selectedVoice];
          }

          utterance.onstart = () => highlightWord(wordIndex);
          utterance.onend = () => {
            wordIndex++;
            speakNextWord();
          };

          window.speechSynthesis.speak(utterance);
          utteranceRef.current = utterance;
        } else {
          setIsPlaying(false);
        }
      };

      speakNextWord();
    }
  }, [pitch, rate, selectedVoice, text, voices]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      speak();
    } else {
      window.speechSynthesis.cancel();
    }
  }, [isPlaying, speak]);

  const handlePause = () => {
    setIsPlaying(false);
    window.speechSynthesis.cancel();
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentPosition(0);
    window.speechSynthesis.cancel();
  };

  const words = text.split(' ');

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Text-to-Speech Reader
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {showSettings && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="tts-speed">Speed: {rate.toFixed(1)}x</label>
                <input
                  id="tts-speed"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="tts-pitch">Pitch: {pitch.toFixed(1)}</label>
                <input
                  id="tts-pitch"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {voices.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold" htmlFor="tts-voice">Voice:</label>
                  <select
                    id="tts-voice"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {voices.map((voice, index) => (
                      <option key={index} value={index}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 px-4 py-3 border-2 rounded-lg resize-none focus:outline-none focus:border-blue-500"
            placeholder="Paste or type text here..."
            aria-label="Text to read aloud"
          />

          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-lg leading-relaxed">
              {words.map((word, index) => (
                <span
                  key={index}
                  className={`${
                    index === currentPosition
                      ? 'bg-yellow-200 dark:bg-yellow-700 font-bold'
                      : ''
                  } transition-colors`}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {!isPlaying ? (
              <Button onClick={handlePlay} className="flex-1" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Play
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" className="flex-1" size="lg">
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={handleStop} variant="outline" className="flex-1" size="lg">
              <Square className="w-5 h-5 mr-2" />
              Stop
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>🎧 Adjust speed and voice in settings for comfortable listening</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
