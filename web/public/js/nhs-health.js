/**
 * NHS HEALTH UPDATES MODULE
 * Manages live NHS health data, auto-refresh, and dynamic rendering
 * ============================================================================
 */

(function() {
  'use strict';

  // ============================================================================
  // STATE
  // ============================================================================
  let healthData = null;
  let lastVersion = null;
  let updateCheckInterval = null;
  const CHECK_INTERVAL = 10 * 60 * 1000; // Check every 10 minutes

  // ============================================================================
  // DOM ELEMENTS
  // ============================================================================
  const elements = {
    fluCard: document.getElementById('nhs-flu-card'),
    covidCard: document.getElementById('nhs-covid-card'),
    pandemicCard: document.getElementById('nhs-pandemic-card'),
    emergencyBanner: document.getElementById('nhs-emergency-banner'),
    disclaimer: document.getElementById('nhs-disclaimer'),
    lastUpdated: document.getElementById('nhs-last-updated')
  };

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  async function init() {
    showLoadingState();
    await loadHealthData();
    startAutoRefresh();
  }

  // ============================================================================
  // DATA LOADING
  // ============================================================================
  async function loadHealthData() {
    try {
      const response = await fetch('/data/nhs-health-data.json', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if version changed
      if (lastVersion && lastVersion !== data.version) {
        console.log('NHS health data updated');
      }

      lastVersion = data.version;
      healthData = data;

      renderHealthData();
    } catch (error) {
      console.error('Error loading NHS health data:', error);
      showErrorState();
    }
  }

  // ============================================================================
  // RENDERING
  // ============================================================================
  function renderHealthData() {
    if (!healthData) return;

    renderFluCard();
    renderCovidCard();
    renderPandemicCard();
    renderEmergencyBanner();
    renderDisclaimer();
    updateLastUpdatedTime();
  }

  function renderFluCard() {
    if (!elements.fluCard || !healthData.flu) return;

    const flu = healthData.flu;
    const activityClass = getActivityLevelClass(flu.activityLevelColor);

    elements.fluCard.innerHTML = `
      <div class="nhs-health-card-icon">🦠</div>
      <h3 class="nhs-health-card-title">Seasonal Flu Update</h3>
      <div class="nhs-health-card-stats">
        <div class="nhs-stat">
          <span class="nhs-stat-value nhs-stat-value--${activityClass}">${escapeHtml(flu.activityLevel)}</span>
          <span class="nhs-stat-label">Current Activity Level</span>
        </div>
        <div class="nhs-stat">
          <span class="nhs-stat-value">${escapeHtml(flu.peakSeason)}</span>
          <span class="nhs-stat-label">Peak Season</span>
        </div>
      </div>
      <div class="nhs-health-card-content">
        <div class="nhs-data-row">
          <span class="nhs-data-label">Current Week:</span>
          <span class="nhs-data-value">${escapeHtml(flu.currentWeek)}</span>
        </div>
        <div class="nhs-data-row">
          <span class="nhs-data-label">Weekly Trend:</span>
          <span class="nhs-data-value">${escapeHtml(flu.weeklyConsultations)}</span>
        </div>
        <div class="nhs-data-row">
          <span class="nhs-data-label">Test Positivity:</span>
          <span class="nhs-data-value">${escapeHtml(flu.positivityRate)}</span>
        </div>

        <h4>Who Should Get Vaccinated?</h4>
        <ul class="nhs-checklist">
          ${flu.eligibleGroups.map(group => `<li>${escapeHtml(group)}</li>`).join('')}
        </ul>
        <p class="nhs-note">
          <strong>💉 Free Vaccination Available:</strong> ${escapeHtml(flu.vaccinationInfo)}
        </p>
      </div>
      <div class="nhs-health-card-footer">
        ${flu.links.map(link => `
          <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="nhs-link">
            <span>${escapeHtml(link.title)}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        `).join('')}
      </div>
    `;
  }

  function renderCovidCard() {
    if (!elements.covidCard || !healthData.covid19) return;

    const covid = healthData.covid19;

    elements.covidCard.innerHTML = `
      <div class="nhs-health-card-icon">💉</div>
      <h3 class="nhs-health-card-title">COVID-19 Vaccination Programme</h3>
      <div class="nhs-health-card-stats">
        <div class="nhs-stat">
          <span class="nhs-stat-value nhs-stat-value--active">${escapeHtml(covid.programmeStatus)}</span>
          <span class="nhs-stat-label">${escapeHtml(covid.currentCampaign)}</span>
        </div>
      </div>
      <div class="nhs-health-card-content">
        <div class="nhs-data-row">
          <span class="nhs-data-label">Campaign Started:</span>
          <span class="nhs-data-value">${formatDate(covid.campaignStartDate)}</span>
        </div>
        <div class="nhs-data-row">
          <span class="nhs-data-label">Uptake Status:</span>
          <span class="nhs-data-value">${escapeHtml(covid.uptakeRate)}</span>
        </div>

        <h4>Eligible Groups for Autumn 2024 Booster:</h4>
        <ul class="nhs-checklist">
          ${covid.eligibleGroups.map(group => `<li>${escapeHtml(group)}</li>`).join('')}
        </ul>
        <p class="nhs-note">
          <strong>📅 Book Your Vaccination:</strong> ${escapeHtml(covid.bookingInfo)}
        </p>
      </div>
      <div class="nhs-health-card-footer">
        ${covid.links.map(link => `
          <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="nhs-link">
            <span>${escapeHtml(link.title)}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        `).join('')}
      </div>
    `;
  }

  function renderPandemicCard() {
    if (!elements.pandemicCard || !healthData.pandemicPreparedness) return;

    const pandemic = healthData.pandemicPreparedness;

    elements.pandemicCard.innerHTML = `
      <div class="nhs-health-card-icon">🛡️</div>
      <h3 class="nhs-health-card-title">UK Pandemic Preparedness</h3>
      <div class="nhs-health-card-content">
        <div class="nhs-status-banner nhs-status-banner--${pandemic.currentThreatLevel.toLowerCase().replace(' ', '-')}">
          <strong>Current Status:</strong> ${escapeHtml(pandemic.status)} 
          <span class="nhs-status-badge">${escapeHtml(pandemic.currentThreatLevel)}</span>
        </div>

        <h4>Key Preparedness Measures:</h4>
        <ul class="nhs-checklist">
          ${pandemic.keyMeasures.map(measure => `<li>${escapeHtml(measure)}</li>`).join('')}
        </ul>

        <h4>Protect Yourself & Others:</h4>
        <ul class="nhs-checklist">
          ${pandemic.publicGuidance.map(guidance => `<li>${escapeHtml(guidance)}</li>`).join('')}
        </ul>
      </div>
      <div class="nhs-health-card-footer">
        ${pandemic.links.map(link => `
          <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="nhs-link">
            <span>${escapeHtml(link.title)}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        `).join('')}
      </div>
    `;
  }

  function renderEmergencyBanner() {
    if (!elements.emergencyBanner || !healthData.emergencyContacts) return;

    const contacts = healthData.emergencyContacts;

    elements.emergencyBanner.innerHTML = `
      <div class="nhs-emergency-icon">⚠️</div>
      <div class="nhs-emergency-content">
        <h3>When to Seek Urgent Medical Help</h3>
        <div class="nhs-emergency-grid">
          <div class="nhs-emergency-item">
            <strong>Call ${escapeHtml(contacts.nhs111.number)}</strong>
            <p>${escapeHtml(contacts.nhs111.description)}</p>
            <span class="nhs-emergency-meta">${escapeHtml(contacts.nhs111.availability)}</span>
          </div>
          <div class="nhs-emergency-item nhs-emergency-item--critical">
            <strong>Call ${escapeHtml(contacts.nhs999.number)} or go to A&E</strong>
            <p>${escapeHtml(contacts.nhs999.description)}</p>
            <span class="nhs-emergency-meta">${escapeHtml(contacts.nhs999.availability)}</span>
          </div>
        </div>
        <div class="nhs-emergency-additional">
          <div class="nhs-emergency-extra">
            <strong>GP Surgery:</strong> ${escapeHtml(contacts.gpSurgery.description)}
          </div>
          <div class="nhs-emergency-extra">
            <strong>Local Pharmacy:</strong> ${escapeHtml(contacts.pharmacyAdvice.description)}
          </div>
        </div>
      </div>
    `;
  }

  function renderDisclaimer() {
    if (!elements.disclaimer || !healthData.disclaimer) return;

    elements.disclaimer.innerHTML = `
      <p>${escapeHtml(healthData.disclaimer)}</p>
      <p class="nhs-data-source">
        <strong>Data Source:</strong> ${escapeHtml(healthData.dataSource)}
      </p>
    `;
  }

  function updateLastUpdatedTime() {
    if (!elements.lastUpdated || !healthData.lastUpdated) return;

    const lastUpdated = new Date(healthData.lastUpdated);
    const formattedDate = lastUpdated.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    elements.lastUpdated.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      Last updated: ${formattedDate}
    `;
  }

  // ============================================================================
  // LOADING & ERROR STATES
  // ============================================================================
  function showLoadingState() {
    Object.values(elements).forEach(el => {
      if (el && el.id !== 'nhs-last-updated') {
        el.innerHTML = `
          <div class="nhs-loading">
            <div class="nhs-spinner"></div>
            <p>Loading NHS health updates...</p>
          </div>
        `;
      }
    });
  }

  function showErrorState() {
    Object.values(elements).forEach(el => {
      if (el && el.id !== 'nhs-last-updated') {
        el.innerHTML = `
          <div class="nhs-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>Unable to load NHS health data. Please check your internet connection or try again later.</p>
            <button onclick="location.reload()" class="nhs-retry-btn">Retry</button>
          </div>
        `;
      }
    });
  }

  // ============================================================================
  // AUTO REFRESH
  // ============================================================================
  function startAutoRefresh() {
    updateCheckInterval = setInterval(async () => {
      console.log('Checking for NHS health data updates...');
      await loadHealthData();
    }, CHECK_INTERVAL);
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  function getActivityLevelClass(level) {
    const levelMap = {
      'green': 'low',
      'amber': 'medium',
      'orange': 'high',
      'red': 'very-high'
    };
    return levelMap[level] || 'medium';
  }

  // ============================================================================
  // INIT ON DOM READY
  // ============================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (updateCheckInterval) {
      clearInterval(updateCheckInterval);
    }
  });

})();






