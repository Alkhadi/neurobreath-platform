'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const BREATHING_PATTERNS = {
  box: { name: 'Box Breathing', phases: [4, 4, 4, 4], labels: ['Inhale', 'Hold', 'Exhale', 'Hold'] },
  '4-7-8': { name: '4-7-8 Breathing', phases: [4, 7, 8, 0], labels: ['Inhale', 'Hold', 'Exhale', ''] },
  coherent: { name: 'Coherent 5-5', phases: [5, 0, 5, 0], labels: ['Inhale', '', 'Exhale', ''] },
};

type Pattern = keyof typeof BREATHING_PATTERNS;

export function BreathingExercise() {
  const [pattern, setPattern] = useState<Pattern>('box');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const currentPattern = BREATHING_PATTERNS[pattern];
    const phaseTime = currentPattern.phases[phase];

    if (phaseTime === 0) {
      // Skip phases with 0 duration
      setPhase((p) => (p + 1) % currentPattern.phases.length);
      return;
    }

    if (countdown === 0) {
      setCountdown(phaseTime);
    }

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setPhase((p) => {
            const nextPhase = (p + 1) % currentPattern.phases.length;
            if (nextPhase === 0) {
              setCycles((cy) => cy + 1);
              setTotalTime((t) => t + currentPattern.phases.reduce((a, b) => a + b, 0));
            }
            return nextPhase;
          });
          return currentPattern.phases[(phase + 1) % currentPattern.phases.length];
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, countdown, phase, pattern]);

  const handleReset = () => {
    setIsActive(false);
    setPhase(0);
    setCountdown(0);
    setCycles(0);
  };

  const currentPattern = BREATHING_PATTERNS[pattern];
  const currentPhaseLabel = currentPattern.labels[phase] || 'Ready';

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-cyan-600" />
          <div>
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">Calm Reset • 60 Seconds</p>
            <h2 className="text-lg sm:text-xl font-bold">Breathing Exercise</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Take a moment to breathe. This helps your brain prepare for reading.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <Tabs value={pattern} onValueChange={(v) => setPattern(v as Pattern)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="box">Box</TabsTrigger>
            <TabsTrigger value="4-7-8">4-7-8</TabsTrigger>
            <TabsTrigger value="coherent">5-5</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Breathing Circle */}
        <div className="flex justify-center py-8">
          <div className="relative">
            <div
              className={cn(
                'w-32 h-32 rounded-full transition-all duration-1000 flex items-center justify-center',
                isActive && currentPhaseLabel === 'Inhale' && 'scale-150',
                isActive && currentPhaseLabel === 'Exhale' && 'scale-75',
                'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg'
              )}
            >
              <div className="text-white text-center">
                <div className="text-3xl font-bold">{countdown || 'Ready'}</div>
                <div className="text-sm">{currentPhaseLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button onClick={() => setIsActive(!isActive)} size="lg" className="gap-2">
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive ? 'Pause' : 'Start Breathing'}
          </Button>
          <Button onClick={handleReset} size="lg" variant="outline">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Stats */}
        <div className="flex justify-around py-4 border-t">
          <div className="text-center">
            <div className="text-xl font-bold">{cycles}</div>
            <p className="text-xs text-muted-foreground">cycles</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</div>
            <p className="text-xs text-muted-foreground">time</p>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Equal timing for all phases. Great for focus and calm.
        </p>
      </CardContent>
    </Card>
  );
}
