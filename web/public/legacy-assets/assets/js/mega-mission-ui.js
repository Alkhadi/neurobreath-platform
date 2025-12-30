// =============================================
// MEGA MISSION UI
// Displays mega mission progress and requirements
// =============================================

(function() {
  'use strict';

  let megaMissionPanel = null;

  // Initialize
  function init() {
    if (!window.MegaMissionTracker) {
      console.error('Mega Mission UI: MegaMissionTracker not found');
      return;
    }

    createMegaMissionPanel();
    updateMegaMissionPanel();
    
    // Listen for progress updates
    window.addEventListener('mega-mission:state-change', updateMegaMissionPanel);
    window.addEventListener('mega-mission:completed', () => {
      updateMegaMissionPanel();
      showCompletionCelebration();
    });
  }

  // Create mega mission panel
  function createMegaMissionPanel() {
    if (document.getElementById('mega-mission-panel')) return;

    const panel = document.createElement('section');
    panel.id = 'mega-mission-panel';
    panel.className = 'mega-mission-panel section';
    panel.innerHTML = `
      <div class="page-container">
        <div class="mega-mission-card">
          <div class="mega-mission-header">
            <h2>🎯 Ultimate Challenge: Complete All Activities</h2>
            <span class="mega-mission-status" id="mega-mission-status">In Progress</span>
          </div>
          
          <div class="mega-mission-description">
            <p>To unlock the complete prompt collection PDF, you must complete this ultimate challenge:</p>
            <ul>
              <li><strong>Mission 1:</strong> Complete any 2 regular prompt missions</li>
              <li><strong>Mission 2:</strong> Complete ALL activities below (this mega-mission)</li>
              <li><strong>Mission 3:</strong> Complete 1 more regular prompt mission</li>
            </ul>
          </div>

          <div class="mega-progress-overview">
            <div class="progress-circle" id="mega-progress-circle">
              <svg viewBox="0 0 100 100" class="progress-svg">
                <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
                <circle class="progress-fill" cx="50" cy="50" r="45" id="progress-circle-fill"></circle>
              </svg>
              <div class="progress-text">
                <span class="progress-percentage" id="mega-progress-percentage">0%</span>
                <span class="progress-label">Complete</span>
              </div>
            </div>
            <div class="progress-stats">
              <div class="stat">
                <span class="stat-value" id="completed-activities">0</span>
                <span class="stat-label">Completed</span>
              </div>
              <div class="stat">
                <span class="stat-value" id="total-activities">0</span>
                <span class="stat-label">Total Activities</span>
              </div>
            </div>
          </div>

          <div class="mega-mission-requirements" id="mega-mission-requirements">
            <!-- Requirements will be loaded here -->
          </div>
        </div>
      </div>
    `;

    // Insert after daily mission panel
    const dailyMissionPanel = document.getElementById('daily-mission-panel');
    if (dailyMissionPanel && dailyMissionPanel.nextSibling) {
      dailyMissionPanel.parentNode.insertBefore(panel, dailyMissionPanel.nextSibling);
    } else if (dailyMissionPanel) {
      dailyMissionPanel.parentNode.appendChild(panel);
    } else {
      // Insert before category nav if daily mission panel doesn't exist
      const categoryNav = document.querySelector('.category-nav');
      if (categoryNav) {
        categoryNav.parentNode.insertBefore(panel, categoryNav);
      }
    }

    megaMissionPanel = panel;
  }

  // Update mega mission panel
  function updateMegaMissionPanel() {
    if (!megaMissionPanel || !window.MegaMissionTracker) return;

    const progress = window.MegaMissionTracker.getProgress();
    const isComplete = window.MegaMissionTracker.isMegaMissionComplete();

    // Update status
    const statusEl = megaMissionPanel.querySelector('#mega-mission-status');
    if (statusEl) {
      statusEl.textContent = isComplete ? '✓ Complete' : 'In Progress';
      statusEl.className = isComplete ? 'mega-mission-status completed' : 'mega-mission-status';
    }

    // Update progress circle
    updateProgressCircle(progress.percentage);

    // Update stats
    const completedEl = megaMissionPanel.querySelector('#completed-activities');
    const totalEl = megaMissionPanel.querySelector('#total-activities');
    if (completedEl) completedEl.textContent = progress.completed;
    if (totalEl) totalEl.textContent = progress.total;

    // Update requirements list
    updateRequirementsList(progress.details);
  }

  // Update progress circle
  function updateProgressCircle(percentage) {
    const circleFill = megaMissionPanel?.querySelector('#progress-circle-fill');
    const percentageText = megaMissionPanel?.querySelector('#mega-progress-percentage');
    
    if (circleFill) {
      const circumference = 2 * Math.PI * 45;
      const offset = circumference - (percentage / 100) * circumference;
      circleFill.style.strokeDasharray = `${circumference}`;
      circleFill.style.strokeDashoffset = offset;
    }
    
    if (percentageText) {
      percentageText.textContent = `${percentage}%`;
    }
  }

  // Update requirements list
  function updateRequirementsList(details) {
    const container = megaMissionPanel?.querySelector('#mega-mission-requirements');
    if (!container) return;

    container.innerHTML = '';

    Object.keys(details).forEach(category => {
      const categoryData = details[category];
      if (categoryData.total === 0) return;

      const categorySection = document.createElement('div');
      categorySection.className = 'requirement-category';
      categorySection.innerHTML = `
        <h3 class="category-title">
          ${formatCategoryName(category)}
          <span class="category-progress">${categoryData.completed}/${categoryData.total}</span>
        </h3>
        <div class="requirement-list">
          ${categoryData.activities.map(activity => `
            <div class="requirement-item ${activity.completed ? 'completed' : ''}">
              <span class="requirement-check">${activity.completed ? '✓' : '○'}</span>
              <span class="requirement-name">${escapeHtml(activity.name)}</span>
              <span class="requirement-detail">${activity.progress}/${activity.required}</span>
            </div>
          `).join('')}
        </div>
      `;

      container.appendChild(categorySection);
    });
  }

  // Format category name
  function formatCategoryName(category) {
    const names = {
      breathing: '🌬️ Breathing Techniques',
      focusGames: '🎮 Focus Games',
      challenges: '🏆 Challenges',
      focusGarden: '🌱 Focus Garden',
      other: '✨ Other Activities'
    };
    return names[category] || category;
  }

  // Show completion celebration
  function showCompletionCelebration() {
    if (!megaMissionPanel) return;

    // Create celebration overlay
    const celebration = document.createElement('div');
    celebration.className = 'mega-mission-celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-icon">🎉</div>
        <h2>Ultimate Challenge Complete!</h2>
        <p>You've completed ALL activities across the website!</p>
        <p class="celebration-message">You're now one step closer to unlocking the complete prompt collection.</p>
        <button class="btn btn-primary celebration-close-btn">Amazing!</button>
      </div>
    `;

    document.body.appendChild(celebration);

    celebration.querySelector('.celebration-close-btn')?.addEventListener('click', () => {
      document.body.removeChild(celebration);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(celebration)) {
        document.body.removeChild(celebration);
      }
    }, 5000);
  }

  // Helper: escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Public API
  window.MegaMissionUI = {
    init,
    updateMegaMissionPanel
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 300);
  }
})();

