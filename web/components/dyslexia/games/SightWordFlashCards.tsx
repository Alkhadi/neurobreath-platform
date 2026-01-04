'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, RefreshCw, Trophy, Timer, Zap } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const sightWords = [
  'the', 'and', 'a', 'to', 'said', 'in', 'he', 'I', 'of', 'it',
  'was', 'you', 'they', 'on', 'she', 'is', 'for', 'at', 'his', 'but',
  'that', 'with', 'all', 'we', 'can', 'are', 'up', 'had', 'my', 'her',
];

export function SightWordFlashCards() {
  const [currentWord, setCurrentWord] = useState(0);
  const [showWord, setShowWord] = useState(true);
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [reviewWords, setReviewWords] = useState<string[]>([]);
  const [mode, setMode] = useState<'practice' | 'timed'>('practice');
  const [timeLeft, setTimeLeft] = useState(3);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && mode === 'timed') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTimerActive) {
      setShowWord(false);
      setIsTimerActive(false);
    }
  }, [timeLeft, isTimerActive, mode]);

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKnow = () => {
    const word = sightWords[currentWord];
    setKnownWords([...knownWords, word]);
    nextWord();
  };

  const handleReview = () => {
    const word = sightWords[currentWord];
    setReviewWords([...reviewWords, word]);
    nextWord();
  };

  const nextWord = () => {
    if (currentWord < sightWords.length - 1) {
      setCurrentWord(currentWord + 1);
      setShowWord(true);
      if (mode === 'timed') {
        setTimeLeft(3);
        setIsTimerActive(true);
      }
    } else {
      incrementGameCompleted();
      if (knownWords.length >= 20) {
        addBadgeEarned('sight-word-champion');
      }
    }
  };

  const reset = () => {
    setCurrentWord(0);
    setShowWord(true);
    setKnownWords([]);
    setReviewWords([]);
    setTimeLeft(3);
    setIsTimerActive(false);
  };

  const startTimed = () => {
    setMode('timed');
    setTimeLeft(3);
    setIsTimerActive(true);
    reset();
  };

  if (currentWord >= sightWords.length) {
    return (
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Session Complete!</h3>
          <div className="space-y-2">
            <p className="text-lg">Known: <span className="font-bold text-emerald-600">{knownWords.length}</span> words</p>
            <p className="text-lg">Need Review: <span className="font-bold text-orange-600">{reviewWords.length}</span> words</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {knownWords.length >= 20 && <p className="text-emerald-600 font-semibold">🏆 Sight Word Champion Badge Earned!</p>}
          </div>
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Practice Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const word = sightWords[currentWord];

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Sight Word Flash Cards</h3>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              {currentWord + 1} / {sightWords.length}
            </div>
            {mode === 'practice' && (
              <Button size="sm" variant="outline" onClick={startTimed}>
                <Zap className="w-4 h-4 mr-1" />
                Timed Mode
              </Button>
            )}
          </div>
        </div>

        <div className="text-center space-y-6">
          {mode === 'timed' && isTimerActive && (
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <Timer className="w-5 h-5" />
              <span className="text-2xl font-bold">{timeLeft}s</span>
            </div>
          )}

          <div className="relative p-16 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            {showWord ? (
              <div className="space-y-4">
                <div className="text-6xl font-bold">{word}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakWord(word)}
                  className="text-blue-600"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Hear It
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl text-muted-foreground">???</div>
                <Button
                  variant="outline"
                  onClick={() => setShowWord(true)}
                >
                  Show Word
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Button
              size="lg"
              onClick={handleKnow}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-auto py-6"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              <div>
                <div className="font-bold text-lg">I Know It!</div>
                <div className="text-xs opacity-80">Quick recognition</div>
              </div>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleReview}
              className="h-auto py-6 border-orange-300 hover:bg-orange-50"
            >
              <RefreshCw className="w-6 h-6 mr-2 text-orange-600" />
              <div>
                <div className="font-bold text-lg">Need Review</div>
                <div className="text-xs opacity-80">Practice more</div>
              </div>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Known: {knownWords.length} • Review: {reviewWords.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
