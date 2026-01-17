'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { sanitizeForTTS } from '@/lib/speech/sanitizeForTTS';
import { useProgress } from '@/contexts/ProgressContext';

const rhymePairs = [
  { word1: 'cat', word2: 'hat', distractor: 'dog' },
  { word1: 'run', word2: 'sun', distractor: 'walk' },
  { word1: 'make', word2: 'cake', distractor: 'pie' },
  { word1: 'light', word2: 'night', distractor: 'day' },
  { word1: 'tree', word2: 'bee', distractor: 'ant' },
  { word1: 'car', word2: 'star', distractor: 'moon' },
  { word1: 'book', word2: 'look', distractor: 'read' },
  { word1: 'fly', word2: 'sky', distractor: 'bird' },
];

export function RhymingPairs() {
  const [currentPair, setCurrentPair] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const cleanText = sanitizeForTTS(word);
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleChoice = (word: string) => {
    const pair = rhymePairs[currentPair];
    const isCorrect = word === pair.word2;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
      speakWord('Correct!');
    }

    setTimeout(() => {
      if (currentPair < rhymePairs.length - 1) {
        setCurrentPair(currentPair + 1);
        setFeedback(null);
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 6) {
          addBadgeEarned('rhyming-master');
        }
      }
    }, 1500);
  };

  const reset = () => {
    setCurrentPair(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Great Job!</h3>
          <p className="text-lg">You scored {score} out of {rhymePairs.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 6 && <p className="text-emerald-600 font-semibold">🏆 Rhyming Master Badge Earned!</p>}
          </div>
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pair = rhymePairs[currentPair];
  const choices = [pair.word2, pair.distractor].sort(() => Math.random() - 0.5);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Rhyming Pairs</h3>
          <div className="text-sm text-muted-foreground">
            {currentPair + 1} / {rhymePairs.length} • Score: {score}
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="p-8 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => speakWord(pair.word1)}
              className="text-4xl font-bold"
            >
              {pair.word1}
              <Volume2 className="w-6 h-6 ml-3" />
            </Button>
          </div>

          <p className="text-lg font-semibold">Which word rhymes with it?</p>

          <div className="grid gap-4 md:grid-cols-2">
            {choices.map((word) => (
              <Button
                key={word}
                size="lg"
                variant="outline"
                onClick={() => handleChoice(word)}
                disabled={feedback !== null}
                className="text-2xl p-8 h-auto"
              >
                {word}
              </Button>
            ))}
          </div>

          {feedback && (
            <div className={`flex items-center justify-center gap-2 text-lg font-semibold ${
              feedback === 'correct' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {feedback === 'correct' ? (
                <><CheckCircle className="w-6 h-6" /> Correct!</>
              ) : (
                <><XCircle className="w-6 h-6" /> Try Again Next Time!</>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
