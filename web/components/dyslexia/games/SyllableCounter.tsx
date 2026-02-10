'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, RefreshCw, Trophy, Hand } from 'lucide-react';
import { sanitizeForTTS } from '@/lib/speech/sanitizeForTTS';
import { useProgress } from '@/contexts/ProgressContext';

const words = [
  { word: 'cat', syllables: 1 },
  { word: 'happy', syllables: 2 },
  { word: 'elephant', syllables: 3 },
  { word: 'beautiful', syllables: 3 },
  { word: 'computer', syllables: 3 },
  { word: 'wonderful', syllables: 3 },
  { word: 'butterfly', syllables: 3 },
  { word: 'banana', syllables: 3 },
  { word: 'piano', syllables: 3 },
  { word: 'incredible', syllables: 4 },
];

export function SyllableCounter() {
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const cleanText = sanitizeForTTS(word);
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.6;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleChoice = (count: number) => {
    const word = words[currentWord];
    const isCorrect = count === word.syllables;
    
    setSelectedAnswer(count);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentWord < words.length - 1) {
        setCurrentWord(currentWord + 1);
        setFeedback(null);
        setSelectedAnswer(null);
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 7) {
          addBadgeEarned('syllable-expert');
        }
      }
    }, 1500);
  };

  const reset = () => {
    setCurrentWord(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    setSelectedAnswer(null);
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Excellent Work!</h3>
          <p className="text-lg">You scored {score} out of {words.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 7 && <p className="text-emerald-600 font-semibold">🏆 Syllable Expert Badge Earned!</p>}
          </div>
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const word = words[currentWord];

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Syllable Counter</h3>
          <div className="text-sm text-muted-foreground">
            {currentWord + 1} / {words.length} • Score: {score}
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="p-8 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => speakWord(word.word)}
              className="text-4xl font-bold"
            >
              {word.word}
              <Volume2 className="w-6 h-6 ml-3" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Hand className="w-5 h-5" />
              <p className="text-sm font-semibold">Clap as you say each part of the word!</p>
            </div>
            <p className="text-lg font-semibold">How many syllables (parts) in this word?</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((count) => (
              <Button
                key={count}
                size="lg"
                variant={selectedAnswer === count ? 'default' : 'outline'}
                onClick={() => handleChoice(count)}
                disabled={feedback !== null}
                className="text-3xl p-8 h-auto"
              >
                {count}
              </Button>
            ))}
          </div>

          {feedback && (
            <div className={`flex items-center justify-center gap-2 text-lg font-semibold ${
              feedback === 'correct' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {feedback === 'correct' ? (
                <><CheckCircle className="w-6 h-6" /> Correct! {word.word} has {word.syllables} syllable(s)!</>
              ) : (
                <><XCircle className="w-6 h-6" /> Not quite! {word.word} has {word.syllables} syllable(s)!</>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
