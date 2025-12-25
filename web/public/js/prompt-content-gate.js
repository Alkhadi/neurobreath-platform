// =============================================
// PROMPT CONTENT GATE
// Gates PDF download and hides/locks prompt content until unlocked
// =============================================

(function() {
  'use strict';

  // PDF unlock requires:
  // - Mission 1: 2 regular prompt missions
  // - Mission 2: Complete ALL activities (mega-mission)
  // - Mission 3: 1 more regular prompt mission
  const REQUIRED_REGULAR_MISSIONS = 3; // 2 + 1 = 3 total regular missions
  const REQUIRED_MEGA_MISSION = true; // Must complete mega-mission

  // Initialize
  function init() {
    if (!window.PromptVault) {
      console.error('Prompt Content Gate: PromptVault not found');
      return;
    }

    // Wait for mega mission tracker to load
    setTimeout(() => {
      gatePDFDownload();
      lockPromptCards();
    }, 300);
    
    // Re-check on state changes
    window.addEventListener('prompt-vault:state-change', () => {
      gatePDFDownload();
      lockPromptCards();
    });
    
    window.addEventListener('mega-mission:state-change', () => {
      gatePDFDownload();
    });
  }

  // Gate PDF download
  function gatePDFDownload() {
    const pdfPanel = document.querySelector('.pdf-panel');
    if (!pdfPanel) return;

    const downloadLink = pdfPanel.querySelector('a[download]');
    const pdfEmbed = pdfPanel.querySelector('object[data*=".pdf"]');
    
    if (!downloadLink) return;

    const state = window.PromptVault.getState();
    const completedMissions = state.missionHistory?.length || 0;
    
    // Check if mega-mission is complete
    const megaMissionComplete = window.MegaMissionTracker ? 
      window.MegaMissionTracker.isMegaMissionComplete() : false;
    
    // Check if regular missions requirement is met
    const regularMissionsMet = completedMissions >= REQUIRED_REGULAR_MISSIONS;
    
    // PDF unlock requires BOTH: regular missions AND mega-mission
    const canDownloadPDF = regularMissionsMet && megaMissionComplete;

    if (canDownloadPDF) {
      // Already unlocked - ensure link is enabled
      downloadLink.style.opacity = '1';
      downloadLink.style.pointerEvents = 'auto';
      downloadLink.removeAttribute('disabled');
      
      // Remove any gate message
      const existingGate = pdfPanel.querySelector('.pdf-gate-message');
      if (existingGate) {
        existingGate.remove();
      }

      // Show PDF embed
      if (pdfEmbed) {
        pdfEmbed.style.display = 'block';
      }
    } else {
      // Lock the download
      downloadLink.style.opacity = '0.5';
      downloadLink.style.pointerEvents = 'none';
      downloadLink.setAttribute('disabled', 'disabled');

      // Hide PDF embed
      if (pdfEmbed) {
        pdfEmbed.style.display = 'none';
      }

      // Add gate message if not already present
      if (!pdfPanel.querySelector('.pdf-gate-message')) {
        const remainingRegularMissions = Math.max(0, REQUIRED_REGULAR_MISSIONS - completedMissions);
        const megaMissionStatus = megaMissionComplete ? '✓ Complete' : 'In Progress';
        
        const gateMessage = document.createElement('div');
        gateMessage.className = 'pdf-gate-message';
        gateMessage.innerHTML = `
          <div class="gate-content">
            <div class="gate-icon">🔒</div>
            <h3>Unlock Complete Prompt Collection PDF</h3>
            <div class="gate-requirements">
              <p><strong>To unlock, you must complete:</strong></p>
              <ol class="gate-requirements-list">
                <li class="${completedMissions >= REQUIRED_REGULAR_MISSIONS ? 'complete' : ''}">
                  <span class="req-check">${completedMissions >= REQUIRED_REGULAR_MISSIONS ? '✓' : '○'}</span>
                  <span>${REQUIRED_REGULAR_MISSIONS} regular prompt missions</span>
                  <span class="req-progress">(${completedMissions}/${REQUIRED_REGULAR_MISSIONS})</span>
                </li>
                <li class="${megaMissionComplete ? 'complete' : ''}">
                  <span class="req-check">${megaMissionComplete ? '✓' : '○'}</span>
                  <span>Complete ALL website activities (Ultimate Challenge)</span>
                  <span class="req-progress">${megaMissionStatus}</span>
                </li>
              </ol>
            </div>
            ${!megaMissionComplete ? `
              <p class="gate-hint">Complete ALL breathing techniques, focus games, challenges, and activities shown in the Ultimate Challenge panel below.</p>
            ` : ''}
            <div class="gate-actions">
              ${remainingRegularMissions > 0 ? `
                <button class="btn btn-primary start-mission-from-pdf-btn">Complete Regular Missions</button>
              ` : ''}
              ${!megaMissionComplete ? `
                <button class="btn btn-primary start-mega-mission-btn">View Ultimate Challenge</button>
              ` : ''}
            </div>
          </div>
        `;

        // Insert before download link
        downloadLink.parentNode.insertBefore(gateMessage, downloadLink);

        // Setup buttons
        gateMessage.querySelector('.start-mission-from-pdf-btn')?.addEventListener('click', () => {
          const missionPanel = document.getElementById('daily-mission-panel');
          if (missionPanel) {
            missionPanel.scrollIntoView({ behavior: 'smooth' });
          }
        });
        
        gateMessage.querySelector('.start-mega-mission-btn')?.addEventListener('click', () => {
          const megaPanel = document.getElementById('mega-mission-panel');
          if (megaPanel) {
            megaPanel.scrollIntoView({ behavior: 'smooth' });
          }
        });
      } else {
        // Update existing message
        const remainingRegularMissions = Math.max(0, REQUIRED_REGULAR_MISSIONS - completedMissions);
        const megaMissionStatus = megaMissionComplete ? '✓ Complete' : 'In Progress';
        const gateMessage = pdfPanel.querySelector('.pdf-gate-message');
        
        // Update requirement list
        const reqItems = gateMessage?.querySelectorAll('.gate-requirements-list li');
        if (reqItems && reqItems.length >= 2) {
          // Update regular missions
          const regularItem = reqItems[0];
          const regularComplete = completedMissions >= REQUIRED_REGULAR_MISSIONS;
          regularItem.classList.toggle('complete', regularComplete);
          regularItem.querySelector('.req-check').textContent = regularComplete ? '✓' : '○';
          regularItem.querySelector('.req-progress').textContent = `(${completedMissions}/${REQUIRED_REGULAR_MISSIONS})`;
          
          // Update mega-mission
          const megaItem = reqItems[1];
          megaItem.classList.toggle('complete', megaMissionComplete);
          megaItem.querySelector('.req-check').textContent = megaMissionComplete ? '✓' : '○';
          megaItem.querySelector('.req-progress').textContent = megaMissionStatus;
        }
      }

      // Override download click
      downloadLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!megaMissionComplete) {
          const megaPanel = document.getElementById('mega-mission-panel');
          if (megaPanel) {
            megaPanel.scrollIntoView({ behavior: 'smooth' });
          } else {
            alert('Complete the Ultimate Challenge (all website activities) and regular missions to unlock the PDF.');
          }
        } else if (completedMissions < REQUIRED_REGULAR_MISSIONS) {
          const missionPanel = document.getElementById('daily-mission-panel');
          if (missionPanel) {
            missionPanel.scrollIntoView({ behavior: 'smooth' });
          } else {
            alert(`Complete ${REQUIRED_REGULAR_MISSIONS - completedMissions} more regular mission(s) to unlock the PDF.`);
          }
        }
        return false;
      }, { capture: true });
    }
  }

  // Lock prompt cards until unlocked
  function lockPromptCards() {
    const cards = document.querySelectorAll('.prompt-card[data-card-id], .prompt-card .card-prompt-box');
    
    // Lock ALL prompt boxes by default
    cards.forEach(card => {
      const cardId = card.getAttribute('data-card-id') || 
                    card.closest('.prompt-card')?.getAttribute('data-card-id') ||
                    card.id;
      
      if (!cardId) return;

      // Check if unlocked (default to false - all prompts locked by default)
      let isUnlocked = false;
      if (window.PromptVault && window.PromptVault.isUnlocked) {
        try {
          isUnlocked = window.PromptVault.isUnlocked(cardId);
        } catch (e) {
          // If error, default to locked
          isUnlocked = false;
        }
      }
      
      const promptCard = card.classList.contains('prompt-card') ? card : card.closest('.prompt-card');
      if (!promptCard) return;
      
      const promptBox = promptCard.querySelector('.card-prompt-box');
      const copyBtn = promptCard.querySelector('.copy-btn');

      if (!isUnlocked) {
        // Lock the card
        card.classList.add('locked-prompt-card');
        
        // Hide prompt text
        if (promptBox) {
          promptBox.style.display = 'none';
          
          // Add locked placeholder
          if (!promptBox.nextElementSibling?.classList.contains('locked-placeholder')) {
            const placeholder = document.createElement('div');
            placeholder.className = 'locked-placeholder';
            placeholder.innerHTML = `
              <div class="locked-message">
                <div class="locked-icon">🔒</div>
                <p>Complete a mission to unlock this prompt</p>
                <button class="btn btn-primary unlock-prompt-btn" data-prompt-id="${cardId}">
                  Start Mission to Unlock
                </button>
              </div>
            `;
            promptBox.parentNode.insertBefore(placeholder, promptBox.nextSibling);

            // Setup unlock button
            placeholder.querySelector('.unlock-prompt-btn')?.addEventListener('click', (e) => {
              e.stopPropagation();
              if (window.PromptMissions && window.PromptMissions.showMission) {
                window.PromptMissions.showMission(cardId);
              } else {
                // Fallback: scroll to daily mission panel
                const missionPanel = document.getElementById('daily-mission-panel');
                if (missionPanel) {
                  missionPanel.scrollIntoView({ behavior: 'smooth' });
                }
              }
            });
          }
        }
        
        // Also hide the actual prompt box content
        if (promptBox) {
          const originalText = promptBox.textContent;
          promptBox.dataset.originalText = originalText; // Store for later
          promptBox.textContent = ''; // Clear content
        }

        // Disable/hide copy button
        if (copyBtn) {
          copyBtn.style.display = 'none';
          copyBtn.disabled = true;
          copyBtn.setAttribute('aria-disabled', 'true');
        }

        // Prevent card expansion to show prompt
        const header = card.querySelector('.card-header');
        if (header) {
          // Remove original onclick
          header.removeAttribute('onclick');
          
          // Override header click
          const handleHeaderClick = (e) => {
            // Don't expand locked cards
            const isAlreadyExpanded = card.classList.contains('expanded');
            if (!isAlreadyExpanded) {
              // Show mission prompt instead
              if (window.PromptMissions) {
                window.PromptMissions.showMission(cardId);
              }
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          };
          
          // Remove any existing listeners and add new one
          header.removeEventListener('click', handleHeaderClick);
          header.addEventListener('click', handleHeaderClick, { capture: true });
          
          // Also prevent default toggleCard behavior
          if (typeof toggleCard === 'function') {
            // We've already overridden, but just in case
          }
        }
      } else {
        // Unlocked - show content
        card.classList.remove('locked-prompt-card');
        
        if (promptBox) {
          promptBox.style.display = 'block';
          promptBox.style.visibility = 'visible';
          promptBox.style.height = 'auto';
          promptBox.style.overflow = 'visible';
          promptBox.style.position = 'static';
          promptBox.style.left = 'auto';
          
          // Restore original text if stored
          if (promptBox.dataset.originalText) {
            promptBox.textContent = promptBox.dataset.originalText;
            delete promptBox.dataset.originalText;
          }
          
          // Remove locked placeholder
          const placeholder = promptBox.nextElementSibling;
          if (placeholder?.classList.contains('locked-placeholder')) {
            placeholder.remove();
          }
        }

        if (copyBtn) {
          copyBtn.style.display = 'inline-block';
          copyBtn.disabled = false;
          copyBtn.removeAttribute('aria-disabled');
        }

        // Restore card expansion
        const header = card.querySelector('.card-header');
        if (header && !header.hasAttribute('data-original-onclick')) {
          // Restore original behavior - but we'll handle via integration script
          // For now, just allow expansion
        }
      }
    });
  }

  // Public API
  window.PromptContentGate = {
    init,
    gatePDFDownload,
    lockPromptCards
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 200); // Delay to ensure PromptVault is loaded
  }
})();

