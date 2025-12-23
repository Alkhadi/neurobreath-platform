/**
 * ADHD Attention Games Suite
 * Four evidence-based attention-boosting games with progress tracking
 * Includes focus playlist, journal, rewards, and gamification systems
 */

// ============================================================================
// CORE GAME STATE MANAGEMENT
// ============================================================================

function broadcastGameState(reason = 'update') {
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('adhd:state-change', { detail: { reason } }));
    }
  } catch (err) {
    // no-op if CustomEvent unsupported
  }
}
const GameState = {
  currentUser: 'player1',
  points: 0,
  level: 1,
  badges: [],
  collectibles: [],
  avatar: 'default',
  theme: 'blue',
  totalGamesPlayed: 0,
  streakDays: 0,
  lastPlayDate: null,
  focusCalendar: {},
  
  // Game-specific stats
  stats: {
    memoryMatrix: { played: 0, bestScore: 0, bestLevel: 0 },
    colorStorm: { played: 0, bestScore: 0, bestAccuracy: 0 },
    focusFlow: { played: 0, longestStreak: 0, avgDuration: 0, bestFocusRate: 0 },
    patternPulse: { played: 0, bestScore: 0, bestRound: 0, perfectRounds: 0 }
  },
  
  // Journal entries
  journal: [],
  
  // Scratch cards
  scratchCards: [],
  unlockedCards: 0,
  
  // Playlist
  playlistSettings: {
    genre: 'lofi',
    volume: 70,
    autoplay: true
  },
  
  // Load from localStorage
  load() {
    const saved = localStorage.getItem('adhd_game_state');
    if (saved) {
      const data = JSON.parse(saved);
      Object.assign(this, data);
    }
    this.normalizeStats();
    broadcastGameState('load');
  },
  
  // Save to localStorage
  save() {
    localStorage.setItem('adhd_game_state', JSON.stringify(this));
    broadcastGameState('save');
  },
  
  normalizeStats() {
    this.badges = Array.isArray(this.badges) ? this.badges : [];
    this.collectibles = Array.isArray(this.collectibles) ? this.collectibles : [];
    this.scratchCards = Array.isArray(this.scratchCards) ? this.scratchCards : [];
    this.focusCalendar = this.focusCalendar && typeof this.focusCalendar === 'object' ? this.focusCalendar : {};
    this.stats = this.stats || {};
    this.stats.memoryMatrix = Object.assign({ played: 0, bestScore: 0, bestLevel: 0 }, this.stats.memoryMatrix || {});
    this.stats.colorStorm = Object.assign({ played: 0, bestScore: 0, bestAccuracy: 0 }, this.stats.colorStorm || {});
    this.stats.focusFlow = Object.assign({ played: 0, longestStreak: 0, avgDuration: 0, bestFocusRate: 0 }, this.stats.focusFlow || {});
    this.stats.patternPulse = Object.assign({ played: 0, bestScore: 0, bestRound: 0, perfectRounds: 0 }, this.stats.patternPulse || {});
  },
  
  // Check and update streak
  checkStreak() {
    const today = new Date().toDateString();
    if (this.lastPlayDate === today) {
      return false; // Already counted today
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (this.lastPlayDate === yesterday.toDateString()) {
      this.streakDays++;
    } else {
      this.streakDays = 1;
    }
    
    this.lastPlayDate = today;
    return true;
  },

  recordPlaySession(gameKey) {
    this.totalGamesPlayed++;
    this.checkStreak();
    this.save();
    updateUserDisplay();
    if (typeof window !== 'undefined' && window.ProgressCalendar && typeof window.ProgressCalendar.markToday === 'function') {
      window.ProgressCalendar.markToday({ reason: 'game' });
    }
    if (gameKey) {
      broadcastGameState(`session:${gameKey}`);
    }
  },
  
  // Add points and check for rewards
  addPoints(points) {
    this.points += points;
    this.checkMilestones();
    this.save();
    updatePointsDisplay();
  },
  
  // Check for milestone rewards
  checkMilestones() {
    const milestones = [100, 250, 500, 1000, 2500, 5000, 10000];
    milestones.forEach(milestone => {
      if (this.points >= milestone && !this.badges.includes(`points_${milestone}`)) {
        this.unlockBadge(`points_${milestone}`, `Earned ${milestone} points!`);
        this.unlockScratchCard();
      }
    });
    
    // Level up every 500 points
    const newLevel = Math.floor(this.points / 500) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.unlockScratchCard();
      showNotification(`🎉 Level Up! You're now level ${this.level}!`);
    }
  },
  
  // Unlock badge
  unlockBadge(badgeId, message) {
    if (!this.badges.includes(badgeId)) {
      this.badges.push(badgeId);
      showNotification(`🏆 Badge Unlocked: ${message}`);
      this.save();
      updateBadgesDisplay();
    }
  },
  
  // Unlock scratch card
  unlockScratchCard() {
    const card = generateScratchCard();
    this.scratchCards.push(card);
    this.save();
    showNotification('🎁 New scratch card unlocked!');
  },
  
  // Add journal entry
  addJournalEntry(mood, activities, notes) {
    const entry = {
      date: new Date().toISOString(),
      mood,
      activities,
      notes,
      gamesPlayed: this.totalGamesPlayed
    };
    this.journal.unshift(entry);
    if (this.journal.length > 100) this.journal.pop();
    this.save();
  },

  resetAll() {
    const defaults = {
      currentUser: 'player1',
      points: 0,
      level: 1,
      badges: [],
      collectibles: [],
      avatar: 'default',
      theme: 'blue',
      totalGamesPlayed: 0,
      streakDays: 0,
      lastPlayDate: null,
      focusCalendar: {},
      stats: {
        memoryMatrix: { played: 0, bestScore: 0, bestLevel: 0 },
        colorStorm: { played: 0, bestScore: 0, bestAccuracy: 0 },
        focusFlow: { played: 0, longestStreak: 0, avgDuration: 0, bestFocusRate: 0 },
        patternPulse: { played: 0, bestScore: 0, bestRound: 0, perfectRounds: 0 }
      },
      journal: [],
      scratchCards: [],
      unlockedCards: 0,
      playlistSettings: {
        genre: 'lofi',
        volume: 70,
        autoplay: true
      }
    };

    Object.assign(this, defaults);
    this.normalizeStats();
    localStorage.removeItem('adhd_game_state');
    this.save();

    updatePointsDisplay();
    updateUserDisplay();
    updateBadgesDisplay();
    if (typeof updateGameCardFeedback === 'function') {
      updateGameCardFeedback();
    }
    FocusJournal?.renderEntries?.();
    if (typeof window !== 'undefined') {
      window.ProgressCalendar?.render?.();
    }
    ScratchCards?.renderCards?.();
    FocusPlaylist?.init?.();
    Leaderboard?.renderLeaderboard?.();
    Customization?.applyTheme?.(this.theme);
    Customization?.renderAvatars?.();
    Customization?.renderThemes?.();

    broadcastGameState('reset');
  }
};

