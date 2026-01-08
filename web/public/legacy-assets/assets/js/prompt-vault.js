// =============================================
// PROMPT VAULT CORE SYSTEM
// Manages prompt objects, unlocks, personalization, and state
// =============================================

(function() {
  'use strict';

  const STORAGE_KEY = 'nb_prompt_vault_v1';
  const PROMPT_INK_PER_MISSION = 10;
  const PROMPT_INK_PER_QUEST = 25;

  // Default user state
  const defaultState = {
    unlockedPrompts: [],
    promptInk: 0,
    currentRole: null, // 'parent', 'teacher', 'carer', 'professional'
    currentGoal: null, // 'calm', 'focus', 'sleep', 'conflict', 'overwhelm'
    completedMissions: [],
    dailyQuest: {
      date: null,
      promptId: null,
      completed: false,
      fallbackPromptId: null
    },
    streak: {
      days: 0,
      lastDate: null,
      protectedTokens: 0
    },
    unlockedVariants: {},
    unlockedContextPacks: {},
    printableCards: [],
    preferences: {
      lowStimulationMode: false,
      defaultVariant: 'medium', // 'short', 'medium', 'expert'
      autoPersonalize: true
    },
    missionHistory: []
  };

  let vaultState = null;

  // Load state from localStorage
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        vaultState = { ...defaultState, ...JSON.parse(saved) };
      } else {
        vaultState = { ...defaultState };
      }
      return vaultState;
    } catch (err) {
      console.warn('Prompt Vault: Error loading state', err);
      vaultState = { ...defaultState };
      return vaultState;
    }
  }

  // Save state to localStorage
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vaultState));
      broadcastStateChange();
    } catch (err) {
      console.warn('Prompt Vault: Error saving state', err);
    }
  }

  // Broadcast state change event
  function broadcastStateChange() {
    try {
      window.dispatchEvent(new CustomEvent('prompt-vault:state-change', {
        detail: { state: getState() }
      }));
    } catch (err) {
      // Ignore if CustomEvent not supported
    }
  }

  // Initialize
  function init() {
    if (!window.PROMPT_VAULT_DATA) {
      console.error('Prompt Vault: PROMPT_VAULT_DATA not found. Load prompt-vault-data.js first.');
      return;
    }
    loadState();
    updateStreak();
    generateDailyQuestIfNeeded();
  }

  // Get current state (read-only copy)
  function getState() {
    if (!vaultState) loadState();
    return JSON.parse(JSON.stringify(vaultState));
  }

  // Set user role
  function setRole(role) {
    if (!vaultState) loadState();
    if (['parent', 'teacher', 'carer', 'professional'].includes(role)) {
      vaultState.currentRole = role;
      saveState();
      return true;
    }
    return false;
  }

  // Set current goal/state
  function setGoal(goal) {
    if (!vaultState) loadState();
    if (['calm', 'focus', 'sleep', 'conflict', 'overwhelm'].includes(goal)) {
      vaultState.currentGoal = goal;
      saveState();
      return true;
    }
    return false;
  }

  // Get a prompt by ID
  function getPrompt(promptId) {
    if (!window.PROMPT_VAULT_DATA) return null;
    return window.PROMPT_VAULT_DATA.prompts.find(p => p.id === promptId) || null;
  }

  // Check if prompt is unlocked
  function isUnlocked(promptId) {
    if (!vaultState) loadState();
    return vaultState.unlockedPrompts.includes(promptId);
  }

  // Unlock a prompt
  function unlockPrompt(promptId) {
    if (!vaultState) loadState();
    if (!isUnlocked(promptId)) {
      vaultState.unlockedPrompts.push(promptId);
      saveState();
      return true;
    }
    return false;
  }

  // Get personalized prompt text
  function getPersonalizedPrompt(promptId, options = {}) {
    const prompt = getPrompt(promptId);
    if (!prompt) return null;

    const {
      variant = vaultState.preferences.defaultVariant || 'medium',
      role = vaultState.currentRole,
      useContextPack = vaultState.preferences.autoPersonalize
    } = options;

    let text = prompt.text;

    // Apply variant if available and unlocked
    if (prompt.variants && prompt.variants[variant]) {
      const variantUnlocked = isVariantUnlocked(promptId, variant);
      if (variantUnlocked) {
        text = prompt.variants[variant];
      }
    }

    // Apply context pack if available, unlocked, and role is set
    if (useContextPack && role && prompt.contextPacks && prompt.contextPacks[role]) {
      const packUnlocked = isContextPackUnlocked(promptId, role);
      if (packUnlocked) {
        text = prompt.contextPacks[role];
      }
    }

    return text;
  }

  // Check if variant is unlocked
  function isVariantUnlocked(promptId, variant) {
    if (!vaultState) loadState();
    return vaultState.unlockedVariants[promptId]?.includes(variant) || false;
  }

  // Unlock a variant
  function unlockVariant(promptId, variant) {
    if (!vaultState) loadState();
    if (!vaultState.unlockedVariants[promptId]) {
      vaultState.unlockedVariants[promptId] = [];
    }
    if (!vaultState.unlockedVariants[promptId].includes(variant)) {
      vaultState.unlockedVariants[promptId].push(variant);
      saveState();
      return true;
    }
    return false;
  }

  // Check if context pack is unlocked
  function isContextPackUnlocked(promptId, role) {
    if (!vaultState) loadState();
    return vaultState.unlockedContextPacks[promptId]?.includes(role) || false;
  }

  // Unlock a context pack
  function unlockContextPack(promptId, role) {
    if (!vaultState) loadState();
    if (!vaultState.unlockedContextPacks[promptId]) {
      vaultState.unlockedContextPacks[promptId] = [];
    }
    if (!vaultState.unlockedContextPacks[promptId].includes(role)) {
      vaultState.unlockedContextPacks[promptId].push(role);
      saveState();
      return true;
    }
    return false;
  }

  // Add Prompt Ink points
  function addPromptInk(amount, reason = '') {
    if (!vaultState) loadState();
    vaultState.promptInk += amount;
    saveState();
    return vaultState.promptInk;
  }

  // Get Prompt Ink balance
  function getPromptInk() {
    if (!vaultState) loadState();
    return vaultState.promptInk || 0;
  }

  // Spend Prompt Ink
  function spendPromptInk(amount) {
    if (!vaultState) loadState();
    if (vaultState.promptInk >= amount) {
      vaultState.promptInk -= amount;
      saveState();
      return true;
    }
    return false;
  }

  // Update streak
  function updateStreak() {
    if (!vaultState) loadState();
    const today = new Date().toDateString();
    const lastDate = vaultState.streak.lastDate ? new Date(vaultState.streak.lastDate).toDateString() : null;

    if (lastDate === today) {
      // Already counted today
      return vaultState.streak.days;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastDate === yesterdayStr) {
      // Continue streak
      vaultState.streak.days += 1;
    } else if (lastDate && vaultState.streak.protectedTokens > 0) {
      // Use streak protection
      vaultState.streak.protectedTokens -= 1;
      vaultState.streak.days += 1;
    } else {
      // Reset streak
      vaultState.streak.days = 1;
    }

    vaultState.streak.lastDate = new Date().toISOString();
    saveState();
    return vaultState.streak.days;
  }

  // Generate daily quest if needed
  function generateDailyQuestIfNeeded() {
    if (!vaultState) loadState();
    const today = new Date().toDateString();
    const questDate = vaultState.dailyQuest.date ? new Date(vaultState.dailyQuest.date).toDateString() : null;

    if (questDate === today && vaultState.dailyQuest.promptId) {
      // Quest already generated for today
      return vaultState.dailyQuest;
    }

    // Generate new daily quest
    const recommendedPrompt = getRecommendedPrompt();
    const fallbackPrompt = getFallbackPrompt();

    vaultState.dailyQuest = {
      date: new Date().toISOString(),
      promptId: recommendedPrompt ? recommendedPrompt.id : null,
      completed: false,
      fallbackPromptId: fallbackPrompt ? fallbackPrompt.id : null
    };

    saveState();
    return vaultState.dailyQuest;
  }

  // Get recommended prompt based on role and goal
  function getRecommendedPrompt() {
    if (!window.PROMPT_VAULT_DATA) return null;
    if (!vaultState) loadState();

    const prompts = window.PROMPT_VAULT_DATA.prompts.filter(p => {
      // Filter by role if set
      if (vaultState.currentRole && !p.roleTags.includes(vaultState.currentRole)) {
        return false;
      }
      // Filter by goal if set
      if (vaultState.currentGoal && !p.goalTags.includes(vaultState.currentGoal)) {
        return false;
      }
      // Prefer unlocked or starter tier prompts
      return isUnlocked(p.id) || p.versionTier === 'Starter';
    });

    if (prompts.length === 0) {
      // Fallback to any starter prompt
      return window.PROMPT_VAULT_DATA.prompts.find(p => p.versionTier === 'Starter') || null;
    }

    // Return random prompt from filtered list
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  // Get fallback prompt (low-energy option)
  function getFallbackPrompt() {
    if (!window.PROMPT_VAULT_DATA) return null;
    const starters = window.PROMPT_VAULT_DATA.prompts.filter(p => 
      p.versionTier === 'Starter' && p.timeCost <= 60
    );
    if (starters.length === 0) return null;
    return starters[Math.floor(Math.random() * starters.length)];
  }

  // Get daily quest
  function getDailyQuest() {
    if (!vaultState) loadState();
    generateDailyQuestIfNeeded();
    return { ...vaultState.dailyQuest };
  }

  // Complete daily quest
  function completeDailyQuest() {
    if (!vaultState) loadState();
    if (vaultState.dailyQuest.completed) return false;

    vaultState.dailyQuest.completed = true;
    addPromptInk(PROMPT_INK_PER_QUEST, 'daily-quest');
    updateStreak();

    // Unlock the prompt if not already unlocked
    if (vaultState.dailyQuest.promptId) {
      unlockPrompt(vaultState.dailyQuest.promptId);
    }

    saveState();
    return true;
  }

  // Get filtered prompts
  function getFilteredPrompts(filters = {}) {
    if (!window.PROMPT_VAULT_DATA) return [];

    let prompts = [...window.PROMPT_VAULT_DATA.prompts];

    // Filter by category
    if (filters.category) {
      prompts = prompts.filter(p => p.category === filters.category);
    }

    // Filter by role
    if (filters.role) {
      prompts = prompts.filter(p => p.roleTags.includes(filters.role));
    }

    // Filter by goal
    if (filters.goal) {
      prompts = prompts.filter(p => p.goalTags.includes(filters.goal));
    }

    // Filter by difficulty
    if (filters.difficulty) {
      prompts = prompts.filter(p => p.difficulty === filters.difficulty);
    }

    // Filter by tier
    if (filters.tier) {
      prompts = prompts.filter(p => p.versionTier === filters.tier);
    }

    // Filter by unlocked status
    if (filters.unlocked !== undefined) {
      prompts = prompts.filter(p => isUnlocked(p.id) === filters.unlocked);
    }

    return prompts;
  }

  // Get prompts for a specific activity
  function getPromptsForActivity(activityType) {
    if (!window.PROMPT_VAULT_DATA) return [];
    return window.PROMPT_VAULT_DATA.prompts.filter(p => 
      p.useWith && p.useWith.includes(activityType)
    );
  }

  // Toggle low stimulation mode
  function setLowStimulationMode(enabled) {
    if (!vaultState) loadState();
    vaultState.preferences.lowStimulationMode = enabled;
    saveState();
    return enabled;
  }

  // Get low stimulation mode
  function isLowStimulationMode() {
    if (!vaultState) loadState();
    return vaultState.preferences.lowStimulationMode || false;
  }

  // Add mission completion record
  function recordMissionCompletion(promptId, activityType, duration) {
    if (!vaultState) loadState();
    
    const completion = {
      promptId,
      activityType,
      duration,
      timestamp: new Date().toISOString()
    };

    vaultState.missionHistory.push(completion);
    
    // Keep only last 100 missions
    if (vaultState.missionHistory.length > 100) {
      vaultState.missionHistory = vaultState.missionHistory.slice(-100);
    }

    // Award Prompt Ink for mission completion (not for copying)
    // Mission completion = 10 points, Output saved = 5 points bonus
    addPromptInk(PROMPT_INK_PER_MISSION, `mission-${activityType}`);

    // Unlock prompt
    unlockPrompt(promptId);

    saveState();
    return completion;
  }

  // Record output save (earns bonus points)
  function recordOutputSave(promptId) {
    if (!vaultState) loadState();
    // Bonus points for saving output to Outcome Vault
    addPromptInk(5, 'output-saved');
    saveState();
    return true;
  }

  // Record prompt copy (minimal or zero points - just for tracking)
  function recordPromptCopy(promptId) {
    if (!vaultState) loadState();
    // Copying alone earns 0 points - must complete mission first
    // This is just for analytics/tracking
    if (!isUnlocked(promptId)) {
      // Prompt not unlocked - can't copy
      return false;
    }
    saveState();
    return true;
  }

  // Public API
  window.PromptVault = {
    init,
    getState,
    setRole,
    setGoal,
    getPrompt,
    isUnlocked,
    unlockPrompt,
    getPersonalizedPrompt,
    isVariantUnlocked,
    unlockVariant,
    isContextPackUnlocked,
    unlockContextPack,
    addPromptInk,
    getPromptInk,
    spendPromptInk,
    updateStreak,
    getDailyQuest,
    completeDailyQuest,
    getFilteredPrompts,
    getPromptsForActivity,
    setLowStimulationMode,
    isLowStimulationMode,
    recordMissionCompletion,
    recordOutputSave,
    recordPromptCopy,
    PROMPT_INK_PER_MISSION,
    PROMPT_INK_PER_QUEST
  };

  // Auto-initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

