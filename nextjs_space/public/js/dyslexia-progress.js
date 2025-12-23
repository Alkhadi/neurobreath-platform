'use strict';

(function(){
  const doc = document;
  if (!doc) return;

  const startBtn = doc.getElementById('mpl-dyslexia-start');
  const stopBtn = doc.getElementById('mpl-dyslexia-stop');
  if (!startBtn || !stopBtn) return;

  const storageKey = 'mpl.progress.dyslexia';
  const sessionCount = doc.getElementById('mpl-dyslexia-sess');
  const minuteCount = doc.getElementById('mpl-dyslexia-mins');
  const lastUsed = doc.getElementById('mpl-dyslexia-last');
  const timerLabel = doc.getElementById('mpl-dyslexia-timer');

  const overlay = doc.getElementById('mpl-technique-overlay');
  const techniqueDialog = overlay ? overlay.querySelector('[data-technique-dialog]') : null;
  const techniqueButtons = overlay ? Array.from(overlay.querySelectorAll('[data-tech-option]')) : [];
  const confirmTechnique = overlay ? overlay.querySelector('[data-confirm-technique]') : null;
  const cancelTechnique = overlay ? overlay.querySelector('[data-dismiss="dialog"]') : null;

  const voiceSelect = doc.getElementById('voice-gender');
  const ttsStartBtn = overlay ? overlay.querySelector('[data-tts-start]') : null;
  const ttsStopBtn = overlay ? overlay.querySelector('[data-tts-stop]') : null;
  const ttsTestBtn = overlay ? overlay.querySelector('[data-tts-test]') : null;
  const voiceStatus = doc.getElementById('voice-status');
  const femaleAudio = doc.getElementById('tts-female-audio');
  const maleAudio = doc.getElementById('tts-male-audio');

  const player = doc.getElementById('mpl-technique-player');
  const viz = doc.getElementById('mpl-player-viz');
  const playerTitle = doc.getElementById('mpl-player-title');
  const phaseLabel = doc.getElementById('mpl-player-phase');
  const progressBar = doc.getElementById('mpl-player-progress');
  const toggleBtn = player ? player.querySelector('[data-action="toggle"]') : null;
  const stopBtnPlayer = player ? player.querySelector('[data-action="stop"]') : null;
  const restartBtn = player ? player.querySelector('[data-action="restart"]') : null;
  const backBtn = player ? player.querySelector('[data-action="back"]') : null;
  const durationSelect = doc.getElementById('mpl-player-duration');
  const legendContainer = doc.getElementById('mpl-player-legend');

  const defaults = { sessions: 0, minutes: 0, last: null, lastTechnique: null };
  let state = loadState();

  let selectingTechnique = false;
  let previousOverflow = '';
  let selectedTechnique = state.lastTechnique || '478';
  let currentTechnique = null;
  let sessionActive = false;
  let sessionRunning = false;
  let elapsedMs = 0;
  let phaseElapsedMs = 0;
  let phaseIndex = 0;
  let sessionDurationMs = (parseInt(durationSelect?.value || '300', 10) || 300) * 1000;
  let lastTick = null;
  let rafId = 0;
  let timerId = 0;
  let engine = null;
  let lastPhaseName = 'Inhale';
  let overallSessionProgress = 0;

  const supportsTTS = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const cueCache = { female: {}, male: {} };
  const VoicePrefs = window.NeurobreathVoicePreferences || null;
  const narratorButtons = Array.from(doc.querySelectorAll('.dlx-card-narrate'));
  const letterChips = Array.from(doc.querySelectorAll('[data-letter-say]'));
  let activeCardNarration = null;

  function normalizeVoiceProfile(value){
    if (value === 'female') return 'female';
    if (value === 'male') return 'male';
    return 'uk-male';
  }

  let currentVoiceProfile = normalizeVoiceProfile(
    (VoicePrefs && typeof VoicePrefs.get === 'function' && VoicePrefs.get()) ||
    (VoicePrefs && typeof VoicePrefs.getDefault === 'function' && VoicePrefs.getDefault()) ||
    'uk-male'
  );

  function profileToGender(profile){
    return profile === 'female' ? 'female' : 'male';
  }

  function persistVoiceProfile(profile){
    const normalized = normalizeVoiceProfile(profile);
    currentVoiceProfile = normalized;
    if (VoicePrefs && typeof VoicePrefs.set === 'function'){
      VoicePrefs.set(normalized);
    }
    return normalized;
  }

  function getActiveVoiceProfile(){
    const manual = voiceSelect?.value;
    return normalizeVoiceProfile(manual || currentVoiceProfile);
  }

  function syncVoiceSelect(){
    if (!voiceSelect) return;
    const desired = currentVoiceProfile === 'female' ? 'female' : 'uk-male';
    if (voiceSelect.value !== desired){
      voiceSelect.value = desired;
    }
  }

  if (voiceSelect){
    syncVoiceSelect();
    voiceSelect.addEventListener('change', () => {
      persistVoiceProfile(voiceSelect.value);
      refreshVoiceStatus();
    });
  }

  if (VoicePrefs && typeof VoicePrefs.subscribe === 'function'){
    VoicePrefs.subscribe(value => {
      currentVoiceProfile = normalizeVoiceProfile(value);
      syncVoiceSelect();
      refreshVoiceStatus();
    });
  }

  const techniques = {
    box: {
      title: 'Box breathing (4-4-4-4)',
      phases: [ ['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Hold', 4] ],
      setup(svg){
        svg.innerHTML = '';
        const frame = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frame.setAttribute('x', -70);
        frame.setAttribute('y', -70);
        frame.setAttribute('width', 140);
        frame.setAttribute('height', 140);
        frame.setAttribute('rx', 10);
        frame.setAttribute('fill', 'none');
        frame.setAttribute('stroke', '#94a3b8');
        frame.setAttribute('stroke-width', 3);
        svg.appendChild(frame);

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', 6);
        dot.setAttribute('fill', '#10b981');
        svg.appendChild(dot);

        addText(svg, -80, -80, 'Inhale');
        addText(svg, 80, -80, 'Hold');
        addText(svg, 80, 90, 'Exhale');
        addText(svg, -80, 90, 'Hold');

        return {
          update(phaseName, tNorm){
            let x = -70;
            let y = -70;
            if (phaseName === 'Inhale'){
              x = -70 + 140 * tNorm;
              y = -70;
              dot.setAttribute('fill', '#10b981');
            } else if (phaseName === 'Hold' && lastPhaseName === 'Inhale'){
              x = 70;
              y = -70;
              dot.setAttribute('fill', '#f59e0b');
            } else if (phaseName === 'Exhale'){
              x = 70;
              y = -70 + 140 * tNorm;
              dot.setAttribute('fill', '#3b82f6');
            } else {
              x = -70;
              y = 70;
              dot.setAttribute('fill', '#f59e0b');
            }
            dot.setAttribute('cx', x);
            dot.setAttribute('cy', y);
          },
          legend: legendDots([
            ['Inhale', 'mpl-dot-green'],
            ['Hold', 'mpl-dot-amber'],
            ['Exhale', 'mpl-dot-blue'],
            ['Hold', 'mpl-dot-amber']
          ])
        };
      }
    },
    478: {
      title: '4-7-8 breathing',
      phases: [ ['Inhale', 4], ['Hold', 7], ['Exhale', 8] ],
      setup(svg){
        svg.innerHTML = '';
        const ringBg = circle(0, 0, 70, 'none', '#e5e7eb', 8);
        const ring = arcPath();
        ring.setAttribute('stroke', '#8b5cf6');
        ring.setAttribute('stroke-width', 10);
        ring.setAttribute('fill', 'none');
        const bubble = circle(0, 0, 22, '#8b5cf6');
        svg.append(ringBg, ring, bubble);
        return {
          update(phaseName, tNorm, phaseSeconds, sessionProgress){
            const tech = techniques['478'];
            const overall = cycleProgress(phaseName, phaseSeconds, tech.phases, sessionProgress);
            const angle = overall * Math.PI * 2;
            setArc(ring, 0, angle, 70);
            if (phaseName === 'Inhale'){
              bubble.setAttribute('r', String(22 + 18 * tNorm));
            } else if (phaseName === 'Hold'){
              bubble.setAttribute('r', '40');
            } else {
              bubble.setAttribute('r', String(40 - 30 * tNorm));
            }
          },
          legend: legendDots([
            ['Inhale (4s)', 'mpl-dot-violet'],
            ['Hold (7s)', 'mpl-dot-amber'],
            ['Exhale (8s)', 'mpl-dot-blue']
          ])
        };
      }
    },
    coherent: {
      title: 'Coherent 5-5',
      phases: [ ['Inhale', 5], ['Exhale', 5] ],
      setup(svg){
        svg.innerHTML = '';
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M -80 0 C -80 -44, -20 -44, -20 0 C -20 44, -80 44, -80 0 M 20 0 C 20 -44, 80 -44, 80 0 C 80 44, 20 44, 20 0');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#94a3b8');
        path.setAttribute('stroke-width', 3);
        const dot = circle(0, 0, 6, '#0ea5e9');
        svg.append(path, dot);
        const length = path.getTotalLength();
        const half = length / 2;
        return {
          update(phaseName, tNorm){
            let point;
            if (phaseName === 'Inhale'){
              point = path.getPointAtLength(half * tNorm);
              dot.setAttribute('fill', '#10b981');
            } else {
              point = path.getPointAtLength(half + half * tNorm);
              dot.setAttribute('fill', '#3b82f6');
            }
            dot.setAttribute('cx', String(point.x));
            dot.setAttribute('cy', String(point.y));
          },
          legend: legendDots([
            ['Inhale (5s)', 'mpl-dot-green'],
            ['Exhale (5s)', 'mpl-dot-blue']
          ])
        };
      }
    },
    sos: {
      title: '60-second SOS reset',
      phases: [ ['Inhale', 4], ['Exhale', 4] ],
      setup(svg){
        svg.innerHTML = '';
        const barBg = rect(-90, -8, 180, 16, '#e5e7eb');
        const bar = rect(-90, -8, 0, 16, '#ef4444');
        const pulse = circle(-90, 0, 10, 'rgba(239,68,68,0.25)');
        svg.append(barBg, bar, pulse);
        return {
          update(phaseName, tNorm, phaseSeconds, sessionProgress){
            const width = 180 * sessionProgress;
            bar.setAttribute('width', String(Math.max(0, width)));
            bar.setAttribute('fill', phaseName === 'Inhale' ? '#ef4444' : '#3b82f6');
            const px = -90 + width;
            pulse.setAttribute('cx', String(px));
            const radius = phaseName === 'Inhale' ? 10 + 6 * tNorm : 16 - 6 * tNorm;
            pulse.setAttribute('r', String(radius));
          },
          legend: legendDots([
            ['Inhale (4s)', 'mpl-dot-red'],
            ['Exhale (4s)', 'mpl-dot-blue']
          ])
        };
      }
    }
  };

  updateSummary();
  updateControls();
  highlightTechnique(selectedTechnique);
  ensureVoicesReady().then(refreshVoiceStatus).catch(refreshVoiceStatus);

  ttsStartBtn?.addEventListener('click', speakInstruction);
  ttsStopBtn?.addEventListener('click', () => cancelAllNarration());
  ttsTestBtn?.addEventListener('click', voiceTest);

  startBtn.addEventListener('click', () => {
    if (sessionActive || selectingTechnique) return;
    openTechniqueModal();
  });

  stopBtn.addEventListener('click', () => {
    completeSession(true);
  });

  confirmTechnique?.addEventListener('click', () => {
    if (!selectedTechnique) return;
    closeTechniqueModal();
    startSessionWithTechnique(selectedTechnique);
  });

  cancelTechnique?.addEventListener('click', () => {
    closeTechniqueModal();
  });

  overlay?.addEventListener('click', event => {
    if (event.target === overlay) closeTechniqueModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !overlay?.hidden){
      event.preventDefault();
      closeTechniqueModal();
    }
  });

  techniqueButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-tech-option') || '478';
      highlightTechnique(key);
    });
  });

  toggleBtn?.addEventListener('click', () => {
    if (!sessionActive){
      if (currentTechnique) restartSession();
      return;
    }
    if (sessionRunning){
      sessionRunning = false;
      toggleBtn.textContent = 'Continue';
      toggleBtn.classList.remove('btn-ok');
      cancelAllNarration();
    } else if (overallSessionProgress >= 1){
      restartSession();
    } else {
      sessionRunning = true;
      toggleBtn.textContent = 'Pause';
      toggleBtn.classList.add('btn-ok');
      lastTick = null;
      const tech = techniques[currentTechnique];
      if (tech){
        const phase = tech.phases[phaseIndex];
        if (phase) speakCue(phase[0]);
      }
    }
  });

  stopBtnPlayer?.addEventListener('click', () => {
    stopWithoutSaving();
  });

  restartBtn?.addEventListener('click', () => {
    restartSession();
  });

  backBtn?.addEventListener('click', () => {
    stopWithoutSaving();
    openTechniqueModal();
  });

  durationSelect?.addEventListener('change', () => {
    const value = parseInt(durationSelect.value, 10);
    if (Number.isFinite(value) && value > 0){
      sessionDurationMs = value * 1000;
      progressBar.value = Math.min(1, elapsedMs / sessionDurationMs);
    }
  });

  initCardNarrators();
  initLetterChips();

  function loadState(){
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return { ...defaults };
      const parsed = JSON.parse(raw);
      return Object.assign({}, defaults, parsed || {});
    } catch {
      return { ...defaults };
    }
  }

  function saveState(){
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }

  function formatMinutes(value){
    return Math.max(0, Math.round(value || 0));
  }

  function formatTimer(ms){
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function updateSummary(){
    if (sessionCount) sessionCount.textContent = String(state.sessions || 0);
    if (minuteCount) minuteCount.textContent = String(formatMinutes(state.minutes));
    if (lastUsed){
      if (state.last){
        const date = new Date(state.last);
        lastUsed.textContent = isNaN(date.getTime()) ? '—' : date.toLocaleString('en-GB');
      } else {
        lastUsed.textContent = '—';
      }
    }
  }

  function updateControls(){
    startBtn.disabled = sessionActive || selectingTechnique;
    stopBtn.disabled = !sessionActive;
  }

  function updateTimerLabel(forceZero){
    if (!timerLabel) return;
    const value = forceZero ? 0 : elapsedMs;
    timerLabel.textContent = formatTimer(value);
  }

  function openTechniqueModal(){
    selectingTechnique = true;
    updateControls();
    if (!overlay) return;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlay.hidden = false;
    highlightTechnique(selectedTechnique || state.lastTechnique || '478');
    const target = techniqueButtons.find(btn => btn.getAttribute('data-tech-option') === selectedTechnique) || techniqueButtons[0];
    window.setTimeout(() => {
      (target || techniqueDialog)?.focus?.({ preventScroll: true });
    }, 10);
  }

  function closeTechniqueModal(){
    selectingTechnique = false;
    updateControls();
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = previousOverflow;
    previousOverflow = '';
    startBtn.focus({ preventScroll: true });
  }

  function highlightTechnique(key){
    if (!key || !techniques[key]) key = '478';
    selectedTechnique = key;
    techniqueButtons.forEach(btn => {
      const match = btn.getAttribute('data-tech-option') === key;
      btn.classList.toggle('btn-success', match);
      btn.setAttribute('aria-pressed', match ? 'true' : 'false');
      const existing = btn.querySelector('.mpl-technique-selected');
      if (match && !existing){
        const tag = doc.createElement('span');
        tag.className = 'badge mpl-technique-selected';
        tag.textContent = 'Selected';
        btn.appendChild(tag);
      } else if (!match && existing){
        existing.remove();
      }
    });
  }

  function startSessionWithTechnique(key){
    if (!techniques[key]) return;
    cancelAllNarration();
    state.lastTechnique = key;
    saveState();
    currentTechnique = key;
    sessionActive = true;
    sessionRunning = true;
    elapsedMs = 0;
    phaseElapsedMs = 0;
    phaseIndex = 0;
    overallSessionProgress = 0;
    lastTick = null;
  lastPhaseName = 'Inhale';
  sessionDurationMs = (parseInt(durationSelect?.value || '300', 10) || 300) * 1000;
    updateTimerLabel(true);
    updateControls();

    if (timerId) window.clearInterval(timerId);
    timerId = window.setInterval(() => {
      if (sessionActive) updateTimerLabel();
    }, 500);

    buildEngine(key);
    player?.removeAttribute('hidden');
    playerTitle?.focus?.({ preventScroll: true });
    toggleBtn && toggleBtn.classList.add('btn-ok');
    toggleBtn && (toggleBtn.textContent = 'Pause');
    progressBar && (progressBar.value = 0);
    const tech = techniques[key];
    const firstPhase = tech.phases[0];
    phaseLabel && (phaseLabel.textContent = `${firstPhase[0]}...`);
    speakCue(firstPhase[0]);
    rafId && window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(stepLoop);
  }

  function restartSession(){
    if (!currentTechnique) return;
    cancelAllNarration();
    sessionRunning = true;
    elapsedMs = 0;
    phaseElapsedMs = 0;
    phaseIndex = 0;
    overallSessionProgress = 0;
    lastTick = null;
  lastPhaseName = 'Inhale';
  sessionDurationMs = (parseInt(durationSelect?.value || '300', 10) || 300) * 1000;
    updateTimerLabel(true);
    buildEngine(currentTechnique);
    toggleBtn && toggleBtn.classList.add('btn-ok');
    toggleBtn && (toggleBtn.textContent = 'Pause');
    progressBar && (progressBar.value = 0);
    const tech = techniques[currentTechnique];
    const first = tech?.phases[0];
    if (first) speakCue(first[0]);
    rafId && window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(stepLoop);
  }

  function stopWithoutSaving(){
    completeSession(false);
  }

  function completeSession(saveProgress){
    if (!sessionActive) return;
    sessionActive = false;
    sessionRunning = false;
    if (rafId){
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    if (timerId){
      window.clearInterval(timerId);
      timerId = 0;
    }
    cancelAllNarration();
    if (saveProgress && elapsedMs > 0){
      state.sessions = (state.sessions || 0) + 1;
      state.minutes = Math.max(0, (state.minutes || 0) + (elapsedMs / 60000));
      state.last = new Date().toISOString();
      state.lastTechnique = currentTechnique;
      saveState();
      updateSummary();
    }
    elapsedMs = 0;
    phaseElapsedMs = 0;
    phaseIndex = 0;
    overallSessionProgress = 0;
    updateTimerLabel(true);
    progressBar && (progressBar.value = 0);
    phaseLabel && (phaseLabel.textContent = 'Ready');
    toggleBtn && toggleBtn.classList.add('btn-ok');
    toggleBtn && (toggleBtn.textContent = 'Pause');
    player && player.setAttribute('hidden', '');
    updateControls();
  }

  function buildEngine(key){
    if (!viz) return;
    const tech = techniques[key];
    if (!tech) return;
    engine = tech.setup ? tech.setup(viz) : null;
    playerTitle && (playerTitle.textContent = tech.title);
    legendContainer && (legendContainer.innerHTML = engine?.legend || '');
  }

  function stepLoop(timestamp){
    if (!sessionActive) return;
    if (sessionRunning){
      if (lastTick == null) lastTick = timestamp;
      const delta = Math.max(0, timestamp - lastTick);
      elapsedMs += delta;
      phaseElapsedMs += delta;
      const tech = techniques[currentTechnique];
      if (tech){
        const currentPhase = tech.phases[phaseIndex];
        const phaseDuration = Math.max(1, currentPhase[1] * 1000);
        const tNorm = Math.min(1, phaseElapsedMs / phaseDuration);
        if (engine && typeof engine.update === 'function'){
          engine.update(currentPhase[0], tNorm, phaseElapsedMs / 1000, Math.min(1, elapsedMs / sessionDurationMs));
        }
        phaseLabel && (phaseLabel.textContent = `${currentPhase[0]}...`);
        if (phaseElapsedMs >= phaseDuration){
          phaseElapsedMs -= phaseDuration;
          lastPhaseName = currentPhase[0];
          phaseIndex = (phaseIndex + 1) % tech.phases.length;
          const nextPhase = tech.phases[phaseIndex];
          speakCue(nextPhase[0]);
        }
      }
      overallSessionProgress = Math.min(1, elapsedMs / sessionDurationMs);
      progressBar && (progressBar.value = overallSessionProgress);
      if (overallSessionProgress >= 1){
        sessionRunning = false;
        toggleBtn && (toggleBtn.textContent = 'Restart');
        toggleBtn && toggleBtn.classList.remove('btn-ok');
        phaseLabel && (phaseLabel.textContent = 'Session complete');
        cancelAllNarration();
      }
      updateTimerLabel();
    }
    lastTick = timestamp;
    rafId = window.requestAnimationFrame(stepLoop);
  }

  function circle(cx, cy, r, fill, stroke, sw){
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('cx', String(cx));
    el.setAttribute('cy', String(cy));
    el.setAttribute('r', String(r));
    el.setAttribute('fill', fill || 'none');
    if (stroke){
      el.setAttribute('stroke', stroke);
      el.setAttribute('stroke-width', String(sw || 2));
    }
    return el;
  }

  function rect(x, y, width, height, fill){
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    el.setAttribute('x', String(x));
    el.setAttribute('y', String(y));
    el.setAttribute('width', String(width));
    el.setAttribute('height', String(height));
    el.setAttribute('rx', '6');
    el.setAttribute('fill', fill);
    return el;
  }

  function addText(svg, x, y, text){
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    el.setAttribute('x', String(x));
    el.setAttribute('y', String(y));
    el.setAttribute('fill', '#64748b');
    el.setAttribute('font-size', '10');
    el.textContent = text;
    svg.appendChild(el);
  }

  function arcPath(){
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', '');
    path.setAttribute('stroke-linecap', 'round');
    return path;
  }

  function setArc(path, startAngle, endAngle, radius){
    const large = (endAngle - startAngle) % (Math.PI * 2) > Math.PI ? 1 : 0;
    const x0 = radius * Math.cos(startAngle);
    const y0 = radius * Math.sin(startAngle);
    const x1 = radius * Math.cos(endAngle);
    const y1 = radius * Math.sin(endAngle);
    const d = `M ${x0} ${y0} A ${radius} ${radius} 0 ${large} 1 ${x1} ${y1}`;
    path.setAttribute('d', d);
  }

  function legendDots(items){
    return items.map(([label, cls]) => `<span class="mpl-technique-dot ${cls}"></span>${label}`).join(' &middot; ');
  }

  function cycleProgress(phaseName, phaseSeconds, phases, sessionProgress){
    if (sessionProgress != null) return sessionProgress;
    const index = phases.findIndex(p => p[0] === phaseName);
    if (index < 0) return 0;
    const before = phases.slice(0, index).reduce((sum, phase) => sum + phase[1], 0);
    const total = phases.reduce((sum, phase) => sum + phase[1], 0);
    return (before + phaseSeconds) / Math.max(total, 1);
  }

  function cancelAllNarration(){
    if (supportsTTS){
      try { speechSynthesis.cancel(); } catch {
        /* ignore */
      }
    }
    [femaleAudio, maleAudio].forEach(audio => {
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    });
    Object.values(cueCache).forEach(group => {
      Object.values(group).forEach(audio => {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch {
          /* ignore */
        }
      });
    });
    stopActiveNarratorButton();
  }

  function ensureVoicesReady(){
    if (!supportsTTS) return Promise.resolve([]);
    const voices = speechSynthesis.getVoices();
    if (voices.length) return Promise.resolve(voices);
    return new Promise(resolve => {
      const handler = () => {
        speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve(speechSynthesis.getVoices());
      };
      speechSynthesis.addEventListener('voiceschanged', handler);
      setTimeout(() => resolve(speechSynthesis.getVoices()), 500);
    });
  }

  async function getVoiceForGender(gender){
    if (!supportsTTS) return { voice: null, simulated: false };
    const voices = await ensureVoicesReady();
    if (!voices.length) return { voice: null, simulated: false };
    const langMatch = voices.filter(v => (v.lang || '').toLowerCase().startsWith('en-gb'));
    const hints = gender === 'female'
      ? [/female/i, /sonia/i, /serena/i, /libby/i, /kate/i, /emma/i]
      : [/google uk english male/i, /male/i, /daniel/i, /george/i, /arthur/i, /ryan/i, /brian/i, /guy/i];
    const pickByHint = langMatch.find(v => hints.some(h => h.test(v.name)));
    if (pickByHint) return { voice: pickByHint, simulated: false };
    if (langMatch[0]) return { voice: langMatch[0], simulated: true };
    const enVoices = voices.filter(v => /^en-/i.test(v.lang || ''));
    const pickFallback = enVoices.find(v => hints.some(h => h.test(v.name)));
    if (pickFallback) return { voice: pickFallback, simulated: false };
    if (enVoices[0]) return { voice: enVoices[0], simulated: true };
    return { voice: voices[0], simulated: true };
  }

  async function refreshVoiceStatus(){
    if (!voiceStatus) return;
    if (!supportsTTS){
      voiceStatus.textContent = 'No system TTS - using MP3 fallbacks if available.';
      return;
    }
    const profile = getActiveVoiceProfile();
    const gender = profileToGender(profile);
    const { voice, simulated } = await getVoiceForGender(gender);
    if (voice){
      voiceStatus.textContent = `${voice.name} (${voice.lang})${simulated ? ' (pitch adjusted)' : ''}`;
    } else {
      voiceStatus.textContent = 'No voice found - using MP3 fallbacks if available.';
    }
  }

  async function speakInstruction(){
    const text = doc.getElementById('mpl-technique-desc')?.textContent?.trim();
    if (!text) return;
    await speakText(text);
  }

  async function speakText(text){
    const profile = getActiveVoiceProfile();
    const gender = profileToGender(profile);
    if (supportsTTS){
      const { voice, simulated } = await getVoiceForGender(gender);
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.lang = (voice && voice.lang) || 'en-GB';
      utterance.rate = 1.0;
      utterance.pitch = gender === 'female' ? (simulated ? 1.18 : 1.05) : (simulated ? 0.88 : 0.95);
      try {
        speechSynthesis.speak(utterance);
        return;
      } catch {
        /* fallback */
      }
    }
    const audio = gender === 'male' ? maleAudio : femaleAudio;
    try {
      if (audio){
        audio.currentTime = 0;
        void audio.play();
      }
    } catch {
      /* ignore */
    }
  }


  function stopActiveNarratorButton(){
    if (activeCardNarration?.button){
      activeCardNarration.button.removeAttribute('data-speaking');
    }
    activeCardNarration = null;
  }

  function disableNarratorButton(btn, message){
    if (!btn) return;
    btn.disabled = true;
    if (message) btn.title = message;
    btn.removeAttribute('data-speaking');
  }

  function initCardNarrators(){
    if (!narratorButtons.length) return;
    if (!supportsTTS){
      narratorButtons.forEach(btn => disableNarratorButton(btn, 'Narration requires browser speech synthesis.'));
      return;
    }
    narratorButtons.forEach(btn => {
      const selector = btn.getAttribute('data-narrate');
      if (!selector){
        disableNarratorButton(btn, 'Narration unavailable.');
        return;
      }
      const target = doc.querySelector(selector);
      if (!target){
        disableNarratorButton(btn, 'Narration target missing.');
        return;
      }
      btn.addEventListener('click', () => {
        void handleCardNarration(btn, target);
      });
    });
    doc.addEventListener('visibilitychange', () => {
      if (doc.hidden){
        cancelAllNarration();
      }
    });
  }

  async function handleCardNarration(btn, target){
    if (!supportsTTS){
      disableNarratorButton(btn, 'Narration requires browser speech synthesis.');
      return;
    }
    if (btn.dataset.narratorPending === 'true') return;
    if (activeCardNarration && activeCardNarration.button === btn){
      cancelAllNarration();
      return;
    }
    const rawText = target?.textContent || '';
    const collapsed = rawText.replace(/\s+/g, ' ').trim();
    const mode = btn.getAttribute('data-narrate-mode');
    const text = mode === 'letters' ? sanitizeLetterNarration(collapsed) : collapsed;
    if (!text){
      disableNarratorButton(btn, 'Nothing to narrate yet.');
      return;
    }
    btn.dataset.narratorPending = 'true';
    cancelAllNarration();
    try {
      const profile = getActiveVoiceProfile();
      const gender = profileToGender(profile);
      const { voice, simulated } = await getVoiceForGender(gender);
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.lang = (voice && voice.lang) || 'en-GB';
      utterance.rate = 0.98;
      utterance.pitch = gender === 'female' ? (simulated ? 1.1 : 1.03) : (simulated ? 0.9 : 0.97);
      utterance.onend = () => {
        if (activeCardNarration && activeCardNarration.button === btn){
          stopActiveNarratorButton();
        }
      };
      utterance.onerror = () => {
        if (activeCardNarration && activeCardNarration.button === btn){
          stopActiveNarratorButton();
        }
      };
      activeCardNarration = { button: btn, target, utterance };
      btn.setAttribute('data-speaking', 'true');
      speechSynthesis.speak(utterance);
    } catch {
      stopActiveNarratorButton();
    } finally {
      delete btn.dataset.narratorPending;
    }
  }

  function sanitizeLetterNarration(text){
    return (text || '').replace(/[^A-Za-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function spellLetterTokens(value){
    const sanitized = sanitizeLetterNarration(value);
    if (!sanitized) return '';
    return sanitized
      .split(' ')
      .filter(Boolean)
      .map(token => token.toUpperCase().split('').join(' '))
      .join(', ');
  }

  function initLetterChips(){
    if (!letterChips.length) return;
    if (!supportsTTS){
      letterChips.forEach(chip => {
        chip.disabled = true;
        chip.title = 'Narration requires browser speech synthesis.';
      });
      return;
    }
    letterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const narration = buildLetterChipNarration(chip);
        if (!narration) return;
        cancelAllNarration();
        speakText(narration);
      });
    });
  }

  function buildLetterChipNarration(chip){
    if (!chip) return '';
    const saySource = chip.getAttribute('data-letter-say') || chip.textContent || '';
    const spelled = spellLetterTokens(saySource);
    const cue = sanitizeLetterNarration(chip.getAttribute('data-letter-cue') || '');
    if (spelled && cue){
      return `${spelled} makes the sound ${cue}.`;
    }
    return spelled || cue;
  }

  async function speakCue(phase){
    cancelAllNarration();
    const profile = getActiveVoiceProfile();
    const gender = profileToGender(profile);
    if (supportsTTS){
      const { voice, simulated } = await getVoiceForGender(gender);
      const utterance = new SpeechSynthesisUtterance(phase);
      if (voice) utterance.voice = voice;
      utterance.lang = (voice && voice.lang) || 'en-GB';
      utterance.rate = 0.95;
      utterance.pitch = gender === 'female' ? (simulated ? 1.2 : 1.06) : (simulated ? 0.86 : 0.92);
      try {
        speechSynthesis.speak(utterance);
        return;
      } catch {
        /* ignore */
      }
    }
    const map = { Inhale: 'inhale', Hold: 'hold', Exhale: 'exhale' };
    const key = map[phase] || 'inhale';
    const audio = getCueAudio(gender, key);
    try {
      audio.currentTime = 0;
      void audio.play();
    } catch {
      /* ignore */
    }
  }

  function voiceTest(){
    cancelAllNarration();
    const profile = getActiveVoiceProfile();
    const gender = profileToGender(profile);
    if (supportsTTS){
      getVoiceForGender(gender).then(({ voice, simulated }) => {
        const phrases = ['Voice check.', `This is your ${gender === 'female' ? 'British female' : 'British male'} voice.`, 'Inhale.', 'Hold.', 'Exhale.'];
        phrases.forEach((txt, index) => {
          const utterance = new SpeechSynthesisUtterance(txt);
          if (voice) utterance.voice = voice;
          utterance.lang = (voice && voice.lang) || 'en-GB';
          utterance.rate = index === 0 ? 1.0 : 0.95;
          utterance.pitch = gender === 'female' ? (simulated ? 1.18 : 1.05) : (simulated ? 0.88 : 0.95);
          try { speechSynthesis.speak(utterance); } catch { /* ignore */ }
        });
      });
      return;
    }
    const order = ['inhale', 'hold', 'exhale'];
    const playNext = (i = 0) => {
      if (i >= order.length) return;
      const audio = getCueAudio(gender, order[i]);
      try {
        audio.currentTime = 0;
        audio.onended = () => playNext(i + 1);
        void audio.play();
      } catch {
        /* ignore */
      }
    };
    playNext();
  }

  function getCueAudio(gender, cue){
    if (!cueCache[gender][cue]){
      cueCache[gender][cue] = new Audio(`assets/tts/cues/en-GB-${gender}/${cue}.mp3`);
    }
    return cueCache[gender][cue];
  }
})();
