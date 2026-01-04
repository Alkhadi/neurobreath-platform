'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Square, TrendingUp } from 'lucide-react';

const passages = [
  {
    level: 'Beginner',
    text: 'The cat sat on the mat. The dog ran in the park. The sun was bright today.',
    wordCount: 17,
    target: 60,
  },
  {
    level: 'Intermediate',
    text: 'Yesterday, my family visited the zoo. We saw lions, elephants, and monkeys. The elephants were my favorite because they were so big and gentle. We had a great time together.',
    wordCount: 32,
    target: 100,
  },
  {
    level: 'Advanced',
    text: 'Reading fluency improves with consistent practice. When students read the same passage multiple times, their speed and accuracy naturally increase. This technique, called repeated reading, is highly effective for building automaticity in word recognition and improving overall reading comprehension skills.',
    wordCount: 42,
    target: 130,
  },
];

export function ReadingSpeedCalculator() {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [results, setResults] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReading) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  const passage = passages[selectedLevel];
  const wpm = timeElapsed > 0 ? Math.round((passage.wordCount / timeElapsed) * 60) : 0;

  const startReading = () => {
    setTimeElapsed(0);
    setIsReading(true);
  };

  const stopReading = () => {
    setIsReading(false);
    if (timeElapsed > 0) {
      const finalWPM = Math.round((passage.wordCount / timeElapsed) * 60);
      setResults([...results, finalWPM]);
    }
  };

  const getPerformance = (wpm: number, target: number) => {
    if (wpm >= target) return { text: 'Excellent!', color: 'text-emerald-600' };
    if (wpm >= target * 0.8) return { text: 'Good', color: 'text-blue-600' };
    if (wpm >= target * 0.6) return { text: 'Fair', color: 'text-orange-600' };
    return { text: 'Needs Practice', color: 'text-red-600' };
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Reading Speed Calculator
          </h3>
        </div>

        <div className="flex gap-2">
          {passages.map((p, i) => (
            <Button
              key={i}
              size="sm"
              variant={selectedLevel === i ? 'default' : 'outline'}
              onClick={() => {
                setSelectedLevel(i);
                setIsReading(false);
                setTimeElapsed(0);
              }}
              disabled={isReading}
            >
              {p.level}
            </Button>
          ))}
        </div>

        <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-lg leading-relaxed">{passage.text}</p>
          <p className="text-sm text-muted-foreground mt-4">
            Word count: {passage.wordCount} | Target: {passage.target} WPM
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="text-3xl font-mono font-bold">
              {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">WPM</p>
            <p className="text-3xl font-bold text-purple-600">{wpm}</p>
          </div>
        </div>

        <div className="flex gap-3">
          {!isReading ? (
            <Button onClick={startReading} className="flex-1" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Start Reading
            </Button>
          ) : (
            <Button onClick={stopReading} variant="outline" className="flex-1" size="lg">
              <Square className="w-5 h-5 mr-2" />
              Finished Reading
            </Button>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Progress
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {results.map((wpm, i) => {
                const perf = getPerformance(wpm, passage.target);
                return (
                  <div key={i} className="p-3 bg-white dark:bg-gray-800 rounded-lg border-2">
                    <p className="text-xs text-muted-foreground">Attempt {i + 1}</p>
                    <p className="text-2xl font-bold">{wpm} WPM</p>
                    <p className={`text-xs font-semibold ${perf.color}`}>{perf.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>⏱️ Read the passage aloud, then stop the timer when finished</p>
          <p className="mt-1">📈 Practice the same passage multiple times to improve fluency!</p>
        </div>
      </CardContent>
    </Card>
  );
}
