'use client';

import React, { useState, useEffect } from 'react';
import { getAllData } from '../utils/localStorage';
import { Achievement } from '../types';
import { Language } from '../types';

interface AchievementsProps {
  language: Language;
}

export const Achievements: React.FC<AchievementsProps> = ({ language }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [mounted, setMounted] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const data = getAllData();
    setAchievements(data.achievements);

    // Check for newly unlocked achievements
    const justUnlocked = data.achievements.find(
      (a) =>
        a.unlocked &&
        a.unlockedDate &&
        new Date(a.unlockedDate).getTime() > Date.now() - 5000
    );

    if (justUnlocked) {
      setNewlyUnlocked(justUnlocked.id);
      setTimeout(() => setNewlyUnlocked(null), 5000);
    }
  }, []);

  if (!mounted) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🏆</span>
          {language === 'en-GB' ? 'Achievements' : 'Achievements'}
        </h3>
        <p style={styles.description}>
          Earn badges for reaching milestones in your mental health journey. Each achievement
          represents your dedication to self-care and recovery.
        </p>
      </div>

      <div style={styles.progress}>
        <div style={styles.progressHeader}>
          <span style={styles.progressText}>Overall Progress</span>
          <span style={styles.progressCount}>
            {unlockedCount}/{totalCount} unlocked
          </span>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${completionPercentage}%`,
            }}
          />
        </div>
      </div>

      <div style={styles.achievementGrid}>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            style={{
              ...styles.achievementCard,
              ...(achievement.unlocked
                ? styles.achievementCardUnlocked
                : styles.achievementCardLocked),
              ...(newlyUnlocked === achievement.id
                ? styles.achievementCardCelebrate
                : {}),
            }}
            className={newlyUnlocked === achievement.id ? 'animate-celebrate' : ''}
          >
            <div style={styles.achievementIcon}>{achievement.icon}</div>
            <div style={styles.achievementContent}>
              <h4 style={styles.achievementName}>{achievement.name}</h4>
              <p style={styles.achievementDescription}>{achievement.description}</p>
              {achievement.unlocked && achievement.unlockedDate && (
                <div style={styles.achievementDate}>
                  Unlocked:{' '}
                  {new Date(achievement.unlockedDate).toLocaleDateString('en', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              )}
              {!achievement.unlocked && (
                <div style={styles.achievementLocked}>🔒 Locked</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {newlyUnlocked && (
        <div style={styles.celebration} className="animate-slide-up">
          <div style={styles.celebrationContent}>
            <div style={styles.celebrationIcon}>🎉</div>
            <div style={styles.celebrationText}>
              <strong>Achievement Unlocked!</strong>
              <p>
                {achievements.find((a) => a.id === newlyUnlocked)?.name}
              </p>
            </div>
          </div>
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
  progress: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '0.75rem',
  } as React.CSSProperties,
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  } as React.CSSProperties,
  progressText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-text)',
  } as React.CSSProperties,
  progressCount: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-primary)',
  } as React.CSSProperties,
  progressBar: {
    height: '12px',
    backgroundColor: 'var(--color-surface-dark)',
    borderRadius: '9999px',
    overflow: 'hidden',
  } as React.CSSProperties,
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-success) 0%, var(--color-primary) 100%)',
    borderRadius: '9999px',
    transition: 'width 0.5s ease-out',
  } as React.CSSProperties,
  achievementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  } as React.CSSProperties,
  achievementCard: {
    display: 'flex',
    gap: '1rem',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    border: '2px solid var(--color-border)',
    transition: 'all 0.3s',
  } as React.CSSProperties,
  achievementCardUnlocked: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'var(--color-success)',
  } as React.CSSProperties,
  achievementCardLocked: {
    backgroundColor: 'var(--color-surface)',
    opacity: 0.7,
  } as React.CSSProperties,
  achievementCardCelebrate: {
    boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
  } as React.CSSProperties,
  achievementIcon: {
    fontSize: '3rem',
    flexShrink: 0,
  } as React.CSSProperties,
  achievementContent: {
    flex: 1,
  } as React.CSSProperties,
  achievementName: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
    color: 'var(--color-text)',
  } as React.CSSProperties,
  achievementDescription: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '0.5rem',
    lineHeight: 1.5,
  } as React.CSSProperties,
  achievementDate: {
    fontSize: '0.75rem',
    color: 'var(--color-success)',
    fontWeight: 600,
  } as React.CSSProperties,
  achievementLocked: {
    fontSize: '0.75rem',
    color: 'var(--color-text-light)',
    fontWeight: 600,
  } as React.CSSProperties,
  celebration: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    padding: '1.5rem',
    maxWidth: '400px',
  } as React.CSSProperties,
  celebrationContent: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  } as React.CSSProperties,
  celebrationIcon: {
    fontSize: '3rem',
  } as React.CSSProperties,
  celebrationText: {
    flex: 1,
  } as React.CSSProperties,
};
