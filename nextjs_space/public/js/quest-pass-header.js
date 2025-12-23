/* =============================================
   Inject Quest Pass Pill into Header
   ============================================= */

(function() {
  'use strict';

  function injectQuestPassPill() {
    const header = document.querySelector('.site-header .navbar');
    if (!header) return;

    // Check if already injected
    if (header.querySelector('.nb-quest-pass-pill')) return;

    const navToggle = header.querySelector('.nav-toggle');
    const pill = document.createElement('a');
    pill.href = '#';
    pill.className = 'nb-quest-pass-pill';
    pill.id = 'questPassPill';
    pill.innerHTML = `
      <span class="nb-quest-pass-pill__icon">🎯</span>
      <span class="nb-quest-pass-pill__quests">0/3 quests</span>
      <span class="nb-quest-pass-pill__points">0 pts</span>
    `;

    // Insert before nav toggle
    if (navToggle) {
      header.insertBefore(pill, navToggle);
    } else {
      header.appendChild(pill);
    }

    // Update pill when quest pass is ready
    if (window.NeuroBreathQuestPass) {
      updatePill();
    } else {
      // Wait for quest pass to load
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(updatePill, 500);
      });
    }
  }

  function updatePill() {
    const pill = document.getElementById('questPassPill');
    if (!pill) return;

    let points = 0;
    let completed = 0;
    let total = 0;

    // Get points from quest pass or rewards system
    if (window.NeuroBreathQuestPass) {
      points = window.NeuroBreathQuestPass.getPoints();
      const quests = window.NeuroBreathQuestPass.getCurrentQuests();
      completed = quests.filter(q => q.completed).length;
      total = quests.length;
    }

    // Prefer rewards system points if available (more comprehensive)
    if (window.NeuroBreathRewards && typeof window.NeuroBreathRewards.getState === 'function') {
      try {
        const rewardsState = window.NeuroBreathRewards.getState();
        if (rewardsState && rewardsState.availablePoints !== undefined) {
          points = rewardsState.availablePoints;
        }
      } catch (e) {
        // Fall back to quest pass points
      }
    }

    const pointsEl = pill.querySelector('.nb-quest-pass-pill__points');
    const questsEl = pill.querySelector('.nb-quest-pass-pill__quests');

    if (pointsEl) pointsEl.textContent = `${points} pts`;
    if (questsEl) {
      if (total > 0) {
        questsEl.textContent = `${completed}/${total} quests`;
      } else {
        questsEl.textContent = '0/3 quests';
      }
    }

    pill.classList.add('visible');
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectQuestPassPill);
  } else {
    injectQuestPassPill();
  }

  // Update periodically
  setInterval(updatePill, 2000);

  // Listen for rewards system updates
  window.addEventListener('nb:rewards-update', updatePill);
  window.addEventListener('badgeUnlocked', updatePill);
})();

