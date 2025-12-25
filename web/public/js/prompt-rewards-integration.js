// =============================================
// PROMPT REWARDS INTEGRATION
// Integrates Prompt Ink with the rewards/coupons system
// =============================================

(function() {
  'use strict';

  // Prompt Ink -> Coupon/Experience unlocks
  const PROMPT_INK_UNLOCKS = {
    'focus-garden-booster': {
      inkCost: 50,
      type: 'experience',
      description: 'Focus Garden Booster - Enhanced experience',
      trigger: () => {
        // Navigate to focus garden with enhanced features
        if (window.location.pathname.includes('focus-garden')) {
          // Enable enhanced features
          document.body.setAttribute('data-enhanced', 'true');
        } else {
          window.location.href = 'focus-garden.html?enhanced=true';
        }
      }
    },
    'family-calm-plan': {
      inkCost: 75,
      type: 'template',
      description: 'Family Calm Plan template',
      trigger: () => {
        // Could open a template or download
        alert('Family Calm Plan template unlocked! This feature will be available soon.');
      }
    },
    'teacher-classroom-script': {
      inkCost: 60,
      type: 'context-pack',
      description: 'Teacher Classroom Script context pack',
      trigger: () => {
        if (window.PromptVault) {
          // Unlock teacher context packs for all prompts
          const prompts = window.PROMPT_VAULT_DATA?.prompts || [];
          prompts.forEach(prompt => {
            if (prompt.contextPacks && prompt.contextPacks.teacher) {
              window.PromptVault.unlockContextPack(prompt.id, 'teacher');
            }
          });
          alert('Teacher Classroom Script context packs unlocked! All prompts now have teacher variants.');
        }
      }
    },
    'parent-bedtime-script': {
      inkCost: 60,
      type: 'context-pack',
      description: 'Parent Bedtime Script context pack',
      trigger: () => {
        if (window.PromptVault) {
          const prompts = window.PROMPT_VAULT_DATA?.prompts || [];
          prompts.forEach(prompt => {
            if (prompt.contextPacks && prompt.contextPacks.parent) {
              window.PromptVault.unlockContextPack(prompt.id, 'parent');
            }
          });
          alert('Parent Bedtime Script context packs unlocked! All prompts now have parent variants.');
        }
      }
    },
    'printable-mini-cards': {
      inkCost: 100,
      type: 'download',
      description: 'Printable Mini-Cards Collection',
      trigger: () => {
        // Could generate and download printable cards
        alert('Printable Mini-Cards Collection unlocked! This feature will be available soon.');
      }
    }
  };

  // Weekly challenge definitions
  const WEEKLY_CHALLENGES = {
    'calm-resets-5': {
      id: 'calm-resets-5',
      name: '5 Calm Resets',
      description: 'Complete 5 calm resets this week',
      requirement: {
        type: 'mission-completions',
        activityType: 'breathing',
        count: 5,
        timeframe: 'week'
      },
      reward: {
        ink: 25,
        unlock: 'focus-garden-booster'
      }
    },
    'parent-regulation-3': {
      id: 'parent-regulation-3',
      name: '3 Parent Regulation Missions',
      description: 'Complete 3 parent-focused regulation missions',
      requirement: {
        type: 'mission-completions',
        role: 'parent',
        count: 3,
        timeframe: 'week'
      },
      reward: {
        ink: 30,
        unlock: 'family-calm-plan'
      }
    },
    'focus-sessions-7': {
      id: 'focus-sessions-7',
      name: '7 Focus Sessions',
      description: 'Complete 7 focus game sessions this week',
      requirement: {
        type: 'mission-completions',
        activityType: 'focus-game',
        count: 7,
        timeframe: 'week'
      },
      reward: {
        ink: 35,
        unlock: 'focus-garden-booster'
      }
    }
  };

  // Initialize integration
  function init() {
    if (!window.PromptVault) {
      console.error('Prompt Rewards Integration: PromptVault not found');
      return;
    }

    // Check weekly challenges
    checkWeeklyChallenges();

    // Listen for mission completions
    window.addEventListener('prompt-vault:state-change', () => {
      checkWeeklyChallenges();
    });
  }

  // Check weekly challenge progress
  function checkWeeklyChallenges() {
    if (!window.PromptVault) return;

    const state = window.PromptVault.getState();
    const now = new Date();
    const weekStart = getWeekStart(now);

    Object.values(WEEKLY_CHALLENGES).forEach(challenge => {
      const progress = getChallengeProgress(challenge, weekStart);
      
      if (progress.completed && !progress.claimed) {
        // Award reward
        awardChallengeReward(challenge);
      }
    });
  }

  // Get challenge progress
  function getChallengeProgress(challenge, weekStart) {
    if (!window.PromptVault) return { completed: false, progress: 0, claimed: false };

    const state = window.PromptVault.getState();
    const req = challenge.requirement;

    // Get missions from this week
    const weekMissions = state.missionHistory.filter(mission => {
      const missionDate = new Date(mission.timestamp);
      return missionDate >= weekStart;
    });

    let progress = 0;
    let completed = false;

    switch (req.type) {
      case 'mission-completions':
        const matchingMissions = weekMissions.filter(mission => {
          if (req.activityType && mission.activityType !== req.activityType) return false;
          // Could check role if stored in mission
          return true;
        });
        progress = matchingMissions.length;
        completed = progress >= req.count;
        break;
    }

    // Check if already claimed (stored in state)
    const claimedKey = `challenge_${challenge.id}_${weekStart.toISOString()}`;
    const claimed = state.challengeRewards?.includes(claimedKey) || false;

    return { completed, progress, claimed, total: req.count };
  }

  // Award challenge reward
  function awardChallengeReward(challenge) {
    if (!window.PromptVault) return;

    const state = window.PromptVault.getState();
    const now = new Date();
    const weekStart = getWeekStart(now);
    const claimedKey = `challenge_${challenge.id}_${weekStart.toISOString()}`;

    // Mark as claimed
    if (!state.challengeRewards) state.challengeRewards = [];
    if (!state.challengeRewards.includes(claimedKey)) {
      state.challengeRewards.push(claimedKey);
    }

    // Award Prompt Ink
    if (challenge.reward.ink) {
      window.PromptVault.addPromptInk(challenge.reward.ink, `weekly-challenge-${challenge.id}`);
    }

    // Unlock experience if specified
    if (challenge.reward.unlock) {
      unlockExperience(challenge.reward.unlock);
    }

    // Save state
    localStorage.setItem('nb_prompt_vault_v1', JSON.stringify(state));

    // Show notification
    showChallengeRewardNotification(challenge);
  }

  // Unlock experience/coupon
  function unlockExperience(unlockId) {
    const unlock = PROMPT_INK_UNLOCKS[unlockId];
    if (!unlock) return false;

    // Could store unlocked experiences in state
    if (window.PromptVault) {
      const state = window.PromptVault.getState();
      if (!state.unlockedExperiences) state.unlockedExperiences = [];
      if (!state.unlockedExperiences.includes(unlockId)) {
        state.unlockedExperiences.push(unlockId);
        localStorage.setItem('nb_prompt_vault_v1', JSON.stringify(state));
      }
    }

    return true;
  }

  // Check if experience is unlocked
  function isExperienceUnlocked(unlockId) {
    if (!window.PromptVault) return false;
    const state = window.PromptVault.getState();
    return state.unlockedExperiences?.includes(unlockId) || false;
  }

  // Spend Prompt Ink to unlock
  function spendInkToUnlock(unlockId) {
    if (!window.PromptVault) return false;

    const unlock = PROMPT_INK_UNLOCKS[unlockId];
    if (!unlock) return false;

    const currentInk = window.PromptVault.getPromptInk();
    if (currentInk < unlock.inkCost) {
      alert(`You need ${unlock.inkCost} Prompt Ink to unlock this. You have ${currentInk}.`);
      return false;
    }

    if (window.PromptVault.spendPromptInk(unlock.inkCost)) {
      unlockExperience(unlockId);
      if (unlock.trigger) unlock.trigger();
      return true;
    }

    return false;
  }

  // Get week start (Monday)
  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(d.setDate(diff));
  }

  // Show challenge reward notification
  function showChallengeRewardNotification(challenge) {
    // Simple alert for now - could be a nice toast notification
    const message = `🎉 Weekly Challenge Complete!\n\n` +
      `${challenge.name}\n` +
      `Reward: ${challenge.reward.ink} Prompt Ink` +
      (challenge.reward.unlock ? ` + ${PROMPT_INK_UNLOCKS[challenge.reward.unlock]?.description}` : '');
    
    // Could use a toast notification library here
    alert(message);
  }

  // Get available unlocks
  function getAvailableUnlocks() {
    return Object.entries(PROMPT_INK_UNLOCKS).map(([id, unlock]) => {
      const unlocked = isExperienceUnlocked(id);
      return {
        id,
        ...unlock,
        unlocked
      };
    });
  }

  // Get weekly challenges
  function getWeeklyChallenges() {
    return Object.values(WEEKLY_CHALLENGES).map(challenge => {
      const now = new Date();
      const weekStart = getWeekStart(now);
      const progress = getChallengeProgress(challenge, weekStart);
      return {
        ...challenge,
        progress: progress.progress,
        total: progress.total,
        completed: progress.completed,
        claimed: progress.claimed
      };
    });
  }

  // Public API
  window.PromptRewardsIntegration = {
    init,
    getAvailableUnlocks,
    getWeeklyChallenges,
    spendInkToUnlock,
    isExperienceUnlocked,
    PROMPT_INK_UNLOCKS,
    WEEKLY_CHALLENGES
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
})();

