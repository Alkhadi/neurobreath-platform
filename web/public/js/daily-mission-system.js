// =============================================
// DAILY MISSION SYSTEM
// Manages the daily mission flow: energy check → breathing → inputs → output capture
// =============================================

(function() {
  'use strict';

  const STORAGE_KEY = 'nb_daily_mission_v1';

  // Default state
  const defaultState = {
    currentMission: null,
    todayDate: null,
    energyLevel: null,
    breathingCompleted: false,
    inputsCompleted: false,
    outputCaptured: false,
    missionCompleted: false
  };

  let missionState = null;

  // Load state
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        
        // Reset if new day
        if (parsed.todayDate !== today) {
          missionState = { ...defaultState, todayDate: today };
        } else {
          missionState = { ...defaultState, ...parsed, todayDate: today };
        }
      } else {
        missionState = { ...defaultState, todayDate: new Date().toDateString() };
      }
      return missionState;
    } catch (err) {
      console.warn('Daily Mission: Error loading state', err);
      missionState = { ...defaultState, todayDate: new Date().toDateString() };
      return missionState;
    }
  }

  // Save state
  function saveState() {
    try {
      missionState.todayDate = new Date().toDateString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(missionState));
      broadcastStateChange();
    } catch (err) {
      console.warn('Daily Mission: Error saving state', err);
    }
  }

  // Broadcast state change
  function broadcastStateChange() {
    try {
      window.dispatchEvent(new CustomEvent('daily-mission:state-change', {
        detail: { state: getState() }
      }));
    } catch (err) {
      // Ignore
    }
  }

  // Initialize
  function init() {
    loadState();
  }

  // Get state
  function getState() {
    if (!missionState) loadState();
    return JSON.parse(JSON.stringify(missionState));
  }

  // Start daily mission
  function startDailyMission(missionData) {
    if (!missionState) loadState();

    missionState.currentMission = {
      promptId: missionData.promptId,
      promptTitle: missionData.promptTitle,
      category: missionData.category,
      templateId: missionData.templateId,
      startedAt: new Date().toISOString()
    };

    missionState.energyLevel = null;
    missionState.breathingCompleted = false;
    missionState.inputsCompleted = false;
    missionState.outputCaptured = false;
    missionState.missionCompleted = false;

    saveState();
    return missionState.currentMission;
  }

  // Set energy level
  function setEnergyLevel(level) {
    if (!missionState) loadState();
    if (level >= 1 && level <= 5) {
      missionState.energyLevel = level;
      saveState();
      return true;
    }
    return false;
  }

  // Complete breathing primer
  function completeBreathing() {
    if (!missionState) loadState();
    missionState.breathingCompleted = true;
    saveState();
    return true;
  }

  // Complete inputs
  function completeInputs(inputs) {
    if (!missionState) loadState();
    missionState.inputsCompleted = true;
    if (missionState.currentMission) {
      missionState.currentMission.inputs = inputs;
    }
    saveState();
    return true;
  }

  // Capture output
  function captureOutput(output, options = {}) {
    if (!missionState) loadState();
    if (!missionState.currentMission) return false;

    missionState.outputCaptured = true;
    missionState.currentMission.output = output;
    missionState.currentMission.reflection = options.reflection || null;
    missionState.currentMission.nextStep = options.nextStep || null;
    missionState.currentMission.privacy = options.privacy || 'private';
    missionState.currentMission.completedAt = new Date().toISOString();

    // Save to Outcome Vault
    if (window.OutcomeVault) {
      const outcome = window.OutcomeVault.saveOutcome({
        promptId: missionState.currentMission.promptId,
        promptTitle: missionState.currentMission.promptTitle,
        category: missionState.currentMission.category,
        output: output,
        inputs: missionState.currentMission.inputs || {},
        tags: options.tags || [],
        audience: options.audience || null,
        privacy: options.privacy || 'private',
        reflection: options.reflection || null,
        nextStep: options.nextStep || null
      });

      missionState.currentMission.outcomeId = outcome.id;

      // Award points for saving output
      if (window.PromptVault && output && output.trim().length > 0) {
        window.PromptVault.recordOutputSave(missionState.currentMission.promptId);
      }
    }

    saveState();
    return true;
  }

  // Complete mission
  function completeMission() {
    if (!missionState) loadState();
    
    if (!missionState.currentMission || 
        !missionState.inputsCompleted || 
        !missionState.outputCaptured) {
      return false;
    }

    missionState.missionCompleted = true;

    // Award points (not for copying, but for completing)
    if (window.PromptVault) {
      // Award points based on completion steps
      let points = 5; // Base completion
      
      if (missionState.breathingCompleted) {
        points += 5; // Bonus for breathing primer
      }
      
      if (missionState.energyLevel !== null) {
        points += 2; // Bonus for energy check
      }

      window.PromptVault.addPromptInk(points, 'daily-mission-completion');

      // Update streak
      window.PromptVault.updateStreak();
    }

    saveState();
    return true;
  }

  // Get current mission
  function getCurrentMission() {
    if (!missionState) loadState();
    return missionState.currentMission ? { ...missionState.currentMission } : null;
  }

  // Check if mission is completed today
  function isMissionCompletedToday() {
    if (!missionState) loadState();
    return missionState.missionCompleted === true;
  }

  // Get mission progress
  function getProgress() {
    if (!missionState) loadState();
    
    return {
      energyLevel: missionState.energyLevel,
      breathingCompleted: missionState.breathingCompleted,
      inputsCompleted: missionState.inputsCompleted,
      outputCaptured: missionState.outputCaptured,
      missionCompleted: missionState.missionCompleted,
      stepsCompleted: [
        missionState.energyLevel !== null,
        missionState.breathingCompleted,
        missionState.inputsCompleted,
        missionState.outputCaptured
      ].filter(Boolean).length,
      totalSteps: 4
    };
  }

  // Reset today's mission (for testing or if user wants to restart)
  function resetToday() {
    if (!missionState) loadState();
    const today = new Date().toDateString();
    if (missionState.todayDate === today) {
      missionState = { ...defaultState, todayDate: today };
      saveState();
      return true;
    }
    return false;
  }

  // Public API
  window.DailyMissionSystem = {
    init,
    getState,
    startDailyMission,
    setEnergyLevel,
    completeBreathing,
    completeInputs,
    captureOutput,
    completeMission,
    getCurrentMission,
    isMissionCompletedToday,
    getProgress,
    resetToday
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

