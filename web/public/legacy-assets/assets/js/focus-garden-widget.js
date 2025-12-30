// =============================================
// NeuroBreath – Focus Garden Widget
// Vanilla JS widget for embedding Focus Garden summary in non-React pages
// =============================================

(function() {
    'use strict';
    
    const STORAGE_KEY = 'neurobreath_data';
    
    function loadFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }
    
    function getActiveLearner(data) {
        if (!data || !data.currentLearnerId || !data.currentProfileId) return null;
        const learners = data.learnersByProfile[data.currentProfileId] || [];
        return learners.find(l => l.learnerId === data.currentLearnerId) || null;
    }
    
    function createWidget() {
        const data = loadFromStorage();
        const learner = getActiveLearner(data);
        
        if (!learner) {
            return `
                <div class="focus-garden-widget empty">
                    <div class="widget-icon">🌱</div>
                    <div class="widget-content">
                        <h3 class="widget-title">Start Your Focus Garden</h3>
                        <p class="widget-text">Track your progress and grow skills with the Focus Garden.</p>
                        <a href="focus-garden.html" class="widget-btn">Get Started</a>
                    </div>
                </div>
            `;
        }
        
        const garden = data.gardenByLearner[learner.learnerId] || { plants: [], seedBank: {} };
        const levels = data.levelsByLearner[learner.learnerId] || { level: 1, xp: 0, layerMastery: {} };
        const activePlants = garden.plants.filter(p => p.status === 'active');
        const xpProgress = levels.xp % 100;
        
        const plantSummary = activePlants.length > 0 
            ? activePlants.slice(0, 2).map(p => `<span class="plant-badge">${p.icon} ${p.title}</span>`).join('')
            : '<span class="text-muted">No active tasks</span>';
        
        return `
            <div class="focus-garden-widget active">
                <div class="widget-header">
                    <div class="widget-icon">🌻</div>
                    <div class="widget-title-group">
                        <h3 class="widget-title">${learner.name}'s Focus Garden</h3>
                        <div class="widget-level">Level ${levels.level}</div>
                    </div>
                </div>
                <div class="widget-content">
                    <div class="widget-progress">
                        <div class="progress-bar-mini">
                            <div class="progress-fill-mini" style="width: ${xpProgress}%"></div>
                        </div>
                        <span class="progress-text">${xpProgress}/100 XP</span>
                    </div>
                    <div class="widget-plants">
                        <div class="widget-label">Active Tasks:</div>
                        <div class="widget-plants-list">${plantSummary}</div>
                    </div>
                    <a href="focus-garden.html" class="widget-btn">Open Focus Garden</a>
                </div>
            </div>
        `;
    }
    
    function initWidget() {
        const containers = document.querySelectorAll('[data-focus-garden-widget]');
        containers.forEach(container => {
            container.innerHTML = createWidget();
        });
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
    
    // Export for manual initialization if needed
    window.FocusGardenWidget = { init: initWidget, create: createWidget };
})();

