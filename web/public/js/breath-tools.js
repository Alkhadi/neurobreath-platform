(function(){
  'use strict';

  const doc = document;
  const CIRC = 264;

  function clamp01(value){
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(1, value));
  }

  function setRingProgress(ringEl, progress01){
    if (!ringEl) return;
    ringEl.style.strokeDashoffset = String(CIRC * (1 - clamp01(progress01)));
  }

  function setOrbPhaseClass(orbEl, phaseKey){
    if (!orbEl) return;
    orbEl.classList.remove('inhale', 'hold', 'exhale');
    if (phaseKey === 'out') orbEl.classList.add('exhale');
    else if (phaseKey === 'hold1' || phaseKey === 'hold2') orbEl.classList.add('hold');
    else orbEl.classList.add('inhale');
  }

  function parsePattern(value){
    if (typeof value !== 'string') return [4,4,4,4];
    const parts = value.split(',').map(n => Math.max(0, Number(n) || 0));
    while (parts.length < 4) parts.push(0);
    return parts.slice(0, 4);
  }

  function pickVoice(){
    const synth = window.speechSynthesis;
    if (!synth) return null;
    const voices = synth.getVoices ? synth.getVoices() : [];
    const preferred = voices.find(v => /en-GB/i.test(v.lang)) || voices.find(v => /en/i.test(v.lang)) || voices[0];
    return preferred || null;
  }

  function speak(text){
    const synth = window.speechSynthesis;
    if (!synth || !text) return;
    try{
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const voice = pickVoice();
      if (voice) utter.voice = voice;
      utter.rate = 1;
      utter.pitch = 1;
      synth.speak(utter);
    }catch(err){
      // Ignore TTS errors; keep the coach running.
    }
  }

  function createAmbience(){
    let audioCtx = null;
    let node = null;

    function ensureContext(){
      if (audioCtx) return audioCtx;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
      return audioCtx;
    }

    function stop(){
      if (node){
        try{ node.stop && node.stop(); }catch(err){}
        try{ node.disconnect && node.disconnect(); }catch(err){}
        node = null;
      }
      if (audioCtx){
        try{ audioCtx.close(); }catch(err){}
        audioCtx = null;
      }
    }

    function start(mode){
      stop();
      if (mode === 'none') return;

      const ctx = ensureContext();
      if (!ctx) return;
      if (ctx.state === 'suspended'){
        try{ ctx.resume(); }catch(err){}
      }

      const master = ctx.createGain();
      master.gain.value = 0.04;
      master.connect(ctx.destination);

      if (mode === 'cosmic'){
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.value = 0.65;

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 72;
        osc2.frequency.value = 144;

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(master);
        osc1.start();
        osc2.start();

        node = {
          stop(){ osc1.stop(); osc2.stop(); },
          disconnect(){ gain.disconnect(); }
        };
      }else if (mode === 'rain'){
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.35;

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;

        const gain = ctx.createGain();
        gain.gain.value = 0.85;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        source.start();

        node = source;
      }
    }

    return { start, stop };
  }

  function createCoach(opts){
    const {
      name,
      patternEl,
      minutesEl,
      ttsEl,
      bgEl,
      ringEl,
      orbWrapEl,
      orbEl,
      phaseEl,
      countEl,
      idxEl,
      totalEl,
      startBtn,
      stopBtn
    } = opts;

    if (!patternEl || !minutesEl || !ttsEl || !bgEl || !startBtn || !stopBtn) return null;

    let running = false;
    let paused = false;
    let rafId = 0;

    let phases = [];
    let phaseIndex = 0;
    let phaseStartMs = 0;
    let pausedAtMs = 0;

    let breathIndex = 0;
    let breathTotal = 0;
    let totalSeconds = 0;
    let sessionStartMs = 0;

    const ambience = createAmbience();

    function now(){
      return performance.now();
    }

    function buildPhases(pattern){
      const [inS, hold1S, outS, hold2S] = pattern;
      const list = [];
      if (inS > 0) list.push({ key: 'in', label: 'Inhale', seconds: inS });
      if (hold1S > 0) list.push({ key: 'hold1', label: 'Hold', seconds: hold1S });
      if (outS > 0) list.push({ key: 'out', label: 'Exhale', seconds: outS });
      if (hold2S > 0) list.push({ key: 'hold2', label: 'Hold', seconds: hold2S });
      return list.length ? list : [{ key: 'in', label: 'Breathe', seconds: 4 }];
    }

    function updateUI(phase, remainingSeconds, phaseProgress){
      if (phaseEl) phaseEl.textContent = phase.label;
      if (countEl) countEl.textContent = String(Math.ceil(Math.max(0, remainingSeconds)));
      setOrbPhaseClass(orbEl, phase.key);
      setRingProgress(ringEl, phaseProgress);
      if (idxEl) idxEl.textContent = String(breathIndex);
      if (totalEl) totalEl.textContent = String(breathTotal);
    }

    function finish(){
      stop();
    }

    function tick(){
      if (!running) return;
      if (paused){
        rafId = requestAnimationFrame(tick);
        return;
      }

      const t = now();
      const elapsedTotal = (t - sessionStartMs) / 1000;
      if (elapsedTotal >= totalSeconds){
        finish();
        return;
      }

      const phase = phases[phaseIndex];
      const phaseElapsed = (t - phaseStartMs) / 1000;

      if (phaseElapsed >= phase.seconds){
        // Advance
        phaseIndex += 1;
        if (phaseIndex >= phases.length){
          phaseIndex = 0;
          breathIndex += 1;
        }
        phaseStartMs = t;

        const nextPhase = phases[phaseIndex];
        if (ttsEl.value === 'on') speak(nextPhase.label);

        updateUI(nextPhase, nextPhase.seconds, 0);
        rafId = requestAnimationFrame(tick);
        return;
      }

      const remaining = Math.max(0, phase.seconds - phaseElapsed);
      const progress = phase.seconds > 0 ? phaseElapsed / phase.seconds : 1;
      updateUI(phase, remaining, progress);
      rafId = requestAnimationFrame(tick);
    }

    function start(){
      if (running) return;
      running = true;
      paused = false;

      const pattern = parsePattern(patternEl.value);
      phases = buildPhases(pattern);
      phaseIndex = 0;

      const cycleSeconds = phases.reduce((sum, p) => sum + p.seconds, 0) || 1;
      totalSeconds = Math.max(1, Math.round((Number(minutesEl.value) || 1) * 60));
      breathTotal = Math.max(1, Math.ceil(totalSeconds / cycleSeconds));
      breathIndex = 1;

      sessionStartMs = now();
      phaseStartMs = sessionStartMs;

      ambience.start(bgEl.value);

      const first = phases[0];
      if (ttsEl.value === 'on') speak(first.label);
      updateUI(first, first.seconds, 0);

      rafId = requestAnimationFrame(tick);
    }

    function stop(){
      if (!running) return;
      running = false;
      paused = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;

      ambience.stop();
      try{ window.speechSynthesis && window.speechSynthesis.cancel(); }catch(err){}

      if (phaseEl) phaseEl.textContent = 'Ready';
      if (countEl) countEl.textContent = '–';
      if (idxEl) idxEl.textContent = '0';
      if (totalEl) totalEl.textContent = '0';
      setOrbPhaseClass(orbEl, 'in');
      setRingProgress(ringEl, 0);
    }

    function togglePause(){
      if (!running) return;
      const t = now();
      if (!paused){
        paused = true;
        pausedAtMs = t;
        if (phaseEl) phaseEl.textContent = 'Paused';
        return;
      }

      // Resume, adjusting timers.
      const pauseMs = t - pausedAtMs;
      phaseStartMs += pauseMs;
      sessionStartMs += pauseMs;
      paused = false;
    }

    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);

    if (orbWrapEl){
      orbWrapEl.addEventListener('click', togglePause);
    }

    // Public for global key handler.
    return {
      name,
      isRunning(){ return running; },
      togglePause,
      stop
    };
  }

  function init(){
    const pb = createCoach({
      name: 'pb',
      patternEl: doc.getElementById('pbPattern'),
      minutesEl: doc.getElementById('pbMinutes'),
      ttsEl: doc.getElementById('pbTts'),
      bgEl: doc.getElementById('pbBg'),
      ringEl: doc.getElementById('pbRing'),
      orbWrapEl: doc.getElementById('pbOrb'),
      orbEl: doc.getElementById('pbOrbBall'),
      phaseEl: doc.getElementById('pbPhase'),
      countEl: doc.getElementById('pbCount'),
      idxEl: doc.getElementById('pbIdx'),
      totalEl: doc.getElementById('pbTotal'),
      startBtn: doc.getElementById('pbStart'),
      stopBtn: doc.getElementById('pbStop')
    });

    const nb = createCoach({
      name: 'nb',
      patternEl: doc.getElementById('nbPattern'),
      minutesEl: doc.getElementById('nbMinutes'),
      ttsEl: doc.getElementById('nbTts'),
      bgEl: doc.getElementById('nbBg'),
      ringEl: doc.getElementById('nbRing'),
      orbWrapEl: doc.getElementById('nbOrb'),
      orbEl: doc.getElementById('nbOrbBall'),
      phaseEl: doc.getElementById('nbPhase'),
      countEl: doc.getElementById('nbCount'),
      idxEl: doc.getElementById('nbIdx'),
      totalEl: doc.getElementById('nbTotal'),
      startBtn: doc.getElementById('nbStart'),
      stopBtn: doc.getElementById('nbStop')
    });

    doc.addEventListener('keydown', (e) => {
      if (e.code !== 'Space') return;
      const tag = (e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '');
      if (tag === 'input' || tag === 'select' || tag === 'textarea' || e.target && e.target.isContentEditable) return;

      if (pb && pb.isRunning()){
        e.preventDefault();
        pb.togglePause();
      }else if (nb && nb.isRunning()){
        e.preventDefault();
        nb.togglePause();
      }
    });

    // Stop any running coach on page hide.
    window.addEventListener('pagehide', () => {
      try{ pb && pb.stop(); }catch(err){}
      try{ nb && nb.stop(); }catch(err){}
    });

    // Prime speechSynthesis voices (some browsers need an early call).
    try{ window.speechSynthesis && window.speechSynthesis.getVoices && window.speechSynthesis.getVoices(); }catch(err){}
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
