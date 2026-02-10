'use client';

import React, { useState, useEffect } from 'react';
import { getAllData } from '../utils/localStorage';
import { MoodEntry } from '../types';
import { Language } from '../types';
import { cn } from '@/lib/utils';

interface ProgressTrackerProps {
  language: Language;
}

type ViewPeriod = 'week' | 'month' | 'year';

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ language }) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('month');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = getAllData();
    setEntries(data.moodEntries);
  }, []);

  if (!mounted) return null;

  const getFilteredEntries = (): MoodEntry[] => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (viewPeriod) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return entries.filter((entry) => new Date(entry.date) >= cutoffDate);
  };

  const calculateStats = () => {
    const filtered = getFilteredEntries();

    if (filtered.length === 0) {
      return {
        averageMood: 0,
        moodRange: { min: 0, max: 0 },
        averageSleep: 0,
        medicationAdherence: 0,
        moodStates: {} as Record<string, number>,
      };
    }

    const totalMood = filtered.reduce((sum, entry) => sum + entry.mood, 0);
    const averageMood = totalMood / filtered.length;

    const moods = filtered.map((e) => e.mood);
    const moodRange = {
      min: Math.min(...moods),
      max: Math.max(...moods),
    };

    const totalSleep = filtered.reduce(
      (sum, entry) => sum + (entry.sleepHours || 0),
      0
    );
    const averageSleep = totalSleep / filtered.length;

    const medicationCount = filtered.filter((e) => e.medications).length;
    const medicationAdherence = (medicationCount / filtered.length) * 100;

    const moodStates = filtered.reduce((acc, entry) => {
      acc[entry.moodState] = (acc[entry.moodState] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      averageMood,
      moodRange,
      averageSleep,
      medicationAdherence,
      moodStates,
    };
  };

  const stats = calculateStats();
  const filtered = getFilteredEntries();

  const getMoodTextClass = (mood: number): string => {
    if (mood <= 3) return 'text-[var(--color-mood-depressive)]';
    if (mood <= 5) return 'text-[var(--color-mood-normal)]';
    if (mood <= 7) return 'text-[var(--color-mood-hypomanic)]';
    return 'text-[var(--color-mood-manic)]';
  };

  const getMoodBgClass = (mood: number): string => {
    if (mood <= 3) return 'bg-[var(--color-mood-depressive)]';
    if (mood <= 5) return 'bg-[var(--color-mood-normal)]';
    if (mood <= 7) return 'bg-[var(--color-mood-hypomanic)]';
    return 'bg-[var(--color-mood-manic)]';
  };

  const BAR_HEIGHT_CLASSES = [
    'h-[2px]',
    'h-[20px]',
    'h-[40px]',
    'h-[60px]',
    'h-[80px]',
    'h-[100px]',
    'h-[120px]',
    'h-[140px]',
    'h-[160px]',
    'h-[180px]',
    'h-[200px]',
  ] as const;

  const getBarHeightClass = (mood: number): string => {
    const level = Math.max(0, Math.min(10, Math.round(mood)));
    return BAR_HEIGHT_CLASSES[level] ?? 'h-[2px]';
  };

  const getMedicationAdherenceClass = (pct: number): string => {
    if (pct >= 80) return 'text-[var(--color-success)]';
    if (pct >= 60) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-error)]';
  };

  const getMoodStateAccentClass = (state: string): string => {
    const accents: Record<string, string> = {
      depressive: 'accent-[var(--color-mood-depressive)]',
      normal: 'accent-[var(--color-mood-normal)]',
      hypomanic: 'accent-[var(--color-mood-hypomanic)]',
      manic: 'accent-[var(--color-mood-manic)]',
      mixed: 'accent-[var(--color-mood-mixed)]',
    };
    return accents[state] ?? 'accent-[var(--color-primary)]';
  };

  return (
    <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="mb-2 text-[1.75rem] font-bold text-[var(--color-primary)]">
          <span className="mr-2 text-2xl" aria-hidden="true">
            📈
          </span>
          {language === 'en-GB' ? 'Progress Tracker' : 'Progress Tracker'}
        </h3>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-secondary)]">
          Visualize your mood patterns and trends over time to identify triggers, cycles, and
          improvements in your mental health journey.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setViewPeriod('week')}
          type="button"
          className={cn(
            'rounded-lg border px-5 py-2 text-sm font-semibold transition-colors',
            viewPeriod === 'week'
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
              : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]'
          )}
        >
          Week
        </button>
        <button
          onClick={() => setViewPeriod('month')}
          type="button"
          className={cn(
            'rounded-lg border px-5 py-2 text-sm font-semibold transition-colors',
            viewPeriod === 'month'
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
              : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]'
          )}
        >
          Month
        </button>
        <button
          onClick={() => setViewPeriod('year')}
          type="button"
          className={cn(
            'rounded-lg border px-5 py-2 text-sm font-semibold transition-colors',
            viewPeriod === 'year'
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
              : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]'
          )}
        >
          Year
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-[var(--color-text-secondary)]">
          <p>No data available for this period. Start logging your mood to see trends!</p>
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
            <div className="rounded-xl bg-[var(--color-surface)] p-5 text-center">
              <div className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Average Mood
              </div>
              <div className={cn('text-3xl font-bold', getMoodTextClass(stats.averageMood))}>
                {stats.averageMood.toFixed(1)}/10
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-surface)] p-5 text-center">
              <div className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Mood Range
              </div>
              <div className="text-3xl font-bold text-[var(--color-text)]">
                {stats.moodRange.min} - {stats.moodRange.max}
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-surface)] p-5 text-center">
              <div className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Avg. Sleep
              </div>
              <div className="text-3xl font-bold text-[var(--color-text)]">
                {stats.averageSleep.toFixed(1)}h
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-surface)] p-5 text-center">
              <div className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Medication Adherence
              </div>
              <div
                className={cn(
                  'text-3xl font-bold',
                  getMedicationAdherenceClass(stats.medicationAdherence)
                )}
              >
                {stats.medicationAdherence.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="mb-4 text-xl font-semibold text-[var(--color-text)]">Mood Trend</h4>
            <div className="flex h-[220px] items-end gap-1 overflow-x-auto rounded-xl bg-[var(--color-surface)] p-4">
              {filtered.slice(0, 30).reverse().map((entry, _index) => {
                return (
                  <div key={entry.id} className="flex min-w-[30px] flex-col items-center">
                    <div
                      className={cn(
                        'w-full min-h-[2px] rounded-t transition-all duration-300',
                        getBarHeightClass(entry.mood),
                        getMoodBgClass(entry.mood)
                      )}
                      title={`${entry.date}: ${entry.mood}/10`}
                    />
                    <div className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      {new Date(entry.date).getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="mb-4 text-xl font-semibold text-[var(--color-text)]">
              Mood States Distribution
            </h4>
            <div className="flex flex-col gap-4">
              {Object.entries(stats.moodStates).map(([state, count]) => {
                const percentage = (count / filtered.length) * 100;

                return (
                  <div key={state} className="rounded-lg bg-[var(--color-surface)] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-[var(--color-text)]">
                        {state.charAt(0).toUpperCase() + state.slice(1)}
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <progress
                      value={percentage}
                      max={100}
                      className={cn(
                        'h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-dark)]',
                        getMoodStateAccentClass(state)
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <h4 className="mb-4 text-xl font-semibold text-[var(--color-text)]">
              Insights & Patterns
            </h4>
            <div className="flex flex-col gap-3">
              {stats.averageMood < 4 && (
                <div className="rounded-lg border border-[var(--color-warning)] bg-[rgba(245,158,11,0.1)] p-4 text-[0.9375rem] leading-relaxed text-[var(--color-warning)]">
                  ⚠️ Your average mood has been low. Consider reaching out to your healthcare
                  provider.
                </div>
              )}
              {stats.averageMood > 7 && (
                <div className="rounded-lg border border-[var(--color-warning)] bg-[rgba(245,158,11,0.1)] p-4 text-[0.9375rem] leading-relaxed text-[var(--color-warning)]">
                  ⚠️ Your average mood has been elevated. Monitor for signs of hypomania or
                  mania.
                </div>
              )}
              {stats.averageSleep < 6 && (
                <div className="rounded-lg border border-[var(--color-info)] bg-[rgba(59,130,246,0.1)] p-4 text-[0.9375rem] leading-relaxed text-[var(--color-info)]">
                  💤 You're averaging less than 6 hours of sleep. Sleep is crucial for mood
                  stability.
                </div>
              )}
              {stats.medicationAdherence < 80 && (
                <div className="rounded-lg border border-[var(--color-warning)] bg-[rgba(245,158,11,0.1)] p-4 text-[0.9375rem] leading-relaxed text-[var(--color-warning)]">
                  💊 Your medication adherence is below 80%. Consistent medication is key to
                  managing bipolar disorder.
                </div>
              )}
              {stats.averageMood >= 4 &&
                stats.averageMood <= 6 &&
                stats.medicationAdherence >= 80 && (
                  <div className="rounded-lg border border-[var(--color-success)] bg-[rgba(16,185,129,0.1)] p-4 text-[0.9375rem] leading-relaxed text-[var(--color-success)]">
                    ✅ Great job! Your mood is stable and you're adhering to your treatment plan.
                  </div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