const GAME_CARD_TARGETS = {
  memoryMatrix: {
    metric: 'bestScore',
    target: 200,
    unit: 'pts',
    goalLabel: 'Memory Master badge',
    successText: 'Memory Master badge ready! Keep stacking calm sequences.',
    emptyText: 'Press Start to log your first Memory Matrix mission.',
    descriptor: 'Spatial memory boost'
  },
  colorStorm: {
    metric: 'bestScore',
    target: 500,
    unit: 'pts',
    goalLabel: 'Color Master badge',
    successText: 'Color Master badge within reach—amazing switching power!',
    emptyText: 'Kick off a switch round to see your accuracy story build.',
    descriptor: 'Task switching hero'
  },
  focusFlow: {
    metric: 'bestFocusRate',
    target: 80,
    unit: '%',
    goalLabel: 'Laser Focus mission',
    successText: 'Laser Focus unlocked—your calm tracking is rock solid.',
    emptyText: 'Follow a live run to see your focus rate trend here.',
    descriptor: 'Calm tracking'
  },
  patternPulse: {
    metric: 'bestRound',
    target: 10,
    unit: ' rounds',
    goalLabel: 'Rhythm Master badge',
    successText: 'Rhythm Master badge ready—tempo confidence unlocked!',
    emptyText: 'Start a pattern to unlock tempo notes and rewards.',
    descriptor: 'Rhythm rounds'
  }
};

const ENGAGEMENT_TIMEOUTS = {
  memoryMatrix: 15000, // allow time to watch the first sequence
  colorStorm: 12000,   // Stroop responses should start within 12s
  focusFlow: 10000,    // cursor should move within 10s to track focus
  patternPulse: 15000  // rhythm replay expected within 15s
};

// ============================================================================
// GAME 1: MEMORY MATRIX CHALLENGE
// Evidence-based: Working memory training with spatial twist
// ============================================================================

const MemoryMatrix = {
  gridSize: 3,
  sequence: [],
  userSequence: [],
  round: 0,
  score: 0,
  isPlaying: false,
  isShowingSequence: false,
  hasUserInput: false,
  noInputTimer: null,
  inputGraceMs: ENGAGEMENT_TIMEOUTS.memoryMatrix,
  
  init() {
    this.gridSize = 3;
    this.sequence = [];
    this.userSequence = [];
    this.round = 0;
    this.score = 0;
    this.isPlaying = true;
    this.hasUserInput = false;
    this.clearNoInputGuard();
    this.renderGrid();
    this.nextRound();
  },
  
  renderGrid() {
    const container = document.getElementById('memoryMatrixGrid');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
    
    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell';
      cell.dataset.index = i;
      cell.addEventListener('click', () => this.handleCellClick(i));
      container.appendChild(cell);
    }
  },
  
  nextRound() {
    this.round++;
    this.userSequence = [];
    
    // Add new cell to sequence
    const newCell = Math.floor(Math.random() * (this.gridSize * this.gridSize));
    this.sequence.push(newCell);
    
    // Increase grid size every 5 rounds
    if (this.round > 1 && this.round % 5 === 0 && this.gridSize < 6) {
      this.gridSize++;
      this.renderGrid();
    }
    
    this.showSequence();
  },
  
  async showSequence() {
    this.isShowingSequence = true;
    document.getElementById('memoryMatrixStatus').textContent = 'Watch carefully...';
    
    await this.sleep(1000);
    
    for (let cellIndex of this.sequence) {
      const cells = document.querySelectorAll('.matrix-cell');
      cells[cellIndex].classList.add('highlight');
      await this.sleep(600);
      cells[cellIndex].classList.remove('highlight');
      await this.sleep(300);
    }
    
    this.isShowingSequence = false;
    document.getElementById('memoryMatrixStatus').textContent = 'Your turn! Click the cells in order.';
    this.armNoInputGuard();
  },
  
  handleCellClick(index) {
    if (!this.isPlaying || this.isShowingSequence) return;
    this.registerUserInteraction();
    
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.classList.add('selected');
    setTimeout(() => cell.classList.remove('selected'), 300);
    
    this.userSequence.push(index);
    
    // Check if correct
    const currentStep = this.userSequence.length - 1;
    if (this.userSequence[currentStep] !== this.sequence[currentStep]) {
      this.gameOver();
      return;
    }
    
    // Check if sequence complete
    if (this.userSequence.length === this.sequence.length) {
      this.score += this.sequence.length * 10;
      document.getElementById('memoryMatrixScore').textContent = this.score;
      
      setTimeout(() => this.nextRound(), 1000);
    }
  },
  
  gameOver() {
    this.clearNoInputGuard();
    this.isPlaying = false;
    if (!this.hasUserInput) {
      return this.invalidateSession('Session cancelled — make at least one tap to log progress.');
    }
    document.getElementById('memoryMatrixStatus').textContent = `Game Over! Final Score: ${this.score}`;
    
    // Update stats
    GameState.stats.memoryMatrix.played++;
    if (this.score > GameState.stats.memoryMatrix.bestScore) {
      GameState.stats.memoryMatrix.bestScore = this.score;
    }
    if (this.round > GameState.stats.memoryMatrix.bestLevel) {
      GameState.stats.memoryMatrix.bestLevel = this.round;
    }
    
    GameState.addPoints(this.score);
    GameState.recordPlaySession('memoryMatrix');
    
    // Check for badges
    if (this.score >= 200) GameState.unlockBadge('memory_master', 'Memory Master');
    if (this.round >= 10) GameState.unlockBadge('memory_marathon', 'Memory Marathon');
  },
  
  registerUserInteraction() {
    if (!this.hasUserInput) {
      this.hasUserInput = true;
      this.clearNoInputGuard();
    }
  },
  
  armNoInputGuard() {
    if (this.hasUserInput || !this.isPlaying) return;
    this.clearNoInputGuard();
    this.noInputTimer = setTimeout(() => this.handleNoInteraction(), this.inputGraceMs);
  },
  
  clearNoInputGuard() {
    if (this.noInputTimer) {
      clearTimeout(this.noInputTimer);
      this.noInputTimer = null;
    }
  },
  
  handleNoInteraction() {
    if (this.hasUserInput || !this.isPlaying) return;
    this.invalidateSession('Session auto-ended — no taps detected. Scores not saved.');
  },
  
  invalidateSession(message) {
    this.clearNoInputGuard();
    this.isPlaying = false;
    this.isShowingSequence = false;
    document.getElementById('memoryMatrixStatus').textContent = message;
    showNotification(message);
  },
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// ============================================================================
// GAME 2: COLOR STORM SWITCH
// Evidence-based: Stroop effect + rapid task switching
// ============================================================================

