'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { trackToolUsage } from '../utils/localStorage';
import { cn } from '@/lib/utils';
import { getBreathingSnapshotAtElapsedMs } from '@/lib/breathing/engineSnapshot';

interface InteractiveToolsProps {
  language: Language;
}

type Tool = 'breathing' | 'grounding' | 'thought-challenge';

export const InteractiveTools: React.FC<InteractiveToolsProps> = ({ language }) => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  return (
    <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="mb-2 text-[1.75rem] font-bold text-[var(--color-primary)]">
          <span className="mr-2 text-2xl" aria-hidden="true">
            🎯
          </span>
          Interactive Management Tools
        </h3>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-secondary)]">
          Evidence-based exercises to help manage symptoms, reduce stress, and improve emotional
          regulation. These tools are recommended by mental health professionals worldwide.
        </p>
      </div>

      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <button
          type="button"
          className="rounded-xl border-2 border-transparent bg-[var(--color-surface)] p-6 text-left transition hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          onClick={() => setActiveTool('breathing')}
        >
          <div className="mb-4 text-5xl" aria-hidden="true">
            🫁
          </div>
          <h4 className="mb-2 text-xl font-bold text-[var(--color-text)]">Breathing Exercise</h4>
          <p className="mb-4 text-[0.9375rem] leading-relaxed text-[var(--color-text-secondary)]">
            4-7-8 breathing technique to calm anxiety and promote relaxation
          </p>
          <div className="rounded-lg bg-[rgba(37,99,235,0.1)] p-3 text-sm text-[var(--color-primary)]">
            <strong>Evidence:</strong> Reduces cortisol, activates parasympathetic nervous system
          </div>
        </button>

        <button
          type="button"
          className="rounded-xl border-2 border-transparent bg-[var(--color-surface)] p-6 text-left transition hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          onClick={() => setActiveTool('grounding')}
        >
          <div className="mb-4 text-5xl" aria-hidden="true">
            🌿
          </div>
          <h4 className="mb-2 text-xl font-bold text-[var(--color-text)]">Grounding Exercise</h4>
          <p className="mb-4 text-[0.9375rem] leading-relaxed text-[var(--color-text-secondary)]">
            5-4-3-2-1 technique to anchor yourself in the present moment
          </p>
          <div className="rounded-lg bg-[rgba(37,99,235,0.1)] p-3 text-sm text-[var(--color-primary)]">
            <strong>Evidence:</strong> Interrupts panic cycles, reduces dissociation
          </div>
        </button>

        <button
          type="button"
          className="rounded-xl border-2 border-transparent bg-[var(--color-surface)] p-6 text-left transition hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          onClick={() => setActiveTool('thought-challenge')}
        >
          <div className="mb-4 text-5xl" aria-hidden="true">
            🧠
          </div>
          <h4 className="mb-2 text-xl font-bold text-[var(--color-text)]">Thought Challenge</h4>
          <p className="mb-4 text-[0.9375rem] leading-relaxed text-[var(--color-text-secondary)]">
            Cognitive restructuring to identify and reframe negative thoughts
          </p>
          <div className="rounded-lg bg-[rgba(37,99,235,0.1)] p-3 text-sm text-[var(--color-primary)]">
            <strong>Evidence:</strong> Core CBT technique, proven effective for mood disorders
          </div>
        </button>
      </div>

      {activeTool === 'breathing' && (
        <BreathingExercise
          language={language}
          onClose={() => setActiveTool(null)}
        />
      )}

      {activeTool === 'grounding' && (
        <GroundingExercise
          language={language}
          onClose={() => setActiveTool(null)}
        />
      )}

      {activeTool === 'thought-challenge' && (
        <ThoughtChallenge
          language={language}
          onClose={() => setActiveTool(null)}
        />
      )}
    </div>
  );
};

