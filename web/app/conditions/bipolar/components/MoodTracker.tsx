'use client';

import React, { useState, useEffect } from 'react';
import { MoodEntry } from '../types';
import {
  getAllData,
  saveMoodEntry,
  exportMoodDataAsCSV,
  exportMoodDataAsJSON,
} from '../utils/localStorage';
import { Language } from '../types';

interface MoodTrackerProps {
  language: Language;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ language }) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<MoodEntry>>({
    date: new Date().toISOString().split('T')[0],
    mood: 5,
    moodState: 'normal',
    notes: '',
    sleepHours: 7,
    triggers: [],
    medications: true,
  });
  const [view, setView] = useState<'form' | 'calendar' | 'list'>('form');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const data = getAllData();
    setEntries(data.moodEntries);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: MoodEntry = {
      id: `${currentEntry.date}-${Date.now()}`,
      date: currentEntry.date!,
      mood: currentEntry.mood!,
      moodState: currentEntry.moodState!,
      notes: currentEntry.notes,
      sleepHours: currentEntry.sleepHours,
      triggers: currentEntry.triggers,
      medications: currentEntry.medications,
    };

    saveMoodEntry(entry);

    const data = getAllData();
    setEntries(data.moodEntries);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form for next day
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      mood: 5,
      moodState: 'normal',
      notes: '',
      sleepHours: 7,
      triggers: [],
      medications: true,
    });
  };

  const getMoodColor = (mood: number): string => {
    if (mood <= 3) return 'var(--color-mood-depressive)';
    if (mood <= 5) return 'var(--color-mood-normal)';
    if (mood <= 7) return 'var(--color-mood-hypomanic)';
    return 'var(--color-mood-manic)';
  };

  const getMoodStateColor = (state: string): string => {
    const colors: Record<string, string> = {
      depressive: 'var(--color-mood-depressive)',
      normal: 'var(--color-mood-normal)',
      hypomanic: 'var(--color-mood-hypomanic)',
      manic: 'var(--color-mood-manic)',
      mixed: 'var(--color-mood-mixed)',
    };
    return colors[state] || 'var(--color-mood-normal)';
  };

  const handleExportCSV = () => {
    const csv = exportMoodDataAsCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = exportMoodDataAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getMoodStateName = (state: string): string => {
    const names: Record<string, string> = {
      depressive: 'Depressive',
      normal: 'Normal',
      hypomanic: 'Hypomanic',
      manic: 'Manic',
      mixed: 'Mixed',
    };
    return names[state] || state;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📊</span>
          {language === 'en-GB' ? 'Mood Tracker' : 'Mood Tracker'}
        </h3>
        <div style={styles.description}>
          <p>
            Track your daily mood to identify patterns, triggers, and early warning signs.
            Evidence-based research shows that consistent mood tracking improves self-awareness
            and treatment outcomes.
          </p>
        </div>
      </div>

      <div style={styles.viewToggle}>
        <button
          onClick={() => setView('form')}
          style={{
            ...styles.viewButton,
            ...(view === 'form' ? styles.viewButtonActive : {}),
          }}
          aria-pressed={view === 'form'}
        >
          Log Mood
        </button>
        <button
          onClick={() => setView('calendar')}
          style={{
            ...styles.viewButton,
            ...(view === 'calendar' ? styles.viewButtonActive : {}),
          }}
          aria-pressed={view === 'calendar'}
        >
          Calendar
        </button>
        <button
          onClick={() => setView('list')}
          style={{
            ...styles.viewButton,
            ...(view === 'list' ? styles.viewButtonActive : {}),
          }}
          aria-pressed={view === 'list'}
        >
          History
        </button>
      </div>

      {view === 'form' && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="mood-date" style={styles.label}>
              Date
            </label>
            <input
              id="mood-date"
              type="date"
              value={currentEntry.date}
              onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="mood-scale" style={styles.label}>
              Mood (1-10): {currentEntry.mood}
            </label>
            <input
              id="mood-scale"
              type="range"
              min="1"
              max="10"
              value={currentEntry.mood}
              onChange={(e) =>
                setCurrentEntry({ ...currentEntry, mood: parseInt(e.target.value) })
              }
              style={{
                ...styles.slider,
                background: `linear-gradient(to right, ${getMoodColor(
                  currentEntry.mood || 5
                )} 0%, ${getMoodColor(currentEntry.mood || 5)} ${
                  ((currentEntry.mood || 5) - 1) * 11.11
                }%, #e2e8f0 ${((currentEntry.mood || 5) - 1) * 11.11}%, #e2e8f0 100%)`,
              }}
            />
            <div style={styles.moodLabels}>
              <span>1 (Very Low)</span>
              <span>10 (Very High)</span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="mood-state" style={styles.label}>
              Mood State
            </label>
            <select
              id="mood-state"
              value={currentEntry.moodState}
              onChange={(e) =>
                setCurrentEntry({
                  ...currentEntry,
                  moodState: e.target.value as MoodEntry['moodState'],
                })
              }
              required
              style={styles.select}
            >
              <option value="depressive">Depressive</option>
              <option value="normal">Normal</option>
              <option value="hypomanic">Hypomanic</option>
              <option value="manic">Manic</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="sleep-hours" style={styles.label}>
              Sleep Hours: {currentEntry.sleepHours}
            </label>
            <input
              id="sleep-hours"
              type="range"
              min="0"
              max="16"
              step="0.5"
              value={currentEntry.sleepHours}
              onChange={(e) =>
                setCurrentEntry({
                  ...currentEntry,
                  sleepHours: parseFloat(e.target.value),
                })
              }
              style={styles.slider}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="medications" style={styles.checkboxLabel}>
              <input
                id="medications"
                type="checkbox"
                checked={currentEntry.medications}
                onChange={(e) =>
                  setCurrentEntry({
                    ...currentEntry,
                    medications: e.target.checked,
                  })
                }
                style={styles.checkbox}
              />
              Took medications as prescribed
            </label>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="notes" style={styles.label}>
              Notes (triggers, events, symptoms)
            </label>
            <textarea
              id="notes"
              value={currentEntry.notes}
              onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
              placeholder="Describe your day, any triggers, or notable events..."
              rows={4}
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Save Entry
          </button>

          {showSuccess && (
            <div style={styles.successMessage} className="animate-slide-up">
              ✓ Mood entry saved successfully!
            </div>
          )}
        </form>
      )}

      {view === 'calendar' && (
        <div style={styles.calendar}>
          <div style={styles.calendarGrid}>
            {entries.slice(0, 90).map((entry) => {
              const date = new Date(entry.date);
              const dayName = date.toLocaleDateString('en', { weekday: 'short' });
              const dayNum = date.getDate();
              const monthName = date.toLocaleDateString('en', { month: 'short' });

              return (
                <div
                  key={entry.id}
                  style={{
                    ...styles.calendarDay,
                    borderLeft: `4px solid ${getMoodStateColor(entry.moodState)}`,
                  }}
                  title={`${entry.date}: Mood ${entry.mood}/10 - ${getMoodStateName(
                    entry.moodState
                  )}`}
                >
                  <div style={styles.calendarDayDate}>
                    {monthName} {dayNum}
                  </div>
                  <div style={styles.calendarDayName}>{dayName}</div>
                  <div
                    style={{
                      ...styles.calendarDayMood,
                      backgroundColor: getMoodColor(entry.mood),
                    }}
                  >
                    {entry.mood}
                  </div>
                  <div style={styles.calendarDayState}>
                    {getMoodStateName(entry.moodState)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div style={styles.history}>
          <div style={styles.exportButtons}>
            <button onClick={handleExportCSV} style={styles.exportButton}>
              📥 Export CSV
            </button>
            <button onClick={handleExportJSON} style={styles.exportButton}>
              📥 Export JSON
            </button>
          </div>

          {entries.length === 0 && (
            <p style={styles.emptyState}>No mood entries yet. Start logging your mood above!</p>
          )}

          <div style={styles.historyList}>
            {entries.map((entry) => (
              <div key={entry.id} style={styles.historyItem}>
                <div style={styles.historyItemHeader}>
                  <div style={styles.historyItemDate}>
                    {new Date(entry.date).toLocaleDateString('en', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div
                    style={{
                      ...styles.historyItemMood,
                      backgroundColor: getMoodColor(entry.mood),
                    }}
                  >
                    {entry.mood}/10
                  </div>
                </div>
                <div style={styles.historyItemDetails}>
                  <div
                    style={{
                      ...styles.historyItemState,
                      color: getMoodStateColor(entry.moodState),
                    }}
                  >
                    <strong>State:</strong> {getMoodStateName(entry.moodState)}
                  </div>
                  <div style={styles.historyItemSleep}>
                    <strong>Sleep:</strong> {entry.sleepHours}h
                  </div>
                  <div style={styles.historyItemMeds}>
                    <strong>Medications:</strong> {entry.medications ? 'Yes' : 'No'}
                  </div>
                </div>
                {entry.notes && (
                  <div style={styles.historyItemNotes}>
                    <strong>Notes:</strong> {entry.notes}
                  </div>
                )}
              </div>
            ))}
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
  viewToggle: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    borderBottom: '2px solid var(--color-border)',
    paddingBottom: '1rem',
  } as React.CSSProperties,
  viewButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  viewButtonActive: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  } as React.CSSProperties,
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  } as React.CSSProperties,
  label: {
    fontWeight: 600,
    color: 'var(--color-text)',
    fontSize: '0.9375rem',
  } as React.CSSProperties,
  input: {
    padding: '0.75rem',
    border: '1px solid var(--color-border)',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
  } as React.CSSProperties,
  select: {
    padding: '0.75rem',
    border: '1px solid var(--color-border)',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    backgroundColor: 'white',
    cursor: 'pointer',
  } as React.CSSProperties,
  textarea: {
    padding: '0.75rem',
    border: '1px solid var(--color-border)',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  } as React.CSSProperties,
  slider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  } as React.CSSProperties,
  moodLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.9375rem',
  } as React.CSSProperties,
  checkbox: {
    width: '1.25rem',
    height: '1.25rem',
    cursor: 'pointer',
  } as React.CSSProperties,
  submitButton: {
    padding: '1rem',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  successMessage: {
    padding: '1rem',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--color-success)',
    borderRadius: '0.5rem',
    textAlign: 'center',
    fontWeight: 600,
  } as React.CSSProperties,
  calendar: {
    width: '100%',
  } as React.CSSProperties,
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '1rem',
  } as React.CSSProperties,
  calendarDay: {
    backgroundColor: 'var(--color-surface)',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  } as React.CSSProperties,
  calendarDayDate: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text)',
  } as React.CSSProperties,
  calendarDayName: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
  calendarDayMood: {
    padding: '0.25rem',
    borderRadius: '0.25rem',
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: 700,
    textAlign: 'center',
    marginTop: '0.25rem',
  } as React.CSSProperties,
  calendarDayState: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
  } as React.CSSProperties,
  history: {
    width: '100%',
  } as React.CSSProperties,
  exportButtons: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  exportButton: {
    padding: '0.625rem 1rem',
    backgroundColor: 'var(--color-secondary)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center',
    color: 'var(--color-text-secondary)',
    padding: '2rem',
  } as React.CSSProperties,
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as React.CSSProperties,
  historyItem: {
    backgroundColor: 'var(--color-surface)',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-border)',
  } as React.CSSProperties,
  historyItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  historyItemDate: {
    fontWeight: 600,
    color: 'var(--color-text)',
  } as React.CSSProperties,
  historyItemMood: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.9375rem',
  } as React.CSSProperties,
  historyItemDetails: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  historyItemState: {
    fontWeight: 600,
  } as React.CSSProperties,
  historyItemSleep: {
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
  historyItemMeds: {
    color: 'var(--color-text-secondary)',
  } as React.CSSProperties,
  historyItemNotes: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid var(--color-border)',
  } as React.CSSProperties,
};
