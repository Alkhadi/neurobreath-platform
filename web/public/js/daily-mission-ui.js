// =============================================
// DAILY MISSION UI
// Creates and manages the daily mission panel UI
// =============================================

(function() {
  'use strict';

  let missionPanel = null;
  let currentStep = 'energy'; // energy, breathing, inputs, output, complete

  // Initialize
  function init() {
    if (!window.DailyMissionSystem || !window.PromptVault || !window.getMissionTemplate) {
      console.error('Daily Mission UI: Required systems not loaded');
      return;
    }

    createMissionPanel();
    updateMissionPanel();
    
    // Listen for state changes
    window.addEventListener('daily-mission:state-change', updateMissionPanel);
    window.addEventListener('prompt-vault:state-change', updateMissionPanel);
  }

  // Create mission panel
  function createMissionPanel() {
    // Check if already exists
    if (document.getElementById('daily-mission-panel')) return;

    const panel = document.createElement('section');
    panel.id = 'daily-mission-panel';
    panel.className = 'daily-mission-panel section';
    panel.innerHTML = `
      <div class="page-container">
        <div class="daily-mission-card">
          <div class="daily-mission-header">
            <h2>🎯 Today's Mission (3-7 minutes)</h2>
            <span class="mission-status-badge">Ready</span>
          </div>
          
          <div class="mission-progress-indicator">
            <div class="progress-step" data-step="energy">
              <span class="step-icon">⚡</span>
              <span class="step-label">Energy Check</span>
            </div>
            <div class="progress-step" data-step="breathing">
              <span class="step-icon">🌬️</span>
              <span class="step-label">Breathing</span>
            </div>
            <div class="progress-step" data-step="inputs">
              <span class="step-icon">✏️</span>
              <span class="step-label">Inputs</span>
            </div>
            <div class="progress-step" data-step="output">
              <span class="step-icon">💾</span>
              <span class="step-label">Save Result</span>
            </div>
          </div>

          <div class="mission-content">
            <!-- Energy Check Step -->
            <div class="mission-step" id="step-energy" style="display: none;">
              <h3>How's your energy right now?</h3>
              <p class="mission-step-description">This helps us tailor the mission to you</p>
              <div class="energy-level-buttons">
                <button class="energy-btn" data-level="1">😞 Very Low</button>
                <button class="energy-btn" data-level="2">😐 Low</button>
                <button class="energy-btn" data-level="3">🙂 Okay</button>
                <button class="energy-btn" data-level="4">😊 Good</button>
                <button class="energy-btn" data-level="5">😄 Great</button>
              </div>
              <button class="btn btn-outline skip-energy-btn">Skip</button>
            </div>

            <!-- Breathing Primer Step -->
            <div class="mission-step" id="step-breathing" style="display: none;">
              <h3>Optional 60-Second Breathing Primer</h3>
              <p class="mission-step-description">Take a moment to center yourself (optional)</p>
              <button class="btn btn-primary start-breathing-btn">Start Breathing Exercise</button>
              <button class="btn btn-outline skip-breathing-btn">Skip</button>
            </div>

            <!-- Mission Selection Step -->
            <div class="mission-step" id="step-mission-select" style="display: none;">
              <h3>Choose Your Mission</h3>
              <p class="mission-step-description">Select a category to begin</p>
              <div class="mission-category-grid" id="mission-categories"></div>
            </div>

            <!-- Inputs Step -->
            <div class="mission-step" id="step-inputs" style="display: none;">
              <h3 id="inputs-title">Mission Inputs</h3>
              <p class="mission-step-description" id="inputs-description"></p>
              <form id="mission-inputs-form" class="mission-inputs-form"></form>
              <div class="mission-inputs-actions">
                <button type="button" class="btn btn-outline back-inputs-btn">Back</button>
                <button type="submit" class="btn btn-primary continue-inputs-btn" form="mission-inputs-form">Continue →</button>
              </div>
            </div>

            <!-- Output Capture Step -->
            <div class="mission-step" id="step-output" style="display: none;">
              <h3>Capture Your Result</h3>
              <p class="mission-step-description">Paste the AI output here (or save it for later)</p>
              
              <div class="output-capture-area">
                <textarea id="output-textarea" class="output-textarea" 
                  placeholder="Paste your result here..."></textarea>
                <div class="output-actions">
                  <button class="btn btn-outline skip-output-btn">I'll add this later</button>
                </div>
              </div>

              <div class="reflection-section">
                <label for="reflection-text">What's the next smallest step? (Optional)</label>
                <textarea id="reflection-text" class="reflection-textarea" 
                  placeholder="e.g., Review this tomorrow, Share with my team, Start implementing..."></textarea>
              </div>

              <div class="privacy-options">
                <label>Save as:</label>
                <div class="privacy-buttons">
                  <button class="privacy-btn active" data-privacy="private">🔒 Private</button>
                  <button class="privacy-btn" data-privacy="template">📋 Template</button>
                  <button class="privacy-btn" data-privacy="anonymised">🌟 Shareable (Anonymised)</button>
                </div>
              </div>

              <div class="mission-output-actions">
                <button type="button" class="btn btn-outline back-output-btn">Back</button>
                <button type="button" class="btn btn-primary save-output-btn">Save to Outcome Vault</button>
              </div>
            </div>

            <!-- Completion Step -->
            <div class="mission-step" id="step-complete" style="display: none;">
              <div class="completion-success">
                <div class="success-icon">✨</div>
                <h3>Mission Complete!</h3>
                <p>Your result has been saved to your Outcome Vault</p>
                <div class="completion-actions">
                  <button class="btn btn-primary view-vault-btn">View Outcome Vault</button>
                  <button class="btn btn-outline new-mission-btn">Start Another Mission</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert after hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && heroSection.nextSibling) {
      heroSection.parentNode.insertBefore(panel, heroSection.nextSibling);
    } else if (heroSection) {
      heroSection.parentNode.appendChild(panel);
    }

    missionPanel = panel;
    setupEventListeners();
  }

  // Setup event listeners
  function setupEventListeners() {
    if (!missionPanel) return;

    // Energy buttons
    missionPanel.querySelectorAll('.energy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const level = parseInt(e.target.dataset.level);
        window.DailyMissionSystem.setEnergyLevel(level);
        showStep('breathing');
      });
    });

    missionPanel.querySelector('.skip-energy-btn')?.addEventListener('click', () => {
      showStep('breathing');
    });

    // Breathing buttons
    missionPanel.querySelector('.start-breathing-btn')?.addEventListener('click', () => {
      // Trigger breathing exercise
      if (window.PromptMissions) {
        // Could open breathing modal or redirect
        window.DailyMissionSystem.completeBreathing();
        showStep('mission-select');
      }
    });

    missionPanel.querySelector('.skip-breathing-btn')?.addEventListener('click', () => {
      showStep('mission-select');
    });

    // Form submission
    const form = missionPanel.querySelector('#mission-inputs-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleInputsSubmit();
      });
    }

    // Output save
    missionPanel.querySelector('.save-output-btn')?.addEventListener('click', () => {
      handleOutputSave();
    });

    missionPanel.querySelector('.skip-output-btn')?.addEventListener('click', () => {
      handleOutputSave(true); // Skip output
    });

    // Privacy buttons
    missionPanel.querySelectorAll('.privacy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        missionPanel.querySelectorAll('.privacy-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Navigation buttons
    missionPanel.querySelector('.back-inputs-btn')?.addEventListener('click', () => {
      showStep('mission-select');
    });

    missionPanel.querySelector('.back-output-btn')?.addEventListener('click', () => {
      showStep('inputs');
    });

    // Completion buttons
    missionPanel.querySelector('.view-vault-btn')?.addEventListener('click', () => {
      // Scroll to Outcome Vault section or open modal
      const vaultSection = document.getElementById('outcome-vault-section');
      if (vaultSection) {
        vaultSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    missionPanel.querySelector('.new-mission-btn')?.addEventListener('click', () => {
      window.DailyMissionSystem.resetToday();
      showStep('energy');
    });
  }

  // Show step
  function showStep(step) {
    if (!missionPanel) return;

    currentStep = step;

    // Hide all steps
    missionPanel.querySelectorAll('.mission-step').forEach(el => {
      el.style.display = 'none';
    });

    // Show current step
    const stepEl = missionPanel.querySelector(`#step-${step}`);
    if (stepEl) {
      stepEl.style.display = 'block';
    }

    // Update progress indicators
    updateProgressIndicators();
  }

  // Update progress indicators
  function updateProgressIndicators() {
    if (!missionPanel) return;

    const steps = ['energy', 'breathing', 'inputs', 'output'];
    const currentIndex = steps.indexOf(currentStep);

    missionPanel.querySelectorAll('.progress-step').forEach((stepEl, index) => {
      stepEl.classList.remove('active', 'completed');
      if (index < currentIndex) {
        stepEl.classList.add('completed');
      } else if (index === currentIndex) {
        stepEl.classList.add('active');
      }
    });
  }

  // Handle inputs submit
  function handleInputsSubmit() {
    if (!missionPanel) return;

    const form = missionPanel.querySelector('#mission-inputs-form');
    const formData = new FormData(form);
    const inputs = {};

    formData.forEach((value, key) => {
      inputs[key] = value;
    });

    window.DailyMissionSystem.completeInputs(inputs);
    showStep('output');
  }

  // Handle output save
  function handleOutputSave(skip = false) {
    if (!missionPanel) return;

    const output = skip ? '' : missionPanel.querySelector('#output-textarea').value;
    const reflection = missionPanel.querySelector('#reflection-text').value;
    const privacyBtn = missionPanel.querySelector('.privacy-btn.active');
    const privacy = privacyBtn ? privacyBtn.dataset.privacy : 'private';

    window.DailyMissionSystem.captureOutput(output, {
      reflection: reflection || null,
      privacy: privacy,
      tags: [],
      audience: window.PromptVault?.getState()?.currentRole || null
    });

    window.DailyMissionSystem.completeMission();
    showStep('complete');
  }

  // Update mission panel
  function updateMissionPanel() {
    if (!missionPanel || !window.DailyMissionSystem) return;

    const state = window.DailyMissionSystem.getState();
    const progress = window.DailyMissionSystem.getProgress();
    const currentMission = window.DailyMissionSystem.getCurrentMission();

    // Update status badge
    const statusBadge = missionPanel.querySelector('.mission-status-badge');
    if (statusBadge) {
      if (progress.missionCompleted) {
        statusBadge.textContent = '✓ Complete';
        statusBadge.className = 'mission-status-badge completed';
      } else if (currentMission) {
        statusBadge.textContent = 'In Progress';
        statusBadge.className = 'mission-status-badge in-progress';
      } else {
        statusBadge.textContent = 'Ready';
        statusBadge.className = 'mission-status-badge';
      }
    }

    // Show appropriate step
    if (progress.missionCompleted) {
      showStep('complete');
    } else if (progress.outputCaptured) {
      showStep('output');
    } else if (progress.inputsCompleted) {
      showStep('output');
    } else if (progress.breathingCompleted || progress.energyLevel !== null) {
      loadMissionCategories();
      showStep('mission-select');
    } else {
      showStep('energy');
    }
  }

  // Load mission categories
  function loadMissionCategories() {
    if (!missionPanel) return;

    const container = missionPanel.querySelector('#mission-categories');
    if (!container) return;

    const categories = window.PROMPT_VAULT_DATA?.categories || {};
    const templates = window.MISSION_TEMPLATES || {};

    container.innerHTML = '';

    Object.values(templates).forEach(template => {
      const card = document.createElement('div');
      card.className = 'mission-category-card';
      card.innerHTML = `
        <h4>${template.name}</h4>
        <p>${template.description}</p>
        <span class="time-estimate">${template.estimatedTime}</span>
        <button class="btn btn-primary select-mission-btn" data-template-id="${template.id}">
          Start Mission
        </button>
      `;

      card.querySelector('.select-mission-btn').addEventListener('click', (e) => {
        startMissionWithTemplate(template);
      });

      container.appendChild(card);
    });
  }

  // Start mission with template
  function startMissionWithTemplate(template) {
    if (!window.DailyMissionSystem) return;

    // Find a prompt in this category
    const prompts = window.PROMPT_VAULT_DATA?.prompts?.filter(p => 
      p.category === template.category
    ) || [];

    const prompt = prompts[0] || { id: 'generic', title: template.name, category: template.category };

    window.DailyMissionSystem.startDailyMission({
      promptId: prompt.id,
      promptTitle: prompt.title,
      category: template.category,
      templateId: template.id
    });

    showInputsStep(template);
  }

  // Show inputs step
  function showInputsStep(template) {
    if (!missionPanel || !template) return;

    const form = missionPanel.querySelector('#mission-inputs-form');
    const title = missionPanel.querySelector('#inputs-title');
    const description = missionPanel.querySelector('#inputs-description');

    if (title) title.textContent = template.name;
    if (description) description.textContent = template.description;

    if (form && template.inputs) {
      form.innerHTML = '';

      template.inputs.forEach(input => {
        const fieldWrapper = document.createElement('div');
        fieldWrapper.className = 'form-field';

        const label = document.createElement('label');
        label.textContent = input.label;
        if (input.required) label.innerHTML += ' <span class="required">*</span>';
        label.setAttribute('for', input.id);

        let inputElement;

        if (input.type === 'textarea') {
          inputElement = document.createElement('textarea');
          inputElement.rows = 4;
        } else if (input.type === 'select') {
          inputElement = document.createElement('select');
          if (input.options) {
            input.options.forEach(opt => {
              const option = document.createElement('option');
              option.value = opt.value;
              option.textContent = opt.label;
              inputElement.appendChild(option);
            });
          }
        } else {
          inputElement = document.createElement('input');
          inputElement.type = input.type || 'text';
        }

        inputElement.id = input.id;
        inputElement.name = input.id;
        inputElement.placeholder = input.placeholder || '';
        inputElement.required = input.required || false;

        fieldWrapper.appendChild(label);
        fieldWrapper.appendChild(inputElement);
        form.appendChild(fieldWrapper);
      });
    }

    showStep('inputs');
  }

  // Public API
  window.DailyMissionUI = {
    init,
    updateMissionPanel,
    showStep
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
})();

