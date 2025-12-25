// =============================================
// OUTCOME VAULT UI
// Creates and manages the Outcome Vault and My Templates sections
// =============================================

(function() {
  'use strict';

  let vaultSection = null;
  let activeTab = 'outcomes'; // 'outcomes' or 'templates'

  // Initialize
  function init() {
    if (!window.OutcomeVault) {
      console.error('Outcome Vault UI: OutcomeVault not found');
      return;
    }

    createVaultSection();
    updateVaultSection();

    // Listen for state changes
    window.addEventListener('outcome-vault:state-change', updateVaultSection);
    window.addEventListener('daily-mission:state-change', updateVaultSection);
  }

  // Create vault section
  function createVaultSection() {
    if (document.getElementById('outcome-vault-section')) return;

    const section = document.createElement('section');
    section.id = 'outcome-vault-section';
    section.className = 'outcome-vault-section section';
    section.innerHTML = `
      <div class="page-container">
        <div class="vault-header">
          <h2>📚 Outcome Vault & My Templates</h2>
          <p class="vault-description">Your saved results and customized prompts</p>
        </div>

        <div class="vault-tabs">
          <button class="vault-tab active" data-tab="outcomes">
            <span class="tab-icon">💾</span>
            <span>Outcome Vault</span>
            <span class="tab-count" id="outcomes-count">0</span>
          </button>
          <button class="vault-tab" data-tab="templates">
            <span class="tab-icon">📋</span>
            <span>My Templates</span>
            <span class="tab-count" id="templates-count">0</span>
          </button>
        </div>

        <div class="vault-content">
          <!-- Outcomes Tab -->
          <div class="vault-tab-content active" id="tab-outcomes">
            <div class="vault-filters">
              <select id="filter-category" class="vault-filter">
                <option value="">All Categories</option>
              </select>
              <select id="filter-audience" class="vault-filter">
                <option value="">All Audiences</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="carer">Carer</option>
                <option value="professional">Professional</option>
              </select>
              <button class="btn btn-outline export-outcomes-btn">Export All</button>
            </div>
            <div class="outcomes-grid" id="outcomes-grid">
              <!-- Outcomes will be loaded here -->
            </div>
          </div>

          <!-- Templates Tab -->
          <div class="vault-tab-content" id="tab-templates">
            <div class="templates-grid" id="templates-grid">
              <!-- Templates will be loaded here -->
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert before category navigation
    const categoryNav = document.querySelector('.category-nav');
    if (categoryNav) {
      categoryNav.parentNode.insertBefore(section, categoryNav);
    } else {
      const main = document.querySelector('main');
      if (main) {
        main.appendChild(section);
      }
    }

    vaultSection = section;
    setupEventListeners();
  }

  // Setup event listeners
  function setupEventListeners() {
    if (!vaultSection) return;

    // Tab switching
    vaultSection.querySelectorAll('.vault-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.closest('.vault-tab').dataset.tab;
        switchTab(tabName);
      });
    });

    // Filters
    vaultSection.querySelector('#filter-category')?.addEventListener('change', updateOutcomes);
    vaultSection.querySelector('#filter-audience')?.addEventListener('change', updateOutcomes);

    // Export
    vaultSection.querySelector('.export-outcomes-btn')?.addEventListener('click', () => {
      window.OutcomeVault.exportOutcomes('json');
    });
  }

  // Switch tab
  function switchTab(tabName) {
    if (!vaultSection) return;

    activeTab = tabName;

    // Update tab buttons
    vaultSection.querySelectorAll('.vault-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update tab content
    vaultSection.querySelectorAll('.vault-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabName}`);
    });

    // Update content
    if (tabName === 'outcomes') {
      updateOutcomes();
    } else {
      updateTemplates();
    }
  }

  // Update vault section
  function updateVaultSection() {
    if (!vaultSection) return;

    const stats = window.OutcomeVault.getStatistics();

    // Update counts
    const outcomesCount = vaultSection.querySelector('#outcomes-count');
    const templatesCount = vaultSection.querySelector('#templates-count');

    if (outcomesCount) outcomesCount.textContent = stats.totalOutcomes;
    if (templatesCount) templatesCount.textContent = stats.totalTemplates;

    // Update filters
    updateCategoryFilter(stats.outcomesByCategory);

    // Update content
    if (activeTab === 'outcomes') {
      updateOutcomes();
    } else {
      updateTemplates();
    }
  }

  // Update category filter
  function updateCategoryFilter(categories) {
    if (!vaultSection) return;

    const select = vaultSection.querySelector('#filter-category');
    if (!select) return;

    // Keep first option (All Categories)
    select.innerHTML = '<option value="">All Categories</option>';

    // Add category options
    Object.keys(categories).forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = formatCategoryName(category);
      select.appendChild(option);
    });
  }

  // Format category name
  function formatCategoryName(categoryId) {
    const categories = window.PROMPT_VAULT_DATA?.categories || {};
    return categories[categoryId]?.name || categoryId;
  }

  // Update outcomes
  function updateOutcomes() {
    if (!vaultSection) return;

    const categoryFilter = vaultSection.querySelector('#filter-category')?.value || '';
    const audienceFilter = vaultSection.querySelector('#filter-audience')?.value || '';

    const filters = {};
    if (categoryFilter) filters.category = categoryFilter;
    if (audienceFilter) filters.audience = audienceFilter;

    const outcomes = window.OutcomeVault.getOutcomes(filters);
    const grid = vaultSection.querySelector('#outcomes-grid');

    if (!grid) return;

    if (outcomes.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>No outcomes yet</h3>
          <p>Complete missions to save your results here</p>
          <button class="btn btn-primary start-mission-btn">Start Your First Mission</button>
        </div>
      `;

      grid.querySelector('.start-mission-btn')?.addEventListener('click', () => {
        const missionPanel = document.getElementById('daily-mission-panel');
        if (missionPanel) {
          missionPanel.scrollIntoView({ behavior: 'smooth' });
        }
      });

      return;
    }

    grid.innerHTML = outcomes.map(outcome => {
      const date = new Date(outcome.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return `
        <div class="outcome-card" data-outcome-id="${outcome.id}">
          <div class="outcome-header">
            <h4>${escapeHtml(outcome.promptTitle)}</h4>
            <button class="outcome-delete-btn" aria-label="Delete outcome">×</button>
          </div>
          <div class="outcome-meta">
            <span class="outcome-category">${formatCategoryName(outcome.category)}</span>
            ${outcome.audience ? `<span class="outcome-audience">${outcome.audience}</span>` : ''}
            <span class="outcome-date">${date}</span>
          </div>
          ${outcome.output ? `
            <div class="outcome-preview">
              ${escapeHtml(outcome.output.substring(0, 200))}${outcome.output.length > 200 ? '...' : ''}
            </div>
          ` : ''}
          ${outcome.nextStep ? `
            <div class="outcome-next-step">
              <strong>Next step:</strong> ${escapeHtml(outcome.nextStep)}
            </div>
          ` : ''}
          <div class="outcome-actions">
            <button class="btn btn-outline view-outcome-btn">View Full</button>
            <button class="btn btn-outline copy-outcome-btn">Copy Output</button>
          </div>
        </div>
      `;
    }).join('');

    // Setup outcome card listeners
    grid.querySelectorAll('.outcome-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.outcome-card');
        const outcomeId = card.dataset.outcomeId;
        if (confirm('Delete this outcome?')) {
          window.OutcomeVault.deleteOutcome(outcomeId);
        }
      });
    });

    grid.querySelectorAll('.view-outcome-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.outcome-card');
        const outcomeId = card.dataset.outcomeId;
        showOutcomeModal(outcomeId);
      });
    });

    grid.querySelectorAll('.copy-outcome-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.outcome-card');
        const outcomeId = card.dataset.outcomeId;
        const outcome = window.OutcomeVault.getOutcome(outcomeId);
        if (outcome && outcome.output) {
          copyToClipboard(outcome.output);
        }
      });
    });
  }

  // Update templates
  function updateTemplates() {
    if (!vaultSection) return;

    const templates = window.OutcomeVault.getTemplates();
    const grid = vaultSection.querySelector('#templates-grid');

    if (!grid) return;

    if (templates.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No templates yet</h3>
          <p>Save prompts as templates to reuse with your defaults</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = templates.map(template => {
      const date = new Date(template.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return `
        <div class="template-card" data-template-id="${template.id}">
          <div class="template-header">
            <h4>${escapeHtml(template.name)}</h4>
            <button class="template-delete-btn" aria-label="Delete template">×</button>
          </div>
          <div class="template-meta">
            <span class="template-category">${formatCategoryName(template.category)}</span>
            <span class="template-date">${date}</span>
          </div>
          ${template.description ? `
            <p class="template-description">${escapeHtml(template.description)}</p>
          ` : ''}
          <div class="template-actions">
            <button class="btn btn-primary use-template-btn">Use Template</button>
            <button class="btn btn-outline edit-template-btn">Edit</button>
          </div>
        </div>
      `;
    }).join('');

    // Setup template listeners
    grid.querySelectorAll('.template-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.template-card');
        const templateId = card.dataset.templateId;
        if (confirm('Delete this template?')) {
          window.OutcomeVault.deleteTemplate(templateId);
        }
      });
    });
  }

  // Show outcome modal
  function showOutcomeModal(outcomeId) {
    const outcome = window.OutcomeVault.getOutcome(outcomeId);
    if (!outcome) return;

    // Simple modal implementation
    const modal = document.createElement('div');
    modal.className = 'outcome-modal';
    modal.innerHTML = `
      <div class="outcome-modal-overlay"></div>
      <div class="outcome-modal-content">
        <button class="outcome-modal-close">×</button>
        <h2>${escapeHtml(outcome.promptTitle)}</h2>
        <div class="outcome-modal-meta">
          <span>${formatCategoryName(outcome.category)}</span>
          <span>${new Date(outcome.createdAt).toLocaleDateString('en-GB')}</span>
        </div>
        <div class="outcome-modal-output">
          <h3>Output</h3>
          <pre>${escapeHtml(outcome.output || 'No output saved')}</pre>
        </div>
        ${outcome.reflection ? `
          <div class="outcome-modal-reflection">
            <h3>Reflection</h3>
            <p>${escapeHtml(outcome.reflection)}</p>
          </div>
        ` : ''}
        ${outcome.nextStep ? `
          <div class="outcome-modal-next-step">
            <h3>Next Step</h3>
            <p>${escapeHtml(outcome.nextStep)}</p>
          </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.outcome-modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('.outcome-modal-overlay').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }

  // Helper: escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Helper: copy to clipboard
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        alert('Copied to clipboard!');
      });
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Copied to clipboard!');
    }
  }

  // Public API
  window.OutcomeVaultUI = {
    init,
    updateVaultSection,
    switchTab
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
})();

