// Quick Start Modal Dialog with Integrated Breathing Player
(function() {
  'use strict';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const numberFormatter = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });

  const setTextById = (id, value) => {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if (!el || value === undefined || value === null) return;
    el.textContent = value;
  };

  const pluraliseDays = (days=0) => {
    const safe = Math.max(0, Number.isFinite(days) ? days : 0);
    return `${safe} day${safe === 1 ? '' : 's'}`;
  };

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, Number(value) || 0));
  const formatNumber = (value = 0) => numberFormatter.format(Math.max(0, Math.round(Number(value) || 0)));
  const formatDurationShort = (seconds = 0) => {
    const safe = Math.max(0, Number(seconds) || 0);
    if (safe < 60) return `${Math.round(safe)}s`;
    const minutes = safe / 60;
    if (minutes < 10) return `${minutes.toFixed(1)}m`;
    return `${Math.round(minutes)}m`;
  };

  const GAME_KEY_PREFIX = {
    memoryMatrix: 'Memory',
    colorStorm: 'Color',
    focusFlow: 'Flow',
    patternPulse: 'Pattern'
  };

  const GAME_SCROLL_TARGETS = {
    memoryMatrix: '#memoryMatrixGame',
    colorStorm: '#colorStormGame',
    focusFlow: '#focusFlowGame',
    patternPulse: '#patternPulseGame'
  };

  const GAME_STARTERS = {
    memoryMatrix: () => window.MemoryMatrix && window.MemoryMatrix.init && window.MemoryMatrix.init(),
    colorStorm: () => window.ColorStorm && window.ColorStorm.init && window.ColorStorm.init(),
    focusFlow: () => window.FocusFlow && window.FocusFlow.init && window.FocusFlow.init(),
    patternPulse: () => window.PatternPulse && window.PatternPulse.init && window.PatternPulse.init()
  };

  const GAME_STOPPERS = {
    focusFlow: (options = {}) => {
      const flow = window.FocusFlow;
      if (flow && typeof flow.stop === 'function') {
        flow.stop(options);
      }
    }
  };

  function stopFocusGame(gameKey, options = {}) {
    const stopper = GAME_STOPPERS[gameKey];
    if (typeof stopper === 'function') {
      stopper(options);
    }
  }

  const GLOBAL_BADGE_HINTS = [
    { id: 'memory_master', title: 'Next badge: Memory Master', desc: 'Score 200 pts in Memory Matrix to unlock Memory Master.' },
    { id: 'sharp_shooter', title: 'Aim for Sharp Shooter', desc: 'Hit 90% accuracy in Color Storm to claim Sharp Shooter.' },
    { id: 'laser_focus', title: 'Chase Laser Focus', desc: 'Stay on target for an 80% focus rate in Focus Flow.' },
    { id: null, title: 'Keep logging sessions', desc: 'Play any focus mission to reveal your next badge automatically.' }
  ];

  const GAME_BADGE_HINTS = {
    memoryMatrix: [
      { id: 'memory_master', title: 'Unlock Memory Master', desc: 'Score 200 pts in Memory Matrix in a single run.' },
      { id: 'memory_marathon', title: 'Reach Memory Marathon', desc: 'Survive 10 rounds without a mistake to earn Memory Marathon.' }
    ],
    colorStorm: [
      { id: 'sharp_shooter', title: 'Sharpen accuracy', desc: 'Maintain 90% accuracy to grab Sharp Shooter.' },
      { id: 'color_master', title: 'Go for Color Master', desc: 'Break 500 pts in Color Storm to earn Color Master.' }
    ],
    focusFlow: [
      { id: 'laser_focus', title: 'Laser Focus target', desc: 'Stay inside the calming zone for an 80% focus rate.' },
      { id: 'zen_master', title: 'Zen Master quest', desc: 'Hold a 50+ second streak to unlock Zen Master.' }
    ],
    patternPulse: [
      { id: 'rhythm_master', title: 'Rhythm Master goal', desc: 'Complete 10 rounds to secure Rhythm Master.' },
      { id: 'perfect_pitch', title: 'Perfect Pitch goal', desc: 'Log 15 flawless rounds to unlock Perfect Pitch.' }
    ]
  };

  const GAME_BADGE_IDS = {
    memoryMatrix: ['memory_master', 'memory_marathon'],
    colorStorm: ['sharp_shooter', 'color_master'],
    focusFlow: ['laser_focus', 'zen_master'],
    patternPulse: ['rhythm_master', 'perfect_pitch']
  };

  const QUEST_TARGETS = {
    memoryMatrix: { metric: 'bestScore', target: 200, label: 'pts until Memory Master', type: 'number' },
    colorStorm: { metric: 'bestScore', target: 500, label: 'pts until Color Master', type: 'number' },
    focusFlow: { metric: 'bestFocusRate', target: 80, label: '% focus rate for Laser Focus', type: 'percent' },
    patternPulse: { metric: 'bestRound', target: 10, label: 'rounds for Rhythm Master', type: 'number' }
  };

  const GAME_COACH_SCRIPTS = {
    memoryMatrix: 'Memory Matrix builds spatial working memory. Watch the tiles that glow, breathe steadily, then tap each square back in the same order. After every few wins the grid expands, so keep movements calm and confident.',
    colorStorm: 'Color Storm sharpens task switching. Read the word, notice the ink colour, then answer if they match. Every fifteen seconds the rule flips, so anchor your breathing and react with purpose, not panic.',
    focusFlow: 'Focus Flow is a calm tracking mission. Float your cursor or finger over the moving orb, follow its rhythm, and let your shoulders drop. Smooth, steady movement earns the best focus streak.',
    patternPulse: 'Pattern Pulse blends rhythm and memory. Watch and listen to the coloured pads, then replay the pattern. Each round speeds up slightly, so stay loose, count the beats, and trust your internal metronome.',
    default: 'These focus missions are short nervous-system warm-ups. Listen for the cues, keep your breathing soft, and treat every round as practice rather than pressure.'
  };

  const FOCUS_COACH_SECONDS = 3;

  // --- Technique definitions: unique visuals per technique ---
  const techniques = {
    box: {
      title: 'Box breathing (4-4-4-4)',
      phases: [ ['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Hold', 4] ],
      setup(svg){
        svg.innerHTML='';
        const frame = document.createElementNS('http://www.w3.org/2000/svg','rect');
        frame.setAttribute('x', -70); frame.setAttribute('y', -70);
        frame.setAttribute('width', 140); frame.setAttribute('height', 140);
        frame.setAttribute('rx', 10);
        frame.setAttribute('fill', 'none'); frame.setAttribute('stroke', '#94a3b8'); frame.setAttribute('stroke-width', 3);
        svg.appendChild(frame);
        const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
        dot.setAttribute('r', 6); dot.setAttribute('fill', '#10b981');
        svg.appendChild(dot);
        addText(svg, -80, -80, 'Inhale');
        addText(svg, 80, -80, 'Hold');
        addText(svg, 80, 90, 'Exhale');
        addText(svg, -80, 90, 'Hold');

        return {
          update(phaseName, tNorm){
            let x=-70, y=-70;
            if(phaseName==='Inhale'){
              x = -70 + 140 * tNorm; y = -70;
              dot.setAttribute('fill', '#10b981');
            } else if(phaseName==='Hold' && window.lastPhase==='Inhale'){
              x = 70; y = -70;
              dot.setAttribute('fill', '#f59e0b');
            } else if(phaseName==='Exhale'){
              x = 70; y = -70 + 140 * tNorm;
              dot.setAttribute('fill', '#3b82f6');
            } else {
              x = -70; y = 70;
              dot.setAttribute('fill', '#f59e0b');
            }
            dot.setAttribute('cx', x); dot.setAttribute('cy', y);
          },
          legend: legendDots([
            ['Inhale', 'green'], ['Hold', 'amber'], ['Exhale', 'blue'], ['Hold', 'amber']
          ])
        }
      }
    },
    478: {
      title: '4‑7‑8 breathing',
      phases: [ ['Inhale', 4], ['Hold', 7], ['Exhale', 8] ],
      setup(svg){
        svg.innerHTML='';
        const ringBg = circle(0,0,70,'none','#e5e7eb',8);
        const ring = arcPath(0,0,70,0);
        ring.setAttribute('stroke','#8b5cf6'); ring.setAttribute('stroke-width','10'); ring.setAttribute('fill','none');
        const bubble = circle(0,0,22,'#8b5cf6');
        svg.append(ringBg, ring, bubble);
        return {
          update(phaseName, tNorm, phaseProgress){
            const overall = cycleProgress(phaseName, phaseProgress, techniques[478].phases);
            const angle = overall * Math.PI * 2;
            setArc(ring, 0, angle, 70);
            if(phaseName==='Inhale'){
              const r = 22 + 18 * tNorm; bubble.setAttribute('r', r);
            } else if(phaseName==='Hold'){
              bubble.setAttribute('r', 40);
            } else {
              const r = 40 - 30 * tNorm; bubble.setAttribute('r', r);
            }
          },
          legend: legendDots([
            ['Inhale (4s)','violet'], ['Hold (7s)','amber'], ['Exhale (8s)','blue']
          ])
        }
      }
    },
    coherent: {
      title: 'Coherent 5‑5 (resonance)',
      phases: [ ['Inhale', 5], ['Exhale', 5] ],
      setup(svg){
        svg.innerHTML='';
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d', 'M -80 0 C -80 -44, -20 -44, -20 0 C -20 44, -80 44, -80 0 M 20 0 C 20 -44, 80 -44, 80 0 C 80 44, 20 44, 20 0');
        path.setAttribute('fill','none'); path.setAttribute('stroke','#94a3b8'); path.setAttribute('stroke-width','3');
        const dot = circle(0,0,6,'#0ea5e9');
        svg.append(path, dot);
        const len = path.getTotalLength();
        const half = len/2;
        return {
          update(phaseName, tNorm){
            let p;
            if(phaseName==='Inhale'){
              p = path.getPointAtLength(half * tNorm);
              dot.setAttribute('fill','#10b981');
            } else {
              p = path.getPointAtLength(half + half * tNorm);
              dot.setAttribute('fill','#3b82f6');
            }
            dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
          },
          legend: legendDots([
            ['Inhale (5s)','green'], ['Exhale (5s)','blue']
          ])
        }
      }
    },
    sos: {
      title: '60‑second SOS reset',
      phases: [ ['Inhale', 4], ['Exhale', 4] ],
      setup(svg){
        svg.innerHTML='';
        const barBg = rect(-90, -8, 180, 16, '#e5e7eb');
        const bar = rect(-90, -8, 0, 16, '#ef4444');
        const pulse = circle(-90, 0, 10, 'rgba(239,68,68,0.25)');
        svg.append(barBg, bar, pulse);
        return {
          update(phaseName, tNorm){
            const width = 180 * window.overallSessionProgress;
            bar.setAttribute('width', Math.max(0,width));
            bar.setAttribute('fill', phaseName==='Inhale' ? '#ef4444' : '#3b82f6');
            const px = -90 + width; pulse.setAttribute('cx', px);
            const r = phaseName==='Inhale' ? 10 + 6 * tNorm : 16 - 6 * tNorm; pulse.setAttribute('r', r);
          },
          legend: legendDots([
            ['Inhale (4s)','red'], ['Exhale (4s)','blue']
          ])
        }
      }
    }
  };

  // SVG Helpers
  function circle(cx, cy, r, fill='none', stroke, sw){
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    if(fill) c.setAttribute('fill', fill); else c.setAttribute('fill','none');
    if(stroke){ c.setAttribute('stroke', stroke); c.setAttribute('stroke-width', sw||2); }
    return c;
  }
  function rect(x,y,w,h,fill){
    const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
    r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('rx', 6);
    r.setAttribute('fill', fill); return r;
  }
  function addText(svg,x,y,txt){
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x', x); t.setAttribute('y', y); t.setAttribute('fill', '#64748b'); t.setAttribute('font-size','10');
    t.textContent = txt; svg.appendChild(t);
  }
  function arcPath(cx, cy, r, endAngle){
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',''); p.setAttribute('stroke-linecap','round');
    return p;
  }
  function setArc(path, startAngle, endAngle, r){
    const a0 = startAngle; const a1 = endAngle;
    const large = (a1 - a0) % (Math.PI*2) > Math.PI ? 1 : 0;
    const x0 = r*Math.cos(a0), y0 = r*Math.sin(a0);
    const x1 = r*Math.cos(a1), y1 = r*Math.sin(a1);
    const d = `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
    path.setAttribute('d', d);
  }
  function legendDots(items){
    return items.map(([label, cls])=>`<span class="dot ${cls}"></span>${label}`).join(' · ');
  }
  function cycleProgress(phaseName, phaseProgress, phases){
    const idx = phases.findIndex(p=>p[0]===phaseName);
    const totals = phases.reduce((a,p)=>a+p[1],0);
    const before = phases.slice(0,idx).reduce((a,p)=>a+p[1],0);
    return (before + phases[idx][1]*phaseProgress) / totals;
  }

  // --- DOM refs ---
  const modal = $('#quickStartDialog');
  const openBtn = $('#openQuickStart');
  const openExtras = $$('[data-open-quick-start]');
  const closeBtn = $('#closeQuickStart');
  const cancelBtn = $('#cancelQuickStart');
  const confirmBtn = $('#confirmQuickStart');
  const techniqueOptions = $$('.technique-option');
  const durationButtons = $$('.duration-btn');
  const voiceGenderSelect = $('#quick-voice-gender');
  const voiceStatus = $('#quick-voice-status');
  const ttsStartBtn = $('#quickTtsStart');
  const ttsStopBtn = $('#quickTtsStop');
  const ttsTestBtn = $('#quickTtsTest');
  const sessionArea = $('#breathing-session-area');
  const toggleBtn = $('#breathing-toggle');
  const stopBtn = $('#breathing-stop');
  const restartBtn = $('#breathing-restart');
  const focusShell = $('#focusShell');
  const focusHubView = $('#focusHubView');
  const focusGameButtons = $$('.focus-game-link');
  const focusGameScreens = $$('.focus-view--game');
  const focusBackButtons = $$('[data-focus-action="back-to-hub"]');
  const focusGameScrollButtons = $$('[data-game-scroll]');
  const focusStartButtons = $$('[data-focus-start]');
  const focusToggleButtons = $$('[data-focus-toggle]');
  const focusResetButtons = $$('[data-focus-reset]');
  const focusRestartButtons = $$('[data-focus-restart]');
  const focusStopButtons = $$('[data-focus-stop]');
  const focusSwitchButtons = $$('[data-focus-switch]');
  const focusMainHubButtons = $$('[data-focus-mainhub]');
  const focusStageResetButtons = $$('[data-focus-stage-reset]');
  const focusModalTriggers = $$('[data-focus-modal-game]');
  const focusResetAllButton = $('[data-focus-reset-all]');
  const focusResetRow = focusResetAllButton?.closest('.focus-reset-row') || null;
  const focusResetConfirmPanel = $('[data-focus-reset-confirm]');
  const focusResetDecisionButtons = $$('[data-reset-confirm]');
  const toggleButtonGroups = {};

  focusToggleButtons.forEach(btn => {
    const key = btn?.dataset?.focusToggle;
    if(!key) return;
    if(!toggleButtonGroups[key]) toggleButtonGroups[key] = [];
    toggleButtonGroups[key].push(btn);
  });

  function setToggleLabel(gameKey, mode = 'pause'){
    (toggleButtonGroups[gameKey] || []).forEach(btn => {
      btn.textContent = mode === 'continue' ? 'Continue' : 'Pause';
    });
  }

  function showLifetimeResetConfirm(){
    if(!focusResetConfirmPanel) return;
    focusResetConfirmPanel.hidden = false;
    if(focusResetRow) focusResetRow.setAttribute('data-confirm-visible', 'true');
    const primary = focusResetConfirmPanel.querySelector('[data-reset-confirm="yes"]');
    primary?.focus();
  }

  function hideLifetimeResetConfirm(){
    if(!focusResetConfirmPanel) return;
    focusResetConfirmPanel.hidden = true;
    if(focusResetRow) focusResetRow.removeAttribute('data-confirm-visible');
  }

  function handleLifetimeResetDecision(decision){
    if(decision === 'yes'){
      const state = window.GameState;
      if(state && typeof state.resetAll === 'function'){
        state.resetAll();
        if(typeof window.showNotification === 'function'){
          window.showNotification('Progress cleared. Fresh missions unlocked.');
        }
      } else {
        localStorage.removeItem('adhd_game_state');
        try {
          window.showNotification?.('Progress reset.');
        } catch(err) {
          // optional fallback
        }
        window.location.reload();
      }
    }
    hideLifetimeResetConfirm();
  }

  // --- State ---
  let selectedTechnique = '478';
  let selectedDuration = 1; // Default 1 minute
  let engine = null;
  let raf = null;
  let running = false;
  let stopped = false;
  let startTime = 0; let pauseTime = 0;
  let phaseIndex = 0; let phaseStart = 0; let phaseDurMs = 0;
  let sessionTotalMs = 60000; // 1 minute default
  window.lastPhase = 'Inhale';
  window.overallSessionProgress = 0;
  let activeFocusGame = '';
  let cachedGameState = null;

  const supportsTTS = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const VoicePrefs = window.NeurobreathVoicePreferences || null;

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

  function waitForGameState(){
    return new Promise(resolve => {
      if(window.GameState){
        cachedGameState = window.GameState;
        resolve(window.GameState);
        return;
      }

      let poller = null;
      const cleanup = () => {
        window.removeEventListener('adhd:state-change', onChange);
        if(poller) clearInterval(poller);
      };
      const onChange = () => {
        if(window.GameState){
          cleanup();
          cachedGameState = window.GameState;
          resolve(window.GameState);
        }
      };

      window.addEventListener('adhd:state-change', onChange);
      poller = setInterval(() => {
        if(window.GameState){
          cleanup();
          cachedGameState = window.GameState;
          resolve(window.GameState);
        }
      }, 150);
    });
  }

  function computeLevelProgress(state){
    const level = Math.max(1, Number(state?.level) || 1);
    const points = Math.max(0, Number(state?.points) || 0);
    const span = 500;
    const base = (level - 1) * span;
    const current = Math.min(span, Math.max(0, points - base));
    const percent = span ? clamp(current / span, 0, 1) * 100 : 0;
    const untilNext = Math.max(0, base + span - points);
    return { current, span, nextLevel: level + 1, percent, untilNext };
  }

  function updateProgressFill(target, percent){
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if(!el) return;
    el.style.width = `${Math.max(0, Math.min(100, Number(percent) || 0)).toFixed(2)}%`;
  }

  function pickBadgeHint(state, gameKey){
    const unlocked = new Set((state && state.badges) || []);
    const pool = gameKey ? GAME_BADGE_HINTS[gameKey] : GLOBAL_BADGE_HINTS;
    if(!pool || !pool.length) return { title: 'Keep the streak going', desc: 'Play any quick mission to reveal new badges.' };
    const match = pool.find(item => !item.id || !unlocked.has(item.id));
    return match || pool[pool.length - 1];
  }

  function countBadges(state, ids = []){
    if(!ids.length) return 0;
    const unlocked = new Set((state && state.badges) || []);
    return ids.filter(id => unlocked.has(id)).length;
  }

  function hydrateFocusHub(state){
    if(!state) return;
    cachedGameState = state;
    setTextById('focusHubPoints', formatNumber(state.points));
    setTextById('focusHubLevel', state.level || 1);
    setTextById('focusHubStreak', pluraliseDays(state.streakDays));
    setTextById('focusHubGames', formatNumber(state.totalGamesPlayed || 0));
    setTextById('focusHubLevelBadge', `Level ${state.level || 1}`);

    const progress = computeLevelProgress(state);
    setTextById('focusHubLevelLabel', `${formatNumber(progress.current)} / ${progress.span} pts to reach level ${progress.nextLevel}`);
    setTextById('focusHubNextReward', progress.untilNext > 0 ? `Earn ${formatNumber(progress.untilNext)} pts to unlock your next scratch card.` : 'New scratch cards unlock automatically at each level.');
    updateProgressFill('focusHubLevelProgressBar', progress.percent);

    const badgeHint = pickBadgeHint(state, null);
    setTextById('focusHubFeaturedBadge', badgeHint.title);
    setTextById('focusHubBadgeDesc', badgeHint.desc);

    const stats = state.stats || {};
    const memory = stats.memoryMatrix || {};
    const color = stats.colorStorm || {};
    const flow = stats.focusFlow || {};
    const pattern = stats.patternPulse || {};

    setTextById('hubMemoryBest', formatNumber(memory.bestScore || 0));
    setTextById('hubMemoryRound', formatNumber(memory.bestLevel || 0));
    setTextById('hubColorScore', formatNumber(color.bestScore || 0));
    setTextById('hubColorAccuracy', `${Math.round(color.bestAccuracy || 0)}%`);
    setTextById('hubFlowStreak', formatNumber(flow.longestStreak || 0));
    setTextById('hubFlowAvg', formatDurationShort(flow.avgDuration || 0));
    setTextById('hubPatternBest', formatNumber(pattern.bestScore || 0));
    setTextById('hubPatternPerfect', formatNumber(pattern.perfectRounds || 0));
  }

  function hydrateGameDetail(gameKey, state){
    if(!state) return;
    switch(gameKey){
      case 'memoryMatrix':
        hydrateMemoryDetail(state);
        break;
      case 'colorStorm':
        hydrateColorDetail(state);
        break;
      case 'focusFlow':
        hydrateFlowDetail(state);
        break;
      case 'patternPulse':
        hydratePatternDetail(state);
        break;
      default:
        break;
    }
  }

  function hydrateSharedDetail(prefix, state, playedValue){
    if(!prefix || !state) return;
    const progress = computeLevelProgress(state);
    setTextById(`detail${prefix}Points`, formatNumber(state.points));
    setTextById(`detail${prefix}Level`, state.level || 1);
    setTextById(`detail${prefix}Streak`, pluraliseDays(state.streakDays));
    setTextById(`detail${prefix}Games`, formatNumber(playedValue || 0));
    setTextById(`detail${prefix}LevelBadge`, `Level ${state.level || 1}`);
    setTextById(`detail${prefix}ProgressLabel`, `${formatNumber(progress.current)} / ${progress.span} pts to reach level ${progress.nextLevel}`);
    setTextById(`detail${prefix}NextReward`, progress.untilNext > 0 ? `Earn ${formatNumber(progress.untilNext)} pts to unlock your next scratch card.` : 'You have a reward waiting at the next level.');
    updateProgressFill(`detail${prefix}ProgressBar`, progress.percent);
  }

  function hydrateMemoryDetail(state){
    const stats = state.stats?.memoryMatrix || {};
    hydrateSharedDetail('Memory', state, stats.played || 0);
    setTextById('detailMemoryBestScore', formatNumber(stats.bestScore || 0));
    setTextById('detailMemoryBestRound', formatNumber(stats.bestLevel || 0));
    setTextById('detailMemoryPlayed', formatNumber(stats.played || 0));
    setTextById('detailMemoryBadges', formatNumber(countBadges(state, GAME_BADGE_IDS.memoryMatrix)));
    const badgeHint = pickBadgeHint(state, 'memoryMatrix');
    setTextById('detailMemoryBadgeTitle', badgeHint.title);
    setTextById('detailMemoryBadgeDesc', badgeHint.desc);
    updateQuestProgress('memoryMatrix', stats);
  }

  function hydrateColorDetail(state){
    const stats = state.stats?.colorStorm || {};
    hydrateSharedDetail('Color', state, stats.played || 0);
    setTextById('detailColorBestScore', formatNumber(stats.bestScore || 0));
    setTextById('detailColorAccuracy', `${Math.round(stats.bestAccuracy || 0)}%`);
    setTextById('detailColorPlayed', formatNumber(stats.played || 0));
    setTextById('detailColorBadges', formatNumber(countBadges(state, GAME_BADGE_IDS.colorStorm)));
    const badgeHint = pickBadgeHint(state, 'colorStorm');
    setTextById('detailColorBadgeTitle', badgeHint.title);
    setTextById('detailColorBadgeDesc', badgeHint.desc);
    updateQuestProgress('colorStorm', stats);
  }

  function hydrateFlowDetail(state){
    const stats = state.stats?.focusFlow || {};
    hydrateSharedDetail('Flow', state, stats.played || 0);
    setTextById('detailFlowBestStreak', formatNumber(stats.longestStreak || 0));
    setTextById('detailFlowFocusRate', `${Math.round(stats.bestFocusRate || 0)}%`);
    setTextById('detailFlowAvg', formatDurationShort(stats.avgDuration || 0));
    setTextById('detailFlowPlayed', formatNumber(stats.played || 0));
    const badgeHint = pickBadgeHint(state, 'focusFlow');
    setTextById('detailFlowBadgeTitle', badgeHint.title);
    setTextById('detailFlowBadgeDesc', badgeHint.desc);
    updateQuestProgress('focusFlow', stats);
  }

  function hydratePatternDetail(state){
    const stats = state.stats?.patternPulse || {};
    hydrateSharedDetail('Pattern', state, stats.played || 0);
    setTextById('detailPatternBestScore', formatNumber(stats.bestScore || 0));
    setTextById('detailPatternPerfectRounds', formatNumber(stats.perfectRounds || 0));
    setTextById('detailPatternPlayed', formatNumber(stats.played || 0));
    setTextById('detailPatternBadges', formatNumber(countBadges(state, GAME_BADGE_IDS.patternPulse)));
    const badgeHint = pickBadgeHint(state, 'patternPulse');
    setTextById('detailPatternBadgeTitle', badgeHint.title);
    setTextById('detailPatternBadgeDesc', badgeHint.desc);
    updateQuestProgress('patternPulse', stats);
  }

  function updateQuestProgress(gameKey, stats){
    const quest = QUEST_TARGETS[gameKey];
    const prefix = GAME_KEY_PREFIX[gameKey];
    if(!quest || !prefix) return;
    const metricValue = Number(stats?.[quest.metric]) || 0;
    const percent = quest.target ? clamp(metricValue / quest.target, 0, 1) * 100 : 0;
    const currentLabel = quest.type === 'percent' ? `${Math.min(quest.target, Math.round(metricValue))}%` : formatNumber(Math.min(metricValue, quest.target));
    const targetLabel = quest.type === 'percent' ? `${quest.target}%` : formatNumber(quest.target);
    setTextById(`detail${prefix}QuestProgressLabel`, `${currentLabel} / ${targetLabel} ${quest.label}`);
    updateProgressFill(`detail${prefix}QuestProgressBar`, percent);
  }

  function setFocusHubMode(){
    if(!focusShell) return;
    FocusCoach.stop({ resetAll: true, silent: true });
     FocusStage.releaseAll();
    Object.keys(toggleButtonGroups).forEach(key => setToggleLabel(key, 'pause'));
    focusShell.setAttribute('data-focus-state', 'hub');
    focusShell.setAttribute('data-active-game', '');
    activeFocusGame = '';
    if(focusHubView) focusHubView.setAttribute('aria-hidden', 'false');
    focusGameScreens.forEach(section => section.setAttribute('aria-hidden', 'true'));
    focusGameButtons.forEach(btn => {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-pressed', 'false');
    });
  }

  function selectFocusGameButton(targetBtn, gameKey){
    focusGameButtons.forEach(btn => {
      const isActive = targetBtn ? btn === targetBtn : btn.dataset.focusGame === gameKey;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function openFocusGame(gameKey, triggerBtn){
    if(!focusShell || !gameKey) return;
    focusShell.setAttribute('data-focus-state', 'game');
    focusShell.setAttribute('data-active-game', gameKey);
    activeFocusGame = gameKey;
    FocusStage.mount(gameKey);
    if(focusHubView) focusHubView.setAttribute('aria-hidden', 'true');
    focusGameScreens.forEach(section => section.setAttribute('aria-hidden', section.dataset.gameScreen === gameKey ? 'false' : 'true'));
    selectFocusGameButton(triggerBtn, gameKey);

    const state = cachedGameState || window.GameState;
    if(state){
      hydrateGameDetail(gameKey, state);
    } else {
      waitForGameState().then(gs => {
        hydrateGameDetail(gameKey, gs);
      });
    }
  }

  function scrollToGameCard(gameKey, { smooth = true } = {}){
    const selector = GAME_SCROLL_TARGETS[gameKey];
    if(!selector) return;
    const target = document.querySelector(selector);
    if(!target) return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
      if(typeof target.setAttribute === 'function'){
        target.setAttribute('tabindex', '-1');
        if(typeof target.focus === 'function'){
          target.focus({ preventScroll: true });
        }
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    });
  }

  function jumpToGameFromModal(gameKey){
    if(!gameKey) return;
    closeModal();
    setTimeout(() => scrollToGameCard(gameKey), 220);
  }

  function scrollFocusShellIntoView(){
    if(!focusShell) return;
    const offset = 72;
    const targetTop = window.scrollY + focusShell.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  }

  function autoStartFocusGame(gameKey, { triggerBtn = null, autoScroll = false } = {}){
    if(!gameKey) return;
    FocusCoach.stop({ silent: true });
    openFocusGame(gameKey, triggerBtn);
    FocusCoach.start(gameKey);
    setToggleLabel(gameKey, 'pause');
    if(autoScroll) scrollFocusShellIntoView();
  }

  const FocusStage = (() => {
    const ROOTS = {
      memoryMatrix: {
        selector: '#memoryMatrixGame .memory-matrix-container',
        placeholder: '<strong>Memory Matrix</strong> is live in the Focus Screen. Close it when you are done.'
      },
      colorStorm: {
        selector: '#colorStormGame .color-storm-container',
        placeholder: '<strong>Color Storm</strong> controls moved to the Focus Screen until you exit.'
      },
      focusFlow: {
        selector: '#focusFlowGame .focus-flow-container',
        placeholder: '<strong>Focus Flow</strong> is active in the Focus Screen.'
      },
      patternPulse: {
        selector: '#patternPulseGame .pattern-pulse-container',
        placeholder: '<strong>Pattern Pulse</strong> pads are live in the Focus Screen.'
      }
    };

    const mounts = {};

    function getStageBody(gameKey){
      return document.querySelector(`[data-focus-stage-body="${gameKey}"]`);
    }

    function ensurePlaceholder(entry){
      const node = document.createElement('div');
      node.className = 'focus-live-placeholder';
      node.innerHTML = entry.placeholder || 'Live game now running inside the focus screen.';
      return node;
    }

    function mount(gameKey){
      const entry = ROOTS[gameKey];
      if(!entry) return;
      const root = document.querySelector(entry.selector);
      const stageBody = getStageBody(gameKey);
      if(!root || !stageBody) return;

      Object.keys(mounts).forEach(key => {
        if(key !== gameKey) release(key);
      });

      const record = mounts[gameKey] || (mounts[gameKey] = {});
      if(!record.originalParent){
        record.originalParent = root.parentElement;
        record.originalNext = root.nextSibling;
      }
      record.placeholder = record.placeholder || ensurePlaceholder(entry);
      record.stageBody = stageBody;
      record.root = root;

      stageBody.innerHTML = '';
      stageBody.appendChild(root);

      const { originalParent, originalNext, placeholder } = record;
      if(originalParent && placeholder){
        if(originalNext && originalParent.contains(originalNext)){
          originalParent.insertBefore(placeholder, originalNext);
        } else {
          originalParent.appendChild(placeholder);
        }
      }
    }

    function release(gameKey){
      const record = mounts[gameKey];
      if(!record) return;
      stopFocusGame(gameKey, { silent: true });
      const { root, originalParent, originalNext, placeholder, stageBody } = record;
      if(root && originalParent){
        if(originalNext && originalParent.contains(originalNext)){
          originalParent.insertBefore(root, originalNext);
        } else {
          originalParent.appendChild(root);
        }
      }
      if(placeholder && placeholder.parentNode){
        placeholder.remove();
      }
      if(stageBody){
        const fallback = stageBody.dataset.focusStageEmpty || 'Press Start to bring the live game in here.';
        stageBody.innerHTML = `<p class="focus-live-stage__empty">${fallback}</p>`;
      }
      delete mounts[gameKey];
    }

    function releaseAll(){
      Object.keys(mounts).forEach(release);
    }

    function startGame(gameKey, { scrollIntoView = true } = {}){
      const starter = GAME_STARTERS[gameKey];
      if(typeof starter === 'function') starter();
      if(scrollIntoView){
        const stageBody = getStageBody(gameKey);
        if(stageBody){
          stageBody.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }

    function launch(gameKey, options){
      mount(gameKey);
      startGame(gameKey, options);
    }

    function restart(gameKey){
      stopFocusGame(gameKey, { silent: true });
      launch(gameKey);
    }

    function reset(gameKey){
      stopFocusGame(gameKey, { silent: true });
      mount(gameKey);
      startGame(gameKey, { scrollIntoView: false });
    }

    return { mount, launch, restart, reset, release, releaseAll };
  })();

  const FocusLaunchIndicators = (() => {
    const cards = {};
    $$('[data-focus-game]').forEach(card => {
      const key = card?.dataset?.focusGame;
      if (key) cards[key] = card;
    });

    function setActive(gameKey) {
      Object.entries(cards).forEach(([key, el]) => {
        if (!el) return;
        el.classList.toggle('focus-game-link--live', key === gameKey);
      });
    }

    function clear() {
      Object.values(cards).forEach(el => el?.classList?.remove('focus-game-link--live'));
    }

    return { setActive, clear };
  })();

  const FocusDemo = (() => {
    let activeKey = null;
    let activeController = null;

    const demoState = {};

    const defaultPattern = [0, 4, 8];

    function createController() {
      return { cancelled: false, timers: [] };
    }

    function clearTimers(ctrl) {
      (ctrl?.timers || []).forEach(entry => {
        clearTimeout(entry.id);
        if (typeof entry.resolve === 'function') entry.resolve();
      });
      if (ctrl) ctrl.timers = [];
    }

    function wait(ms, ctrl) {
      if (!ctrl || ctrl.cancelled) return Promise.resolve();
      return new Promise(resolve => {
        const entry = { id: null, resolve };
        entry.id = setTimeout(() => {
          ctrl.timers = (ctrl.timers || []).filter(item => item !== entry);
          resolve();
        }, ms);
        ctrl.timers = ctrl.timers || [];
        ctrl.timers.push(entry);
      });
    }

    function ensureMemoryMatrixGrid() {
      const grid = document.getElementById('memoryMatrixGrid');
      if (!grid) return null;
      if (!grid.childElementCount) {
        for (let i = 0; i < 9; i++) {
          const cell = document.createElement('div');
          cell.className = 'matrix-cell matrix-cell--demo';
          cell.dataset.demoIndex = i;
          grid.appendChild(cell);
        }
      }
      return grid;
    }

    function getMatrixCell(grid, index) {
      return grid.querySelector(`[data-index="${index}"]`) || grid.querySelector(`[data-demo-index="${index}"]`);
    }

    async function runMemoryMatrix(ctrl) {
      const grid = ensureMemoryMatrixGrid();
      if (!grid) return;
      for (const idx of defaultPattern) {
        if (ctrl.cancelled) break;
        const cell = getMatrixCell(grid, idx);
        if (!cell) continue;
        cell.classList.add('demo-highlight');
        await wait(500, ctrl);
        cell.classList.remove('demo-highlight');
        await wait(200, ctrl);
      }
      await wait(600, ctrl);
    }

    async function runColorStorm(ctrl) {
      const wordEl = document.getElementById('colorStormWord');
      const modeEl = document.getElementById('colorStormMode');
      const yesBtn = document.getElementById('colorStormYes');
      const noBtn = document.getElementById('colorStormNo');
      if (!wordEl || !modeEl || !yesBtn || !noBtn) return;

      demoState.colorStorm = {
        wordEl,
        modeEl,
        yesBtn,
        noBtn,
        wordText: wordEl.textContent,
        wordColor: wordEl.style.color,
        modeText: modeEl.textContent
      };

      modeEl.textContent = 'Demo · Match rule';
      wordEl.textContent = 'GREEN';
      wordEl.style.color = '#2ecc71';
      yesBtn.classList.add('demo-highlight');
      await wait(1400, ctrl);
      yesBtn.classList.remove('demo-highlight');

      if (ctrl.cancelled) return;
      modeEl.textContent = 'Demo · Mismatch rule';
      wordEl.textContent = 'BLUE';
      wordEl.style.color = '#e74c3c';
      noBtn.classList.add('demo-highlight');
      await wait(1400, ctrl);
      noBtn.classList.remove('demo-highlight');
      await wait(400, ctrl);
    }

    async function runFocusFlow(ctrl) {
      const container = document.querySelector('#focusFlowGame .focus-flow-container');
      if (!container) return;
      container.classList.add('focus-flow-demo-mode');
      let demoOrb = container.querySelector('.focus-flow-demo');
      if (!demoOrb) {
        demoOrb = document.createElement('div');
        demoOrb.className = 'focus-flow-demo';
        container.appendChild(demoOrb);
      }
      demoState.focusFlow = { container, demoOrb };
      demoOrb.classList.add('is-active');
      await wait(3200, ctrl);
    }

    function ensurePatternButtons() {
      const container = document.getElementById('patternPulseButtons');
      if (!container) return null;
      if (!container.childElementCount) {
        const colours = (window.PatternPulse && window.PatternPulse.colors) || ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
        colours.forEach((color, index) => {
          const btn = document.createElement('button');
          btn.className = 'pulse-button pulse-button--demo';
          btn.style.backgroundColor = color;
          btn.dataset.demoIndex = index;
          container.appendChild(btn);
        });
      }
      return container;
    }

    async function runPatternPulse(ctrl) {
      const container = ensurePatternButtons();
      if (!container) return;
      const buttons = container.querySelectorAll('.pulse-button, .pulse-button--demo');
      for (const btn of buttons) btn.classList.remove('pulse-active');
      const pattern = [0, 1, 3, 2];
      for (const idx of pattern) {
        if (ctrl.cancelled) break;
        const target = buttons[idx];
        if (!target) continue;
        target.classList.add('pulse-active');
        await wait(350, ctrl);
        target.classList.remove('pulse-active');
        await wait(200, ctrl);
      }
      await wait(600, ctrl);
    }

    const demoHandlers = {
      memoryMatrix: runMemoryMatrix,
      colorStorm: runColorStorm,
      focusFlow: runFocusFlow,
      patternPulse: runPatternPulse
    };

    function cleanup(gameKey) {
      switch (gameKey) {
        case 'memoryMatrix': {
          const grid = document.getElementById('memoryMatrixGrid');
          grid?.querySelectorAll('.demo-highlight').forEach(cell => cell.classList.remove('demo-highlight'));
          break;
        }
        case 'colorStorm': {
          const state = demoState.colorStorm;
          if (state) {
            state.wordEl.textContent = state.wordText;
            state.wordEl.style.color = state.wordColor;
            state.modeEl.textContent = state.modeText;
            state.yesBtn.classList.remove('demo-highlight');
            state.noBtn.classList.remove('demo-highlight');
          }
          delete demoState.colorStorm;
          break;
        }
        case 'focusFlow': {
          const state = demoState.focusFlow;
          if (state?.container) {
            state.container.classList.remove('focus-flow-demo-mode');
          }
          if (state?.demoOrb) {
            state.demoOrb.classList.remove('is-active');
          }
          delete demoState.focusFlow;
          break;
        }
        case 'patternPulse': {
          const container = document.getElementById('patternPulseButtons');
          container?.querySelectorAll('.pulse-button, .pulse-button--demo').forEach(btn => btn.classList.remove('pulse-active'));
          break;
        }
        default:
          break;
      }
    }

    async function run(gameKey) {
      stop();
      const handler = demoHandlers[gameKey];
      if (typeof handler !== 'function') return Promise.resolve();
      const controller = createController();
      activeKey = gameKey;
      activeController = controller;
      await handler(controller);
      if (activeController === controller) {
        cleanup(gameKey);
        activeKey = null;
        activeController = null;
      }
    }

    function stop() {
      if (activeController) {
        activeController.cancelled = true;
        clearTimers(activeController);
      }
      if (activeKey) {
        cleanup(activeKey);
      }
      activeKey = null;
      activeController = null;
    }

    return { run, stop };
  })();

  const FocusCoach = (() => {
    let activeGame = null;
    let liveGame = null;
    let countdown = 0;
    let countdownTimer = null;
    let paused = false;
    let narrationToken = 0;
    const countdownDisplays = {};
    const statusDisplays = {};
    const defaultCountdown = 'Ready';
    const defaultStatus = 'Voice coach ready when you are.';

    function registerDisplays(){
      $$('[data-focus-countdown]').forEach(el => {
        const key = el?.dataset?.focusCountdown;
        if(key) countdownDisplays[key] = el;
      });
      $$('[data-focus-status]').forEach(el => {
        const key = el?.dataset?.focusStatus;
        if(key) statusDisplays[key] = el;
      });
      resetDisplays();
    }

    function resetDisplays(){
      Object.values(countdownDisplays).forEach(el => { el.textContent = defaultCountdown; });
      Object.values(statusDisplays).forEach(el => { el.textContent = defaultStatus; });
      activeGame = null;
      liveGame = null;
      countdown = 0;
      paused = false;
      narrationToken++;
      if(countdownTimer) clearInterval(countdownTimer);
      countdownTimer = null;
      Object.keys(toggleButtonGroups).forEach(key => setToggleLabel(key, 'pause'));
      FocusDemo.stop();
      FocusLaunchIndicators.clear();
    }

    function updateCountdown(gameKey, value){
      const target = countdownDisplays[gameKey];
      if(target){
        target.textContent = typeof value === 'number' ? value : (value || defaultCountdown);
      }
    }

    function updateStatus(gameKey, text){
      const target = statusDisplays[gameKey];
      if(target){
        target.textContent = text || defaultStatus;
      }
    }

    function speakCoachNarration(gameKey){
      const script = GAME_COACH_SCRIPTS[gameKey] || GAME_COACH_SCRIPTS.default;
      cancelAllNarration();
      if(!script) return Promise.resolve();
      return speakText(script);
    }

    function start(gameKey){
      if(!gameKey) return;
      if(activeGame && activeGame !== gameKey){
        stop({ silent: true });
      }
      if(activeFocusGame !== gameKey){
        openFocusGame(gameKey);
      }
      FocusStage.mount(gameKey);
      FocusLaunchIndicators.clear();
      activeGame = gameKey;
      liveGame = null;
      paused = false;
      updateCountdown(gameKey, defaultCountdown);
      updateStatus(gameKey, 'Coach briefing in progress. Begin after the 3-second timer.');
      const startToken = ++narrationToken;
      FocusDemo.stop();
      const launchCountdown = () => startCountdown(gameKey, startToken);
      const narration = speakCoachNarration(gameKey);
      const demo = FocusDemo.run(gameKey);
      const tasks = [narration, demo].filter(p => p && typeof p.then === 'function').map(p => p.catch(()=>{}));
      if(tasks.length){
        Promise.all(tasks).finally(launchCountdown);
      } else {
        launchCountdown();
      }
    }

    function startCountdown(gameKey, token){
      if(token !== narrationToken || activeGame !== gameKey) return;
      countdown = FOCUS_COACH_SECONDS;
      updateCountdown(gameKey, countdown);
      updateStatus(gameKey, 'Countdown live. Begin after the 3-second timer.');
      if(countdownTimer) clearInterval(countdownTimer);
      countdownTimer = setInterval(() => {
        if(paused) return;
        countdown -= 1;
        if(countdown > 0){
          updateCountdown(gameKey, countdown);
          return;
        }
        if(countdown === 0){
          updateCountdown(gameKey, 'Go');
          return;
        }
        clearInterval(countdownTimer);
        countdownTimer = null;
        finish(gameKey);
      }, 1000);
    }

    function finish(gameKey){
      updateCountdown(gameKey, 'Live');
      updateStatus(gameKey, 'You are live in this focus view. Keep your attention here.');
      activeGame = null;
      liveGame = gameKey;
      countdown = 0;
      paused = false;
      countdownTimer = null;
      FocusDemo.stop();
      FocusLaunchIndicators.setActive(gameKey);
      FocusStage.launch(gameKey);
    }

    function pause(gameKey){
      if(!activeGame || (gameKey && gameKey !== activeGame) || paused) return;
      paused = true;
      try {
        if(supportsTTS && speechSynthesis.pause) speechSynthesis.pause();
      } catch {}
      updateStatus(activeGame, 'Countdown paused. Resume when you are ready.');
    }

    function resume(gameKey){
      if(!activeGame || (gameKey && gameKey !== activeGame) || !paused) return;
      paused = false;
      try {
        if(supportsTTS && speechSynthesis.resume) speechSynthesis.resume();
      } catch {}
      updateStatus(activeGame, 'Countdown resumed. Stay loose.');
    }

    function toggle(gameKey){
      if(!gameKey) return 'idle';
      if(activeGame && gameKey === activeGame){
        if(paused){
          resume(gameKey);
          return 'resumed';
        }
        pause(gameKey);
        return 'paused';
      }
      if(liveGame === gameKey){
        updateStatus(gameKey, 'Live run in progress. Use Restart for a fresh board or Stop to exit.');
        return 'live';
      }
      updateStatus(gameKey, 'Press Start to begin a new guided countdown.');
      return 'idle';
    }

    function reset(gameKey){
      if(!gameKey) return;
      const wasActive = activeGame === gameKey;
      const wasLive = liveGame === gameKey;
      stop({ silent: true });
      if(wasActive || wasLive){
        start(gameKey);
      } else {
        updateCountdown(gameKey, defaultCountdown);
        updateStatus(gameKey, 'Coach reset. Press start to begin again.');
      }
    }

    function stop(options = {}){
      narrationToken++;
      if(countdownTimer) clearInterval(countdownTimer);
      countdownTimer = null;
      if(activeGame && !options.resetAll){
        updateCountdown(activeGame, defaultCountdown);
        updateStatus(activeGame, options.silent ? defaultStatus : 'Coach stopped. Press start when ready.');
      }
      const targets = [];
      if(activeGame) targets.push(activeGame);
      if(liveGame && liveGame !== activeGame) targets.push(liveGame);
      targets.forEach(key => stopFocusGame(key, { silent: true }));
      if(options.resetAll){
        liveGame = null;
      }
      activeGame = null;
      countdown = 0;
      paused = false;
      cancelAllNarration();
      FocusDemo.stop();
      FocusLaunchIndicators.clear();
      if(options.resetAll){
        resetDisplays();
      }
    }

    function stopFor(gameKey){
      if(activeGame && gameKey === activeGame){
        stop();
      }
      if(liveGame === gameKey){
        liveGame = null;
      }
      stopFocusGame(gameKey);
      updateCountdown(gameKey, defaultCountdown);
      updateStatus(gameKey, 'Coach stopped. Press start when ready.');
      cancelAllNarration();
      FocusDemo.stop();
      FocusLaunchIndicators.clear();
    }

    function skip(gameKey){
      if(!gameKey) return;
      stop({ silent: true });
      FocusStage.launch(gameKey);
      reflectLive(gameKey, 'Skip engaged. You are live immediately.');
    }

    function reflectLive(gameKey, message){
      if(!gameKey) return;
      liveGame = gameKey;
      updateCountdown(gameKey, 'Live');
      updateStatus(gameKey, message || 'Manual launch active in this view.');
      FocusLaunchIndicators.setActive(gameKey);
    }

    return { start, pause, resume, reset, stop, stopFor, skip, toggle, reflectLive, registerDisplays, resetDisplays };
  })();

  FocusCoach.registerDisplays();

  function getActiveVoiceProfile(){
    const manual = voiceGenderSelect?.value;
    return normalizeVoiceProfile(manual || currentVoiceProfile);
  }

  function syncVoiceSelect(){
    if (!voiceGenderSelect) return;
    const desired = currentVoiceProfile === 'female' ? 'female' : 'uk-male';
    if (voiceGenderSelect.value !== desired){
      voiceGenderSelect.value = desired;
    }
  }

  if (voiceGenderSelect){
    syncVoiceSelect();
  }

  if (VoicePrefs && typeof VoicePrefs.subscribe === 'function'){
    VoicePrefs.subscribe(value => {
      currentVoiceProfile = normalizeVoiceProfile(value);
      syncVoiceSelect();
      refreshVoiceStatus();
    });
  }

  // ======= TTS Functions =======
  function cancelAllNarration(){
    try { if (supportsTTS) speechSynthesis.cancel(); } catch {}
  }

  async function ensureVoicesReady(){
    if(!supportsTTS) return [];
    let voices = speechSynthesis.getVoices();
    if(voices.length) return voices;
    await new Promise(resolve => {
      const onv = () => { speechSynthesis.removeEventListener('voiceschanged', onv); resolve(); };
      speechSynthesis.addEventListener('voiceschanged', onv);
      speechSynthesis.getVoices();
      setTimeout(resolve, 500);
    });
    return speechSynthesis.getVoices();
  }

  function selectVoice(voices, gender){
    const lower = s => (s||'').toLowerCase();
    const gb = voices.filter(v => lower(v.lang).startsWith('en-gb'));
    const femaleHints = [/female/i, /sonia/i, /serena/i, /libby/i, /kate/i, /emma/i];
    const maleHints   = [/male/i, /daniel/i, /george/i, /arthur/i, /ryan/i, /brian/i];
    const hints = gender === 'female' ? femaleHints : maleHints;

    const byHintGb = gb.find(v => hints.some(h=>h.test(v.name)));
    if(byHintGb) return { voice: byHintGb, simulated: false };
    if(gb[0]) return { voice: gb[0], simulated: true };

    const en = voices.filter(v => /^en-/i.test(v.lang||''));
    const byHintEn = en.find(v => hints.some(h=>h.test(v.name)));
    if(byHintEn) return { voice: byHintEn, simulated: false };
    if(en[0]) return { voice: en[0], simulated: true };

    return { voice: voices[0] || null, simulated: true };
  }

  async function getVoiceForGender(gender){
    if(!supportsTTS) return { voice: null, simulated: false };
    const voices = await ensureVoicesReady();
    return selectVoice(voices, gender);
  }

  async function refreshVoiceStatus(){
    if(!supportsTTS){ voiceStatus.textContent = 'No system TTS available.'; return; }
    const profile = getActiveVoiceProfile();
    const gender = profileToGender(profile);
    const {voice, simulated} = await getVoiceForGender(gender);
    if(voice){
      voiceStatus.textContent = `${voice.name} • ${voice.lang}${simulated ? ' (simulated)' : ''}`;
    } else {
      voiceStatus.textContent = 'No voice found.';
    }
  }

  async function speakInstruction(){
    cancelAllNarration();
    const text = 'Pick a warm-up technique. We will start your session and run the technique with default timings.';
    await speakText(text);
  }

  async function speakText(text){
    const profile = getActiveVoiceProfile();
    const gender = profileToGender(profile);
    if(!supportsTTS){
      return Promise.resolve();
    }
    const {voice, simulated} = await getVoiceForGender(gender);
    return new Promise(resolve => {
      const u = new SpeechSynthesisUtterance(text);
      if(voice) u.voice = voice;
      u.lang = (voice && voice.lang) || 'en-GB';
      u.rate = 1.0;
      u.pitch = gender==='female' ? (simulated ? 1.18 : 1.05) : (simulated ? 0.88 : 0.95);
      const finish = () => {
        u.onend = null;
        u.onerror = null;
        resolve();
      };
      u.onend = finish;
      u.onerror = finish;
      try {
        speechSynthesis.speak(u);
      } catch(err) {
        finish();
      }
    });
  }

  async function speakCue(phase){
    cancelAllNarration();
    const profile = getActiveVoiceProfile();
    const gender = profileToGender(profile);
    const phrase = (phase||'').toString();
    if(supportsTTS){
      const {voice, simulated} = await getVoiceForGender(gender);
      const u = new SpeechSynthesisUtterance(phrase);
      if(voice) u.voice = voice;
      u.lang = (voice && voice.lang) || 'en-GB';
      u.rate = 0.95;
      if(gender==='female') u.pitch = simulated ? 1.20 : 1.06; 
      else u.pitch = simulated ? 0.86 : 0.92;
      try { speechSynthesis.speak(u); } catch {}
    }
  }

  async function speakVoiceTest(){
    const profile = getActiveVoiceProfile();
    const gender = profileToGender(profile);
    if(supportsTTS){
      const {voice, simulated} = await getVoiceForGender(gender);
      const mk = (txt) => {
        const u = new SpeechSynthesisUtterance(txt);
        if(voice) u.voice = voice; u.lang = (voice && voice.lang) || 'en-GB'; u.rate = 0.95;
        u.pitch = gender==='female' ? (simulated ? 1.18 : 1.06) : (simulated ? 0.88 : 0.92);
        return u;
      };
      const phrases = ['Voice check.', 'Inhale.', 'Hold.', 'Exhale.'];
      try {
        phrases.forEach(p=> speechSynthesis.speak(mk(p)));
      } catch {}
    }
  }

  // --- Modal Functions ---
  function openModal() {
    setFocusHubMode();
    const state = cachedGameState || window.GameState;
    if(state){
      hydrateFocusHub(state);
    } else {
      waitForGameState().then(hydrateFocusHub);
    }
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const firstTechnique = modal.querySelector('.technique-option');
      if (firstTechnique) firstTechnique.focus();
    }, 100);
  }

  function closeModal() {
    setFocusHubMode();
    FocusCoach.stop({ resetAll: true, silent: true });
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.hidden = true;
      document.body.style.overflow = '';
    }, 250);
    cancelAllNarration();
    stopSession();
  }

  function selectTechnique(techOption) {
    techniqueOptions.forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('selected');
      const badge = btn.querySelector('.badge');
      if (badge) badge.remove();
    });

    techOption.setAttribute('aria-pressed', 'true');
    techOption.classList.add('selected');
    
    const badge = document.createElement('span');
    badge.className = 'badge selected-badge';
    badge.textContent = 'Selected';
    techOption.appendChild(badge);

    selectedTechnique = techOption.getAttribute('data-tech-option');
  }

  function selectDuration(durationBtn) {
    durationButtons.forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('selected');
    });

    durationBtn.setAttribute('aria-pressed', 'true');
    durationBtn.classList.add('selected');

    selectedDuration = parseInt(durationBtn.getAttribute('data-duration'), 10);
    sessionTotalMs = selectedDuration * 60000; // Convert minutes to milliseconds
  }

  // --- Breathing Session Engine ---
  function startSession(key){
    cancelAllNarration();
    
    // Show session area and update button visibility
    if(sessionArea) sessionArea.classList.remove('hidden');
    if(confirmBtn) confirmBtn.classList.add('hidden');
    if(cancelBtn) cancelBtn.textContent = 'Close';
    if(toggleBtn) toggleBtn.classList.remove('hidden');
    if(stopBtn) stopBtn.classList.remove('hidden');
    if(restartBtn) restartBtn.classList.remove('hidden');
    
    const tech = techniques[key];
    const sessionTitle = $('#quick-start-technique-title');
    const phaseLabel = $('#breathing-phase-label');
    const viz = $('#breathing-viz');
    
    if(sessionTitle) sessionTitle.textContent = tech.title;
    
    engine = tech.setup ? tech.setup(viz) : null;
    const legend = $('#breathing-legend');
    if(legend) legend.innerHTML = engine && engine.legend ? engine.legend : '';

    stopped = false;
    const now0 = performance.now();
    startTime = now0; window.overallSessionProgress = 0;
    phaseIndex = 0; phaseStart = now0;
    phaseDurMs = tech.phases[0][1]*1000;
    running = true;
    
    const firstName = tech.phases[0][0];
    if(phaseLabel) phaseLabel.textContent = `${firstName}…`;
    if(toggleBtn) toggleBtn.textContent = 'Pause';
    speakCue(firstName);

    cancelAnimationFrame(raf); 
    raf = requestAnimationFrame(tick);

    function tick(now){
      if(!running){ raf = requestAnimationFrame(tick); return; }
      const elapsed = now - startTime;
      window.overallSessionProgress = Math.min(1, elapsed / sessionTotalMs);
      const [name] = tech.phases[phaseIndex];
      const tInPhase = now - phaseStart;
      const tNorm = Math.min(1, tInPhase / phaseDurMs);
      
      if(engine && engine.update){ engine.update(name, tNorm, tInPhase/1000); }
      if(phaseLabel) phaseLabel.textContent = `${name}…`;
      
      const prog = $('#breathing-progress');
      if(prog) prog.value = window.overallSessionProgress;

      if(tInPhase >= phaseDurMs){
        window.lastPhase = name;
        phaseIndex = (phaseIndex + 1) % tech.phases.length;
        const [n2, s2] = tech.phases[phaseIndex];
        phaseDurMs = s2*1000; phaseStart = now;
        speakCue(n2);
      }

      if(elapsed >= sessionTotalMs){
        running = false; 
        if(phaseLabel) phaseLabel.textContent = 'Session complete';
        if(toggleBtn) toggleBtn.textContent='Restart';
      }
      raf = requestAnimationFrame(tick);
    }
  }

  function stopSession(){
    running = false; stopped = true; 
    cancelAnimationFrame(raf);
    window.overallSessionProgress = 0;
    cancelAllNarration();
    
    // Reset UI
    if(sessionArea) sessionArea.classList.add('hidden');
    if(confirmBtn) confirmBtn.classList.remove('hidden');
    if(cancelBtn) cancelBtn.textContent = 'Cancel';
    if(toggleBtn) toggleBtn.classList.add('hidden');
    if(stopBtn) stopBtn.classList.add('hidden');
    if(restartBtn) restartBtn.classList.add('hidden');
    
    const sessionTitle = $('#quick-start-technique-title');
    if(sessionTitle) sessionTitle.textContent = 'Choose a breathing technique';
  }

  function toggleSession(){
    if(!running){
      if(window.overallSessionProgress >= 1 || stopped){ 
        startSession(selectedTechnique); 
        return; 
      }
      running = true; 
      if(toggleBtn) toggleBtn.textContent = 'Pause';
      startTime += (performance.now() - pauseTime);
      const tech = techniques[selectedTechnique]; 
      const [n2] = tech.phases[phaseIndex]; 
      speakCue(n2);
    } else {
      running = false; 
      if(toggleBtn) toggleBtn.textContent = 'Resume';
      pauseTime = performance.now();
      cancelAllNarration();
    }
  }

  // Create player UI dynamically
  function createPlayerUI(){
    // No longer needed - UI is in modal
  }

  // Start breathing session
  function startBreathingSession() {
    startSession(selectedTechnique);
  }

  // --- Event Listeners ---
  const openTriggers = [openBtn, ...openExtras].filter(Boolean);
  openTriggers.forEach(btn => btn.addEventListener('click', openModal));
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if(confirmBtn) confirmBtn.addEventListener('click', startBreathingSession);

  techniqueOptions.forEach(option => {
    option.addEventListener('click', function() {
      selectTechnique(this);
    });
  });

  durationButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      selectDuration(this);
    });
  });

  focusGameButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      autoStartFocusGame(btn.dataset.focusGame, { triggerBtn: btn });
    });
  });

  focusBackButtons.forEach(btn => btn.addEventListener('click', setFocusHubMode));

  focusGameScrollButtons.forEach(btn => {
    btn.addEventListener('click', () => jumpToGameFromModal(btn.dataset.gameScroll));
  });

  focusStartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.focusStart;
      FocusCoach.start(key);
      setToggleLabel(key, 'pause');
    });
  });

  focusToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.focusToggle;
      const state = FocusCoach.toggle(key);
      if(state === 'paused') setToggleLabel(key, 'continue');
      if(state === 'resumed' || state === 'live' || state === 'idle') setToggleLabel(key, 'pause');
    });
  });

  focusResetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.focusReset;
      FocusCoach.reset(key);
      setToggleLabel(key, 'pause');
    });
  });

  focusRestartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.focusRestart;
      FocusStage.restart(key);
      FocusCoach.reflectLive(key, 'Manual restart triggered. Keep your attention here.');
      setToggleLabel(key, 'pause');
    });
  });

  focusStopButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.focusStop;
      FocusCoach.stopFor(key);
      setToggleLabel(key, 'pause');
    });
  });

  focusSwitchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      FocusStage.releaseAll();
      setFocusHubMode();
      const firstLink = focusShell?.querySelector('.focus-game-link');
      if(firstLink) firstLink.focus();
    });
  });

  focusMainHubButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.focusMainhub || activeFocusGame;
      jumpToGameFromModal(key);
    });
  });

  focusStageResetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.focusStageReset;
      FocusStage.reset(key);
      FocusCoach.reflectLive(key, 'Board reset. Coach stays with you.');
    });
  });

  focusModalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const gameKey = btn.dataset.focusModalGame;
      if(!gameKey) return;
      autoStartFocusGame(gameKey, { autoScroll: true });
    });
  });

  const inlineFocusLaunchers = [
    { selector: '#startMemoryMatrix', gameKey: 'memoryMatrix' },
    { selector: '#startColorStorm', gameKey: 'colorStorm' },
    { selector: '#startFocusFlow', gameKey: 'focusFlow' },
    { selector: '#startPatternPulse', gameKey: 'patternPulse' }
  ];

  inlineFocusLaunchers.forEach(({ selector, gameKey }) => {
    const btn = document.querySelector(selector);
    if(!btn) return;
    btn.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      autoStartFocusGame(gameKey, { autoScroll: true });
    });
  });

  if(focusResetAllButton){
    focusResetAllButton.addEventListener('click', showLifetimeResetConfirm);
  }

  focusResetDecisionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      handleLifetimeResetDecision(btn.dataset.resetConfirm);
    });
  });

  if(toggleBtn) toggleBtn.addEventListener('click', toggleSession);
  if(stopBtn) stopBtn.addEventListener('click', () => {
    stopSession();
    const phaseLabel = $('#breathing-phase-label');
    if(phaseLabel) phaseLabel.textContent = 'Stopped';
  });
  if(restartBtn) restartBtn.addEventListener('click', () => startSession(selectedTechnique));

  if(voiceGenderSelect){
    voiceGenderSelect.addEventListener('change', () => {
      persistVoiceProfile(voiceGenderSelect.value);
      refreshVoiceStatus();
    });
  }
  if(ttsStartBtn) ttsStartBtn.addEventListener('click', speakInstruction);
  if(ttsStopBtn) ttsStopBtn.addEventListener('click', cancelAllNarration);
  if(ttsTestBtn) ttsTestBtn.addEventListener('click', speakVoiceTest);

  // Close on backdrop click
  if(modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
  }

  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    if(focusResetRow?.dataset?.confirmVisible){
      hideLifetimeResetConfirm();
      return;
    }
    if (modal.classList.contains('active')) {
      closeModal();
    }
  });

  window.addEventListener('adhd:state-change', () => {
    const state = window.GameState;
    if(!state) return;
    hydrateFocusHub(state);
    if(activeFocusGame){
      hydrateGameDetail(activeFocusGame, state);
    }
  });

  waitForGameState().then(hydrateFocusHub);

  // Initialize
  if(supportsTTS){
    ensureVoicesReady().then(refreshVoiceStatus);
  } else {
    if(voiceStatus) voiceStatus.textContent = 'No system TTS available.';
  }

})();
