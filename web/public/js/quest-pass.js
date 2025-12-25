/* =============================================
   NeuroBreath Quest Pass System
   ============================================= */

(function() {
  'use strict';

  const STORAGE_KEY = 'neurobreath_quest_pass';
  const STORAGE_PROGRESS = 'neurobreath_progress';
  const STORAGE_REWARDS = 'neurobreath_rewards';

  // Quest definitions
  const QUEST_TYPES = {
    breathing: {
      name: 'Breathing Session',
      icon: '🫁',
      points: 20,
      description: 'Complete a breathing exercise (1-5 minutes)'
    },
    miniGame: {
      name: 'Mini Game',
      icon: '🎮',
      points: 15,
      description: 'Play a focus or breathing mini-game'
    },
    promptTool: {
      name: 'Prompt Tool',
      icon: '💡',
      points: 30,
      description: 'Use a Coach Card prompt tool'
    },
    focus: {
      name: 'Focus Training',
      icon: '🎯',
      points: 25,
      description: 'Complete a focus training session'
    },
    reading: {
      name: 'Reading Practice',
      icon: '📖',
      points: 20,
      description: 'Complete a reading training session'
    },
    mindfulness: {
      name: 'Mindfulness',
      icon: '🧘',
      points: 20,
      description: 'Practice mindfulness (2-5 minutes)'
    }
  };

  // Role-based tracks
  const ROLE_TRACKS = {
    parent: 'Parent',
    teacher: 'Teacher',
    carer: 'Carer',
    adult: 'Adult',
    workplace: 'Workplace'
  };

  // Badge definitions
  const BADGES = {
    'regulation-rookie': { name: 'Regulation Rookie', icon: '🌱', description: 'Complete your first breathing session' },
    'calm-builder': { name: 'Calm Builder', icon: '🏗️', description: 'Complete 5 breathing sessions' },
    'steady-navigator': { name: 'Steady Navigator', icon: '🧭', description: 'Complete 10 sessions' },
    'resilience-pro': { name: 'Resilience Pro', icon: '💪', description: 'Complete 25 sessions' },
    'advocacy-ally': { name: 'Advocacy Ally', icon: '🤝', description: 'Use Persuasion Artist + EHCP Evidence Builder' },
    'classroom-calm-captain': { name: 'Classroom Calm Captain', icon: '👩‍🏫', description: 'Complete 3 teacher tools' },
    'sleep-restorer': { name: 'Sleep Restorer', icon: '😴', description: '7-day sleep tools streak' },
    'focus-gardener': { name: 'Focus Gardener', icon: '🌱', description: 'Focus-garden milestones' },
    'crisis-ready': { name: 'Crisis Ready', icon: '🆘', description: 'SOS-60 + panic tools completion' },
    'structure-builder': { name: 'Structure Builder', icon: '🏗️', description: 'Create 3 visual routines' },
    'confidence-builder': { name: 'Confidence Builder', icon: '⭐', description: 'Complete reading sessions' }
  };

  // Coupon definitions
  const COUPONS = {
    'calm-checkout': { name: 'Calm Checkout', points: 100, description: 'Redeem for premium breathing pack' },
    'focus-fuel-voucher': { name: 'Focus Fuel Voucher', points: 150, description: 'Unlock advanced focus tools' },
    'teacher-time-saver-token': { name: 'Teacher Time-Saver Token', points: 200, description: 'Access premium teacher tools' },
    'parent-peace-pass': { name: 'Parent Peace Pass', points: 150, description: 'Unlock parent support resources' },
    'workday-reset-coupon': { name: 'Workday Reset Coupon', points: 120, description: 'Access workplace tools' },
    'sleep-onset-booster': { name: 'Sleep Onset Booster', points: 100, description: 'Unlock sleep tools pack' },
    'advocacy-power-credit': { name: 'Advocacy Power Credit', points: 250, description: 'EHCP evidence templates + letter builder' },
    'sensory-safe-mode-upgrade': { name: 'Sensory-Safe Mode Upgrade', points: 180, description: 'Low-stim UI pack + reduced animations' },
    'printable-pack-voucher': { name: 'Printable Pack Voucher', points: 150, description: 'Download bundles' },
    'community-kudos-credit': { name: 'Community Kudos Credit', points: 200, description: 'Future community perks' }
  };

  // Quest Pass State
  let questPassState = {
    currentQuests: [],
    completedQuests: [],
    points: 0,
    streak: 0,
    lastActivityDate: null,
    pauseTokens: 1,
    role: 'adult',
    badges: [],
    redeemedCoupons: []
  };

  // Initialize
  function init() {
    loadState();
    generateDailyQuests();
    updateQuestPassPill();
    setupEventListeners();
  }

  // Load state from localStorage
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        questPassState = { ...questPassState, ...parsed };
      }

      // Load progress for points calculation
      const progress = localStorage.getItem(STORAGE_PROGRESS);
      if (progress) {
        const parsed = JSON.parse(progress);
        if (parsed.points !== undefined) {
          questPassState.points = parsed.points;
        }
        if (parsed.streak !== undefined) {
          questPassState.streak = parsed.streak;
        }
      }

      // Sync with rewards system if available
      syncWithRewardsSystem();
    } catch (e) {
      console.warn('Failed to load quest pass state:', e);
    }
  }

  // Sync points with rewards system
  function syncWithRewardsSystem() {
    if (window.NeuroBreathRewards && typeof window.NeuroBreathRewards.getState === 'function') {
      try {
        const rewardsState = window.NeuroBreathRewards.getState();
        if (rewardsState && rewardsState.availablePoints !== undefined) {
          // Use rewards system points as the source of truth, but keep quest-specific points separate
          // Quest pass points are for daily quest completion, rewards points are for overall progress
          // We can display both or combine them - for now, we'll keep them separate but show rewards points in UI
          questPassState.rewardsPoints = rewardsState.availablePoints;
        }
      } catch (e) {
        // Silently fail if rewards system not ready
      }
    }
  }

  // Save state to localStorage
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questPassState));
    } catch (e) {
      console.warn('Failed to save quest pass state:', e);
    }
  }

  // Generate daily quests (3 rotating tasks)
  function generateDailyQuests() {
    const today = new Date().toDateString();
    const lastQuestDate = questPassState.lastQuestDate;

    // If quests already generated today, don't regenerate
    if (lastQuestDate === today && questPassState.currentQuests.length > 0) {
      return;
    }

    // Reset completed quests if new day
    if (lastQuestDate !== today) {
      questPassState.completedQuests = [];
      questPassState.lastQuestDate = today;
    }

    // Generate 3 random quests
    const questTypes = Object.keys(QUEST_TYPES);
    const selected = [];
    const used = new Set();

    while (selected.length < 3 && selected.length < questTypes.length) {
      const randomIndex = Math.floor(Math.random() * questTypes.length);
      const type = questTypes[randomIndex];
      
      if (!used.has(type)) {
        used.add(type);
        selected.push({
          id: `quest-${Date.now()}-${selected.length}`,
          type: type,
          ...QUEST_TYPES[type],
          completed: false
        });
      }
    }

    questPassState.currentQuests = selected;
    saveState();
  }

  // Update Quest Pass pill in header
  function updateQuestPassPill() {
    const pill = document.querySelector('.nb-quest-pass-pill');
    if (!pill) return;

    // Sync with rewards system before updating
    syncWithRewardsSystem();

    // Use rewards points if available, otherwise use quest pass points
    const displayPoints = questPassState.rewardsPoints !== undefined 
      ? questPassState.rewardsPoints 
      : questPassState.points;

    const pointsEl = pill.querySelector('.nb-quest-pass-pill__points');
    if (pointsEl) {
      pointsEl.textContent = `${displayPoints} pts`;
    }

    const completedCount = questPassState.currentQuests.filter(q => q.completed).length;
    const totalCount = questPassState.currentQuests.length;
    const questsText = pill.querySelector('.nb-quest-pass-pill__quests');
    if (questsText) {
      questsText.textContent = `${completedCount}/${totalCount} quests`;
    }
  }

  // Complete a quest
  function completeQuest(questId, questType) {
    const quest = questPassState.currentQuests.find(q => q.id === questId || q.type === questType);
    if (!quest || quest.completed) return false;

    quest.completed = true;
    questPassState.completedQuests.push(quest.id);
    questPassState.points += quest.points || 20;
    questPassState.lastActivityDate = new Date().toDateString();

    // Update streak
    updateStreak();

    // Check for badge unlocks
    checkBadgeUnlocks();

    saveState();
    updateQuestPassPill();
    return true;
  }

  // Update streak
  function updateStreak() {
    const today = new Date().toDateString();
    const lastActivity = questPassState.lastActivityDate;

    if (lastActivity === today) {
      // Check if we should increment streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (questPassState.lastStreakDate === yesterdayStr) {
        // Continuing streak
        questPassState.streak += 1;
      } else if (questPassState.lastStreakDate !== today) {
        // New streak
        questPassState.streak = 1;
      }

      questPassState.lastStreakDate = today;
    }
  }

  // Check for badge unlocks
  function checkBadgeUnlocks() {
    const totalSessions = questPassState.completedQuests.length;

    if (totalSessions >= 1 && !questPassState.badges.includes('regulation-rookie')) {
      unlockBadge('regulation-rookie');
    }
    if (totalSessions >= 5 && !questPassState.badges.includes('calm-builder')) {
      unlockBadge('calm-builder');
    }
    if (totalSessions >= 10 && !questPassState.badges.includes('steady-navigator')) {
      unlockBadge('steady-navigator');
    }
    if (totalSessions >= 25 && !questPassState.badges.includes('resilience-pro')) {
      unlockBadge('resilience-pro');
    }
  }

  // Unlock a badge
  function unlockBadge(badgeId) {
    if (questPassState.badges.includes(badgeId)) return;

    questPassState.badges.push(badgeId);
    saveState();

    // Dispatch event for UI updates
    document.dispatchEvent(new CustomEvent('badgeUnlocked', {
      detail: { badgeId, badge: BADGES[badgeId] }
    }));

    // Show notification
    showNotification(`Badge unlocked: ${BADGES[badgeId].name} ${BADGES[badgeId].icon}`);
  }

  // Show notification
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'nb-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-white);
      border: 2px solid var(--color-sage);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-lg);
      z-index: 10001;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Setup event listeners
  function setupEventListeners() {
    // Quest Pass pill click
    const pill = document.querySelector('.nb-quest-pass-pill');
    if (pill) {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        showQuestModal();
      });
    }

    // Listen for rewards system updates
    window.addEventListener('nb:rewards-update', () => {
      syncWithRewardsSystem();
      updateQuestPassPill();
    });

    // Quick Win button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-quest="quickwin"] .nb-btn--primary, [data-quest="quickwin"] button')) {
        const quickwin = e.target.closest('.nb-quickwin');
        if (quickwin) {
          const questType = quickwin.dataset.questType || 'promptTool';
          completeQuest(null, questType);
        }
      }
    });

    // Listen for activity completion events
    document.addEventListener('breathingSessionComplete', (e) => {
      completeQuest(null, 'breathing');
    });

    document.addEventListener('focusSessionComplete', (e) => {
      completeQuest(null, 'focus');
    });

    document.addEventListener('gameComplete', (e) => {
      completeQuest(null, 'miniGame');
    });

    // Listen for reading session completion (dyslexia training)
    document.addEventListener('readingSessionComplete', (e) => {
      const detail = e.detail || {};
      // Only complete if session was meaningful (at least 1 minute)
      if (detail.minutes >= 1) {
        completeQuest(null, 'reading');
        
        // Also trigger rewards system if available
        if (window.NeuroBreathRewards && typeof window.NeuroBreathRewards.getState === 'function') {
          // The rewards system will automatically update from storage changes
          // But we can also explicitly trigger an update
          window.dispatchEvent(new CustomEvent('nb:rewards-update', { 
            detail: { reason: 'reading_session', minutes: detail.minutes } 
          }));
        }
      }
    });
  }

  // Show quest modal
  function showQuestModal() {
    const modal = document.getElementById('nb-quest-modal');
    if (!modal) {
      createQuestModal();
      return;
    }

    modal.classList.add('active');
    renderQuestList();
  }

  // Create quest modal
  function createQuestModal() {
    const modal = document.createElement('div');
    modal.id = 'nb-quest-modal';
    modal.className = 'nb-quest-pass-modal';
    modal.innerHTML = `
      <div class="nb-quest-pass-modal__content">
        <button class="nb-quest-pass-modal__close" aria-label="Close">&times;</button>
        <h2 class="nb-quest-pass-modal__title">Today's Quest Pass</h2>
        <p class="nb-quest-pass-modal__subtitle">Complete 3 quests to earn points and unlock rewards</p>
        <ul class="nb-quest-list" id="nb-quest-list"></ul>
        <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-sage-light);">
          <p><strong>Your Points:</strong> <span id="nb-modal-points">${questPassState.points}</span></p>
          <p><strong>Current Streak:</strong> <span id="nb-modal-streak">${questPassState.streak}</span> days</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close button
    modal.querySelector('.nb-quest-pass-modal__close').addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    renderQuestList();
  }

  // Render quest list
  function renderQuestList() {
    const list = document.getElementById('nb-quest-list');
    if (!list) return;

    list.innerHTML = questPassState.currentQuests.map(quest => `
      <li class="nb-quest-item ${quest.completed ? 'completed' : ''}">
        <span class="nb-quest-item__icon">${quest.icon}</span>
        <div class="nb-quest-item__content">
          <div class="nb-quest-item__title">${quest.name}</div>
          <div class="nb-quest-item__description">${quest.description}</div>
        </div>
        <span class="nb-quest-item__points">+${quest.points}</span>
        ${quest.completed ? '<span class="nb-quest-item__check">✓</span>' : ''}
      </li>
    `).join('');

    // Update points and streak in modal
    const pointsEl = document.getElementById('nb-modal-points');
    const streakEl = document.getElementById('nb-modal-streak');
    if (pointsEl) pointsEl.textContent = questPassState.points;
    if (streakEl) streakEl.textContent = questPassState.streak;
  }

  // Public API
  window.NeuroBreathQuestPass = {
    completeQuest,
    getPoints: () => questPassState.points,
    getStreak: () => questPassState.streak,
    getBadges: () => questPassState.badges,
    getCurrentQuests: () => questPassState.currentQuests,
    unlockBadge,
    redeemCoupon: (couponId) => {
      const coupon = COUPONS[couponId];
      if (!coupon) return false;
      if (questPassState.points < coupon.points) return false;
      if (questPassState.redeemedCoupons.includes(couponId)) return false;

      questPassState.points -= coupon.points;
      questPassState.redeemedCoupons.push(couponId);
      saveState();
      updateQuestPassPill();
      return true;
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

