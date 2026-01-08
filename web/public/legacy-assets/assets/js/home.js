(function(){
  const root = window.__MSHARE__ = window.__MSHARE__ || {};
  const Stats = root.Stats || null;
  const PAGE_ID = root.pageId || 'index';

  const scrollTriggers = document.querySelectorAll('[data-scroll]');
  if (scrollTriggers.length){
    scrollTriggers.forEach(trigger => {
      trigger.addEventListener('click', event => {
        const selector = trigger.getAttribute('data-scroll');
        if (!selector) return;
        const target = document.querySelector(selector);
        if (!target) return;
        event.preventDefault();
        try{
          target.scrollIntoView({ behavior:'smooth', block:'start' });
        }catch{
          window.scrollTo({ top: target.offsetTop || 0, behavior:'smooth' });
        }
        if (selector.startsWith('#')){
          try{
            history.replaceState(null, document.title, selector);
          }catch{
            location.hash = selector;
          }
        }
      });
    });
  }

  const player = document.getElementById('homePlayer');
  if (!player) return;

  const TECHNIQUES = {
    'box-4444': {
      label: 'Box Breathing · 4-4-4-4',
      breathsPerCycle: 1,
      recommendedMinutes: 3,
      phases: [
        { id:'inhale', label:'Inhale', cue:'Inhale softly through the nose.', seconds:4 },
        { id:'hold-1', label:'Hold', cue:'Hold gently, relax the jaw.', seconds:4 },
        { id:'exhale', label:'Exhale', cue:'Exhale through the mouth slowly.', seconds:4 },
        { id:'hold-2', label:'Hold', cue:'Pause with lungs empty.', seconds:4 }
      ]
    },
    'coherent-55': {
      label: 'Coherent Breathing · 5-5',
      breathsPerCycle: 1,
      recommendedMinutes: 5,
      phases: [
        { id:'inhale', label:'Inhale', cue:'Breathe in for five seconds.', seconds:5 },
        { id:'exhale', label:'Exhale', cue:'Slowly exhale for five seconds.', seconds:5 }
      ]
    },
    'four-7-8': {
      label: '4-7-8 Reset',
      breathsPerCycle: 1,
      recommendedMinutes: 4,
      phases: [
        { id:'inhale', label:'Inhale', cue:'Inhale quietly through the nose for four.', seconds:4 },
        { id:'hold', label:'Hold', cue:'Hold the breath for seven seconds.', seconds:7 },
        { id:'exhale', label:'Exhale', cue:'Exhale with a soft whoosh for eight.', seconds:8 }
      ]
    },
    'sos-1m': {
      label: 'SOS Reset · 60s',
      breathsPerCycle: 1,
      recommendedMinutes: 1,
      phases: [
        { id:'inhale', label:'Inhale', cue:'Quick inhale through the nose.', seconds:3 },
        { id:'hold', label:'Hold', cue:'Steady hold for three.', seconds:3 },
        { id:'exhale', label:'Exhale', cue:'Exhale for three seconds, feel shoulders drop.', seconds:3 }
      ]
    }
  };

  const techniqueSelect = document.getElementById('homeTechnique');
  const minutesSlider = document.getElementById('homeMinutes');
  const minutesLabel = document.getElementById('homeMinutesLabel');
  const metaRound = player.querySelector('[data-role="round"]');
  const metaRoundTotal = player.querySelector('[data-role="roundTotal"]');
  const metaBreaths = player.querySelector('[data-role="breaths"]');
  const metaTime = player.querySelector('[data-role="time"]');
  const statusEl = player.querySelector('[data-role="status"]');
  const diagramEl = player.querySelector('[data-role="diagram"]');
  const startBtn = player.querySelector('[data-action="start"]');
  const pauseBtn = player.querySelector('[data-action="pause"]');
  const resetBtn = player.querySelector('[data-action="reset"]');
  const voiceBtn = player.querySelector('[data-action="voice"]');

  if (!techniqueSelect || !minutesSlider || !minutesLabel || !metaRound || !metaRoundTotal || !metaBreaths || !metaTime || !statusEl || !diagramEl || !startBtn || !pauseBtn || !resetBtn || !voiceBtn){
    return;
  }

  const diagramProgress = document.createElement('div');
  diagramProgress.className = 'home-tech__progress';
  const diagramBar = document.createElement('div');
  diagramBar.className = 'home-tech__progress-bar';
  diagramProgress.appendChild(diagramBar);
  const phasesContainer = document.createElement('div');
  phasesContainer.className = 'home-tech__phases';
  diagramEl.innerHTML = '';
  diagramEl.append(diagramProgress, phasesContainer);

  const canSpeak = typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined';
  const VoicePrefs = window.NeurobreathVoicePreferences || null;

  function normalizeVoiceProfile(value){
    if (value === 'female') return 'female';
    if (value === 'male') return 'male';
    return 'uk-male';
  }

  let sharedVoiceProfile = normalizeVoiceProfile(
    (VoicePrefs && typeof VoicePrefs.get === 'function' && VoicePrefs.get()) ||
    (VoicePrefs && typeof VoicePrefs.getDefault === 'function' && VoicePrefs.getDefault()) ||
    'uk-male'
  );

  const maleVoiceHints = [/google uk english male/i, /microsoft george/i, /microsoft ryan/i, /microsoft guy/i, /daniel/i, /brian/i, /arthur/i, /matthew/i];
  const femaleVoiceHints = [/female/i, /hazel/i, /sonia/i, /libby/i, /serena/i, /kate/i, /victoria/i, /emma/i, /samantha/i];
  let preferredVoice = null;
  let voiceListenerAttached = false;

  const state = {
    techniqueKey: techniqueSelect.value || 'box-4444',
    minutes: Number(minutesSlider.value) || 3,
    totalSeconds: (Number(minutesSlider.value) || 3) * 60,
    cycleSeconds: 0,
    estimatedRounds: 0,
    estimatedBreaths: 0,
    isActive: false,
    isPaused: false,
    timerId: null,
    elapsedSeconds: 0,
    phaseElapsed: 0,
    phaseIndex: 0,
    roundIndex: 0,
    voiceEnabled: false,
    voiceProfile: sharedVoiceProfile
  };

  if (VoicePrefs && typeof VoicePrefs.subscribe === 'function'){
    VoicePrefs.subscribe(value => {
      sharedVoiceProfile = normalizeVoiceProfile(value);
      state.voiceProfile = sharedVoiceProfile;
      preferredVoice = null;
      ensurePreferredVoice(true);
    });
  }

  let phaseNodes = [];

  function pickPreferredVoice(voices){
    if (!Array.isArray(voices) || !voices.length) return null;
    const profile = state.voiceProfile;
    const gender = profile === 'female' ? 'female' : 'male';
    const preferGb = profile !== 'male';
    const hints = gender === 'female' ? femaleVoiceHints : maleVoiceHints;
    const lowerLang = voice => (voice.lang || '').toLowerCase();

    if (preferGb){
      const gbVoices = voices.filter(v => lowerLang(v).startsWith('en-gb'));
      const gbMatch = gbVoices.find(v => hints.some(pattern => pattern.test(v.name)));
      if (gbMatch) return gbMatch;
      if (gbVoices[0]) return gbVoices[0];
    }

    const enVoices = voices.filter(v => /^en-/i.test(v.lang || ''));
    const enMatch = enVoices.find(v => hints.some(pattern => pattern.test(v.name)));
    if (enMatch) return enMatch;
    if (enVoices[0]) return enVoices[0];

    const anyMatch = voices.find(v => hints.some(pattern => pattern.test(v.name)));
    if (anyMatch) return anyMatch;
    return voices[0];
  }

  function ensurePreferredVoice(forceRefresh){
    if (!canSpeak) return null;
    const synth = window.speechSynthesis;
    if (!synth) return null;
    if (forceRefresh) preferredVoice = null;
    const voices = synth.getVoices();
    if (voices.length){
      preferredVoice = pickPreferredVoice(voices) || preferredVoice;
      return preferredVoice;
    }
    if (!voiceListenerAttached){
      voiceListenerAttached = true;
      const handler = () => {
        const updated = synth.getVoices();
        if (updated.length){
          preferredVoice = pickPreferredVoice(updated) || preferredVoice;
        }
      };
      if (typeof synth.addEventListener === 'function'){
        synth.addEventListener('voiceschanged', handler);
      } else if ('onvoiceschanged' in synth){
        synth.onvoiceschanged = handler;
      }
    }
    return preferredVoice;
  }

  function getConfig(){
    return TECHNIQUES[state.techniqueKey] || TECHNIQUES['box-4444'];
  }

  function calculateCycleSeconds(config){
    return config.phases.reduce((acc, phase) => acc + Number(phase.seconds || 0), 0);
  }

  function formatTime(seconds){
    const safe = Math.max(0, Math.round(seconds));
    const mins = String(Math.floor(safe / 60)).padStart(2,'0');
    const secs = String(safe % 60).padStart(2,'0');
    return `${mins}:${secs}`;
  }

  function resetSpeech(){
    try{ window.speechSynthesis?.cancel(); }catch{}
  }

  function speak(text){
    if (!state.voiceEnabled || !canSpeak) return;
    resetSpeech();
    try{
      const msg = new window.SpeechSynthesisUtterance(text);
      const chosenVoice = ensurePreferredVoice();
      if (chosenVoice) msg.voice = chosenVoice;
      msg.lang = (chosenVoice && chosenVoice.lang) || 'en-GB';
      msg.rate = 0.94;
      msg.pitch = state.voiceProfile === 'female' ? 1.08 : 0.95;
      window.speechSynthesis.speak(msg);
    }catch{}
  }

  function updateVoiceButton(){
    voiceBtn.textContent = state.voiceEnabled ? 'Voice cues on' : 'Voice cues off';
    voiceBtn.setAttribute('aria-pressed', state.voiceEnabled ? 'true' : 'false');
  }

  function updateStaticMeta(){
    const config = getConfig();
    state.cycleSeconds = Math.max(1, calculateCycleSeconds(config));
    const totalSeconds = Math.max(60, state.minutes * 60);
    state.totalSeconds = totalSeconds;
    const exactRounds = totalSeconds / state.cycleSeconds;
    state.estimatedRounds = Math.max(1, Math.ceil(exactRounds));
    state.estimatedBreaths = Math.max(1, Math.ceil(exactRounds * (config.breathsPerCycle || 1)));
    metaRoundTotal.textContent = String(state.estimatedRounds);
    metaBreaths.textContent = String(state.estimatedBreaths);
    metaTime.textContent = formatTime(state.totalSeconds - state.elapsedSeconds);
  }

  function updateDynamicMeta(){
    metaRound.textContent = state.isActive ? String(Math.min(state.estimatedRounds, state.roundIndex + 1)) : '0';
    metaTime.textContent = formatTime(state.totalSeconds - state.elapsedSeconds);
  }

  function setStatus(message){
    statusEl.textContent = message;
  }

  function highlightPhase(){
    const activeId = getConfig().phases[state.phaseIndex]?.id;
    phaseNodes.forEach(node => {
      node.classList.toggle('is-active', node.dataset.phase === activeId);
    });
    
    // Also highlight phase breakdown items
    const phaseBreakdownItems = document.querySelectorAll('.home-tech__phase-item');
    phaseBreakdownItems.forEach(item => {
      item.classList.toggle('is-active', item.dataset.phase === activeId);
    });
  }

  function renderPhases(){
    phasesContainer.innerHTML = '';
    phaseNodes = [];
    const config = getConfig();
    
    // Update phase breakdown display
    const phaseBreakdown = document.querySelector('.home-tech__phase-breakdown');
    if (phaseBreakdown) {
      phaseBreakdown.innerHTML = '';
      config.phases.forEach((phase, index) => {
        const phaseItem = document.createElement('div');
        phaseItem.className = 'home-tech__phase-item';
        phaseItem.dataset.phase = phase.id;
        
        const phaseLabel = document.createElement('span');
        phaseLabel.className = 'home-tech__phase-label';
        phaseLabel.textContent = phase.label;
        
        const phaseDuration = document.createElement('span');
        phaseDuration.className = 'home-tech__phase-duration';
        phaseDuration.setAttribute('data-phase', phase.id);
        phaseDuration.textContent = `${phase.seconds}s`;
        
        phaseItem.append(phaseLabel, phaseDuration);
        phaseBreakdown.appendChild(phaseItem);
      });
    }
    
    config.phases.forEach(phase => {
      const item = document.createElement('div');
      item.className = 'home-tech__phase';
      item.dataset.phase = phase.id;
      const title = document.createElement('strong');
      title.textContent = phase.label;
      const detail = document.createElement('small');
      detail.textContent = `${phase.seconds}s`;
      item.append(title, detail);
      phasesContainer.appendChild(item);
      phaseNodes.push(item);
    });
    highlightPhase();
  }

  function updateProgressBar(){
    const progress = state.totalSeconds > 0 ? Math.min(1, state.elapsedSeconds / state.totalSeconds) : 0;
    diagramBar.style.width = `${Math.round(progress * 100)}%`;
  }

  function setControlsDisabled(disabled){
    techniqueSelect.disabled = disabled;
    minutesSlider.disabled = disabled;
  }

  function stopTimer(){
    if (state.timerId){
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function finishSession(completed){
    stopTimer();
    state.isActive = false;
    state.isPaused = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    setControlsDisabled(false);
    if (completed){
      setStatus('Session complete. Take a sip of water.');
      const config = getConfig();
      const safeSeconds = Math.max(0, Math.round(state.elapsedSeconds));
      if (safeSeconds >= 30 && Stats?.addSession){
        const breaths = Math.max(1, Math.round((safeSeconds / state.cycleSeconds) * (config.breathsPerCycle || 1)));
        Stats.addSession({
          seconds: safeSeconds,
          breaths,
          techId: state.techniqueKey,
          pageId: PAGE_ID,
          source: 'home-player'
        });
      }
    } else {
      setStatus('Session reset. Pick a technique to preview the timing, then press start.');
    }
    updateDynamicMeta();
    updateProgressBar();
    highlightPhase();
    resetSpeech();
  }

  function resetSession(){
    stopTimer();
    state.isActive = false;
    state.isPaused = false;
    state.elapsedSeconds = 0;
    state.phaseElapsed = 0;
    state.phaseIndex = 0;
    state.roundIndex = 0;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    resetBtn.disabled = true; // Keep reset button disabled when idle
    setControlsDisabled(false);
    updateStaticMeta();
    updateDynamicMeta();
    updateProgressBar();
    highlightPhase();
    setStatus('Pick a technique to preview the timing, then press start.');
    resetSpeech();
  }

  function advancePhase(){
    const config = getConfig();
    state.phaseIndex += 1;
    if (state.phaseIndex >= config.phases.length){
      state.phaseIndex = 0;
      state.roundIndex += 1;
    }
    state.phaseElapsed = 0;
    highlightPhase();
    const cue = config.phases[state.phaseIndex]?.cue;
    if (cue) speak(cue);
  }

  function tick(){
    if (!state.isActive || state.isPaused) return;
    state.elapsedSeconds += 1;
    state.phaseElapsed += 1;
    const config = getConfig();
    const currentPhase = config.phases[state.phaseIndex];
    if (state.phaseElapsed >= (currentPhase?.seconds || 0)){
      advancePhase();
    }
    updateDynamicMeta();
    updateProgressBar();
    if (state.elapsedSeconds >= state.totalSeconds){
      finishSession(true);
    }
  }

  function startSession(){
    if (state.isActive) return;
    state.isActive = true;
    state.isPaused = false;
    state.elapsedSeconds = 0;
    state.phaseElapsed = 0;
    state.phaseIndex = 0;
    state.roundIndex = 0;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    resetBtn.disabled = false; // Enable reset button while session is active
    setControlsDisabled(true);
    updateDynamicMeta();
    updateProgressBar();
    highlightPhase();
    const firstCue = getConfig().phases[0]?.cue;
    if (firstCue) speak(firstCue);
    stopTimer();
    state.timerId = setInterval(tick, 1000);
    setStatus('Session running. Follow the phase cues or pause anytime.');
  }

  function togglePause(){
    if (!state.isActive) return;
    state.isPaused = !state.isPaused;
    if (state.isPaused){
      pauseBtn.textContent = 'Resume';
      setStatus('Paused. Press resume to continue.');
      stopTimer();
      resetSpeech();
    } else {
      pauseBtn.textContent = 'Pause';
      setStatus('Session running. Follow the phase cues or pause anytime.');
      stopTimer();
      state.timerId = setInterval(tick, 1000);
      const cue = getConfig().phases[state.phaseIndex]?.cue;
      if (cue) speak(cue);
    }
  }

  techniqueSelect.addEventListener('change', () => {
    state.techniqueKey = techniqueSelect.value;
    const config = getConfig();
    if (!state.isActive){
      const recommended = Math.max(1, config.recommendedMinutes || state.minutes);
      state.minutes = recommended;
      minutesSlider.value = String(recommended);
      minutesSlider.setAttribute('aria-valuenow', minutesSlider.value);
      minutesSlider.setAttribute('aria-valuetext', `${recommended} minutes`);
      minutesLabel.textContent = String(recommended);
    }
    renderPhases();
    resetSession();
  });

  minutesSlider.addEventListener('input', () => {
    const value = Math.max(Number(minutesSlider.min) || 1, Math.min(Number(minutesSlider.max) || 10, Number(minutesSlider.value) || 1));
    minutesSlider.value = String(value);
    minutesSlider.setAttribute('aria-valuenow', minutesSlider.value);
    minutesSlider.setAttribute('aria-valuetext', `${value} minutes`);
    minutesLabel.textContent = String(value);
    state.minutes = value;
    if (!state.isActive){
      updateStaticMeta();
      updateDynamicMeta();
    }
  });

  startBtn.addEventListener('click', event => {
    event.preventDefault();
    if (state.isActive) return;
    startSession();
  });

  pauseBtn.addEventListener('click', event => {
    event.preventDefault();
    if (!state.isActive) return;
    togglePause();
  });

  resetBtn.addEventListener('click', event => {
    event.preventDefault();
    resetSession();
  });

  voiceBtn.addEventListener('click', event => {
    event.preventDefault();
    if (!canSpeak){
      alert('Voice cues are not supported on this device.');
      return;
    }
    state.voiceEnabled = !state.voiceEnabled;
    updateVoiceButton();
    if (!state.voiceEnabled){
      resetSpeech();
    } else if (state.isActive && !state.isPaused){
      const cue = getConfig().phases[state.phaseIndex]?.cue;
      if (cue) speak(cue);
    }
  });

  renderPhases();
  updateStaticMeta();
  updateDynamicMeta();
  updateProgressBar();
  updateVoiceButton();
  setStatus('Pick a technique to preview the timing, then press start.');
})();

(function(){
  const globalRef = window.__NBProgress__ = window.__NBProgress__ || {};
  const STORAGE_KEY = 'nb_home_progress_v3';
  const listeners = new Set();
  const techniqueDefaults = {
    box: 0,
    coherent: 0,
    four78: 0,
    sos: 0,
    ladder: 0,
    colour: 0,
    roulette: 0
  };
  const partOfDayDefaults = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  let cache = null;

  const storageSupported = (() => {
    try {
      const key = '__nb_support_test__';
      window.localStorage.setItem(key, '1');
      window.localStorage.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  })();

  function clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  function dayKey(date){
    const d = date ? new Date(date) : new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function yesterdayKey(date){
    const d = date ? new Date(date) : new Date();
    d.setDate(d.getDate() - 1);
    return dayKey(d);
  }

  function getPartOfDay(date){
    const hour = (date ? new Date(date) : new Date()).getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  function defaultData(){
    return {
      total: { minutes: 0, sessions: 0, breaths: 0 },
      techniqueMinutes: Object.assign({}, techniqueDefaults),
      logs: [],
      byDate: {},
      partOfDay: Object.assign({}, partOfDayDefaults),
      meta: { lastDay: null, currentStreak: 0, bestStreak: 0 },
      challengeProgress: {}
    };
  }

  function mergeData(base, incoming){
    if (!incoming || typeof incoming !== 'object') return clone(base);
    const output = clone(base);
    if (incoming.total) output.total = Object.assign({}, output.total, incoming.total);
    if (incoming.techniqueMinutes) output.techniqueMinutes = Object.assign({}, output.techniqueMinutes, incoming.techniqueMinutes);
    if (incoming.byDate) output.byDate = Object.assign({}, output.byDate, incoming.byDate);
    if (incoming.partOfDay) output.partOfDay = Object.assign({}, output.partOfDay, incoming.partOfDay);
    if (incoming.meta) output.meta = Object.assign({}, output.meta, incoming.meta);
    if (Array.isArray(incoming.logs)) output.logs = incoming.logs.slice(0, 20);
    if (incoming.challengeProgress) output.challengeProgress = Object.assign({}, output.challengeProgress, incoming.challengeProgress);
    return output;
  }

  function load(){
    if (cache) return cache;
    let data = defaultData();
    if (storageSupported){
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) data = mergeData(data, JSON.parse(raw));
      } catch (err) {
        data = defaultData();
      }
    } else if (globalRef.__memoryCache) {
      data = mergeData(data, globalRef.__memoryCache);
    }
    cache = data;
    return cache;
  }

  function persist(data){
    cache = data;
    if (storageSupported){
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        // ignore write issues
      }
    } else {
      globalRef.__memoryCache = data;
    }
  }

  function ensureChallengeRecord(data, id){
    if (!id) return null;
    if (!data.challengeProgress[id]){
      data.challengeProgress[id] = { currentDays: 0, bestDays: 0, lastDate: null, totalSessions: 0, totalMinutes: 0 };
    }
    return data.challengeProgress[id];
  }

  function notify(event){
    listeners.forEach(listener => {
      try { listener(load(), event); } catch (err) { /* noop */ }
    });
  }

  function logSession(options){
    const minutes = Number(options?.minutes) > 0 ? Number(options.minutes) : 1;
    const technique = options?.technique || 'box';
    const label = options?.label || 'Breathing session';
    const challengeId = options?.challengeId || options?.id || null;
    const breathsPerMinute = Number(options?.breathsPerMinute) || 6;
    const data = load();
    const now = new Date();
    const today = dayKey(now);
    const yest = yesterdayKey(now);
    const breathsLogged = Math.max(1, Math.round(minutes * breathsPerMinute));

    data.total.minutes += minutes;
    data.total.sessions += 1;
    data.total.breaths += breathsLogged;
    data.techniqueMinutes[technique] = (data.techniqueMinutes[technique] || 0) + minutes;

    const entry = { label, minutes, technique, challengeId, date: today, time: now.toISOString() };
    data.logs.unshift(entry);
    data.logs = data.logs.slice(0, 12);

    const dayRecord = data.byDate[today] || { minutes: 0, sessions: 0, breaths: 0 };
    dayRecord.minutes += minutes;
    dayRecord.sessions += 1;
    dayRecord.breaths = (dayRecord.breaths || 0) + breathsLogged;
    data.byDate[today] = dayRecord;

    const part = getPartOfDay(now);
    data.partOfDay[part] = (data.partOfDay[part] || 0) + 1;

    if (!data.meta.lastDay){
      data.meta.currentStreak = 1;
    } else if (data.meta.lastDay === today){
      // streak unchanged for same day
    } else if (data.meta.lastDay === yest){
      data.meta.currentStreak += 1;
    } else {
      data.meta.currentStreak = 1;
    }
    data.meta.lastDay = today;
    if (data.meta.currentStreak > data.meta.bestStreak){
      data.meta.bestStreak = data.meta.currentStreak;
    }

    if (challengeId){
      const tracker = ensureChallengeRecord(data, challengeId);
      if (tracker){
        tracker.totalSessions += 1;
        tracker.totalMinutes += minutes;
        if (!tracker.lastDate){
          tracker.currentDays = 1;
        } else if (tracker.lastDate === today){
          // same day, no change
        } else if (tracker.lastDate === yest){
          tracker.currentDays += 1;
        } else {
          tracker.currentDays = 1;
        }
        tracker.lastDate = today;
        if (tracker.currentDays > tracker.bestDays){
          tracker.bestDays = tracker.currentDays;
        }
      }
    }

    persist(data);
    notify({ type: 'log', entry: clone(entry) });
    return { data: clone(data), entry: clone(entry) };
  }

  function reset(){
    const fresh = defaultData();
    persist(fresh);
    notify({ type: 'reset' });
    return clone(fresh);
  }

  function subscribe(fn){
    if (typeof fn !== 'function') return () => {};
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  globalRef.supported = storageSupported;
  globalRef.getData = () => load();
  globalRef.logSession = logSession;
  globalRef.reset = reset;
  globalRef.subscribe = subscribe;
  globalRef.todayKey = dayKey;
  globalRef.yesterdayKey = yesterdayKey;
})();

// Home page challenges, rewards, and tools functionality
(function(){
  const WEEKLY_GOAL_MINUTES = 60;
  const CHALLENGES = {
    dailyCalm: { id: 'dailyCalm', name: 'Daily Calm', goalDays: 5, minutes: 3, technique: 'box', breathsPerMinute: 6 },
    focusSprint: { id: 'focusSprint', name: 'Focus Sprint', goalDays: 4, minutes: 2, technique: 'coherent', breathsPerMinute: 6 },
    sleepWindDown: { id: 'sleepWindDown', name: 'Sleep Wind-Down', goalDays: 4, minutes: 4, technique: 'four78', breathsPerMinute: 4 },
    schoolReset: { id: 'schoolReset', name: 'School Reset', goalDays: 5, minutes: 1, technique: 'box', breathsPerMinute: 6 },
    sensorySafe: { id: 'sensorySafe', name: 'Sensory Safe', goalDays: 4, minutes: 2, technique: 'box', breathsPerMinute: 5 },
    anxietySOS: { id: 'anxietySOS', name: 'Anxiety SOS', goalDays: 3, minutes: 1, technique: 'sos', breathsPerMinute: 8 }
  };

  const BADGES = [
    { id: 'firstSession', check: data => data.total.sessions >= 1 },
    { id: 'tenMinutes', check: data => data.total.minutes >= 10 },
    { id: 'streak3', check: data => data.meta.bestStreak >= 3 },
    { id: 'streak7', check: data => data.meta.bestStreak >= 7 },
    { id: 'focusChampion', check: data => (data.challengeProgress.focusSprint?.totalSessions || 0) >= 5 },
    { id: 'sleepGuardian', check: data => (data.challengeProgress.sleepWindDown?.totalSessions || 0) >= 4 }
  ];

  const LADDER_STEPS = [
    { text: '3-in · 3-hold · 3-out · 3-rest', minutes: 2 },
    { text: '4-in · 4-hold · 4-out · 4-rest', minutes: 2 },
    { text: '5-in · 5-hold · 5-out · 5-rest', minutes: 3 }
  ];

  const COLOUR_PROMPTS = [
    'Inhale with the blue orb, hold on gold, exhale on green for 6 rounds.',
    'Trace blue ➜ gold ➜ green with your finger as you breathe for 2 minutes.',
    'Match your breath to the colours: blue (4), gold (2), green (6).'
  ];

  const ROULETTE_OPTIONS = [
    { label: '60s SOS exhale (4-6)', minutes: 1, technique: 'sos', breathsPerMinute: 7 },
    { label: '2-min coherent 5-5', minutes: 2, technique: 'coherent', breathsPerMinute: 6 },
    { label: '90s box reset', minutes: 1.5, technique: 'box', breathsPerMinute: 6 },
    { label: '4-min 4-7-8 drift', minutes: 4, technique: 'four78', breathsPerMinute: 4 }
  ];

  const FOCUS_TILES = {
    study: { summary: '2 min of 5-5 breathing + label your next task.', minutes: 2, technique: 'coherent' },
    driving: { summary: '60s equal breathing before starting the engine.', minutes: 1, technique: 'box' },
    work: { summary: '3 min 5-5 between meetings to reset decision fatigue.', minutes: 3, technique: 'coherent' },
    revision: { summary: '4-7-8 for 3 rounds, then glance at your notes.', minutes: 2, technique: 'four78' }
  };

  let ladderIndex = 0;
  let isFirstClimb = true;
  let justResetFromFirst = false; // Track if we just reset from first rung
  let colourIndex = -1;
  let rouletteSelection = null;
  let focusSelection = null;
  let toastTimer = null;
  let progressData = null;
  let progressSubscriptionAttached = false;

  function getProgressModule(){
    return window.__NBProgress__ || null;
  }

  function ensureFallbackStore(){
    if (!window.__nbFallbackProgress__){
      window.__nbFallbackProgress__ = {
        total: { minutes: 0, sessions: 0, breaths: 0 },
        techniqueMinutes: { box: 0, coherent: 0, four78: 0, sos: 0, ladder: 0, colour: 0, roulette: 0 },
        logs: [],
        byDate: {},
        partOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
        meta: { lastDay: null, currentStreak: 0, bestStreak: 0 },
        challengeProgress: {}
      };
    }
    return window.__nbFallbackProgress__;
  }

  function refreshProgress(){
    const module = getProgressModule();
    if (module && typeof module.getData === 'function'){
      progressData = module.getData();
    } else {
      progressData = ensureFallbackStore();
      window.__nbFallbackProgress__ = progressData;
    }
  }

  function sumInRange(days, key){
    const now = new Date();
    let total = 0;
    Object.entries(progressData.byDate || {}).forEach(([dayKey, record]) => {
      const dateObj = parseDayKey(dayKey);
      if (!dateObj) return;
      const diff = Math.floor((now - dateObj) / 86400000);
      if (diff < 0 || diff >= days) return;
      if (key === 'sessions') total += record.sessions || 0;
      if (key === 'minutes') total += record.minutes || 0;
    });
    return total;
  }

  function parseDayKey(key){
    if (!key) return null;
    const parts = key.split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function setText(id, value){
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderTotals(){
    setText('nbTotalMinutes', progressData.total.minutes || 0);
    setText('nbTotalSessions', progressData.total.sessions || 0);
    setText('mTotal', progressData.total.minutes || 0);
    setText('mSessions', progressData.total.sessions || 0);
    setText('mBreaths', progressData.total.breaths || 0);
    setText('nbCurrentStreak', (progressData.meta.currentStreak || 0) + ' day' + ((progressData.meta.currentStreak || 0) === 1 ? '' : 's'));
    setText('mStreak', progressData.meta.bestStreak || 0);
    const sessions7 = sumInRange(7, 'sessions');
    const sessions30 = sumInRange(30, 'sessions');
    setText('nbLast7', sessions7);
    setText('nbLast7Sessions', sessions7);
    setText('nbLast30Sessions', sessions30);
  }

  function renderWeeklyGoal(){
    const weeklyMinutes = sumInRange(7, 'minutes');
    const percent = WEEKLY_GOAL_MINUTES ? Math.min(100, Math.round((weeklyMinutes / WEEKLY_GOAL_MINUTES) * 100)) : 0;
    const fill = document.getElementById('weeklyGoalFill');
    if (fill) fill.style.width = percent + '%';
    setText('weeklyGoalLabel', percent + '% · ' + weeklyMinutes + ' min');
  }

  function renderTechniqueChart(){
    const minutes = progressData.techniqueMinutes || {};
    const chartValues = {
      box: minutes.box || 0,
      coherent: minutes.coherent || 0,
      four78: minutes.four78 || 0,
      sos: minutes.sos || 0,
      play: (minutes.ladder || 0) + (minutes.colour || 0) + (minutes.roulette || 0)
    };
    const total = Object.values(chartValues).reduce((sum, val) => sum + val, 0);
    Object.keys(chartValues).forEach(key => {
      const fill = document.querySelector('[data-tech-fill="' + key + '"]');
      const label = document.querySelector('[data-tech-value="' + key + '"]');
      const value = chartValues[key];
      const pct = total > 0 ? (value / total) * 100 : 0;
      if (fill) fill.style.width = pct + '%';
      if (label) label.textContent = value + ' min';
    });
  }

  function renderTrendDots(){
    const dots = document.querySelectorAll('#nbTrendDots .trend-dot');
    if (!dots.length) return;
    const now = new Date();
    dots.forEach((dot, index) => {
      const day = new Date(now);
      day.setDate(day.getDate() - (dots.length - 1 - index));
      const key = day.getFullYear() + '-' + String(day.getMonth() + 1).padStart(2, '0') + '-' + String(day.getDate()).padStart(2, '0');
      const sessions = progressData.byDate[key]?.sessions || 0;
      dot.classList.toggle('is-active', sessions > 0);
    });
  }

  function renderChallenges(){
    Object.keys(CHALLENGES).forEach(id => {
      const tracker = (progressData.challengeProgress || {})[id] || { currentDays: 0, totalMinutes: 0, totalSessions: 0 };
      const definition = CHALLENGES[id];
      const label = document.querySelector('[data-progress-label="' + id + '"]');
      const meta = document.querySelector('[data-progress-meta="' + id + '"]');
      const fill = document.querySelector('[data-progress-fill="' + id + '"]');
      const current = Math.min(definition.goalDays, tracker.currentDays || 0);
      if (label) label.textContent = 'Day ' + current + ' of ' + definition.goalDays;
      if (meta) meta.textContent = (tracker.totalMinutes || 0) + ' min · ' + (tracker.totalSessions || 0) + ' sessions';
      if (fill) {
        const width = definition.goalDays ? (current / definition.goalDays) * 100 : 0;
        fill.style.width = Math.min(100, width) + '%';
      }
    });
  }

  function renderRewards(){
    BADGES.forEach(badge => {
      const card = document.querySelector('[data-badge="' + badge.id + '"]');
      if (!card) return;
      const unlocked = badge.check(progressData);
      card.dataset.unlocked = unlocked ? 'true' : 'false';
      const status = card.querySelector('[data-badge-status="' + badge.id + '"]');
      if (status) status.textContent = unlocked ? 'Unlocked' : 'Locked';
    });
  }

  function renderRecent(){
    const list = document.getElementById('nbRecentSessions');
    if (!list) return;
    list.innerHTML = '';
    if (!progressData.logs || !progressData.logs.length){
      const li = document.createElement('li');
      li.textContent = 'Complete a session to populate this log.';
      list.appendChild(li);
      return;
    }
    progressData.logs.slice(0, 5).forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = '<strong>' + entry.label + '</strong> · ' + entry.minutes + ' min · ' + entry.date;
      list.appendChild(li);
    });
  }

  function renderInsights(){
    const list = document.getElementById('nbInsightsList');
    if (!list) return;
    const insights = [];
    const minutes = progressData.techniqueMinutes || {};
    const techniqueEntries = Object.entries({
      'box breathing': minutes.box || 0,
      'coherent 5-5': minutes.coherent || 0,
      '4-7-8 wind-down': minutes.four78 || 0,
      'SOS resets': minutes.sos || 0,
      'playful lab tools': (minutes.ladder || 0) + (minutes.colour || 0) + (minutes.roulette || 0)
    }).sort((a, b) => b[1] - a[1]);

    if (techniqueEntries[0] && techniqueEntries[0][1] > 0){
      insights.push('You lean on ' + techniqueEntries[0][0] + ' the most — great to have a favourite.');
    }
    if (progressData.meta.bestStreak >= 3){
      insights.push('Your longest streak was ' + progressData.meta.bestStreak + ' days. Try a gentle 3-day streak again.');
    }
    const partEntries = Object.entries(progressData.partOfDay || {}).sort((a, b) => b[1] - a[1]);
    if (partEntries[0] && partEntries[0][1] > 0){
      insights.push('You practise mostly in the ' + partEntries[0][0] + '. Consider adding one mini-session at a different time.');
    }
    if (!insights.length){
      insights.push('Log a couple of sessions to unlock personalised insights.');
    }
    list.innerHTML = '';
    insights.slice(0, 3).forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
  }

  function renderAll(){
    refreshProgress();
    renderTotals();
    renderWeeklyGoal();
    renderTechniqueChart();
    renderTrendDots();
    renderChallenges();
    renderRewards();
    renderRecent();
    renderChallengeSummary();
    renderInsights();
  }

  function formatDayLabel(value){
    const total = Number(value) || 0;
    return total + ' day' + (total === 1 ? '' : 's');
  }

  function formatSessionLabel(value){
    const total = Number(value) || 0;
    return total + ' session' + (total === 1 ? '' : 's');
  }

  function describeLastLog(dateKey){
    if (!dateKey) return 'Not started yet';
    const parsed = parseDayKey(dateKey);
    if (!parsed) return 'Not started yet';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsed.setHours(0, 0, 0, 0);
    const diff = Math.round((today - parsed) / 86400000);
    if (diff <= 0) return 'Logged today';
    if (diff === 1) return 'Logged yesterday';
    return 'Last log ' + diff + 'd ago';
  }

  function renderChallengeSummary(){
    const list = document.getElementById('nbChallengeSummary');
    if (!list) return;
    list.innerHTML = '';
    const entries = Object.keys(CHALLENGES).map(id => {
      const def = CHALLENGES[id];
      const tracker = (progressData.challengeProgress || {})[id];
      if (!def || !tracker) return null;
      const goalDays = def.goalDays || 1;
      const currentDays = Math.max(0, Math.min(goalDays, Number(tracker.currentDays) || 0));
      const percent = goalDays ? Math.min(100, Math.round((currentDays / goalDays) * 100)) : 0;
      const hasHistory = (tracker.totalSessions || 0) > 0 || (tracker.bestDays || 0) > 0;
      return hasHistory ? { id, def, tracker, goalDays, currentDays, percent } : null;
    }).filter(Boolean).sort((a, b) => {
      if (b.percent !== a.percent) return b.percent - a.percent;
      return (b.tracker.bestDays || 0) - (a.tracker.bestDays || 0);
    });

    if (!entries.length){
      const empty = document.createElement('li');
      empty.className = 'challenge-progress-empty';
      empty.textContent = 'Start any challenge to see day-by-day progress.';
      list.appendChild(empty);
      list.dataset.state = 'empty';
      return;
    }

    list.dataset.state = 'ready';
    entries.forEach(entry => {
      const { def, tracker, goalDays, currentDays, percent } = entry;
      const li = document.createElement('li');
      li.className = 'challenge-progress-item';
      li.dataset.state = percent >= 100 ? 'complete' : 'active';
      const lastLog = describeLastLog(tracker.lastDate);
      const progressLabel = 'Day ' + Math.max(1, currentDays || tracker.bestDays || 1) + ' of ' + goalDays;
      const statusText = progressLabel + ' · ' + lastLog;
      
      li.innerHTML = `
        <div class="challenge-progress-head">
          <div>
            <p class="challenge-progress-name">${def.name}</p>
            <p class="challenge-progress-status">${statusText}</p>
          </div>
          <span class="challenge-progress-percent">${percent}%</span>
        </div>
        <div class="challenge-progress-bar" role="img" aria-label="${percent}% of ${def.name}">
          <span></span>
        </div>
        <dl class="challenge-progress-meta">
          <div>
            <dt>Current streak</dt>
            <dd>${formatDayLabel(tracker.currentDays)}</dd>
          </div>
          <div>
            <dt>Best streak</dt>
            <dd>${formatDayLabel(tracker.bestDays)}</dd>
          </div>
          <div>
            <dt>Sessions</dt>
            <dd>${formatSessionLabel(tracker.totalSessions)}</dd>
          </div>
          <div>
            <dt>Minutes</dt>
            <dd>${Math.round(Number(tracker.totalMinutes) || 0)} min</dd>
          </div>
        </dl>
      `;
      
      // Set width via JavaScript instead of inline style
      const progressSpan = li.querySelector('.challenge-progress-bar span');
      if (progressSpan) {
        progressSpan.style.width = percent + '%';
      }
      
      list.appendChild(li);
    });
  }

  function showToast(message){
    const toast = document.getElementById('homeToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2600);
  }

  function recordSession(opts, toastMessage){
    const module = getProgressModule();
    const usingModule = module && typeof module.logSession === 'function';
    if (usingModule){
      module.logSession(opts);
      toastMessage = toastMessage || 'Session logged — stored on this device only.';
    } else {
      const data = ensureFallbackStore();
      const minutes = Number(opts?.minutes) > 0 ? Number(opts.minutes) : 1;
      const technique = opts?.technique || 'box';
      const challengeId = opts?.challengeId || opts?.id || null;
      const label = opts?.label || 'Breathing session';
      const breathsPerMinute = Number(opts?.breathsPerMinute) || 6;
      const now = new Date();
      const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
      const breathsLogged = Math.round(minutes * breathsPerMinute);
      data.total.minutes += minutes;
      data.total.sessions += 1;
      data.total.breaths += breathsLogged;
      data.techniqueMinutes[technique] = (data.techniqueMinutes[technique] || 0) + minutes;
      const entry = { label, minutes, technique, challengeId, date: today, time: now.toISOString() };
      data.logs.unshift(entry);
      data.logs = data.logs.slice(0, 12);
      const dayRecord = data.byDate[today] || { minutes: 0, sessions: 0, breaths: 0 };
      dayRecord.minutes += minutes;
      dayRecord.sessions += 1;
      dayRecord.breaths = (dayRecord.breaths || 0) + breathsLogged;
      data.byDate[today] = dayRecord;
      window.__nbFallbackProgress__ = data;
      toastMessage = toastMessage || 'Session logged — stored for this visit.';
    }
    renderAll();
    showToast(toastMessage);
  }

  function wireChallengeButtons(){
    document.querySelectorAll('[data-log-challenge]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-log-challenge');
        const minutes = Number(btn.getAttribute('data-minutes')) || CHALLENGES[id]?.minutes || 1;
        const technique = btn.getAttribute('data-technique') || CHALLENGES[id]?.technique || 'box';
        const label = btn.getAttribute('data-label') || CHALLENGES[id]?.name || 'Breathing challenge';
        const breathsPerMinute = CHALLENGES[id]?.breathsPerMinute || 6;
        recordSession({ minutes, technique, label, challengeId: id, breathsPerMinute });
      });
    });
  }

  function wireScrollButtons(){
    document.querySelectorAll('[data-scroll-target]').forEach(btn => {
      const targetSelector = btn.getAttribute('data-scroll-target');
      const target = targetSelector ? document.querySelector(targetSelector) : null;
      if (!target) return;
      btn.addEventListener('click', () => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function wireGenericLogButtons(){
    document.querySelectorAll('[data-log-session]').forEach(btn => {
      btn.addEventListener('click', () => {
        const minutes = Number(btn.getAttribute('data-minutes')) || 1;
        const technique = btn.getAttribute('data-technique') || 'box';
        const label = btn.getAttribute('data-label') || 'Breathing session';
        recordSession({ minutes, technique, label });
      });
    });
  }

  function wireResetButton(){
    const reset = document.getElementById('nbResetProgress');
    if (!reset) return;
    reset.addEventListener('click', () => {
      if (window.confirm('Reset local breathing stats? This affects this browser only.')){
        const module = getProgressModule();
        if (module && typeof module.reset === 'function'){
          module.reset();
        } else {
          window.__nbFallbackProgress__ = {
            total: { minutes: 0, sessions: 0, breaths: 0 },
            techniqueMinutes: { box: 0, coherent: 0, four78: 0, sos: 0, ladder: 0, colour: 0, roulette: 0 },
            logs: [],
            byDate: {},
            partOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
            meta: { lastDay: null, currentStreak: 0, bestStreak: 0 },
            challengeProgress: {}
          };
        }
        renderAll();
        showToast('Stats cleared.');
      }
    });
  }

  function updateLadderText(){
    const pattern = document.getElementById('ladderPattern');
    if (pattern) pattern.textContent = LADDER_STEPS[ladderIndex].text;
    
    // Update breathing demo counts
    const currentStep = LADDER_STEPS[ladderIndex];
    const counts = currentStep.text.match(/(\d+)/g);
    if (counts && counts.length >= 4) {
      const inhaleCount = document.getElementById('inhaleCount');
      const holdCount = document.getElementById('holdCount');
      const exhaleCount = document.getElementById('exhaleCount');
      const restCount = document.getElementById('restCount');
      const demoInhale = document.getElementById('demoInhale');
      const demoHold = document.getElementById('demoHold');
      const demoExhale = document.getElementById('demoExhale');
      const demoRest = document.getElementById('demoRest');
      
      if (inhaleCount) inhaleCount.textContent = counts[0];
      if (holdCount) holdCount.textContent = counts[1];
      if (exhaleCount) exhaleCount.textContent = counts[2];
      if (restCount) restCount.textContent = counts[3];
      if (demoInhale) demoInhale.textContent = counts[0];
      if (demoHold) demoHold.textContent = counts[1];
      if (demoExhale) demoExhale.textContent = counts[2];
      if (demoRest) demoRest.textContent = counts[3];
    }
  }
  
  function startBreathingDemo() {
    const breathingCircle = document.getElementById('breathingCircle');
    const phases = document.querySelectorAll('.breathing-phase');
    const currentStep = LADDER_STEPS[ladderIndex];
    const counts = currentStep.text.match(/(\d+)/g);
    
    if (!counts || counts.length < 4 || !breathingCircle) return null;
    
    const inhaleTime = parseInt(counts[0]) * 1000;
    const holdTime = parseInt(counts[1]) * 1000;
    const exhaleTime = parseInt(counts[2]) * 1000;
    const restTime = parseInt(counts[3]) * 1000;
    
    let currentPhaseIndex = 0;
    const phaseSequence = ['inhale', 'hold', 'exhale', 'rest'];
    const timings = [inhaleTime, holdTime, exhaleTime, restTime];
    
    function animatePhase() {
      // Remove active from all
      phases.forEach(p => p.classList.remove('active'));
      breathingCircle.className = 'breathing-animation-circle';
      
      // Activate current phase
      const phaseName = phaseSequence[currentPhaseIndex];
      const phaseElement = document.querySelector(`.breathing-phase--${phaseName}`);
      if (phaseElement) phaseElement.classList.add('active');
      breathingCircle.classList.add(`phase-${phaseName}`);
      
      currentPhaseIndex = (currentPhaseIndex + 1) % phaseSequence.length;
    }
    
    // Start first phase immediately
    animatePhase();
    
    // Schedule subsequent phases
    let accumulatedTime = timings[0];
    for (let i = 1; i < timings.length; i++) {
      setTimeout(() => {
        animatePhase();
      }, accumulatedTime);
      accumulatedTime += timings[i];
    }
    
    // Loop the animation
    const totalCycleTime = inhaleTime + holdTime + exhaleTime + restTime;
    return setInterval(() => {
      currentPhaseIndex = 0;
      animatePhase();
      accumulatedTime = timings[0];
      for (let i = 1; i < timings.length; i++) {
        setTimeout(() => {
          animatePhase();
        }, accumulatedTime);
        accumulatedTime += timings[i];
      }
    }, totalCycleTime);
  }
  
  let breathingDemoInterval = null;

  function wireLadder(){
    const advance = document.getElementById('ladderAdvance');
    const climber = document.getElementById('ladderClimber');
    const progressBar = document.getElementById('ladderProgress');
    const rungs = document.querySelectorAll('.ladder-rung');
    const btnText = advance?.querySelector('.btn-text');
    
    // Set initial button text
    if (btnText && isFirstClimb) {
      btnText.textContent = 'Start Climb Rung';
    }
    
    // Start breathing demo animation
    if (breathingDemoInterval) {
      clearInterval(breathingDemoInterval);
    }
    breathingDemoInterval = startBreathingDemo();
    
    if (advance){
      advance.addEventListener('click', () => {
        // Check if we're at the first rung (3-in · 3-hold · 3-out · 3-rest)
        const currentPattern = LADDER_STEPS[ladderIndex].text;
        const isAtFirstRung = ladderIndex === 0 || currentPattern === '3-in · 3-hold · 3-out · 3-rest';
        
        if (isAtFirstRung && !justResetFromFirst) {
          // First click on first rung: Reset to default start
          ladderIndex = 0;
          
          // Reset all rungs
          rungs.forEach((rung, index) => {
            rung.classList.remove('active', 'completed');
            if (index === 0) {
              rung.classList.add('active');
            }
          });
          
          // Reset climber position
          if (climber && rungs[0]) {
            climber.style.top = `${rungs[0].offsetTop + 10}px`;
          }
          
          // Reset progress bar
          if (progressBar) {
            progressBar.style.width = `${((ladderIndex + 1) / LADDER_STEPS.length) * 100}%`;
          }
          
          // Reset button text
          if (btnText) {
            btnText.textContent = 'Start Climb Rung';
          }
          isFirstClimb = true;
          justResetFromFirst = true; // Mark that we just reset
          
          // Restart breathing demo
          if (breathingDemoInterval) {
            clearInterval(breathingDemoInterval);
          }
          breathingDemoInterval = startBreathingDemo();
        } else {
          // Normal advancement (including second click on first rung after reset)
          // Update button text after first click
          if (isFirstClimb && btnText) {
            btnText.textContent = 'Climb Next Rung';
            isFirstClimb = false;
          }
          
          // Remove active from current rung
          if (rungs[ladderIndex]) {
            rungs[ladderIndex].classList.remove('active');
            rungs[ladderIndex].classList.add('completed');
          }
          
          // Advance to next rung
          ladderIndex = (ladderIndex + 1) % LADDER_STEPS.length;
          
          // Reset the flag when we advance away from first rung
          if (ladderIndex !== 0) {
            justResetFromFirst = false;
          }
          
          // Add active to new rung
          if (rungs[ladderIndex]) {
            rungs[ladderIndex].classList.add('active');
            rungs[ladderIndex].classList.remove('completed');
            
            // Animate climber
            const rungTop = rungs[ladderIndex].offsetTop;
            if (climber) {
              climber.style.top = `${rungTop + 10}px`;
            }
            
            // Update progress bar
            const progress = ((ladderIndex + 1) / LADDER_STEPS.length) * 100;
            if (progressBar) {
              progressBar.style.width = `${progress}%`;
            }
            
            // Restart breathing demo with new timings
            if (breathingDemoInterval) {
              clearInterval(breathingDemoInterval);
            }
            breathingDemoInterval = startBreathingDemo();
            
            // Celebration effect
            if (ladderIndex === LADDER_STEPS.length - 1) {
              createCelebrationEffect(advance, '🎉 Reached the top!');
            }
          }
          
          // If we looped back to first rung, reset the flag for next cycle
          if (ladderIndex === 0) {
            justResetFromFirst = false;
          }
        }
        
        updateLadderText();
      });
    }
    updateLadderText();
    
    // Initialize climber position
    if (rungs[0] && climber) {
      rungs[0].classList.add('active');
      climber.style.top = `${rungs[0].offsetTop + 10}px`;
    }
    if (progressBar) {
      progressBar.style.width = `${((ladderIndex + 1) / LADDER_STEPS.length) * 100}%`;
    }
  }

  function wireColourPath(){
    const startBtn = document.getElementById('colourStart');
    const instruction = document.getElementById('colourInstruction');
    const blueOrb = document.getElementById('orbBlue');
    const goldOrb = document.getElementById('orbGold');
    const greenOrb = document.getElementById('orbGreen');
    const pathLines = document.querySelectorAll('.path-line');
    let breathingActive = false;
    let breathingInterval = null;
    let currentPhase = 0;
    
    function startBreathingAnimation() {
      if (breathingActive) return;
      breathingActive = true;
      
      const phases = [
        { orb: blueOrb, path: pathLines[0], duration: 4000 },
        { orb: goldOrb, path: pathLines[1], duration: 2000 },
        { orb: greenOrb, path: pathLines[2], duration: 6000 }
      ];
      
      function animatePhase() {
        // Remove active from all
        [blueOrb, goldOrb, greenOrb].forEach(orb => {
          if (orb) orb.classList.remove('active');
        });
        pathLines.forEach(line => line.classList.remove('active'));
        
        // Activate current phase
        const phase = phases[currentPhase];
        if (phase.orb) phase.orb.classList.add('active');
        if (phase.path) phase.path.classList.add('active');
        
        currentPhase = (currentPhase + 1) % phases.length;
      }
      
      animatePhase();
      breathingInterval = setInterval(animatePhase, 12000); // Full cycle
    }
    
    function stopBreathingAnimation() {
      breathingActive = false;
      if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
      }
      [blueOrb, goldOrb, greenOrb].forEach(orb => {
        if (orb) orb.classList.remove('active');
      });
      pathLines.forEach(line => line.classList.remove('active'));
    }
    
    if (startBtn && instruction){
      startBtn.addEventListener('click', () => {
        if (breathingActive) {
          stopBreathingAnimation();
          startBtn.querySelector('.btn-text').textContent = 'Start Breathing Journey';
        } else {
          startBreathingAnimation();
          startBtn.querySelector('.btn-text').textContent = 'Stop Journey';
          colourIndex = (colourIndex + 1) % COLOUR_PROMPTS.length;
          instruction.textContent = COLOUR_PROMPTS[colourIndex];
        }
      });
    }
  }

  function wireRoulette(){
    const button = document.getElementById('rouletteButton');
    const result = document.getElementById('rouletteResult');
    const wheel = document.getElementById('rouletteWheel');
    const sparkles = wheel?.querySelector('.wheel-sparkles');
    const optionCards = document.querySelectorAll('.roulette-option-card');
    let isSpinning = false;
    
    if (button && result && wheel){
      button.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        button.disabled = true;
        
        // Remove selected state from all cards
        optionCards.forEach(card => card.classList.remove('selected'));
        
        // Spin animation
        wheel.classList.add('spinning');
        if (sparkles) sparkles.classList.add('active');
        
        // Select random option
        const selectedIndex = Math.floor(Math.random() * ROULETTE_OPTIONS.length);
        rouletteSelection = ROULETTE_OPTIONS[selectedIndex];
        
        // Calculate final rotation
        const baseRotation = 1080; // 3 full spins
        const segmentAngle = 90; // Each segment is 90 degrees
        const finalRotation = baseRotation + (selectedIndex * segmentAngle) + (segmentAngle / 2);
        
        // Apply final rotation
        setTimeout(() => {
          wheel.style.transform = `rotate(${finalRotation}deg)`;
          wheel.classList.remove('spinning');
          
          // Show result with delay and highlight card
          setTimeout(() => {
            result.textContent = 'Try: ' + rouletteSelection.label;
            
            // Highlight the selected option card
            const selectedCard = document.querySelector(`.roulette-option-card[data-option="${selectedIndex}"]`);
            if (selectedCard) {
              selectedCard.classList.add('selected');
              // Scroll card into view if needed
              selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            createCelebrationEffect(button, '✨');
            isSpinning = false;
            button.disabled = false;
            if (sparkles) sparkles.classList.remove('active');
          }, 300);
        }, 3000);
      });
    }
    const logBtn = document.getElementById('rouletteLog');
    if (logBtn){
      logBtn.addEventListener('click', () => {
        if (!rouletteSelection) rouletteSelection = ROULETTE_OPTIONS[0];
        recordSession(Object.assign({ label: rouletteSelection.label }, rouletteSelection));
        createCelebrationEffect(logBtn, '🎉 Logged!');
      });
    }
  }

  function wireFocusTiles(){
    const plan = document.getElementById('focusPlan');
    const logBtn = document.getElementById('focusLog');
    const indicator = document.getElementById('tileIndicator');
    const suggestionCard = document.getElementById('focusSuggestionCard');
    const techniqueLinkContainer = document.getElementById('techniqueLinkContainer');
    const techniqueLink = document.getElementById('techniqueLink');
    const tiles = document.querySelectorAll('.focus-tile');
    
    // Map techniques to their page URLs
    const techniqueUrls = {
      'coherent': 'coherent-5-5.html',
      'box': 'box-breathing.html',
      'four78': '4-7-8-breathing.html',
      'sos': 'sos-60.html'
    };
    
    tiles.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active from all tiles
        tiles.forEach(b => {
          b.setAttribute('aria-pressed', 'false');
          b.classList.remove('selected');
        });
        
        // Activate clicked tile
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('selected');
        
        // Animate indicator
        if (indicator) {
          const rect = btn.getBoundingClientRect();
          const containerRect = btn.parentElement.getBoundingClientRect();
          indicator.style.left = `${rect.left - containerRect.left}px`;
          indicator.style.width = `${rect.width}px`;
          indicator.classList.add('active');
        }
        
        const key = btn.getAttribute('data-focus-tile');
        focusSelection = FOCUS_TILES[key];
        
        if (plan && focusSelection){
          plan.textContent = focusSelection.summary;
          
          // Show suggestion card
          if (suggestionCard) {
            suggestionCard.classList.add('has-suggestion');
          }
          
          // Update technique link
          const techniqueUrl = techniqueUrls[focusSelection.technique];
          if (techniqueLink && techniqueUrl) {
            techniqueLink.href = techniqueUrl;
            techniqueLink.setAttribute('data-href', techniqueUrl);
            if (techniqueLinkContainer) {
              techniqueLinkContainer.classList.remove('hidden');
            }
          }
          
          if (logBtn) {
            logBtn.setAttribute('data-minutes', focusSelection.minutes);
            logBtn.setAttribute('data-technique', focusSelection.technique);
          }
        }
        
        // Celebration effect
        createCelebrationEffect(btn, '✨');
      });
    });
    
    if (logBtn){
      logBtn.addEventListener('click', () => {
        const selection = focusSelection || FOCUS_TILES.study;
        recordSession({ minutes: selection.minutes, technique: selection.technique, label: selection.summary });
        createCelebrationEffect(logBtn, '🎉 Logged!');
      });
    }
  }
  
  // Helper function for celebration effects
  function createCelebrationEffect(element, emoji) {
    if (!element) return;
    const celebration = document.createElement('div');
    celebration.textContent = emoji;
    celebration.style.cssText = `
      position: absolute;
      pointer-events: none;
      font-size: 2rem;
      z-index: 1000;
      animation: celebrationFloat 1.5s ease-out forwards;
    `;
    
    const rect = element.getBoundingClientRect();
    celebration.style.left = `${rect.left + rect.width / 2}px`;
    celebration.style.top = `${rect.top}px`;
    celebration.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      celebration.remove();
    }, 1500);
  }

  // Hero Orbit Breathing Session
  function initHeroOrbitBreathing() {
    const startBtn = document.getElementById('heroOrbitStart');
    const pauseBtn = document.getElementById('heroOrbitPause');
    const resumeBtn = document.getElementById('heroOrbitResume');
    const stopBtn = document.getElementById('heroOrbitStop');
    const orb = document.getElementById('heroOrbitOrb');
    const phaseLabel = document.getElementById('heroOrbitPhase');
    const inhaleLabel = document.getElementById('heroLabelInhale');
    const holdLabel = document.getElementById('heroLabelHold');
    const exhaleLabel = document.getElementById('heroLabelExhale');
    const focusedMinutesEl = document.getElementById('heroFocusedMinutes');

    if (!startBtn || !orb) {
      console.warn('Hero orbit elements not found');
      return;
    }

    // Focus screen elements
    const focusScreen = document.getElementById('breathingFocusScreen');
    const focusCloseBtn = document.getElementById('focusScreenClose');
    const focusOrb = document.getElementById('focusOrbitOrb');
    const focusRing = document.getElementById('focusOrbitRing');
    const focusPhaseIndicator = document.getElementById('focusOrbitPhaseIndicator');
    const focusPhaseDisplay = document.getElementById('focusPhaseDisplay');
    const focusInhaleLabel = document.getElementById('focusLabelInhale');
    const focusHoldLabel = document.getElementById('focusLabelHold');
    const focusExhaleLabel = document.getElementById('focusLabelExhale');
    const focusSessionTime = document.getElementById('focusSessionTime');
    const focusTodayMinutes = document.getElementById('focusTodayMinutes');
    const focusPauseBtn = document.getElementById('focusPauseBtn');
    const focusResumeBtn = document.getElementById('focusResumeBtn');
    const focusStopBtn = document.getElementById('focusStopBtn');

    let isRunning = false;
    let isPaused = false;
    let currentPhase = null;
    let phaseTimeout = null;
    let sessionStartTime = null;
    let totalSessionSeconds = 0;
    let sessionInterval = null;

    // Breathing pattern: Inhale 4s, Hold 2s, Exhale 6s (12s total cycle)
    const BREATHING_PATTERN = {
      inhale: { duration: 4000, label: 'Inhale', count: 4 },
      hold: { duration: 2000, label: 'Hold', count: 2 },
      exhale: { duration: 6000, label: 'Exhale', count: 6 }
    };

    function syncFocusScreen() {
      if (!focusOrb || !orb) return;
      
      const focusContainer = document.getElementById('focusOrbitContainer');
      
      // Sync orb state
      focusOrb.className = orb.className.replace('nb-orbit-orb', 'focus-orbit-orb');
      
      // Sync phase indicator
      if (focusPhaseIndicator && phaseLabel) {
        const phase = currentPhase || 'ready';
        focusPhaseIndicator.className = 'focus-orbit-phase-indicator active ' + phase;
      }
      
      // Sync ring
      if (focusRing) {
        focusRing.className = 'focus-orbit-ring phase-' + (currentPhase || 'ready');
      }
      
      // Add breathing-active class to focus container
      if (focusContainer && isRunning) {
        focusContainer.classList.add('breathing-active');
      }
      
      // Sync labels
      if (focusPhaseDisplay && currentPhase) {
        const config = BREATHING_PATTERN[currentPhase];
        focusPhaseDisplay.textContent = config.label;
      }
      
      // Sync label highlights
      [focusInhaleLabel, focusHoldLabel, focusExhaleLabel].forEach((label, idx) => {
        if (label) {
          const mainLabels = [inhaleLabel, holdLabel, exhaleLabel];
          if (mainLabels[idx] && mainLabels[idx].classList.contains('active')) {
            label.classList.add('active');
          } else {
            label.classList.remove('active');
          }
        }
      });
      
      // Update session time
      if (focusSessionTime) {
        const minutes = Math.floor(totalSessionSeconds / 60);
        const seconds = totalSessionSeconds % 60;
        focusSessionTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      
      // Update today's minutes
      if (focusTodayMinutes && focusedMinutesEl) {
        focusTodayMinutes.textContent = focusedMinutesEl.textContent || '0';
      }
    }

    function showFocusScreen() {
      if (!focusScreen) return;
      focusScreen.classList.remove('hidden');
      focusScreen.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => syncFocusScreen(), 100);
    }

    function hideFocusScreen() {
      if (!focusScreen) return;
      focusScreen.classList.add('hidden');
      focusScreen.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function updatePhase(phase) {
      if (!orb || !phaseLabel) return;

      currentPhase = phase;
      const config = BREATHING_PATTERN[phase];

      // Update orb classes
      orb.className = 'nb-orbit-orb breathing ' + phase;
      
      // Update phase label
      if (phaseLabel) {
        phaseLabel.textContent = config.label;
      }

      // Update label highlights
      [inhaleLabel, holdLabel, exhaleLabel].forEach(label => {
        if (label) label.classList.remove('active');
      });

      if (phase === 'inhale' && inhaleLabel) {
        inhaleLabel.classList.add('active');
      } else if (phase === 'hold' && holdLabel) {
        holdLabel.classList.add('active');
      } else if (phase === 'exhale' && exhaleLabel) {
        exhaleLabel.classList.add('active');
      }

      // Sync focus screen
      if (isRunning) {
        setTimeout(() => syncFocusScreen(), 50);
      }

      // Schedule next phase
      if (isRunning && !isPaused) {
        phaseTimeout = setTimeout(() => {
          if (phase === 'inhale') {
            updatePhase('hold');
          } else if (phase === 'hold') {
            updatePhase('exhale');
          } else if (phase === 'exhale') {
            updatePhase('inhale'); // Loop
          }
        }, config.duration);
      }
    }

    function startSession() {
      if (isRunning) return;

      console.log('Starting hero orbit breathing session');
      isRunning = true;
      isPaused = false;
      sessionStartTime = Date.now();

      // Show/hide buttons
      if (startBtn) startBtn.classList.add('hidden');
      if (pauseBtn) pauseBtn.classList.remove('hidden');
      if (stopBtn) stopBtn.classList.remove('hidden');
      if (resumeBtn) resumeBtn.classList.add('hidden');

      // Show focus screen controls
      if (focusPauseBtn) focusPauseBtn.classList.remove('hidden');
      if (focusResumeBtn) focusResumeBtn.classList.add('hidden');
      if (focusStopBtn) focusStopBtn.classList.remove('hidden');

      // Show focus screen
      showFocusScreen();

      // Start breathing cycle
      updatePhase('inhale');

      // Track session time and update display
      sessionInterval = setInterval(() => {
        if (!isPaused) {
          totalSessionSeconds++;
          const minutes = Math.floor(totalSessionSeconds / 60);
          if (focusedMinutesEl) {
            focusedMinutesEl.textContent = minutes;
          }
          
          // Sync focus screen every second
          syncFocusScreen();
          
          // Update hero stats every 10 seconds during session
          if (totalSessionSeconds % 10 === 0) {
            updateHeroStats();
          }
        }
      }, 1000);
    }

    function pauseSession() {
      if (!isRunning || isPaused) return;

      isPaused = true;
      if (phaseTimeout) {
        clearTimeout(phaseTimeout);
        phaseTimeout = null;
      }

      if (pauseBtn) pauseBtn.classList.add('hidden');
      if (resumeBtn) resumeBtn.classList.remove('hidden');
      if (orb) {
        orb.style.animationPlayState = 'paused';
      }
      
      // Sync focus screen
      if (focusPauseBtn) focusPauseBtn.classList.add('hidden');
      if (focusResumeBtn) focusResumeBtn.classList.remove('hidden');
      if (focusOrb) focusOrb.style.animationPlayState = 'paused';
      if (focusPhaseIndicator) focusPhaseIndicator.style.animationPlayState = 'paused';
      if (focusRing) focusRing.style.animationPlayState = 'paused';
    }

    function resumeSession() {
      if (!isRunning || !isPaused) return;

      isPaused = false;
      if (orb) {
        orb.style.animationPlayState = 'running';
      }
      
      // Sync focus screen
      if (focusResumeBtn) focusResumeBtn.classList.add('hidden');
      if (focusPauseBtn) focusPauseBtn.classList.remove('hidden');
      if (focusOrb) focusOrb.style.animationPlayState = 'running';
      if (focusPhaseIndicator) focusPhaseIndicator.style.animationPlayState = 'running';
      if (focusRing) focusRing.style.animationPlayState = 'running';

      // Resume from current phase
      if (currentPhase) {
        const config = BREATHING_PATTERN[currentPhase];
        const elapsed = Date.now() - (sessionStartTime || Date.now());
        const remaining = Math.max(0, config.duration - (elapsed % config.duration));
        
        phaseTimeout = setTimeout(() => {
          if (currentPhase === 'inhale') {
            updatePhase('hold');
          } else if (currentPhase === 'hold') {
            updatePhase('exhale');
          } else if (currentPhase === 'exhale') {
            updatePhase('inhale');
          }
        }, remaining);
      }

      if (resumeBtn) resumeBtn.classList.add('hidden');
      if (pauseBtn) pauseBtn.classList.remove('hidden');
    }

    function updateHeroStats() {
      // Trigger progress update event to refresh hero stats
      window.dispatchEvent(new CustomEvent('mpl:progress-update', {
        detail: { pageId: 'index' }
      }));
      
      // Also update today's focused minutes display
      if (focusedMinutesEl && typeof getProgressModule === 'function') {
        const progress = getProgressModule('index');
        if (progress && progress.today) {
          focusedMinutesEl.textContent = progress.today || 0;
        }
      }
    }

    function stopSession() {
      isRunning = false;
      isPaused = false;

      if (phaseTimeout) {
        clearTimeout(phaseTimeout);
        phaseTimeout = null;
      }

      if (sessionInterval) {
        clearInterval(sessionInterval);
        sessionInterval = null;
      }

      // Reset UI
      if (orb) {
        orb.className = 'nb-orbit-orb';
        orb.style.animationPlayState = '';
      }

      if (phaseLabel) phaseLabel.textContent = 'Ready';

      [inhaleLabel, holdLabel, exhaleLabel].forEach(label => {
        if (label) label.classList.remove('active');
      });

      // Hide focus screen
      hideFocusScreen();

      // Reset focus screen
      const focusContainer = document.getElementById('focusOrbitContainer');
      if (focusContainer) {
        focusContainer.classList.remove('breathing-active');
      }
      if (focusOrb) {
        focusOrb.className = 'focus-orbit-orb';
        focusOrb.style.animationPlayState = '';
      }
      if (focusPhaseIndicator) {
        focusPhaseIndicator.className = 'focus-orbit-phase-indicator';
        focusPhaseIndicator.style.animationPlayState = '';
      }
      if (focusPhaseDisplay) {
        focusPhaseDisplay.textContent = 'Ready';
      }
      if (focusRing) {
        focusRing.className = 'focus-orbit-ring';
        focusRing.style.animationPlayState = '';
      }

      [focusInhaleLabel, focusHoldLabel, focusExhaleLabel].forEach(label => {
        if (label) label.classList.remove('active');
      });

      // Show/hide buttons
      if (startBtn) startBtn.classList.remove('hidden');
      if (pauseBtn) pauseBtn.classList.add('hidden');
      if (resumeBtn) resumeBtn.classList.add('hidden');
      if (stopBtn) stopBtn.classList.add('hidden');

      if (focusPauseBtn) focusPauseBtn.classList.add('hidden');
      if (focusResumeBtn) focusResumeBtn.classList.add('hidden');
      if (focusStopBtn) focusStopBtn.classList.remove('hidden');

      // Save session if we have at least 1 minute
      if (totalSessionSeconds >= 60 && typeof recordSession === 'function') {
        const minutes = Math.floor(totalSessionSeconds / 60);
        recordSession({
          minutes: minutes,
          technique: 'box',
          label: 'Hero breathing session',
          pageId: 'index'
        });
        
        // Update stats after a short delay to allow storage to update
        setTimeout(() => {
          updateHeroStats();
        }, 200);
      }

      totalSessionSeconds = 0;
      currentPhase = null;
    }

    // Event listeners
    if (startBtn) {
      startBtn.addEventListener('click', startSession);
    }
    if (pauseBtn) {
      pauseBtn.addEventListener('click', pauseSession);
    }
    if (resumeBtn) {
      resumeBtn.addEventListener('click', resumeSession);
    }
    if (stopBtn) {
      stopBtn.addEventListener('click', stopSession);
    }

    // Focus screen controls
    if (focusCloseBtn) {
      focusCloseBtn.addEventListener('click', stopSession);
    }
    if (focusPauseBtn) {
      focusPauseBtn.addEventListener('click', pauseSession);
    }
    if (focusResumeBtn) {
      focusResumeBtn.addEventListener('click', resumeSession);
    }
    if (focusStopBtn) {
      focusStopBtn.addEventListener('click', stopSession);
    }

    // Close on Escape key
    if (focusScreen) {
      focusScreen.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isRunning) {
          stopSession();
        }
      });
      focusScreen.setAttribute('tabindex', '0');
    }

    // Update focused minutes on load
    updateHeroStats();
    
    // Listen for progress updates to refresh stats
    window.addEventListener('mpl:progress-update', (evt) => {
      const detailPage = evt?.detail?.pageId;
      if (!detailPage || detailPage === 'index') {
        updateHeroStats();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    wireChallengeButtons();
    wireScrollButtons();
    wireGenericLogButtons();
    wireResetButton();
    wireLadder();
    wireColourPath();
    wireRoulette();
    wireFocusTiles();
    initHeroOrbitBreathing();
    initEvidenceOrbitBreathing();
  });

  // Evidence Orbit Breathing Session
  function initEvidenceOrbitBreathing() {
    const startBtn = document.getElementById('evidenceOrbitStart');
    const pauseBtn = document.getElementById('evidenceOrbitPause');
    const resumeBtn = document.getElementById('evidenceOrbitResume');
    const stopBtn = document.getElementById('evidenceOrbitStop');
    const orb = document.getElementById('evidenceOrbitOrb');
    const phaseIndicator = document.getElementById('evidenceOrbitPhaseIndicator');
    const inhaleLabel = document.getElementById('evidenceLabelInhale');
    const holdLabel = document.getElementById('evidenceLabelHold');
    const exhaleLabel = document.getElementById('evidenceLabelExhale');
    const focusedMinutesEl = document.getElementById('evidenceFocusedMinutes');
    const tryNarratedBtn = document.getElementById('evidenceTryNarrated');
    const visualContainer = document.querySelector('#why-breathing-works > div.home-evidence__layout > aside > div > div');
    const visualizerCard = document.querySelector('.live-orbit-visualizer-card');

    if (!startBtn || !orb) return;

    // Enhanced visual container features
    if (visualContainer) {
      // Add hover effects
      visualContainer.addEventListener('mouseenter', () => {
        if (!isRunning) {
          visualContainer.style.transform = 'scale(1.02)';
          visualContainer.style.transition = 'transform 0.3s ease';
        }
      });

      visualContainer.addEventListener('mouseleave', () => {
        if (!isRunning) {
          visualContainer.style.transform = 'scale(1)';
        }
      });

      // Add click to start functionality
      visualContainer.addEventListener('click', (e) => {
        if (!isRunning && e.target === visualContainer || e.target.closest('.live-orbit-visual-container')) {
          if (startBtn && !startBtn.classList.contains('hidden')) {
            startBtn.click();
          }
        }
      });

      // Add keyboard accessibility
      visualContainer.setAttribute('tabindex', '0');
      visualContainer.setAttribute('role', 'button');
      visualContainer.setAttribute('aria-label', 'Start breathing session by clicking or pressing Enter');
      
      visualContainer.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isRunning) {
          e.preventDefault();
          if (startBtn && !startBtn.classList.contains('hidden')) {
            startBtn.click();
          }
        }
      });
    }

    let isRunning = false;
    let isPaused = false;
    let currentPhase = null;
    let phaseTimeout = null;
    let sessionStartTime = null;
    let totalSessionSeconds = 0;
    let sessionInterval = null;

    const BREATHING_PATTERN = {
      inhale: { duration: 4000, label: 'Inhale', count: 4 },
      hold: { duration: 2000, label: 'Hold', count: 2 },
      exhale: { duration: 6000, label: 'Exhale', count: 6 }
    };

    function updatePhase(phase) {
      if (!orb || !phaseIndicator) return;

      currentPhase = phase;
      const config = BREATHING_PATTERN[phase];

      orb.className = 'live-orbit-orb breathing ' + phase;
      phaseIndicator.className = 'live-orbit-phase-indicator active ' + phase;

      // Update visual container with phase class
      if (visualContainer) {
        visualContainer.className = 'live-orbit-visual-container phase-' + phase;
        if (isRunning) {
          visualContainer.setAttribute('aria-label', `Breathing: ${config.label} phase`);
        }
      }

      [inhaleLabel, holdLabel, exhaleLabel].forEach(label => {
        if (label) label.classList.remove('active');
      });

      if (phase === 'inhale' && inhaleLabel) {
        inhaleLabel.classList.add('active');
      } else if (phase === 'hold' && holdLabel) {
        holdLabel.classList.add('active');
      } else if (phase === 'exhale' && exhaleLabel) {
        exhaleLabel.classList.add('active');
      }

      // Add pulse effect to visual container on phase change
      if (visualContainer && isRunning) {
        visualContainer.style.animation = 'none';
        setTimeout(() => {
          visualContainer.style.animation = 'phasePulse 0.5s ease-out';
        }, 10);
      }

      if (isRunning && !isPaused) {
        phaseTimeout = setTimeout(() => {
          if (phase === 'inhale') {
            updatePhase('hold');
          } else if (phase === 'hold') {
            updatePhase('exhale');
          } else if (phase === 'exhale') {
            updatePhase('inhale');
          }
        }, config.duration);
      }
    }

    function startSession() {
      if (isRunning) return;

      isRunning = true;
      isPaused = false;
      sessionStartTime = Date.now();

      if (startBtn) startBtn.classList.add('hidden');
      if (pauseBtn) pauseBtn.classList.remove('hidden');
      if (stopBtn) stopBtn.classList.remove('hidden');
      if (resumeBtn) resumeBtn.classList.add('hidden');

      // Visual container enhancements
      if (visualContainer) {
        visualContainer.style.cursor = 'default';
        visualContainer.setAttribute('aria-label', 'Breathing session in progress');
        visualContainer.classList.add('breathing-active');
      }

      if (visualizerCard) {
        visualizerCard.classList.add('session-active');
      }

      updatePhase('inhale');

      sessionInterval = setInterval(() => {
        if (!isPaused) {
          totalSessionSeconds++;
          const minutes = Math.floor(totalSessionSeconds / 60);
          if (focusedMinutesEl) {
            focusedMinutesEl.textContent = minutes;
          }
        }
      }, 1000);
    }

    function pauseSession() {
      if (!isRunning || isPaused) return;

      isPaused = true;
      if (phaseTimeout) {
        clearTimeout(phaseTimeout);
        phaseTimeout = null;
      }

      if (pauseBtn) pauseBtn.classList.add('hidden');
      if (resumeBtn) resumeBtn.classList.remove('hidden');
      if (orb) orb.style.animationPlayState = 'paused';
      if (phaseIndicator) phaseIndicator.style.animationPlayState = 'paused';
    }

    function resumeSession() {
      if (!isRunning || !isPaused) return;

      isPaused = false;
      if (orb) orb.style.animationPlayState = 'running';
      if (phaseIndicator) phaseIndicator.style.animationPlayState = 'running';

      if (currentPhase) {
        const config = BREATHING_PATTERN[currentPhase];
        const elapsed = Date.now() - (sessionStartTime || Date.now());
        const remaining = Math.max(0, config.duration - (elapsed % config.duration));
        
        phaseTimeout = setTimeout(() => {
          if (currentPhase === 'inhale') {
            updatePhase('hold');
          } else if (currentPhase === 'hold') {
            updatePhase('exhale');
          } else if (currentPhase === 'exhale') {
            updatePhase('inhale');
          }
        }, remaining);
      }

      if (resumeBtn) resumeBtn.classList.add('hidden');
      if (pauseBtn) pauseBtn.classList.remove('hidden');
    }

    function stopSession() {
      isRunning = false;
      isPaused = false;

      if (phaseTimeout) {
        clearTimeout(phaseTimeout);
        phaseTimeout = null;
      }

      if (sessionInterval) {
        clearInterval(sessionInterval);
        sessionInterval = null;
      }

      if (orb) {
        orb.className = 'live-orbit-orb';
        orb.style.animationPlayState = '';
      }

      if (phaseIndicator) {
        phaseIndicator.className = 'live-orbit-phase-indicator';
        phaseIndicator.style.animationPlayState = '';
      }

      [inhaleLabel, holdLabel, exhaleLabel].forEach(label => {
        if (label) label.classList.remove('active');
      });

      // Reset visual container
      if (visualContainer) {
        visualContainer.style.cursor = 'pointer';
        visualContainer.setAttribute('aria-label', 'Start breathing session by clicking or pressing Enter');
        visualContainer.classList.remove('breathing-active');
      }

      if (visualizerCard) {
        visualizerCard.classList.remove('session-active');
      }

      if (startBtn) startBtn.classList.remove('hidden');
      if (pauseBtn) pauseBtn.classList.add('hidden');
      if (resumeBtn) resumeBtn.classList.add('hidden');
      if (stopBtn) stopBtn.classList.add('hidden');

      if (totalSessionSeconds >= 60 && typeof recordSession === 'function') {
        const minutes = Math.floor(totalSessionSeconds / 60);
        recordSession('evidence-orbit', minutes, 'index');
      }

      totalSessionSeconds = 0;
      currentPhase = null;
    }

    if (startBtn) startBtn.addEventListener('click', startSession);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseSession);
    if (resumeBtn) resumeBtn.addEventListener('click', resumeSession);
    if (stopBtn) stopBtn.addEventListener('click', stopSession);

    if (tryNarratedBtn) {
      tryNarratedBtn.addEventListener('click', () => {
        const quickStartBtn = document.getElementById('openQuickStart');
        if (quickStartBtn) {
          quickStartBtn.click();
        }
      });
    }

    if (focusedMinutesEl && typeof getProgressModule === 'function') {
      const progress = getProgressModule('index');
      if (progress && progress.today) {
        focusedMinutesEl.textContent = progress.today || 0;
      }
    }
  }
})();
