'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ScanStep {
  id: string;
  title: string;
  instruction: string;
  miniDuration: number;
  fullDuration: number;
}

const SCAN_STEPS: ScanStep[] = [
  {
    id: 'feet',
    title: 'Feet and ankles',
    instruction: 'Notice your feet. Are they tense or relaxed? Gently soften any tightness.',
    miniDuration: 20,
    fullDuration: 60,
  },
  {
    id: 'legs',
    title: 'Legs and knees',
    instruction: 'Move your attention up to your legs. Let them feel heavy and supported.',
    miniDuration: 25,
    fullDuration: 80,
  },
  {
    id: 'torso',
    title: 'Torso and abdomen',
    instruction: 'Notice your belly and lower back. Let your breath move softly here.',
    miniDuration: 30,
    fullDuration: 100,
  },
  {
    id: 'shoulders',
    title: 'Shoulders and arms',
    instruction: 'Let your shoulders drop. Notice your arms and hands — unclench if needed.',
    miniDuration: 30,
    fullDuration: 100,
  },
  {
    id: 'face',
    title: 'Face and jaw',
    instruction: 'Soften your jaw, relax your forehead, let your eyes feel easy.',
    miniDuration: 25,
    fullDuration: 80,
  },
  {
    id: 'breath',
    title: 'Whole body breath',
    instruction: 'Take a slow breath. Notice your whole body. Rest here for a moment.',
    miniDuration: 30,
    fullDuration: 100,
  },
];

type ScanMode = 'mini' | 'full';

export function GuidedBodyScan() {
  const [mode, setMode] = useState<ScanMode>('mini');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimeRemaining, setStepTimeRemaining] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showAdaptations, setShowAdaptations] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = SCAN_STEPS[currentStepIndex];

  const getDuration = useCallback(
    (step: ScanStep) => (mode === 'mini' ? step.miniDuration : step.fullDuration),
    [mode]
  );

  const totalDuration = SCAN_STEPS.reduce((acc, step) => acc + getDuration(step), 0);

  const totalTimeRemaining = SCAN_STEPS.slice(currentStepIndex).reduce(
    (acc, step, idx) => acc + (idx === 0 ? stepTimeRemaining : getDuration(step)),
    0
  );

  const totalElapsed = totalDuration - totalTimeRemaining;
  const progressPercentage = totalDuration > 0 ? (totalElapsed / totalDuration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    if (mins === 0) return `${remaining}s`;
    if (remaining === 0) return `${mins} min`;
    return `${mins}:${remaining.toString().padStart(2, '0')}`;
  };

  const moveToNextStep = useCallback(() => {
    if (currentStepIndex < SCAN_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setStepTimeRemaining(getDuration(SCAN_STEPS[nextIndex]));
    } else {
      setIsRunning(false);
      setIsComplete(true);
    }
  }, [currentStepIndex, getDuration]);

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
    if (stepTimeRemaining === 0) {
      setStepTimeRemaining(getDuration(currentStep));
    }
    setIsRunning(true);
    setIsComplete(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setStepTimeRemaining(getDuration(SCAN_STEPS[0]));
    setIsComplete(false);
  };

  const handleSkip = () => {
    moveToNextStep();
  };

  const handleModeChange = (newMode: ScanMode) => {
    setMode(newMode);
    setIsRunning(false);
    setCurrentStepIndex(0);
    setStepTimeRemaining(newMode === 'mini' ? SCAN_STEPS[0].miniDuration : SCAN_STEPS[0].fullDuration);
    setIsComplete(false);
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

  const miniTotal = SCAN_STEPS.reduce((acc, step) => acc + step.miniDuration, 0);
  const fullTotal = SCAN_STEPS.reduce((acc, step) => acc + step.fullDuration, 0);

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Guided body scan"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Guided body scan</h3>
          {!isRunning && !isComplete && (
            <span className="text-sm text-slate-600">
              Choose a duration to begin
            </span>
          )}
          {(isRunning || isComplete) && (
            <span className="text-sm text-slate-600">
              {formatTime(totalTimeRemaining)} remaining
            </span>
          )}
        </div>

        {!isRunning && !isComplete && stepTimeRemaining === 0 && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleModeChange('mini')}
              className={cn(
                'rounded-xl border-2 p-4 text-left transition-colors',
                mode === 'mini'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              )}
            >
              <p className="font-semibold text-slate-900">Mini scan</p>
              <p className="text-sm text-slate-600">{formatDuration(miniTotal)}</p>
              <p className="text-xs text-slate-500 mt-1">Quick tension check</p>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('full')}
              className={cn(
                'rounded-xl border-2 p-4 text-left transition-colors',
                mode === 'full'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              )}
            >
              <p className="font-semibold text-slate-900">Full scan</p>
              <p className="text-sm text-slate-600">{formatDuration(fullTotal)}</p>
              <p className="text-xs text-slate-500 mt-1">Deeper relaxation</p>
            </button>
          </div>
        )}

        {(isRunning || isComplete || stepTimeRemaining > 0) && (
          <Progress value={progressPercentage} className="h-2" />
        )}

        {(isRunning || stepTimeRemaining > 0) && !isComplete && (
          <div className="flex gap-2 overflow-x-auto py-2">
            {SCAN_STEPS.map((step, idx) => (
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
                {step.title}
              </div>
            ))}
          </div>
        )}

        {isComplete ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
            <p className="text-lg font-semibold text-emerald-800">Scan complete</p>
            <p className="text-sm text-emerald-700 mt-1">
              Take a moment before moving on. Notice how your body feels now.
            </p>
          </div>
        ) : stepTimeRemaining > 0 ? (
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
                  {currentStepIndex + 1} of {SCAN_STEPS.length}
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
        ) : null}

        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {!isRunning && !isComplete && (
            <Button onClick={handleStart} size="lg">
              <Play className="h-4 w-4 mr-2" />
              {stepTimeRemaining > 0 ? 'Resume' : 'Start'}
            </Button>
          )}
          {isRunning && (
            <Button onClick={handlePause} variant="outline" size="lg">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          {isRunning && currentStepIndex < SCAN_STEPS.length - 1 && (
            <Button onClick={handleSkip} variant="ghost" size="lg">
              <SkipForward className="h-4 w-4 mr-2" />
              Skip
            </Button>
          )}
          {(isComplete || stepTimeRemaining > 0) && (
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        <p className="text-xs text-slate-500 text-center">
          Press Space or Enter to start/pause. Text cues only — no audio.
        </p>

        <div className="border-t border-slate-200 pt-4 mt-4">
          <button
            type="button"
            onClick={() => setShowAdaptations(!showAdaptations)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            aria-expanded={showAdaptations}
          >
            {showAdaptations ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            If this feels uncomfortable
          </button>
          {showAdaptations && (
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
              <ul className="space-y-2">
                <li>
                  <strong>Keep your eyes open</strong> if closing them feels unsettling.
                </li>
                <li>
                  <strong>Shorten the scan</strong> — focus on hands and feet only.
                </li>
                <li>
                  <strong>Switch to grounding</strong> — try the 5-4-3-2-1 method instead.
                </li>
                <li>
                  <strong>Stop at any time</strong> if you feel panicky or distressed.
                </li>
              </ul>
              <p className="mt-3 text-xs text-amber-800">
                Body scans are not helpful for everyone. If this approach does not suit you,
                that is completely normal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
