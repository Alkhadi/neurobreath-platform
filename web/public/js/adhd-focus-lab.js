(function () {
  const STORAGE_KEY = "nbFocusLabState_v1";

  const clone = (val) => JSON.parse(JSON.stringify(val));

  const defaultState = {
    totalPoints: 0,
    totalMinutes: 0,
    streakDays: 0,
    bestStreak: 0,
    reactionBest: null,
    memoryBest: 0,
    filterBest: 0,
    sprintsLogged: 0,
    playlistCustom: [],
    journalEntries: [],
    scratchReveals: [null, null, null],
    scratchWeekKey: null,
    badges: {},
    leaderboard: [],
    activityLog: [],
    avatar: { emoji: "🚀", label: "Calm focus mode", theme: "calm" },
    userLeaderboardName: null
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(defaultState);
      return { ...clone(defaultState), ...JSON.parse(raw) };
    } catch (err) {
      console.warn("Focus Lab: unable to load state", err);
      return clone(defaultState);
    }
  }

  let state = loadState();

  const els = {
    heroMinutes: document.getElementById("stat-total-mins"),
    heroPoints: document.getElementById("stat-total-points"),
    heroStreak: document.getElementById("stat-streak-days"),
    bestStreak: document.getElementById("stat-best-streak"),
    heroAvatarEmoji: document.getElementById("hero-avatar-emoji"),
    heroAvatarLabel: document.getElementById("hero-avatar-label"),
    toast: document.getElementById("focusToast"),
    toastMessage: document.getElementById("toastMessage"),
    playlistSuggestions: document.getElementById("playlist-suggestions"),
    playlistCustomList: document.getElementById("playlist-custom-list"),
    journalEntries: document.getElementById("journal-entries"),
    badgeList: document.getElementById("badge-list"),
    collectibles: document.getElementById("collectibles"),
    leaderboardList: document.getElementById("leaderboardList"),
    avatarDisplayEmoji: document.getElementById("avatarDisplayEmoji"),
    avatarDisplayLabel: document.getElementById("avatarDisplayLabel"),
    avatarDisplayTheme: document.getElementById("avatarDisplayTheme")
  };

  const playlistModeSelect = document.getElementById("playlist-mode");
  const playlistAddBtn = document.getElementById("playlist-add");
  const playlistNameInput = document.getElementById("playlist-custom-name");
  const playlistLinkInput = document.getElementById("playlist-custom-link");

  const journalDateInput = document.getElementById("journal-date");
  const journalMinutesInput = document.getElementById("journal-minutes");
  const journalMoodInput = document.getElementById("journal-mood");
  const journalNoteInput = document.getElementById("journal-note");
  const journalAddBtn = document.getElementById("journal-add");

  const leaderboardForm = document.getElementById("leaderboardForm");
  const leaderboardNameInput = document.getElementById("leaderboardName");
  const leaderboardPointsInput = document.getElementById("leaderboardPoints");

  const avatarEmojiPicker = document.getElementById("avatarEmojiPicker");
  const avatarLabelInput = document.getElementById("avatarLabelInput");
  const avatarThemeSelect = document.getElementById("avatarTheme");

  const narratorTextEls = {
    reactionPulse: document.getElementById("narrator-text-reactionPulse"),
    memoryTrail: document.getElementById("narrator-text-memoryTrail"),
    distractionFilter: document.getElementById("narrator-text-distractionFilter"),
    focusSprint: document.getElementById("narrator-text-focusSprint"),
    playlist: document.getElementById("narrator-text-playlist"),
    journal: document.getElementById("narrator-text-journal"),
    rewards: document.getElementById("narrator-text-rewards")
  };

  function narratorStepsText(key) {
    return Array.from(document.querySelectorAll(`[data-narrator-steps="${key}"] li`))
      .map((li, index) => `Step ${index + 1}: ${li.textContent.trim()}`)
      .join(" ");
  }

  function updateNarratorText(key, message) {
    if (narratorTextEls[key]) {
      narratorTextEls[key].textContent = message;
    }
  }

  const playlistSuggestions = {
    calm: [
      { title: "Lo-fi neuro focus", note: "Lo-fi, 60–80 BPM" },
      { title: "Harbour piano", note: "Soft piano, no lyrics" },
      { title: "Beta wave drift", note: "12hz gentle binaural" }
    ],
    upbeat: [
      { title: "Clean & reset mix", note: "Funky instrumentals" },
      { title: "ADHD chore sprint", note: "110 BPM percussion" },
      { title: "Kitchen disco", note: "3 track mini-party" }
    ],
    nature: [
      { title: "Mossy woodland", note: "Bird song + brook" },
      { title: "Coastal hum", note: "Tide wash + gulls" },
      { title: "Storm cocoon", note: "Low rumble, no thunder" }
    ],
    silent: [
      { title: "Timer only", note: "Use Focus Sprint timer" },
      { title: "Library ambience", note: "Air + subtle turning pages" },
      { title: "If distracted", note: "Write it down, return" }
    ]
  };

  const playlistModeLabels = {
    calm: "calm background mode",
    upbeat: "upbeat chore mode",
    nature: "nature and neutral mode",
    silent: "silence with timer"
  };

  const distractionPool = [
    { label: "Task: Outline essay", type: "task" },
    { label: "Distraction: Scroll alerts", type: "distraction" },
    { label: "Task: Drink water", type: "task" },
    { label: "Distraction: New video tab", type: "distraction" },
    { label: "Task: Send quick reply", type: "task" },
    { label: "Distraction: Gaming trailer", type: "distraction" },
    { label: "Task: Pack bag", type: "task" },
    { label: "Distraction: Random snack hunt", type: "distraction" }
  ];

  const scratchMessages = [
    "You showed up — that’s the hardest step.",
    "Small sprints, big shifts. Keep stacking them.",
    "Clinicians love consistent logs. You’re doing it."
  ];

  const FocusNarrator = (() => {
    const synthSupported = typeof window !== "undefined" && "speechSynthesis" in window;
    let voices = [];
    let activeButton = null;
    let activeKey = null;
    const voicePrefs = window.NeurobreathVoicePreferences || null;
    let voicePreference = (voicePrefs?.get?.()) || (voicePrefs?.getDefault?.()) || "uk-male";

    voicePrefs?.subscribe?.((value) => {
      voicePreference = value;
    });

    function refreshVoices(retry = 0) {
      if (!synthSupported) return;
      const found = window.speechSynthesis.getVoices();
      if (found && found.length) {
        voices = found;
        return;
      }
      if (retry < 4) {
        setTimeout(() => refreshVoices(retry + 1), 200);
      }
    }

    refreshVoices();

    function pickVoice() {
      if (!voices.length) return null;
      const langPriority = voicePreference === "uk-male" ? ["en-GB", "en"] : ["en-GB", "en"];
      const femaleRegex = /(female|hazel|sonia|libby|serena|kate|elizabeth|victoria)/i;
      const maleRegex = /(male|daniel|george|brian|arthur|ryan|guy|alex|david|tom)/i;
      const genderRegex = voicePreference === "female" ? femaleRegex : maleRegex;

      for (const lang of langPriority) {
        const matches = voices.filter((voice) => (voice.lang || "").toLowerCase().startsWith(lang.toLowerCase()));
        const genderMatch = matches.find((voice) => genderRegex.test(voice.name));
        if (genderMatch) return genderMatch;
        if (matches.length) return matches[0];
      }
      return voices[0];
    }

    function buildScript(key) {
      const base = narratorTextEls[key]?.textContent?.trim() || "";
      const steps = narratorStepsText(key);
      const script = `${base} ${steps}`.trim();
      return script || null;
    }

    function stop() {
      if (synthSupported && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (activeButton) {
        const label = activeButton.dataset.narratorLabel || "🔊 Play narrator";
        activeButton.textContent = label;
        activeButton.dataset.narratorState = "idle";
        activeButton = null;
      }
      activeKey = null;
    }

    function speak(key, button) {
      if (!synthSupported) {
        showToast("Narrator audio is not supported in this browser.");
        return;
      }
      const script = buildScript(key);
      if (!script) {
        showToast("Narrator text is missing for this game.");
        return;
      }
      stop();
      const utterance = new SpeechSynthesisUtterance(script);
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = stop;
      utterance.onerror = stop;
      window.speechSynthesis.speak(utterance);
      activeKey = key;
      activeButton = button;
      activeButton.dataset.narratorState = "playing";
      activeButton.textContent = "⏹ Stop narrator";
    }

    function toggle(key, button) {
      if (!button.dataset.narratorLabel) {
        button.dataset.narratorLabel = button.textContent.trim();
      }
      if (button.dataset.narratorState === "playing" && activeKey === key) {
        stop();
        return;
      }
      speak(key, button);
    }

    return { toggle, stop, refreshVoices };
  })();

  const BADGES = [
    {
      id: "steady_reactor",
      icon: "⚡",
      title: "Steady Reactor",
      desc: "Average Reaction Pulse under 350 ms",
      unlock: (s) => typeof s.reactionBest === "number" && s.reactionBest <= 350
    },
    {
      id: "memory_pathfinder",
      icon: "🧠",
      title: "Memory Pathfinder",
      desc: "Remember 8+ digits in Memory Trail",
      unlock: (s) => s.memoryBest >= 8
    },
    {
      id: "filter_pro",
      icon: "🚦",
      title: "Filter Pro",
      desc: "Score 6+ in Distraction Filter",
      unlock: (s) => s.filterBest >= 6
    },
    {
      id: "sprint_scout",
      icon: "⏱",
      title: "Sprint Scout",
      desc: "Complete 5 focus sprints",
      unlock: (s) => s.sprintsLogged >= 5
    },
    {
      id: "journal_guardian",
      icon: "📝",
      title: "Journal Guardian",
      desc: "Log 5 journal entries",
      unlock: (s) => s.journalEntries.length >= 5
    },
    {
      id: "streak_builder",
      icon: "🔥",
      title: "Streak Builder",
      desc: "Hold a 3-day activity streak",
      unlock: (s) => s.streakDays >= 3
    }
  ];

  const COLLECTIBLES = [
    {
      id: "orb_fragment",
      icon: "💠",
      title: "Orb Fragment",
      desc: "Log 60 minutes total",
      progress: (s) => Math.min((s.totalMinutes / 60) * 100, 100)
    },
    {
      id: "calm_card",
      icon: "🎴",
      title: "Calm Card",
      desc: "Unlock 3 badges",
      progress: (s) => {
        const unlocked = BADGES.filter((badge) => badge.unlock(s)).length;
        return Math.min((unlocked / 3) * 100, 100);
      }
    },
    {
      id: "focus_token",
      icon: "🪙",
      title: "Focus Token",
      desc: "Reach 500 points",
      progress: (s) => Math.min((s.totalPoints / 500) * 100, 100)
    }
  ];

  const DEFAULT_LEADERBOARD = [
    { name: "Focus Crew", points: 760 },
    { name: "Class 9 body-double", points: 540 },
    { name: "ND Parents UK", points: 420 }
  ];

  if (!state.leaderboard || !state.leaderboard.length) {
    state.leaderboard = clone(DEFAULT_LEADERBOARD);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("Focus Lab: unable to save", err);
    }
  }

  function showToast(message) {
    if (!els.toast || !els.toastMessage) return;
    els.toastMessage.textContent = message;
    els.toast.classList.remove("toast-visible");
    void els.toast.offsetWidth; // force reflow for animation reset
    els.toast.classList.add("toast-visible");
    setTimeout(() => {
      els.toast.classList.remove("toast-visible");
    }, 2600);
  }

  function formatDateISO(date) {
    return date.toISOString().split("T")[0];
  }

  function todayISO() {
    return formatDateISO(new Date());
  }

  function logActivity(dateIso = todayISO()) {
    if (!state.activityLog.includes(dateIso)) {
      state.activityLog.push(dateIso);
    }
    updateStreak();
  }

  function updateStreak() {
    const dateSet = new Set(state.activityLog);
    let streak = 0;
    const cursor = new Date();
    while (true) {
      const iso = formatDateISO(cursor);
      if (dateSet.has(iso)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    state.streakDays = streak;
    if (streak > state.bestStreak) {
      state.bestStreak = streak;
    }
  }

  function addPoints(amount, message) {
    if (amount > 0) {
      state.totalPoints += amount;
      if (message) {
        showToast(`${message} (+${amount} pts)`);
      }
    }
    updateStatsUI();
    updateBadges();
    updateCollectibles();
    saveState();
  }

  function addMinutes(amount) {
    if (amount > 0) {
      state.totalMinutes += amount;
      updateStatsUI();
      saveState();
    }
  }

  function updateStatsUI() {
    if (els.heroMinutes) {
      els.heroMinutes.textContent = state.totalMinutes.toString();
    }
    if (els.heroPoints) {
      els.heroPoints.textContent = state.totalPoints.toString();
    }
    if (els.heroStreak) {
      els.heroStreak.textContent = state.streakDays.toString();
    }
    if (els.bestStreak) {
      els.bestStreak.textContent = state.bestStreak.toString();
    }
  }

  function renderPlaylistSuggestions() {
    if (!els.playlistSuggestions) return;
    const mode = playlistModeSelect.value;
    const items = playlistSuggestions[mode] || [];
    els.playlistSuggestions.innerHTML = items
      .map(
        (item) => `
          <div class="playlist-item">
            <strong>${item.title}</strong>
            <span>${item.note}</span>
          </div>
        `
      )
      .join("");
    const label = playlistModeLabels[mode] || mode;
    updateNarratorText(
      "playlist",
      `Focus mode set to ${label}. Sample one of the suggestions above or add your own soundtrack beneath.`
    );
  }

  function renderCustomPlaylist() {
    if (!els.playlistCustomList) return;
    if (!state.playlistCustom.length) {
      els.playlistCustomList.innerHTML = "<p class=\"muted\">Add a track to see it here.</p>";
      return;
    }
    els.playlistCustomList.innerHTML = state.playlistCustom
      .map((item, index) => {
        const link = item.link
          ? `<a href="${item.link}" target="_blank" rel="noopener">Open</a>`
          : "";
        return `
          <div class="playlist-item">
            <strong>${item.name}</strong>
            <span>${link || "Saved locally"}</span>
            <button class="btn btn-quiet btn-sm" data-remove-track="${index}">Remove</button>
          </div>
        `;
      })
      .join("");
  }

  function renderJournal() {
    if (!els.journalEntries) return;
    if (!state.journalEntries.length) {
      els.journalEntries.innerHTML = "<p class=\"muted\">No entries yet. Log a few words after a focus block.</p>";
      return;
    }
    const entries = [...state.journalEntries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8)
      .map(
        (entry) => `
          <div class="journal-entry">
            <div class="journal-entry-main">
              <strong>${entry.date}</strong>
              <span>${entry.minutes} min · ${entry.mood}</span>
            </div>
            ${entry.note ? `<div class="journal-entry-note">${entry.note}</div>` : ""}
          </div>
        `
      )
      .join("");
    els.journalEntries.innerHTML = entries;
  }

  function renderBadges() {
    if (!els.badgeList) return;
    els.badgeList.innerHTML = BADGES.map((badge) => {
      const unlocked = badge.unlock(state);
      state.badges[badge.id] = unlocked;
      return `
        <div class="badge ${unlocked ? "unlocked" : ""}">
          <div class="badge-title"><span>${badge.icon}</span><span>${badge.title}</span></div>
          <div class="badge-desc">${badge.desc}</div>
          <div class="badge-meta">${unlocked ? "Unlocked" : "Keep practising"}</div>
        </div>
      `;
    }).join("");
  }

  function renderCollectibles() {
    if (!els.collectibles) return;
    els.collectibles.innerHTML = COLLECTIBLES.map((item) => {
      const progress = Math.min(Math.round(item.progress(state)), 100);
      const unlocked = progress >= 100;
      return `
        <div class="collectible">
          <div class="collectible-main">
            <strong>${item.icon} ${item.title}</strong>
            <span class="collectible-meta">${item.desc}</span>
          </div>
          <div class="collectible-meta" style="text-align:right;min-width:120px;">
            <div class="progress-bar">
              <div class="progress-fill" style="width:${progress}%;"></div>
            </div>
            ${unlocked ? "Unlocked" : `${progress}%`}
          </div>
        </div>
      `;
    }).join("");
  }

  function renderLeaderboard() {
    if (!els.leaderboardList) return;
    const sorted = [...state.leaderboard].sort((a, b) => b.points - a.points).slice(0, 6);
    els.leaderboardList.innerHTML = sorted
      .map((entry, index) => {
        const meClass = state.userLeaderboardName && entry.name === state.userLeaderboardName ? "me" : "";
        return `
          <li class="leaderboard-item ${meClass}">
            <span><span class="leaderboard-rank">#${index + 1}</span> ${entry.name}</span>
            <span>${entry.points} pts</span>
          </li>
        `;
      })
      .join("");
  }

  function syncAvatarUI() {
    if (els.heroAvatarEmoji) {
      els.heroAvatarEmoji.textContent = state.avatar.emoji;
    }
    if (els.heroAvatarLabel) {
      els.heroAvatarLabel.textContent = state.avatar.label;
    }
    if (els.avatarDisplayEmoji) {
      els.avatarDisplayEmoji.textContent = state.avatar.emoji;
    }
    if (els.avatarDisplayLabel) {
      els.avatarDisplayLabel.textContent = state.avatar.label;
    }
    if (els.avatarDisplayTheme) {
      els.avatarDisplayTheme.textContent = `Theme: ${state.avatar.theme}`;
    }
    if (avatarEmojiPicker) {
      avatarEmojiPicker.value = state.avatar.emoji;
    }
    if (avatarLabelInput) {
      avatarLabelInput.value = state.avatar.label;
    }
    if (avatarThemeSelect) {
      avatarThemeSelect.value = state.avatar.theme;
    }
    document.documentElement.dataset.theme = state.avatar.theme;
  }

  function initAvatarControls() {
    if (avatarEmojiPicker) {
      avatarEmojiPicker.addEventListener("change", () => {
        state.avatar.emoji = avatarEmojiPicker.value;
        syncAvatarUI();
        saveState();
      });
    }
    if (avatarLabelInput) {
      avatarLabelInput.addEventListener("input", () => {
        state.avatar.label = avatarLabelInput.value || "Focus mode";
        syncAvatarUI();
        saveState();
      });
    }
    if (avatarThemeSelect) {
      avatarThemeSelect.addEventListener("change", () => {
        const requested = avatarThemeSelect.value;
        const thresholds = { calm: 0, bold: 400, forest: 600 };
        const needed = thresholds[requested] || 0;
        if (state.totalPoints < needed) {
          showToast(`Earn ${needed} pts to unlock this theme.`);
          avatarThemeSelect.value = state.avatar.theme;
          return;
        }
        state.avatar.theme = requested;
        syncAvatarUI();
        updateNarratorText(
          "rewards",
          `Theme switched to ${requested}. Avatar updates reflect your point unlocks and keep the dashboard fun.`
        );
        saveState();
      });
    }
    syncAvatarUI();
  }

  function resetScratchCardsIfNeeded() {
    const now = new Date();
    const monday = new Date(now);
    const day = monday.getDay() || 7;
    monday.setDate(monday.getDate() - day + 1);
    const key = formatDateISO(monday);
    if (state.scratchWeekKey !== key) {
      state.scratchWeekKey = key;
      state.scratchReveals = [null, null, null];
    }
  }

  function renderScratchCards() {
    document.querySelectorAll(".scratch-card").forEach((card) => {
      const idx = Number(card.dataset.scratchId);
      const reveal = state.scratchReveals[idx];
      const textEl = card.querySelector(".scratch-text");
      if (reveal) {
        card.classList.add("scratched");
        if (textEl) textEl.textContent = reveal;
      } else {
        card.classList.remove("scratched");
        if (textEl) textEl.textContent = "Tap to scratch";
      }
    });
  }

  function handleScratch(card) {
    const idx = Number(card.dataset.scratchId);
    if (!Number.isInteger(idx)) return;
    if (state.scratchReveals[idx]) {
      showToast("You already revealed this card.");
      return;
    }
    const message = scratchMessages[idx] || scratchMessages[0];
    state.scratchReveals[idx] = message;
    addPoints(10, "Scratch bonus");
    logActivity();
    updateNarratorText(
      "rewards",
      `Scratch reveal: "${message}". Total points now ${state.totalPoints}. Check badges and collectibles for fresh unlocks.`
    );
    renderScratchCards();
    saveState();
  }

  const ReactionPulse = (() => {
    const startBtn = document.getElementById("game1-start");
    const tapBtn = document.getElementById("game1-tap");
    const status = document.getElementById("game1-status");
    const best = document.getElementById("game1-best");
    const totalRounds = 5;
    let currentRound = 0;
    let timeoutId;
    let ready = false;
    let startTime = 0;
    const times = [];

    function queueRound() {
      ready = false;
      tapBtn.disabled = true;
      status.textContent = "Wait for the glow...";
      const displayRound = currentRound + 1;
      updateNarratorText("reactionPulse", `Round ${displayRound} primed. Keep breathing slow until the orb says tap.`);
      timeoutId = window.setTimeout(() => {
        status.textContent = "Tap now!";
        startTime = performance.now();
        ready = true;
        tapBtn.disabled = false;
      }, 1200 + Math.random() * 1400);
    }

    function finish() {
      startBtn.disabled = false;
      tapBtn.disabled = true;
      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      status.textContent = `Set complete. Avg: ${avg} ms.`;
      updateNarratorText("reactionPulse", `Set finished with a ${avg} ms average. Note how that pace felt before replaying.`);
      if (!state.reactionBest || avg < state.reactionBest) {
        state.reactionBest = avg;
        showToast("New Reaction Pulse best!");
      }
      best.textContent = state.reactionBest ? `Best avg: ${state.reactionBest} ms` : `Best avg: ${avg} ms`;
      addPoints(15, "Reaction Pulse done");
      logActivity();
      saveState();
    }

    function tap() {
      if (!ready) {
        status.textContent = "Too soon! Keep waiting for the glow.";
        updateNarratorText("reactionPulse", "Pausing is part of the drill. Wait for the full glow before tapping again.");
        return;
      }
      const reaction = Math.round(performance.now() - startTime);
      times.push(reaction);
      currentRound += 1;
      ready = false;
      tapBtn.disabled = true;
      status.textContent = `Round ${currentRound}/${totalRounds}: ${reaction} ms`;
      updateNarratorText("reactionPulse", `That tap landed at ${reaction} ms. Reset hands, blink, then prepare for the next cue.`);
      if (currentRound >= totalRounds) {
        finish();
      } else {
        setTimeout(queueRound, 800);
      }
    }

    function start() {
      FocusNarrator.stop();
      window.clearTimeout(timeoutId);
      currentRound = 0;
      times.length = 0;
      startBtn.disabled = true;
      updateNarratorText("reactionPulse", "Launching a fresh Reaction Pulse set. Keep shoulders relaxed and eyes soft on the orb.");
      queueRound();
    }

    function init() {
      if (!startBtn || !tapBtn) return;
      best.textContent = state.reactionBest ? `Best avg: ${state.reactionBest} ms` : "Best avg: –";
      startBtn.addEventListener("click", start);
      tapBtn.addEventListener("click", tap);
    }

    return { init };
  })();

  const MemoryTrail = (() => {
    const startBtn = document.getElementById("game2-start");
    const submitBtn = document.getElementById("game2-submit");
    const input = document.getElementById("game2-input");
    const status = document.getElementById("game2-status");
    const sequenceEl = document.getElementById("game2-sequence");
    const best = document.getElementById("game2-best");
    let activeSequence = "";
    let lock = false;

    function randomSequence(length) {
      let seq = "";
      for (let i = 0; i < length; i += 1) {
        seq += Math.floor(Math.random() * 9) + 1;
      }
      return seq;
    }

    function startRound() {
      FocusNarrator.stop();
      lock = true;
      const length = Math.min(10, Math.max(3, (state.memoryBest || 2) + 1));
      activeSequence = randomSequence(length);
      input.value = "";
      input.disabled = true;
      submitBtn.disabled = true;
      sequenceEl.textContent = activeSequence.split("").join(" ");
      status.textContent = "Memorise the pattern...";
      updateNarratorText("memoryTrail", `New pattern with ${activeSequence.length} digits. Chunk them into pairs or tiny stories.`);
      const displayTime = 700 * activeSequence.length;
      setTimeout(() => {
        sequenceEl.textContent = "Type the sequence";
        input.disabled = false;
        submitBtn.disabled = false;
        input.focus();
        lock = false;
      }, displayTime);
    }

    function check() {
      if (lock) return;
      const guess = input.value.trim();
      if (!guess) {
        status.textContent = "Type the numbers before checking.";
        updateNarratorText("memoryTrail", "Give it a shot before checking — even half the pattern builds recall.");
        return;
      }
      if (guess === activeSequence) {
        status.textContent = "Great recall — sequence matched.";
        updateNarratorText("memoryTrail", `Matched ${activeSequence.length} digits. Celebrate that win before the next stretch.`);
        if (activeSequence.length > state.memoryBest) {
          state.memoryBest = activeSequence.length;
          showToast("Memory Trail level up!");
        }
        best.textContent = state.memoryBest ? `Longest: ${state.memoryBest}` : `Longest: ${activeSequence.length}`;
        addPoints(20, "Memory Trail match");
        logActivity();
        saveState();
      } else {
        status.textContent = "Not quite — try again from the start.";
        updateNarratorText("memoryTrail", "Not a fail — blink, breathe and let the numbers reshuffle in your head.");
      }
      input.value = "";
      input.disabled = true;
      submitBtn.disabled = true;
    }

    function init() {
      if (!startBtn) return;
      best.textContent = state.memoryBest ? `Longest: ${state.memoryBest}` : "Longest: –";
      startBtn.addEventListener("click", startRound);
      submitBtn.addEventListener("click", check);
      input.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter") {
          evt.preventDefault();
          check();
        }
      });
    }

    return { init };
  })();

  const DistractionFilter = (() => {
    const startBtn = document.getElementById("game3-start");
    const checkBtn = document.getElementById("game3-check");
    const grid = document.getElementById("game3-grid");
    const status = document.getElementById("game3-status");
    const best = document.getElementById("game3-best");

    function renderRound() {
      FocusNarrator.stop();
      status.textContent = "Tap the helpful actions.";
      updateNarratorText("distractionFilter", "Spot the cards labelled Task and give them the energy. Let distractions fade without tapping.");
      grid.innerHTML = "";
      const picks = distractionPool
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map((item) => ({ ...item }));
      picks.forEach((item, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-ghost btn-sm";
        btn.dataset.choiceType = item.type;
        btn.dataset.index = String(index);
        btn.textContent = item.label;
        btn.addEventListener("click", () => {
          btn.classList.toggle("btn-primary");
          btn.classList.toggle("btn-ghost");
        });
        grid.appendChild(btn);
      });
      checkBtn.disabled = false;
    }

    function evaluate() {
      const buttons = grid.querySelectorAll("button");
      if (!buttons.length) {
        status.textContent = "Start a round first.";
        updateNarratorText("distractionFilter", "Tap New round to load a fresh set of cues before scoring.");
        return;
      }
      let score = 0;
      buttons.forEach((btn) => {
        const selected = btn.classList.contains("btn-primary");
        const type = btn.dataset.choiceType;
        if (selected && type === "task") score += 1;
        if (selected && type === "distraction") score -= 1;
        if (!selected && type === "task") score -= 1;
      });
      score = Math.max(score, 0);
      status.textContent = `You filtered ${score} helpful actions.`;
      updateNarratorText("distractionFilter", `You protected ${score} helpful actions. Carry that same filter into the next real task switch.`);
      if (score > state.filterBest) {
        state.filterBest = score;
        showToast("New Distraction Filter best!");
      }
      best.textContent = state.filterBest ? `Best: ${state.filterBest}` : `Best: ${score}`;
      addPoints(15, "Filter round complete");
      logActivity();
      saveState();
      checkBtn.disabled = true;
    }

    function init() {
      if (!startBtn) return;
      best.textContent = state.filterBest ? `Best: ${state.filterBest}` : "Best: –";
      startBtn.addEventListener("click", renderRound);
      checkBtn.addEventListener("click", evaluate);
    }

    return { init };
  })();

  const FocusSprint = (() => {
    const startBtn = document.getElementById("game4-start");
    const completeBtn = document.getElementById("game4-complete");
    const input = document.getElementById("game4-minutes");
    const quality = document.getElementById("game4-quality");
    const status = document.getElementById("game4-countdown");
    const best = document.getElementById("game4-best");
    let intervalId = null;
    let remaining = 0;
    let activeMinutes = 0;

    function tick() {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(intervalId);
        intervalId = null;
        status.textContent = "Sprint finished — note how it felt.";
        completeBtn.disabled = false;
        addPoints(5, "Sprint finished");
        logActivity();
        updateNarratorText("focusSprint", "Timer's up. Check in with your body, rate the sprint, then press 'I did my best'.");
        return;
      }
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      status.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function start() {
      const minutes = Number(input.value);
      if (!minutes || minutes < 1) {
        status.textContent = "Pick at least a 1-minute sprint.";
        updateNarratorText("focusSprint", "Choose a sprint length of at least one minute so the narrator can keep time with you.");
        return;
      }
      FocusNarrator.stop();
      activeMinutes = minutes;
      remaining = minutes * 60;
      status.textContent = `${minutes.toString().padStart(2, "0")}:00`;
      clearInterval(intervalId);
      intervalId = setInterval(tick, 1000);
      completeBtn.disabled = true;
      updateNarratorText("focusSprint", `Sprint armed for ${minutes} minutes. Protect one task and come back to rate how it felt.`);
    }

    function complete() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      completeBtn.disabled = true;
      status.textContent = `Logged a ${activeMinutes} min sprint (${quality.value}).`;
      updateNarratorText("focusSprint", `Logged ${activeMinutes} minutes (${quality.options[quality.selectedIndex].text}). Note one win, then choose if you repeat or rest.`);
      state.sprintsLogged += 1;
      addMinutes(activeMinutes);
      addPoints(Math.max(10, activeMinutes * 2), "Sprint logged");
      logActivity();
      best.textContent = `Sprints logged: ${state.sprintsLogged}`;
      saveState();
    }

    function init() {
      if (!startBtn) return;
      best.textContent = `Sprints logged: ${state.sprintsLogged}`;
      startBtn.addEventListener("click", start);
      completeBtn.addEventListener("click", complete);
    }

    return { init };
  })();

  function initPlaylist() {
    if (playlistModeSelect) {
      playlistModeSelect.addEventListener("change", renderPlaylistSuggestions);
    }
    renderPlaylistSuggestions();
    renderCustomPlaylist();
    playlistAddBtn?.addEventListener("click", () => {
      const name = playlistNameInput.value.trim();
      const link = playlistLinkInput.value.trim();
      if (!name) {
        showToast("Give your track a name first.");
        return;
      }
      state.playlistCustom.push({ name, link });
      playlistNameInput.value = "";
      playlistLinkInput.value = "";
      renderCustomPlaylist();
      updateNarratorText("playlist", `Saved "${name}" to your custom list. Swap tracks anytime to keep novelty high.`);
      saveState();
    });
    els.playlistCustomList?.addEventListener("click", (evt) => {
      const btn = evt.target.closest("button[data-remove-track]");
      if (!btn) return;
      const index = Number(btn.dataset.removeTrack);
      const removed = state.playlistCustom[index]?.name || "track";
      state.playlistCustom.splice(index, 1);
      renderCustomPlaylist();
      updateNarratorText("playlist", `Removed "${removed}". Keep only the soundscapes that actually help you focus.`);
      saveState();
    });
  }

  function initJournal() {
    if (journalDateInput) {
      journalDateInput.value = todayISO();
    }
    journalAddBtn?.addEventListener("click", () => {
      const date = journalDateInput.value || todayISO();
      const minutes = Number(journalMinutesInput.value);
      const mood = journalMoodInput.value;
      const moodLabel = journalMoodInput.options[journalMoodInput.selectedIndex]?.text || mood;
      const note = journalNoteInput.value.trim();
      if (!minutes || minutes < 1) {
        showToast("Add the minutes you focused.");
        updateNarratorText("journal", "Add at least one focused minute before saving the entry.");
        return;
      }
      const entry = {
        date,
        minutes,
        mood,
        note,
        timestamp: Date.now()
      };
      state.journalEntries.push(entry);
      if (state.journalEntries.length > 120) {
        state.journalEntries.shift();
      }
      journalMinutesInput.value = "";
      journalNoteInput.value = "";
      addMinutes(minutes);
      addPoints(Math.max(5, Math.round(minutes / 2)), "Journal saved");
      logActivity(date);
      updateNarratorText(
        "journal",
        `Logged ${minutes} minutes (${moodLabel}). Current streak: ${state.streakDays} day${state.streakDays === 1 ? "" : "s"}.`
      );
      renderJournal();
      saveState();
    });
    renderJournal();
  }

  function initScratchers() {
    resetScratchCardsIfNeeded();
    renderScratchCards();
    document.querySelectorAll(".scratch-card").forEach((card) => {
      card.addEventListener("click", () => handleScratch(card));
    });
  }

  function initLeaderboard() {
    renderLeaderboard();
    leaderboardForm?.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const name = leaderboardNameInput.value.trim();
      const points = Number(leaderboardPointsInput.value);
      if (!name || !points) {
        showToast("Add a name and points.");
        return;
      }
      state.leaderboard.push({ name, points });
      state.userLeaderboardName = name;
      leaderboardNameInput.value = "";
      leaderboardPointsInput.value = "";
      renderLeaderboard();
      updateNarratorText(
        "rewards",
        `Added ${name} with ${points} points to the friendly leaderboard. Keep entries upbeat and collaborative.`
      );
      saveState();
    });
  }

  function initNarrators() {
    document.querySelectorAll("[data-narrator-key]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.narratorKey;
        if (!key) return;
        FocusNarrator.toggle(key, button);
      });
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        FocusNarrator.stop();
      }
    });
  }

  function initEvents() {
    ReactionPulse.init();
    MemoryTrail.init();
    DistractionFilter.init();
    FocusSprint.init();
    initPlaylist();
    initJournal();
    initScratchers();
    renderBadges();
    renderCollectibles();
    initLeaderboard();
    initAvatarControls();
    initNarrators();
    updateStatsUI();
    saveState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEvents);
  } else {
    initEvents();
  }
})();
