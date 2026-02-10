'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { sanitizeForTTS } from '@/lib/speech/sanitizeForTTS';
import { useProgress } from '@/contexts/ProgressContext';

const words = [
  { word: 'cat', phonemes: ['c', 'a', 't'], image: '🐱' },
  { word: 'dog', phonemes: ['d', 'o', 'g'], image: '🐶' },
  { word: 'fish', phonemes: ['f', 'i', 'sh'], image: '🐟' },
  { word: 'shop', phonemes: ['sh', 'o', 'p'], image: '🏪' },
  { word: 'chip', phonemes: ['ch', 'i', 'p'], image: '🥔' },
  { word: 'tree', phonemes: ['t', 'r', 'ee'], image: '🌳' },
  { word: 'play', phonemes: ['p', 'l', 'ay'], image: '⚽' },
  { word: 'snap', phonemes: ['s', 'n', 'a', 'p'], image: '👍' },
];

const allPhonemes = ['c', 'a', 't', 'd', 'o', 'g', 'f', 'i', 'sh', 'p', 'ch', 'r', 'ee', 'l', 'ay', 's', 'n'];

export function PhonemeSegmentation() {
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedPhonemes, setSelectedPhonemes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const word = words[currentWord];
  const availablePhonemes = [...new Set([...word.phonemes, ...allPhonemes.sort(() => Math.random() - 0.5).slice(0, 6)])].sort(() => Math.random() - 0.5);

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const cleanText = sanitizeForTTS(word.word);
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakPhoneme = (phoneme: string) => {
    if ('speechSynthesis' in window) {
      const cleanText = sanitizeForTTS(phoneme);
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.5;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePhonemeClick = (phoneme: string) => {
    if (feedback) return;
    if (selectedPhonemes.includes(phoneme)) {
      setSelectedPhonemes(selectedPhonemes.filter(p => p !== phoneme));
    } else {
      setSelectedPhonemes([...selectedPhonemes, phoneme]);
      speakPhoneme(phoneme);
    }
  };

  const checkAnswer = () => {
    const isCorrect = JSON.stringify(selectedPhonemes) === JSON.stringify(word.phonemes);
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
      speakWord();
    }

    setTimeout(() => {
      if (currentWord < words.length - 1) {
        setCurrentWord(currentWord + 1);
        setFeedback(null);
        setSelectedPhonemes([]);
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 6) {
          addBadgeEarned('phoneme-expert');
        }
      }
    }, 2000);
  };

  const reset = () => {
    setCurrentWord(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    setSelectedPhonemes([]);
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Phoneme Master!</h3>
          <p className="text-lg">You scored {score} out of {words.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 6 && <p className="text-emerald-600 font-semibold">🏆 Phoneme Expert Badge Earned!</p>}
          </div>
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Phoneme Segmentation</h3>
          <div className="text-sm text-muted-foreground">
            {currentWord + 1} / {words.length} • Score: {score}
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">{word.image}</div>
            <div className="p-6 bg-rose-50 dark:bg-rose-950/30 rounded-lg">
              <Button
                variant="ghost"
                size="lg"
                onClick={speakWord}
                className="text-4xl font-bold"
              >
                {word.word}
                <Volume2 className="w-6 h-6 ml-3" />
              </Button>
            </div>
            <p className="text-lg font-semibold">Break this word into individual sounds (phonemes)</p>
          </div>

          {/* Selected phonemes display */}
          <div className="min-h-[80px] p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg border-2 border-dashed border-pink-300">
            <p className="text-xs text-muted-foreground mb-2 text-center">Your Answer (in order):</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedPhonemes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Select sounds below</p>
              ) : (
                selectedPhonemes.map((phoneme, index) => (
                  <div
                    key={`selected-${index}`}
                    className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-2xl font-mono font-bold cursor-pointer hover:bg-red-50"
                    onClick={() => handlePhonemeClick(phoneme)}
                  >
                    {phoneme}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Available phonemes */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-center">Available Sounds (click to select):</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {availablePhonemes.map((phoneme, index) => {
                const isSelected = selectedPhonemes.includes(phoneme);
                return (
                  <Button
                    key={`avail-${index}`}
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => handlePhonemeClick(phoneme)}
                    disabled={feedback !== null}
                    className="text-2xl font-mono font-bold px-4 py-2"
                  >
                    {phoneme}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setSelectedPhonemes([])}
              variant="outline"
              disabled={selectedPhonemes.length === 0 || feedback !== null}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              onClick={checkAnswer}
              disabled={selectedPhonemes.length === 0 || feedback !== null}
              className="flex-1"
            >
              Check Answer
            </Button>
          </div>

          {feedback && (
            <div className={`text-center p-4 rounded-lg ${
              feedback === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700'
                : 'bg-red-50 dark:bg-red-950/30 text-red-700'
            }`}>
              {feedback === 'correct' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 font-semibold text-lg">
                    <CheckCircle className="w-6 h-6" /> Perfect segmentation!
                  </div>
                  <p className="text-sm">{word.word} = {word.phonemes.join(' + ')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 font-semibold text-lg">
                    <XCircle className="w-6 h-6" /> Not quite!
                  </div>
                  <p className="text-sm">Correct: {word.phonemes.join(' + ')}</p>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>🎵 Phonemes are the smallest units of sound in a word!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
