// =============================================
// PROMPT MISSIONS SYSTEM
// Handles mission completion, activity integration, and reward unlocking
// =============================================

(function() {
  'use strict';

  const MISSION_MIN_DURATION = 60; // 60 seconds minimum
  const MISSION_DURATION = 120; // 120 seconds target

  // Active mission state
  let activeMission = null;
  let missionTimer = null;
  let missionStartTime = null;

  // Mission UI elements
  let missionModal = null;
  let missionContainer = null;

  // Initialize mission system
  function init() {
    if (!window.PromptVault) {
      console.error('Prompt Missions: PromptVault not found. Load prompt-vault.js first.');
      return;
    }

    createMissionModal();
    setupActivityListeners();
  }

  // Create mission modal UI
  function createMissionModal() {
    // Check if modal already exists
    if (document.getElementById('prompt-mission-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'prompt-mission-modal';
    modal.className = 'prompt-mission-modal';
    modal.innerHTML = `
      <div class="prompt-mission-overlay"></div>
      <div class="prompt-mission-content">
        <button class="prompt-mission-close" aria-label="Close mission">×</button>
        <div class="prompt-mission-header">
          <h2>🎯 Prompt Mission</h2>
          <p class="prompt-mission-subtitle">Complete a calming activity to unlock this prompt</p>
        </div>
        <div class="prompt-mission-body">
          <div id="prompt-mission-prompt-info" class="prompt-mission-prompt-info"></div>
          <div id="prompt-mission-activity" class="prompt-mission-activity"></div>
          <div id="prompt-mission-progress" class="prompt-mission-progress" style="display: none;">
            <div class="prompt-mission-timer">
              <span id="prompt-mission-time">0:00</span>
            </div>
            <div class="prompt-mission-progress-bar">
              <div id="prompt-mission-progress-fill" class="prompt-mission-progress-fill"></div>
            </div>
          </div>
          <div id="prompt-mission-feeling" class="prompt-mission-feeling" style="display: none;">
            <p>How do you feel now?</p>
            <div class="prompt-mission-feeling-buttons">
              <button class="feeling-btn" data-feeling="1">😞</button>
              <button class="feeling-btn" data-feeling="2">😐</button>
              <button class="feeling-btn" data-feeling="3">🙂</button>
              <button class="feeling-btn" data-feeling="4">😊</button>
              <button class="feeling-btn" data-feeling="5">😄</button>
            </div>
            <button class="btn btn-outline skip-feeling-btn">Skip</button>
          </div>
          <div id="prompt-mission-success" class="prompt-mission-success" style="display: none;">
            <div class="success-icon">✨</div>
            <h3>Mission Complete!</h3>
            <p>You've earned <strong id="prompt-mission-ink-earned">10</strong> Prompt Ink points</p>
            <button class="btn btn-primary copy-prompt-btn">Copy Prompt</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    missionModal = modal;

    // Setup event listeners
    const closeBtn = modal.querySelector('.prompt-mission-close');
    const overlay = modal.querySelector('.prompt-mission-overlay');
    const skipFeelingBtn = modal.querySelector('.skip-feeling-btn');
    const copyBtn = modal.querySelector('.copy-prompt-btn');

    closeBtn.addEventListener('click', closeMission);
    overlay.addEventListener('click', closeMission);
    
    skipFeelingBtn?.addEventListener('click', () => {
      completeMission(null);
    });

    copyBtn?.addEventListener('click', () => {
      const promptId = activeMission?.promptId;
      if (promptId) {
        copyPromptToClipboard(promptId);
      }
    });

    modal.querySelectorAll('.feeling-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const feeling = parseInt(e.target.dataset.feeling);
        completeMission(feeling);
      });
    });
  }

  // Show mission for a prompt
  function showMission(promptId, options = {}) {
    if (!window.PromptVault) return false;

    const prompt = window.PromptVault.getPrompt(promptId);
    if (!prompt) return false;

    // Check if already unlocked
    if (window.PromptVault.isUnlocked(promptId) && !options.force) {
      // Directly show copy option
      showUnlockedPrompt(promptId);
      return true;
    }

    activeMission = {
      promptId,
      activityType: options.activityType || 'breathing',
      startTime: null,
      completed: false
    };

    // Update modal content
    updateMissionUI(prompt);

    // Show modal
    if (missionModal) {
      missionModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    return true;
  }

  // Update mission UI
  function updateMissionUI(prompt) {
    if (!missionModal) return;

    const promptInfo = missionModal.querySelector('#prompt-mission-prompt-info');
    const activityDiv = missionModal.querySelector('#prompt-mission-activity');
    const progressDiv = missionModal.querySelector('#prompt-mission-progress');
    const feelingDiv = missionModal.querySelector('#prompt-mission-feeling');
    const successDiv = missionModal.querySelector('#prompt-mission-success');

    // Hide all sections
    progressDiv.style.display = 'none';
    feelingDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Show prompt info
    if (promptInfo) {
      promptInfo.innerHTML = `
        <h3>${prompt.title}</h3>
        <p>${prompt.purpose}</p>
        <div class="prompt-mission-meta">
          <span>⏱️ ${Math.round(prompt.timeCost)}s</span>
          <span>🎯 ${prompt.difficulty}</span>
        </div>
      `;
    }

    // Show activity options
    if (activityDiv) {
      activityDiv.innerHTML = `
        <p>Choose an activity to begin:</p>
        <div class="prompt-mission-activities">
          <button class="btn btn-primary activity-btn" data-activity="breathing">
            🌬️ Breathing Exercise (60-120s)
          </button>
          <button class="btn btn-primary activity-btn" data-activity="focus-game">
            🎯 Focus Mini-Game (60-120s)
          </button>
          <button class="btn btn-outline activity-btn" data-activity="reflection">
            💭 Quick Reflection (30s)
          </button>
        </div>
      `;

      // Setup activity button listeners
      activityDiv.querySelectorAll('.activity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const activityType = e.target.dataset.activity;
          startMissionActivity(activityType);
        });
      });
    }
  }

  // Start mission activity
  function startMissionActivity(activityType) {
    if (!activeMission) return;

    activeMission.activityType = activityType;
    activeMission.startTime = Date.now();
    missionStartTime = Date.now();

    const progressDiv = missionModal.querySelector('#prompt-mission-progress');
    const activityDiv = missionModal.querySelector('#prompt-mission-activity');

    // Hide activity selection, show progress
    if (activityDiv) activityDiv.style.display = 'none';
    if (progressDiv) progressDiv.style.display = 'block';

    // Handle different activity types
    switch (activityType) {
      case 'breathing':
        startBreathingActivity();
        break;
      case 'focus-game':
        startFocusGameActivity();
        break;
      case 'reflection':
        startReflectionActivity();
        break;
      default:
        completeActivity();
    }
  }

  // Start breathing activity
  function startBreathingActivity() {
    // Try to trigger existing breathing session
    if (window.__NBQuickStartModal && typeof window.__NBQuickStartModal.open === 'function') {
      // Use existing breathing modal
      window.__NBQuickStartModal.open({ technique: 'box' });
    } else {
      // Fallback: start timer-based activity
      startTimerActivity(MISSION_DURATION);
    }

    // Listen for breathing completion
    window.addEventListener('breathing-session-complete', handleActivityComplete);
    window.addEventListener('focus-game-complete', handleActivityComplete);
  }

  // Start focus game activity
  function startFocusGameActivity() {
    // Try to trigger existing focus game
    if (window.MemoryMatrix && typeof window.MemoryMatrix.init === 'function') {
      // Could redirect to games page or trigger game
      // For now, use timer
      startTimerActivity(MISSION_DURATION);
    } else {
      startTimerActivity(MISSION_DURATION);
    }

    window.addEventListener('focus-game-complete', handleActivityComplete);
  }

  // Start reflection activity
  function startReflectionActivity() {
    // Short reflection - just show timer for 30 seconds
    startTimerActivity(30);
  }

  // Start timer-based activity
  function startTimerActivity(duration) {
    let elapsed = 0;
    const updateInterval = 100; // Update every 100ms

    missionTimer = setInterval(() => {
      elapsed += updateInterval;
      const remaining = Math.max(0, duration * 1000 - elapsed);
      const seconds = Math.floor(remaining / 1000);
      
      updateProgressTimer(seconds);
      updateProgressBar((elapsed / (duration * 1000)) * 100);

      if (elapsed >= duration * 1000) {
        clearInterval(missionTimer);
        completeActivity();
      }
    }, updateInterval);
  }

  // Handle activity completion from external events
  function handleActivityComplete(event) {
    if (!activeMission) return;
    const duration = event.detail?.duration || Math.round((Date.now() - missionStartTime) / 1000);
    completeActivity(duration);
  }

  // Complete activity and show feeling check
  function completeActivity(duration = null) {
    if (missionTimer) {
      clearInterval(missionTimer);
      missionTimer = null;
    }

    if (!activeMission) return;

    // Calculate actual duration
    const actualDuration = duration || Math.round((Date.now() - missionStartTime) / 1000);
    
    // Check minimum duration
    if (actualDuration < MISSION_MIN_DURATION) {
      alert(`Please complete at least ${MISSION_MIN_DURATION} seconds of the activity.`);
      return;
    }

    activeMission.duration = actualDuration;

    // Show feeling check
    const progressDiv = missionModal.querySelector('#prompt-mission-progress');
    const feelingDiv = missionModal.querySelector('#prompt-mission-feeling');

    if (progressDiv) progressDiv.style.display = 'none';
    if (feelingDiv) feelingDiv.style.display = 'block';
  }

  // Complete mission with feeling
  function completeMission(feeling) {
    if (!activeMission || activeMission.completed) return;

    activeMission.completed = true;
    activeMission.feeling = feeling;

    // Record completion
    window.PromptVault.recordMissionCompletion(
      activeMission.promptId,
      activeMission.activityType,
      activeMission.duration
    );

    // Show success
    showMissionSuccess();
  }

  // Show mission success
  function showMissionSuccess() {
    const feelingDiv = missionModal.querySelector('#prompt-mission-feeling');
    const successDiv = missionModal.querySelector('#prompt-mission-success');
    const inkEarned = missionModal.querySelector('#prompt-mission-ink-earned');

    if (feelingDiv) feelingDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'block';
    if (inkEarned) {
      inkEarned.textContent = window.PromptVault.PROMPT_INK_PER_MISSION;
    }

    // Trigger success animation
    if (successDiv) {
      successDiv.classList.add('animate-in');
    }

    // Remove activity listeners
    window.removeEventListener('breathing-session-complete', handleActivityComplete);
    window.removeEventListener('focus-game-complete', handleActivityComplete);
  }

  // Show unlocked prompt (no mission required)
  function showUnlockedPrompt(promptId) {
    const prompt = window.PromptVault.getPrompt(promptId);
    if (!prompt) return;

    // Create a simple unlock notification or directly allow copying
    if (missionModal) {
      const promptInfo = missionModal.querySelector('#prompt-mission-prompt-info');
      const activityDiv = missionModal.querySelector('#prompt-mission-activity');
      const successDiv = missionModal.querySelector('#prompt-mission-success');

      if (promptInfo) {
        promptInfo.innerHTML = `
          <h3>${prompt.title}</h3>
          <p>${prompt.purpose}</p>
          <div class="prompt-unlocked-badge">✨ Unlocked</div>
        `;
      }

      if (activityDiv) activityDiv.style.display = 'none';
      if (successDiv) {
        successDiv.style.display = 'block';
        successDiv.querySelector('h3').textContent = 'Prompt Ready';
        successDiv.querySelector('p').textContent = 'This prompt is available for you to use';
      }

      missionModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      activeMission = { promptId, completed: true };
    }
  }

  // Copy prompt to clipboard (tracks but doesn't reward)
  function copyPromptToClipboard(promptId) {
    if (!window.PromptVault) return;

    // Record copy (for tracking, no points - completion is what earns points)
    window.PromptVault.recordPromptCopy(promptId);

    const personalizedText = window.PromptVault.getPersonalizedPrompt(promptId);
    if (!personalizedText) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(personalizedText).then(() => {
        // Show feedback
        const copyBtn = missionModal.querySelector('.copy-prompt-btn');
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = '✓ Copied!';
          copyBtn.style.background = 'var(--zone-green, #7FB285)';
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
          }, 2000);
        }
      }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please try selecting and copying manually.');
      });
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = personalizedText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Prompt copied to clipboard!');
      } catch (err) {
        alert('Please copy manually: ' + personalizedText.substring(0, 50) + '...');
      }
      document.body.removeChild(textArea);
    }
  }

  // Close mission
  function closeMission() {
    if (missionTimer) {
      clearInterval(missionTimer);
      missionTimer = null;
    }

    if (missionModal) {
      missionModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    activeMission = null;
    missionStartTime = null;

    // Remove listeners
    window.removeEventListener('breathing-session-complete', handleActivityComplete);
    window.removeEventListener('focus-game-complete', handleActivityComplete);
  }

  // Update progress timer
  function updateProgressTimer(seconds) {
    const timeEl = missionModal?.querySelector('#prompt-mission-time');
    if (timeEl) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  }

  // Update progress bar
  function updateProgressBar(percent) {
    const fillEl = missionModal?.querySelector('#prompt-mission-progress-fill');
    if (fillEl) {
      fillEl.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    }
  }

  // Setup activity listeners for integration
  function setupActivityListeners() {
    // Listen for breathing session completion
    window.addEventListener('breathing-session-complete', (event) => {
      if (activeMission && activeMission.activityType === 'breathing') {
        handleActivityComplete(event);
      }
    });

    // Listen for focus game completion
    window.addEventListener('focus-game-complete', (event) => {
      if (activeMission && activeMission.activityType === 'focus-game') {
        handleActivityComplete(event);
      }
    });
  }

  // Public API
  window.PromptMissions = {
    init,
    showMission,
    showUnlockedPrompt,
    closeMission,
    isMissionActive: () => activeMission !== null,
    getActiveMission: () => activeMission ? { ...activeMission } : null
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

