'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIMER_PRESETS = [
  { label: 'Focus', time: 25 * 60, progressClassName: 'nb-progress--focus' },
  { label: 'Short', time: 5 * 60, progressClassName: 'nb-progress--short' },
  { label: 'Long', time: 50 * 60, progressClassName: 'nb-progress--long' },
];

export function PracticeTimer() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS[0].time);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            setSessions((s) => s + 1);
            setTotalMinutes((m) => m + Math.floor(TIMER_PRESETS[selectedPreset].time / 60));
            return TIMER_PRESETS[selectedPreset].time;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, selectedPreset]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePresetChange = (index: number) => {
    setSelectedPreset(index);
    setTimeLeft(TIMER_PRESETS[index].time);
    setIsActive(false);
  };

  const handleReset = () => {
    setTimeLeft(TIMER_PRESETS[selectedPreset].time);
    setIsActive(false);
  };

  const totalSeconds = TIMER_PRESETS[selectedPreset].time;
  const elapsedSeconds = totalSeconds - timeLeft;

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg sm:text-xl font-bold">Practice Timer</h2>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Preset Buttons */}
        <div className="flex gap-2 justify-center">
          {TIMER_PRESETS.map((preset, idx) => (
            <Button
              key={idx}
              variant={selectedPreset === idx ? 'default' : 'outline'}
              onClick={() => handlePresetChange(idx)}
              className="flex-1"
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">Focus Time</p>
          <div className="text-6xl font-bold tabular-nums">{formatTime(timeLeft)}</div>
          <p className="text-sm font-medium text-primary">Time to practice!</p>
        </div>

        {/* Progress Bar */}
        <progress
          className={cn('nb-progress', TIMER_PRESETS[selectedPreset].progressClassName)}
          value={elapsedSeconds}
          max={totalSeconds}
          aria-label="Timer progress"
        />

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button
            size="lg"
            onClick={() => setIsActive(!isActive)}
            className="gap-2"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button size="lg" variant="outline" onClick={handleReset}>
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{sessions}</div>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalMinutes}</div>
            <p className="text-xs text-muted-foreground">Minutes focused</p>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          until long break
        </p>
      </CardContent>
    </Card>
  );
}
