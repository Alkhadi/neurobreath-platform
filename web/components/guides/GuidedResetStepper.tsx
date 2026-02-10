'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  instruction: string;
  durationSeconds: number;
}

const STEPS: Step[] = [
  {
    id: 'breathing',
    title: 'Gentle paced breathing',
    instruction: 'Breathe in for 4 counts, breathe out for 6 counts. Keep the pace gentle.',
    durationSeconds: 60,
  },
  {
    id: 'grounding',
    title: 'Grounding 5-4-3-2-1',
    instruction: 'Name 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, 1 you can taste.',
    durationSeconds: 90,
  },
  {
    id: 'movement',
    title: 'Gentle movement',
    instruction: 'Roll your shoulders back, unclench your jaw, stretch your neck gently from side to side.',
    durationSeconds: 60,
  },
  {
    id: 'slow-exhale',
    title: 'Slow exhale breathing',
    instruction: 'Take slow, comfortable breaths. Let your exhale be longer than your inhale.',
    durationSeconds: 60,
  },
  {
    id: 'micro-action',
    title: 'Name your next step',
    instruction: 'What is the smallest, simplest thing you can do next? Name it now.',
    durationSeconds: 30,
  },
];

const TOTAL_DURATION = STEPS.reduce((acc, step) => acc + step.durationSeconds, 0);

export function GuidedResetStepper() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimeRemaining, setStepTimeRemaining] = useState(STEPS[0].durationSeconds);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = STEPS[currentStepIndex];

  const totalTimeRemaining = STEPS.slice(currentStepIndex).reduce(
    (acc, step, idx) => acc + (idx === 0 ? stepTimeRemaining : step.durationSeconds),
    0
  );

  const totalElapsed = TOTAL_DURATION - totalTimeRemaining;
  const progressPercentage = (totalElapsed / TOTAL_DURATION) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const moveToNextStep = useCallback(() => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setStepTimeRemaining(STEPS[currentStepIndex + 1].durationSeconds);
    } else {
      setIsRunning(false);
      setIsComplete(true);
    }
  }, [currentStepIndex]);

  useEffect(() => {
    if (isRunning && stepTimeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setStepTimeRemaining((prev) => {
          if (prev <= 1) {
            moveToNextStep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, stepTimeRemaining, moveToNextStep]);

  const handleStart = () => {
    setIsRunning(true);
    setIsComplete(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setStepTimeRemaining(STEPS[0].durationSeconds);
    setIsComplete(false);
  };

  const handleSkip = () => {
    moveToNextStep();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (isComplete) {
        handleReset();
      } else if (isRunning) {
        handlePause();
      } else {
        handleStart();
      }
    }
  };

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="5-minute guided reset timer"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">5-minute guided reset</h3>
          <span className="text-sm text-slate-600">
            Total: {formatTime(totalTimeRemaining)} remaining
          </span>
        </div>

        <Progress value={progressPercentage} className="h-2" />

        <div className="flex gap-2 overflow-x-auto py-2">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              className={cn(
                'flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                idx === currentStepIndex
                  ? 'bg-indigo-600 text-white'
                  : idx < currentStepIndex
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              )}
            >
              {idx + 1}. {step.title}
            </div>
          ))}
        </div>

        {isComplete ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
            <p className="text-lg font-semibold text-emerald-800">Reset complete</p>
            <p className="text-sm text-emerald-700 mt-1">
              Well done. Take a moment before your next task.
            </p>
          </div>
        ) : (
          <div
            className={cn(
              'rounded-xl border-2 p-6 transition-colors',
              isRunning
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-slate-200 bg-slate-50'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Step {currentStepIndex + 1} of {STEPS.length}
                </p>
                <p className="text-xl font-semibold text-slate-900 mt-1">
                  {currentStep.title}
                </p>
              </div>
              <div
                className={cn(
                  'text-3xl font-bold tabular-nums',
                  isRunning ? 'text-indigo-600' : 'text-slate-600'
                )}
              >
                {formatTime(stepTimeRemaining)}
              </div>
            </div>
            <p className="text-base text-slate-700 mt-4 leading-relaxed">
              {currentStep.instruction}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {!isRunning && !isComplete && (
            <Button onClick={handleStart} size="lg">
              <Play className="h-4 w-4 mr-2" />
              {currentStepIndex === 0 && stepTimeRemaining === STEPS[0].durationSeconds
                ? 'Start'
                : 'Resume'}
            </Button>
          )}
          {isRunning && (
            <Button onClick={handlePause} variant="outline" size="lg">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          {isRunning && currentStepIndex < STEPS.length - 1 && (
            <Button onClick={handleSkip} variant="ghost" size="lg">
              <SkipForward className="h-4 w-4 mr-2" />
              Skip step
            </Button>
          )}
          {(isComplete || currentStepIndex > 0 || stepTimeRemaining !== STEPS[0].durationSeconds) && (
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        <p className="text-xs text-slate-500 text-center">
          Press Space or Enter to start/pause. No audio — text cues only.
        </p>
      </div>
    </div>
  );
}
