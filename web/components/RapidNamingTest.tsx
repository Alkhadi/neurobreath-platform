'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Play, StopCircle, Trophy, Timer, TrendingUp } from 'lucide-react';

interface TestItem {
  value: string;
  type: 'letter' | 'number' | 'color' | 'object';
}

interface TestResult {
  type: string;
  itemsNamed: number;
  timeElapsed: number;
  itemsPerSecond: number;
  date: string;
}

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'];
const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const COLORS = [
  { name: 'red', emoji: '🔴' },
  { name: 'blue', emoji: '🔵' },
  { name: 'green', emoji: '🟢' },
  { name: 'yellow', emoji: '🟡' },
  { name: 'purple', emoji: '🟣' }
];
const OBJECTS = [
  { name: 'star', emoji: '⭐' },
  { name: 'heart', emoji: '❤️' },
  { name: 'tree', emoji: '🌲' },
  { name: 'house', emoji: '🏠' },
  { name: 'car', emoji: '🚗' }
];

export function RapidNamingTest() {
  const [testType, setTestType] = useState<'letter' | 'number' | 'color' | 'object'>('letter');
  const [testItems, setTestItems] = useState<TestItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [bestScore, setBestScore] = useState<number>(0);
  const timerRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadResults = () => {
    const saved = localStorage.getItem('rapid-naming-results');
    if (saved) {
      const allResults: TestResult[] = JSON.parse(saved);
      setResults(allResults.filter(r => r.type === testType));
      const best = Math.max(...allResults.filter(r => r.type === testType).map(r => r.itemsPerSecond), 0);
      setBestScore(best);
    }
  };

  const generateTest = () => {
    const items: TestItem[] = [];
    const gridSize = 50; // 5 rows x 10 columns

    for (let i = 0; i < gridSize; i++) {
      switch (testType) {
        case 'letter':
          items.push({ value: ['a','b','c','d','e','s','o','p','d','n'][Math.floor(Math.random() * 10)], type: 'letter' });
          break;
        case 'number':
          items.push({ value: String(Math.floor(Math.random() * 9) + 1), type: 'number' });
          break;
        case 'color':
          items.push({ value: ['🔴','🔵','🟢','🟡','🟣'][Math.floor(Math.random() * 5)], type: 'color' });
          break;
        case 'object':
          items.push({ value: ['☀️','⭐','🌙','❤️','⚡'][Math.floor(Math.random() * 5)], type: 'object' });
          break;
      }
    }

    setTestItems(items);
    setCurrentIndex(0);
  };

  useEffect(() => {
    generateTest();
    loadResults();
  }, [testType]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTest = () => {
    setIsRunning(true);
    setCurrentIndex(0);
    setStartTime(Date.now());
    timerRef.current = 0;

    intervalRef.current = setInterval(() => {
      timerRef.current += 0.1;
    }, 100);
  };

  const stopTest = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (startTime && currentIndex > 0) {
      const timeElapsed = (Date.now() - startTime) / 1000;
      const itemsPerSecond = currentIndex / timeElapsed;

      const result: TestResult = {
        type: testType,
        itemsNamed: currentIndex,
        timeElapsed: parseFloat(timeElapsed.toFixed(2)),
        itemsPerSecond: parseFloat(itemsPerSecond.toFixed(2)),
        date: new Date().toISOString()
      };

      const saved = localStorage.getItem('rapid-naming-results');
      const allResults: TestResult[] = saved ? JSON.parse(saved) : [];
      allResults.push(result);
      localStorage.setItem('rapid-naming-results', JSON.stringify(allResults));

      setResults([result, ...results]);
      if (itemsPerSecond > bestScore) {
        setBestScore(itemsPerSecond);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < testItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      stopTest();
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (isRunning && e.code === 'Space') {
      e.preventDefault();
      handleNext();
    }
  };

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      handleKeyPress(event);
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [isRunning, currentIndex, testItems]);

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Rapid Automatic Naming (RAN)</CardTitle>
              <CardDescription>Build automaticity and reading fluency</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-white dark:bg-gray-800">
            <Trophy className="h-3 w-3 mr-1" />
            Best: {bestScore.toFixed(2)} items/sec
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Evidence Banner */}
        <div className="bg-orange-50 dark:bg-orange-950/50 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
            <strong>Evidence-Based:</strong> Rapid Automatic Naming (RAN) is one of the strongest predictors of reading ability. Regular practice improves processing speed and reading fluency.
          </p>
        </div>

        {/* Test Type Selection */}
        {!isRunning && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Test Type:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { type: 'letter' as const, label: 'Letters', emoji: '🔤', color: 'blue' },
                { type: 'number' as const, label: 'Numbers', emoji: '🔢', color: 'green' },
                { type: 'color' as const, label: 'Colors', emoji: '🎨', color: 'purple' },
                { type: 'object' as const, label: 'Objects', emoji: '🎯', color: 'orange' }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setTestType(option.type)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    testType === option.type
                      ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-950`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="text-sm font-semibold">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Test Instructions */}
        {!isRunning && (
          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">📋 Instructions:</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-4 list-disc">
              <li>Name each item out loud as quickly and accurately as possible</li>
              <li>Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">SPACE</kbd> after naming each item</li>
              <li>Try to maintain a steady, fast pace without making errors</li>
              <li>The test contains 50 items (5 rows × 10 columns)</li>
            </ul>
          </div>
        )}

        {/* Test Grid */}
        {isRunning ? (
          <div className="space-y-4">
            {/* Timer and Progress */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">{timerRef.current.toFixed(1)}s</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500">
                  {currentIndex + 1} / {testItems.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Items Named</div>
              </div>
            </div>

            {/* Current Item Display */}
            <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 rounded-lg">
              <div className="text-8xl mb-6 animate-pulse">
                {testItems[currentIndex]?.value.toUpperCase()}
              </div>
              <Button
                size="lg"
                onClick={handleNext}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Next (SPACE)
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={(currentIndex / testItems.length) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Progress</span>
                <span>{Math.round((currentIndex / testItems.length) * 100)}%</span>
              </div>
            </div>

            {/* Stop Button */}
            <Button
              onClick={stopTest}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <StopCircle className="h-5 w-5 mr-2" />
              Stop Test
            </Button>
          </div>
        ) : (
          <>
            {/* Start Button */}
            <Button
              onClick={startTest}
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              <Play className="h-5 w-5 mr-2" />
              Start {testType.charAt(0).toUpperCase() + testType.slice(1)} Test
            </Button>

            {/* Results History */}
            {results.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold">Recent Results</h3>
                </div>
                <div className="space-y-2">
                  {results.slice(0, 5).map((result, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {result.itemsNamed} items in {result.timeElapsed}s
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(result.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-500">
                          {result.itemsPerSecond}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">items/sec</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
