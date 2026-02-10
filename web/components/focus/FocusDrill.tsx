'use client';

import { useState, useEffect, useCallback } from 'react';
import { Target, Play, Pause, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { logFocusDrill } from '@/lib/focus/progress-store';

const TOTAL_BLOCKS = 3;
const BLOCK_DURATION_SECONDS = 5 * 60; // 5 minutes

export function FocusDrill() {
  const [isActive, setIsActive] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(1);
  const [timeLeft, setTimeLeft] = useState(BLOCK_DURATION_SECONDS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleComplete = useCallback(() => {
    if (currentBlock < TOTAL_BLOCKS) {
      setCurrentBlock((prev) => prev + 1);
      setTimeLeft(BLOCK_DURATION_SECONDS);
    } else {
      // All blocks complete
      logFocusDrill(15); // 3 x 5 minutes
      setIsActive(false);
      setCurrentBlock(1);
      setTimeLeft(BLOCK_DURATION_SECONDS);
    }
  }, [currentBlock]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((BLOCK_DURATION_SECONDS - timeLeft) / BLOCK_DURATION_SECONDS) * 100;

  const handleReset = () => {
    setIsActive(false);
    setCurrentBlock(1);
    setTimeLeft(BLOCK_DURATION_SECONDS);
  };

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  if (!mounted) {
    return (
      <Card className="p-6 mb-6 border-2 border-primary/20">
        <div className="h-32 animate-pulse bg-muted/20 rounded" />
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6 border-2 border-primary/20">
      <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
        <Target className="h-6 w-6" />
        Focus Drill (3x5)
      </h2>
      <p className="text-muted-foreground mb-4">
        Single-task focus: 3 blocks x 5 minutes. Pick one small outcome.
        Notifications off; one tab only.
      </p>

      {(isActive || currentBlock > 1 || timeLeft < BLOCK_DURATION_SECONDS) && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Block {currentBlock} of {TOTAL_BLOCKS}
            </span>
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      )}

      <div className="flex gap-3">
        <Button className="bg-primary" onClick={handleToggle}>
          {isActive ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              {currentBlock > 1 || timeLeft < BLOCK_DURATION_SECONDS ? 'Resume' : 'Start'}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!isActive && currentBlock === 1 && timeLeft === BLOCK_DURATION_SECONDS}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
