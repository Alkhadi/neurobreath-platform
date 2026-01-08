// =============================================
// PROMPT VAULT INTEGRATION
// Integrates Prompt Vault system with existing HTML structure
// =============================================

(function() {
  'use strict';

  // Initialize integration
  function init() {
    if (!window.PromptVault || !window.PromptMissions) {
      console.error('Prompt Vault Integration: Required systems not loaded');
      return;
    }

    // Add daily quest section
    addDailyQuestSection();

    // Add Prompt Ink display to header
    addPromptInkDisplay();

    // Update existing prompt cards
    updatePromptCards();

    // Add role selector
    addRoleSelector();

    // Add low stimulation toggle
    addLowStimulationToggle();

    // Setup event listeners
    setupEventListeners();
  }

  // Add daily quest section
  function addDailyQuestSection() {
    const main = document.querySelector('main#main');
    if (!main) return;

    // Check if already added
    if (document.getElementById('daily-quest-section')) return;

    const quest = window.PromptVault.getDailyQuest();
    const prompt = quest.promptId ? window.PromptVault.getPrompt(quest.promptId) : null;
    const streak = window.PromptVault.getState().streak.days;

    const questSection = document.createElement('section');
    questSection.id = 'daily-quest-section';
    questSection.className = 'section';
    questSection.innerHTML = `
      <div class="page-container">
        <div class="daily-quest-card ${quest.completed ? 'completed' : ''}">
          <div class="daily-quest-header">
            <h2 class="daily-quest-title">🎯 Daily Prompt Quest</h2>
            <span class="daily-quest-streak">${streak} day streak</span>
          </div>
          ${prompt ? `
            <div class="daily-quest-prompt">
              <h4>${prompt.title}</h4>
              <p>${prompt.purpose}</p>
            </div>
            <div class="daily-quest-actions">
              <button class="daily-quest-btn ${quest.completed ? 'completed' : ''}" 
                      data-prompt-id="${prompt.id}" 
                      ${quest.completed ? 'disabled' : ''}>
                ${quest.completed ? '✓ Completed' : 'Start Mission'}
              </button>
              ${quest.fallbackPromptId ? `
                <button class="daily-quest-btn" data-prompt-id="${quest.fallbackPromptId}">
                  Low Energy Option
                </button>
              ` : ''}
            </div>
          ` : '<p>No quest available today</p>'}
        </div>
      </div>
    `;

    // Insert after hero section
    const heroSection = main.querySelector('.hero-section');
    if (heroSection && heroSection.nextSibling) {
      heroSection.parentNode.insertBefore(questSection, heroSection.nextSibling);
    } else if (heroSection) {
      heroSection.parentNode.appendChild(questSection);
    }

    // Add quest button listeners
    questSection.querySelectorAll('.daily-quest-btn').forEach(btn => {
      if (!btn.disabled) {
        btn.addEventListener('click', (e) => {
          const promptId = e.target.dataset.promptId;
          if (promptId) {
            window.PromptMissions.showMission(promptId);
          }
        });
      }
    });
  }

  // Add Prompt Ink display
  function addPromptInkDisplay() {
    const header = document.querySelector('.site-header .navbar');
    if (!header) return;

    // Check if already added
    if (document.getElementById('prompt-ink-display')) return;

    const inkDisplay = document.createElement('div');
    inkDisplay.id = 'prompt-ink-display';
    inkDisplay.className = 'prompt-ink-display';
    inkDisplay.innerHTML = `
      <span class="prompt-ink-icon">✨</span>
      <span class="prompt-ink-amount">${window.PromptVault.getPromptInk()}</span>
      <span>Prompt Ink</span>
    `;

    // Insert after brand
    const brand = header.querySelector('.brand');
    if (brand && brand.nextSibling) {
      brand.parentNode.insertBefore(inkDisplay, brand.nextSibling);
    }

    // Update on state change
    window.addEventListener('prompt-vault:state-change', () => {
      const amount = inkDisplay.querySelector('.prompt-ink-amount');
      if (amount) {
        amount.textContent = window.PromptVault.getPromptInk();
      }
    });
  }

  // Update existing prompt cards
  function updatePromptCards() {
    const cards = document.querySelectorAll('.prompt-card[data-card-id]');
    
    cards.forEach(card => {
      const cardId = card.getAttribute('data-card-id');
      if (!cardId) return;

      // Check if prompt exists in vault
      const prompt = window.PromptVault.getPrompt(cardId);
      
      // Even if prompt not in vault, we should still lock it
      // Only show mission button for prompts in vault
      if (!prompt) {
        // Lock cards not in vault system
        card.classList.add('locked-prompt-card');
        const promptBox = card.querySelector('.card-prompt-box');
        if (promptBox && !promptBox.nextElementSibling?.classList.contains('locked-placeholder')) {
          promptBox.style.display = 'none';
          const placeholder = document.createElement('div');
          placeholder.className = 'locked-placeholder';
          placeholder.innerHTML = `
            <div class="locked-message">
              <div class="locked-icon">🔒</div>
              <p>Complete a mission to unlock this prompt</p>
              <button class="btn btn-primary unlock-prompt-btn">Start Mission</button>
            </div>
          `;
          promptBox.parentNode.insertBefore(placeholder, promptBox.nextSibling);
        }
        return;
      }

      const footer = card.querySelector('.card-footer');
      if (!footer) return;

      // Check if already updated
      if (footer.querySelector('.prompt-card-mission-btn')) {
        // Still need to check lock status
        const isUnlocked = window.PromptVault.isUnlocked(cardId);
        if (!isUnlocked) {
          card.classList.add('locked-prompt-card');
        }
        return;
      }

      const isUnlocked = window.PromptVault.isUnlocked(cardId);

      // Remove old copy button or modify it
      const oldCopyBtn = footer.querySelector('.copy-btn');
      
      // Add mission button
      const missionBtn = document.createElement('button');
      missionBtn.className = `btn btn-primary prompt-card-mission-btn ${isUnlocked ? 'unlocked' : ''}`;
      missionBtn.setAttribute('data-prompt-id', cardId);
      missionBtn.innerHTML = isUnlocked 
        ? '📋 View & Copy' 
        : '🎯 Start Mission';
      
      missionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const promptId = e.target.closest('[data-prompt-id]')?.dataset.promptId;
        if (promptId) {
          if (isUnlocked) {
            // Show unlocked prompt
            window.PromptMissions.showUnlockedPrompt(promptId);
          } else {
            // Show mission
            window.PromptMissions.showMission(promptId);
          }
        }
      });

      // Insert before old copy button or append
      if (oldCopyBtn) {
        footer.insertBefore(missionBtn, oldCopyBtn);
        // Keep old copy button but hide it initially if locked
        if (!isUnlocked) {
          oldCopyBtn.style.display = 'none';
        }
      } else {
        footer.appendChild(missionBtn);
      }

      // Add unlock badge if unlocked
      if (isUnlocked) {
        const header = card.querySelector('.card-header');
        if (header && !header.querySelector('.prompt-unlocked-badge')) {
          const badge = document.createElement('span');
          badge.className = 'prompt-unlocked-badge';
          badge.textContent = '✨ Unlocked';
          header.appendChild(badge);
        }
      }
    });
  }

  // Add role selector
  function addRoleSelector() {
    const heroSection = document.querySelector('.hero-section .card');
    if (!heroSection) return;

    // Check if already added
    if (document.getElementById('role-selector')) return;

    const roleSelector = document.createElement('div');
    roleSelector.id = 'role-selector';
    roleSelector.className = 'role-selector';
    roleSelector.innerHTML = `
      <label for="user-role-select">Your Role:</label>
      <select id="user-role-select" class="role-select">
        <option value="">Choose your role...</option>
        <option value="parent">Parent</option>
        <option value="teacher">Teacher</option>
        <option value="carer">Carer</option>
        <option value="professional">Professional</option>
      </select>
      <label for="user-goal-select" style="margin-left: 1rem;">Current Goal:</label>
      <select id="user-goal-select" class="goal-select">
        <option value="">Choose your goal...</option>
        <option value="calm">Calm</option>
        <option value="focus">Focus</option>
        <option value="sleep">Sleep</option>
        <option value="overwhelm">Overwhelm</option>
        <option value="conflict">Conflict</option>
      </select>
    `;

    // Insert after theme controls
    const themeControls = heroSection.querySelector('.theme-controls');
    if (themeControls && themeControls.nextSibling) {
      themeControls.parentNode.insertBefore(roleSelector, themeControls.nextSibling);
    } else if (themeControls) {
      themeControls.parentNode.appendChild(roleSelector);
    }

    // Setup change listeners
    const roleSelect = document.getElementById('user-role-select');
    const goalSelect = document.getElementById('user-goal-select');

    const currentState = window.PromptVault.getState();
    if (currentState.currentRole) {
      roleSelect.value = currentState.currentRole;
    }
    if (currentState.currentGoal) {
      goalSelect.value = currentState.currentGoal;
    }

    roleSelect.addEventListener('change', (e) => {
      window.PromptVault.setRole(e.target.value);
      // Regenerate daily quest
      window.location.reload(); // Simple refresh for now
    });

    goalSelect.addEventListener('change', (e) => {
      window.PromptVault.setGoal(e.target.value);
    });
  }

  // Add low stimulation toggle
  function addLowStimulationToggle() {
    const heroSection = document.querySelector('.hero-section .card');
    if (!heroSection) return;

    // Check if already added
    if (document.getElementById('low-stim-toggle')) return;

    const isLowStim = window.PromptVault.isLowStimulationMode();

    const toggle = document.createElement('div');
    toggle.id = 'low-stim-toggle';
    toggle.className = 'low-stim-toggle';
    toggle.innerHTML = `
      <label>
        <input type="checkbox" id="low-stim-checkbox" ${isLowStim ? 'checked' : ''}>
        Low Stimulation Mode
      </label>
    `;

    const roleSelector = document.getElementById('role-selector');
    if (roleSelector) {
      roleSelector.appendChild(toggle);
    } else {
      const themeControls = heroSection.querySelector('.theme-controls');
      if (themeControls) {
        themeControls.parentNode.appendChild(toggle);
      }
    }

    const checkbox = document.getElementById('low-stim-checkbox');
    checkbox.addEventListener('change', (e) => {
      window.PromptVault.setLowStimulationMode(e.target.checked);
      const modal = document.getElementById('prompt-mission-modal');
      if (modal) {
        if (e.target.checked) {
          modal.classList.add('low-stimulation');
        } else {
          modal.classList.remove('low-stimulation');
        }
      }
    });
  }

  // Setup event listeners
  function setupEventListeners() {
    // Listen for mission completion
    window.addEventListener('prompt-vault:state-change', () => {
      // Update cards and quest when state changes
      setTimeout(() => {
        updatePromptCards();
        updateDailyQuest();
      }, 100);
    });

    // Listen for mission modal close to refresh
    const modal = document.getElementById('prompt-mission-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('prompt-mission-close') || 
            e.target.classList.contains('prompt-mission-overlay')) {
          setTimeout(() => {
            updatePromptCards();
            updateDailyQuest();
          }, 100);
        }
      });
    }
  }

  // Update daily quest display
  function updateDailyQuest() {
    const questSection = document.getElementById('daily-quest-section');
    if (!questSection) return;

    // Re-render quest section
    questSection.remove();
    addDailyQuestSection();
  }

  // Public API
  window.PromptVaultIntegration = {
    init,
    updatePromptCards,
    updateDailyQuest
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

