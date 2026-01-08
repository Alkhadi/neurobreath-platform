// =============================================
// OUTCOME VAULT SYSTEM
// Manages saved outputs, templates, and mission results
// =============================================

(function() {
  'use strict';

  const STORAGE_KEY = 'nb_outcome_vault_v1';

  // Default state
  const defaultState = {
    outcomes: [], // Saved outputs from missions
    templates: [], // User's custom prompt templates
    tags: [], // Custom tags for organization
    lastSaved: null
  };

  let vaultState = null;

  // Load state
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
      console.warn('Outcome Vault: Error loading state', err);
      vaultState = { ...defaultState };
      return vaultState;
    }
  }

  // Save state
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vaultState));
      broadcastStateChange();
    } catch (err) {
      console.warn('Outcome Vault: Error saving state', err);
    }
  }

  // Broadcast state change
  function broadcastStateChange() {
    try {
      window.dispatchEvent(new CustomEvent('outcome-vault:state-change', {
        detail: { state: getState() }
      }));
    } catch (err) {
      // Ignore if CustomEvent not supported
    }
  }

  // Initialize
  function init() {
    loadState();
  }

  // Get state
  function getState() {
    if (!vaultState) loadState();
    return JSON.parse(JSON.stringify(vaultState));
  }

  // Save an outcome
  function saveOutcome(outcome) {
    if (!vaultState) loadState();

    const outcomeData = {
      id: `outcome_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      promptId: outcome.promptId || null,
      promptTitle: outcome.promptTitle || 'Untitled',
      category: outcome.category || 'general',
      output: outcome.output || '',
      inputs: outcome.inputs || {},
      tags: outcome.tags || [],
      audience: outcome.audience || null, // parent/teacher/carer/professional
      privacy: outcome.privacy || 'private', // private/template/anonymised
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reflection: outcome.reflection || null,
      nextStep: outcome.nextStep || null
    };

    vaultState.outcomes.push(outcomeData);
    vaultState.lastSaved = new Date().toISOString();
    saveState();

    return outcomeData;
  }

  // Get outcomes with filters
  function getOutcomes(filters = {}) {
    if (!vaultState) loadState();

    let outcomes = [...vaultState.outcomes];

    // Filter by category
    if (filters.category) {
      outcomes = outcomes.filter(o => o.category === filters.category);
    }

    // Filter by audience
    if (filters.audience) {
      outcomes = outcomes.filter(o => o.audience === filters.audience);
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      outcomes = outcomes.filter(o => 
        filters.tags.some(tag => o.tags.includes(tag))
      );
    }

    // Filter by privacy
    if (filters.privacy) {
      outcomes = outcomes.filter(o => o.privacy === filters.privacy);
    }

    // Filter by date range
    if (filters.startDate) {
      outcomes = outcomes.filter(o => new Date(o.createdAt) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      outcomes = outcomes.filter(o => new Date(o.createdAt) <= new Date(filters.endDate));
    }

    // Sort by date (newest first)
    outcomes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return outcomes;
  }

  // Get outcome by ID
  function getOutcome(id) {
    if (!vaultState) loadState();
    return vaultState.outcomes.find(o => o.id === id) || null;
  }

  // Delete outcome
  function deleteOutcome(id) {
    if (!vaultState) loadState();
    const index = vaultState.outcomes.findIndex(o => o.id === id);
    if (index !== -1) {
      vaultState.outcomes.splice(index, 1);
      saveState();
      return true;
    }
    return false;
  }

  // Update outcome
  function updateOutcome(id, updates) {
    if (!vaultState) loadState();
    const outcome = vaultState.outcomes.find(o => o.id === id);
    if (outcome) {
      Object.assign(outcome, updates, {
        updatedAt: new Date().toISOString()
      });
      saveState();
      return outcome;
    }
    return null;
  }

  // Save template
  function saveTemplate(template) {
    if (!vaultState) loadState();

    const templateData = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: template.name || 'Untitled Template',
      promptId: template.promptId || null,
      category: template.category || 'general',
      promptText: template.promptText || '',
      inputs: template.inputs || {}, // Default input values
      description: template.description || '',
      tags: template.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Check if template with same promptId exists, update instead
    const existingIndex = vaultState.templates.findIndex(t => t.promptId === template.promptId);
    if (existingIndex !== -1) {
      vaultState.templates[existingIndex] = { ...vaultState.templates[existingIndex], ...templateData };
    } else {
      vaultState.templates.push(templateData);
    }

    saveState();
    return templateData;
  }

  // Get templates
  function getTemplates(filters = {}) {
    if (!vaultState) loadState();

    let templates = [...vaultState.templates];

    // Filter by category
    if (filters.category) {
      templates = templates.filter(t => t.category === filters.category);
    }

    // Filter by promptId
    if (filters.promptId) {
      templates = templates.filter(t => t.promptId === filters.promptId);
    }

    return templates;
  }

  // Get template by ID
  function getTemplate(id) {
    if (!vaultState) loadState();
    return vaultState.templates.find(t => t.id === id) || null;
  }

  // Delete template
  function deleteTemplate(id) {
    if (!vaultState) loadState();
    const index = vaultState.templates.findIndex(t => t.id === id);
    if (index !== -1) {
      vaultState.templates.splice(index, 1);
      saveState();
      return true;
    }
    return false;
  }

  // Get all unique tags
  function getAllTags() {
    if (!vaultState) loadState();
    const tagSet = new Set();
    
    vaultState.outcomes.forEach(o => {
      o.tags.forEach(tag => tagSet.add(tag));
    });
    
    vaultState.templates.forEach(t => {
      t.tags.forEach(tag => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }

  // Get statistics
  function getStatistics() {
    if (!vaultState) loadState();

    return {
      totalOutcomes: vaultState.outcomes.length,
      totalTemplates: vaultState.templates.length,
      outcomesByCategory: countBy(vaultState.outcomes, 'category'),
      outcomesByAudience: countBy(vaultState.outcomes, 'audience'),
      outcomesByPrivacy: countBy(vaultState.outcomes, 'privacy'),
      mostUsedTags: getMostUsedTags(),
      lastSaved: vaultState.lastSaved
    };
  }

  // Helper: count by property
  function countBy(array, property) {
    const counts = {};
    array.forEach(item => {
      const value = item[property] || 'unknown';
      counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  }

  // Get most used tags
  function getMostUsedTags() {
    if (!vaultState) loadState();
    const tagCounts = {};
    
    [...vaultState.outcomes, ...vaultState.templates].forEach(item => {
      item.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  }

  // Export outcomes (for user download)
  function exportOutcomes(format = 'json') {
    if (!vaultState) loadState();

    if (format === 'json') {
      const dataStr = JSON.stringify(vaultState.outcomes, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `neurobreath-outcomes-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      return true;
    }

    return false;
  }

  // Public API
  window.OutcomeVault = {
    init,
    getState,
    saveOutcome,
    getOutcomes,
    getOutcome,
    deleteOutcome,
    updateOutcome,
    saveTemplate,
    getTemplates,
    getTemplate,
    deleteTemplate,
    getAllTags,
    getStatistics,
    exportOutcomes
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

