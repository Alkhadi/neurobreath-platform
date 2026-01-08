"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Pause, RotateCcw, SkipForward, CheckCircle2, Timer, Coffee, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type DrillPhase = 'work' | 'break' | 'complete';

export function FocusDrill({ onComplete }: { onComplete?: (totalMinutes: number) => void }) {
  const [currentBlock, setCurrentBlock] = useState(1);
  const [phase, setPhase] = useState<DrillPhase>('work');
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalBlocks = 3;
  const workDuration = 5 * 60; // 5 minutes
  const breakDuration = 1 * 60; // 1 minute

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePhaseComplete = useCallback(() => {
    setIsActive(false);

    if (phase === 'work') {
      if (currentBlock < totalBlocks) {
        // Move to break
        setPhase('break');
        setTimeLeft(breakDuration);
      } else {
        // Drill complete!
        setPhase('complete');
        if (onComplete) {
          onComplete(totalBlocks * 5); // 15 minutes total
        }
      }
    } else if (phase === 'break') {
      // Move to next work block
      setCurrentBlock(currentBlock + 1);
      setPhase('work');
      setTimeLeft(workDuration);
    }
  }, [phase, currentBlock, totalBlocks, breakDuration, workDuration, onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handlePhaseComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handlePhaseComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetDrill = () => {
    setIsActive(false);
    setCurrentBlock(1);
    setPhase('work');
    setTimeLeft(workDuration);
  };

  const skipToNextPhase = () => {
    setIsActive(false);
    handlePhaseComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = phase === 'work' ? workDuration : breakDuration;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getOverallProgress = () => {
    if (phase === 'complete') return 100;
    const completedBlocks = currentBlock - 1;
    const currentBlockProgress = phase === 'work' ? getProgress() / 100 : 1;
    return ((completedBlocks + currentBlockProgress) / totalBlocks) * 100;
  };

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Focus Drill...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (phase === 'complete') {
    return (
      <Card className="border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-300 dark:border-green-700">
        <CardHeader>
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto" />
            </motion.div>
            <div>
              <CardTitle className="text-3xl mb-2">Focus Drill Complete!</CardTitle>
              <CardDescription className="text-lg">
                You completed 3 blocks × 5 minutes = 15 minutes of focused work
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <Button size="lg" onClick={resetDrill} className="min-h-[44px]">
                <RotateCcw className="w-5 h-5 mr-2" />
                Start Another Drill
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${
      phase === 'work' 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700'
        : 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-green-300 dark:border-green-700'
    }`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2 flex-wrap">
              {phase === 'work' ? <Zap className="w-6 h-6 flex-shrink-0" /> : <Coffee className="w-6 h-6 flex-shrink-0" />}
              <span className="min-w-0">Focus Drill (3×5)</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {phase === 'work' ? 'Focus block' : 'Recovery break'} — Block {currentBlock}/{totalBlocks}
            </CardDescription>
          </div>
          <Badge className="text-base sm:text-lg px-3 sm:px-4 py-2 self-start sm:self-auto" variant={phase === 'work' ? 'default' : 'secondary'}>
            {phase === 'work' ? 'Focus Time' : 'Break'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pre-start checklist */}
        {!isActive && currentBlock === 1 && timeLeft === workDuration && (
          <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
            <AlertDescription>
              <p className="font-medium mb-2">Before you start:</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Notifications turned off</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Single browser tab only</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Clear single task in mind</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Timer display */}
        <div className="text-center space-y-4">
          <motion.div
            key={timeLeft}
            initial={{ scale: 1 }}
            animate={{ scale: isActive && timeLeft % 60 === 0 && timeLeft > 0 ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className="text-5xl sm:text-7xl font-bold font-mono"
          >
            {formatTime(timeLeft)}
          </motion.div>

          <Progress value={getProgress()} className="h-2 sm:h-3" />

          {/* Control buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={toggleTimer}
              className={`min-w-[120px] sm:min-w-[140px] min-h-[44px] ${
                phase === 'work' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                  : 'bg-gradient-to-r from-green-500 to-teal-600'
              } text-white hover:opacity-90`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {timeLeft === (phase === 'work' ? workDuration : breakDuration) ? 'Start' : 'Resume'}
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={resetDrill}
              className="min-h-[44px]"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>

            {isActive && (
              <Button
                size="lg"
                variant="outline"
                onClick={skipToNextPhase}
                className="min-h-[44px]"
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Skip
              </Button>
            )}
          </div>
        </div>

        {/* Overall progress */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Overall Progress</span>
            <span>{Math.round(getOverallProgress())}%</span>
          </div>
          <Progress value={getOverallProgress()} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Block {currentBlock} of {totalBlocks}</span>
            <span>{currentBlock * 5}/{totalBlocks * 5} minutes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
