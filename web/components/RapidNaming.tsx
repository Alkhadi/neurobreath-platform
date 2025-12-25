'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const GAME_ITEMS = {
  colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown'],
  numbers: ['1', '2', '3', '4', '5', '6', '7', '8'],
  letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  objects: ['🏀', '⚽', '🎾', '🏈', '🎱', '🏐', '🎳', '🏒'],
};

type Category = keyof typeof GAME_ITEMS;

export function RapidNaming() {
  const [category, setCategory] = useState<Category>('colors');
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTime((t) => t + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const items = GAME_ITEMS[category];
  const progress = (completed / items.length) * 100;

  const handleStart = () => {
    setIsActive(true);
    setCompleted(0);
    setTime(0);
  };

  const handleReset = () => {
    setIsActive(false);
    setCompleted(0);
    setTime(0);
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">Stage 3 • Speed Training</p>
            <h2 className="text-lg sm:text-xl font-bold">Rapid Naming</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Name each item as fast as you can! Tap items in order.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Timer and Stats */}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-mono font-bold">
            {(time / 1000).toFixed(2)}s
          </div>
          <div className="text-sm text-muted-foreground">
            {completed} strips done today
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(GAME_ITEMS).map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              onClick={() => setCategory(cat as Category)}
              className="capitalize text-xs"
              size="sm"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>1 of 8</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Game Items Grid */}
        <div className="grid grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg min-h-[200px]">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCompleted(idx + 1)}
              disabled={!isActive}
              className={cn(
                'aspect-square rounded-lg font-bold text-lg transition-all',
                'hover:scale-105 active:scale-95',
                idx < completed
                  ? 'bg-green-500 text-white'
                  : 'bg-background border-2 hover:border-primary'
              )}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button onClick={handleStart} className="flex-1" size="lg">
            Start
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