const ColorStorm = {
  colors: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE'],
  colorClasses: ['color-red', 'color-blue', 'color-green', 'color-yellow', 'color-purple'],
  currentWord: '',
  currentColor: '',
  mode: 'match', // 'match' or 'mismatch'
  score: 0,
  correct: 0,
  total: 0,
  timeLeft: 60,
  isPlaying: false,
  timer: null,
  hasUserInput: false,
  noInputTimer: null,
  inputGraceMs: ENGAGEMENT_TIMEOUTS.colorStorm,
  
  init() {
    this.score = 0;
    this.correct = 0;
    this.total = 0;
    this.timeLeft = 60;
    this.isPlaying = true;
    this.mode = 'match';
    this.hasUserInput = false;
    this.clearNoInputGuard();
    
    document.getElementById('colorStormScore').textContent = '0';
    document.getElementById('colorStormAccuracy').textContent = '0%';
    document.getElementById('colorStormTimer').textContent = '60s';
    
    this.nextWord();
    this.startTimer();
    this.armNoInputGuard();
  },
  
  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      document.getElementById('colorStormTimer').textContent = `${this.timeLeft}s`;
      
      if (this.timeLeft <= 0) {
        this.gameOver();
      }
      
      // Switch mode every 15 seconds
      if (this.timeLeft % 15 === 0 && this.timeLeft > 0) {
        this.mode = this.mode === 'match' ? 'mismatch' : 'match';
        showNotification(this.mode === 'match' ? 'Mode: Match word to color!' : 'Mode: Does word MISMATCH color?');
      }
    }, 1000);
  },
  
  nextWord() {
    const wordIndex = Math.floor(Math.random() * this.colors.length);
    let colorIndex = Math.floor(Math.random() * this.colors.length);
    
    // 50% chance of mismatch
    if (Math.random() < 0.5) {
      while (colorIndex === wordIndex) {
        colorIndex = Math.floor(Math.random() * this.colors.length);
      }
    }
    
    this.currentWord = this.colors[wordIndex];
    this.currentColor = this.colorClasses[colorIndex];
    
    const wordDisplay = document.getElementById('colorStormWord');
    wordDisplay.textContent = this.currentWord;
    wordDisplay.className = `color-word ${this.currentColor}`;
    
    const modeText = this.mode === 'match' ? 'Does the WORD match the COLOR?' : 'Does the WORD mismatch the COLOR?';
    document.getElementById('colorStormMode').textContent = modeText;
  },
  
  answer(userSaysMatch) {
    if (!this.isPlaying) return;
    this.registerUserInteraction();
    
    const actualMatch = this.currentWord === this.colors[this.colorClasses.indexOf(this.currentColor)];
    let correct;
    
    if (this.mode === 'match') {
      correct = userSaysMatch === actualMatch;
    } else {
      correct = userSaysMatch === !actualMatch;
    }
    
    this.total++;
    
    if (correct) {
      this.correct++;
      this.score += 10;
      this.flashFeedback('correct');
    } else {
      this.flashFeedback('incorrect');
    }
    
    document.getElementById('colorStormScore').textContent = this.score;
    const accuracy = Math.round((this.correct / this.total) * 100);
    document.getElementById('colorStormAccuracy').textContent = `${accuracy}%`;
    
    this.nextWord();
  },
  
  flashFeedback(type) {
    const feedback = document.getElementById('colorStormFeedback');
    feedback.textContent = type === 'correct' ? '✓' : '✗';
    feedback.className = `feedback ${type}`;
    setTimeout(() => feedback.className = 'feedback', 500);
  },
  
  gameOver() {
    clearInterval(this.timer);
    this.clearNoInputGuard();
    this.isPlaying = false;
    if (!this.hasUserInput) {
      return this.invalidateSession('Session cancelled — respond at least once to record stats.');
    }
    
    const accuracy = this.total > 0 ? Math.round((this.correct / this.total) * 100) : 0;
    
    document.getElementById('colorStormWord').textContent = '🎮';
    document.getElementById('colorStormMode').textContent = `Game Over! Score: ${this.score} | Accuracy: ${accuracy}%`;
    
    // Update stats
    GameState.stats.colorStorm.played++;
    if (this.score > GameState.stats.colorStorm.bestScore) {
      GameState.stats.colorStorm.bestScore = this.score;
    }
    if (accuracy > GameState.stats.colorStorm.bestAccuracy) {
      GameState.stats.colorStorm.bestAccuracy = accuracy;
    }
    
    GameState.addPoints(this.score);
    GameState.recordPlaySession('colorStorm');
    
    // Badges
    if (accuracy >= 90) GameState.unlockBadge('sharp_shooter', 'Sharp Shooter - 90% accuracy');
    if (this.score >= 500) GameState.unlockBadge('color_master', 'Color Master');
  },
  registerUserInteraction() {
    if (!this.hasUserInput) {
      this.hasUserInput = true;
      this.clearNoInputGuard();
    }
  },
  
  armNoInputGuard() {
    if (this.hasUserInput || !this.isPlaying) return;
    this.clearNoInputGuard();
    this.noInputTimer = setTimeout(() => this.handleNoInteraction(), this.inputGraceMs);
  },
  
  clearNoInputGuard() {
    if (this.noInputTimer) {
      clearTimeout(this.noInputTimer);
      this.noInputTimer = null;
    }
  },
  
  handleNoInteraction() {
    if (this.hasUserInput || !this.isPlaying) return;
    this.invalidateSession('Session auto-ended — no answers detected within 12 seconds. Scores not saved.');
  },
  
  invalidateSession(message) {
    clearInterval(this.timer);
    this.timer = null;
    this.clearNoInputGuard();
    this.isPlaying = false;
    document.getElementById('colorStormWord').textContent = '⏸';
    document.getElementById('colorStormMode').textContent = message;
    showNotification(message);
  }
};

// ============================================================================
// GAME 3: FOCUS FLOW TRACKER
// Original: Sustained attention with real-time biofeedback
// ============================================================================