// Breathing Exercise Component
const BreathingExercise: React.FC<{ language: Language; onClose: () => void }> = ({
  language: _language,
  onClose,
}) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const elapsedSecondsRef = useRef(0);

  useEffect(() => {
    if (!isActive) return;

    const phaseDefs = [
      { name: 'inhale', durationSeconds: 4 },
      { name: 'hold', durationSeconds: 7 },
      { name: 'exhale', durationSeconds: 8 },
      { name: 'pause', durationSeconds: 2 },
    ];

    const syncFromElapsedSeconds = (elapsedSeconds: number) => {
      const snapshot = getBreathingSnapshotAtElapsedMs({
        phases: phaseDefs,
        elapsedMs: elapsedSeconds * 1000,
        totalMs: undefined,
      });

      setPhase(snapshot.phaseName as typeof phase);
      setCount(Math.max(0, Math.ceil(snapshot.phaseMsRemaining / 1000)));
      setCompletedCycles(snapshot.cyclesCompleted);

      return snapshot;
    };

    syncFromElapsedSeconds(elapsedSecondsRef.current);

    const interval = setInterval(() => {
      elapsedSecondsRef.current += 1;
      syncFromElapsedSeconds(elapsedSecondsRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCompletedCycles(0);
    elapsedSecondsRef.current = 0;
    setCount(4);
  };

  const handleComplete = () => {
    trackToolUsage('breathing-exercise', 'Breathing Exercise');
    onClose();
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in through your nose';
      case 'hold':
        return 'Hold your breath';
      case 'exhale':
        return 'Exhale slowly through your mouth';
      case 'pause':
        return 'Pause';
    }
  };

  const phaseCircleClass: Record<typeof phase, string> = {
    inhale: 'scale-[1.2] bg-[var(--color-primary)]',
    hold: 'scale-[1.2] bg-[var(--color-accent)]',
    exhale: 'scale-[0.8] bg-[var(--color-secondary)]',
    pause: 'scale-[0.8] bg-[var(--color-surface-dark)]',
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-8">
        <button
          type="button"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xl text-[var(--color-text-secondary)] transition hover:bg-black/5"
          onClick={handleComplete}
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="mb-6 text-2xl font-bold text-[var(--color-primary)]">
          4-7-8 Breathing Exercise
        </h3>

        <div className="flex flex-col items-center gap-6 py-8">
          <div
            className={cn(
              'flex h-[200px] w-[200px] items-center justify-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-1000 ease-in-out',
              phaseCircleClass[phase]
            )}
            aria-label="Breathing timer"
          >
            <div className="text-6xl font-bold text-white">{count}</div>
          </div>

          <div className="text-center text-xl font-semibold text-[var(--color-text)]">
            {getPhaseInstruction()}
          </div>

          {!isActive && (
            <button
              type="button"
              className="rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-white"
              onClick={handleStart}
            >
              Start Exercise
            </button>
          )}

          {isActive && (
            <button
              type="button"
              className="rounded-lg bg-[var(--color-error)] px-6 py-3 text-[0.9375rem] font-semibold text-white"
              onClick={() => setIsActive(false)}
            >
              Pause
            </button>
          )}

          <div className="text-[0.9375rem] text-[var(--color-text-secondary)]">
            Completed cycles: {completedCycles}
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-[var(--color-surface)] p-4 text-sm leading-relaxed">
          <h4>How it works:</h4>
          <ol className="ml-6 list-decimal space-y-1">
            <li>Inhale through your nose for 4 seconds</li>
            <li>Hold your breath for 7 seconds</li>
            <li>Exhale slowly through your mouth for 8 seconds</li>
            <li>Pause briefly, then repeat</li>
          </ol>
          <p>
            <strong>Tip:</strong> Practice 3-4 cycles. This technique activates your body's
            relaxation response.
          </p>
        </div>
      </div>
    </div>
  );
};

// Grounding Exercise Component
const GroundingExercise: React.FC<{ language: Language; onClose: () => void }> = ({
  language: _language,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);

  const steps = [
    { sense: 'See', count: 5, prompt: 'Name 5 things you can see', icon: '👁️' },
    { sense: 'Touch', count: 4, prompt: 'Name 4 things you can touch', icon: '✋' },
    { sense: 'Hear', count: 3, prompt: 'Name 3 things you can hear', icon: '👂' },
    { sense: 'Smell', count: 2, prompt: 'Name 2 things you can smell', icon: '👃' },
    { sense: 'Taste', count: 1, prompt: 'Name 1 thing you can taste', icon: '👅' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    trackToolUsage('grounding-exercise', 'Grounding Exercise');
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-8">
        <button
          type="button"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xl text-[var(--color-text-secondary)] transition hover:bg-black/5"
          onClick={handleComplete}
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="mb-6 text-2xl font-bold text-[var(--color-primary)]">
          5-4-3-2-1 Grounding Technique
        </h3>

        <div className="mb-8 flex justify-center gap-2">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            return (
              <div
                key={step.sense}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full border-2 bg-[var(--color-surface)] text-2xl transition',
                  'border-[var(--color-border)]',
                  isActive &&
                    'scale-[1.2] border-[var(--color-primary)] bg-[var(--color-primary)] text-white',
                  isComplete &&
                    'border-[var(--color-success)] bg-[var(--color-success)] text-white'
                )}
              >
                {step.icon}
              </div>
            );
          })}
        </div>

        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl" aria-hidden="true">
            {currentStepData.icon}
          </div>
          <h4 className="mb-4 text-xl font-semibold text-[var(--color-text)]">
            {currentStepData.prompt}
          </h4>

          <textarea
            className="w-full resize-y rounded-lg border border-[var(--color-border)] p-3 text-base"
            aria-label={currentStepData.prompt}
            value={answers[currentStep]}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[currentStep] = e.target.value;
              setAnswers(newAnswers);
            }}
            placeholder={`List ${currentStepData.count} thing(s) you can ${currentStepData.sense.toLowerCase()}...`}
            rows={5}
          />
        </div>

        <div className="flex justify-between gap-4">
          <button
            type="button"
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-[0.9375rem] font-semibold text-[var(--color-text)]"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-[0.9375rem] font-semibold text-[var(--color-text)]"
              onClick={handleNext}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="rounded-lg bg-[var(--color-success)] px-6 py-3 text-[0.9375rem] font-semibold text-white"
              onClick={handleComplete}
            >
              Complete ✓
            </button>
          )}
        </div>

        <div className="mt-8 rounded-lg bg-[var(--color-surface)] p-4 text-sm leading-relaxed">
          <h4>About this technique:</h4>
          <p>
            The 5-4-3-2-1 grounding technique helps interrupt anxious thoughts and panic by
            redirecting your focus to the present moment through your five senses. It's
            particularly effective during moments of high anxiety or dissociation.
          </p>
        </div>
      </div>
    </div>
  );
};

