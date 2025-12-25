// =============================================
// NeuroBreath – Focus & Regulation Mini-Games
// Interactive focus training with gentle feedback
// =============================================

(function() {
  'use strict';

  const GAMES = {
    focusQuest: {
      name: 'Focus Quest',
      description: 'Complete short focus drills with calm feedback. Build your attention skills gently.',
      icon: '🎯',
      duration: 60 // seconds
    },
    spotTarget: {
      name: 'Spot the Target',
      description: 'Find and click the target. Practice sustained attention.',
      icon: '🔍',
      duration: 90
    },
    reactionChallenge: {
      name: 'Reaction Challenge',
      description: 'Respond when you see the signal. No pressure, just practice.',
      icon: '⚡',
      duration: 120
    }
  };

  let currentGame = null;
  let gameContainer = null;
  let isRunning = false;
  let isPaused = false;
  let score = 0;
  let startTime = 0;
  let elapsedTime = 0;
  let gameTimer = null;
  let lowStimMode = false;

  // Check for low-stimulation mode
  function checkLowStimMode() {
    const body = document.body;
    lowStimMode = body.classList.contains('low-stim-mode') || 
                  localStorage.getItem('nb_low_stim_mode') === 'true';
  }

  // Create game container
  function createGameContainer(gameType) {
    const container = document.createElement('div');
    container.className = 'focus-game-container';
    container.setAttribute('role', 'application');
    container.setAttribute('aria-label', `${GAMES[gameType].name} focus game`);

    const gameArea = document.createElement('div');
    gameArea.className = 'focus-game-area';
    gameArea.setAttribute('id', `focus-game-${gameType}`);

    const controls = document.createElement('div');
    controls.className = 'focus-game-controls';
    controls.innerHTML = `
      <div class="game-stats" aria-live="polite">
        <div class="stat-item">
          <span class="stat-label">Score</span>
          <span class="stat-value" id="focus-score">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Time</span>
          <span class="stat-value" id="focus-time">0s</span>
        </div>
      </div>
      <div class="game-progress">
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="progress-fill" id="focus-progress-fill"></div>
        </div>
      </div>
      <div class="game-actions">
        <button type="button" class="btn btn-primary" id="focus-start-btn" aria-label="Start focus game">
          Start
        </button>
        <button type="button" class="btn btn-secondary" id="focus-pause-btn" style="display: none;" aria-label="Pause">
          Pause
        </button>
        <button type="button" class="btn btn-secondary" id="focus-stop-btn" style="display: none;" aria-label="Stop">
          Stop
        </button>
        <label class="low-stim-toggle">
          <input type="checkbox" id="focus-low-stim-checkbox" aria-label="Low stimulation mode">
          <span>Low stimulation mode</span>
        </label>
      </div>
      <div class="game-instructions" id="focus-instructions"></div>
    `;

    container.appendChild(gameArea);
    container.appendChild(controls);

    return container;
  }

  // Focus Quest game logic
  function runFocusQuest() {
    const gameArea = document.getElementById(`focus-game-${currentGame}`);
    if (!gameArea || !isRunning || isPaused) return;

    const tasks = [
      { text: 'Count to 5 slowly', duration: 5000 },
      { text: 'Name 3 things you can see', duration: 8000 },
      { text: 'Take 2 deep breaths', duration: 10000 },
      { text: 'Focus on this dot: •', duration: 6000 },
      { text: 'Think of one calming word', duration: 7000 }
    ];

    let taskIndex = 0;
    let taskStartTime = Date.now();

    function showNextTask() {
      if (!isRunning || isPaused) return;

      if (taskIndex >= tasks.length) {
        // Completed all tasks
        finishGame();
        return;
      }

      const task = tasks[taskIndex];
      taskStartTime = Date.now();

      if (gameArea) {
        gameArea.innerHTML = `
          <div class="focus-task ${lowStimMode ? 'low-stim' : ''}">
            <div class="task-text">${task.text}</div>
            <div class="task-timer" id="task-timer">${Math.ceil(task.duration / 1000)}s</div>
          </div>
        `;
      }

      // Update task timer
      const timerInterval = setInterval(() => {
        if (!isRunning || isPaused) {
          clearInterval(timerInterval);
          return;
        }

        const elapsed = Date.now() - taskStartTime;
        const remaining = Math.max(0, task.duration - elapsed);
        const timerEl = document.getElementById('task-timer');
        if (timerEl) {
          timerEl.textContent = `${Math.ceil(remaining / 1000)}s`;
        }

        if (remaining <= 0) {
          clearInterval(timerInterval);
          score += 10; // 10 points per completed task
          updateScore();
          taskIndex++;
          setTimeout(showNextTask, 500);
        }
      }, 100);
    }

    showNextTask();
  }

  // Spot Target game logic
  function runSpotTarget() {
    const gameArea = document.getElementById(`focus-game-${currentGame}`);
    if (!gameArea || !isRunning || isPaused) return;

    let targetVisible = false;
    let targetElement = null;
    let spawnInterval = null;

    function spawnTarget() {
      if (!isRunning || isPaused || targetVisible) return;

      const area = gameArea.getBoundingClientRect();
      const size = lowStimMode ? 80 : 60;
      const x = Math.random() * (area.width - size);
      const y = Math.random() * (area.height - size);

      targetElement = document.createElement('div');
      targetElement.className = `focus-target ${lowStimMode ? 'low-stim' : ''}`;
      targetElement.style.left = `${x}px`;
      targetElement.style.top = `${y}px`;
      targetElement.style.width = `${size}px`;
      targetElement.style.height = `${size}px`;
      targetElement.setAttribute('role', 'button');
      targetElement.setAttribute('aria-label', 'Click target');
      targetElement.setAttribute('tabindex', '0');

      targetElement.addEventListener('click', hitTarget);
      targetElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          hitTarget();
        }
      });

      gameArea.appendChild(targetElement);
      targetVisible = true;

      // Auto-remove after 3 seconds if not clicked
      setTimeout(() => {
        if (targetElement && targetElement.parentNode) {
          targetElement.remove();
          targetVisible = false;
        }
      }, 3000);
    }

    function hitTarget() {
      if (!targetElement || !isRunning) return;

      score += 5;
      updateScore();
      targetElement.remove();
      targetVisible = false;

      // Show positive feedback
      const feedback = document.createElement('div');
      feedback.className = 'focus-feedback';
      feedback.textContent = 'Nice!';
      gameArea.appendChild(feedback);
      setTimeout(() => feedback.remove(), 1000);
    }

    // Spawn targets every 2-4 seconds
    spawnInterval = setInterval(() => {
      if (isRunning && !isPaused) {
        spawnTarget();
      }
    }, 2000 + Math.random() * 2000);

    // Initial target
    setTimeout(spawnTarget, 1000);
  }

  // Reaction Challenge game logic
  function runReactionChallenge() {
    const gameArea = document.getElementById(`focus-game-${currentGame}`);
    if (!gameArea || !isRunning || isPaused) return;

    let signalVisible = false;
    let signalElement = null;
    let signalStartTime = 0;

    function showSignal() {
      if (!isRunning || isPaused || signalVisible) return;

      signalVisible = true;
      signalStartTime = Date.now();

      signalElement = document.createElement('div');
      signalElement.className = `focus-signal ${lowStimMode ? 'low-stim' : ''}`;
      signalElement.setAttribute('role', 'button');
      signalElement.setAttribute('aria-label', 'React now');
      signalElement.setAttribute('tabindex', '0');
      signalElement.textContent = 'React!';

      signalElement.addEventListener('click', reactToSignal);
      signalElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          reactToSignal();
        }
      });

      gameArea.appendChild(signalElement);

      // Auto-hide after 2 seconds
      setTimeout(() => {
        if (signalElement && signalElement.parentNode) {
          signalElement.remove();
          signalVisible = false;
        }
      }, 2000);
    }

    function reactToSignal() {
      if (!signalElement || !isRunning) return;

      const reactionTime = Date.now() - signalStartTime;
      const points = Math.max(1, Math.floor(1000 / reactionTime)); // Faster = more points
      score += points;
      updateScore();

      signalElement.remove();
      signalVisible = false;

      // Show feedback
      const feedback = document.createElement('div');
      feedback.className = 'focus-feedback';
      feedback.textContent = `Great! +${points}`;
      gameArea.appendChild(feedback);
      setTimeout(() => feedback.remove(), 1500);
    }

    // Show signals every 3-6 seconds
    const signalInterval = setInterval(() => {
      if (isRunning && !isPaused) {
        showSignal();
      }
    }, 3000 + Math.random() * 3000);

    // Initial signal
    setTimeout(showSignal, 2000);
  }

  // Update score display
  function updateScore() {
    const scoreEl = document.getElementById('focus-score');
    if (scoreEl) {
      scoreEl.textContent = score;
    }
  }

  // Update time display
  function updateTime() {
    if (!isRunning || isPaused) return;

    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const timeEl = document.getElementById('focus-time');
    if (timeEl) {
      timeEl.textContent = `${elapsedTime}s`;
    }

    // Update progress
    const gameDuration = GAMES[currentGame]?.duration || 60;
    const progress = Math.min(1, elapsedTime / gameDuration);
    const progressFill = document.getElementById('focus-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress * 100}%`;
      progressFill.setAttribute('aria-valuenow', Math.round(progress * 100));
    }

    // Check if time is up
    if (elapsedTime >= gameDuration) {
      finishGame();
    }
  }

  // Start game
  function startGame(gameType) {
    if (isRunning) stopGame();

    currentGame = gameType;
    score = 0;
    startTime = Date.now();
    elapsedTime = 0;
    isRunning = true;
    isPaused = false;

    checkLowStimMode();

    // Update UI
    const startBtn = document.getElementById('focus-start-btn');
    const pauseBtn = document.getElementById('focus-pause-btn');
    const stopBtn = document.getElementById('focus-stop-btn');
    const instructions = document.getElementById('focus-instructions');

    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-block';
    if (stopBtn) stopBtn.style.display = 'inline-block';
    if (instructions) {
      instructions.textContent = GAMES[gameType]?.description || '';
    }

    updateScore();

    // Start game timer
    gameTimer = setInterval(updateTime, 100);

    // Start game-specific logic
    if (gameType === 'focusQuest') {
      runFocusQuest();
    } else if (gameType === 'spotTarget') {
      runSpotTarget();
    } else if (gameType === 'reactionChallenge') {
      runReactionChallenge();
    }
  }

  // Pause/Resume game
  function pauseGame() {
    if (!isRunning) return;
    isPaused = !isPaused;

    const pauseBtn = document.getElementById('focus-pause-btn');
    if (pauseBtn) {
      pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
      pauseBtn.setAttribute('aria-label', isPaused ? 'Resume' : 'Pause');
    }

    if (isPaused) {
      if (gameTimer) clearInterval(gameTimer);
    } else {
      startTime = Date.now() - (elapsedTime * 1000);
      gameTimer = setInterval(updateTime, 100);
    }
  }

  // Stop game
  function stopGame() {
    isRunning = false;
    isPaused = false;
    if (gameTimer) {
      clearInterval(gameTimer);
      gameTimer = null;
    }

    // Clear game area
    const gameArea = document.getElementById(`focus-game-${currentGame}`);
    if (gameArea) gameArea.innerHTML = '';

    // Reset UI
    const startBtn = document.getElementById('focus-start-btn');
    const pauseBtn = document.getElementById('focus-pause-btn');
    const stopBtn = document.getElementById('focus-stop-btn');
    const scoreEl = document.getElementById('focus-score');
    const timeEl = document.getElementById('focus-time');
    const progressFill = document.getElementById('focus-progress-fill');

    if (startBtn) startBtn.style.display = 'inline-block';
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'none';
    if (scoreEl) scoreEl.textContent = '0';
    if (timeEl) timeEl.textContent = '0s';
    if (progressFill) {
      progressFill.style.width = '0%';
      progressFill.setAttribute('aria-valuenow', 0);
    }

    score = 0;
    currentGame = null;
  }

  // Finish game
  function finishGame() {
    stopGame();

    // Record activity
    if (window.NBProgressTracker) {
      const minutes = Math.ceil(elapsedTime / 60);
      window.NBProgressTracker.recordFocus({
        minutes,
        name: GAMES[currentGame]?.name || 'Focus game',
        points: score,
        pageId: 'focus-game'
      });
    }

    // Show completion message
    const gameArea = document.getElementById(`focus-game-${currentGame}`);
    if (gameArea) {
      gameArea.innerHTML = `
        <div class="game-complete" role="alert">
          <div class="complete-icon">🎉</div>
          <h3>Well done!</h3>
          <p>You scored ${score} points!</p>
          <p class="complete-message">Great focus practice!</p>
        </div>
      `;
    }

    // Dispatch completion event
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('nb:game-complete', {
        detail: {
          gameType: currentGame,
          score,
          duration: elapsedTime
        }
      }));
    }
  }

  // Initialize game in a container
  function initGame(containerId, gameType) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Focus game: Container ${containerId} not found`);
      return;
    }

    // Create game UI
    const gameContainer = createGameContainer(gameType);
    container.innerHTML = '';
    container.appendChild(gameContainer);

    // Setup event listeners
    const startBtn = document.getElementById('focus-start-btn');
    const pauseBtn = document.getElementById('focus-pause-btn');
    const stopBtn = document.getElementById('focus-stop-btn');
    const lowStimCheckbox = document.getElementById('focus-low-stim-checkbox');

    if (startBtn) {
      startBtn.addEventListener('click', () => startGame(gameType));
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
  window.NBFocusGames = {
    init: initGame,
    start: startGame,
    pause: pauseGame,
    stop: stopGame,
    GAMES,
    isRunning: () => isRunning,
    getCurrentGame: () => currentGame
  };

})();