const FocusFlow = {
  targetX: 0,
  targetY: 0,
  isTracking: false,
  score: 0,
  streak: 0,
  bestStreak: 0,
  timeInZone: 0,
  totalTime: 0,
  timer: null,
  updateInterval: null,
  moveTimeout: null,
  mouseMoveHandler: null,
  touchMoveHandler: null,
  pointerX: null,
  pointerY: null,
  isPointerInZone: false,
  lastZoneSample: null,
  hasUserInput: false,
  noInputTimer: null,
  inputGraceMs: ENGAGEMENT_TIMEOUTS.focusFlow,
  
  init() {
    this.stop({ silent: true, preserveCanvas: true });
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.timeInZone = 0;
    this.totalTime = 0;
    this.isTracking = true;
    this.hasUserInput = false;
    this.isPointerInZone = false;
    this.lastZoneSample = performance.now();
    this.pointerX = null;
    this.pointerY = null;
    this.clearNoInputGuard();
    
    const canvas = document.getElementById('focusFlowCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    this.targetX = rect.width / 2;
    this.targetY = rect.height / 2;
    this.pointerX = this.targetX;
    this.pointerY = this.targetY;
    
    document.getElementById('focusFlowScore').textContent = '0';
    document.getElementById('focusFlowStreak').textContent = '0';
    document.getElementById('focusFlowTimer').textContent = '0s';
    
    this.registerPointerListeners(canvas);
    this.startTracking();
    this.moveTarget();
    this.armNoInputGuard();
  },
  
  registerPointerListeners(canvas) {
    this.removePointerListeners(canvas);
    if (!canvas) return;
    this.mouseMoveHandler = (e) => this.handleMouseMove(e);
    this.touchMoveHandler = (e) => this.handleTouchMove(e);
    canvas.addEventListener('mousemove', this.mouseMoveHandler);
    canvas.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
  },
  
  removePointerListeners(canvas = document.getElementById('focusFlowCanvas')) {
    if (canvas && this.mouseMoveHandler) {
      canvas.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    if (canvas && this.touchMoveHandler) {
      canvas.removeEventListener('touchmove', this.touchMoveHandler);
    }
    this.mouseMoveHandler = null;
    this.touchMoveHandler = null;
  },
  
  startTracking() {
    clearInterval(this.timer);
    clearInterval(this.updateInterval);
    this.timer = setInterval(() => {
      this.totalTime++;
      document.getElementById('focusFlowTimer').textContent = `${this.totalTime}s`;
      
      if (this.totalTime >= 120) {
        this.gameOver();
      }
    }, 1000);
    
    this.updateInterval = setInterval(() => {
      this.draw();
    }, 50);
  },
  
  moveTarget() {
    if (!this.isTracking) return;
    const canvas = document.getElementById('focusFlowCanvas');
    if (!canvas) return;
    const margin = 50;
    
    this.targetX = margin + Math.random() * (canvas.width - 2 * margin);
    this.targetY = margin + Math.random() * (canvas.height - 2 * margin);
    
    if (this.moveTimeout) clearTimeout(this.moveTimeout);
    this.moveTimeout = setTimeout(() => this.moveTarget(), 3000 + Math.random() * 2000);
  },
  
  handleMouseMove(e) {
    if (!this.isTracking) return;
    this.registerUserInteraction();
    const canvas = document.getElementById('focusFlowCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.updatePointerPosition(mouseX, mouseY);
  },
  
  handleTouchMove(e) {
    if (!this.isTracking) return;
    e.preventDefault();
    this.registerUserInteraction();
    const canvas = document.getElementById('focusFlowCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    this.updatePointerPosition(touchX, touchY);
  },
  
  updatePointerPosition(x, y) {
    this.pointerX = x;
    this.pointerY = y;
    this.checkProximity(x, y);
  },
  
  checkProximity(pointerX, pointerY) {
    const distance = Math.hypot(pointerX - this.targetX, pointerY - this.targetY);
    this.isPointerInZone = distance < 40;
    
    if (this.isPointerInZone) {
      this.streak++;
      this.score += 2;
      if (this.streak > this.bestStreak) {
        this.bestStreak = this.streak;
      }
      document.getElementById('focusFlowScore').textContent = this.score;
      document.getElementById('focusFlowStreak').textContent = this.streak;
    } else if (distance > 100) {
      this.streak = 0;
    }
  },
  
  sampleZoneTime() {
    const now = performance.now();
    if (!this.lastZoneSample) {
      this.lastZoneSample = now;
      return;
    }
    const deltaSeconds = (now - this.lastZoneSample) / 1000;
    this.lastZoneSample = now;
    if (this.isPointerInZone && this.hasUserInput && this.isTracking) {
      this.timeInZone += deltaSeconds;
    }
  },
  
  draw() {
    const canvas = document.getElementById('focusFlowCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    this.sampleZoneTime();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const pulse = Math.sin(Date.now() / 200) * 5;
    
    ctx.beginPath();
    ctx.arc(this.targetX, this.targetY, 40 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.targetX, this.targetY, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#4a90e2';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.targetX, this.targetY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  },
  
  gameOver() {
    const hadInput = this.hasUserInput;
    this.stop({ silent: true, preserveCanvas: true });
    if (!hadInput) {
      this.invalidateSession('Session cancelled — move on the canvas at least once to log progress.');
      return;
    }
    
    const focusRateRaw = this.totalTime > 0 ? (this.timeInZone / this.totalTime) * 100 : 0;
    const focusRate = Math.min(100, Math.round(focusRateRaw));
    
    const canvas = document.getElementById('focusFlowCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '24px Arial';
      ctx.fillStyle = '#f1f5f9';
      ctx.textAlign = 'center';
      ctx.fillText('🎯 Session Complete!', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '16px Arial';
      ctx.fillStyle = '#cbd5f5';
      ctx.fillText(`Focus Rate: ${focusRate}% | Best Streak: ${this.bestStreak}`, canvas.width / 2, canvas.height / 2 + 20);
    }
    
    GameState.stats.focusFlow.played++;
    if (this.bestStreak > GameState.stats.focusFlow.longestStreak) {
      GameState.stats.focusFlow.longestStreak = this.bestStreak;
    }
    const avgDuration = GameState.stats.focusFlow.avgDuration;
    GameState.stats.focusFlow.avgDuration = 
      (avgDuration * (GameState.stats.focusFlow.played - 1) + this.totalTime) / GameState.stats.focusFlow.played;
    GameState.addPoints(this.score);
    GameState.recordPlaySession('focusFlow');
    
    if (focusRate >= 80) GameState.unlockBadge('laser_focus', 'Laser Focus - 80% focus rate');
    if (this.bestStreak >= 50) GameState.unlockBadge('zen_master', 'Zen Master');
    if (focusRate > (GameState.stats.focusFlow.bestFocusRate || 0)) {
      GameState.stats.focusFlow.bestFocusRate = focusRate;
    }
  },
  
  stop({ silent = false, preserveCanvas = false } = {}) {
    if (this.timer) clearInterval(this.timer);
    if (this.updateInterval) clearInterval(this.updateInterval);
    if (this.moveTimeout) clearTimeout(this.moveTimeout);
    this.timer = null;
    this.updateInterval = null;
    this.moveTimeout = null;
    this.clearNoInputGuard();
    this.isTracking = false;
    this.isPointerInZone = false;
    this.lastZoneSample = null;
    this.removePointerListeners();
    const canvas = document.getElementById('focusFlowCanvas');
    if (!canvas) return;
    if (preserveCanvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!silent) {
      ctx.font = '18px Arial';
      ctx.fillStyle = '#eab676';
      ctx.textAlign = 'center';
      ctx.fillText('Coach stopped. Press start when ready.', canvas.width / 2, canvas.height / 2);
    }
  },
  
  registerUserInteraction() {
    if (!this.hasUserInput) {
      this.hasUserInput = true;
      this.timeInZone = 0;
      this.lastZoneSample = performance.now();
      this.clearNoInputGuard();
    }
  },
  
  armNoInputGuard() {
    if (this.hasUserInput || !this.isTracking) return;
    this.clearNoInputGuard();
    this.noInputTimer = setTimeout(() => this.handleNoInteraction(), this.inputGraceMs);
  },
  
  clearNoInputGuard() {
    if (this.noInputTimer) {
      clearTimeout(this.noInputTimer);
      this.noInputTimer = null;
    }
  },
  
  handleNoInteraction() {
    if (this.hasUserInput || !this.isTracking) return;
    this.invalidateSession('Session auto-ended — move on the canvas within 10 seconds to log progress.');
  },
  
  invalidateSession(message) {
    this.stop({ silent: true });
    this.renderCanvasMessage('Session idle — move to restart.');
    showNotification(message);
  },
  
  renderCanvasMessage(text) {
    const canvas = document.getElementById('focusFlowCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '18px Arial';
    ctx.fillStyle = '#eab676';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
};

// ============================================================================
// GAME 4: PATTERN PULSE
// Original: Predictive attention and rhythm training
// ============================================================================

const PatternPulse = {
  pattern: [],
  userPattern: [],
  currentBeat: 0,
  score: 0,
  round: 0,
  perfectRounds: 0,
  isPlaying: false,
  isShowingPattern: false,
  bpm: 120,
  hasUserInput: false,
  noInputTimer: null,
  inputGraceMs: ENGAGEMENT_TIMEOUTS.patternPulse,
  
  colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'],
  
  init() {
    this.pattern = [];
    this.userPattern = [];
    this.currentBeat = 0;
    this.score = 0;
    this.round = 0;
    this.perfectRounds = 0;
    this.isPlaying = true;
    this.bpm = 120;
    this.hasUserInput = false;
    this.clearNoInputGuard();
    
    document.getElementById('patternPulseScore').textContent = '0';
    document.getElementById('patternPulseRound').textContent = '1';
    
    this.renderButtons();
    this.nextRound();
  },
  
  renderButtons() {
    const container = document.getElementById('patternPulseButtons');
    container.innerHTML = '';
    
    this.colors.forEach((color, index) => {
      const btn = document.createElement('button');
      btn.className = 'pulse-button';
      btn.style.backgroundColor = color;
      btn.dataset.index = index;
      btn.addEventListener('click', () => this.handleButtonClick(index));
      container.appendChild(btn);
    });
  },
  
  nextRound() {
    this.round++;
    this.userPattern = [];
    this.currentBeat = 0;
    
    document.getElementById('patternPulseRound').textContent = this.round;
    document.getElementById('patternPulseStatus').textContent = 'Watch the pattern...';
    
    // Generate pattern (3-7 beats)
    const patternLength = Math.min(3 + Math.floor(this.round / 2), 7);
    this.pattern = [];
    
    for (let i = 0; i < patternLength; i++) {
      this.pattern.push(Math.floor(Math.random() * 4));
    }
    
    // Increase tempo every 3 rounds
    if (this.round > 1 && this.round % 3 === 0 && this.bpm < 180) {
      this.bpm += 10;
    }
    
    this.showPattern();
  },
  
  async showPattern() {
    this.isShowingPattern = true;
    const beatDuration = 60000 / this.bpm;
    
    await this.sleep(500);
    
    for (let buttonIndex of this.pattern) {
      this.flashButton(buttonIndex);
      await this.sleep(beatDuration);
    }
    
    this.isShowingPattern = false;
    document.getElementById('patternPulseStatus').textContent = 'Repeat the pattern!';
    this.armNoInputGuard();
  },
  
  flashButton(index) {
    const buttons = document.querySelectorAll('.pulse-button');
    buttons[index].classList.add('pulse-active');
    
    // Play tone (optional - can be enhanced with Web Audio API)
    const tones = [261.63, 293.66, 329.63, 349.23]; // C, D, E, F
    this.playTone(tones[index], 0.2);
    
    setTimeout(() => {
      buttons[index].classList.remove('pulse-active');
    }, 200);
  },
  
  playTone(frequency, duration) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Audio not supported
    }
  },
  
  handleButtonClick(index) {
    if (!this.isPlaying || this.isShowingPattern) return;
    this.registerUserInteraction();
    
    this.flashButton(index);
    this.userPattern.push(index);
    
    // Check if correct
    const currentStep = this.userPattern.length - 1;
    if (this.userPattern[currentStep] !== this.pattern[currentStep]) {
      this.gameOver(false);
      return;
    }
    
    // Check if pattern complete
    if (this.userPattern.length === this.pattern.length) {
      const roundScore = this.pattern.length * 20;
      this.score += roundScore;
      this.perfectRounds++;
      
      document.getElementById('patternPulseScore').textContent = this.score;
      document.getElementById('patternPulseStatus').textContent = '✓ Perfect! Next round...';
      
      setTimeout(() => this.nextRound(), 1500);
    }
  },
  
  gameOver(completed = true) {
    this.isPlaying = false;
    this.clearNoInputGuard();
    if (!this.hasUserInput) {
      return this.invalidateSession('Session cancelled — repeat at least one beat to log progress.');
    }
    
    if (completed) {
      document.getElementById('patternPulseStatus').textContent = 
        `🎵 Amazing! Completed ${this.round} rounds!`;
    } else {
      document.getElementById('patternPulseStatus').textContent = 
        `Game Over! Completed ${this.round - 1} rounds. Score: ${this.score}`;
    }
    
    // Update stats
    GameState.stats.patternPulse.played++;
    if (this.score > GameState.stats.patternPulse.bestScore) {
      GameState.stats.patternPulse.bestScore = this.score;
    }
    if (this.round > (GameState.stats.patternPulse.bestRound || 0)) {
      GameState.stats.patternPulse.bestRound = this.round;
    }
    GameState.stats.patternPulse.perfectRounds += this.perfectRounds;
    
    GameState.addPoints(this.score);
    GameState.recordPlaySession('patternPulse');
    
    // Badges
    if (this.round >= 10) GameState.unlockBadge('rhythm_master', 'Rhythm Master');
    if (this.perfectRounds >= 15) GameState.unlockBadge('perfect_pitch', 'Perfect Pitch');
  },
  
  registerUserInteraction() {
    if (!this.hasUserInput) {
      this.hasUserInput = true;
      this.clearNoInputGuard();
    }
  },
  
  armNoInputGuard() {
    if (this.hasUserInput || !this.isPlaying) return;
    this.clearNoInputGuard();
    this.noInputTimer = setTimeout(() => this.handleNoInteraction(), this.inputGraceMs);
  },
  
  clearNoInputGuard() {
    if (this.noInputTimer) {
      clearTimeout(this.noInputTimer);
      this.noInputTimer = null;
    }
  },
  
  handleNoInteraction() {
    if (this.hasUserInput || !this.isPlaying) return;
    this.invalidateSession('Session auto-ended — no beats entered within 15 seconds. Scores not saved.');
  },
  
  invalidateSession(message) {
    this.clearNoInputGuard();
    this.isPlaying = false;
    this.isShowingPattern = false;
    document.getElementById('patternPulseStatus').textContent = message;
    showNotification(message);
  },
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// ============================================================================
// FOCUS MUSIC PLAYLIST
// ============================================================================

const FocusPlaylist = {
  currentGenre: 'lofi',
  isPlaying: false,
  volume: 70,
  
  playlists: {
    lofi: [
      { name: 'Lofi Study Beats 1', duration: '2:30' },
      { name: 'Chill Lofi Session', duration: '3:15' },
      { name: 'Rainy Day Focus', duration: '2:45' }
    ],
    classical: [
      { name: 'Mozart for Focus', duration: '4:20' },
      { name: 'Bach Study Music', duration: '3:50' },
      { name: 'Peaceful Piano', duration: '3:30' }
    ],
    ambient: [
      { name: 'Deep Focus Soundscape', duration: '5:00' },
      { name: 'White Noise Ocean', duration: '10:00' },
      { name: 'Forest Ambience', duration: '8:00' }
    ],
    binaural: [
      { name: '40Hz Gamma Focus', duration: '15:00' },
      { name: 'Beta Wave Concentration', duration: '12:00' },
      { name: 'Alpha Relaxation', duration: '10:00' }
    ]
  },
  
  init() {
    this.currentGenre = GameState.playlistSettings.genre;
    this.volume = GameState.playlistSettings.volume;
    this.renderPlaylist();
    this.updateVolumeDisplay();
  },
  
  renderPlaylist() {
    const container = document.getElementById('playlistTracks');
    container.innerHTML = '';
    
    const tracks = this.playlists[this.currentGenre];
    tracks.forEach((track, index) => {
      const trackEl = document.createElement('div');
      trackEl.className = 'playlist-track';
      trackEl.innerHTML = `
        <span class="track-number">${index + 1}</span>
        <span class="track-name">${track.name}</span>
        <span class="track-duration">${track.duration}</span>
        <button class="track-play" data-index="${index}">▶</button>
      `;
      
      trackEl.querySelector('.track-play').addEventListener('click', () => this.playTrack(index));
      container.appendChild(trackEl);
    });
  },
  
  changeGenre(genre) {
    this.currentGenre = genre;
    GameState.playlistSettings.genre = genre;
    GameState.save();
    
    // Update active button
    document.querySelectorAll('.genre-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.genre === genre);
    });
    
    this.renderPlaylist();
  },
  
  playTrack(index) {
    this.isPlaying = true;
    showNotification(`🎵 Playing: ${this.playlists[this.currentGenre][index].name}`);
    
    // In a real implementation, this would play actual audio
    // For now, we simulate playback
    document.querySelectorAll('.track-play').forEach(btn => btn.textContent = '▶');
    document.querySelectorAll('.track-play')[index].textContent = '⏸';
  },
  
  setVolume(value) {
    this.volume = value;
    GameState.playlistSettings.volume = value;
    GameState.save();
    this.updateVolumeDisplay();
  },
  
  updateVolumeDisplay() {
    document.getElementById('volumeValue').textContent = `${this.volume}%`;
    document.getElementById('volumeSlider').value = this.volume;
  }
};

// ============================================================================
// GAMIFIED FOCUS JOURNAL
// ============================================================================

const FocusJournal = {
  init() {
    this.renderEntries();
  },
  
  addEntry() {
    const mood = document.getElementById('journalMood').value;
    const activities = Array.from(document.querySelectorAll('input[name="activities"]:checked'))
      .map(cb => cb.value);
    const notes = document.getElementById('journalNotes').value;
    
    if (!mood || activities.length === 0) {
      showNotification('Please select a mood and at least one activity');
      return;
    }
    
    GameState.addJournalEntry(mood, activities, notes);
    GameState.addPoints(10);
    if (typeof window !== 'undefined' && window.ProgressCalendar && typeof window.ProgressCalendar.markToday === 'function') {
      window.ProgressCalendar.markToday({ reason: 'journal' });
    }
    
    // Reset form
    document.getElementById('journalMood').value = '';
    document.querySelectorAll('input[name="activities"]:checked').forEach(cb => cb.checked = false);
    document.getElementById('journalNotes').value = '';
    
    showNotification('✓ Journal entry saved! +10 points');
    this.renderEntries();
    
    // Badge for consistent journaling
    if (GameState.journal.length >= 7) {
      GameState.unlockBadge('journaling_habit', 'Journaling Habit - 7 entries');
    }
  },
  
  renderEntries() {
    const container = document.getElementById('journalEntries');
    container.innerHTML = '';
    
    if (GameState.journal.length === 0) {
      container.innerHTML = '<p class="muted">No entries yet. Start journaling to track your progress!</p>';
      return;
    }
    
    const moodEmojis = {
      great: '😊',
      good: '🙂',
      okay: '😐',
      difficult: '😔',
      struggling: '😞'
    };
    
    GameState.journal.slice(0, 10).forEach(entry => {
      const date = new Date(entry.date);
      const entryEl = document.createElement('div');
      entryEl.className = 'journal-entry';
      entryEl.innerHTML = `
        <div class="journal-entry-header">
          <span class="journal-mood">${moodEmojis[entry.mood]} ${entry.mood}</span>
          <span class="journal-date">${date.toLocaleDateString()}</span>
        </div>
        <div class="journal-activities">
          ${entry.activities.map(a => `<span class="tag-pill">${a}</span>`).join('')}
        </div>
        ${entry.notes ? `<p class="journal-notes">${entry.notes}</p>` : ''}
      `;
      container.appendChild(entryEl);
    });
  }
};

// ============================================================================
// PROGRESS CALENDAR
// ============================================================================

const ProgressCalendar = {
  daysToShow: 7,
  init() {
    this.container = document.getElementById('progressCalendar');
    if (!this.container) return;
    this.summaryEl = document.getElementById('progressCalendarSummary');
    this.markTodayBtn = document.getElementById('markTodayComplete');
    this.resetBtn = document.getElementById('resetCalendarWeek');

    this.container.addEventListener('click', (event) => {
      const target = event.target.closest('[data-calendar-day]');
      if (!target) return;
      event.preventDefault();
      const dateKey = target.dataset.calendarDay;
      const alreadyLogged = this.getSessions(dateKey) > 0;
      if (alreadyLogged) {
        showNotification('Already logged — reset the week if you need to clear entries.');
        return;
      }
      this.logDay(dateKey, { reason: 'manual' });
    });

    this.markTodayBtn?.addEventListener('click', () => this.markToday({ reason: 'manual' }));
    this.resetBtn?.addEventListener('click', () => this.resetWeek());
    this.render();
  },

  getTodayKey() {
    return new Date().toISOString().split('T')[0];
  },

  getWeekDates() {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = this.daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split('T')[0];
      const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
      const label = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      days.push({ key, weekday, label });
    }
    return days;
  },

  getSessions(dateKey) {
    const record = GameState.focusCalendar?.[dateKey];
    return record?.sessions || 0;
  },

  logDay(dateKey, context = { reason: 'manual' }) {
    if (!dateKey) return;
    GameState.focusCalendar = GameState.focusCalendar || {};
    const current = GameState.focusCalendar[dateKey] || { sessions: 0, lastUpdated: null };
    current.sessions = Math.min(8, (current.sessions || 0) + 1);
    current.lastUpdated = new Date().toISOString();
    GameState.focusCalendar[dateKey] = current;
    this.trimHistory();
    GameState.save();
    this.render();
    if (context.reason !== 'auto') {
      showNotification(`📅 Logged focus for ${this.formatLabel(dateKey)}.`);
    }
    if (GameState.focusCalendar) {
      const completed = this.weekCompletionCount();
      if (completed === this.daysToShow && !GameState.badges.includes('calendar_champion')) {
        GameState.unlockBadge('calendar_champion', 'Calendar Champion - full week logged');
      }
    }
  },

  markToday(context = { reason: 'auto' }) {
    this.logDay(this.getTodayKey(), context);
  },

  resetWeek() {
    const keys = this.getWeekDates().map(day => day.key);
    keys.forEach(key => {
      if (GameState.focusCalendar?.[key]) {
        delete GameState.focusCalendar[key];
      }
    });
    GameState.save();
    this.render();
    showNotification('Weekly calendar cleared. Start logging again when ready.');
  },

  weekCompletionCount() {
    return this.getWeekDates().reduce((count, day) => count + (this.getSessions(day.key) > 0 ? 1 : 0), 0);
  },

  trimHistory() {
    const keys = Object.keys(GameState.focusCalendar || {});
    if (keys.length <= 42) return;
    const sorted = keys.sort();
    while (sorted.length > 42) {
      const oldest = sorted.shift();
      delete GameState.focusCalendar[oldest];
    }
  },

  formatLabel(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  },

  render() {
    if (!this.container) return;
    const days = this.getWeekDates();
    this.container.innerHTML = '';
    let completeCount = 0;
    let running = 0;
    let longest = 0;

    days.forEach(day => {
      const sessions = this.getSessions(day.key);
      const isComplete = sessions > 0;
      if (isComplete) {
        completeCount++;
        running++;
        longest = Math.max(longest, running);
      } else {
        running = 0;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = `user-stat calendar-day${isComplete ? ' calendar-day--done' : ''}`;
      button.dataset.calendarDay = day.key;
      button.setAttribute('aria-pressed', isComplete ? 'true' : 'false');
      button.innerHTML = `
        <span class="user-stat-label">${day.weekday}</span>
        <span class="user-stat-value">${isComplete ? 'Logged' : 'Log focus'}</span>
        <span class="calendar-day-meta">${day.label}</span>
        <span class="small-note">${isComplete ? `${sessions} session${sessions === 1 ? '' : 's'}` : 'Tap to add'}</span>
      `;
      this.container.appendChild(button);
    });

    if (this.summaryEl) {
      const summary = `${completeCount}/${this.daysToShow} days logged · best streak this week ${longest} day${longest === 1 ? '' : 's'}. Visible calendars help sustain routines without feeling punitive.`;
      this.summaryEl.textContent = summary;
    }
  }
};

// ============================================================================
// SCRATCH CARD REWARDS
// ============================================================================

function generateScratchCard() {
  const messages = [
    { text: '🌟 You\'re doing amazing!', points: 50 },
    { text: '🎯 Focus champion!', points: 75 },
    { text: '🔥 On fire! Keep going!', points: 100 },
    { text: '💪 Strength in consistency!', points: 50 },
    { text: '🚀 Reaching new heights!', points: 150 },
    { text: '🎨 Creative genius!', points: 100 },
    { text: '⭐ Star performer!', points: 125 },
    { text: '🏆 Trophy earned!', points: 200 }
  ];
  
  const message = messages[Math.floor(Math.random() * messages.length)];
  return {
    id: Date.now(),
    ...message,
    revealed: false
  };
}

const ScratchCards = {
  init() {
    this.renderCards();
  },
  renderCards() {
    const container = document.getElementById('scratchCardsContainer');
    container.innerHTML = '';
    
    if (GameState.scratchCards.length === 0) {
      container.innerHTML = '<p class="muted">Play games to unlock scratch cards!</p>';
      return;
    }
    
    GameState.scratchCards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'scratch-card' + (card.revealed ? ' revealed' : '');
      cardEl.innerHTML = `
        <div class="scratch-card-front">
          <div class="scratch-overlay" data-card-id="${card.id}">
            <p>Scratch to reveal!</p>
          </div>
          <div class="scratch-card-content">
            <p class="scratch-message">${card.text}</p>
            <p class="scratch-points">+${card.points} points</p>
          </div>
        </div>
      `;
      
      if (!card.revealed) {
        const overlay = cardEl.querySelector('.scratch-overlay');
        overlay.addEventListener('click', () => this.revealCard(card.id));
      }
      
      container.appendChild(cardEl);
    });
  },
  
  revealCard(cardId) {
    const card = GameState.scratchCards.find(c => c.id === cardId);
    if (card && !card.revealed) {
      card.revealed = true;
      GameState.addPoints(card.points);
      GameState.unlockedCards++;
      GameState.save();
      
      showNotification(`🎁 ${card.text} +${card.points} points!`);
      this.renderCards();
      
      // Badge for collecting cards
      if (GameState.unlockedCards >= 10) {
        GameState.unlockBadge('card_collector', 'Card Collector - 10 cards');
      }
    }
  }
};

// ============================================================================
// BADGES & COLLECTIBLES
// ============================================================================

const badgeDefinitions = {
  points_100: { name: 'First Steps', icon: '🎯', desc: 'Earned 100 points' },
  points_250: { name: 'Rising Star', icon: '⭐', desc: 'Earned 250 points' },
  points_500: { name: 'Focused Mind', icon: '🧠', desc: 'Earned 500 points' },
  points_1000: { name: 'Dedication', icon: '💎', desc: 'Earned 1,000 points' },
  points_2500: { name: 'Champion', icon: '🏆', desc: 'Earned 2,500 points' },
  points_5000: { name: 'Legend', icon: '👑', desc: 'Earned 5,000 points' },
  points_10000: { name: 'Master', icon: '🌟', desc: 'Earned 10,000 points' },
  
  memory_master: { name: 'Memory Master', icon: '🧩', desc: 'Score 200+ in Memory Matrix' },
  memory_marathon: { name: 'Memory Marathon', icon: '🏃', desc: 'Reach round 10 in Memory Matrix' },
  sharp_shooter: { name: 'Sharp Shooter', icon: '🎯', desc: '90% accuracy in Color Storm' },
  color_master: { name: 'Color Master', icon: '🌈', desc: 'Score 500+ in Color Storm' },
  laser_focus: { name: 'Laser Focus', icon: '🔦', desc: '80% focus rate in Focus Flow' },
  zen_master: { name: 'Zen Master', icon: '🧘', desc: '50+ streak in Focus Flow' },
  rhythm_master: { name: 'Rhythm Master', icon: '🎵', desc: '10 rounds in Pattern Pulse' },
  perfect_pitch: { name: 'Perfect Pitch', icon: '🎼', desc: '15 perfect rounds in Pattern Pulse' },
  
  journaling_habit: { name: 'Journaling Habit', icon: '📔', desc: '7 journal entries' },
  card_collector: { name: 'Card Collector', icon: '🎴', desc: 'Revealed 10 scratch cards' },
  week_warrior: { name: 'Week Warrior', icon: '📅', desc: '7 day streak' },
  month_master: { name: 'Month Master', icon: '📆', desc: '30 day streak' },
  calendar_champion: { name: 'Calendar Champion', icon: '🗓️', desc: 'Completed every day in a week' }
};

function updateBadgesDisplay() {
  const container = document.getElementById('badgesContainer');
  container.innerHTML = '';
  
  // Show earned badges
  GameState.badges.forEach(badgeId => {
    const badge = badgeDefinitions[badgeId];
    if (badge) {
      const badgeEl = document.createElement('div');
      badgeEl.className = 'badge earned';
      badgeEl.innerHTML = `
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-desc">${badge.desc}</div>
      `;
      container.appendChild(badgeEl);
    }
  });
  
  // Show some locked badges
  const allBadgeIds = Object.keys(badgeDefinitions);
  const lockedBadges = allBadgeIds.filter(id => !GameState.badges.includes(id)).slice(0, 6);
  
  lockedBadges.forEach(badgeId => {
    const badge = badgeDefinitions[badgeId];
    const badgeEl = document.createElement('div');
    badgeEl.className = 'badge locked';
    badgeEl.innerHTML = `
      <div class="badge-icon">🔒</div>
      <div class="badge-name">???</div>
      <div class="badge-desc">${badge.desc}</div>
    `;
    container.appendChild(badgeEl);
  });
}

// ============================================================================
// LEADERBOARD
// ============================================================================

const Leaderboard = {
  init() {
    this.renderLeaderboard();
  },
  
  renderLeaderboard() {
    const container = document.getElementById('leaderboardList');
    container.innerHTML = '';
    
    // In a real app, this would fetch from a server
    // For now, show local stats with some dummy competitors
    const players = [
      { name: 'You', points: GameState.points, level: GameState.level, badges: GameState.badges.length },
      { name: 'Alex', points: 1250, level: 3, badges: 8 },
      { name: 'Sam', points: 980, level: 2, badges: 6 },
      { name: 'Jordan', points: 1450, level: 4, badges: 10 },
      { name: 'Taylor', points: 750, level: 2, badges: 5 }
    ];
    
    players.sort((a, b) => b.points - a.points);
    
    players.forEach((player, index) => {
      const row = document.createElement('div');
      row.className = 'leaderboard-row' + (player.name === 'You' ? ' current-user' : '');
      row.innerHTML = `
        <span class="rank">${index + 1}</span>
        <span class="player-name">${player.name}</span>
        <span class="player-level">Lvl ${player.level}</span>
        <span class="player-badges">${player.badges} 🏆</span>
        <span class="player-points">${player.points} pts</span>
      `;
      container.appendChild(row);
    });
  }
};

// ============================================================================
// AVATAR & THEME CUSTOMIZATION
// ============================================================================

const avatarOptions = [
  { id: 'default', name: 'Default', icon: '😊', unlockAt: 0 },
  { id: 'cool', name: 'Cool', icon: '😎', unlockAt: 250 },
  { id: 'genius', name: 'Genius', icon: '🤓', unlockAt: 500 },
  { id: 'star', name: 'Star', icon: '🌟', unlockAt: 1000 },
  { id: 'rocket', name: 'Rocket', icon: '🚀', unlockAt: 2500 },
  { id: 'crown', name: 'Crown', icon: '👑', unlockAt: 5000 }
];

const themeOptions = [
  { id: 'blue', name: 'Ocean Blue', unlockAt: 0 },
  { id: 'green', name: 'Forest Green', unlockAt: 200 },
  { id: 'purple', name: 'Royal Purple', unlockAt: 500 },
  { id: 'orange', name: 'Sunset Orange', unlockAt: 1000 },
  { id: 'pink', name: 'Cherry Blossom', unlockAt: 1500 },
  { id: 'dark', name: 'Dark Mode', unlockAt: 2000 }
];

const Customization = {
  init() {
    this.renderAvatars();
    this.renderThemes();
    this.applyTheme(GameState.theme);
  },
  
  renderAvatars() {
    const container = document.getElementById('avatarOptions');
    container.innerHTML = '';
    
    avatarOptions.forEach(avatar => {
      const isUnlocked = GameState.points >= avatar.unlockAt;
      const isActive = GameState.avatar === avatar.id;
      
      const avatarEl = document.createElement('div');
      avatarEl.className = 'avatar-option' + 
        (isUnlocked ? ' unlocked' : ' locked') +
        (isActive ? ' active' : '');
      
      avatarEl.innerHTML = `
        <div class="avatar-icon">${isUnlocked ? avatar.icon : '🔒'}</div>
        <div class="avatar-name">${avatar.name}</div>
        ${!isUnlocked ? `<div class="unlock-at">${avatar.unlockAt} pts</div>` : ''}
      `;
      
      if (isUnlocked) {
        avatarEl.addEventListener('click', () => this.selectAvatar(avatar.id));
      }
      
      container.appendChild(avatarEl);
    });
  },
  
  renderThemes() {
    const container = document.getElementById('themeOptions');
    container.innerHTML = '';
    
    themeOptions.forEach(theme => {
      const isUnlocked = GameState.points >= theme.unlockAt;
      const isActive = GameState.theme === theme.id;
      
      const themeEl = document.createElement('div');
      themeEl.className = 'theme-option' + 
        (isUnlocked ? ' unlocked' : ' locked') +
        (isActive ? ' active' : '');
      themeEl.dataset.theme = theme.id;
      
      themeEl.innerHTML = `
        <div class="theme-preview"></div>
        <div class="theme-name">${theme.name}</div>
        ${!isUnlocked ? `<div class="unlock-at">${theme.unlockAt} pts</div>` : ''}
      `;
      
      if (isUnlocked) {
        themeEl.addEventListener('click', () => this.selectTheme(theme.id));
      }
      
      container.appendChild(themeEl);
    });
  },
  
  selectAvatar(avatarId) {
    GameState.avatar = avatarId;
    GameState.save();
    
    const avatar = avatarOptions.find(a => a.id === avatarId);
    showNotification(`Avatar changed to ${avatar.icon} ${avatar.name}`);
    
    this.renderAvatars();
    updateUserDisplay();
  },
  
  selectTheme(themeId) {
    GameState.theme = themeId;
    GameState.save();
    
    this.applyTheme(themeId);
    this.renderThemes();
    
    const theme = themeOptions.find(t => t.id === themeId);
    showNotification(`Theme changed to ${theme.name}`);
  },
  
  applyTheme(themeId) {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeId}`);
  }
};

// ============================================================================
// UI HELPERS
// ============================================================================

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function updatePointsDisplay() {
  document.getElementById('userPoints').textContent = GameState.points;
  document.getElementById('userLevel').textContent = GameState.level;
}

function updateUserDisplay() {
  const avatar = avatarOptions.find(a => a.id === GameState.avatar);
  if (avatar) {
    document.getElementById('userAvatar').textContent = avatar.icon;
  }
  
  document.getElementById('userStreak').textContent = `${GameState.streakDays} day${GameState.streakDays !== 1 ? 's' : ''}`;
  document.getElementById('totalGamesPlayed').textContent = GameState.totalGamesPlayed;
}

function formatGameBestDisplay(config, value = 0) {
  if (config.metric === 'bestFocusRate') {
    return `${Math.max(0, Math.round(value))}% focus rate`;
  }
  if (config.metric === 'bestRound') {
    return `${Math.max(0, Math.round(value))} rounds`;
  }
  return `${Math.max(0, Math.round(value))} pts`;
}

function updateGameCardFeedback() {
  if (typeof document === 'undefined') return;
  const cards = document.querySelectorAll('[data-game-feedback]');
  if (!cards.length) return;
  const state = window.GameState || GameState;
  if (!state || !state.stats) return;

  cards.forEach(card => {
    const key = card.dataset.gameFeedback;
    const config = GAME_CARD_TARGETS[key];
    if (!config) return;
    const messageEl = card.querySelector('[data-feedback-message]');
    const statEl = card.querySelector('[data-feedback-stat]');
    const stats = state.stats[key] || {};
    const played = Number(stats.played) || 0;
    const metricValue = Number(stats[config.metric]) || 0;

    let message = config.emptyText;
    let stat = 'No sessions logged yet.';

    if (played > 0 || metricValue > 0) {
      const remainingRaw = config.target - metricValue;
      if (remainingRaw <= 0) {
        message = config.successText;
      } else {
        const remainingValue = config.metric === 'bestFocusRate'
          ? Math.max(0, Math.round(remainingRaw))
          : Math.max(0, Math.ceil(remainingRaw));
        const unitLabel = config.metric === 'bestFocusRate'
          ? '% focus'
          : config.metric === 'bestRound'
            ? ' rounds'
            : ' pts';
        message = `${remainingValue}${unitLabel} to unlock the ${config.goalLabel}.`;
      }

      const bestDisplay = formatGameBestDisplay(config, metricValue);
      const sessionsLabel = played === 1 ? 'session' : 'sessions';
      stat = `Best: ${bestDisplay} · ${played} ${sessionsLabel}`;
    }

    if (messageEl) messageEl.textContent = message;
    if (statEl) statEl.textContent = stat;
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Load game state
  GameState.load();
  
  // Initialize UI
  updatePointsDisplay();
  updateUserDisplay();
  updateBadgesDisplay();
  updateGameCardFeedback();
  
  // Initialize systems
  FocusPlaylist.init();
  FocusJournal.init();
  ProgressCalendar.init();
  ScratchCards.init();
  Leaderboard.init();
  Customization.init();
  
  // Game buttons
  document.getElementById('startMemoryMatrix')?.addEventListener('click', () => MemoryMatrix.init());
  document.getElementById('startColorStorm')?.addEventListener('click', () => ColorStorm.init());
  document.getElementById('startFocusFlow')?.addEventListener('click', () => FocusFlow.init());
  document.getElementById('startPatternPulse')?.addEventListener('click', () => PatternPulse.init());
  
  // Color Storm answer buttons
  document.getElementById('colorStormYes')?.addEventListener('click', () => ColorStorm.answer(true));
  document.getElementById('colorStormNo')?.addEventListener('click', () => ColorStorm.answer(false));
  
  // Playlist controls
  document.querySelectorAll('.genre-btn').forEach(btn => {
    btn.addEventListener('click', () => FocusPlaylist.changeGenre(btn.dataset.genre));
  });
  
  document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
    FocusPlaylist.setVolume(e.target.value);
  });
  
  // Journal
  document.getElementById('saveJournalEntry')?.addEventListener('click', () => FocusJournal.addEntry());
  
  // Check for streak badge
  if (GameState.streakDays >= 7 && !GameState.badges.includes('week_warrior')) {
    GameState.unlockBadge('week_warrior', 'Week Warrior - 7 day streak');
  }
  if (GameState.streakDays >= 30 && !GameState.badges.includes('month_master')) {
    GameState.unlockBadge('month_master', 'Month Master - 30 day streak');
  }
});

window.addEventListener('adhd:state-change', () => {
  updateGameCardFeedback();
});

// Export for debugging
window.GameState = GameState;
window.MemoryMatrix = MemoryMatrix;
window.ColorStorm = ColorStorm;
window.FocusFlow = FocusFlow;
window.PatternPulse = PatternPulse;
window.ProgressCalendar = ProgressCalendar;
