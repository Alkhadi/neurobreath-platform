(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Local storage & state helpers                                      */
  /* ------------------------------------------------------------------ */

  const STORAGE_KEY = "nb_games_rewards_v1";

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDays(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function isSameDay(a, b) {
    return a === b;
  }

  function safeParse(json, fallback) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return fallback;
    }
  }

  const defaultState = {
    sessions: [], // { id, type, date, durationSecs, points, label }
    badges: {}, // { badgeId: true }
    coupons: [], // { id, label, redeemed }
    streak: { current: 0, best: 0, lastDate: null }
  };

  function loadState() {
    if (!("localStorage" in window)) return JSON.parse(JSON.stringify(defaultState));
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(defaultState));
    const parsed = safeParse(raw, defaultState);
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      badges: parsed.badges || {},
      coupons: Array.isArray(parsed.coupons) ? parsed.coupons : [],
      streak: parsed.streak || { current: 0, best: 0, lastDate: null }
    };
  }

  function saveState(state) {
    if (!("localStorage" in window)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function resetAllState() {
    const fresh = JSON.parse(JSON.stringify(defaultState));
    saveState(fresh);
  }

  function applyBadgeRules(state) {
    const totalsByType = {};
    state.sessions.forEach(s => {
      totalsByType[s.type] = (totalsByType[s.type] || 0) + 1;
    });
    const streak = state.streak || { current: 0, best: 0 };

    if ((totalsByType.breathing || 0) >= 1) state.badges["breathing-starter"] = true;
    if ((totalsByType.breathing || 0) >= 10) state.badges["breathing-hero"] = true;

    if ((totalsByType.focus || 0) >= 1) state.badges["focus-explorer"] = true;
    if ((totalsByType.focus || 0) >= 10) state.badges["focus-champion"] = true;

    const sleepIds = ["breath-478", "breath-sos"];
    const sleepCount = state.sessions.filter(s => sleepIds.includes(s.id)).length;
    if (sleepCount >= 5) state.badges["sleep-routine-builder"] = true;

    if ((streak.best || 0) >= 7) state.badges["calm-streak-7"] = true;
    if ((streak.best || 0) >= 30) state.badges["calm-streak-30"] = true;

    if (!state.coupons.find(c => c.id === "choose-story") && (totalsByType.breathing || 0) >= 5) {
      state.coupons.push({
        id: "choose-story",
        label: "Coupon: Choose the story tonight",
        redeemed: false
      });
    }
    if (!state.coupons.find(c => c.id === "extra-play-10") && (totalsByType.focus || 0) >= 5) {
      state.coupons.push({
        id: "extra-play-10",
        label: "Coupon: Extra 10 minutes of play",
        redeemed: false
      });
    }
  }

  function recordSession(activityId, type, durationSecs, points, label) {
    const state = loadState();
    const date = todayISO();
    state.sessions.push({
      id: activityId,
      type,
      date,
      durationSecs: durationSecs || 0,
      points: points || 0,
      label: label || activityId
    });

    if (["breathing", "focus", "sleep", "anxiety"].includes(type)) {
      const s = state.streak || { current: 0, best: 0, lastDate: null };
      if (!s.lastDate || addDays(s.lastDate, 1) === date || isSameDay(s.lastDate, date)) {
        if (!isSameDay(s.lastDate, date)) s.current += 1;
      } else {
        s.current = 1;
      }
      s.lastDate = date;
      if (s.current > s.best) s.best = s.current;
      state.streak = s;
    }

    applyBadgeRules(state);
    saveState(state);
    updateDashboards();
    updateRewardsUI();
    return state;
  }

  function redeemCoupon(id) {
    const state = loadState();
    const c = state.coupons.find(entry => entry.id === id);
    if (c) c.redeemed = true;
    saveState(state);
    updateRewardsUI();
  }

  function flashReward(el) {
    if (!el) return;
    el.classList.remove("nb-pop");
    void el.offsetWidth;
    el.classList.add("nb-pop");
  }

  /* ------------------------------------------------------------------ */
  /* Breathing game                                                     */
  /* ------------------------------------------------------------------ */

  const patterns = {
    "478": {
      id: "breath-478",
      label: "4-7-8 · Sleep wind-down",
      phases: [
        { name: "Inhale", seconds: 4, cue: "Breathe in softly through your nose." },
        { name: "Hold", seconds: 7, cue: "Hold the breath gently, shoulders loose." },
        { name: "Exhale", seconds: 8, cue: "Breathe out slowly through your mouth." }
      ],
      type: "breathing",
      pointsPerCycle: 5
    },
    box: {
      id: "breath-box",
      label: "Box · Steady square",
      phases: [
        { name: "Inhale", seconds: 4, cue: "Breathe in as if drawing the first side of a square." },
        { name: "Hold", seconds: 4, cue: "Hold, drawing the second side in your mind." },
        { name: "Exhale", seconds: 4, cue: "Breathe out for the third side." },
        { name: "Hold", seconds: 4, cue: "Rest for the final side of the square." }
      ],
      type: "breathing",
      pointsPerCycle: 4
    },
    "55": {
      id: "breath-55",
      label: "5-5 · Coherent wave",
      phases: [
        { name: "Inhale", seconds: 5, cue: "Breathe in gently for a count of five." },
        { name: "Exhale", seconds: 5, cue: "Breathe out like a soft wave leaving the shore." }
      ],
      type: "breathing",
      pointsPerCycle: 4
    },
    sos: {
      id: "breath-sos",
      label: "SOS-60 · Quick rescue",
      phases: [
        { name: "Inhale", seconds: 4, cue: "Short calm breath in." },
        { name: "Exhale", seconds: 6, cue: "Longer breath out to send a “calm” signal." }
      ],
      type: "breathing",
      pointsPerCycle: 6
    }
  };

  let currentPatternKey = "478";
  let breathTimer = null;
  let breathRunning = false;
  let breathPhaseIndex = 0;
  let breathPhaseRemaining = 0;
  let breathCycles = 0;
  let breathSeconds = 0;
  let lowStim = false;

  const breathCircle = document.getElementById("breathCircle");
  const breathPhaseEl = document.getElementById("breathPhase");
  const breathCountEl = document.getElementById("breathCount");
  const breathCueEl = document.getElementById("breathCue");
  const breathMetaEl = document.getElementById("breathMeta");
  const breathStatusEl = document.getElementById("breathStatus");
  const breathRewardEl = document.getElementById("breathReward");
  const breathDragonEl = document.getElementById("breathDragon");
  const breathStartBtn = document.getElementById("breathStartBtn");
  const breathPauseBtn = document.getElementById("breathPauseBtn");
  const breathResetBtn = document.getElementById("breathResetBtn");
  const lowStimToggle = document.getElementById("lowStimToggle");
  const breathMusic = document.getElementById("breathMusic");
  const musicToggle = document.getElementById("musicToggle");

  function updateDragon() {
    if (!breathDragonEl) return;
    let msg = "🐉 Dragon is resting. Calm breaths help it feel safe.";
    if (breathCycles > 0 && breathCycles < 3) {
      msg = "🐉 Dragon is softening. Your steady breaths help it feel safe and steady.";
    } else if (breathCycles >= 3) {
      msg = "🐉 Dragon is sleepy and peaceful. You can pause whenever you wish.";
    } else if (breathRunning) {
      msg = "🐉 Dragon is listening closely to each calm breath.";
    }
    breathDragonEl.textContent = msg;
  }

  function updateBreathUI(phase, remaining) {
    const p = patterns[currentPatternKey];
    breathPhaseEl.textContent = phase ? phase.name : "Ready";
    breathCountEl.textContent = remaining != null ? remaining : 0;
    breathCueEl.textContent = phase ? phase.cue : "Press Start when you are ready.";
    breathMetaEl.textContent =
      "Cycles completed: " + breathCycles + " · Session seconds: " + breathSeconds;

    if (!phase) {
      breathCircle.className = "nb-breath-circle";
      breathCircle.style.transform = "scale(1)";
    } else {
      const baseClass = "nb-breath-circle nb-phase-" + phase.name.toLowerCase();
      breathCircle.className = baseClass;
      if (!lowStim) {
        const total = phase.seconds || 1;
        const fraction = Math.max(0, Math.min(1, (total - remaining) / total));
        const scale = phase.name === "Exhale" ? 1.0 - 0.2 * fraction : 1.0 + 0.25 * fraction;
        breathCircle.style.transform = "scale(" + scale.toFixed(2) + ")";
      } else {
        breathCircle.style.transform = "scale(1)";
      }
    }

    if (breathRunning) {
      breathStatusEl.innerHTML = '<span class="nb-status-soft">Status:</span> In progress · ' + p.label;
    } else if (breathCycles > 0 || breathSeconds > 0) {
      breathStatusEl.innerHTML =
        '<span class="nb-status-soft">Status:</span> Paused / complete · ' +
        p.label +
        ' · <span class="nb-status-good">You can stop whenever you feel comfortable.</span>';
    } else {
      breathStatusEl.innerHTML =
        '<span class="nb-status-soft">Status:</span> Not started · ' + p.label;
    }

    updateDragon();
  }

  function nextBreathPhase() {
    const p = patterns[currentPatternKey];
    const phases = p.phases;
    const phase = phases[breathPhaseIndex];
    breathPhaseRemaining = phase.seconds;
    updateBreathUI(phase, breathPhaseRemaining);
  }

  function breathTick() {
    const p = patterns[currentPatternKey];
    const phases = p.phases;
    if (!breathRunning) return;
    const phase = phases[breathPhaseIndex];
    breathPhaseRemaining -= 1;
    breathSeconds += 1;

    if (breathPhaseRemaining <= 0) {
      breathPhaseIndex += 1;
      if (breathPhaseIndex >= phases.length) {
        breathPhaseIndex = 0;
        breathCycles += 1;
        breathRewardEl.textContent =
          breathCycles >= 3
            ? "Beautiful steady work. You have earned calm points for this pattern."
            : "Gentle cycle complete. You can pause whenever you wish.";
        flashReward(breathRewardEl);
      }
      nextBreathPhase();
    } else {
      updateBreathUI(phase, breathPhaseRemaining);
    }
  }

  function startBreath() {
    if (breathRunning) return;
    breathRunning = true;
    if (breathSeconds === 0 && breathCycles === 0 && breathPhaseRemaining === 0) {
      breathPhaseIndex = 0;
      nextBreathPhase();
    }
    breathStartBtn.disabled = true;
    breathPauseBtn.disabled = false;
    breathResetBtn.disabled = false;
    if (!breathTimer) {
      breathTimer = setInterval(breathTick, 1000);
    }
    updateBreathUI(null, 0);
  }

  function pauseBreath(save) {
    breathRunning = false;
    breathStartBtn.disabled = false;
    breathPauseBtn.disabled = true;
    if (breathTimer) {
      clearInterval(breathTimer);
      breathTimer = null;
    }
    updateBreathUI(null, 0);
    if (save && (breathCycles > 0 || breathSeconds > 0)) {
      const p = patterns[currentPatternKey];
      const points = p.pointsPerCycle * breathCycles;
      recordSession(p.id, "breathing", breathSeconds, points, p.label + " session");
      breathRewardEl.textContent =
        "Session saved. Calm points and progress towards badges have been added.";
      flashReward(breathRewardEl);
    }
  }

  function resetBreathSession(clearMessage) {
    pauseBreath(false);
    breathPhaseIndex = 0;
    breathPhaseRemaining = 0;
    breathCycles = 0;
    breathSeconds = 0;
    if (clearMessage !== false) {
      breathRewardEl.textContent = "";
      breathStatusEl.innerHTML = '<span class="nb-status-soft">Status:</span> Not started';
      breathCueEl.textContent = "Press Start when you are ready. You can stop at any time.";
    }
    breathStartBtn.disabled = false;
    breathPauseBtn.disabled = true;
    breathResetBtn.disabled = true;
    updateBreathUI(null, 0);
  }

  function selectPattern(key) {
    currentPatternKey = key;
    const chips = document.querySelectorAll(".nb-chip[data-breath-pattern]");
    chips.forEach(chip => {
      const active = chip.getAttribute("data-breath-pattern") === key;
      chip.dataset.active = active ? "true" : "false";
      chip.setAttribute("aria-selected", active ? "true" : "false");
    });
    resetBreathSession(false);
    const p = patterns[key];
    breathStatusEl.innerHTML = '<span class="nb-status-soft">Pattern:</span> ' + p.label + " · Not started";
    breathCueEl.textContent = "Press Start when you are ready. You can stop at any time.";
    updateDragon();
  }

  /* ------------------------------------------------------------------ */
  /* Focus game                                                         */
  /* ------------------------------------------------------------------ */

  const focusGrid = document.getElementById("focusGrid");
  const focusInstructionEl = document.getElementById("focusInstruction");
  const focusRoundEl = document.getElementById("focusRound");
  const focusScoreEl = document.getElementById("focusScore");
  const focusSecondsEl = document.getElementById("focusSeconds");
  const focusStatusEl = document.getElementById("focusStatus");
  const focusRewardEl = document.getElementById("focusReward");
  const focusStartBtn = document.getElementById("focusStartBtn");
  const focusResetBtn = document.getElementById("focusResetBtn");

  let focusRound = 0;
  let focusScore = 0;
  let focusActive = false;
  let focusTargetIndex = -1;
  let focusRoundTimer = null;
  let focusSessionSeconds = 0;
  let focusSessionTimer = null;
  const FOCUS_TOTAL_ROUNDS = 5;

  function clearFocusGrid() {
    focusGrid.innerHTML = "";
  }

  function renderFocusGrid() {
    clearFocusGrid();
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nb-focus-cell";
      btn.setAttribute("data-index", String(i));
      btn.setAttribute("aria-label", "Focus cell");
      btn.textContent = "•";
      if (i === focusTargetIndex) {
        btn.classList.add("nb-target");
        btn.textContent = "★";
      }
      btn.addEventListener("click", onFocusCellClick);
      focusGrid.appendChild(btn);
    }
  }

  function focusUpdateUI() {
    focusRoundEl.textContent = focusRound + " / " + FOCUS_TOTAL_ROUNDS;
    focusScoreEl.textContent = String(focusScore);
    focusSecondsEl.textContent = String(focusSessionSeconds);
    if (!focusActive && focusRound === 0) {
      focusStatusEl.innerHTML = '<span class="nb-status-soft">Status:</span> Not started';
    } else if (focusActive) {
      focusStatusEl.innerHTML = '<span class="nb-status-soft">Status:</span> In progress';
    } else {
      focusStatusEl.innerHTML = '<span class="nb-status-soft">Status:</span> Paused / complete';
    }
  }

  function startFocusRound() {
    focusRound += 1;
    if (focusRound > FOCUS_TOTAL_ROUNDS) {
      endFocusSession();
      return;
    }
    focusActive = true;
    focusTargetIndex = Math.floor(Math.random() * 9);
    focusInstructionEl.textContent = "Find the ★ star and tap it calmly. There is no rush.";
    renderFocusGrid();
    focusUpdateUI();

    if (focusRoundTimer) clearTimeout(focusRoundTimer);
    focusRoundTimer = setTimeout(function () {
      if (!focusActive) return;
      focusRewardEl.textContent = "The round ended by itself. That is okay – we simply move on.";
      flashReward(focusRewardEl);
      endFocusRound();
    }, 12000);
  }

  function endFocusRound() {
    focusActive = false;
    clearFocusGrid();
    if (focusRound < FOCUS_TOTAL_ROUNDS) {
      setTimeout(startFocusRound, 900);
    } else {
      endFocusSession();
    }
    focusUpdateUI();
  }

  function endFocusSession() {
    focusActive = false;
    clearFocusGrid();
    focusStartBtn.disabled = false;
    focusResetBtn.disabled = false;
    focusInstructionEl.textContent =
      "Session complete. You can replay any time or try a different breathing pattern.";
    if (focusRoundTimer) {
      clearTimeout(focusRoundTimer);
      focusRoundTimer = null;
    }
    if (focusSessionTimer) {
      clearInterval(focusSessionTimer);
      focusSessionTimer = null;
    }
    const points = focusScore * 5;
    recordSession("focus-quest", "focus", focusSessionSeconds, points, "Focus Quest session");
    focusRewardEl.textContent =
      "Focus Quest saved. Your score and gentle effort contribute to badges and coupons.";
    flashReward(focusRewardEl);
    focusUpdateUI();
  }

  function resetFocusSession() {
    if (focusRoundTimer) {
      clearTimeout(focusRoundTimer);
      focusRoundTimer = null;
    }
    if (focusSessionTimer) {
      clearInterval(focusSessionTimer);
      focusSessionTimer = null;
    }
    clearFocusGrid();
    focusRound = 0;
    focusScore = 0;
    focusSessionSeconds = 0;
    focusActive = false;
    focusTargetIndex = -1;
    focusStartBtn.disabled = false;
    focusResetBtn.disabled = true;
    focusInstructionEl.textContent =
      "When you press Start, a small grid of circles appears. One will turn into a star (★). Take your time and tap it when you are ready.";
    focusRewardEl.textContent = "";
    focusUpdateUI();
  }

  function onFocusCellClick(e) {
    if (!focusActive) return;
    const idx = Number(e.currentTarget.getAttribute("data-index"));
    if (idx === focusTargetIndex) {
      focusScore += 1;
      focusRewardEl.textContent = "Nice steady tap. Even small moments of focus build a powerful habit.";
    } else {
      focusRewardEl.textContent = "That was a different circle. No problem – each round is practice, not a test.";
    }
    flashReward(focusRewardEl);
    endFocusRound();
  }

  /* ------------------------------------------------------------------ */
  /* Progress / rewards UI                                              */
  /* ------------------------------------------------------------------ */

  const statTotalSessionsEl = document.getElementById("statTotalSessions");
  const statTotalMinutesEl = document.getElementById("statTotalMinutes");
  const statStreakCurrentEl = document.getElementById("statStreakCurrent");
  const statStreakBestEl = document.getElementById("statStreakBest");
  const lastSessionsList = document.getElementById("lastSessionsList");
  const activityTotalsList = document.getElementById("activityTotalsList");
  const badgesGrid = document.getElementById("badgesGrid");
  const couponList = document.getElementById("couponList");
  const printCertBtn = document.getElementById("printCertBtn");
  const resetProgressBtn = document.getElementById("resetProgressBtn");
  const ringSessionsEl = document.getElementById("ringSessions");
  const ringSessionsValueEl = document.getElementById("ringSessionsValue");
  const ringStreakEl = document.getElementById("ringStreak");
  const ringStreakValueEl = document.getElementById("ringStreakValue");

  const badgeDefinitions = [
    { id: "breathing-starter", label: "Breathing Starter", desc: "Completed at least one breathing session." },
    { id: "breathing-hero", label: "Breathing Hero", desc: "Completed ten or more breathing sessions." },
    { id: "focus-explorer", label: "Focus Explorer", desc: "Completed at least one Focus Quest session." },
    { id: "focus-champion", label: "Focus Champion", desc: "Completed ten or more focus sessions." },
    { id: "sleep-routine-builder", label: "Sleep Routine Builder", desc: "Completed five sleep-style sessions (e.g. 4-7-8 or SOS)." },
    { id: "calm-streak-7", label: "7-Day Calm Streak", desc: "Practised on seven different days." },
    { id: "calm-streak-30", label: "30-Day Calm Streak", desc: "Practised on thirty different days." }
  ];

  function setRing(el, pct) {
    if (!el) return;
    const clamped = Math.max(0, Math.min(100, pct));
    const deg = clamped * 3.6;
    el.style.background = "conic-gradient(#38bdf8 " + deg + "deg, #1f2937 " + deg + "deg)";
  }

  function updateDashboards() {
    const state = loadState();
    const sessions = state.sessions || [];
    const totalSessions = sessions.length;
    const totalSeconds = sessions.reduce((acc, s) => acc + (s.durationSecs || 0), 0);
    const minutes = Math.round(totalSeconds / 60);
    const streak = state.streak || { current: 0, best: 0 };

    statTotalSessionsEl.textContent = totalSessions;
    statTotalMinutesEl.textContent = minutes;
    statStreakCurrentEl.textContent = streak.current || 0;
    statStreakBestEl.textContent = streak.best || 0;

    const targetSessions = 30;
    const pctSessions = targetSessions ? Math.min(100, (totalSessions / targetSessions) * 100) : 0;
    const pctStreak = Math.min(100, ((streak.current || 0) / 30) * 100);
    setRing(ringSessionsEl, pctSessions);
    setRing(ringStreakEl, pctStreak);
    if (ringSessionsValueEl) ringSessionsValueEl.textContent = Math.round(pctSessions) + "%";
    if (ringStreakValueEl) ringStreakValueEl.textContent = Math.round(pctStreak) + "%";

    lastSessionsList.innerHTML = "";
    if (!sessions.length) {
      lastSessionsList.innerHTML =
        "<li>No sessions recorded yet. A short calm session will appear here.</li>";
    } else {
      const last = sessions.slice(-5).reverse();
      last.forEach(s => {
        const li = document.createElement("li");
        const label = s.label || s.id;
        li.innerHTML =
          "<strong>" +
          label +
          "</strong> · " +
          s.type +
          " · " +
          (Math.round((s.durationSecs || 0) / 60) || 0) +
          " min · " +
          (s.date || "");
        lastSessionsList.appendChild(li);
      });
    }

    const totals = {};
    sessions.forEach(s => {
      if (!totals[s.id]) {
        totals[s.id] = { label: s.label || s.id, type: s.type, count: 0, totalSecs: 0 };
      }
      totals[s.id].count += 1;
      totals[s.id].totalSecs += s.durationSecs || 0;
    });
    activityTotalsList.innerHTML = "";
    const entries = Object.values(totals);
    if (!entries.length) {
      activityTotalsList.innerHTML = "<li>No activity yet.</li>";
    } else {
      entries.sort((a, b) => a.label.localeCompare(b.label));
      entries.forEach(a => {
        const li = document.createElement("li");
        li.innerHTML =
          "<strong>" +
          a.label +
          "</strong> · " +
          a.type +
          " · sessions: " +
          a.count +
          " · mins: " +
          Math.round(a.totalSecs / 60);
        activityTotalsList.appendChild(li);
      });
    }
  }

  function updateRewardsUI() {
    const state = loadState();
    const earned = state.badges || {};
    const coupons = state.coupons || [];

    badgesGrid.innerHTML = "";
    badgeDefinitions.forEach(def => {
      const div = document.createElement("div");
      div.className = "nb-badge";
      div.dataset.earned = earned[def.id] ? "true" : "false";

      const icon = document.createElement("span");
      icon.className = "nb-badge-icon";
      icon.textContent = earned[def.id] ? "★" : "·";

      const text = document.createElement("span");
      const status = document.createElement("span");
      status.className = earned[def.id]
        ? "nb-badge-status nb-badge-status--earned"
        : "nb-badge-status nb-badge-status--pending";
      status.textContent = earned[def.id] ? "(earned)" : "(not yet)";
      text.textContent = def.label + " ";
      text.appendChild(status);

      div.appendChild(icon);
      div.appendChild(text);
      div.title = def.desc;
      badgesGrid.appendChild(div);
    });

    couponList.innerHTML = "";
    if (!coupons.length) {
      const li = document.createElement("li");
      li.className = "nb-chip-soft";
      li.textContent = "No coupons yet – a few calm sessions will unlock family/classroom rewards.";
      couponList.appendChild(li);
    } else {
      coupons.forEach(c => {
        const li = document.createElement("li");
        li.className = "nb-coupon-item";
        const labelSpan = document.createElement("span");
        labelSpan.textContent = c.label;
        const right = document.createElement("div");
        right.className = "nb-coupon-actions";
        const tag = document.createElement("span");
        tag.className = "nb-coupon-tag";
        tag.textContent = c.redeemed ? "Used" : "Available";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "nb-btn nb-btn-ghost";
        btn.textContent = c.redeemed ? "Marked as used" : "Mark as used";
        btn.disabled = !!c.redeemed;
        btn.addEventListener("click", function () {
          redeemCoupon(c.id);
        });
        right.appendChild(tag);
        right.appendChild(btn);
        li.appendChild(labelSpan);
        li.appendChild(right);
        couponList.appendChild(li);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Teacher group helper                                               */
  /* ------------------------------------------------------------------ */

  const groupTotalInput = document.getElementById("groupTotalInput");
  const groupCompletedEl = document.getElementById("groupCompleted");
  const groupPercentEl = document.getElementById("groupPercent");
  const groupAddCompletedBtn = document.getElementById("groupAddCompletedBtn");
  const groupResetBtn = document.getElementById("groupResetBtn");
  const groupActivitySelect = document.getElementById("groupActivitySelect");

  let groupCompleted = 0;

  function updateGroupUI() {
    const total = Math.max(1, Number(groupTotalInput.value) || 1);
    const percent = Math.min(100, Math.round((groupCompleted / total) * 100));
    groupCompletedEl.textContent = String(groupCompleted);
    groupPercentEl.textContent = String(percent);
  }

  /* ------------------------------------------------------------------ */
  /* Certificate printing                                               */
  /* ------------------------------------------------------------------ */

  function openCertificate() {
    const state = loadState();
    const sessions = state.sessions || [];
    const streak = state.streak || { current: 0, best: 0 };
    const total = sessions.length;
    const mins = Math.round(
      sessions.reduce((acc, s) => acc + (s.durationSecs || 0), 0) / 60
    );
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>NeuroBreath Calm Certificate</title>
  <style>
    body{
      font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      padding:40px;
      background:#0f172a;
      color:#e5e7eb;
    }
    .cert{
      max-width:640px;
      margin:0 auto;
      border-radius:24px;
      border:3px solid #38bdf8;
      padding:40px;
      background:radial-gradient(circle at top left,#1e293b,#020617);
    }
    h1{
      margin:0 0 0.5em;
      font-size:1.8rem;
      text-align:center;
    }
    p{
      text-align:center;
      margin:0.4em 0;
    }
    .meta{
      margin-top:1.2em;
      font-size:0.9rem;
      color:#9ca3af;
    }
  </style>
</head>
<body>
  <div class="cert">
    <h1>Calm Practice Certificate</h1>
    <p>This certificate recognises regular calm breathing and focus practice.</p>
    <p>Small, steady sessions help train the brain and nervous system to find safe, quiet moments.</p>
    <p class="meta">Total sessions on this device: <strong>${total}</strong> · Approx. minutes: <strong>${mins}</strong></p>
    <p class="meta">Best calm streak: <strong>${streak.best || 0}</strong> day(s)</p>
    <p class="meta">Date: ${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }

  /* ------------------------------------------------------------------ */
  /* Wiring events                                                      */
  /* ------------------------------------------------------------------ */

  document.querySelectorAll(".nb-chip[data-breath-pattern]").forEach(chip => {
    chip.addEventListener("click", function () {
      const key = chip.getAttribute("data-breath-pattern");
      selectPattern(key);
    });
  });

  lowStimToggle.addEventListener("change", function () {
    lowStim = !!lowStimToggle.checked;
    if (lowStim && musicToggle && musicToggle.checked) {
      musicToggle.checked = false;
      if (breathMusic) {
        breathMusic.pause();
        breathMusic.currentTime = 0;
      }
    }
  });

  if (musicToggle) {
    musicToggle.addEventListener("change", function () {
      if (!breathMusic) return;
      if (musicToggle.checked) {
        if (lowStim) {
          musicToggle.checked = false;
          return;
        }
        breathMusic.currentTime = 0;
        breathMusic.play().catch(function () {});
      } else {
        breathMusic.pause();
        breathMusic.currentTime = 0;
      }
    });
  }

  breathStartBtn.addEventListener("click", function () {
    startBreath();
  });

  breathPauseBtn.addEventListener("click", function () {
    pauseBreath(true);
  });

  breathResetBtn.addEventListener("click", function () {
    resetBreathSession(true);
  });

  focusStartBtn.addEventListener("click", function () {
    if (focusActive) return;
    resetFocusSession();
    focusStartBtn.disabled = true;
    focusResetBtn.disabled = false;
    focusActive = true;
    if (!focusSessionTimer) {
      focusSessionTimer = setInterval(function () {
        focusSessionSeconds += 1;
        focusUpdateUI();
      }, 1000);
    }
    startFocusRound();
  });

  focusResetBtn.addEventListener("click", function () {
    resetFocusSession();
  });

  groupAddCompletedBtn.addEventListener("click", function () {
    groupCompleted += 1;
    updateGroupUI();
  });

  groupResetBtn.addEventListener("click", function () {
    groupCompleted = 0;
    updateGroupUI();
  });

  groupTotalInput.addEventListener("input", updateGroupUI);

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener("click", function () {
      const ok = window.confirm(
        "This will clear calm sessions, badges and coupons stored for this hub on this device. Continue?"
      );
      if (!ok) return;
      resetAllState();
      updateDashboards();
      updateRewardsUI();
    });
  }

  printCertBtn.addEventListener("click", openCertificate);

  selectPattern("478");
  resetFocusSession();
  updateGroupUI();
  updateDashboards();
  updateRewardsUI();
})();
