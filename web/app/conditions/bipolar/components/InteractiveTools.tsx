'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { trackToolUsage } from '../utils/localStorage';

interface InteractiveToolsProps {
  language: Language;
}

type Tool = 'breathing' | 'grounding' | 'thought-challenge';

export const InteractiveTools: React.FC<InteractiveToolsProps> = ({ language }) => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🎯</span>
          Interactive Management Tools
        </h3>
        <p style={styles.description}>
          Evidence-based exercises to help manage symptoms, reduce stress, and improve emotional
          regulation. These tools are recommended by mental health professionals worldwide.
        </p>
      </div>

      <div style={styles.toolsGrid}>
        <div
          style={styles.toolCard}
          onClick={() => setActiveTool('breathing')}
          role="button"
          tabIndex={0}
        >
          <div style={styles.toolIcon}>🫁</div>
          <h4 style={styles.toolName}>Breathing Exercise</h4>
          <p style={styles.toolDescription}>
            4-7-8 breathing technique to calm anxiety and promote relaxation
          </p>
          <div style={styles.toolEvidence}>
            <strong>Evidence:</strong> Reduces cortisol, activates parasympathetic nervous system
          </div>
        </div>

        <div
          style={styles.toolCard}
          onClick={() => setActiveTool('grounding')}
          role="button"
          tabIndex={0}
        >
          <div style={styles.toolIcon}>🌿</div>
          <h4 style={styles.toolName}>Grounding Exercise</h4>
          <p style={styles.toolDescription}>
            5-4-3-2-1 technique to anchor yourself in the present moment
          </p>
          <div style={styles.toolEvidence}>
            <strong>Evidence:</strong> Interrupts panic cycles, reduces dissociation
          </div>
        </div>

        <div
          style={styles.toolCard}
          onClick={() => setActiveTool('thought-challenge')}
          role="button"
          tabIndex={0}
        >
          <div style={styles.toolIcon}>🧠</div>
          <h4 style={styles.toolName}>Thought Challenge</h4>
          <p style={styles.toolDescription}>
            Cognitive restructuring to identify and reframe negative thoughts
          </p>
          <div style={styles.toolEvidence}>
            <strong>Evidence:</strong> Core CBT technique, proven effective for mood disorders
          </div>
        </div>
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
  language,
  onClose,
}) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) return prev - 1;

        switch (phase) {
          case 'inhale':
            setPhase('hold');
            return 7;
          case 'hold':
            setPhase('exhale');
            return 8;
          case 'exhale':
            setPhase('pause');
            setCompletedCycles((c) => c + 1);
            return 2;
          case 'pause':
            setPhase('inhale');
            return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
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

  const circleSize = 200;
  const scale = {
    inhale: 1.2,
    hold: 1.2,
    exhale: 0.8,
    pause: 0.8,
  }[phase];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={handleComplete}>
          ✕
        </button>

        <h3 style={styles.modalTitle}>4-7-8 Breathing Exercise</h3>

        <div style={styles.breathingContainer}>
          <div
            style={{
              ...styles.breathingCircle,
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              transform: `scale(${scale})`,
              backgroundColor: {
                inhale: 'var(--color-primary)',
                hold: 'var(--color-accent)',
                exhale: 'var(--color-secondary)',
                pause: 'var(--color-surface-dark)',
              }[phase],
            }}
          >
            <div style={styles.breathingCount}>{count}</div>
          </div>

          <div style={styles.breathingInstruction}>{getPhaseInstruction()}</div>

          {!isActive && (
            <button style={styles.startButton} onClick={handleStart}>
              Start Exercise
            </button>
          )}

          {isActive && (
            <button
              style={styles.stopButton}
              onClick={() => setIsActive(false)}
            >
              Pause
            </button>
          )}

          <div style={styles.cycleCounter}>
            Completed cycles: {completedCycles}
          </div>
        </div>

        <div style={styles.instructions}>
          <h4>How it works:</h4>
          <ol style={{ marginLeft: '1.5rem' }}>
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
  language,
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
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={handleComplete}>
          ✕
        </button>

        <h3 style={styles.modalTitle}>5-4-3-2-1 Grounding Technique</h3>

        <div style={styles.groundingProgress}>
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                ...styles.progressDot,
                ...(index === currentStep ? styles.progressDotActive : {}),
                ...(index < currentStep ? styles.progressDotComplete : {}),
              }}
            >
              {step.icon}
            </div>
          ))}
        </div>

        <div style={styles.groundingStep}>
          <div style={styles.groundingIcon}>{currentStepData.icon}</div>
          <h4 style={styles.groundingPrompt}>{currentStepData.prompt}</h4>

          <textarea
            style={styles.groundingTextarea}
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

        <div style={styles.navigationButtons}>
          <button
            style={styles.navButton}
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button style={styles.navButton} onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button style={styles.completeButton} onClick={handleComplete}>
              Complete ✓
            </button>
          )}
        </div>

        <div style={styles.instructions}>
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
  language,
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
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, maxWidth: '700px' }}>
        <button style={styles.closeButton} onClick={handleComplete}>
          ✕
        </button>

        <h3 style={styles.modalTitle}>Cognitive Restructuring</h3>

        <div style={styles.thoughtChallengeForm}>
          <div style={styles.formSection}>
            <label style={styles.formLabel}>
              <strong>1. What's the thought or belief?</strong>
            </label>
            <textarea
              style={styles.groundingTextarea}
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Example: I'm a failure and everything I do goes wrong."
              rows={3}
            />
          </div>

          <div style={styles.formSection}>
            <label style={styles.formLabel}>
              <strong>2. Identify cognitive distortions:</strong>
            </label>
            <div style={styles.distortionsGrid}>
              {cognitiveDistortions.map((distortion) => (
                <button
                  key={distortion}
                  style={{
                    ...styles.distortionButton,
                    ...(distortions.includes(distortion)
                      ? styles.distortionButtonSelected
                      : {}),
                  }}
                  onClick={() => toggleDistortion(distortion)}
                >
                  {distortion}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.formSection}>
            <label style={styles.formLabel}>
              <strong>3. What's the evidence against this thought?</strong>
            </label>
            <textarea
              style={styles.groundingTextarea}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Example: I completed my project last week. My colleague complimented my work. I've succeeded at many things before."
              rows={3}
            />
          </div>

          <div style={styles.formSection}>
            <label style={styles.formLabel}>
              <strong>4. What's a more balanced thought?</strong>
            </label>
            <textarea
              style={styles.groundingTextarea}
              value={alternativeThought}
              onChange={(e) => setAlternativeThought(e.target.value)}
              placeholder="Example: Sometimes I make mistakes, but I've also had many successes. One setback doesn't define my worth."
              rows={3}
            />
          </div>
        </div>

        <button style={styles.completeButton} onClick={handleComplete}>
          Save Challenge
        </button>

        <div style={styles.instructions}>
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

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    marginBottom: '2rem',
  } as React.CSSProperties,
  header: {
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  description: {
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    fontSize: '0.9375rem',
  } as React.CSSProperties,
  toolsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  } as React.CSSProperties,
  toolCard: {
    backgroundColor: 'var(--color-surface)',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '2px solid transparent',
  } as React.CSSProperties,
  toolIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
  toolName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  toolDescription: {
    fontSize: '0.9375rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    marginBottom: '1rem',
  } as React.CSSProperties,
  toolEvidence: {
    fontSize: '0.8125rem',
    color: 'var(--color-primary)',
    padding: '0.75rem',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: '0.5rem',
  } as React.CSSProperties,
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  } as React.CSSProperties,
  modal: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  } as React.CSSProperties,
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  } as React.CSSProperties,
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: 'var(--color-primary)',
  } as React.CSSProperties,
  breathingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2rem 0',
  } as React.CSSProperties,
  breathingCircle: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 1s ease-in-out',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  } as React.CSSProperties,
  breathingCount: {
    fontSize: '4rem',
    fontWeight: 700,
    color: 'white',
  } as React.CSSProperties,
  breathingInstruction: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    textAlign: 'center',
  } as React.CSSProperties,
  startButton: {
    padding: '1rem 2rem',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  stopButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--color-error)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  cycleCounter: {
    fontSize: '0.9375rem',
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
  instructions: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: 1.6,
  } as React.CSSProperties,
  groundingProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  progressDot: {
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    backgroundColor: 'var(--color-surface)',
    border: '2px solid var(--color-border)',
  } as React.CSSProperties,
  progressDotActive: {
    backgroundColor: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    transform: 'scale(1.2)',
  } as React.CSSProperties,
  progressDotComplete: {
    backgroundColor: 'var(--color-success)',
    borderColor: 'var(--color-success)',
  } as React.CSSProperties,
  groundingStep: {
    textAlign: 'center',
    marginBottom: '2rem',
  } as React.CSSProperties,
  groundingIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
  groundingPrompt: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  groundingTextarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--color-border)',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  } as React.CSSProperties,
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  } as React.CSSProperties,
  navButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  completeButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--color-success)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  thoughtChallengeForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  } as React.CSSProperties,
  formLabel: {
    fontSize: '0.9375rem',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  distortionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '0.5rem',
  } as React.CSSProperties,
  distortionButton: {
    padding: '0.5rem',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '0.5rem',
    fontSize: '0.8125rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  distortionButtonSelected: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    borderColor: 'var(--color-primary)',
  } as React.CSSProperties,
};
