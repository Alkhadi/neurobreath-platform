'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Trophy, RefreshCw, Play, Pause, Flag } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const passages = [
  {
    level: 'Easy',
    text: 'The cat sat on the mat. The dog ran to the park. The sun was bright and warm.',
    wordCount: 18,
  },
  {
    level: 'Medium',
    text: 'Yesterday, my family went to the beach. We built sandcastles and collected seashells. The water was cold but refreshing.',
    wordCount: 22,
  },
  {
    level: 'Hard',
    text: 'Scientists have discovered that reading fluency improves with regular practice. When students read the same passage multiple times, their speed and comprehension naturally increase over time.',
    wordCount: 28,
  },
];

export function ReadingFluencyRace() {
  const [selectedPassage, setSelectedPassage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const { addBadgeEarned, addMinutes } = useProgress();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReading) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  const passage = passages[selectedPassage];

  const toggleReading = () => {
    if (!isReading) {
      setTimeElapsed(0);
    }
    setIsReading(!isReading);
  };

  const finishReading = () => {
    setIsReading(false);
    const wpm = Math.round((passage.wordCount / timeElapsed) * 60);
    setAttempts([...attempts, wpm]);
    addMinutes(Math.ceil(timeElapsed / 60));
    
    if (attempts.length >= 2 && wpm > 80) {
      addBadgeEarned('fluency-champion');
    }
  };

  const reset = () => {
    setTimeElapsed(0);
    setIsReading(false);
    setAttempts([]);
  };

  const wpm = timeElapsed > 0 ? Math.round((passage.wordCount / timeElapsed) * 60) : 0;
  const bestWPM = attempts.length > 0 ? Math.max(...attempts) : 0;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Reading Fluency Race</h3>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-600" />
            <span className="text-2xl font-mono font-bold">
              {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {passages.map((p, i) => (
            <Button
              key={i}
              size="sm"
              variant={selectedPassage === i ? 'default' : 'outline'}
              onClick={() => {
                setSelectedPassage(i);
                reset();
              }}
              disabled={isReading}
            >
              {p.level}
            </Button>
          ))}
        </div>

        <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-lg leading-relaxed font-serif">
            {passage.text}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Word count: {passage.wordCount} words
          </p>
        </div>

        <div className="flex gap-3">
          {!isReading ? (
            <Button
              onClick={toggleReading}
              className="flex-1"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Reading
            </Button>
          ) : (
            <>
              <Button
                onClick={toggleReading}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
              <Button
                onClick={finishReading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                size="lg"
              >
                <Flag className="w-5 h-5 mr-2" />
                Finish
              </Button>
            </>
          )}
        </div>

        {attempts.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Current WPM</p>
                <p className="text-3xl font-bold text-purple-600">{wpm}</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Best WPM</p>
                <p className="text-3xl font-bold text-emerald-600">{bestWPM}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="text-sm font-semibold mb-2">Your Progress:</p>
              <div className="flex gap-2 flex-wrap">
                {attempts.map((wpm, i) => (
                  <span key={i} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm">
                    Attempt {i + 1}: <strong>{wpm} WPM</strong>
                  </span>
                ))}
              </div>
            </div>

            {bestWPM > 80 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg text-center">
                <Trophy className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                <p className="font-semibold text-emerald-600">🏆 Fluency Champion Badge Earned!</p>
              </div>
            )}

            <Button onClick={reset} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Tip:</strong> Read the passage multiple times to improve your fluency!</p>
          <p className="mt-1">Average reading speeds: Beginner 60-80 WPM, Intermediate 90-120 WPM, Advanced 120+ WPM</p>
        </div>
      </CardContent>
    </Card>
  );
}
