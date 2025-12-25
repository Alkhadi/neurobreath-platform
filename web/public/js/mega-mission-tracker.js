// =============================================
// MEGA MISSION TRACKER
// Tracks completion of ALL games, challenges, and activities across the website
// Required for unlocking the full prompt collection PDF
// =============================================

(function() {
  'use strict';

  const STORAGE_KEY = 'nb_mega_mission_v1';

  // Define ALL activities that must be completed
  const MEGA_MISSION_ACTIVITIES = {
    // Breathing Techniques (must complete at least one session of each)
    breathing: {
      'box-breathing': { name: 'Box Breathing', required: 1, type: 'breathing' },
      '4-7-8': { name: '4-7-8 Breathing', required: 1, type: 'breathing' },
      '478': { name: '4-7-8 Breathing', required: 1, type: 'breathing' },
      'coherent-5-5': { name: 'Coherent 5-5 Breathing', required: 1, type: 'breathing' },
      'coherent': { name: 'Coherent 5-5 Breathing', required: 1, type: 'breathing' },
      'sos-60': { name: 'SOS 60-Second', required: 1, type: 'breathing' },
      'sos60': { name: 'SOS 60-Second', required: 1, type: 'breathing' },
      'sos': { name: 'SOS Breathing', required: 1, type: 'breathing' }
    },
    
    // Focus Games (must complete at least one session of each)
    focusGames: {
      'memoryMatrix': { name: 'Memory Matrix Challenge', required: 1, type: 'game' },
      'colorStorm': { name: 'Color Storm', required: 1, type: 'game' },
      'focusFlow': { name: 'Focus Flow', required: 1, type: 'game' },
      'patternPulse': { name: 'Pattern Pulse', required: 1, type: 'game' }
    },
    
    // Challenge Lab Activities (must complete at least one of each category)
    challenges: {
      'calm': { name: 'Calm Challenge', required: 1, type: 'challenge' },
      'focus': { name: 'Focus Challenge', required: 1, type: 'challenge' },
      'sleep': { name: 'Sleep Challenge', required: 1, type: 'challenge' },
      'school': { name: 'School Challenge', required: 1, type: 'challenge' },
      'mood': { name: 'Mood Challenge', required: 1, type: 'challenge' }
    },
    
    // Focus Garden (must complete at least one planting session)
    focusGarden: {
      'focus-garden': { name: 'Focus Garden', required: 1, type: 'garden' }
    },
    
    // Other Key Activities
    other: {
      'mindfulness': { name: 'Mindfulness Practice', required: 1, type: 'mindfulness' },
      'journal': { name: 'Focus Journal Entry', required: 1, type: 'journal' }
    }
  };

  // Default state
  const defaultState = {
    activities: {}, // Track completion counts per activity
    lastUpdated: null,
    megaMissionCompleted: false,
    megaMissionCompletedAt: null
  };

  let trackerState = null;

  // Load state
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        trackerState = { ...defaultState, ...JSON.parse(saved) };
      } else {
        trackerState = { ...defaultState };
      }
      return trackerState;
    } catch (err) {
      console.warn('Mega Mission Tracker: Error loading state', err);
      trackerState = { ...defaultState };
      return trackerState;
    }
  }

  // Save state
  function saveState() {
    try {
      trackerState.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerState));
      checkMegaMissionCompletion();
      broadcastStateChange();
    } catch (err) {
      console.warn('Mega Mission Tracker: Error saving state', err);
    }
  }

  // Broadcast state change
  function broadcastStateChange() {
    try {
      window.dispatchEvent(new CustomEvent('mega-mission:state-change', {
        detail: { state: getState(), progress: getProgress() }
      }));
    } catch (err) {
      // Ignore
    }
  }

  // Initialize
  function init() {
    loadState();
    scanExistingProgress();
    setupActivityListeners();
    checkMegaMissionCompletion();
  }

  // Scan existing progress from other systems
  function scanExistingProgress() {
    // Check breathing sessions
    scanBreathingSessions();
    
    // Check focus games
    scanFocusGames();
    
    // Check challenges
    scanChallenges();
    
    // Check focus garden
    scanFocusGarden();
    
    // Check other activities
    scanOtherActivities();
    
    saveState();
  }

  // Scan breathing sessions
  function scanBreathingSessions() {
    if (!window.Stats || typeof window.Stats.get !== 'function') return;
    
    try {
      const stats = window.Stats.get();
      const history = stats.history || {};
      
      // Check all breathing techniques
      Object.keys(MEGA_MISSION_ACTIVITIES.breathing).forEach(techId => {
        let count = 0;
        
        // Check history for this technique
        Object.values(history).forEach(dayRecord => {
          if (dayRecord.techs && dayRecord.techs[techId]) {
            count += dayRecord.techs[techId];
          }
          // Also check pages
          if (dayRecord.pages) {
            Object.values(dayRecord.pages).forEach(pageRecord => {
              if (pageRecord.techs && pageRecord.techs[techId]) {
                count += pageRecord.techs[techId];
              }
            });
          }
        });
        
        if (count > 0) {
          recordActivity('breathing', techId, count);
        }
      });
    } catch (err) {
      console.warn('Error scanning breathing sessions', err);
    }
  }

  // Scan focus games
  function scanFocusGames() {
    if (!window.GameState) return;
    
    try {
      const gameState = window.GameState;
      const stats = gameState.stats || {};
      
      Object.keys(MEGA_MISSION_ACTIVITIES.focusGames).forEach(gameId => {
        const gameStats = stats[gameId];
        if (gameStats && gameStats.played > 0) {
          recordActivity('focusGames', gameId, gameStats.played);
        }
      });
    } catch (err) {
      console.warn('Error scanning focus games', err);
    }
  }

  // Scan challenges
  function scanChallenges() {
    // Check challenge lab progress
    try {
      const challengeData = localStorage.getItem('nb.challenge.meta.v1');
      if (challengeData) {
        const data = JSON.parse(challengeData);
        const completions = data.challengeCompletions || {};
        
        Object.keys(MEGA_MISSION_ACTIVITIES.challenges).forEach(category => {
          if (completions[category] > 0) {
            recordActivity('challenges', category, completions[category]);
          }
        });
      }
    } catch (err) {
      console.warn('Error scanning challenges', err);
    }
  }

  // Scan focus garden
  function scanFocusGarden() {
    // Check if focus garden has been used
    try {
      // Check for focus garden state or progress indicators
      const focusGardenData = localStorage.getItem('focusGardenState') || 
                              localStorage.getItem('nb_focus_garden_state');
      
      if (focusGardenData) {
        const data = JSON.parse(focusGardenData);
        // Check if any plants have been planted
        if (data.plots && data.plots.length > 0) {
          recordActivity('focusGarden', 'focus-garden', 1);
        }
      }
    } catch (err) {
      console.warn('Error scanning focus garden', err);
    }
  }

  // Scan other activities
  function scanOtherActivities() {
    // Check journal entries
    if (window.GameState && window.GameState.journal && window.GameState.journal.length > 0) {
      recordActivity('other', 'journal', window.GameState.journal.length);
    }
  }

  // Record activity completion
  function recordActivity(category, activityId, count = 1) {
    if (!trackerState) loadState();
    
    const key = `${category}:${activityId}`;
    const currentCount = trackerState.activities[key] || 0;
    trackerState.activities[key] = Math.max(currentCount, count);
    saveState();
  }

  // Get activity progress
  function getActivityProgress(category, activityId) {
    if (!trackerState) loadState();
    
    const key = `${category}:${activityId}`;
    return trackerState.activities[key] || 0;
  }

  // Check if activity is complete
  function isActivityComplete(category, activityId) {
    const activityDef = MEGA_MISSION_ACTIVITIES[category]?.[activityId];
    if (!activityDef) return false;
    
    const progress = getActivityProgress(category, activityId);
    return progress >= activityDef.required;
  }

  // Get all activities
  function getAllActivities() {
    return MEGA_MISSION_ACTIVITIES;
  }

  // Get progress for mega mission
  function getProgress() {
    if (!trackerState) loadState();
    
    let totalActivities = 0;
    let completedActivities = 0;
    const details = {
      breathing: { total: 0, completed: 0, activities: [] },
      focusGames: { total: 0, completed: 0, activities: [] },
      challenges: { total: 0, completed: 0, activities: [] },
      focusGarden: { total: 0, completed: 0, activities: [] },
      other: { total: 0, completed: 0, activities: [] }
    };
    
    Object.keys(MEGA_MISSION_ACTIVITIES).forEach(category => {
      Object.keys(MEGA_MISSION_ACTIVITIES[category]).forEach(activityId => {
        totalActivities++;
        const activityDef = MEGA_MISSION_ACTIVITIES[category][activityId];
        const isComplete = isActivityComplete(category, activityId);
        const progress = getActivityProgress(category, activityId);
        
        details[category].total++;
        if (isComplete) {
          completedActivities++;
          details[category].completed++;
        }
        
        details[category].activities.push({
          id: activityId,
          name: activityDef.name,
          required: activityDef.required,
          progress: progress,
          completed: isComplete
        });
      });
    });
    
    return {
      total: totalActivities,
      completed: completedActivities,
      percentage: totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0,
      details: details,
      isComplete: completedActivities === totalActivities
    };
  }

  // Check if mega mission is completed
  function checkMegaMissionCompletion() {
    if (!trackerState) loadState();
    
    const progress = getProgress();
    
    if (progress.isComplete && !trackerState.megaMissionCompleted) {
      trackerState.megaMissionCompleted = true;
      trackerState.megaMissionCompletedAt = new Date().toISOString();
      saveState();
      
      // Broadcast completion
      window.dispatchEvent(new CustomEvent('mega-mission:completed', {
        detail: { completedAt: trackerState.megaMissionCompletedAt }
      }));
    }
    
    return trackerState.megaMissionCompleted;
  }

  // Setup activity listeners
  function setupActivityListeners() {
    // Listen for breathing session completions
    window.addEventListener('breathing-session-complete', (event) => {
      const techId = event.detail?.technique || 'unknown';
      // Map common technique IDs
      const mappedId = mapTechniqueId(techId);
      if (mappedId) {
        recordActivity('breathing', mappedId, 1);
      }
    });
    
    // Listen for focus game completions
    window.addEventListener('focus-game-complete', (event) => {
      const gameType = event.detail?.gameType || 'unknown';
      if (MEGA_MISSION_ACTIVITIES.focusGames[gameType]) {
        recordActivity('focusGames', gameType, 1);
      }
    });
    
    // Listen for challenge completions
    window.addEventListener('challenge-completed', (event) => {
      const category = event.detail?.category || 'unknown';
      if (MEGA_MISSION_ACTIVITIES.challenges[category]) {
        recordActivity('challenges', category, 1);
      }
    });
    
    // Listen for focus garden activities
    window.addEventListener('focus-garden:plant-planted', () => {
      recordActivity('focusGarden', 'focus-garden', 1);
    });
    
    // Listen for Stats updates
    if (window.Stats) {
      // Hook into Stats.addSession to track breathing
      const originalAddSession = window.Stats.addSession;
      if (typeof originalAddSession === 'function') {
        window.Stats.addSession = function(...args) {
          const result = originalAddSession.apply(this, args);
          const sessionData = args[0] || {};
          const techId = sessionData.techId || '';
          const mappedId = mapTechniqueId(techId);
          if (mappedId && MEGA_MISSION_ACTIVITIES.breathing[mappedId]) {
            recordActivity('breathing', mappedId, 1);
          }
          return result;
        };
      }
    }
    
    // Hook into GameState.save to track games
    if (window.GameState && typeof window.GameState.save === 'function') {
      const originalSave = window.GameState.save;
      window.GameState.save = function(...args) {
        const result = originalSave.apply(this, args);
        scanFocusGames();
        return result;
      };
    }
  }

  // Map technique IDs to our activity IDs
  function mapTechniqueId(techId) {
    if (!techId) return null;
    
    const lower = techId.toLowerCase().trim();
    
    // Direct matches first
    if (MEGA_MISSION_ACTIVITIES.breathing[lower]) return lower;
    
    // Mappings - handle various formats
    const mappings = {
      'box': 'box-breathing',
      'box-breathing': 'box-breathing',
      '478': '478',
      '4-7-8': '478',
      '4-7-8-breathing': '478',
      'four78': '478',
      'coherent': 'coherent-5-5',
      'coherent-5-5': 'coherent-5-5',
      'coherent55': 'coherent-5-5',
      'sos': 'sos-60',
      'sos60': 'sos-60',
      'sos-60': 'sos-60'
    };
    
    // Try direct mapping
    if (mappings[lower]) return mappings[lower];
    
    // Try partial matches
    if (lower.includes('box')) return 'box-breathing';
    if (lower.includes('478') || lower.includes('4-7-8')) return '478';
    if (lower.includes('coherent') || lower.includes('5-5')) return 'coherent-5-5';
    if (lower.includes('sos')) return 'sos-60';
    
    return null;
  }

  // Get state
  function getState() {
    if (!trackerState) loadState();
    return JSON.parse(JSON.stringify(trackerState));
  }

  // Reset mega mission (for testing)
  function resetMegaMission() {
    if (!trackerState) loadState();
    trackerState.megaMissionCompleted = false;
    trackerState.megaMissionCompletedAt = null;
    trackerState.activities = {};
    saveState();
    return true;
  }

  // Public API
  window.MegaMissionTracker = {
    init,
    getState,
    getProgress,
    getAllActivities,
    isActivityComplete,
    getActivityProgress,
    recordActivity,
    checkMegaMissionCompletion,
    resetMegaMission,
    isMegaMissionComplete: () => {
      if (!trackerState) loadState();
      return trackerState.megaMissionCompleted || false;
    }
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 200);
  }
})();

