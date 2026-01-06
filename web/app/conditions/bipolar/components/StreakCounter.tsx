'use client';

import React, { useState, useEffect } from 'react';
import { getAllData } from '../utils/localStorage';
import { Streak } from '../types';
import { Language } from '../types';

interface StreakCounterProps {
  language: Language;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ language }) => {
  const [streak, setStreak] = useState<Streak>({
    current: 0,
    longest: 0,
    lastEntryDate: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = getAllData();
    setStreak(data.streak);
  }, []);

  if (!mounted) return null;

  const getMilestoneProgress = () => {
    const milestones = [3, 7, 14, 30, 60, 90];
    const nextMilestone = milestones.find((m) => m > streak.current) || 100;
    const prevMilestone = [...milestones].reverse().find((m) => m <= streak.current) || 0;
    const progress =
      ((streak.current - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
    return { nextMilestone, progress };
  };

  const { nextMilestone, progress } = getMilestoneProgress();

  const getStreakIcon = () => {
    if (streak.current >= 90) return '🌈';
    if (streak.current >= 60) return '👑';
    if (streak.current >= 30) return '🏆';
    if (streak.current >= 14) return '💪';
    if (streak.current >= 7) return '⭐';
    if (streak.current >= 3) return '🔥';
    return '🌟';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{getStreakIcon()}</span>
          {language === 'en-GB' ? 'Tracking Streak' : 'Tracking Streak'}
        </h3>
        <p style={styles.description}>
          Building consistent habits is key to managing bipolar disorder. Keep logging daily to
          maintain your streak!
        </p>
      </div>

      <div style={styles.streakDisplay}>
        <div style={styles.streakItem}>
          <div style={styles.streakNumber}>{streak.current}</div>
          <div style={styles.streakLabel}>Current Streak</div>
          <div style={styles.streakSubtext}>consecutive days</div>
        </div>

        <div style={styles.divider} />

        <div style={styles.streakItem}>
          <div style={styles.streakNumber}>{streak.longest}</div>
          <div style={styles.streakLabel}>Longest Streak</div>
          <div style={styles.streakSubtext}>personal record</div>
        </div>
      </div>

      {streak.current > 0 && (
        <div style={styles.milestone}>
          <div style={styles.milestoneHeader}>
            <span style={styles.milestoneText}>Next milestone: {nextMilestone} days</span>
            <span style={styles.milestoneProgress}>
              {streak.current}/{nextMilestone}
            </span>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      <div style={styles.milestones}>
        <h4 style={styles.milestonesTitle}>Milestone Rewards</h4>
        <div style={styles.milestonesList}>
          {[
            { days: 3, icon: '🔥', name: '3-Day Streak' },
            { days: 7, icon: '⭐', name: 'One Week' },
            { days: 14, icon: '💪', name: 'Two Weeks' },
            { days: 30, icon: '🏆', name: 'One Month' },
            { days: 60, icon: '👑', name: '60 Days' },
            { days: 90, icon: '🌈', name: '90 Days' },
          ].map((milestone) => (
            <div
              key={milestone.days}
              style={{
                ...styles.milestoneItem,
                ...(streak.current >= milestone.days
                  ? styles.milestoneItemUnlocked
                  : styles.milestoneItemLocked),
              }}
            >
              <span style={styles.milestoneIcon}>{milestone.icon}</span>
              <span style={styles.milestoneName}>{milestone.name}</span>
              <span style={styles.milestoneDays}>{milestone.days}d</span>
            </div>
          ))}
        </div>
      </div>

      {streak.lastEntryDate && (
        <div style={styles.lastEntry}>
          Last entry:{' '}
          {new Date(streak.lastEntryDate).toLocaleDateString('en', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </div>
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
  streakDisplay: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
    borderRadius: '1rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  streakItem: {
    textAlign: 'center',
    color: 'white',
  } as React.CSSProperties,
  streakNumber: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  streakLabel: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  streakSubtext: {
    fontSize: '0.875rem',
    opacity: 0.9,
  } as React.CSSProperties,
  divider: {
    width: '2px',
    height: '80px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  } as React.CSSProperties,
  milestone: {
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  milestoneHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  milestoneText: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--color-text)',
  } as React.CSSProperties,
  milestoneProgress: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--color-primary)',
  } as React.CSSProperties,
  progressBar: {
    height: '12px',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '9999px',
    overflow: 'hidden',
  } as React.CSSProperties,
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
    borderRadius: '9999px',
    transition: 'width 0.5s ease-out',
  } as React.CSSProperties,
  milestones: {
    marginTop: '1.5rem',
  } as React.CSSProperties,
  milestonesTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  milestonesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem',
  } as React.CSSProperties,
  milestoneItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '2px solid var(--color-border)',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  milestoneItemUnlocked: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderColor: 'var(--color-primary)',
  } as React.CSSProperties,
  milestoneItemLocked: {
    backgroundColor: 'var(--color-surface)',
    opacity: 0.6,
  } as React.CSSProperties,
  milestoneIcon: {
    fontSize: '2rem',
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  milestoneName: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textAlign: 'center',
  } as React.CSSProperties,
  milestoneDays: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
  lastEntry: {
    marginTop: '1rem',
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
  } as React.CSSProperties,
};
