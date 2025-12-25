(function(){
  'use strict';

  // Tutorial Toggle
  const tutorialToggle = document.getElementById('tutorialToggle');
  const tutorialContent = document.getElementById('tutorialContent');
  
  if (tutorialToggle && tutorialContent) {
    tutorialToggle.addEventListener('click', function() {
      const isExpanded = tutorialToggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      
      tutorialToggle.setAttribute('aria-expanded', newState);
      tutorialContent.setAttribute('aria-hidden', !newState);
      
      // Smooth scroll to tutorial if opening
      if (newState) {
        setTimeout(() => {
          tutorialToggle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  }

  // Tutorial Close Button
  const tutorialClose = document.getElementById('tutorialClose');
  if (tutorialClose && tutorialContent) {
    tutorialClose.addEventListener('click', function() {
      tutorialToggle.setAttribute('aria-expanded', 'false');
      tutorialContent.setAttribute('aria-hidden', 'true');
    });
  }

  // Interactive Game
  const gameStartBtn = document.getElementById('gameStartBtn');
  const gameLogBtn = document.getElementById('gameLogBtn');
  const gameProgressFill = document.getElementById('gameProgressFill');
  const gameProgressText = document.getElementById('gameProgressText');
  const gameFeedback = document.getElementById('gameFeedback');
  const gameReset = document.getElementById('gameReset');

  let gameState = {
    step: 0,
    progress: 0,
    maxProgress: 3
  };

  function updateGameFeedback(message, type = 'info') {
    if (!gameFeedback) return;
    gameFeedback.textContent = message;
    gameFeedback.className = 'game-feedback ' + type;
    gameFeedback.setAttribute('aria-live', 'polite');
  }

  function updateGameProgress() {
    if (!gameProgressFill || !gameProgressText) return;
    const percent = (gameState.progress / gameState.maxProgress) * 100;
    gameProgressFill.style.width = percent + '%';
    gameProgressText.textContent = `Day ${gameState.progress} of ${gameState.maxProgress}`;
  }

  function resetGame() {
    gameState = {
      step: 0,
      progress: 0,
      maxProgress: 3
    };
    
    if (gameStartBtn) {
      gameStartBtn.classList.remove('completed');
      gameStartBtn.disabled = false;
      gameStartBtn.querySelector('.btn-text').style.display = 'inline';
      gameStartBtn.querySelector('.btn-check').style.display = 'none';
    }
    
    if (gameLogBtn) {
      gameLogBtn.classList.remove('completed');
      gameLogBtn.disabled = true;
      gameLogBtn.querySelector('.btn-text').style.display = 'inline';
      gameLogBtn.querySelector('.btn-check').style.display = 'none';
    }
    
    updateGameProgress();
    updateGameFeedback('Click the buttons in order: First start the breathing tool, then log your session!', 'info');
    
    if (gameReset) {
      gameReset.classList.add('hidden');
    }
  }

  if (gameStartBtn) {
    gameStartBtn.addEventListener('click', function() {
      if (gameState.step === 0) {
        gameState.step = 1;
        this.classList.add('completed');
        this.disabled = true;
        this.querySelector('.btn-text').style.display = 'none';
        this.querySelector('.btn-check').style.display = 'inline';
        
        if (gameLogBtn) {
          gameLogBtn.disabled = false;
          gameLogBtn.style.animation = 'pulse 1s ease-in-out 3';
        }
        
        updateGameFeedback('Great! You started the breathing tool. Now complete your session and click "Log session" to record your progress.', 'success');
        
        // Simulate breathing session completion after a delay
        setTimeout(() => {
          updateGameFeedback('Session complete! Now click "Log session" to save your progress.', 'info');
        }, 2000);
      }
    });
  }

  if (gameLogBtn) {
    gameLogBtn.addEventListener('click', function() {
      if (gameState.step === 1) {
        gameState.step = 2;
        gameState.progress++;
        this.classList.add('completed');
        this.disabled = true;
        this.querySelector('.btn-text').style.display = 'none';
        this.querySelector('.btn-check').style.display = 'inline';
        
        updateGameProgress();
        
        if (gameState.progress >= gameState.maxProgress) {
          updateGameFeedback('🎉 Amazing! You completed the challenge! Your stats would update automatically. Try this with real challenges below!', 'success');
          if (gameReset) {
            gameReset.classList.remove('hidden');
          }
        } else {
          updateGameFeedback(`Excellent! Progress saved. You're on day ${gameState.progress} of ${gameState.maxProgress}. Keep going!`, 'success');
          if (gameReset) {
            gameReset.classList.remove('hidden');
          }
        }
      }
    });
  }

  if (gameReset) {
    gameReset.addEventListener('click', resetGame);
  }

  // Auto-expand tutorial on first visit (optional)
  const tutorialSeen = sessionStorage.getItem('challengeTutorialSeen');
  if (!tutorialSeen && tutorialToggle && tutorialContent) {
    // Don't auto-expand, but could if desired
    // tutorialToggle.click();
  }

  // Mark as seen when closed
  if (tutorialClose) {
    tutorialClose.addEventListener('click', function() {
      sessionStorage.setItem('challengeTutorialSeen', 'true');
    });
  }

  // ============================================
  // REWARDS TUTORIAL FUNCTIONALITY
  // ============================================

  // Reward Tutorial Toggle
  const rewardTutorialToggle = document.getElementById('rewardTutorialToggle');
  const rewardTutorialContent = document.getElementById('rewardTutorialContent');
  
  if (rewardTutorialToggle && rewardTutorialContent) {
    rewardTutorialToggle.addEventListener('click', function() {
      const isExpanded = rewardTutorialToggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      
      rewardTutorialToggle.setAttribute('aria-expanded', newState);
      rewardTutorialContent.setAttribute('aria-hidden', !newState);
      
      // Smooth scroll to tutorial if opening
      if (newState) {
        setTimeout(() => {
          rewardTutorialToggle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  }

  // Reward Tutorial Close Button
  const rewardTutorialClose = document.getElementById('rewardTutorialClose');
  if (rewardTutorialClose && rewardTutorialContent) {
    rewardTutorialClose.addEventListener('click', function() {
      rewardTutorialToggle.setAttribute('aria-expanded', 'false');
      rewardTutorialContent.setAttribute('aria-hidden', 'true');
    });
  }

  // Interactive Badge Game
  const badgeGamePracticeBtn = document.getElementById('badgeGamePracticeBtn');
  const badgeGameLogBtn = document.getElementById('badgeGameLogBtn');
  const gameBadgeCard = document.getElementById('gameBadgeCard');
  const gameBadgeStatus = document.getElementById('gameBadgeStatus');
  const badgeGameFeedback = document.getElementById('badgeGameFeedback');
  const badgeGameReset = document.getElementById('badgeGameReset');

  let badgeGameState = {
    practiced: false,
    logged: false,
    unlocked: false
  };

  function updateBadgeGameFeedback(message, type = 'info') {
    if (!badgeGameFeedback) return;
    badgeGameFeedback.textContent = message;
    badgeGameFeedback.className = 'game-feedback ' + type;
    badgeGameFeedback.setAttribute('aria-live', 'polite');
  }

  function unlockBadge() {
    if (!gameBadgeCard || !gameBadgeStatus) return;
    
    gameBadgeCard.classList.add('unlocked');
    gameBadgeStatus.textContent = 'Unlocked';
    
    // Add sparkle effect
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.fontSize = '2rem';
    sparkle.style.animation = 'sparkle 1s ease-out';
    sparkle.style.pointerEvents = 'none';
    gameBadgeCard.style.position = 'relative';
    gameBadgeCard.appendChild(sparkle);
    
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 1000);
  }

  function resetBadgeGame() {
    badgeGameState = {
      practiced: false,
      logged: false,
      unlocked: false
    };
    
    if (badgeGamePracticeBtn) {
      badgeGamePracticeBtn.classList.remove('completed');
      badgeGamePracticeBtn.disabled = false;
      badgeGamePracticeBtn.querySelector('.btn-text').style.display = 'inline';
      badgeGamePracticeBtn.querySelector('.btn-check').style.display = 'none';
    }
    
    if (badgeGameLogBtn) {
      badgeGameLogBtn.classList.remove('completed');
      badgeGameLogBtn.disabled = true;
      badgeGameLogBtn.querySelector('.btn-text').style.display = 'inline';
      badgeGameLogBtn.querySelector('.btn-check').style.display = 'none';
    }
    
    if (gameBadgeCard) {
      gameBadgeCard.classList.remove('unlocked');
    }
    
    if (gameBadgeStatus) {
      gameBadgeStatus.textContent = 'Locked';
    }
    
    updateBadgeGameFeedback('Practice and log a session to unlock your first badge!', 'info');
    
    if (badgeGameReset) {
      badgeGameReset.classList.add('hidden');
    }
  }

  if (badgeGamePracticeBtn) {
    badgeGamePracticeBtn.addEventListener('click', function() {
      if (!badgeGameState.practiced) {
        badgeGameState.practiced = true;
        this.classList.add('completed');
        this.disabled = true;
        this.querySelector('.btn-text').style.display = 'none';
        this.querySelector('.btn-check').style.display = 'inline';
        
        if (badgeGameLogBtn) {
          badgeGameLogBtn.disabled = false;
          badgeGameLogBtn.style.animation = 'pulse 1s ease-in-out 3';
        }
        
        updateBadgeGameFeedback('Great! You completed a 1-minute practice. Now click "Log session" to unlock the badge!', 'success');
      }
    });
  }

  if (badgeGameLogBtn) {
    badgeGameLogBtn.addEventListener('click', function() {
      if (badgeGameState.practiced && !badgeGameState.logged) {
        badgeGameState.logged = true;
        badgeGameState.unlocked = true;
        
        this.classList.add('completed');
        this.disabled = true;
        this.querySelector('.btn-text').style.display = 'none';
        this.querySelector('.btn-check').style.display = 'inline';
        
        // Unlock the badge with animation
        setTimeout(() => {
          unlockBadge();
          updateBadgeGameFeedback('🎉 Congratulations! You unlocked your first badge! Badges unlock automatically when you meet the requirements.', 'success');
          
          if (badgeGameReset) {
            badgeGameReset.classList.remove('hidden');
          }
        }, 300);
      }
    });
  }

  if (badgeGameReset) {
    badgeGameReset.addEventListener('click', resetBadgeGame);
  }

  // Mark reward tutorial as seen when closed
  if (rewardTutorialClose) {
    rewardTutorialClose.addEventListener('click', function() {
      sessionStorage.setItem('rewardTutorialSeen', 'true');
    });
  }

})();

