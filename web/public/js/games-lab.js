(function () {
  "use strict";

  // Light theme only (dark mode removed)
  const THEME_STORAGE_KEY = "nb_games_lab_theme";
  const LEGACY_THEME_STORAGE_KEY = "nb_games_lab2_theme";

  function initTheme() {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
      localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
    } catch (e) {
      // Ignore storage failures (private mode, etc.)
    }

    // Ensure no dark theme attribute lingers.
    try {
      document.body.setAttribute("data-theme", "light");
    } catch (e) {
      // Ignore
    }
  }

  // Initialize theme on page load
  initTheme();

  function $(id) {
    return document.getElementById(id);
  }

  const LS_KEY = "nb_games_rewards_lab_v1";

  const BREATH_PATTERNS = {
    "478": {
      key: "478",
      label: "4–7–8 · Sleep wind-down",
      phases: [
        { name: "Inhale", label: "Inhale", duration: 4 },
        { name: "Hold", label: "Hold", duration: 7 },
        { name: "Exhale", label: "Exhale", duration: 8 }
      ],
      description:
        "Longer exhale pattern often used as a pre-sleep wind-down to activate the parasympathetic “rest and digest” system.",
      bestFor:
        "Evening down-shift, easing racing thoughts at bedtime, or gently settling after a stressful event.",
      suggestedMinutes: "2–4 minutes (about 4–8 cycles)."
    },
    "box": {
      key: "box",
      label: "Box · Steady square",
      phases: [
        { name: "Inhale", label: "Inhale", duration: 4 },
        { name: "HoldTop", label: "Hold", duration: 4 },
        { name: "Exhale", label: "Exhale", duration: 4 },
        { name: "HoldBottom", label: "Hold", duration: 4 }
      ],
      description:
        "Sometimes called “tactical breathing”, commonly taught in high-stakes roles to steady the nervous system under pressure.",
      bestFor:
        "Resetting during intense work, public speaking prep, or between challenging tasks and meetings.",
      suggestedMinutes: "1–3 minutes for quick resets; up to 5 minutes for deeper calm."
    },
    "coherent": {
      key: "coherent",
      label: "5–5 · Coherent wave",
      phases: [
        { name: "Inhale", label: "Inhale", duration: 5 },
        { name: "Exhale", label: "Exhale", duration: 5 }
      ],
      description:
        "Slow, even breathing around 5–6 breaths per minute is linked with better heart-rate variability and emotional regulation.",
      bestFor:
        "Daily baseline regulation, gentle practice in classrooms, and building interoceptive (body) awareness.",
      suggestedMinutes: "3–5 minutes on most days."
    },
    "sos60": {
      key: "sos60",
      label: "SOS–60 · Quick rescue",
      phases: [
        { name: "Inhale", label: "Inhale", duration: 3 },
        { name: "Exhale", label: "Exhale", duration: 4 }
      ],
      description:
        "Short, portable pattern to create a 60-second “micro reset” when overwhelm spikes unexpectedly.",
      bestFor:
        "Moments of acute stress, before a difficult phone call, or when sensory overload appears.",
      suggestedMinutes: "1–2 minutes as needed."
    }
  };

  const FOCUS_MAX_ROUNDS = 5;

  let progressState = loadState();

  let breathPatternKey = "478";
  let breathMode = "interactive";
  let breathGoalMinutes = 1;
  let lowStim = false;

  let breathTimer = null;
  let breathRunning = false;
  let breathSeconds = 0;
  let breathCycles = 0;
  let breathPhaseIndex = 0;
  let breathPhaseElapsed = 0;

  let focusActive = false;
  let focusTimer = null;
  let focusSessionSeconds = 0;
  let focusRound = 0;
  let focusScore = 0;
  let focusCurrentStarIndex = null;

  let groupCompleted = 0;

  let breathMusic = null;
  if (window.Audio) {
    try {
      breathMusic = new Audio("assets/audio/ambient-soft-loop.mp3");
      breathMusic.loop = true;
      breathMusic.preload = "auto";
    } catch (_) {
      breathMusic = null;
    }
  }

  const navButtons = document.querySelectorAll("[data-scroll-target]");
  const patternChips = document.querySelectorAll(".nb-chip[data-breath-pattern]");

  const breathDurationSelect = $("breathDurationSelect");
  const breathModeSimple = $("breathModeSimple");
  const breathModeInteractive = $("breathModeInteractive");
  const lowStimToggle = $("lowStimToggle");
  const musicToggle = $("musicToggle");
  const breathVisual = $("breathVisual");
  const breathBubble = $("breathBubble");
  const breathOrbit = $("breathOrbit");
  const breathOrbitRing = $("breathOrbitRing");
  const breathSatellite = $("breathSatellite");
  const breathPhaseLabel = $("breathPhaseLabel");
  const breathPhaseCounter = $("breathPhaseCounter");
  const breathGoalLabel = $("breathGoalLabel");
  const breathCyclesCountEl = $("breathCyclesCount");
  const breathSecondsCountEl = $("breathSecondsCount");
  const breathDragonText = $("breathDragonText");
  const breathPatternExplainer = $("breathPatternExplainer");
  const breathStartBtn = $("breathStartBtn");
  const breathPauseBtn = $("breathPauseBtn");
  const breathResetBtn = $("breathResetBtn");
  const breathStatusText = $("breathStatusText");

  const focusGrid = $("focusGrid");
  const focusRoundLabel = $("focusRoundLabel");
  const focusScoreLabel = $("focusScoreLabel");
  const focusSecondsLabel = $("focusSecondsLabel");
  const focusStatusText = $("focusStatusText");
  const focusStartBtn = $("focusStartBtn");
  const focusResetBtn = $("focusResetBtn");

  const overallProgressBar = $("overallProgressBar");
  const overallProgressLabel = $("overallProgressLabel");
  const overallSessionsLabel = $("overallSessionsLabel");
  const totalMinutesLabel = $("totalMinutesLabel");
  const streakProgressBar = $("streakProgressBar");
  const streakCurrentLabel = $("streakCurrentLabel");
  const streakBestLabel = $("streakBestLabel");
  const lastSessionsList = $("lastSessionsList");
  const activityTotalsList = $("activityTotalsList");
  const resetProgressBtn = $("resetProgressBtn");

  const badgesList = $("badgesList");
  const couponList = $("couponList");
  const couponCategorySelect = $("couponCategorySelect");
  const couponDifficultySelect = $("couponDifficultySelect");
  const couponBrandInput = $("couponBrandInput");
  const generateCouponBtn = $("generateCouponBtn");

  const certNameInput = $("certNameInput");
  const certTechniqueSelect = $("certTechniqueSelect");
  const certMinutesSelect = $("certMinutesSelect");
  const certModeSelect = $("certModeSelect");
  const printCertBtn = $("printCertBtn");

  const groupTotalInput = $("groupTotalInput");
  const groupActivitySelect = $("groupActivitySelect");
  const groupCompletedLabel = $("groupCompletedLabel");
  const groupPercentLabel = $("groupPercentLabel");
  const groupAddCompletedBtn = $("groupAddCompletedBtn");
  const groupResetBtn = $("groupResetBtn");

  const joinChallengeBtn = $("joinChallengeBtn");
  const challengeStatusLabel = $("challengeStatusLabel");
  const challengeDaysLabel = $("challengeDaysLabel");

  navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const target = btn.getAttribute("data-scroll-target");
      if (!target) return;
      const el = document.querySelector(target);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  patternChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      const key = chip.getAttribute("data-breath-pattern");
      selectPattern(key);
    });
  });

  if (breathDurationSelect) {
    breathDurationSelect.addEventListener("change", function () {
      const minutes = parseInt(breathDurationSelect.value || "1", 10);
      breathGoalMinutes = clampInt(minutes, 1, 5);
      updateBreathGoalLabel();
    });
  }

  if (breathModeSimple) {
    breathModeSimple.addEventListener("change", function () {
      if (breathModeSimple.checked) {
        breathMode = "simple";
        if (breathVisual) breathVisual.dataset.mode = "simple";
      }
    });
  }

  if (breathModeInteractive) {
    breathModeInteractive.addEventListener("change", function () {
      if (breathModeInteractive.checked) {
        breathMode = "interactive";
        if (breathVisual) breathVisual.dataset.mode = "interactive";
      }
    });
  }

  if (lowStimToggle) {
    lowStimToggle.addEventListener("change", function () {
      lowStim = !!lowStimToggle.checked;
      if (breathVisual) {
        breathVisual.dataset.lowStim = lowStim ? "1" : "0";
      }
      if (lowStim && musicToggle && musicToggle.checked) {
        musicToggle.checked = false;
        stopMusic();
      }
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener("change", function () {
      if (!breathMusic) return;
      if (musicToggle.checked) {
        if (lowStim) {
          musicToggle.checked = false;
          return;
        }
        try {
          breathMusic.currentTime = 0;
          breathMusic.play().catch(function () {});
        } catch (_) {}
      } else {
        stopMusic();
      }
    });
  }

  if (breathStartBtn) {
    breathStartBtn.addEventListener("click", function () {
      startBreath();
    });
  }

  if (breathPauseBtn) {
    breathPauseBtn.addEventListener("click", function () {
      pauseBreath(true);
    });
  }

  if (breathResetBtn) {
    breathResetBtn.addEventListener("click", function () {
      resetBreathSession();
    });
  }

  if (focusStartBtn) {
    focusStartBtn.addEventListener("click", function () {
      if (focusActive) return;
      resetFocusSession();
      focusActive = true;
      focusStartBtn.disabled = true;
      focusResetBtn.disabled = false;
      focusStatusText.textContent = "Status: In progress – look for the star and tap it calmly.";
      focusTimer = window.setInterval(function () {
        focusSessionSeconds += 1;
        focusSecondsLabel.textContent = String(focusSessionSeconds);
      }, 1000);
      startFocusRound();
    });
  }

  if (focusResetBtn) {
    focusResetBtn.addEventListener("click", function () {
      resetFocusSession();
    });
  }

  if (focusGrid) {
    const cells = focusGrid.querySelectorAll(".nb-focus-cell");
    cells.forEach(function (cell) {
      cell.addEventListener("click", function () {
        const idx = parseInt(cell.getAttribute("data-cell") || "0", 10);
        handleFocusCellClick(idx);
      });
    });
  }

  if (groupAddCompletedBtn) {
    groupAddCompletedBtn.addEventListener("click", function () {
      groupCompleted += 1;
      updateGroupUI();
    });
  }
  if (groupResetBtn) {
    groupResetBtn.addEventListener("click", function () {
      groupCompleted = 0;
      updateGroupUI();
    });
  }
  if (groupTotalInput) {
    groupTotalInput.addEventListener("input", function () {
      updateGroupUI();
    });
  }

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener("click", function () {
      const ok = window.confirm(
        "This will clear calm sessions, badges and coupons stored for this hub on this device. Continue?"
      );
      if (!ok) return;
      progressState = defaultState();
      saveState();
      updateDashboards();
      updateRewardsUI();
      updateChallengeUI();
    });
  }

  if (generateCouponBtn) {
    generateCouponBtn.addEventListener("click", function () {
      generateCoupon();
    });
  }

  if (couponList) {
    couponList.addEventListener("click", function (evt) {
      const target = evt.target;
      if (!target) return;
      const btn = target.closest("button[data-coupon-id][data-action='mark-used']");
      if (!btn) return;
      const id = btn.getAttribute("data-coupon-id");
      if (!id || !progressState.coupons) return;
      const idx = progressState.coupons.findIndex(function (c) {
        return c.id === id;
      });
      if (idx === -1) return;
      progressState.coupons[idx].used = true;
      saveState();
      updateRewardsUI();
    });
  }

  if (printCertBtn) {
    printCertBtn.addEventListener("click", function () {
      openCertificate();
    });
  }

  if (joinChallengeBtn) {
    joinChallengeBtn.addEventListener("click", function () {
      toggleChallenge();
    });
  }

  selectPattern("478");
  breathGoalMinutes = 1;
  if (breathDurationSelect) breathDurationSelect.value = "1";
  updateBreathGoalLabel();
  resetBreathSession();
  resetFocusSession();
  updateGroupUI();
  updateDashboards();
  updateRewardsUI();
  updateChallengeUI();

  function defaultState() {
    return {
      totalSessions: 0,
      totalBreathSessions: 0,
      totalFocusSessions: 0,
      totalMinutes: 0,
      lastSessionDay: null,
      currentStreak: 0,
      bestStreak: 0,
      sessions: [],
      coupons: [],
      challengeJoined: false,
      challengeStartDate: null
    };
  }

  function loadState() {
    const base = defaultState();
    if (!window.localStorage) return base;
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return Object.assign(base, parsed);
      }
    } catch (e) {}
    return base;
  }

  function saveState() {
    if (!window.localStorage) return;
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(progressState));
    } catch (e) {}
  }

  function clampInt(value, min, max) {
    const n = parseInt(value, 10);
    if (isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function selectPattern(key) {
    if (!BREATH_PATTERNS[key]) return;
    breathPatternKey = key;
    if (breathVisual) {
      breathVisual.dataset.pattern = key;
    }
    patternChips.forEach(function (chip) {
      const cKey = chip.getAttribute("data-breath-pattern");
      chip.setAttribute("data-active", cKey === key ? "true" : "false");
    });
    updatePatternExplainer();
    resetBreathSession();
  }

  function updatePatternExplainer() {
    const p = BREATH_PATTERNS[breathPatternKey];
    if (!p || !breathPatternExplainer) return;
    const minutesText = p.suggestedMinutes;
    const extra = {
      "478":
        "Many people like this as a wind-down before sleep or when shifting from work mode to rest mode.",
      "box":
        "Box breathing is widely used in high-pressure environments (for example, by tactical and emergency professionals) to stay steady.",
      "coherent":
        "Coherent breathing supports heart-rate variability and can be a good daily practice for mood stability.",
      "sos60":
        "SOS-60 is designed for quick moments – one or two minutes can soften spikes of stress."
    }[breathPatternKey] || "";
    breathPatternExplainer.innerHTML =
      "<p><strong>" +
      p.label +
      "</strong></p>" +
      "<p>" +
      p.description +
      "</p>" +
      "<p><strong>Good for:</strong> " +
      p.bestFor +
      "</p>" +
      "<p><strong>Typical duration:</strong> " +
      minutesText +
      "</p>" +
      (extra ? '<p class="nb-small-muted">' + extra + "</p>" : "");
  }

  function updateBreathGoalLabel() {
    if (!breathGoalLabel) return;
    if (breathGoalMinutes === 1) {
      breathGoalLabel.textContent = "1 min calm practice";
    } else if (breathGoalMinutes === 5) {
      breathGoalLabel.textContent = "5 min deep calm reset";
    } else {
      breathGoalLabel.textContent = breathGoalMinutes + " min calm practice";
    }
  }

  function stopMusic() {
    if (!breathMusic) return;
    try {
      breathMusic.pause();
      breathMusic.currentTime = 0;
    } catch (_) {}
  }

  function resetBreathSession() {
    if (breathTimer) {
      window.clearInterval(breathTimer);
      breathTimer = null;
    }
    breathRunning = false;
    breathSeconds = 0;
    breathCycles = 0;
    breathPhaseIndex = 0;
    breathPhaseElapsed = 0;

    if (breathPhaseLabel) breathPhaseLabel.textContent = "Ready";
    if (breathPhaseCounter) breathPhaseCounter.textContent = "0";
    if (breathCyclesCountEl) breathCyclesCountEl.textContent = "0";
    if (breathSecondsCountEl) breathSecondsCountEl.textContent = "0";
    if (breathStatusText) {
      breathStatusText.innerHTML =
        'Status: <strong>Not started</strong>. When you are ready, press <strong>Start</strong>. You can stop at any time.';
    }
    if (breathDragonText) {
      breathDragonText.innerHTML =
        '<span>🐉</span> Dragon is resting. Calm breaths help it feel safe.';
    }
    updateBreathVisual("Ready", 0);
  }

  function startBreath() {
    if (breathRunning) return;
    const pattern = BREATH_PATTERNS[breathPatternKey];
    if (!pattern) return;
    if (breathSeconds === 0 && breathPhaseElapsed === 0) {
      breathPhaseIndex = 0;
      breathPhaseElapsed = 0;
      if (breathPhaseLabel) breathPhaseLabel.textContent = pattern.phases[0].label;
    }
    breathRunning = true;
    if (!breathTimer) {
      breathTimer = window.setInterval(function () {
        tickBreath();
      }, 1000);
    }
    if (breathStatusText) {
      breathStatusText.innerHTML =
        "Status: <strong>In progress</strong>. Follow the bubble; you can pause or stop at any time.";
    }
  }

  function pauseBreath(saveSession) {
    if (!breathRunning && !saveSession) return;
    if (breathTimer) {
      window.clearInterval(breathTimer);
      breathTimer = null;
    }
    const hadActivity = breathSeconds > 0 || breathCycles > 0;
    if (saveSession && hadActivity) {
      recordSession("breath", {
        pattern: breathPatternKey,
        minutes: Math.max(1, Math.round(breathSeconds / 60) || 1)
      });
      updateDashboards();
      updateRewardsUI();
      updateChallengeUI();
      if (breathStatusText) {
        breathStatusText.innerHTML =
          "Status: <strong>Session saved</strong>. Gentle progress added to your calm streak.";
      }
    } else if (breathStatusText) {
      breathStatusText.innerHTML =
        "Status: <strong>Paused</strong>. You can resume or reset whenever you like.";
    }
    breathRunning = false;
  }

  function autoCompleteBreath() {
    if (!breathRunning) return;
    if (breathTimer) {
      window.clearInterval(breathTimer);
      breathTimer = null;
    }
    breathRunning = false;
    const hadActivity = breathSeconds > 0 || breathCycles > 0;
    if (hadActivity) {
      recordSession("breath", {
        pattern: breathPatternKey,
        minutes: Math.max(1, Math.round(breathSeconds / 60) || breathGoalMinutes)
      });
      updateDashboards();
      updateRewardsUI();
      updateChallengeUI();
    }
    if (breathStatusText) {
      breathStatusText.innerHTML =
        "Status: <strong>Goal reached</strong>. Lovely steady work – you can rest or start another round.";
    }
    if (breathDragonText) {
      breathDragonText.innerHTML =
        '<span>🐉</span> Dragon is purring. It remembers how you helped it feel safe.';
    }
  }

  function tickBreath() {
    const pattern = BREATH_PATTERNS[breathPatternKey];
    if (!pattern) return;
    if (!breathRunning) return;

    breathSeconds += 1;
    if (breathSecondsCountEl) breathSecondsCountEl.textContent = String(breathSeconds);

    const goalSeconds = breathGoalMinutes * 60;
    if (breathSeconds >= goalSeconds) {
      autoCompleteBreath();
      return;
    }

    const phases = pattern.phases;
    if (!phases.length) return;

    let phase = phases[breathPhaseIndex];
    breathPhaseElapsed += 1;

    if (breathPhaseCounter) {
      const remaining = Math.max(0, phase.duration - breathPhaseElapsed + 1);
      breathPhaseCounter.textContent = String(remaining);
    }
    if (breathPhaseLabel) {
      breathPhaseLabel.textContent = phase.label;
    }

    const phaseProgress = phase.duration > 0 ? breathPhaseElapsed / phase.duration : 0;
    updateBreathVisual(phase.name, phaseProgress);

    if (breathPhaseElapsed >= phase.duration) {
      breathPhaseIndex += 1;
      breathPhaseElapsed = 0;
      if (breathPhaseIndex >= phases.length) {
        breathPhaseIndex = 0;
        breathCycles += 1;
        if (breathCyclesCountEl) breathCyclesCountEl.textContent = String(breathCycles);
      }
      phase = phases[breathPhaseIndex];
      if (breathPhaseLabel) breathPhaseLabel.textContent = phase.label;
    }
  }

  function updateBreathVisual(phaseName, phaseProgress) {
    if (!breathVisual || !breathBubble || !breathSatellite || !breathOrbit || !breathOrbitRing) return;
    if (!phaseName) phaseName = "Ready";
    if (phaseProgress == null) phaseProgress = 0;

    breathVisual.dataset.mode = breathMode;
    breathVisual.dataset.lowStim = lowStim ? "1" : "0";

    const baseScale = phaseName === "Ready" ? 1.0 : 1.0;
    let extra = 0.0;
    if (phaseName === "Inhale") extra = 0.25 * phaseProgress;
    else if (phaseName === "Exhale") extra = 0.2 * (1 - phaseProgress);
    else extra = 0.05 * phaseProgress;
    const scale = baseScale + extra;
    breathBubble.style.transform = "scale(" + scale.toFixed(3) + ")";

    if (breathMode === "interactive" && !lowStim) {
      const angleDeg = (breathSeconds * 45 + phaseProgress * 45) % 360;
      const radius = 80;
      const rad = (angleDeg * Math.PI) / 180;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      breathSatellite.style.transform =
        "translate(calc(-50% + " + x.toFixed(1) + "px), calc(-50% + " + y.toFixed(1) + "px))";
    } else {
      breathSatellite.style.transform = "translate(-50%, -50%)";
    }

    if (breathPatternKey === "sos60" && !lowStim) {
      const pulse = 1 + 0.12 * Math.sin(breathSeconds * 3.14);
      breathOrbitRing.style.transform = "scale(" + pulse.toFixed(3) + ")";
    } else {
      breathOrbitRing.style.transform = "scale(1)";
    }
  }

  function resetFocusSession() {
    focusActive = false;
    if (focusTimer) {
      window.clearInterval(focusTimer);
      focusTimer = null;
    }
    focusSessionSeconds = 0;
    focusRound = 0;
    focusScore = 0;
    focusCurrentStarIndex = null;

    if (focusSecondsLabel) focusSecondsLabel.textContent = "0";
    if (focusScoreLabel) focusScoreLabel.textContent = "0";
    if (focusRoundLabel) focusRoundLabel.textContent = "0 / " + FOCUS_MAX_ROUNDS;
    if (focusStatusText) {
      focusStatusText.innerHTML =
        "Status: <strong>Not started</strong>. Press Start when you are ready.";
    }
    if (focusStartBtn) focusStartBtn.disabled = false;
    if (focusResetBtn) focusResetBtn.disabled = true;

    if (focusGrid) {
      const cells = focusGrid.querySelectorAll(".nb-focus-cell");
      cells.forEach(function (cell) {
        cell.textContent = "";
        cell.classList.remove("is-star");
        cell.setAttribute("aria-label", "Empty spot");
      });
    }
  }

  function startFocusRound() {
    if (!focusActive) return;
    if (!focusGrid) return;
    if (focusRound >= FOCUS_MAX_ROUNDS) {
      completeFocusSession();
      return;
    }

    focusRound += 1;
    if (focusRoundLabel) {
      focusRoundLabel.textContent = focusRound + " / " + FOCUS_MAX_ROUNDS;
    }

    const cells = focusGrid.querySelectorAll(".nb-focus-cell");
    cells.forEach(function (cell) {
      cell.textContent = "";
      cell.classList.remove("is-star");
      cell.setAttribute("aria-label", "Empty spot");
    });

    const idx = Math.floor(Math.random() * cells.length);
    focusCurrentStarIndex = idx;
    const cell = focusGrid.querySelector('.nb-focus-cell[data-cell="' + idx + '"]');
    if (cell) {
      cell.textContent = "★";
      cell.classList.add("is-star");
      cell.setAttribute("aria-label", "Star");
    }
  }

  function handleFocusCellClick(idx) {
    if (!focusGrid) return;
    if (!focusActive) {
      return;
    }
    if (idx === focusCurrentStarIndex) {
      focusScore += 1;
      if (focusScoreLabel) focusScoreLabel.textContent = String(focusScore);
      if (focusStatusText) {
        focusStatusText.textContent = "Nice catch – steady focus.";
      }
    } else {
      if (focusStatusText) {
        focusStatusText.textContent = "That was a miss – no problem, try the next star.";
      }
    }
    startFocusRound();
  }

  function completeFocusSession() {
    focusActive = false;
    if (focusTimer) {
      window.clearInterval(focusTimer);
      focusTimer = null;
    }
    if (focusStartBtn) focusStartBtn.disabled = false;
    if (focusResetBtn) focusResetBtn.disabled = false;

    const minutesApprox = Math.max(1, Math.round(focusSessionSeconds / 60) || 1);
    recordSession("focus", { minutes: minutesApprox });
    updateDashboards();
    updateRewardsUI();
    updateChallengeUI();

    if (focusStatusText) {
      focusStatusText.textContent =
        "Session complete – you spotted " +
        focusScore +
        " star(s) calmly. You can rest or start another round.";
    }
  }

  function recordSession(type, meta) {
    const now = new Date();
    const dayStr = now.toISOString().slice(0, 10);

    if (!progressState.lastSessionDay) {
      progressState.currentStreak = 1;
    } else {
      const last = progressState.lastSessionDay;
      const diff = daysBetween(last, dayStr);
      if (diff === 0) {
        progressState.currentStreak = progressState.currentStreak || 1;
      } else if (diff === 1) {
        progressState.currentStreak = (progressState.currentStreak || 0) + 1;
      } else {
        progressState.currentStreak = 1;
      }
    }

    progressState.lastSessionDay = dayStr;
    if (!progressState.bestStreak || progressState.currentStreak > progressState.bestStreak) {
      progressState.bestStreak = progressState.currentStreak;
    }

    progressState.totalSessions = (progressState.totalSessions || 0) + 1;
    const minutes = meta && meta.minutes ? meta.minutes : 1;
    progressState.totalMinutes = (progressState.totalMinutes || 0) + minutes;

    if (type === "breath") {
      progressState.totalBreathSessions = (progressState.totalBreathSessions || 0) + 1;
    } else if (type === "focus") {
      progressState.totalFocusSessions = (progressState.totalFocusSessions || 0) + 1;
    }

    if (!Array.isArray(progressState.sessions)) {
      progressState.sessions = [];
    }
    progressState.sessions.unshift({
      type: type,
      pattern: meta && meta.pattern ? meta.pattern : null,
      minutes: minutes,
      date: now.toISOString()
    });
    if (progressState.sessions.length > 20) {
      progressState.sessions.pop();
    }

    saveState();
  }

  function daysBetween(dayA, dayB) {
    try {
      const a = new Date(dayA + "T00:00:00Z");
      const b = new Date(dayB + "T00:00:00Z");
      const diffMs = b.getTime() - a.getTime();
      return Math.round(diffMs / 86400000);
    } catch (e) {
      return 0;
    }
  }

  function updateDashboards() {
    const total = progressState.totalSessions || 0;
    const totalMin = progressState.totalMinutes || 0;
    const streak = progressState.currentStreak || 0;
    const bestStreak = progressState.bestStreak || 0;

    const targetSessions = 30;
    const pct = Math.min(100, Math.round((total / targetSessions) * 100));
    if (overallProgressBar) overallProgressBar.style.width = pct + "%";
    if (overallProgressLabel) overallProgressLabel.textContent = pct + "%";
    if (overallSessionsLabel) overallSessionsLabel.textContent = total + " / " + targetSessions;

    if (totalMinutesLabel) totalMinutesLabel.textContent = String(totalMin);

    const streakPct = Math.min(100, Math.round((streak / 30) * 100));
    if (streakProgressBar) streakProgressBar.style.width = streakPct + "%";
    if (streakCurrentLabel) streakCurrentLabel.textContent = String(streak);
    if (streakBestLabel) streakBestLabel.textContent = String(bestStreak);

    if (lastSessionsList) {
      lastSessionsList.innerHTML = "";
      const sessions = Array.isArray(progressState.sessions) ? progressState.sessions.slice(0, 5) : [];
      if (!sessions.length) {
        const li = document.createElement("li");
        li.textContent = "No sessions recorded yet. A short calm session will appear here.";
        lastSessionsList.appendChild(li);
      } else {
        sessions.forEach(function (s) {
          const li = document.createElement("li");
          const when = formatSessionDate(s.date);
          const typeLabel = s.type === "breath" ? "Breathing" : "Focus";
          const patternLabel = s.pattern && BREATH_PATTERNS[s.pattern] ? " · " + BREATH_PATTERNS[s.pattern].label : "";
          li.textContent =
            when + " – " + typeLabel + patternLabel + " (" + (s.minutes || 1) + " min)";
          lastSessionsList.appendChild(li);
        });
      }
    }

    if (activityTotalsList) {
      activityTotalsList.innerHTML = "";
      const breathTotal = progressState.totalBreathSessions || 0;
      const focusTotal = progressState.totalFocusSessions || 0;
      if (!total) {
        const li = document.createElement("li");
        li.textContent = "No activity yet.";
        activityTotalsList.appendChild(li);
      } else {
        const li1 = document.createElement("li");
        li1.textContent = "Breathing sessions: " + breathTotal;
        const li2 = document.createElement("li");
        li2.textContent = "Focus sessions: " + focusTotal;
        const li3 = document.createElement("li");
        li3.textContent = "Total sessions: " + total;
        activityTotalsList.appendChild(li1);
        activityTotalsList.appendChild(li2);
        activityTotalsList.appendChild(li3);
      }
    }
  }

  function formatSessionDate(isoString) {
    if (!isoString) return "Unknown date";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      });
    } catch (_) {
      return "Unknown date";
    }
  }

  function getBadgeDefinitions() {
    return [
      {
        id: "breath-starter",
        name: "Breathing Starter",
        condition: function () {
          return (progressState.totalBreathSessions || 0) >= 1;
        },
        description: "Complete at least one breathing session on this hub."
      },
      {
        id: "breath-hero",
        name: "Breathing Hero",
        condition: function () {
          return (progressState.totalBreathSessions || 0) >= 15;
        },
        description: "Reach 15 breathing sessions. Regular practice shapes powerful habits."
      },
      {
        id: "focus-explorer",
        name: "Focus Explorer",
        condition: function () {
          return (progressState.totalFocusSessions || 0) >= 5;
        },
        description: "Complete 5 Focus Quest sessions, exploring gentle attention training."
      },
      {
        id: "streak-builder",
        name: "Calm Streak Builder",
        condition: function () {
          return (progressState.currentStreak || 0) >= 3;
        },
        description: "Maintain a calm streak of 3 or more days in a row."
      },
      {
        id: "thirty-day-challenge",
        name: "30-Day Challenge Partner",
        condition: function () {
          return (
            progressState.challengeJoined &&
            (progressState.currentStreak || 0) >= 10
          );
        },
        description: "Join the 30-day calm challenge and complete at least 10 calm days."
      }
    ];
  }

  function updateRewardsUI() {
    const badges = getBadgeDefinitions();

    if (badgesList) {
      badgesList.innerHTML = "";
      badges.forEach(function (b) {
        const earned = !!b.condition();
        const badgeEl = document.createElement("div");
        badgeEl.className = "nb-badge";

        const header = document.createElement("div");
        header.className = "nb-badge-header";
        const nameEl = document.createElement("div");
        nameEl.className = "nb-badge-name";
        nameEl.textContent = b.name;
        const statusEl = document.createElement("div");
        statusEl.className = earned ? "nb-badge-earned" : "nb-badge-locked";
        statusEl.textContent = earned ? "Unlocked" : "Locked";
        header.appendChild(nameEl);
        header.appendChild(statusEl);

        const desc = document.createElement("div");
        desc.className = "nb-badge-desc";
        desc.textContent = b.description;

        badgeEl.appendChild(header);
        badgeEl.appendChild(desc);
        badgesList.appendChild(badgeEl);
      });
    }

    if (couponList) {
      couponList.innerHTML = "";
      const coupons = Array.isArray(progressState.coupons)
        ? progressState.coupons
        : [];
      if (!coupons.length) {
        const p = document.createElement("p");
        p.className = "nb-small-muted";
        p.textContent =
          "No coupons yet – calm sessions and goals can unlock them.";
        couponList.appendChild(p);
      } else {
        coupons.forEach(function (c) {
          const cardWrapper = document.createElement("div");
          cardWrapper.style.marginBottom = "1.5rem";

          const scratchCard = document.createElement("div");
          scratchCard.className = "nb-scratch-card";
          scratchCard.setAttribute("data-coupon-id", c.id);

          const cardContent = document.createElement("div");
          cardContent.className = "nb-scratch-card-content";

          const prize = document.createElement("div");
          prize.className = "nb-scratch-prize";
          prize.textContent = c.category === "clothing" ? "🎁 Clothing Reward" : "🍕 Food Treat";

          const code = document.createElement("div");
          code.className = "nb-scratch-code";
          code.textContent = c.code;

          const label = document.createElement("div");
          label.style.marginTop = "0.5rem";
          label.style.fontSize = "0.9rem";
          label.style.color = "var(--nb-text-soft)";
          label.textContent = c.label;

          const instruction = document.createElement("div");
          instruction.className = "nb-scratch-instruction";
          instruction.textContent = "👆 Scratch to reveal your reward code";

          const scratchLayer = document.createElement("div");
          scratchLayer.className = "nb-scratch-card-reveal";
          scratchLayer.setAttribute("data-coupon-id", c.id);

          cardContent.appendChild(prize);
          cardContent.appendChild(code);
          cardContent.appendChild(label);
          cardContent.appendChild(instruction);

          scratchCard.appendChild(cardContent);
          scratchCard.appendChild(scratchLayer);

          const meta = document.createElement("div");
          meta.style.marginTop = "0.5rem";
          meta.style.fontSize = "0.8rem";
          meta.style.color = "var(--nb-text-soft)";
          meta.style.display = "flex";
          meta.style.justifyContent = "space-between";
          meta.style.alignItems = "center";
          meta.style.flexWrap = "wrap";
          meta.style.gap = "0.5rem";

          const when = document.createElement("span");
          when.textContent = "Created: " + formatSessionDate(c.createdAt);

          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "nb-btn nb-btn-soft";
          btn.style.fontSize = "0.75rem";
          btn.textContent = c.used ? "Already used" : "Mark as used";
          btn.disabled = !!c.used;
          btn.setAttribute("data-coupon-id", c.id);
          btn.setAttribute("data-action", "mark-used");

          meta.appendChild(when);
          meta.appendChild(btn);

          cardWrapper.appendChild(scratchCard);
          cardWrapper.appendChild(meta);
          couponList.appendChild(cardWrapper);

          initScratchCard(scratchLayer, c.id);
        });
      }
    }
  }

  function generateCoupon() {
    const category = couponCategorySelect
      ? couponCategorySelect.value
      : "food";
    const difficulty = couponDifficultySelect
      ? couponDifficultySelect.value
      : "small";
    const brandRaw = couponBrandInput ? couponBrandInput.value.trim() : "";
    const brandName = brandRaw || (category === "food" ? "favourite food place" : "favourite clothing shop");

    const label =
      (category === "food" ? "Food treat" : "Clothing / trainers") +
      " · " +
      (difficulty === "big" ? "Big challenge" : "Small task") +
      " at " +
      brandName;

    const code = createLocalCouponCode(category, brandName, difficulty);
    const nowIso = new Date().toISOString();
    const coupon = {
      id:
        "cpn-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 6),
      category: category,
      difficulty: difficulty,
      brand: brandName,
      label: label,
      code: code,
      createdAt: nowIso,
      used: false
    };

    if (!Array.isArray(progressState.coupons)) {
      progressState.coupons = [];
    }
    progressState.coupons.unshift(coupon);
    if (progressState.coupons.length > 25) {
      progressState.coupons.pop();
    }
    saveState();
    updateRewardsUI();
  }

  function createLocalCouponCode(category, brandName, difficulty) {
    const base = (brandName || "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);
    const catPart = category === "clothing" ? "STYLE" : "TREAT";
    const diffPart = difficulty === "big" ? "XL" : "S";
    const rand = Math.random()
      .toString(36)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(2, 6);
    const prefix = base || (category === "clothing" ? "WEAR" : "FOOD");
    return prefix + "-" + catPart + "-" + diffPart + "-" + rand;
  }

  function updateGroupUI() {
    const total = clampInt(groupTotalInput ? groupTotalInput.value : "0", 0, 9999);
    const completed = groupCompleted;
    const percent = total > 0 ? Math.round((completed * 100) / total) : 0;
    if (groupCompletedLabel) groupCompletedLabel.textContent = String(completed);
    if (groupPercentLabel) {
      groupPercentLabel.textContent = total
        ? percent + "% of estimated group"
        : "No estimate set yet.";
    }
  }

  function toggleChallenge() {
    if (!progressState.challengeJoined) {
      progressState.challengeJoined = true;
      progressState.challengeStartDate = new Date().toISOString().slice(0, 10);
    } else {
      const leave = window.confirm("Leave the 30-day calm challenge on this device?");
      if (!leave) return;
      progressState.challengeJoined = false;
      progressState.challengeStartDate = null;
    }
    saveState();
    updateChallengeUI();
  }

  function updateChallengeUI() {
    if (!challengeStatusLabel || !challengeDaysLabel) return;
    if (!progressState.challengeJoined) {
      challengeStatusLabel.textContent = "Not joined yet";
      challengeDaysLabel.textContent = String(progressState.currentStreak || 0);
      joinChallengeBtn.textContent = "🌱 Join 30-Day Calm Challenge";
    } else {
      challengeStatusLabel.textContent = "Joined";
      challengeDaysLabel.textContent = String(progressState.currentStreak || 0);
      joinChallengeBtn.textContent = "✅ In challenge – tap to leave";
    }
  }

  function openCertificate() {
    const name = (certNameInput && certNameInput.value.trim()) || "NeuroBreath learner";
    const techniqueKey = certTechniqueSelect ? certTechniqueSelect.value : "478";
    const minutesStr = certMinutesSelect ? certMinutesSelect.value : "1";
    const minutes = clampInt(minutesStr, 1, 5);
    const mode = certModeSelect ? certModeSelect.value : "solo";
    const pattern = BREATH_PATTERNS[techniqueKey] || BREATH_PATTERNS["478"];
    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    const certId =
      "NB-" +
      now
        .getFullYear()
        .toString()
        .slice(2) +
      "-" +
      Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase();

    const w = window.open("", "_blank");
    if (!w) {
      window.alert("Please allow pop-ups to print your certificate.");
      return;
    }

    const modeLabel = mode === "group" ? "Group / class calm session" : "Individual calm practice";

    const html =
      "<!doctype html>" +
      '<html lang="en-GB">' +
      "<head>" +
      '<meta charset="utf-8" />' +
      "<title>NeuroBreath Calm Certificate</title>" +
      "<style>" +
      "body{margin:0;padding:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;background:#0b1120;color:#0f172a;}" +
      ".wrap{max-width:900px;margin:2rem auto;padding:2rem 1.5rem;background:#f9fafb;border-radius:24px;box-shadow:0 25px 60px rgba(15,23,42,0.45);border:1px solid #e5e7eb;}" +
      ".head{text-align:center;margin-bottom:1.5rem;}" +
      ".brand{font-size:0.8rem;letter-spacing:0.18em;text-transform:uppercase;color:#6b7280;margin-bottom:0.25rem;}" +
      ".title{font-size:1.6rem;font-weight:700;letter-spacing:-0.03em;margin-bottom:0.25rem;}" +
      ".subtitle{font-size:0.95rem;color:#4b5563;}" +
      ".body{margin-top:1.8rem;font-size:0.98rem;color:#374151;}" +
      ".name{font-size:1.35rem;font-weight:650;margin:0.6rem 0 0.8rem;}" +
      ".highlight{font-weight:600;color:#111827;}" +
      ".meta{margin-top:1.4rem;display:flex;flex-wrap:wrap;gap:0.9rem;font-size:0.85rem;color:#4b5563;}" +
      ".meta span{padding:0.25rem 0.7rem;border-radius:999px;border:1px solid #d1d5db;background:#f3f4f6;}" +
      ".footer{margin-top:2.2rem;display:flex;justify-content:space-between;align-items:flex-end;font-size:0.8rem;color:#6b7280;}" +
      ".sig-line{min-width:9rem;border-top:1px solid #d1d5db;padding-top:0.2rem;margin-top:1.3rem;}" +
      ".id{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:0.8rem;color:#6b7280;}" +
      "@media print{body{background:#fff;}.wrap{box-shadow:none;border-color:#d1d5db;margin:0;max-width:none;border-radius:0;}}" +
      "</style>" +
      "</head>" +
      "<body>" +
      '<div class="wrap">' +
      '<div class="head">' +
      '<div class="brand">NEUROBREATH · CALM PRACTICE CERTIFICATE</div>' +
      '<div class="title">Certificate of Calm Practice</div>' +
      '<div class="subtitle">Awarded for consistent engagement with regulated breathing and focus training.</div>' +
      "</div>" +
      '<div class="body">' +
      "<p>This is to recognise</p>" +
      '<div class="name">' +
      escapeHtml(name) +
      "</div>" +
      "<p>for completing <span class=\"highlight\">" +
      minutes +
      "+ minute</span> sessions using the <span class=\"highlight\">" +
      escapeHtml(pattern.label) +
      "</span> technique as part of the NeuroBreath Games & Rewards Lab.</p>" +
      "<p>The practice supports calmer breathing, steadier attention and more confident self-regulation in everyday life.</p>" +
      '<div class="meta">' +
      "<span>Date: " +
      dateStr +
      "</span>" +
      "<span>Mode: " +
      escapeHtml(modeLabel) +
      "</span>" +
      "<span>Technique family: Breathing & focus training</span>" +
      "</div>" +
      "</div>" +
      '<div class="footer">' +
      '<div><div class="sig-line">NeuroBreath Facilitator</div></div>' +
      '<div class="id">Certificate ID: ' +
      certId +
      "</div>" +
      "</div>" +
      "</div>" +
      "</body></html>";

    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initScratchCard(element, couponId) {
    if (!element) return;
    let isScratching = false;
    let scratched = false;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const rect = element.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    element.appendChild(canvas);

    function drawScratch(x, y, radius) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function getEventPos(e) {
      const rect = canvas.getBoundingClientRect();
      if (e.touches && e.touches.length > 0) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    function checkScratched() {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) {
          transparentPixels++;
        }
      }
      const percentScratched = (transparentPixels / (pixels.length / 4)) * 100;
      if (percentScratched > 30 && !scratched) {
        scratched = true;
        element.classList.add("scratched");
        setTimeout(function () {
          element.style.display = "none";
        }, 300);
      }
    }

    element.addEventListener("mousedown", function (e) {
      isScratching = true;
      const pos = getEventPos(e);
      drawScratch(pos.x, pos.y, 30);
      checkScratched();
    });

    element.addEventListener("mousemove", function (e) {
      if (isScratching && !scratched) {
        const pos = getEventPos(e);
        drawScratch(pos.x, pos.y, 30);
        checkScratched();
      }
    });

    element.addEventListener("mouseup", function () {
      isScratching = false;
    });

    element.addEventListener("mouseleave", function () {
      isScratching = false;
    });

    element.addEventListener("touchstart", function (e) {
      e.preventDefault();
      isScratching = true;
      const pos = getEventPos(e);
      drawScratch(pos.x, pos.y, 30);
      checkScratched();
    });

    element.addEventListener("touchmove", function (e) {
      e.preventDefault();
      if (isScratching && !scratched) {
        const pos = getEventPos(e);
        drawScratch(pos.x, pos.y, 30);
        checkScratched();
      }
    });

    element.addEventListener("touchend", function () {
      isScratching = false;
    });
  }
})();
