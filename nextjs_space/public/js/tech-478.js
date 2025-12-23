(function(){
  'use strict';

  const doc = document;
  const $ = id => doc.getElementById(id);

  const inS = $('inS');
  const h1S = $('h1S');
  const outS = $('outS');
  const h2S = $('h2S');
  const minutes = $('minutes');
  const bpm = $('bpm');
  const tts = $('tts');
  const ttsVoice = $('ttsVoice');
  const ttsTest = $('ttsTest');
  const vib = $('vib');
  const bg = $('bg');
  const bgv = $('bgv');
  const rm = $('rm');
  const focus = $('focus');
  const qsPreset = $('qsPreset');
  const qsStart = $('qsStart');
  const qsStop = $('qsStop');
  const startBtn = $('startBtn');
  const instBtn = $('instBtn');
  const resetBtn = $('resetBtn');
  const beginFromInst = $('beginFromInst');
  const backSetup = $('backSetup');
  const pauseBtn = $('pauseBtn');
  const adjustBtn = $('adjustBtn');
  const hardStopBtn = $('hardStopBtn');
  const againBtn = $('againBtn');
  const tapArea = $('tapArea');
  const progressRing = $('progressRing');
  const orb = $('orb');
  const phaseEl = $('phase');
  const countEl = $('count');
  const idxEl = $('idx');
  const totalEl = $('total');
  const doneMin = $('doneMin');
  const doneBreaths = $('doneBreaths');
  const doneStreak = $('doneStreak');
  const setupSection = $('setup');
  const instSection = $('inst');
  const sessionSection = $('session');
  const doneSection = $('done');
  const TECH_ID = '478';

  const heroSection = $('tech-hero');
  const heroStartBtn = $('vaStart');
  const heroPauseBtn = $('vaPause');
  const heroResumeBtn = $('vaResume');
  const heroStopBtn = $('vaStop');
  const heroSynth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  let heroVoices = [];
  let heroUtterance = null;
  const heroNarrationState = { isReading:false, isPaused:false };
  const VoicePrefs = window.NeurobreathVoicePreferences || null;

  function normalizeHeroProfile(value){
    if (value === 'female') return 'female';
    if (value === 'male') return 'male';
    return 'uk-male';
  }

  let heroVoiceProfile = normalizeHeroProfile(
    (VoicePrefs && typeof VoicePrefs.get === 'function' && VoicePrefs.get()) ||
    (VoicePrefs && typeof VoicePrefs.getDefault === 'function' && VoicePrefs.getDefault()) ||
    'uk-male'
  );

  const heroMaleHints = [/google uk english male/i, /microsoft george/i, /microsoft ryan/i, /microsoft guy/i, /daniel/i, /brian/i, /arthur/i, /matthew/i];
  const heroFemaleHints = [/female/i, /hazel/i, /sonia/i, /libby/i, /serena/i, /kate/i, /victoria/i, /emma/i, /samantha/i];

  if (VoicePrefs && typeof VoicePrefs.subscribe === 'function'){
    VoicePrefs.subscribe(value => {
      heroVoiceProfile = normalizeHeroProfile(value);
      if (heroNarrationState.isReading) stopHeroNarration();
    });
  }

  function loadHeroVoices(){
    if (!heroSynth) return;
    try { heroVoices = heroSynth.getVoices(); }
    catch { heroVoices = []; }
  }

  function cleanHeroText(text){
    if (!text) return '';
    return text
      .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[▾▴•■▶⏸◆●‹›]/g, '')
      .replace(/[—–]/g, '-')
      .replace(/\s+/g, ' ')
      .replace(/&amp;/g, 'and')
      .trim();
  }

  function getHeroNarrationText(){
    if (!heroSection) return '';
    const parts = [];
    heroSection.querySelectorAll('h1, p').forEach(node => {
      const text = cleanHeroText(node.textContent || '');
      if (text) parts.push(text);
    });
    return parts.join('. ');
  }

  function pickHeroVoice(){
    if (!heroSynth) return null;
    if (!heroVoices.length) loadHeroVoices();
    if (!heroVoices.length) return null;
    const gender = heroVoiceProfile === 'female' ? 'female' : 'male';
    const preferGb = heroVoiceProfile !== 'male';
    const hints = gender === 'female' ? heroFemaleHints : heroMaleHints;
    const lowerLang = voice => (voice.lang || '').toLowerCase();

    if (preferGb){
      const gbList = heroVoices.filter(v => lowerLang(v).startsWith('en-gb'));
      const gbHit = gbList.find(v => hints.some(pattern => pattern.test(v.name)));
      if (gbHit) return gbHit;
      if (gbList[0]) return gbList[0];
    }

    const enVoices = heroVoices.filter(v => /^en-/i.test(v.lang || ''));
    const enHit = enVoices.find(v => hints.some(pattern => pattern.test(v.name)));
    if (enHit) return enHit;
    if (enVoices[0]) return enVoices[0];

    const anyHit = heroVoices.find(v => hints.some(pattern => pattern.test(v.name)));
    if (anyHit) return anyHit;
    return heroVoices[0] || null;
  }

  function updateHeroButtons(){
    if (!heroStartBtn) return;
    heroStartBtn.disabled = heroNarrationState.isReading;
    if (heroPauseBtn) heroPauseBtn.disabled = !heroNarrationState.isReading || heroNarrationState.isPaused;
    if (heroResumeBtn) heroResumeBtn.disabled = !heroNarrationState.isReading || !heroNarrationState.isPaused;
    if (heroStopBtn) heroStopBtn.disabled = !heroNarrationState.isReading;
  }

  function stopHeroNarration(){
    if (!heroSynth) return;
    try { heroSynth.cancel(); } catch {}
    heroUtterance = null;
    heroNarrationState.isReading = false;
    heroNarrationState.isPaused = false;
    updateHeroButtons();
  }

  function startHeroNarration(){
    if (!heroSynth || !heroSection) return;
    const text = getHeroNarrationText();
    if (!text) return;
    stopHeroNarration();
    heroUtterance = new SpeechSynthesisUtterance(text);
    const voice = pickHeroVoice();
    if (voice){
      heroUtterance.voice = voice;
      heroUtterance.lang = voice.lang || 'en-GB';
    } else {
      heroUtterance.lang = 'en-GB';
    }
    heroUtterance.rate = 0.95;
    heroUtterance.pitch = heroVoiceProfile === 'female' ? 1.08 : 0.95;
    heroUtterance.volume = 1.0;
    heroUtterance.onstart = () => {
      heroNarrationState.isReading = true;
      heroNarrationState.isPaused = false;
      updateHeroButtons();
    };
    heroUtterance.onend = () => {
      heroNarrationState.isReading = false;
      heroNarrationState.isPaused = false;
      heroUtterance = null;
      updateHeroButtons();
    };
    heroUtterance.onerror = () => {
      heroNarrationState.isReading = false;
      heroNarrationState.isPaused = false;
      heroUtterance = null;
      updateHeroButtons();
    };
    try { heroSynth.speak(heroUtterance); }
    catch(err){ console.warn('Unable to start narration', err); }
  }

  function heroScrollTo(target, hash){
    if (!target) return;
    try { target.scrollIntoView({ behavior:'smooth', block:'start' }); }
    catch { target.scrollIntoView(); }
    if (!hash) return;
    try {
      const url = new URL(window.location.href);
      url.hash = hash;
      window.history.replaceState(null, document.title, url.toString());
    }catch{
      try { window.location.hash = hash; } catch {}
    }
  }

  if (!inS || !progressRing || !orb || !phaseEl) return;

  const root = window.__MSHARE__ || {};
  const Stats = root.Stats;
  const PAGE_ID = typeof root.pageId === 'string' ? root.pageId : '';
  const CIRC = 264;

  function normalizeMinutes(value){
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return null;
    return Math.max(1, Math.round(number));
  }

  function ensureMinutesOption(value){
    if (!minutes) return;
    const str = String(value);
    const options = Array.from(minutes.options || []);
    if (options.some(option => option.value === str)) return;
    const option = doc.createElement('option');
    option.value = str;
    option.textContent = `${value} minute${value === 1 ? '' : 's'}`;
    minutes.appendChild(option);
  }

  function applyMinutesValue(value){
    const normalized = normalizeMinutes(value);
    if (!normalized || !minutes) return false;
    ensureMinutesOption(normalized);
    minutes.value = String(normalized);
    return minutes.value === String(normalized);
  }

  function updateMinutesQuery(value){
    const normalized = normalizeMinutes(value);
    if (!normalized) return;
    const params = new URLSearchParams(window.location.search);
    params.set('minutes', String(normalized));
    const query = params.toString();
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    try { window.history.replaceState(null, document.title, nextUrl); } catch {}
  }

  function initMinutesFromQuery(){
    const params = new URLSearchParams(window.location.search);
    const value = params.get('minutes');
    if (value) applyMinutesValue(value);
    if (params.get('focus') === '1' && focus) focus.value = 'on';
    if (params.get('tts') === 'on' && tts) tts.value = 'on';
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
        minutes?.dispatchEvent(new Event('change', { bubbles:true }));
        try { minutes?.focus({ preventScroll:true }); } catch {}
      });
    });
  }

  const ttsTile = ttsVoice ? ttsVoice.closest('.tile') : null;
  function toggleVoiceTile(){
    if (!ttsTile) return;
    const on = tts?.value === 'on';
    ttsTile.style.display = on ? '' : 'none';
    if (ttsTest) ttsTest.style.display = on ? '' : 'none';
  }
  tts?.addEventListener('change', toggleVoiceTile);
  toggleVoiceTile();

  if (window.MS_TTS){
    window.MS_TTS.connectUI(ttsVoice, ttsTest);
  } else {
    if (ttsVoice) ttsVoice.style.display = 'none';
    if (ttsTest) ttsTest.style.display = 'none';
  }

  let audioCtx = null;
  function ensureAudio(){
    if (!audioCtx){
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playChime(volume){
    const ctx = ensureAudio();
    if (!ctx) return;
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    gain.gain.value = 0;
    osc.type = 'sine';
    osc.frequency.value = 528;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc.start(now);
    osc.stop(now + 1.25);
  }

  function vibrateDevice(ms){
    if (vib?.value === 'on' && navigator.vibrate){
      try{ navigator.vibrate(ms); }catch{}
    }
  }

  function speak(text){
    if (!text || tts?.value !== 'on' || !window.MS_TTS) return;
    try{
      const rate = Math.min(1.3, Math.max(0.7, (parseFloat(bpm?.value || '5') / 6)));
      window.MS_TTS.speak(text, { rate, selectEl: ttsVoice });
    }catch{}
  }

  class Background {
    constructor(ctx){
      this.ctx = ctx;
      this.master = ctx.createGain();
      this.master.gain.value = parseFloat(bgv?.value || '0.2');
      this.master.connect(ctx.destination);
      this.nodes = [];
    }
    clear(){
      this.nodes.forEach(node=>{
        try{ node.stop?.(); node.disconnect?.(); }catch{}
      });
      this.nodes = [];
    }
    setType(type){
      this.clear();
      if (type === 'cosmic') this.#cosmic();
      else if (type === 'rain') this.#rain();
    }
    setVolume(value){
      if (!this.ctx) return;
      this.master.gain.setTargetAtTime(parseFloat(value || '0.2'), this.ctx.currentTime, 0.1);
    }
    stop(){ this.clear(); }
    #cosmic(){
      const ctx = this.ctx;
      const g = ctx.createGain();
      g.gain.value = 0.12;
      g.connect(this.master);
      const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 110;
      const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 220;
      const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.05;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 15;
      lfo.connect(lfoGain);
      lfoGain.connect(o1.frequency);
      o1.connect(g); o2.connect(g);
      [o1, o2, lfo].forEach(node=>{ node.start(); this.nodes.push(node); });
      this.nodes.push(g, lfoGain);
    }
    #rain(){
      const ctx = this.ctx;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.55;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      const gain = ctx.createGain();
      gain.gain.value = 0.2;
      src.connect(filter).connect(gain).connect(this.master);
      src.start();
      this.nodes.push(src, filter, gain);
    }
  }
  let bgm = null;

  function isReducedMotion(){
    if (rm?.value === 'on') return true;
    if (rm?.value === 'off') return false;
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    return mq ? mq.matches : false;
  }
  function updateMotionMode(){
    document.body.classList.toggle('rm', isReducedMotion());
  }
  rm?.addEventListener('change', updateMotionMode);

  function applyFocusMode(on){
    document.body.classList.toggle('focus-mode', !!on);
  }

  function showSetup(){
    setupSection?.classList.remove('hidden');
    instSection?.classList.add('hidden');
    sessionSection?.classList.add('hidden');
    doneSection?.classList.add('hidden');
    applyFocusMode(false);
  }
  function showInstructions(){
    setupSection?.classList.add('hidden');
    instSection?.classList.remove('hidden');
    sessionSection?.classList.add('hidden');
    doneSection?.classList.add('hidden');
    applyFocusMode(false);
  }
  function showSession(){
    setupSection?.classList.add('hidden');
    instSection?.classList.add('hidden');
    sessionSection?.classList.remove('hidden');
    doneSection?.classList.add('hidden');
  }
  function showDone(){
    setupSection?.classList.add('hidden');
    instSection?.classList.add('hidden');
    sessionSection?.classList.add('hidden');
    doneSection?.classList.remove('hidden');
    applyFocusMode(false);
  }

  let running = false;
  let paused = false;
  let timerId = 0;
  let breathIdx = 1;
  let breathTotal = 0;
  let cycleDurations = { in:4, h1:7, out:8, h2:0 };

  function stopAnimation(){
    if (timerId) cancelAnimationFrame(timerId);
    timerId = 0;
  }
  function resetDisplay(){
    phaseEl.textContent = 'Inhale';
    countEl.textContent = '4';
    idxEl.textContent = '1';
    totalEl.textContent = '0';
    orb.classList.remove('exhale');
    orb.classList.add('inhale');
    setProgress(0);
  }

  function setProgress(value){
    const clamped = Math.max(0, Math.min(1, value || 0));
    progressRing.style.strokeDashoffset = String(CIRC * (1 - clamped));
  }

  function enterPhase(label, seconds, onComplete){
    const labelMap = { in:'Inhale', h1:'Hold', out:'Exhale', h2:'Hold' };
    phaseEl.textContent = labelMap[label] || 'Inhale';
    if (timerId) cancelAnimationFrame(timerId);
    timerId = 0;
    orb.classList.toggle('exhale', label === 'out');
    orb.classList.toggle('inhale', label !== 'out');
    setProgress(0);
    speak(phaseEl.textContent);
    vibrateDevice(label === 'out' ? 18 : 28);
    const chimeGain = Math.max(0.18, parseFloat(bgv?.value || '0.2') * (label === 'out' ? 1.1 : 0.9));
    playChime(chimeGain);

    if (seconds <= 0){
      countEl.textContent = '0';
      setProgress(1);
      onComplete();
      return;
    }

    countEl.textContent = String(Math.ceil(seconds));
    const start = performance.now();
    const tick = now => {
      if (!running){ timerId = 0; return; }
      if (paused){ timerId = requestAnimationFrame(tick); return; }
      const elapsed = (now - start) / 1000;
      const remain = Math.max(0, seconds - elapsed);
      const ratio = Math.min(1, elapsed / seconds);
      setProgress(ratio);
      countEl.textContent = String(Math.ceil(remain));
      if (remain <= 0){
        setProgress(1);
        timerId = 0;
        onComplete();
        return;
      }
      timerId = requestAnimationFrame(tick);
    };

    timerId = requestAnimationFrame(tick);
  }

  function advanceCycle(){
    enterPhase('in', cycleDurations.in, ()=>
      enterPhase('h1', cycleDurations.h1, ()=>
        enterPhase('out', cycleDurations.out, ()=>
          enterPhase('h2', cycleDurations.h2, ()=>{
            breathIdx += 1;
            if (breathIdx <= breathTotal){
              idxEl.textContent = String(breathIdx);
              setProgress(0);
              advanceCycle();
            } else {
              finishSession();
            }
          })
        )
      )
    );
  }

  function startSession(){
    stopHeroNarration();
    const ctx = ensureAudio();
    cycleDurations = {
      in: Math.max(0, Number(inS?.value) || 4),
      h1: Math.max(0, Number(h1S?.value) || 7),
      out: Math.max(0, Number(outS?.value) || 8),
      h2: Math.max(0, Number(h2S?.value) || 0)
    };
    const totalMinutes = Math.max(1, Math.round(Number(minutes?.value) || 3));
    const rate = Math.min(8, Math.max(3, Number(bpm?.value) || 5));
    breathTotal = Math.max(1, Math.round(totalMinutes * rate));
    breathIdx = 1;
    idxEl.textContent = '1';
    totalEl.textContent = String(breathTotal);
    setProgress(0);
    countEl.textContent = String(Math.ceil(cycleDurations.in));
    running = true;
    paused = false;
    pauseBtn.textContent = 'Pause';
    updateMotionMode();
    if (focus?.value === 'on') applyFocusMode(true);
    if (ctx && bg?.value !== 'none'){
      bgm = bgm || new Background(ctx);
      bgm.setType(bg.value);
      bgm.setVolume(bgv?.value || '0.2');
    }
    showSession();
    advanceCycle();
  }

  function pauseSession(){
    if (!running) return;
    paused = !paused;
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    if (paused){
      applyFocusMode(false);
    } else {
      updateMotionMode();
      applyFocusMode(focus?.value === 'on');
    }
  }

  function stopSession(show){
    if (bgm){ bgm.stop(); bgm = null; }
    stopAnimation();
    running = false;
    paused = false;
    pauseBtn.textContent = 'Pause';
    resetDisplay();
    if (show !== false){
      showSetup();
      try{ setupSection?.scrollIntoView({ behavior:'smooth' }); }
      catch{}
    }
  }

  function finishSession(){
    stopAnimation();
    running = false;
    paused = false;
    if (bgm){ bgm.stop(); bgm = null; }
    const secondsPerBreath = cycleDurations.in + cycleDurations.h1 + cycleDurations.out + cycleDurations.h2;
    const totalSeconds = secondsPerBreath * breathTotal;
  const stats = Stats?.addSession ? Stats.addSession({ techId: TECH_ID, seconds: totalSeconds, breaths: breathTotal, pageId: PAGE_ID }) : null;
    if (doneMin) doneMin.textContent = String(stats ? Math.floor(stats.totalMinutes || 0) : Math.floor(totalSeconds / 60));
    if (doneBreaths) doneBreaths.textContent = String(stats ? stats.totalBreaths || breathTotal : breathTotal);
    if (doneStreak) doneStreak.textContent = String(stats ? stats.dayStreak || 0 : 0);
    showDone();
  }

  function applyPreset(){
    const value = (qsPreset?.value || '').split(',');
    if (value.length < 11) return;
    [inS.value, h1S.value, outS.value, h2S.value] = value.slice(0, 4);
    minutes.value = value[4] || minutes.value;
    bpm.value = value[5] || bpm.value;
    tts.value = value[6] || tts.value;
    bg.value = value[7] || bg.value;
    bgv.value = value[8] || bgv.value;
    rm.value = value[9] || rm.value;
    focus.value = value[10] || focus.value;
    minutes?.dispatchEvent(new Event('change', { bubbles:true }));
    toggleVoiceTile();
  }

  qsStart?.addEventListener('click', ()=>{
    applyPreset();
    updateMinutesQuery(minutes?.value);
    startSession();
  });
  qsStop?.addEventListener('click', ()=>stopSession(true));

  startBtn?.addEventListener('click', startSession);
  instBtn?.addEventListener('click', showInstructions);
  resetBtn?.addEventListener('click', ()=>stopSession(true));
  beginFromInst?.addEventListener('click', startSession);
  backSetup?.addEventListener('click', showSetup);
  pauseBtn?.addEventListener('click', pauseSession);
  hardStopBtn?.addEventListener('click', ()=>stopSession(true));
  adjustBtn?.addEventListener('click', ()=>stopSession(true));
  againBtn?.addEventListener('click', ()=>{
    showSetup();
    startSession();
  });
  tapArea?.addEventListener('click', pauseSession);
  doc.addEventListener('keydown', evt=>{
    if (evt.code === 'Space'){
      evt.preventDefault();
      pauseSession();
    }
  });

  if (heroSynth){
    loadHeroVoices();
    if (typeof heroSynth.addEventListener === 'function'){
      heroSynth.addEventListener('voiceschanged', loadHeroVoices);
    }
  }
  if (!heroSynth){
    [heroStartBtn, heroPauseBtn, heroResumeBtn, heroStopBtn].forEach(btn => {
      if (!btn) return;
      btn.disabled = true;
      btn.title = 'Narration is unavailable in this browser.';
    });
  } else {
    updateHeroButtons();
  }

  heroStartBtn?.addEventListener('click', startHeroNarration);
  heroPauseBtn?.addEventListener('click', () => {
    if (!heroSynth || !heroNarrationState.isReading || heroNarrationState.isPaused) return;
    try { heroSynth.pause(); } catch {}
    heroNarrationState.isPaused = true;
    updateHeroButtons();
  });
  heroResumeBtn?.addEventListener('click', () => {
    if (!heroSynth || !heroNarrationState.isReading || !heroNarrationState.isPaused) return;
    try { heroSynth.resume(); } catch {}
    heroNarrationState.isPaused = false;
    updateHeroButtons();
  });
  heroStopBtn?.addEventListener('click', stopHeroNarration);

  if (heroSection){
    const goSetupLink = heroSection.querySelector('a[href="#setup"]');
    const instructionsLink = heroSection.querySelector('a[href="#technique-instruction"]');
    const sessionLink = heroSection.querySelector('a[href="#session"]');
    goSetupLink?.addEventListener('click', evt => {
      evt.preventDefault();
      stopHeroNarration();
      showSetup();
      heroScrollTo(setupSection, 'setup');
    });
    instructionsLink?.addEventListener('click', evt => {
      evt.preventDefault();
      stopHeroNarration();
      showInstructions();
      heroScrollTo(instSection, 'technique-instruction');
    });
    sessionLink?.addEventListener('click', evt => {
      evt.preventDefault();
      stopHeroNarration();
      showSession();
      heroScrollTo(sessionSection, 'session');
    });
  }

  bg?.addEventListener('change', ()=>{
    if (!bgm) return;
    bgm.setType(bg.value);
  });
  bgv?.addEventListener('input', ()=>{
    if (!bgm) return;
    bgm.setVolume(bgv.value);
  });
  focus?.addEventListener('change', ()=>{
    if (!running) applyFocusMode(focus.value === 'on');
  });

  initMinutesFromQuery();
  bindQuickMinutes();
  minutes?.addEventListener('change', ()=> updateMinutesQuery(minutes.value));
  toggleVoiceTile();
  updateMotionMode();
})();
