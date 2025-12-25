// =============================================
// NEUROBREATH UNIFIED STORE
// Single source of truth for all user data
// Built for clean migration to Firebase/Supabase later
// =============================================

(function() {
  'use strict';

  const NB_STORE_KEY = "nb.store.v1";
  const NB_BACKUP_KEY = "nb.backup.v1";

  // Utility functions
  function nbNowISO() {
    return new Date().toISOString();
  }

  function nbToday() {
    return new Date().toISOString().slice(0, 10);
  }

  function nbUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "id_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
  }

  // Default store structure
  function nbDefaultStore() {
    const deviceId = nbUUID();
    return {
      schemaVersion: 1,
      deviceId,
      createdAt: nbNowISO(),
      updatedAt: nbNowISO(),
      user: {
        userId: "local:" + deviceId,
        displayName: "Guest",
        roles: ["learner"]
      },
      prefs: {
        theme: "blue",
        reduceMotion: false,
        lowStimMode: false
      },
      economy: {
        xp: 0,
        coins: 0,
        streak: {
          count: 0,
          lastClaimDate: ""
        }
      },
      missions: {
        templates: {},
        daily: {
          date: nbToday(),
          activeMissionIds: [],
          progress: {},
          claimed: {}
        },
        history: []
      },
      journeys: {
        journeys: {},
        active: {
          journeyId: "",
          stepProgress: {},
          completedSteps: []
        }
      },
      vault: {
        rewards: {
          badges: [],
          coupons: [],
          unlocks: []
        },
        outcomes: {}
      },
      customPrompts: {},
      audit: {
        lastEventAt: "",
        recentEvents: []
      }
    };
  }

  // Load store
  function nbLoad() {
    try {
      const raw = localStorage.getItem(NB_STORE_KEY);
      if (!raw) {
        return nbDefaultStore();
      }
      const parsed = JSON.parse(raw);
      if (parsed && parsed.schemaVersion) {
        // Ensure all required fields exist
        return mergeDefaults(parsed, nbDefaultStore());
      }
      return nbDefaultStore();
    } catch (err) {
      console.warn('NB Store: Error loading store', err);
      // Try backup
      try {
        const backup = localStorage.getItem(NB_BACKUP_KEY);
        if (backup) {
          return JSON.parse(backup);
        }
      } catch {}
      return nbDefaultStore();
    }
  }

  // Merge defaults (deep merge for nested objects)
  function mergeDefaults(data, defaults) {
    const result = { ...defaults };
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
        result[key] = mergeDefaults(data[key], defaults[key] || {});
      } else {
        result[key] = data[key] !== undefined ? data[key] : defaults[key];
      }
    });
    return result;
  }

  // Save store
  function nbSave(store) {
    try {
      store.updatedAt = nbNowISO();
      const json = JSON.stringify(store);
      
      // Save backup first
      const current = localStorage.getItem(NB_STORE_KEY);
      if (current) {
        localStorage.setItem(NB_BACKUP_KEY, current);
      }
      
      // Save new store
      localStorage.setItem(NB_STORE_KEY, json);
      
      // Broadcast change
      window.dispatchEvent(new CustomEvent('nb-store:updated', { detail: { store } }));
      
      return true;
    } catch (err) {
      console.error('NB Store: Error saving store', err);
      // Try to recover space if quota exceeded
      if (err.name === 'QuotaExceededError') {
        try {
          // Clear old audit events
          store.audit.recentEvents = store.audit.recentEvents.slice(-25);
          localStorage.setItem(NB_STORE_KEY, JSON.stringify(store));
          return true;
        } catch {}
      }
      return false;
    }
  }

  // Track event
  function nbTrack(type, payload = {}) {
    const store = nbLoad();

    store.audit.lastEventAt = nbNowISO();
    store.audit.recentEvents = (store.audit.recentEvents || []).slice(-49);
    store.audit.recentEvents.push({
      t: type,
      ...payload,
      at: nbNowISO()
    });

    // Update daily mission progress
    nbApplyDailyProgress(store, type, payload);

    nbSave(store);
    return store;
  }

  // Apply daily mission progress
  function nbApplyDailyProgress(store, metric, payload = {}) {
    const today = nbToday();
    
    // Reset daily if new day
    if (store.missions.daily.date !== today) {
      store.missions.daily = {
        date: today,
        activeMissionIds: store.missions.daily.activeMissionIds || [],
        progress: {},
        claimed: {}
      };
    }

    // Update progress for matching missions
    for (const missionId of (store.missions.daily.activeMissionIds || [])) {
      const tpl = store.missions.templates[missionId];
      if (!tpl || tpl.metric !== metric) continue;

      store.missions.daily.progress[missionId] = (store.missions.daily.progress[missionId] || 0) + 1;
    }
  }

  // Initialize default daily mission if needed
  function nbInitDefaultMission(store) {
    if (!store.missions.templates['m_copy_3']) {
      store.missions.templates['m_copy_3'] = {
        id: 'm_copy_3',
        title: 'Copy 3 prompts',
        type: 'daily',
        goal: 3,
        metric: 'prompt_copy',
        reward: { xp: 30, coins: 5 }
      };
    }

    const today = nbToday();
    if (store.missions.daily.date !== today || store.missions.daily.activeMissionIds.length === 0) {
      store.missions.daily = {
        date: today,
        activeMissionIds: ['m_copy_3'],
        progress: {},
        claimed: {}
      };
    }
  }

  // Claim mission reward
  function nbClaimMission(missionId) {
    const store = nbLoad();
    const today = nbToday();
    
    if (store.missions.daily.date !== today) {
      return false; // Old mission
    }

    const tpl = store.missions.templates[missionId];
    if (!tpl) return false;

    const progress = store.missions.daily.progress[missionId] || 0;
    if (progress < tpl.goal) return false; // Not complete

    if (store.missions.daily.claimed[missionId]) return false; // Already claimed

    // Award rewards
    store.economy.xp = (store.economy.xp || 0) + (tpl.reward?.xp || 0);
    store.economy.coins = (store.economy.coins || 0) + (tpl.reward?.coins || 0);

    // Mark as claimed
    store.missions.daily.claimed[missionId] = true;

    // Add to history
    if (!store.missions.history) store.missions.history = [];
    store.missions.history.unshift({
      date: today,
      completed: [missionId],
      xpEarned: tpl.reward?.xp || 0,
      coinsEarned: tpl.reward?.coins || 0
    });
    store.missions.history = store.missions.history.slice(0, 100); // Keep last 100

    nbSave(store);
    return true;
  }

  // Public API
  window.NBStore = {
    load: nbLoad,
    save: nbSave,
    track: nbTrack,
    claimMission: nbClaimMission,
    initDefaultMission: nbInitDefaultMission,
    nowISO: nbNowISO,
    today: nbToday,
    uuid: nbUUID
  };

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const store = nbLoad();
      nbInitDefaultMission(store);
      nbSave(store);
    });
  } else {
    const store = nbLoad();
    nbInitDefaultMission(store);
    nbSave(store);
  }
})();

