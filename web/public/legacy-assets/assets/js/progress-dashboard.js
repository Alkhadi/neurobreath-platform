// =============================================
// NeuroBreath – Progress Dashboard UI
// Updates the progress dashboard page with live data
// =============================================

(function() {
  'use strict';

  function formatDays(days) {
    if (days === 0) return 'No streak yet';
    if (days === 1) return '1 day';
    return `${days} days`;
  }

  function formatMinutes(minutes) {
    if (minutes === 0) return '0 minutes';
    if (minutes === 1) return '1 minute';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
  }

  function formatActivityName(activity) {
    const names = {
      breathing: 'Breathing Exercise',
      focus: 'Focus Training',
      games: 'Game',
      mindfulness: 'Mindfulness'
    };
    return names[activity.type] || activity.name || activity.type;
  }

  function formatDate(timestamp) {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    } catch {
      return '';
    }
  }

  function updateStreaks() {
    if (!window.NBProgressTracker) return;

    const calm = window.NBProgressTracker.getStreak('calm');
    const breathing = window.NBProgressTracker.getStreak('breathing');
    const focus = window.NBProgressTracker.getStreak('focus');
    const overall = window.NBProgressTracker.getStreak('overall');

    const calmEl = document.getElementById('streak-calm');
    const breathingEl = document.getElementById('streak-breathing');
    const focusEl = document.getElementById('streak-focus');
    const overallEl = document.getElementById('streak-overall');

    if (calmEl) calmEl.textContent = formatDays(calm);
    if (breathingEl) breathingEl.textContent = formatDays(breathing);
    if (focusEl) focusEl.textContent = formatDays(focus);
    if (overallEl) overallEl.textContent = formatDays(overall);
  }

  function updateStats() {
    if (!window.NBProgressTracker) return;

    const breathing = window.NBProgressTracker.getActivityStats('breathing');
    const focus = window.NBProgressTracker.getActivityStats('focus');
    const games = window.NBProgressTracker.getActivityStats('games');
    const mindfulness = window.NBProgressTracker.getActivityStats('mindfulness');

    const breathingSessions = document.getElementById('stat-breathing-sessions');
    const breathingMinutes = document.getElementById('stat-breathing-minutes');
    const focusSessions = document.getElementById('stat-focus-sessions');
    const focusMinutes = document.getElementById('stat-focus-minutes');
    const gamesSessions = document.getElementById('stat-games-sessions');
    const mindfulnessSessions = document.getElementById('stat-mindfulness-sessions');
    const mindfulnessMinutes = document.getElementById('stat-mindfulness-minutes');

    if (breathingSessions) breathingSessions.textContent = breathing?.sessions || 0;
    if (breathingMinutes) breathingMinutes.textContent = formatMinutes(breathing?.minutes || 0);
    if (focusSessions) focusSessions.textContent = focus?.sessions || 0;
    if (focusMinutes) focusMinutes.textContent = formatMinutes(focus?.minutes || 0);
    if (gamesSessions) gamesSessions.textContent = games?.sessions || 0;
    if (mindfulnessSessions) mindfulnessSessions.textContent = mindfulness?.sessions || 0;
    if (mindfulnessMinutes) mindfulnessMinutes.textContent = formatMinutes(mindfulness?.minutes || 0);
  }

  function updatePoints() {
    if (!window.NBProgressTracker) return;

    const state = window.NBProgressTracker.getState();
    const pointsEl = document.getElementById('points-value');
    if (pointsEl) {
      pointsEl.textContent = state.points || 0;
    }
  }

  function updateActivityLog() {
    if (!window.NBProgressTracker) return;

    const state = window.NBProgressTracker.getState();
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;

    const activities = state.activityLog || [];

    if (activities.length === 0) {
      activityList.innerHTML = '<p class="muted">No activity yet. Start practicing to see your progress here!</p>';
      return;
    }

    const html = activities.map(activity => {
      const name = formatActivityName(activity);
      const time = formatDate(activity.timestamp);
      const points = activity.points ? ` · +${activity.points} points` : '';
      const minutes = activity.minutes ? ` · ${activity.minutes} min` : '';

      return `
        <div class="activity-item">
          <div class="activity-icon">${getActivityIcon(activity.type)}</div>
          <div class="activity-details">
            <div class="activity-name">${name}</div>
            <div class="activity-meta">${time}${minutes}${points}</div>
          </div>
        </div>
      `;
    }).join('');

    activityList.innerHTML = html;
  }

  function getActivityIcon(type) {
    const icons = {
      breathing: '🫁',
      focus: '🎯',
      games: '🎮',
      mindfulness: '🧘'
    };
    return icons[type] || '⭐';
  }

  function updateAll() {
    updateStreaks();
    updateStats();
    updatePoints();
    updateActivityLog();
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(updateAll, 100); // Wait for modules to load
    });
  } else {
    setTimeout(updateAll, 100);
  }

  // Update when progress changes
  if (typeof window !== 'undefined') {
    window.addEventListener('nb:progress-updated', updateAll);
    window.addEventListener('nb:badge-earned', updateAll);
  }

})();
