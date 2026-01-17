'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { HelpMeChooseInput } from '@/lib/recommendations/help-me-choose';

interface HelpMeChooseWizardProps {
  region: 'UK' | 'US';
}

interface WizardOption {
  id: string;
  label: string;
  description?: string;
}

interface WizardStep {
  id: keyof HelpMeChooseInput;
  title: string;
  description: string;
  type: 'single' | 'multi';
  options: WizardOption[];
}

const SUPPORT_NEEDS: WizardOption[] = [
  { id: 'focus', label: 'Focus / attention', description: 'Start tasks and stay with them.' },
  { id: 'stress', label: 'Stress / anxiety', description: 'Calm your body and mind.' },
  { id: 'sleep', label: 'Sleep routines', description: 'Wind down and sleep better.' },
  { id: 'sensory', label: 'Sensory overwhelm', description: 'Reduce overload and recover.' },
  { id: 'reading', label: 'Reading / learning confidence', description: 'Build confidence with reading tasks.' },
  { id: 'emotional-regulation', label: 'Emotional regulation', description: 'Stay steady during big feelings.' },
  { id: 'organisation', label: 'Organisation / executive function', description: 'Plan, prioritise, and follow through.' },
  { id: 'not-sure', label: 'Not sure', description: 'Give me a balanced plan.' },
];

const STEPS: WizardStep[] = [
  {
    id: 'audience',
    title: 'Who is this for?',
    description: 'Choose the audience so we can tailor language and examples.',
    type: 'single',
    options: [
      { id: 'me', label: 'For me' },
      { id: 'child', label: 'For my child' },
      { id: 'supporter', label: 'For someone I support' },
      { id: 'teacher', label: 'Teacher' },
      { id: 'workplace', label: 'Workplace' },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 'supportNeeds',
    title: 'What support do you need right now?',
    description: 'Pick any that feel relevant. You can choose more than one.',
    type: 'multi',
    options: SUPPORT_NEEDS,
  },
  {
    id: 'environment',
    title: 'Where does support matter most?',
    description: 'Select the environments where you want help.',
    type: 'multi',
    options: [
      { id: 'home', label: 'Home' },
      { id: 'school', label: 'School' },
      { id: 'work', label: 'Work' },
      { id: 'social', label: 'Social situations' },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 'timePreference',
    title: 'How much time do you have?',
    description: 'We will adjust the plan based on your time today.',
    type: 'single',
    options: [
      { id: 'quick', label: 'I need something quick (1–2 minutes)' },
      { id: 'short', label: 'I can do a short routine (5–10 minutes)' },
      { id: 'plan', label: 'I want a plan (over days/weeks)' },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 'formatPreference',
    title: 'What kind of support feels easiest?',
    description: 'Choose the format you are most likely to use today.',
    type: 'single',
    options: [
      { id: 'tools', label: 'Quick tools I can try now' },
      { id: 'guides', label: 'Guided steps and short routines' },
      { id: 'printables', label: 'Printable or written resources' },
      { id: 'mix', label: 'A mix of tools and guides' },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 'profile',
    title: 'Optional: do you identify with a profile?',
    description:
      'If you already have a diagnosis or identify with a profile, you can select it (optional). This is not a diagnosis tool.',
    type: 'single',
    options: [
      { id: 'adhd', label: 'ADHD' },
      { id: 'autism', label: 'Autism' },
      { id: 'dyslexia', label: 'Dyslexia' },
      { id: 'dyspraxia', label: 'Dyspraxia / DCD' },
      { id: 'dyscalculia', label: 'Dyscalculia' },
      { id: 'tics', label: 'Tics / Tourette' },
      { id: 'sensory-differences', label: 'Sensory differences' },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },
];

const storageKey = (region: 'UK' | 'US') => `helpMeChooseAnswers:${region}`;

export function HelpMeChooseWizard({ region }: HelpMeChooseWizardProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<HelpMeChooseInput>({
    supportNeeds: [],
    environment: [],
  });
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const step = STEPS[stepIndex];

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey(region));
    if (raw) {
      setAnswers(JSON.parse(raw));
    }
  }, [region]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(region), JSON.stringify(answers));
  }, [answers, region]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  const isLast = stepIndex === STEPS.length - 1;

  const updateAnswer = (value: string) => {
    setAnswers(prev => {
      if (step.type === 'single') {
        const next = { ...prev, [step.id]: value === 'not-sure' ? undefined : value };
        return next;
      }

      const current = (prev[step.id] as string[]) || [];
      const isSelected = current.includes(value);
      let nextList = isSelected ? current.filter(item => item !== value) : [...current, value];
      if (value === 'not-sure') {
        nextList = [];
      } else {
        nextList = nextList.filter(item => item !== 'not-sure');
      }
      return { ...prev, [step.id]: nextList };
    });
  };

  const canContinue = useMemo(() => {
    const value = answers[step.id];
    if (!value) return true; // skippable
    if (Array.isArray(value)) return true;
    return Boolean(value);
  }, [answers, step.id]);

  const goNext = () => {
    if (!canContinue) return;
    if (isLast) {
      router.push(`/${region === 'US' ? 'us' : 'uk'}/help-me-choose/results`);
      return;
    }
    setStepIndex(prev => prev + 1);
  };

  const goBack = () => setStepIndex(prev => Math.max(0, prev - 1));

  const restart = () => {
    setAnswers({ supportNeeds: [], environment: [] });
    setStepIndex(0);
    window.localStorage.removeItem(storageKey(region));
  };

  const selectedValues = answers[step.id] as string | string[] | undefined;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          Step {stepIndex + 1} of {STEPS.length}
        </span>
        <button
          type="button"
          onClick={restart}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300"
        >
          Restart
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-semibold text-slate-900 focus:outline-none"
        >
          {step.title}
        </h2>
        <p className="text-sm text-slate-600">{step.description}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {step.options.map(option => {
          const isActive = Array.isArray(selectedValues)
            ? selectedValues.includes(option.id)
            : selectedValues === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => updateAnswer(option.id)}
              className={`rounded-2xl border px-4 py-3 text-left transition motion-reduce:transition-none ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-semibold">{option.label}</div>
              {option.description && <p className="mt-1 text-xs text-slate-500">{option.description}</p>}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {isLast ? 'See my plan' : 'Continue'}
        </button>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        This wizard offers educational guidance only. It does not provide medical advice or diagnosis.
      </p>
    </div>
  );
}
