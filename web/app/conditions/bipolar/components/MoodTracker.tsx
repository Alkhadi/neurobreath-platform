'use client';

import React, { useState, useEffect } from 'react';
import { MoodEntry } from '../types';
import s from './MoodTracker.module.css';
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

  const getMoodBgClass = (mood: number): string => {
    if (mood <= 3) return s.moodBgDepressive;
    if (mood <= 5) return s.moodBgNormal;
    if (mood <= 7) return s.moodBgHypomanic;
    return s.moodBgManic;
  };

  const moodStateBorderClass: Record<MoodEntry['moodState'], string> = {
    depressive: s.stateBorderDepressive,
    normal: s.stateBorderNormal,
    hypomanic: s.stateBorderHypomanic,
    manic: s.stateBorderManic,
    mixed: s.stateBorderMixed,
  };

  const moodStateTextClass: Record<MoodEntry['moodState'], string> = {
    depressive: s.stateTextDepressive,
    normal: s.stateTextNormal,
    hypomanic: s.stateTextHypomanic,
    manic: s.stateTextManic,
    mixed: s.stateTextMixed,
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
    <div className={s.container}>
      <div className={s.header}>
        <h3 className={s.title}>
          <span className={s.titleIcon} aria-hidden="true">
            📊
          </span>
          {language === 'en-GB' ? 'Mood Tracker' : 'Mood Tracker'}
        </h3>
        <div className={s.description}>
          <p>
            Track your daily mood to identify patterns, triggers, and early warning signs.
            Evidence-based research shows that consistent mood tracking improves self-awareness
            and treatment outcomes.
          </p>
        </div>
      </div>

      <div className={s.viewToggle}>
        {view === 'form' ? (
          <button
            onClick={() => setView('form')}
            type="button"
            className={`${s.viewButton} ${s.viewButtonActive}`}
            aria-pressed="true"
          >
            Log Mood
          </button>
        ) : (
          <button
            onClick={() => setView('form')}
            type="button"
            className={s.viewButton}
            aria-pressed="false"
          >
            Log Mood
          </button>
        )}

        {view === 'calendar' ? (
          <button
            onClick={() => setView('calendar')}
            type="button"
            className={`${s.viewButton} ${s.viewButtonActive}`}
            aria-pressed="true"
          >
            Calendar
          </button>
        ) : (
          <button
            onClick={() => setView('calendar')}
            type="button"
            className={s.viewButton}
            aria-pressed="false"
          >
            Calendar
          </button>
        )}

        {view === 'list' ? (
          <button
            onClick={() => setView('list')}
            type="button"
            className={`${s.viewButton} ${s.viewButtonActive}`}
            aria-pressed="true"
          >
            History
          </button>
        ) : (
          <button
            onClick={() => setView('list')}
            type="button"
            className={s.viewButton}
            aria-pressed="false"
          >
            History
          </button>
        )}
      </div>

      {view === 'form' && (
        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.formGroup}>
            <label htmlFor="mood-date" className={s.label}>
              Date
            </label>
            <input
              id="mood-date"
              type="date"
              value={currentEntry.date}
              onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              required
              className={s.input}
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="mood-scale" className={s.label}>
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
              className={`${s.slider} ${s.moodSlider}`}
              data-mood={currentEntry.mood ?? 5}
            />
            <div className={s.moodLabels}>
              <span>1 (Very Low)</span>
              <span>10 (Very High)</span>
            </div>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="mood-state" className={s.label}>
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
              className={s.select}
            >
              <option value="depressive">Depressive</option>
              <option value="normal">Normal</option>
              <option value="hypomanic">Hypomanic</option>
              <option value="manic">Manic</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="sleep-hours" className={s.label}>
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
              className={`${s.slider} ${s.sleepSlider}`}
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="medications" className={s.checkboxLabel}>
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
                className={s.checkbox}
              />
              Took medications as prescribed
            </label>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="notes" className={s.label}>
              Notes (triggers, events, symptoms)
            </label>
            <textarea
              id="notes"
              value={currentEntry.notes}
              onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
              placeholder="Describe your day, any triggers, or notable events..."
              rows={4}
              className={s.textarea}
            />
          </div>

          <button type="submit" className={s.submitButton}>
            Save Entry
          </button>

          {showSuccess && (
            <div className={`${s.successMessage} animate-slide-up`}>
              ✓ Mood entry saved successfully!
            </div>
          )}
        </form>
      )}

      {view === 'calendar' && (
        <div className={s.calendar}>
          <div className={s.calendarGrid}>
            {entries.slice(0, 90).map((entry) => {
              const date = new Date(entry.date);
              const dayName = date.toLocaleDateString('en', { weekday: 'short' });
              const dayNum = date.getDate();
              const monthName = date.toLocaleDateString('en', { month: 'short' });

              return (
                <div
                  key={entry.id}
                  className={`${s.calendarDay} ${moodStateBorderClass[entry.moodState]}`}
                  title={`${entry.date}: Mood ${entry.mood}/10 - ${getMoodStateName(
                    entry.moodState
                  )}`}
                >
                  <div className={s.calendarDayDate}>
                    {monthName} {dayNum}
                  </div>
                  <div className={s.calendarDayName}>{dayName}</div>
                  <div
                    className={`${s.calendarDayMood} ${getMoodBgClass(entry.mood)}`}
                  >
                    {entry.mood}
                  </div>
                  <div className={s.calendarDayState}>
                    {getMoodStateName(entry.moodState)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className={s.history}>
          <div className={s.exportButtons}>
            <button onClick={handleExportCSV} className={s.exportButton}>
              📥 Export CSV
            </button>
            <button onClick={handleExportJSON} className={s.exportButton}>
              📥 Export JSON
            </button>
          </div>

          {entries.length === 0 && (
            <p className={s.emptyState}>No mood entries yet. Start logging your mood above!</p>
          )}

          <div className={s.historyList}>
            {entries.map((entry) => (
              <div key={entry.id} className={s.historyItem}>
                <div className={s.historyItemHeader}>
                  <div className={s.historyItemDate}>
                    {new Date(entry.date).toLocaleDateString('en', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div
                    className={`${s.historyItemMood} ${getMoodBgClass(entry.mood)}`}
                  >
                    {entry.mood}/10
                  </div>
                </div>
                <div className={s.historyItemDetails}>
                  <div
                    className={`${s.historyItemState} ${moodStateTextClass[entry.moodState]}`}
                  >
                    <strong>State:</strong> {getMoodStateName(entry.moodState)}
                  </div>
                  <div className={s.historyItemSleep}>
                    <strong>Sleep:</strong> {entry.sleepHours}h
                  </div>
                  <div className={s.historyItemMeds}>
                    <strong>Medications:</strong> {entry.medications ? 'Yes' : 'No'}
                  </div>
                </div>
                {entry.notes && (
                  <div className={s.historyItemNotes}>
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
