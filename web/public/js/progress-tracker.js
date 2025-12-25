// =============================================
// NeuroBreath – Unified Progress Tracker
// Consolidates progress from breathing exercises, games, and activities
// =============================================

(function() {
  'use strict';

  const STORAGE_KEY = 'nb_progress_v2';
  const TZ = 'Europe/London';

  // Day formatter for consistent date keys
  const dayFormatter = (() => {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: TZ });
    } catch {
      return {
        format(date) {
          const d = date instanceof Date ? date : new Date(date);
          if (Number.isNaN(d.getTime())) return '';
          const y = d.getUTCFullYear();
          const m = String(d.getUTCMonth() + 1).padStart(2, '0');
          const day = String(d.getUTCDate()).padStart(2, '0');
          return `${y}-${m}-${day}`;
        }
      };
    }
  })();

  function toDayKey(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return dayFormatter.format(new Date());
    return dayFormatter.format(date);
  }

  function prevDayKey(key) {
    const parts = key.split('-').map(Number);
    if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return key;
    const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    dt.setUTCDate(dt.getUTCDate() - 1);
    return dayFormatter.format(dt);
  }

  // Default state structure
  function defaultState() {
    return {
      version: 2,
      timezone: TZ,
      // Activity tracking
      activities: {
        breathing: { total: 0, sessions: 0, minutes: 0, lastActivity: null },
        focus: { total: 0, sessions: 0, minutes: 0, lastActivity: null },
        games: { total: 0, sessions: 0, lastActivity: null },
        mindfulness: { total: 0, sessions: 0, minutes: 0, lastActivity: null }
      },
      // Daily history
      history: {},
      // Streaks
      streaks: {
        calm: 0, // Days with any calming activity
        breathing: 0, // Days with breathing practice
        focus: 0, // Days with focus practice
        overall: 0 // Days with any activity
      },
      // Badges earned
      badges: [],
      // Points/tokens
      points: 0,
      // Last activity timestamp
      lastActivity: null,
      // Activity log (last 50 activities)
      activityLog: []
    };
  }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      // Merge with defaults to handle version upgrades
      const merged = Object.assign({}, defaultState(), parsed);
      // Ensure all required fields exist
      if (!merged.activities) merged.activities = defaultState().activities;
      if (!merged.history) merged.history = {};
      if (!merged.streaks) merged.streaks = defaultState().streaks;
      if (!Array.isArray(merged.badges)) merged.badges = [];
      if (!Array.isArray(merged.activityLog)) merged.activityLog = [];
      return merged;
    } catch (err) {
      console.warn('Progress tracker: Failed to load, using defaults', err);
      return defaultState();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // Dispatch event for other modules
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('nb:progress-updated', {
          detail: { state: getState() }
        }));
      }
    } catch (err) {
      console.warn('Progress tracker: Failed to save', err);
    }
  }

  function computeStreak(history, activityType) {
    const keys = Object.keys(history || {})
      .filter(k => {
        const day = history[k];
        if (!day) return false;
        if (activityType === 'calm') {
          return (day.breathing?.sessions || 0) > 0 || 
                 (day.mindfulness?.sessions || 0) > 0 ||
                 (day.games?.sessions || 0) > 0;
        }
        if (activityType === 'breathing') {
          return (day.breathing?.sessions || 0) > 0;
        }
        if (activityType === 'focus') {
          return (day.focus?.sessions || 0) > 0 || (day.games?.sessions || 0) > 0;
        }
        if (activityType === 'overall') {
          return (day.breathing?.sessions || 0) > 0 ||
                 (day.focus?.sessions || 0) > 0 ||
                 (day.games?.sessions || 0) > 0 ||
                 (day.mindfulness?.sessions || 0) > 0;
        }
        return false;
      })
      .sort();

    if (!keys.length) return 0;

    let streak = 0;
    let cursor = keys[keys.length - 1];
    const visited = new Set();

    while (cursor && history[cursor]) {
      if (visited.has(cursor)) break;
      visited.add(cursor);

      const day = history[cursor];
      let hasActivity = false;

      if (activityType === 'calm') {
        hasActivity = (day.breathing?.sessions || 0) > 0 ||
                     (day.mindfulness?.sessions || 0) > 0 ||
                     (day.games?.sessions || 0) > 0;
      } else if (activityType === 'breathing') {
        hasActivity = (day.breathing?.sessions || 0) > 0;
      } else if (activityType === 'focus') {
        hasActivity = (day.focus?.sessions || 0) > 0 || (day.games?.sessions || 0) > 0;
      } else if (activityType === 'overall') {
        hasActivity = (day.breathing?.sessions || 0) > 0 ||
                     (day.focus?.sessions || 0) > 0 ||
                     (day.games?.sessions || 0) > 0 ||
                     (day.mindfulness?.sessions || 0) > 0;
      }

      if (!hasActivity) break;

      streak += 1;
      const next = prevDayKey(cursor);
      if (next === cursor) break;
      cursor = next;
    }

    return streak;
  }

  // Record an activity
  function recordActivity(type, data = {}) {
    const ts = data.timestamp ? new Date(data.timestamp) : new Date();
    if (Number.isNaN(ts.getTime())) return getState();

    const dayKey = toDayKey(ts);
    const minutes = Math.max(0, Number(data.minutes) || 0);
    const points = Math.max(0, Number(data.points) || 0);
    const activityName = typeof data.name === 'string' ? data.name.trim() : '';
    const pageId = typeof data.pageId === 'string' ? data.pageId.trim().toLowerCase() : '';

    // Update activity totals
    if (state.activities[type]) {
      state.activities[type].total += 1;
      state.activities[type].sessions += 1;
      if (minutes > 0) {
        state.activities[type].minutes = (state.activities[type].minutes || 0) + minutes;
      }
      state.activities[type].lastActivity = ts.toISOString();
    }

    // Update daily history
    if (!state.history[dayKey]) {
      state.history[dayKey] = {
        breathing: { sessions: 0, minutes: 0 },
        focus: { sessions: 0, minutes: 0 },
        games: { sessions: 0, minutes: 0 },
        mindfulness: { sessions: 0, minutes: 0 }
      };
    }

    const day = state.history[dayKey];
    if (day[type]) {
      day[type].sessions += 1;
      if (minutes > 0) {
        day[type].minutes = (day[type].minutes || 0) + minutes;
      }
    }

    // Add points
    if (points > 0) {
      state.points = (state.points || 0) + points;
    }

    // Update last activity
    state.lastActivity = ts.toISOString();

    // Add to activity log (keep last 50)
    state.activityLog.unshift({
      type,
      name: activityName || type,
      pageId,
      minutes,
      points,
      timestamp: ts.toISOString()
    });
    if (state.activityLog.length > 50) {
      state.activityLog = state.activityLog.slice(0, 50);
    }

    // Recompute streaks
    state.streaks.calm = computeStreak(state.history, 'calm');
    state.streaks.breathing = computeStreak(state.history, 'breathing');
    state.streaks.focus = computeStreak(state.history, 'focus');
    state.streaks.overall = computeStreak(state.history, 'overall');

    save();
    return getState();
  }

  // Get current state
  function getState() {
    return {
      activities: JSON.parse(JSON.stringify(state.activities)),
      streaks: JSON.parse(JSON.stringify(state.streaks)),
      badges: [...state.badges],
      points: state.points || 0,
      lastActivity: state.lastActivity,
      activityLog: state.activityLog.slice(0, 10), // Return last 10 for display
      history: JSON.parse(JSON.stringify(state.history))
    };
  }

  // Get activity stats for a specific type
  function getActivityStats(type) {
    return state.activities[type] ? { ...state.activities[type] } : null;
  }

  // Get streak for a specific type
  function getStreak(type = 'overall') {
    return state.streaks[type] || 0;
  }

  // Add a badge
  function addBadge(badgeId, badgeName) {
    if (!badgeId || typeof badgeId !== 'string') return;
    if (state.badges.find(b => b.id === badgeId)) return; // Already earned

    const badge = {
      id: badgeId,
      name: badgeName || badgeId,
      earnedAt: new Date().toISOString()
    };

    state.badges.push(badge);
    save();

    // Dispatch badge earned event
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('nb:badge-earned', {
        detail: { badge }
      }));
    }

    return badge;
  }

  // Check if badge is earned
  function hasBadge(badgeId) {
    return state.badges.some(b => b.id === badgeId);
  }

  // Reset all progress (for testing/admin)
  function reset() {
    state = defaultState();
    save();
    return getState();
  }

  // Export public API
  window.NBProgressTracker = {
    recordActivity,
    getState,
    getActivityStats,
    getStreak,
    addBadge,
    hasBadge,
    reset,
    // Helper to record breathing session
    recordBreathing: (data) => recordActivity('breathing', data),
    // Helper to record focus session
    recordFocus: (data) => recordActivity('focus', data),
    // Helper to record game session
    recordGame: (data) => recordActivity('games', data),
    // Helper to record mindfulness session
    recordMindfulness: (data) => recordActivity('mindfulness', data)
  };

  // Auto-sync with existing stats module if available
  if (typeof window !== 'undefined') {
    // Listen for existing breathing session events
    window.addEventListener('mpl:progress-update', (e) => {
      const detail = e.detail;
      if (detail && detail.seconds) {
        recordActivity('breathing', {
          minutes: Math.round(detail.seconds / 60),
          name: detail.techId || 'Breathing exercise',
          pageId: detail.pageId,
          timestamp: detail.timestamp
        });
      }
    });
  }

})();
