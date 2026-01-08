(function(){
  'use strict';

  const doc = document;
  const sessionEl = doc.getElementById('session');
  const startBtn = doc.getElementById('startBtn');
  if (!sessionEl || !startBtn) return;

  const get = id => doc.getElementById(id);

  const sections = {
    setup: get('setup') || doc.querySelector('.setup'),
    inst: get('inst'),
    done: get('done'),
    session: sessionEl
  };

  const controls = {
    in: get('inS'),
    hold1: get('h1S'),
    out: get('outS'),
    hold2: get('h2S'),
    minutes: get('minutes'),
    bpm: get('bpm'),
    tts: get('tts'),
    ttsVoice: get('ttsVoice'),
    ttsTest: get('ttsTest'),
    quickSelect: get('qsPreset'),
    quickStart: get('qsStart'),
    quickStop: get('qsStop'),
    pause: get('pauseBtn'),
    reset: get('resetBtn'),
    hardStop: get('hardStopBtn'),
    again: get('againBtn'),
    inst: get('instBtn'),
    beginFromInst: get('beginFromInst'),
    backSetup: get('backSetup'),
    adjust: get('adjustBtn'),
    focus: get('focus'),
    rm: get('rm'),
    vib: get('vib'),
    bg: get('bg'),
    bgv: get('bgv')
  };

  const displays = {
    ring: get('progressRing'),
    orb: get('orb'),
    phase: get('phase'),
    count: get('count'),
    idx: get('idx'),
    total: get('total'),
    doneMin: get('doneMin'),
    doneBreaths: get('doneBreaths'),
    doneStreak: get('doneStreak')
  };

  const tapArea = get('tapArea');
  const CIRC = 264;
  const root = window.__MSHARE__ || {};
  const Stats = root.Stats;
  const PAGE_ID = typeof root.pageId === 'string' ? root.pageId : '';

  let phases = [];
  let running = false;
  let paused = false;
  let rafId = 0;
  let currentPhase = null;
  let phaseStart = 0;
  let breathIndex = 1;
  let breathTotal = 0;
  let audioCtx = null;
  let ambience = null;

  // Focus screen (distraction-free fullscreen)
  let focusScreenActive = false;
  let focusRestore = null;
  let onEscKeydown = null;
  let inertRestore = null;

  const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  let ttsVoices = [];
  const TTS_VOICE_KEY = 'nb.tts.voice.v1';

  function detectTechId(){
    const name = (location.pathname || '').split('/').pop() || '';
    switch (name){
      case '4-7-8-breathing.html': return '478';
      case 'box-breathing.html': return 'box';
      case 'coherent-5-5.html': return 'coherent';
      case 'sos-60.html': return 'sos60';
      case 'sos.html': return 'sos';
      default: return name.replace(/\.html$/,'') || 'session';
    }
  }
  const TECH_ID = detectTechId();

  function setProgress(value){
    if (!displays.ring) return;
    const clamped = Math.max(0, Math.min(1, value || 0));
    displays.ring.style.strokeDashoffset = String(CIRC * (1 - clamped));
  }

  function updatePhaseUI(def){
    if (displays.phase) displays.phase.textContent = def.label;
    if (displays.orb){
      displays.orb.classList.remove('inhale', 'hold', 'exhale');
      if (def.key === 'out') displays.orb.classList.add('exhale');
      else if (def.key === 'hold1' || def.key === 'hold2') displays.orb.classList.add('hold');
      else displays.orb.classList.add('inhale');
    }
  }

  function updateCount(seconds){
    if (displays.count) displays.count.textContent = String(Math.ceil(Math.max(0, seconds)));
  }

  function show(view){
    if (sections.setup) sections.setup.classList.toggle('hidden', view !== 'setup');
    if (sections.inst) sections.inst.classList.toggle('hidden', view !== 'inst');
    if (sections.done) sections.done.classList.toggle('hidden', view !== 'done');
    sections.session.classList.toggle('hidden', view !== 'session');
  }

  function readNumber(input, fallback){
    if (!input) return fallback;
    const value = Number(input.value);
    return Number.isFinite(value) ? value : fallback;
  }

  function computePhases(){
    const result = [];
    const push = (key, label, input)=>{
      const seconds = Math.max(0, readNumber(input, 0));
      if ((key === 'hold1' || key === 'hold2') && seconds <= 0) return;
      result.push({ key, label, seconds });
    };
    push('in', 'Inhale', controls.in);
    push('hold1', 'Hold', controls.hold1);
    push('out', 'Exhale', controls.out);
    push('hold2', 'Hold', controls.hold2);
    if (!result.length) result.push({ key:'in', label:'Inhale', seconds:4 });
    return result;
  }

  function computeBreaths(){
    const minutes = Math.max(1, Math.round(readNumber(controls.minutes, 1)));
    const rate = Math.max(1, Math.round(readNumber(controls.bpm, 6)));
    return Math.max(1, minutes * rate);
  }

  function cycleDuration(){
    return phases.reduce((sum, phase)=>sum + phase.seconds, 0);
  }

  function resetDisplays(){
    setProgress(0);
    if (displays.phase) displays.phase.textContent = 'Inhale';
    if (displays.count) displays.count.textContent = '0';
    if (displays.idx) displays.idx.textContent = '1';
    if (displays.total) displays.total.textContent = '0';
    if (displays.orb){
      displays.orb.classList.remove('exhale');
      displays.orb.classList.add('inhale');
    }
  }

  function normalizeMinutes(value){
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return null;
    return Math.max(1, Math.round(number));
  }

  function ensureMinutesOption(value){
    if (!controls.minutes) return;
    const str = String(value);
    const options = Array.from(controls.minutes.options || []);
    if (options.some(option => option.value === str)) return;
    const option = doc.createElement('option');
    option.value = str;
    option.textContent = `${value} minute${value === 1 ? '' : 's'}`;
    controls.minutes.appendChild(option);
  }

  function applyMinutesValue(value){
    const normalized = normalizeMinutes(value);
    if (!normalized || !controls.minutes) return false;
    ensureMinutesOption(normalized);
    controls.minutes.value = String(normalized);
    return controls.minutes.value === String(normalized);
  }

  function updateMinutesQuery(value){
    const normalized = normalizeMinutes(value);
    if (!normalized) return;
    const params = new URLSearchParams(window.location.search);
    params.set('minutes', String(normalized));
    const query = params.toString();
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    try { window.history.replaceState(null, document.title, nextUrl); } catch { /* noop */ }
  }

  function initMinutesFromQuery(){
    const params = new URLSearchParams(window.location.search);
    const value = params.get('minutes');
    if (value) applyMinutesValue(value);
    if (params.get('focus') === '1' && controls.focus) controls.focus.value = 'on';
    if (params.get('tts') === 'on' && controls.tts) controls.tts.value = 'on';
  }

  function bindQuickMinutes(){
    const links = doc.querySelectorAll('#vp-tech-quick .actions a[data-minutes]');
    links.forEach(link => {
      link.addEventListener('click', evt => {
        if (evt.defaultPrevented || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey || evt.button !== 0) return;
        const dataValue = link.getAttribute('data-minutes');
        if (!applyMinutesValue(dataValue)) return;
        evt.preventDefault();
        updateMinutesQuery(dataValue);
        controls.minutes?.dispatchEvent(new Event('change', { bubbles:true }));
        try { controls.minutes?.focus({ preventScroll:true }); } catch { /* noop */ }
      });
    });
  }

  function clearTimer(){
    if (rafId){
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function applyFocus(active){
    const focusOn = active && controls.focus && controls.focus.value === 'on';
    document.body.classList.toggle('focus-mode', !!focusOn);
    if (focusOn) enterFocusScreen();
    else exitFocusScreen();
  }

  function ensureSessionFocusControls(){
    if (!sessionEl) return;
    if (document.getElementById('nb-session-focus-controls')) return;

    const wrap = doc.createElement('div');
    wrap.id = 'nb-session-focus-controls';
    wrap.className = 'nb-session-focus-controls';

    const exitBtn = doc.createElement('button');
    exitBtn.type = 'button';
    exitBtn.id = 'nb-session-exit-focus-btn';
    exitBtn.className = 'btn btn-secondary';
    exitBtn.textContent = 'Exit focus';
    exitBtn.setAttribute('aria-label', 'Exit focus screen');
    exitBtn.addEventListener('click', () => {
      if (controls.focus) controls.focus.value = 'off';
      applyFocus(running);
    });

    wrap.appendChild(exitBtn);
    // Prefer anchoring to the circle/tap area so it can sit on the orb edge
    // without covering the countdown.
    if (tapArea) tapArea.appendChild(wrap);
    else sessionEl.appendChild(wrap);
  }

  function enterFocusScreen(){
    if (focusScreenActive) return;
    if (!sessionEl || !document.body) return;

    focusScreenActive = true;
    document.body.classList.add('nb-focus-screen');

    // Move the session card to <body> so `position: fixed` is not constrained
    // by ancestor transforms (same pattern as breathing-games).
    if (!focusRestore && sessionEl.parentNode) {
      focusRestore = {
        parent: sessionEl.parentNode,
        nextSibling: sessionEl.nextSibling
      };
    }
    if (sessionEl.parentNode !== document.body) {
      document.body.appendChild(sessionEl);
    }
    sessionEl.classList.add('is-focus');

    // Make the rest of the page non-interactive while in focus screen.
    const main = doc.querySelector('main');
    if (main && !inertRestore) {
      inertRestore = {
        el: main,
        hadInert: main.hasAttribute('inert'),
        ariaHidden: main.getAttribute('aria-hidden')
      };
      try { main.setAttribute('inert', ''); } catch { /* noop */ }
      try { main.setAttribute('aria-hidden', 'true'); } catch { /* noop */ }
    }

    ensureSessionFocusControls();

    if (!onEscKeydown) {
      onEscKeydown = (e) => {
        if (e.key === 'Escape') {
          if (controls.focus) controls.focus.value = 'off';
          applyFocus(running);
        }
      };
      document.addEventListener('keydown', onEscKeydown, true);
    }

    const focusBtn = document.getElementById('nb-session-exit-focus-btn');
    if (focusBtn && typeof focusBtn.focus === 'function') {
      try { focusBtn.focus({ preventScroll: true }); } catch { /* noop */ }
    }
  }

  function exitFocusScreen(){
    if (!focusScreenActive) return;
    focusScreenActive = false;

    if (document.body) document.body.classList.remove('nb-focus-screen');
    if (sessionEl) sessionEl.classList.remove('is-focus');

    const controlsWrap = document.getElementById('nb-session-focus-controls');
    if (controlsWrap) controlsWrap.remove();

    if (onEscKeydown) {
      document.removeEventListener('keydown', onEscKeydown, true);
      onEscKeydown = null;
    }

    if (inertRestore && inertRestore.el) {
      const { el, hadInert, ariaHidden } = inertRestore;
      if (!hadInert) {
        try { el.removeAttribute('inert'); } catch { /* noop */ }
      }
      if (ariaHidden === null) {
        try { el.removeAttribute('aria-hidden'); } catch { /* noop */ }
      } else {
        try { el.setAttribute('aria-hidden', ariaHidden); } catch { /* noop */ }
      }
      inertRestore = null;
    }

    // Restore the session card back to where it came from.
    if (focusRestore && sessionEl) {
      const { parent, nextSibling } = focusRestore;
      if (parent) {
        if (nextSibling && nextSibling.parentNode === parent) {
          parent.insertBefore(sessionEl, nextSibling);
        } else {
          parent.appendChild(sessionEl);
        }
      }
      focusRestore = null;
    }
  }

  function applyMotionPreference(){
    const mode = controls.rm?.value || 'auto';
    const reduced = mode === 'on' || (mode === 'auto' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    document.body.classList.toggle('rm', reduced);
  }

  function ensureAudio(){
    if (!audioCtx){
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function loadTtsVoices(){
    if (!synth) return;
    try { ttsVoices = synth.getVoices() || []; }
    catch { ttsVoices = []; }
  }

  function savedVoiceId(){
    try { return localStorage.getItem(TTS_VOICE_KEY) || ''; } catch { return ''; }
  }

  function saveVoiceId(value){
    try { localStorage.setItem(TTS_VOICE_KEY, String(value || '')); } catch { /* noop */ }
  }

  function pickVoiceById(id){
    if (!id) return null;
    if (!ttsVoices.length) loadTtsVoices();
    if (!ttsVoices.length) return null;
    return ttsVoices.find(v => (v.voiceURI && v.voiceURI === id) || (v.name && v.name === id)) || null;
  }

  function populateVoiceSelect(){
    const select = controls.ttsVoice;
    if (!select || select.__nbPopulated) return;
    if (!ttsVoices.length) loadTtsVoices();

    select.innerHTML = '';
    const auto = doc.createElement('option');
    auto.value = '';
    auto.textContent = 'Auto voice';
    select.appendChild(auto);

    ttsVoices
      .filter(v => (v.lang || '').toLowerCase().startsWith('en'))
      .sort((a, b) => String(a.lang).localeCompare(String(b.lang)) || String(a.name).localeCompare(String(b.name)))
      .forEach(voice => {
        const opt = doc.createElement('option');
        opt.value = voice.voiceURI || voice.name || '';
        opt.textContent = `${voice.name || 'Voice'} (${voice.lang || 'en'})`;
        select.appendChild(opt);
      });

    const saved = savedVoiceId();
    if (saved){
      select.value = saved;
      if (select.value !== saved) select.value = '';
    }

    select.addEventListener('change', () => saveVoiceId(select.value));
    select.__nbPopulated = true;
  }

  function toggleVoiceTile(){
    const tile = controls.ttsVoice ? controls.ttsVoice.closest('.tile') : null;
    if (!tile) return;
    const on = controls.tts?.value === 'on';
    tile.style.display = on ? '' : 'none';
    if (controls.ttsTest) controls.ttsTest.style.display = on ? '' : 'none';
    if (on) populateVoiceSelect();
  }

  function speak(text){
    if (!text || controls.tts?.value !== 'on' || !synth) return;
    try{
      if (!ttsVoices.length) loadTtsVoices();
      const utterance = new SpeechSynthesisUtterance(String(text));
      const selected = pickVoiceById(controls.ttsVoice?.value || savedVoiceId());
      if (selected){
        utterance.voice = selected;
        utterance.lang = selected.lang || 'en-GB';
      } else {
        utterance.lang = 'en-GB';
      }
      const bpm = Number(controls.bpm?.value || 6);
      utterance.rate = Math.min(1.15, Math.max(0.85, bpm / 6));
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      try { synth.cancel(); } catch { /* noop */ }
      synth.speak(utterance);
    } catch {
      /* noop */
    }
  }

  function Background(ctx){
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = Math.max(0, Math.min(1, parseFloat(controls.bgv?.value || '0.2')));
    this.master.connect(ctx.destination);
    this.nodes = [];
  }

  Background.prototype.clear = function(){
    (this.nodes || []).forEach(node => {
      try { node.stop?.(); } catch {}
      try { node.disconnect?.(); } catch {}
    });
    this.nodes = [];
  };

  Background.prototype.setType = function(type){
    this.clear();
    if (type === 'cosmic') this.cosmic();
    else if (type === 'rain') this.rain();
  };

  Background.prototype.setVolume = function(value){
    const v = Math.max(0, Math.min(1, parseFloat(value || '0.2')));
    try { this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.08); }
    catch { this.master.gain.value = v; }
  };

  Background.prototype.cosmic = function(){
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = 0.12;
    g.connect(this.master);

    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    o1.type = 'sine';
    o2.type = 'sine';
    o1.frequency.value = 110;
    o2.frequency.value = 220;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 15;
    lfo.connect(lfoGain);
    lfoGain.connect(o1.frequency);

    o1.connect(g);
    o2.connect(g);

    [o1, o2, lfo].forEach(n => n.start());
    this.nodes.push(o1, o2, lfo, lfoGain, g);
  };

  Background.prototype.rain = function(){
    const ctx = this.ctx;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.55;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1200;

    const g = ctx.createGain();
    g.gain.value = 0.2;

    src.connect(lp);
    lp.connect(g);
    g.connect(this.master);
    src.start();

    this.nodes.push(src, lp, g);
  };

  function startAmbienceIfNeeded(){
    const type = controls.bg?.value || 'none';
    if (!controls.bg || type === 'none'){
      stopAmbience();
      return;
    }
    const ctx = ensureAudio();
    if (!ctx) return;
    ambience = ambience || new Background(ctx);
    ambience.setType(type);
    ambience.setVolume(controls.bgv?.value || '0.2');
  }

  function stopAmbience(){
    if (!ambience) return;
    try { ambience.clear(); } catch {}
    ambience = null;
  }

  function chime(){
    const ctx = ensureAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 440;
    gain.gain.value = 0.001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setTargetAtTime(0.18, now, 0.03);
    gain.gain.setTargetAtTime(0.0001, now + 0.5, 0.1);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  function vibrate(length){
    if (controls.vib?.value === 'on' && navigator.vibrate){
      try { navigator.vibrate(length); } catch { /* noop */ }
    }
  }

  function signalPhase(){
    if (!currentPhase) return;
    vibrate(currentPhase.key === 'out' ? 14 : 22);
    chime();
    speak(currentPhase.label);
  }

  function handleCycleComplete(){
    breathIndex += 1;
    if (breathIndex <= breathTotal){
      if (displays.idx) displays.idx.textContent = String(breathIndex);
      startPhase(0);
    } else {
      finishSession();
    }
  }

  function startPhase(index){
    currentPhase = phases[index];
    phaseStart = 0;
    updatePhaseUI(currentPhase);
    signalPhase();
    const seconds = currentPhase.seconds;
    if (seconds <= 0){
      updateCount(0);
      setProgress(1);
      const next = index + 1;
      if (next < phases.length) startPhase(next); else handleCycleComplete();
      return;
    }
    updateCount(seconds);
    setProgress(0);
    clearTimer();
    const tick = timestamp => {
      if (!running) return;
      if (!phaseStart) phaseStart = timestamp;
      if (paused){
        rafId = requestAnimationFrame(tick);
        return;
      }
      const elapsed = (timestamp - phaseStart) / 1000;
      const remain = seconds - elapsed;
      updateCount(Math.max(0, remain));
      setProgress(Math.min(1, elapsed / seconds));
      if (remain <= 0){
        setProgress(1);
        const next = index + 1;
        if (next < phases.length) startPhase(next); else handleCycleComplete();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  function startSession(){
    if (running) {
      running = false;
      clearTimer();
    }
    phases = computePhases();
    breathTotal = computeBreaths();
    breathIndex = 1;
    running = true;
    paused = false;
    document.body.classList.add('nb-session-running');
    applyMotionPreference();
    applyFocus(true);
    startAmbienceIfNeeded();
    show('session');
    if (displays.idx) displays.idx.textContent = '1';
    if (displays.total) displays.total.textContent = String(breathTotal);
    setProgress(0);
    startPhase(0);
    if (controls.pause) controls.pause.textContent = 'Pause';
  }

  function stopSession(scroll = true){
    running = false;
    paused = false;
    clearTimer();
    resetDisplays();
    document.body.classList.remove('nb-session-running');
    applyFocus(false);
    stopAmbience();
    show('setup');
    if (scroll && sections.setup){
      try { sections.setup.scrollIntoView({ behavior: 'smooth' }); } catch { /* noop */ }
    }
  }

  function finishSession(){
    running = false;
    paused = false;
    clearTimer();
    document.body.classList.remove('nb-session-running');
    applyFocus(false);
    stopAmbience();
    const perCycle = Math.max(1, cycleDuration());
    const totalSeconds = perCycle * Math.max(1, breathTotal);
  const stats = Stats?.addSession ? Stats.addSession({ techId: TECH_ID, seconds: totalSeconds, breaths: breathTotal, pageId: PAGE_ID }) : null;
    if (displays.doneMin) displays.doneMin.textContent = String(stats ? Math.round(stats.totalMinutesExact || stats.totalMinutes || totalSeconds / 60) : Math.round(totalSeconds / 60));
    if (displays.doneBreaths) displays.doneBreaths.textContent = String(stats ? stats.totalBreaths || breathTotal : breathTotal);
    if (displays.doneStreak) displays.doneStreak.textContent = String(stats ? stats.dayStreak || 0 : 0);
    show('done');
    if (sections.done){
      try { sections.done.scrollIntoView({ behavior: 'smooth' }); } catch { /* noop */ }
    }
  }

  function togglePause(){
    if (!running) return;
    paused = !paused;
    if (controls.pause) controls.pause.textContent = paused ? 'Resume' : 'Pause';
    // Keep focus mode active while paused; exit only on stop/finish or explicit "Exit focus".
    applyFocus(true);
    if (!paused){
      applyMotionPreference();
      signalPhase();
    }
  }

  initMinutesFromQuery();
  bindQuickMinutes();

  // Voice coach (optional)
  if (synth){
    try { synth.onvoiceschanged = () => { loadTtsVoices(); populateVoiceSelect(); }; } catch { /* noop */ }
  }
  controls.tts?.addEventListener('change', toggleVoiceTile);
  controls.ttsTest?.addEventListener('click', () => { toggleVoiceTile(); speak('Inhale'); });
  toggleVoiceTile();

  // Ambience (optional)
  controls.bg?.addEventListener('change', () => { if (running) startAmbienceIfNeeded(); });
  controls.bgv?.addEventListener('input', () => { if (ambience) ambience.setVolume(controls.bgv.value); });

  controls.focus?.addEventListener('change', () => applyFocus(running));

  controls.minutes?.addEventListener('change', ()=> updateMinutesQuery(controls.minutes.value));

  startBtn.addEventListener('click', startSession);
  controls.reset?.addEventListener('click', ()=> stopSession());
  controls.hardStop?.addEventListener('click', ()=> stopSession());
  controls.pause?.addEventListener('click', togglePause);
  controls.inst?.addEventListener('click', ()=> show('inst'));
  controls.beginFromInst?.addEventListener('click', startSession);
  controls.backSetup?.addEventListener('click', ()=> show('setup'));
  controls.again?.addEventListener('click', startSession);
  controls.adjust?.addEventListener('click', ()=> stopSession(false));
  tapArea?.addEventListener('click', togglePause);
  controls.quickStart?.addEventListener('click', ()=>{
    const parts = (controls.quickSelect?.value || '').split(',');
    const inputs = [controls.in, controls.hold1, controls.out, controls.hold2];
    inputs.forEach((input, idx)=>{
      if (input && parts[idx] !== undefined && parts[idx] !== '') input.value = parts[idx];
    });
    if (controls.minutes && parts[4] !== undefined && parts[4] !== '') controls.minutes.value = parts[4];
    if (controls.bpm && parts[5] !== undefined && parts[5] !== '') controls.bpm.value = parts[5];
    if (controls.tts && parts[6] !== undefined && parts[6] !== '') controls.tts.value = parts[6];
    if (controls.bg && parts[7] !== undefined && parts[7] !== '') controls.bg.value = parts[7];
    if (controls.bgv && parts[8] !== undefined && parts[8] !== '') controls.bgv.value = parts[8];
    if (controls.rm && parts[9] !== undefined && parts[9] !== '') controls.rm.value = parts[9];
    if (controls.focus && parts[10] !== undefined && parts[10] !== '') controls.focus.value = parts[10];
    controls.minutes?.dispatchEvent(new Event('change', { bubbles:true }));
    updateMinutesQuery(controls.minutes?.value);
    startSession();
  });
  controls.quickStop?.addEventListener('click', ()=> stopSession());

  document.addEventListener('keydown', evt=>{
    if (evt.code === 'Space'){
      if (!running) return;
      evt.preventDefault();
      togglePause();
    }
  });

  const form = sessionEl.closest('form');
  form?.addEventListener('submit', evt => evt.preventDefault());

  resetDisplays();
})();
