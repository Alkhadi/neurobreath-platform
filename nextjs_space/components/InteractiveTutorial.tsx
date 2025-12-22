'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Volume2, 
  VolumeX,
  SkipForward,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'hero',
    title: 'Welcome to NeuroBreath!',
    description: 'This is your reading training hub! Here you\'ll find fun games and exercises to improve your reading skills. Let me show you around!',
    targetSelector: '[data-tutorial="hero"]',
    position: 'bottom',
  },
  {
    id: 'streak',
    title: 'Your Streak Toolkit',
    description: 'This shows your practice streaks! Practice every day to build a streak. A 7-day streak earns you special rewards, and a 30-day streak unlocks amazing bonuses!',
    targetSelector: '[data-tutorial="streak"]',
    position: 'bottom',
  },
  {
    id: 'timer',
    title: 'Practice Timer',
    description: 'Use this timer to track how long you practice. Try to practice for at least 10 minutes each day to keep your streak going!',
    targetSelector: '[data-tutorial="timer"]',
    position: 'bottom',
  },
  {
    id: 'breathing',
    title: 'Breathing Exercise',
    description: 'Start here! Take a few deep breaths to calm down before learning. It helps your brain get ready for reading practice.',
    targetSelector: '[data-tutorial="breathing"]',
    position: 'bottom',
  },
  {
    id: 'phonics',
    title: 'Phonics Player',
    description: 'Listen to fun phonics songs that teach you letter sounds. Music makes learning easier and more fun!',
    targetSelector: '[data-tutorial="phonics"]',
    position: 'bottom',
  },
  {
    id: 'phon ics-lab',
    title: 'Phonics Sounds Lab',
    description: 'Practice individual letter sounds with visual animations! Watch the letters slide in and hear their sounds.',
    targetSelector: '[data-tutorial="phonics-lab"]',
    position: 'bottom',
  },
  {
    id: 'wordbuilder',
    title: 'Word Builder',
    description: 'Build words by putting letters together! Start with simple words and work your way up to harder ones.',
    targetSelector: '[data-tutorial="wordbuilder"]',
    position: 'bottom',
  },
  {
    id: 'fluency',
    title: 'Fluency Pacer',
    description: 'Practice reading at different speeds. Words light up as you read along, helping you keep a steady pace.',
    targetSelector: '[data-tutorial="fluency"]',
    position: 'bottom',
  },
  {
    id: 'syllables',
    title: 'Syllable Splitter',
    description: 'Learn to break big words into smaller parts called syllables. It makes reading long words much easier!',
    targetSelector: '[data-tutorial="syllables"]',
    position: 'bottom',
  },
  {
    id: 'vowels',
    title: 'Vowel Universe',
    description: 'Explore 5 zones to master all vowel sounds! Start at Short Street with simple vowels, then journey through to advanced patterns.',
    targetSelector: '[data-tutorial="vowels"]',
    position: 'bottom',
  },
  {
    id: 'rewards',
    title: 'Reward Cards',
    description: 'As you practice, you earn points that unlock reward cards! Keep practicing to collect them all.',
    targetSelector: '[data-tutorial="rewards"]',
    position: 'bottom',
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    description: 'Great job completing the tour! Start with a breathing exercise, then try any game you like. Remember, practice every day to build your streak and earn rewards!',
    targetSelector: '[data-tutorial="hero"]',
    position: 'bottom',
  },
];

interface InteractiveTutorialProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InteractiveTutorial({ open, onOpenChange }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  
  const { speak, cancel, speaking, supported } = useSpeechSynthesis();
  
  const step = TUTORIAL_STEPS[currentStep];
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  const scrollToAndHighlight = useCallback((selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Wait for scroll to complete before measuring
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        setHighlightRect(rect);
      }, 500);
    } else {
      setHighlightRect(null);
    }
  }, []);

  useEffect(() => {
    if (open && step) {
      scrollToAndHighlight(step.targetSelector);
      
      if (autoSpeak && supported) {
        cancel();
        setTimeout(() => {
          speak(`${step.title}. ${step.description}`);
        }, 600);
      }
    }
  }, [open, currentStep, step, scrollToAndHighlight, autoSpeak, supported, speak, cancel]);

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setHighlightRect(null);
      cancel();
    }
  }, [open, cancel]);

  // Update highlight on resize/scroll
  useEffect(() => {
    if (!open) return;

    const updateHighlight = () => {
      if (step) {
        const element = document.querySelector(step.targetSelector);
        if (element) {
          setHighlightRect(element.getBoundingClientRect());
        }
      }
    };

    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight, true);
    
    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight, true);
    };
  }, [open, step]);

  const handleNext = () => {
    cancel();
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onOpenChange(false);
    }
  };

  const handlePrev = () => {
    cancel();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    cancel();
    onOpenChange(false);
  };

  const handleSkip = () => {
    cancel();
    onOpenChange(false);
  };

  const toggleSpeak = () => {
    if (speaking) {
      cancel();
    } else if (step) {
      speak(`${step.title}. ${step.description}`);
    }
    setAutoSpeak(!autoSpeak);
  };

  if (!open || !step) return null;

  const getTooltipPosition = () => {
    if (!highlightRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const padding = 20;
    const tooltipWidth = 350;

    // Always position below the highlighted element
    return {
      top: `${highlightRect.bottom + padding}px`,
      left: `${Math.max(padding, Math.min(highlightRect.left + highlightRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding))}px`,
    };
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Dark overlay with cutout */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="tutorial-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {highlightRect && (
                <rect
                  x={highlightRect.left - 8}
                  y={highlightRect.top - 8}
                  width={highlightRect.width + 16}
                  height={highlightRect.height + 16}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.75)"
            mask="url(#tutorial-mask)"
          />
        </svg>

        {/* Highlight border */}
        {highlightRect && (
          <div
            className="absolute border-2 border-primary rounded-xl shadow-[0_0_0_4px_rgba(var(--primary),0.3)] animate-pulse pointer-events-none"
            style={{
              left: highlightRect.left - 8,
              top: highlightRect.top - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
            }}
          />
        )}
      </div>

      {/* Tooltip Card */}
      <Card
        className="fixed z-[101] w-[350px] max-w-[calc(100vw-32px)] p-4 shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm"
        style={getTooltipPosition()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {TUTORIAL_STEPS.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {supported && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSpeak}
                className={cn("h-7 w-7", speaking && "text-primary")}
              >
                {speaking ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-7 w-7">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-1 mb-3" />

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {step.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-xs text-muted-foreground"
          >
            <SkipForward className="h-3 w-3 mr-1" />
            Skip Tour
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              className="h-8"
            >
              {currentStep === TUTORIAL_STEPS.length - 1 ? (
                'Finish'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
