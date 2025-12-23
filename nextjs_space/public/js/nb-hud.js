// =============================================
// NEUROBREATH HUD RENDERER
// Renders the unified store data into the HUD UI
// =============================================

(function() {
  'use strict';

  // Escape HTML
  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = String(s);
    return div.innerHTML;
  }

  // Render HUD
  function nbRenderHud() {
    if (!window.NBStore) {
      console.error('NB HUD: NBStore not found');
      return;
    }

    const store = window.NBStore.load();

    // Update stats
    const xpEl = document.getElementById('nbXp');
    const coinsEl = document.getElementById('nbCoins');
    const streakEl = document.getElementById('nbStreak');
    
    if (xpEl) xpEl.textContent = store.economy.xp || 0;
    if (coinsEl) coinsEl.textContent = store.economy.coins || 0;
    if (streakEl) streakEl.textContent = store.economy.streak?.count || 0;

    // Update daily mission
    const missionId = store.missions.daily?.activeMissionIds?.[0];
    const tpl = missionId ? store.missions.templates[missionId] : null;

    const titleEl = document.getElementById('nbDailyTitle');
    const progTextEl = document.getElementById('nbDailyProgressText');
    const barEl = document.getElementById('nbDailyBar');
    const claimBtn = document.getElementById('nbDailyClaim');
    const rewardEl = document.getElementById('nbDailyRewardText');

    if (tpl && titleEl && progTextEl && barEl && claimBtn && rewardEl) {
      const p = store.missions.daily.progress?.[missionId] || 0;
      const goal = tpl.goal || 1;
      const pct = Math.min(100, Math.round((p / goal) * 100));

      titleEl.textContent = tpl.title;
      progTextEl.textContent = `${Math.min(p, goal)}/${goal}`;
      barEl.style.width = pct + '%';
      rewardEl.textContent = `Reward: +${tpl.reward?.xp || 0} XP, +${tpl.reward?.coins || 0} coins`;

      const completed = p >= goal;
      const claimed = !!store.missions.daily.claimed?.[missionId];
      claimBtn.disabled = !(completed && !claimed);
      
      if (claimed) {
        claimBtn.textContent = 'Claimed';
        claimBtn.classList.add('claimed');
      } else {
        claimBtn.textContent = 'Claim';
        claimBtn.classList.remove('claimed');
      }
    } else if (titleEl) {
      // No mission available
      titleEl.textContent = 'No mission today';
      if (progTextEl) progTextEl.textContent = '';
      if (barEl) barEl.style.width = '0%';
      if (claimBtn) claimBtn.disabled = true;
      if (rewardEl) rewardEl.textContent = '';
    }

    // Update vault mini list
    const mini = document.getElementById('nbVaultMiniList');
    if (mini) {
      const outcomes = Object.values(store.vault.outcomes || {})
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
        .slice(0, 3);

      if (outcomes.length > 0) {
        mini.innerHTML = outcomes.map(o => `
          <div class="nb-vault-item">
            <strong>${escapeHtml(o.title || 'Untitled')}</strong>
            <div class="muted">${escapeHtml((o.tags || []).join(', ') || 'No tags')}</div>
          </div>
        `).join('');
      } else {
        mini.innerHTML = '<p class="muted">No saved outcomes yet.</p>';
      }
    }
  }

  // Setup claim button
  function setupClaimButton() {
    const claimBtn = document.getElementById('nbDailyClaim');
    if (claimBtn && !claimBtn.dataset.listenerAdded) {
      claimBtn.dataset.listenerAdded = 'true';
      claimBtn.addEventListener('click', () => {
        if (!window.NBStore) return;
        
        const store = window.NBStore.load();
        const missionId = store.missions.daily?.activeMissionIds?.[0];
        if (!missionId) return;

        const claimed = window.NBStore.claimMission(missionId);
        if (claimed) {
          nbRenderHud();
          
          // Show notification
          if (window.showNotification) {
            const tpl = store.missions.templates[missionId];
            window.showNotification(`Mission complete! +${tpl.reward?.xp || 0} XP, +${tpl.reward?.coins || 0} coins`);
          }
        }
      });
    }
  }

  // Setup shuffle button (future: generate new mission)
  function setupShuffleButton() {
    const shuffleBtn = document.getElementById('nbDailyShuffle');
    if (shuffleBtn && !shuffleBtn.dataset.listenerAdded) {
      shuffleBtn.dataset.listenerAdded = 'true';
      shuffleBtn.addEventListener('click', () => {
        // For now, just show a message
        alert('New mission feature coming soon! Complete today\'s mission to unlock new challenges.');
      });
    }
  }

  // Setup vault button
  function setupVaultButton() {
    const vaultBtn = document.getElementById('nbOpenVault');
    if (vaultBtn && !vaultBtn.dataset.listenerAdded) {
      vaultBtn.dataset.listenerAdded = 'true';
      vaultBtn.addEventListener('click', () => {
        // Scroll to outcome vault section if it exists
        const vaultSection = document.getElementById('outcome-vault-section');
        if (vaultSection) {
          vaultSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Try to open outcome vault modal or navigate
          if (window.OutcomeVaultUI && window.OutcomeVaultUI.showVault) {
            window.OutcomeVaultUI.showVault();
          }
        }
      });
    }
  }

  // Initialize
  function init() {
    if (!window.NBStore) {
      console.error('NB HUD: NBStore not found, retrying...');
      setTimeout(init, 200);
      return;
    }

    nbRenderHud();
    setupClaimButton();
    setupShuffleButton();
    setupVaultButton();

    // Re-render on store updates
    window.addEventListener('nb-store:updated', nbRenderHud);
  }

  // Public API
  window.NBHUD = {
    render: nbRenderHud,
    init
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
})();