// Thought Challenge Component
const ThoughtChallenge: React.FC<{ language: Language; onClose: () => void }> = ({
  language: _language,
  onClose,
}) => {
  const [thought, setThought] = useState('');
  const [evidence, setEvidence] = useState('');
  const [alternativeThought, setAlternativeThought] = useState('');
  const [distortions, setDistortions] = useState<string[]>([]);

  const cognitiveDistortions = [
    'All-or-nothing thinking',
    'Overgeneralization',
    'Mental filter',
    'Jumping to conclusions',
    'Magnification/Minimization',
    'Emotional reasoning',
    'Should statements',
    'Labeling',
    'Personalization',
  ];

  const handleComplete = () => {
    trackToolUsage('thought-challenge', 'Thought Challenge');
    onClose();
  };

  const toggleDistortion = (distortion: string) => {
    if (distortions.includes(distortion)) {
      setDistortions(distortions.filter((d) => d !== distortion));
    } else {
      setDistortions([...distortions, distortion]);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-8">
        <button
          type="button"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xl text-[var(--color-text-secondary)] transition hover:bg-black/5"
          onClick={handleComplete}
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="mb-6 text-2xl font-bold text-[var(--color-primary)]">
          Cognitive Restructuring
        </h3>

        <div className="mb-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="tc-thought" className="text-[0.9375rem] text-[var(--color-text)]">
              <strong>1. What's the thought or belief?</strong>
            </label>
            <textarea
              id="tc-thought"
              className="w-full resize-y rounded-lg border border-[var(--color-border)] p-3 text-base"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Example: I'm a failure and everything I do goes wrong."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[0.9375rem] text-[var(--color-text)]">
              <strong>2. Identify cognitive distortions:</strong>
            </div>
            <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
              {cognitiveDistortions.map((distortion) => (
                <button
                  key={distortion}
                  type="button"
                  className={cn(
                    'rounded-lg border px-3 py-2 text-left text-sm transition',
                    'border-[var(--color-border)] bg-[var(--color-surface)]',
                    distortions.includes(distortion) &&
                      'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  )}
                  onClick={() => toggleDistortion(distortion)}
                >
                  {distortion}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tc-evidence" className="text-[0.9375rem] text-[var(--color-text)]">
              <strong>3. What's the evidence against this thought?</strong>
            </label>
            <textarea
              id="tc-evidence"
              className="w-full resize-y rounded-lg border border-[var(--color-border)] p-3 text-base"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Example: I completed my project last week. My colleague complimented my work. I've succeeded at many things before."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="tc-alternative"
              className="text-[0.9375rem] text-[var(--color-text)]"
            >
              <strong>4. What's a more balanced thought?</strong>
            </label>
            <textarea
              id="tc-alternative"
              className="w-full resize-y rounded-lg border border-[var(--color-border)] p-3 text-base"
              value={alternativeThought}
              onChange={(e) => setAlternativeThought(e.target.value)}
              placeholder="Example: Sometimes I make mistakes, but I've also had many successes. One setback doesn't define my worth."
              rows={3}
            />
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg bg-[var(--color-success)] px-6 py-3 text-[0.9375rem] font-semibold text-white"
          onClick={handleComplete}
        >
          Save Challenge
        </button>

        <div className="mt-8 rounded-lg bg-[var(--color-surface)] p-4 text-sm leading-relaxed">
          <h4>How Cognitive Restructuring Works:</h4>
          <p>
            This evidence-based CBT technique helps you identify and challenge negative thought
            patterns. By examining the evidence and reframing thoughts, you can reduce emotional
            distress and develop more balanced thinking patterns.
          </p>
        </div>
      </div>
    </div>
  );
};
