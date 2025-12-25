// =============================================
// PROMPT ACTIVITY INTEGRATION
// Integrates Prompt Missions with breathing exercises, focus games, etc.
// =============================================

(function() {
  'use strict';

  // Track active activities
  let activeBreathingSession = null;
  let activeFocusGame = null;

  // Initialize integration
  function init() {
    if (!window.PromptMissions) {
      console.error('Prompt Activity Integration: PromptMissions not found');
      return;
    }

    // Hook into breathing sessions
    hookIntoBreathingSessions();

    // Hook into focus games
    hookIntoFocusGames();

    // Hook into quick start modal
    hookIntoQuickStartModal();

    // Listen for mission activity starts
    window.addEventListener('prompt-mission:activity-start', handleMissionActivityStart);
  }

  // Hook into breathing session completion
  function hookIntoBreathingSessions() {
    // Intercept Stats.addSession if available (common pattern)
    if (window.Stats && typeof window.Stats.addSession === 'function') {
      const originalAddSession = window.Stats.addSession;
      window.Stats.addSession = function(...args) {
        const result = originalAddSession.apply(this, args);
        
        // Check if this is a breathing session
        const sessionData = args[0] || {};
        if (sessionData.techId || sessionData.seconds >= 30) {
          dispatchBreathingComplete({
            duration: sessionData.seconds || 0,
            technique: sessionData.techId || 'unknown',
            breaths: sessionData.breaths || 0
          });
        }
        
        return result;
      };
    }

    // Listen for custom breathing events
    document.addEventListener('breathing-session-start', (e) => {
      activeBreathingSession = {
        startTime: Date.now(),
        technique: e.detail?.technique || 'unknown'
      };
    });

    document.addEventListener('breathing-session-end', (e) => {
      if (activeBreathingSession) {
        const duration = Math.round((Date.now() - activeBreathingSession.startTime) / 1000);
        dispatchBreathingComplete({
          duration: e.detail?.duration || duration,
          technique: activeBreathingSession.technique,
          breaths: e.detail?.breaths || 0
        });
        activeBreathingSession = null;
      }
    });

    // Hook into breathing-session.js finishSession
    const sessionScript = document.querySelector('script[src*="breathing-session.js"]');
    if (sessionScript) {
      // Wait for script to load and then patch
      setTimeout(() => {
        patchBreathingSessionFinish();
      }, 500);
    }
  }

  // Patch breathing-session.js finishSession function
  function patchBreathingSessionFinish() {
    // Try to access the finishSession function if it's in a closure
    // We'll dispatch events based on completion patterns instead
    
    // Monitor for session completion indicators
    const observer = new MutationObserver(() => {
      // Check for completion indicators in DOM
      const doneSection = document.getElementById('done');
      const sessionEl = document.getElementById('session');
      
      if (doneSection && !doneSection.classList.contains('hidden') && activeBreathingSession) {
        // Session appears complete
        const duration = Math.round((Date.now() - activeBreathingSession.startTime) / 1000);
        if (duration >= 30) {
          dispatchBreathingComplete({
            duration,
            technique: activeBreathingSession.technique,
            breaths: 0
          });
          activeBreathingSession = null;
        }
      }
    });

    const targetNode = document.body;
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  // Hook into focus games
  function hookIntoFocusGames() {
    // Listen for game state changes
    if (window.GameState) {
      const originalSave = window.GameState.save;
      if (typeof originalSave === 'function') {
        window.GameState.save = function(...args) {
          const result = originalSave.apply(this, args);
          
          // Check if game was just completed
          if (activeFocusGame) {
            const duration = Math.round((Date.now() - activeFocusGame.startTime) / 1000);
            if (duration >= 30) {
              dispatchFocusGameComplete({
                duration,
                gameType: activeFocusGame.gameType,
                score: this.score || 0
              });
              activeFocusGame = null;
            }
          }
          
          return result;
        };
      }
    }

    // Listen for game start events
    document.addEventListener('adhd:game-start', (e) => {
      activeFocusGame = {
        startTime: Date.now(),
        gameType: e.detail?.gameType || 'unknown'
      };
    });

    // Listen for game complete events
    document.addEventListener('adhd:game-complete', (e) => {
      if (activeFocusGame) {
        const duration = Math.round((Date.now() - activeFocusGame.startTime) / 1000);
        dispatchFocusGameComplete({
          duration: e.detail?.duration || duration,
          gameType: activeFocusGame.gameType,
          score: e.detail?.score || 0
        });
        activeFocusGame = null;
      }
    });

    // Hook into specific game init functions
    if (window.MemoryMatrix && typeof window.MemoryMatrix.init === 'function') {
      const originalInit = window.MemoryMatrix.init;
      window.MemoryMatrix.init = function(...args) {
        activeFocusGame = { startTime: Date.now(), gameType: 'memoryMatrix' };
        return originalInit.apply(this, args);
      };
    }

    if (window.ColorStorm && typeof window.ColorStorm.init === 'function') {
      const originalInit = window.ColorStorm.init;
      window.ColorStorm.init = function(...args) {
        activeFocusGame = { startTime: Date.now(), gameType: 'colorStorm' };
        return originalInit.apply(this, args);
      };
    }

    if (window.FocusFlow && typeof window.FocusFlow.init === 'function') {
      const originalInit = window.FocusFlow.init;
      window.FocusFlow.init = function(...args) {
        activeFocusGame = { startTime: Date.now(), gameType: 'focusFlow' };
        return originalInit.apply(this, args);
      };
    }

    if (window.PatternPulse && typeof window.PatternPulse.init === 'function') {
      const originalInit = window.PatternPulse.init;
      window.PatternPulse.init = function(...args) {
        activeFocusGame = { startTime: Date.now(), gameType: 'patternPulse' };
        return originalInit.apply(this, args);
      };
    }
  }

  // Hook into quick start modal
  function hookIntoQuickStartModal() {
    // Monitor for quick start modal session completion
    if (window.__NBQuickStartModal) {
      // Listen for session end in modal
      window.addEventListener('quick-start:session-end', (e) => {
        if (e.detail && e.detail.duration >= 30) {
          dispatchBreathingComplete({
            duration: e.detail.duration,
            technique: e.detail.technique || 'quick-start',
            breaths: e.detail.breaths || 0
          });
        }
      });
    }

    // Monitor overallSessionProgress for completion
    let lastProgress = 0;
    const progressMonitor = setInterval(() => {
      if (window.overallSessionProgress !== undefined) {
        const currentProgress = window.overallSessionProgress;
        
        // Detect completion (progress reached 1.0)
        if (lastProgress < 1 && currentProgress >= 1) {
          // Estimate duration (rough)
          const estimatedDuration = 120; // Default estimate
          dispatchBreathingComplete({
            duration: estimatedDuration,
            technique: 'quick-start',
            breaths: 0
          });
        }
        
        lastProgress = currentProgress;
      }
    }, 500);
  }

  // Dispatch breathing complete event
  function dispatchBreathingComplete(data) {
    const event = new CustomEvent('breathing-session-complete', {
      detail: {
        duration: data.duration,
        technique: data.technique,
        breaths: data.breaths,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);
  }

  // Dispatch focus game complete event
  function dispatchFocusGameComplete(data) {
    const event = new CustomEvent('focus-game-complete', {
      detail: {
        duration: data.duration,
        gameType: data.gameType,
        score: data.score,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);
  }

  // Handle mission activity start
  function handleMissionActivityStart(event) {
    const { activityType, promptId } = event.detail || {};
    
    if (activityType === 'breathing') {
      activeBreathingSession = {
        startTime: Date.now(),
        technique: 'mission-breathing',
        promptId
      };
    } else if (activityType === 'focus-game') {
      activeFocusGame = {
        startTime: Date.now(),
        gameType: 'mission-focus',
        promptId
      };
    }
  }

  // Public API
  window.PromptActivityIntegration = {
    init,
    dispatchBreathingComplete,
    dispatchFocusGameComplete
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Delay init to ensure other scripts are loaded
    setTimeout(init, 100);
  }
})();

