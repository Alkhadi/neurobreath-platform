'use client';

import React, { useState, useEffect } from 'react';
import { getAllData } from '../utils/localStorage';
import { MoodEntry } from '../types';
import { Language } from '../types';

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

  const getMoodColor = (mood: number): string => {
    if (mood <= 3) return 'var(--color-mood-depressive)';
    if (mood <= 5) return 'var(--color-mood-normal)';
    if (mood <= 7) return 'var(--color-mood-hypomanic)';
    return 'var(--color-mood-manic)';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📈</span>
          {language === 'en-GB' ? 'Progress Tracker' : 'Progress Tracker'}
        </h3>
        <p style={styles.description}>
          Visualize your mood patterns and trends over time to identify triggers, cycles, and
          improvements in your mental health journey.
        </p>
      </div>

      <div style={styles.periodToggle}>
        <button
          onClick={() => setViewPeriod('week')}
          style={{
            ...styles.periodButton,
            ...(viewPeriod === 'week' ? styles.periodButtonActive : {}),
          }}
        >
          Week
        </button>
        <button
          onClick={() => setViewPeriod('month')}
          style={{
            ...styles.periodButton,
            ...(viewPeriod === 'month' ? styles.periodButtonActive : {}),
          }}
        >
          Month
        </button>
        <button
          onClick={() => setViewPeriod('year')}
          style={{
            ...styles.periodButton,
            ...(viewPeriod === 'year' ? styles.periodButtonActive : {}),
          }}
        >
          Year
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No data available for this period. Start logging your mood to see trends!</p>
        </div>
      ) : (
        <>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Average Mood</div>
              <div
                style={{
                  ...styles.statValue,
                  color: getMoodColor(stats.averageMood),
                }}
              >
                {stats.averageMood.toFixed(1)}/10
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Mood Range</div>
              <div style={styles.statValue}>
                {stats.moodRange.min} - {stats.moodRange.max}
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Avg. Sleep</div>
              <div style={styles.statValue}>{stats.averageSleep.toFixed(1)}h</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>Medication Adherence</div>
              <div
                style={{
                  ...styles.statValue,
                  color:
                    stats.medicationAdherence >= 80
                      ? 'var(--color-success)'
                      : stats.medicationAdherence >= 60
                      ? 'var(--color-warning)'
                      : 'var(--color-error)',
                }}
              >
                {stats.medicationAdherence.toFixed(0)}%
              </div>
            </div>
          </div>

          <div style={styles.chartSection}>
            <h4 style={styles.chartTitle}>Mood Trend</h4>
            <div style={styles.chart}>
              {filtered.slice(0, 30).reverse().map((entry, index) => {
                const maxHeight = 200;
                const barHeight = (entry.mood / 10) * maxHeight;

                return (
                  <div key={entry.id} style={styles.chartBar}>
                    <div
                      style={{
                        ...styles.chartBarFill,
                        height: `${barHeight}px`,
                        backgroundColor: getMoodColor(entry.mood),
                      }}
                      title={`${entry.date}: ${entry.mood}/10`}
                    />
                    <div style={styles.chartBarLabel}>
                      {new Date(entry.date).getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.moodStatesSection}>
            <h4 style={styles.chartTitle}>Mood States Distribution</h4>
            <div style={styles.moodStatesGrid}>
              {Object.entries(stats.moodStates).map(([state, count]) => {
                const percentage = (count / filtered.length) * 100;
                const stateColors: Record<string, string> = {
                  depressive: 'var(--color-mood-depressive)',
                  normal: 'var(--color-mood-normal)',
                  hypomanic: 'var(--color-mood-hypomanic)',
                  manic: 'var(--color-mood-manic)',
                  mixed: 'var(--color-mood-mixed)',
                };

                return (
                  <div key={state} style={styles.moodStateItem}>
                    <div style={styles.moodStateHeader}>
                      <span style={styles.moodStateName}>
                        {state.charAt(0).toUpperCase() + state.slice(1)}
                      </span>
                      <span style={styles.moodStateCount}>
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div style={styles.moodStateBar}>
                      <div
                        style={{
                          ...styles.moodStateBarFill,
                          width: `${percentage}%`,
                          backgroundColor: stateColors[state],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.insightsSection}>
            <h4 style={styles.chartTitle}>Insights & Patterns</h4>
            <div style={styles.insightsList}>
              {stats.averageMood < 4 && (
                <div style={{ ...styles.insight, ...styles.insightWarning }}>
                  ⚠️ Your average mood has been low. Consider reaching out to your healthcare
                  provider.
                </div>
              )}
              {stats.averageMood > 7 && (
                <div style={{ ...styles.insight, ...styles.insightWarning }}>
                  ⚠️ Your average mood has been elevated. Monitor for signs of hypomania or
                  mania.
                </div>
              )}
              {stats.averageSleep < 6 && (
                <div style={{ ...styles.insight, ...styles.insightInfo }}>
                  💤 You're averaging less than 6 hours of sleep. Sleep is crucial for mood
                  stability.
                </div>
              )}
              {stats.medicationAdherence < 80 && (
                <div style={{ ...styles.insight, ...styles.insightWarning }}>
                  💊 Your medication adherence is below 80%. Consistent medication is key to
                  managing bipolar disorder.
                </div>
              )}
              {stats.averageMood >= 4 &&
                stats.averageMood <= 6 &&
                stats.medicationAdherence >= 80 && (
                  <div style={{ ...styles.insight, ...styles.insightSuccess }}>
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
  periodToggle: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  periodButton: {
    padding: '0.5rem 1.25rem',
    border: '1px solid var(--color-border)',
    background: 'white',
    color: 'var(--color-text-secondary)',
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  periodButtonActive: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    borderColor: 'var(--color-primary)',
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  statCard: {
    backgroundColor: 'var(--color-surface)',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    textAlign: 'center',
  } as React.CSSProperties,
  statLabel: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '0.5rem',
    fontWeight: 500,
  } as React.CSSProperties,
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--color-text)',
  } as React.CSSProperties,
  chartSection: {
    marginBottom: '2rem',
  } as React.CSSProperties,
  chartTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  chart: {
    display: 'flex',
    gap: '0.25rem',
    height: '220px',
    alignItems: 'flex-end',
    padding: '1rem',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '0.75rem',
    overflowX: 'auto',
  } as React.CSSProperties,
  chartBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '30px',
  } as React.CSSProperties,
  chartBarFill: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s ease-out',
    minHeight: '2px',
  } as React.CSSProperties,
  chartBarLabel: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    marginTop: '0.25rem',
  } as React.CSSProperties,
  moodStatesSection: {
    marginBottom: '2rem',
  } as React.CSSProperties,
  moodStatesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as React.CSSProperties,
  moodStateItem: {
    backgroundColor: 'var(--color-surface)',
    padding: '1rem',
    borderRadius: '0.5rem',
  } as React.CSSProperties,
  moodStateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  moodStateName: {
    fontWeight: 600,
    color: 'var(--color-text)',
  } as React.CSSProperties,
  moodStateCount: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
  moodStateBar: {
    height: '8px',
    backgroundColor: 'var(--color-surface-dark)',
    borderRadius: '9999px',
    overflow: 'hidden',
  } as React.CSSProperties,
  moodStateBarFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.5s ease-out',
  } as React.CSSProperties,
  insightsSection: {
    marginTop: '2rem',
  } as React.CSSProperties,
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  } as React.CSSProperties,
  insight: {
    padding: '1rem',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    lineHeight: 1.6,
  } as React.CSSProperties,
  insightSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--color-success)',
    border: '1px solid var(--color-success)',
  } as React.CSSProperties,
  insightWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--color-warning)',
    border: '1px solid var(--color-warning)',
  } as React.CSSProperties,
  insightInfo: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: 'var(--color-info)',
    border: '1px solid var(--color-info)',
  } as React.CSSProperties,
};
