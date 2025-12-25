// =============================================
// NeuroBreath – Gamified Breathing Mini-Games
// Interactive breathing exercises with visual feedback
// =============================================

(function() {
  'use strict';

  const GAMES = {
    calmBubble: {
      name: 'Calm Bubble',
      description: 'Breathe with the bubbles. Watch them grow and shrink with your breath.',
      icon: '🫧'
    },
    dragonCalm: {
      name: 'Dragon Calm',
      description: 'Help the dragon find peace. Your steady breathing calms the dragon.',
      icon: '🐉'
    },
    balloonFloat: {
      name: 'Balloon Float',
      description: 'Float your balloon up and down with your breath.',
      icon: '🎈'
    }
  };

  // Game state
  let currentGame = null;
  let gameContainer = null;
  let isRunning = false;
  let isPaused = false;
  let lowStimMode = false;
  let animationFrameId = null;
  let currentPhase = 'inhale';
  let phaseStartTime = 0;
  let pauseStartedAt = 0;
  let cycleCount = 0;
  let totalCycles = 4;

  // Focus-screen mode (fullscreen, distraction-free)
  let focusModeActive = false;
  let onEscKeydown = null;
  let focusRestore = null;

  // Breathing pattern configuration
  let breathingPattern = {
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0
  };

  // Check for low-stimulation mode preference
  function checkLowStimMode() {
    const body = document.body;
    lowStimMode = body.classList.contains('low-stim-mode') || 
                  localStorage.getItem('nb_low_stim_mode') === 'true';
  }

  function ensureFocusControls() {
    if (!gameContainer) return;
    if (document.getElementById('nb-focus-controls')) return;

    const wrap = document.createElement('div');
    wrap.id = 'nb-focus-controls';
    wrap.className = 'nb-focus-controls';

    const stopBtn = document.createElement('button');
    stopBtn.type = 'button';
    stopBtn.id = 'nb-focus-stop-btn';
    stopBtn.className = 'btn btn-secondary';
    stopBtn.textContent = 'Stop';
    stopBtn.setAttribute('aria-label', 'Stop breathing game');
    stopBtn.addEventListener('click', () => {
      stopGame({ exitFocus: false });
    });

    const exitBtn = document.createElement('button');
    exitBtn.type = 'button';
    exitBtn.id = 'nb-focus-exit-btn';
    exitBtn.className = 'btn btn-secondary';
    exitBtn.textContent = 'Exit focus';
    exitBtn.setAttribute('aria-label', 'Exit focus screen');
    exitBtn.addEventListener('click', () => exitFocusScreen());

    wrap.appendChild(stopBtn);
    wrap.appendChild(exitBtn);
    gameContainer.appendChild(wrap);
  }

  function enterFocusScreen() {
    if (focusModeActive) return;
    if (!gameContainer || !document.body) return;

    focusModeActive = true;
    document.body.classList.add('nb-focus-screen');

    // Important: move the focus container to <body> so `position: fixed`
    // is not constrained by ancestor transforms (e.g. `.card:hover { transform: ... }`).
    if (!focusRestore && gameContainer.parentNode) {
      focusRestore = {
        parent: gameContainer.parentNode,
        nextSibling: gameContainer.nextSibling
      };
    }
    if (gameContainer.parentNode !== document.body) {
      document.body.appendChild(gameContainer);
    }

    gameContainer.classList.add('is-focus');

    ensureFocusControls();

    if (!onEscKeydown) {
      onEscKeydown = (e) => {
        if (e.key === 'Escape') {
          exitFocusScreen();
        }
      };
      document.addEventListener('keydown', onEscKeydown, true);
    }

    const focusBtn = document.getElementById('nb-focus-exit-btn');
    if (focusBtn && typeof focusBtn.focus === 'function') {
      focusBtn.focus();
    }
  }

  function exitFocusScreen() {
    if (!focusModeActive) return;

    focusModeActive = false;
    if (document.body) document.body.classList.remove('nb-focus-screen');
    if (gameContainer) gameContainer.classList.remove('is-focus');

    const controls = document.getElementById('nb-focus-controls');
    if (controls) controls.remove();

    if (onEscKeydown) {
      document.removeEventListener('keydown', onEscKeydown, true);
      onEscKeydown = null;
    }

    // Restore the game container back to where it came from.
    if (focusRestore && gameContainer) {
      const { parent, nextSibling } = focusRestore;
      if (parent) {
        if (nextSibling && nextSibling.parentNode === parent) {
          parent.insertBefore(gameContainer, nextSibling);
        } else {
          parent.appendChild(gameContainer);
        }
      }
      focusRestore = null;
    }
  }

  // Create game container
  function createGameContainer(gameType) {
    const container = document.createElement('div');
    container.className = 'breathing-game-container';
    container.setAttribute('role', 'application');
    container.setAttribute('aria-label', `${GAMES[gameType].name} breathing game`);

    const gameArea = document.createElement('div');
    gameArea.className = 'breathing-game-area';
    gameArea.setAttribute('id', `game-${gameType}`);

    const controls = document.createElement('div');
    controls.className = 'breathing-game-controls';
    controls.innerHTML = `
      <div class="game-status" aria-live="polite">
        <span class="game-phase" id="game-phase">Ready</span>
        <span class="game-countdown" id="game-countdown"></span>
      </div>
      <div class="game-progress">
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
        <div class="cycle-counter">
          Cycle <span id="cycle-current">0</span> of <span id="cycle-total">${totalCycles}</span>
        </div>
      </div>
      <div class="game-actions">
        <button type="button" class="btn btn-primary" id="game-start-btn" aria-label="Start breathing game">
          Start
        </button>
        <button type="button" class="btn btn-secondary" id="game-pause-btn" style="display: none;" aria-label="Pause">
          Pause
        </button>
        <button type="button" class="btn btn-secondary" id="game-stop-btn" style="display: none;" aria-label="Stop">
          Stop
        </button>
        <label class="low-stim-toggle">
          <input type="checkbox" id="low-stim-checkbox" aria-label="Low stimulation mode">
          <span>Low stimulation mode</span>
        </label>
      </div>
    `;

    container.appendChild(gameArea);
    container.appendChild(controls);

    return container;
  }

  // Calm Bubble game
  function renderCalmBubble(progress, phase) {
    const gameArea = document.getElementById('game-calmBubble');
    if (!gameArea) return;

    const minSize = focusModeActive ? 90 : 50;
    const sizeRange = focusModeActive ? 240 : 150;
    const size = minSize + (progress * sizeRange);
    const opacity = 0.3 + (progress * 0.7);
    const color = phase === 'inhale' ? '#A8C5D8' : 
                  phase === 'hold1' ? '#9DB4A0' : 
                  phase === 'exhale' ? '#B8A9C9' : '#C4D4C5';

    if (lowStimMode) {
      gameArea.innerHTML = `
        <div class="bubble-static" style="width: ${size}px; height: ${size}px; background: ${color}; opacity: ${opacity};">
          <span class="bubble-label">${phase === 'inhale' ? 'Inhale' : phase === 'exhale' ? 'Exhale' : 'Hold'}</span>
        </div>
      `;
    } else {
      gameArea.innerHTML = `
        <div class="bubble-animated" style="width: ${size}px; height: ${size}px; background: ${color}; opacity: ${opacity};">
          <span class="bubble-label">${phase === 'inhale' ? 'Inhale' : phase === 'exhale' ? 'Exhale' : 'Hold'}</span>
        </div>
      `;
    }
  }

  // Dragon Calm game
  function renderDragonCalm(progress, phase) {
    const gameArea = document.getElementById('game-dragonCalm');
    if (!gameArea) return;

    const calmLevel = phase === 'exhale' ? progress : 1 - progress;
    let scale = 0.8 + (calmLevel * 0.2);
    if (focusModeActive) scale *= 1.25;
    const colorIntensity = Math.floor(calmLevel * 100);

    if (lowStimMode) {
      gameArea.innerHTML = `
        <div class="dragon-static" style="transform: scale(${scale});">
          <div class="dragon-body" style="background: hsl(200, ${colorIntensity}%, 60%);">
            <span class="dragon-label">${phase === 'inhale' ? 'Breathe in...' : phase === 'exhale' ? 'Breathe out...' : 'Hold...'}</span>
          </div>
        </div>
      `;
    } else {
      gameArea.innerHTML = `
        <div class="dragon-animated" style="transform: scale(${scale});">
          <div class="dragon-body" style="background: hsl(200, ${colorIntensity}%, 60%);">
            <span class="dragon-label">${phase === 'inhale' ? 'Breathe in...' : phase === 'exhale' ? 'Breathe out...' : 'Hold...'}</span>
          </div>
        </div>
      `;
    }
  }

  // Balloon Float game
  function renderBalloonFloat(progress, phase) {
    const gameArea = document.getElementById('game-balloonFloat');
    if (!gameArea) return;

    const height = phase === 'inhale' ? 82 - (progress * 42) : 38 + (progress * 42); // Keep within the viewport in focus mode
    const minSize = focusModeActive ? 100 : 60;
    const sizeRange = focusModeActive ? 80 : 40;
    const size = minSize + (progress * sizeRange);

    if (lowStimMode) {
      gameArea.innerHTML = `
        <div class="balloon-static" style="bottom: ${height}%; width: ${size}px; height: ${size}px;">
          <span class="balloon-label">${phase === 'inhale' ? 'Up' : phase === 'exhale' ? 'Down' : 'Hold'}</span>
        </div>
      `;
    } else {
      gameArea.innerHTML = `
        <div class="balloon-animated" style="bottom: ${height}%; width: ${size}px; height: ${size}px;">
          <span class="balloon-label">${phase === 'inhale' ? 'Up' : phase === 'exhale' ? 'Down' : 'Hold'}</span>
        </div>
      `;
    }
  }

  // Update game visuals
  function updateGameVisuals() {
    if (!isRunning || isPaused || !currentGame) return;

    const now = Date.now();
    const elapsed = (now - phaseStartTime) / 1000;
    let phaseDuration = 0;
    let nextPhase = null;

    // Determine current phase and duration
    if (currentPhase === 'inhale') {
      phaseDuration = breathingPattern.inhale;
      nextPhase = breathingPattern.hold1 > 0 ? 'hold1' : 'exhale';
    } else if (currentPhase === 'hold1') {
      phaseDuration = breathingPattern.hold1;
      nextPhase = 'exhale';
    } else if (currentPhase === 'exhale') {
      phaseDuration = breathingPattern.exhale;
      nextPhase = breathingPattern.hold2 > 0 ? 'hold2' : 'inhale';
    } else if (currentPhase === 'hold2') {
      phaseDuration = breathingPattern.hold2;
      nextPhase = 'inhale';
    }

    const progress = Math.min(1, elapsed / phaseDuration);
    const remaining = Math.max(0, phaseDuration - elapsed);

    // Update UI
    const phaseEl = document.getElementById('game-phase');
    const countdownEl = document.getElementById('game-countdown');
    const progressFill = document.getElementById('progress-fill');
    const cycleCurrent = document.getElementById('cycle-current');

    if (phaseEl) {
      const phaseLabels = {
        inhale: 'Inhale',
        hold1: 'Hold',
        exhale: 'Exhale',
        hold2: 'Hold'
      };
      phaseEl.textContent = phaseLabels[currentPhase] || 'Ready';
    }

    if (countdownEl) {
      countdownEl.textContent = Math.ceil(remaining) > 0 ? `${Math.ceil(remaining)}s` : '';
    }

    if (progressFill) {
      progressFill.style.width = `${progress * 100}%`;
      progressFill.setAttribute('aria-valuenow', Math.round(progress * 100));
    }

    if (cycleCurrent) {
      cycleCurrent.textContent = cycleCount;
    }

    // Render game-specific visuals
    if (currentGame === 'calmBubble') {
      renderCalmBubble(progress, currentPhase);
    } else if (currentGame === 'dragonCalm') {
      renderDragonCalm(progress, currentPhase);
    } else if (currentGame === 'balloonFloat') {
      renderBalloonFloat(progress, currentPhase);
    }

    // Move to next phase
    if (elapsed >= phaseDuration) {
      if (nextPhase === 'inhale' && currentPhase !== 'inhale') {
        // Completed a cycle
        cycleCount++;
        if (cycleCount >= totalCycles) {
          finishGame();
          return;
        }
      }
      currentPhase = nextPhase;
      phaseStartTime = now;
    }

    animationFrameId = requestAnimationFrame(updateGameVisuals);
  }

  // Start game
  function startGame(gameType, pattern = null, cycles = 4) {
    if (isRunning) stopGame();

    currentGame = gameType;
    totalCycles = Math.max(1, cycles);
    cycleCount = 0;
    currentPhase = 'inhale';
    phaseStartTime = Date.now();
    isRunning = true;
    isPaused = false;
    pauseStartedAt = 0;

    if (pattern) {
      breathingPattern = Object.assign({}, breathingPattern, pattern);
    }

    checkLowStimMode();

    // Distraction-free focus screen when the user starts.
    enterFocusScreen();

    // Update UI
    const startBtn = document.getElementById('game-start-btn');
    const pauseBtn = document.getElementById('game-pause-btn');
    const stopBtn = document.getElementById('game-stop-btn');
    const cycleTotal = document.getElementById('cycle-total');

    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-block';
    if (stopBtn) stopBtn.style.display = 'inline-block';
    if (cycleTotal) cycleTotal.textContent = totalCycles;

    updateGameVisuals();
  }

  // Pause/Resume game
  function pauseGame() {
    if (!isRunning) return;
    isPaused = !isPaused;

    const pauseBtn = document.getElementById('game-pause-btn');
    if (pauseBtn) {
      pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
      pauseBtn.setAttribute('aria-label', isPaused ? 'Resume' : 'Pause');
    }

    if (isPaused) {
      pauseStartedAt = Date.now();
      return;
    }

    if (pauseStartedAt) {
      const pausedFor = Date.now() - pauseStartedAt;
      phaseStartTime += pausedFor;
      pauseStartedAt = 0;
    }

    updateGameVisuals();
  }

  // Stop game
  function stopGame(options = {}) {
    const shouldExitFocus = options.exitFocus !== false;

    isRunning = false;
    isPaused = false;
    pauseStartedAt = 0;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    // Reset UI
    const startBtn = document.getElementById('game-start-btn');
    const pauseBtn = document.getElementById('game-pause-btn');
    const stopBtn = document.getElementById('game-stop-btn');
    const phaseEl = document.getElementById('game-phase');
    const countdownEl = document.getElementById('game-countdown');
    const progressFill = document.getElementById('progress-fill');
    const cycleCurrent = document.getElementById('cycle-current');

    if (startBtn) startBtn.style.display = 'inline-block';
    if (pauseBtn) {
      pauseBtn.style.display = 'none';
      pauseBtn.textContent = 'Pause';
      pauseBtn.setAttribute('aria-label', 'Pause');
    }
    if (stopBtn) stopBtn.style.display = 'none';
    if (phaseEl) phaseEl.textContent = 'Ready';
    if (countdownEl) countdownEl.textContent = '';
    if (cycleCurrent) cycleCurrent.textContent = '0';
    if (progressFill) {
      progressFill.style.width = '0%';
      progressFill.setAttribute('aria-valuenow', 0);
    }

    // Clear game area
    const gameArea = document.getElementById(`game-${currentGame}`);
    if (gameArea) gameArea.innerHTML = '';

    currentGame = null;

    if (shouldExitFocus) {
      exitFocusScreen();
    }
  }

  // Finish game (completed all cycles)
  function finishGame() {
    const completedGame = currentGame;
    const completedCycles = totalCycles;
    const completedPattern = Object.assign({}, breathingPattern);

    // Keep focus screen so the completion message is distraction-free.
    stopGame({ exitFocus: false });

    // Record activity
    if (window.NBProgressTracker) {
      const minutes = Math.ceil((completedCycles * (
        completedPattern.inhale + 
        completedPattern.hold1 + 
        completedPattern.exhale + 
        completedPattern.hold2
      )) / 60);
      
      window.NBProgressTracker.recordBreathing({
        minutes,
        name: GAMES[completedGame]?.name || 'Breathing game',
        points: completedCycles * 10, // 10 points per cycle
        pageId: 'breathing-game'
      });
    }

    // Show completion message
    const gameArea = document.getElementById(`game-${completedGame}`);
    if (gameArea) {
      gameArea.innerHTML = `
        <div class="game-complete" role="alert">
          <div class="complete-icon">✨</div>
          <h3>Well done!</h3>
          <p>You completed ${completedCycles} breathing cycle${completedCycles !== 1 ? 's' : ''}.</p>
          <p class="complete-message">Great steady breathing!</p>
        </div>
      `;
    }

    // Dispatch completion event
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('nb:game-complete', {
        detail: {
          gameType: completedGame,
          cycles: completedCycles,
          pattern: completedPattern
        }
      }));
    }
  }

  // Initialize game in a container
  function initGame(containerId, gameType, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Breathing game: Container ${containerId} not found`);
      return;
    }

    // If a previous game was in focus mode, restore normal layout first.
    exitFocusScreen();

    // Create game UI
    gameContainer = createGameContainer(gameType);
    container.innerHTML = '';
    container.appendChild(gameContainer);

    // Setup event listeners
    const startBtn = document.getElementById('game-start-btn');
    const pauseBtn = document.getElementById('game-pause-btn');
    const stopBtn = document.getElementById('game-stop-btn');
    const lowStimCheckbox = document.getElementById('low-stim-checkbox');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const pattern = options.pattern || null;
        const cycles = options.cycles || 4;
        startGame(gameType, pattern, cycles);
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', pauseGame);
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', stopGame);
    }

    if (lowStimCheckbox) {
      lowStimCheckbox.checked = lowStimMode;
      lowStimCheckbox.addEventListener('change', (e) => {
        lowStimMode = e.target.checked;
        localStorage.setItem('nb_low_stim_mode', lowStimMode ? 'true' : 'false');
        if (document.body) {
          if (lowStimMode) {
            document.body.classList.add('low-stim-mode');
          } else {
            document.body.classList.remove('low-stim-mode');
          }
        }
      });
    }

    checkLowStimMode();
  }

  // Export public API
  window.NBBreathingGames = {
    init: initGame,
    start: startGame,
    pause: pauseGame,
    stop: stopGame,
    GAMES,
    isRunning: () => isRunning,
    getCurrentGame: () => currentGame
  };

})();
