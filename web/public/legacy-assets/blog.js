/*
 * AI-Powered Blog & Q&A Hub interactions
 * Plain vanilla JS so the page runs on static hosting.
 */
(function () {
  const stateKey = 'neurobreath_blog_state_v1';
  const defaultState = {
    points: 0,
    journal: [],
    perfectRounds: 0,
    sharedResources: 0,
    cardsRevealed: 0,
    badges: {},
    collectibles: [],
    unlockedThemes: ['calm'],
    activeTheme: 'calm'
  };

  let state = loadState();
  const pointsEl = document.getElementById('focus-points');
  const scratchCountEl = document.getElementById('scratch-count');
  const badgeList = document.getElementById('badge-list');
  const collectibleList = document.getElementById('collectible-list');
  const avatarGrid = document.getElementById('avatar-grid');
  const themeMessage = document.getElementById('theme-message');
  const journalEntriesEl = document.getElementById('journal-entries');
  const scratchMessageEl = document.getElementById('scratch-message');

  document.body.dataset.theme = state.activeTheme || 'calm';
  updatePointsDisplay();
  scratchCountEl.textContent = state.cardsRevealed || 0;
  renderBadges();
  renderCollectibles();
  renderJournalEntries();
  updateAvatarButtons();

  /* ---------- Chat agent ---------- */
  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmit);
  }

  async function handleChatSubmit(event) {
    event.preventDefault();
    const questionInput = document.getElementById('question-input');
    const topicSelect = document.getElementById('topic-select');
    const question = questionInput.value.trim();
    if (!question) {
      questionInput.focus();
      return;
    }

    appendMessage('user', question);
    questionInput.value = '';

    const placeholderId = appendMessage('ai', 'Thinking...');
    try {
      const response = await callAiCoach({ question, topic: topicSelect.value });
      updateMessage(placeholderId, response);
    } catch (error) {
      updateMessage(placeholderId, 'Sorry, I could not fetch an answer right now. Please try again in a moment.');
      console.error(error);
    }
  }

  function appendMessage(role, text) {
    const chatLog = document.getElementById('chat-log');
    if (!chatLog) return null;
    const messageEl = document.createElement('div');
    messageEl.className = `message ${role === 'ai' ? 'ai-message' : 'user-message'}`;
    const id = crypto.randomUUID();
    messageEl.dataset.messageId = id;
    const meta = document.createElement('p');
    meta.className = 'message__meta';
    meta.textContent = `${role === 'ai' ? 'AI Coach' : 'You'} · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const body = document.createElement('p');
    body.textContent = text;
    messageEl.append(meta, body);
    chatLog.appendChild(messageEl);
    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });
    return id;
  }

  function updateMessage(id, newText) {
    const chatLog = document.getElementById('chat-log');
    if (!chatLog) return;
    const messageEl = chatLog.querySelector(`[data-message-id="${id}"]`);
    if (messageEl) {
      const body = messageEl.querySelector('p:nth-of-type(2)');
      if (body) body.textContent = `${newText}\n\nThis is general educational information, not medical advice.`;
    }
  }

  async function callAiCoach({ question, topic }) {
    /*
     * TODO: Replace the simulated response with a live API request.
     * Steps:
     * 1. Deploy or select an AI endpoint (e.g. self-hosted model, Azure OpenAI, OpenAI, Anthropic, etc.).
     * 2. Call it here using fetch().
     * 3. Pass question + topic, request citations, enforce safety filters, and include the disclaimer in the final text.
     * 4. NEVER expose API keys client-side. Use a serverless proxy or Cloudflare Worker to inject credentials.
     */
    const simulatedSources = [
      'NICE NG87',
      'NHS Every Mind Matters',
      'CDC ADHD Toolkit',
      'PubMed: Jiang et al., 2022'
    ];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `Here\'s a quick take on ${topic || 'that topic'}: focus on predictable routines, external timers, and sensory-friendly spaces. ` +
            `You\'ll find more in our ADHD tools page: /adhd.html. ` +
            `Key sources: ${simulatedSources.join(', ')}.`
        );
      }, 1200);
    });
  }

  /* ---------- State helpers ---------- */
  function loadState() {
    try {
      const raw = localStorage.getItem(stateKey);
      if (!raw) return { ...defaultState };
      return { ...defaultState, ...JSON.parse(raw) };
    } catch (error) {
      console.warn('State load failed', error);
      return { ...defaultState };
    }
  }

  function saveState() {
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  function updatePointsDisplay() {
    if (!pointsEl) return;
    pointsEl.textContent = state.points;
    pointsEl.dataset.points = state.points;
  }

  function addPoints(amount, reason) {
    state.points = Math.max(0, Math.round(state.points + amount));
    updatePointsDisplay();
    saveState();
    renderBadges();
    renderCollectibles();
    if (reason) {
      const announcer = document.getElementById('theme-message');
      if (announcer) {
        announcer.textContent = `+${amount} focus points for ${reason}.`;
        setTimeout(() => (announcer.textContent = ''), 4000);
      }
    }
  }

  document.getElementById('reset-progress-btn')?.addEventListener('click', () => {
    if (!confirm('Reset all progress, badges, and points?')) return;
    state = { ...defaultState };
    document.body.dataset.theme = 'calm';
    updatePointsDisplay();
    scratchCountEl.textContent = '0';
    scratchMessageEl.textContent = '';
    journalEntriesEl.innerHTML = '';
    renderBadges();
    renderCollectibles();
    updateAvatarButtons();
    saveState();
  });

  /* ---------- Focus games ---------- */
  const rhythmState = { interval: null, tapWindow: 250, beatLength: 1500, beats: 0, hits: 0, running: false };
  const rhythmButton = document.querySelector('[data-target="rhythm-runner"][data-action="start"]');
  const rhythmProgress = document.getElementById('rhythm-progress');
  const rhythmFeedback = document.getElementById('rhythm-feedback');
  let rhythmTapButton;

  rhythmButton?.addEventListener('click', startRhythmGame);

  function ensureRhythmTapButton() {
    if (rhythmTapButton) return;
    rhythmTapButton = document.createElement('button');
    rhythmTapButton.type = 'button';
    rhythmTapButton.className = 'btn ghost';
    rhythmTapButton.textContent = 'Tap beat';
    rhythmButton.parentElement?.appendChild(rhythmTapButton);
    rhythmTapButton.addEventListener('click', () => {
      if (!rhythmState.running) return;
      const delta = Math.abs(Date.now() - rhythmState.nextBeat);
      if (delta <= rhythmState.tapWindow) {
        rhythmState.hits += 1;
        rhythmFeedback.textContent = 'Great timing!';
      } else {
        rhythmFeedback.textContent = 'Too early/late. Listen again.';
      }
    });
  }

  function startRhythmGame() {
    ensureRhythmTapButton();
    if (rhythmState.running) return;
    rhythmState.running = true;
    rhythmState.beats = 0;
    rhythmState.hits = 0;
    rhythmState.nextBeat = Date.now() + 1200;
    rhythmFeedback.textContent = 'Tap when the beat reaches the zone!';
    rhythmButton.disabled = true;
    rhythmProgress.style.width = '0%';

    rhythmState.interval = setInterval(() => {
      const elapsed = Math.max(0, rhythmState.nextBeat - Date.now());
      const progress = 100 - (elapsed / rhythmState.beatLength) * 100;
      rhythmProgress.style.width = `${Math.max(0, Math.min(progress, 100))}%`;
      if (Date.now() >= rhythmState.nextBeat) {
        rhythmState.beats += 1;
        rhythmState.nextBeat = Date.now() + rhythmState.beatLength;
      }
    }, 60);

    setTimeout(() => {
      clearInterval(rhythmState.interval);
      rhythmState.running = false;
      rhythmButton.disabled = false;
      const accuracy = rhythmState.beats ? Math.round((rhythmState.hits / rhythmState.beats) * 100) : 0;
      rhythmFeedback.textContent = `Round complete · Accuracy ${accuracy}%`;
      const pointsEarned = Math.round(accuracy / 5);
      addPoints(pointsEarned, 'rhythm sync round');
      if (accuracy >= 90) {
        state.perfectRounds += 1;
        saveState();
      }
      renderBadges();
    }, 30000);
  }

  // Breath & Focus Tiles
  const tileLabels = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  const tileGrid = document.getElementById('breath-tiles');
  const breathFeedback = document.getElementById('breath-feedback');
  const breathButton = document.querySelector('[data-target="breath-tiles"][data-action="start"]');
  const breathState = { activeIndex: null, step: 0, totalSteps: 0, correct: 0, interval: null, running: false };

  if (tileGrid) {
    tileLabels.forEach((label, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.dataset.index = String(index);
      tileGrid.appendChild(btn);
    });

    tileGrid.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      if (!breathState.running) return;
      const idx = Number(target.dataset.index);
      if (idx === breathState.activeIndex) {
        breathState.correct += 1;
        target.classList.add('tile-correct');
        setTimeout(() => target.classList.remove('tile-correct'), 400);
      } else {
        target.classList.add('tile-miss');
        setTimeout(() => target.classList.remove('tile-miss'), 400);
      }
    });
  }

  breathButton?.addEventListener('click', startBreathCycle);

  function startBreathCycle() {
    if (breathState.running) return;
    breathState.running = true;
    breathState.correct = 0;
    breathState.step = 0;
    breathState.totalSteps = 8;
    breathFeedback.textContent = 'Follow inhale · hold · exhale · hold';
    breathButton.disabled = true;

    breathState.interval = setInterval(() => {
      breathState.activeIndex = breathState.step % tileLabels.length;
      [...tileGrid.children].forEach((child, idx) => {
        child.classList.toggle('tile-active', idx === breathState.activeIndex);
      });
      breathState.step += 1;
      if (breathState.step >= breathState.totalSteps) {
        clearInterval(breathState.interval);
        breathState.running = false;
        breathButton.disabled = false;
        [...tileGrid.children].forEach((child) => child.classList.remove('tile-active'));
        const accuracy = Math.round((breathState.correct / breathState.totalSteps) * 100);
        breathFeedback.textContent = `Cycle complete · Accuracy ${accuracy}%`;
        addPoints(Math.round(accuracy / 4), 'breath focus cycle');
        if (accuracy >= 95) {
          state.perfectRounds += 1;
          saveState();
        }
        renderBadges();
      }
    }, 2000);
  }

  // Signal Switch Quest
  const signalButton = document.querySelector('[data-target="signal-switch"][data-action="start"]');
  const signalDisplay = document.getElementById('signal-display');
  const signalFeedback = document.getElementById('signal-feedback');
  const signalButtons = document.querySelectorAll('.signal-buttons button');
  const signalRules = [
    { text: 'Tap GREEN when shown', type: 'tap', target: 'green' },
    { text: 'Tap BLUE when shown', type: 'tap', target: 'blue' },
    { text: 'Avoid GREEN (tap blue only)', type: 'avoid', target: 'green' },
    { text: 'Avoid BLUE (tap green only)', type: 'avoid', target: 'blue' }
  ];
  const signalState = { running: false, rule: null, score: 0, attempts: 0, timeout: null };

  signalButton?.addEventListener('click', startSignalGame);
  signalButtons.forEach((btn) => btn.addEventListener('click', () => handleSignalChoice(btn.dataset.signal)));

  function startSignalGame() {
    if (signalState.running) return;
    signalState.running = true;
    signalState.score = 0;
    signalState.attempts = 0;
    signalFeedback.textContent = '';
    signalButton.disabled = true;
    setSignalRule();
    signalState.timeout = setTimeout(() => {
      signalState.running = false;
      signalButton.disabled = false;
      const accuracy = signalState.attempts ? Math.round((signalState.score / signalState.attempts) * 100) : 0;
      signalFeedback.textContent = `Quest complete · Accuracy ${accuracy}%`;
      addPoints(Math.round(accuracy / 3), 'signal switching quest');
      if (accuracy >= 92) {
        state.perfectRounds += 1;
        saveState();
      }
      renderBadges();
    }, 45000);
  }

  function setSignalRule() {
    const rule = signalRules[Math.floor(Math.random() * signalRules.length)];
    signalState.rule = rule;
    if (signalDisplay) signalDisplay.textContent = rule.text;
  }

  function handleSignalChoice(color) {
    if (!signalState.running || !color) return;
    signalState.attempts += 1;
    const { rule } = signalState;
    let correct = false;
    if (rule.type === 'tap') {
      correct = rule.target === color;
    } else {
      correct = rule.target !== color;
    }
    signalState.score += correct ? 1 : 0;
    signalFeedback.textContent = correct ? 'Nice switch!' : 'Oops, new rule coming.';
    setSignalRule();
  }

  // Skyline Tracker
  const tracker = document.getElementById('tracker');
  const trackerTarget = document.getElementById('tracker-target');
  const trackerButton = document.querySelector('[data-target="skyline-tracker"][data-action="start"]');
  const trackerFeedback = document.getElementById('tracker-feedback');
  const trackerState = { running: false, x: 50, y: 50, hits: 0, ticks: 0, interval: null };

  trackerButton?.addEventListener('click', startTrackerGame);
  document.addEventListener('keydown', handleTrackerControl);

  function startTrackerGame() {
    if (trackerState.running) return;
    trackerState.running = true;
    trackerState.x = 50;
    trackerState.y = 50;
    trackerState.hits = 0;
    trackerState.ticks = 0;
    trackerFeedback.textContent = 'Keep the comet near the centre using arrow keys.';
    trackerButton.disabled = true;
    updateTrackerPosition();
    tracker?.focus();
    trackerState.interval = setInterval(() => {
      trackerState.x += (Math.random() * 20 - 10);
      trackerState.y += (Math.random() * 20 - 10);
      clampTracker();
      trackerState.ticks += 1;
      updateTrackerPosition();
      evaluateTracker();
    }, 900);
    setTimeout(stopTrackerGame, 60000);
  }

  function handleTrackerControl(event) {
    if (!trackerState.running) return;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const delta = 5;
    if (event.key === 'ArrowUp') trackerState.y -= delta;
    if (event.key === 'ArrowDown') trackerState.y += delta;
    if (event.key === 'ArrowLeft') trackerState.x -= delta;
    if (event.key === 'ArrowRight') trackerState.x += delta;
    clampTracker();
    updateTrackerPosition();
    evaluateTracker();
  }

  function clampTracker() {
    trackerState.x = Math.min(90, Math.max(10, trackerState.x));
    trackerState.y = Math.min(90, Math.max(10, trackerState.y));
  }

  function updateTrackerPosition() {
    if (!trackerTarget) return;
    trackerTarget.style.left = `${trackerState.x}%`;
    trackerTarget.style.top = `${trackerState.y}%`;
  }

  function evaluateTracker() {
    const distance = Math.hypot(trackerState.x - 50, trackerState.y - 50);
    if (distance <= 12) {
      trackerState.hits += 1;
    }
  }

  function stopTrackerGame() {
    clearInterval(trackerState.interval);
    trackerState.running = false;
    trackerButton.disabled = false;
    const accuracy = trackerState.ticks ? Math.round((trackerState.hits / trackerState.ticks) * 100) : 0;
    trackerFeedback.textContent = `Track complete · Accuracy ${accuracy}%`;
    addPoints(Math.round(accuracy / 2.5), 'skyline tracker run');
    if (accuracy >= 90) {
      state.perfectRounds += 1;
      saveState();
    }
    renderBadges();
  }

  /* ---------- Playlist ---------- */
  const playlistTempo = document.getElementById('playlist-tempo');
  const playlistTempoValue = document.getElementById('playlist-tempo-value');
  const playlistSummary = document.getElementById('playlist-summary');
  const savePlaylistBtn = document.getElementById('save-playlist');

  document.getElementById('track-list')?.addEventListener('change', updatePlaylistSummary);
  playlistTempo?.addEventListener('input', () => {
    if (playlistTempoValue) playlistTempoValue.textContent = `${playlistTempo.value} BPM`;
  });

  savePlaylistBtn?.addEventListener('click', () => {
    updatePlaylistSummary();
    addPoints(5, 'saving a personalised playlist');
  });

  function updatePlaylistSummary() {
    const selected = [...document.querySelectorAll('#track-list input:checked')].map((input) => input.value);
    playlistSummary.textContent = selected.length ? `Selected tracks: ${selected.join(', ')}` : 'Selected tracks: none yet';
    state.playlist = selected;
    saveState();
  }

  /* ---------- Gamified journal ---------- */
  const journalForm = document.getElementById('journal-form');
  journalForm?.addEventListener('submit', handleJournalSubmit);
  document.getElementById('export-journal')?.addEventListener('click', exportJournal);

  function handleJournalSubmit(event) {
    event.preventDefault();
    const activity = document.getElementById('journal-activity').value.trim();
    const duration = Number(document.getElementById('journal-duration').value);
    const audience = document.getElementById('journal-audience').value;
    const reflection = document.getElementById('journal-reflection').value.trim();
    if (!activity || !duration || !reflection) return;
    const entry = {
      id: crypto.randomUUID(),
      activity,
      duration,
      audience,
      reflection,
      timestamp: new Date().toISOString()
    };
    state.journal.unshift(entry);
    if (state.journal.length > 25) state.journal.pop();
    saveState();
    renderJournalEntries();
    journalForm.reset();
    addPoints(15, 'logging a focus journal entry');
  }

  function renderJournalEntries() {
    if (!journalEntriesEl) return;
    journalEntriesEl.innerHTML = '';
    state.journal.forEach((entry) => {
      const card = document.createElement('article');
      card.className = 'journal-entry';
      card.innerHTML = `
        <p class="journal-entry__title"><strong>${entry.activity}</strong> · ${entry.duration} mins · ${entry.audience}</p>
        <p>${entry.reflection}</p>
        <p class="journal-entry__meta">${new Date(entry.timestamp).toLocaleString()}</p>
      `;
      journalEntriesEl.appendChild(card);
    });
  }

  function exportJournal() {
    if (!state.journal.length) {
      alert('Log at least one entry before exporting.');
      return;
    }
    const content = state.journal
      .map((entry) => `${new Date(entry.timestamp).toLocaleString()} - ${entry.activity} (${entry.duration} mins) - ${entry.audience}\n${entry.reflection}`)
      .join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'focus-journal.txt';
    link.click();
    URL.revokeObjectURL(url);
  }

  /* ---------- Scratch cards ---------- */
  document.querySelectorAll('.scratch-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('revealed')) return;
      card.classList.add('revealed');
      state.cardsRevealed += 1;
      scratchCountEl.textContent = state.cardsRevealed;
      const message = card.dataset.message || 'Keep going!';
      scratchMessageEl.textContent = message;
      addPoints(5, 'revealing a scratch-card reward');
      if (state.cardsRevealed % 5 === 0) {
        addPoints(30, 'hitting a motivation milestone');
      }
      saveState();
    });
  });

  /* ---------- Badges & collectibles ---------- */
  function renderBadges() {
    if (!badgeList) return;
    const badgeConditions = {
      starter: state.points >= 50,
      navigator: state.journal.length >= 5,
      ally: state.sharedResources >= 3,
      mentor: state.perfectRounds >= 5
    };
    [...badgeList.children].forEach((item) => {
      const key = item.dataset.badge;
      const earned = badgeConditions[key];
      item.classList.toggle('badge-earned', !!earned);
      state.badges[key] = earned;
    });
    saveState();
  }

  function renderCollectibles() {
    if (!collectibleList) return;
    const collectibles = [
      { name: 'Focus Fern', threshold: 100 },
      { name: 'Soothing Constellation', threshold: 200 },
      { name: 'NeuroSpark Circuit', threshold: 320 }
    ];
    collectibleList.innerHTML = '';
    collectibles.forEach((item) => {
      const li = document.createElement('li');
      const unlocked = state.points >= item.threshold;
      li.textContent = `${item.name} ${unlocked ? '· unlocked' : `· unlocks at ${item.threshold} pts`}`;
      collectibleList.appendChild(li);
      if (unlocked && !state.collectibles.includes(item.name)) {
        state.collectibles.push(item.name);
      }
    });
    saveState();
  }

  document.querySelectorAll('.resource-links a').forEach((link) => {
    link.addEventListener('click', () => {
      state.sharedResources += 1;
      saveState();
      renderBadges();
    });
  });

  /* ---------- Avatars & themes ---------- */
  avatarGrid?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const theme = target.dataset.theme;
    if (!theme) return;
    const cost = Number(target.closest('.avatar-card')?.dataset.cost || 0);
    if (target.dataset.action === 'unlock-theme') {
      if (state.unlockedThemes.includes(theme)) {
        setActiveTheme(theme);
        return;
      }
      if (state.points < cost) {
        themeMessage.textContent = `You need ${cost - state.points} more points to unlock ${theme}.`;
        return;
      }
      state.unlockedThemes.push(theme);
      addPoints(-cost, 'unlocking a theme');
      setActiveTheme(theme);
      updateAvatarButtons();
      saveState();
    } else if (target.dataset.action === 'activate-theme') {
      setActiveTheme(theme);
    }
  });

  function setActiveTheme(theme) {
    state.activeTheme = theme;
    document.body.dataset.theme = theme;
    themeMessage.textContent = `${theme} theme active.`;
    saveState();
    updateAvatarButtons();
  }

  function updateAvatarButtons() {
    avatarGrid?.querySelectorAll('.avatar-card').forEach((card) => {
      const theme = card.querySelector('button')?.dataset.theme;
      if (!theme) return;
      const unlocked = state.unlockedThemes.includes(theme);
      card.classList.toggle('locked', !unlocked && card.dataset.cost !== '0');
      const button = card.querySelector('button');
      if (!button) return;
      if (unlocked) {
        button.textContent = state.activeTheme === theme ? 'Active' : 'Activate';
        button.dataset.action = 'activate-theme';
      }
    });
  }

  /* ---------- Blog filters ---------- */
  const postsGrid = document.getElementById('posts-grid');
  const posts = postsGrid ? [...postsGrid.querySelectorAll('.post-card')] : [];
  const topicFilters = document.querySelectorAll('.filter-topic');
  const audienceFilters = document.querySelectorAll('.filter-audience');
  const searchInput = document.getElementById('search-input');
  const noResults = document.getElementById('no-results');

  function applyFilters() {
    const activeTopics = [...topicFilters].filter((cb) => cb.checked).map((cb) => cb.value);
    const activeAudiences = [...audienceFilters].filter((cb) => cb.checked).map((cb) => cb.value);
    const search = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    posts.forEach((post) => {
      const topics = (post.dataset.topics || '').toLowerCase();
      const audiences = (post.dataset.audience || '').toLowerCase();
      const text = post.textContent.toLowerCase();
      const matchesTopic = !activeTopics.length || activeTopics.some((topic) => topics.includes(topic));
      const matchesAudience = !activeAudiences.length || activeAudiences.some((aud) => audiences.includes(aud));
      const matchesSearch = !search || text.includes(search);
      const show = matchesTopic && matchesAudience && matchesSearch;
      post.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (noResults) noResults.hidden = visibleCount !== 0;
  }

  topicFilters.forEach((cb) => cb.addEventListener('change', applyFilters));
  audienceFilters.forEach((cb) => cb.addEventListener('change', applyFilters));
  searchInput?.addEventListener('input', applyFilters);

  applyFilters();
})();
