(function(){
  const env = window.__MSHARE__ = window.__MSHARE__ || {};
  const Stats = env.Stats || null;
  const pageId = (env.pageId || document.body?.dataset?.pageId || 'index').toLowerCase();
  const rewardKey = 'nb.rewards.state.v1';

  const TECH_LABELS = {
    'box-4444': 'Box 4-4-4-4',
    'coherent-55': 'Coherent 5-5',
    'four-7-8': '4-7-8 Reset',
    'sos-1m': 'SOS 60s'
  };

  const CHALLENGES = {
    'daily-calm': { id:'daily-calm', name:'Daily Calm', type:'streakMinutes', minSeconds:180, targetDays:5 },
    'focus-sprint': { id:'focus-sprint', name:'Focus Sprint', type:'daysWithSessions', windowDays:7, minSecondsPerDay:180, sessionsPerDay:2, targetDays:4 },
    'sleep-winddown': { id:'sleep-winddown', name:'Sleep Wind-Down', type:'techMinutesWindow', windowDays:7, techIds:['four-7-8','coherent-55'], targetMinutes:15 },
    'school-reset': { id:'school-reset', name:'School / Work Reset', type:'techSessionsWindow', windowDays:7, techIds:['sos-1m'], targetSessions:12 },
    'sensory-track': { id:'sensory-track', name:'Neurodiversity Track', type:'distinctDaysWindow', windowDays:7, daysRequired:4 }
  };

  const REWARDS = {
    'minutes-10': {
      target:10,
      measure: ctx => Math.round((ctx?.snapshot?.totalSeconds || 0) / 60)
    },
    'streak-3': {
      target:3,
      measure: ctx => ctx?.derived?.currentStreak || 0
    },
    'calm-test': {
      target:1,
      measure: ctx => Math.min(1, Math.floor(sumTechSessions(ctx.history, ctx.derived?.techTotals, ['four-7-8','coherent-55'], 7)))
    },
    'toolkit': {
      target:5,
      measure: ctx => Math.round(sumTechSessions(ctx.history, ctx.derived?.techTotals, ['sos-1m'], 14))
    }
  };

  function loadRewardState(){
    try{
      const raw = localStorage.getItem(rewardKey);
      if (!raw) return { unlocked:{} };
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : { unlocked:{} };
    }catch{
      return { unlocked:{} };
    }
  }

  function saveRewardState(state){
    try{ localStorage.setItem(rewardKey, JSON.stringify(state)); }catch{}
  }

  const rewardState = loadRewardState();

  function toDayKey(date){
    if (Stats && typeof Stats.toDayKey === 'function') return Stats.toDayKey(date);
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2,'0');
    const day = String(d.getUTCDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }

  function prevDayKey(key){
    if (!key) return '';
    const parts = key.split('-').map(Number);
    if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return '';
    const dt = new Date(Date.UTC(parts[0], parts[1]-1, parts[2]));
    dt.setUTCDate(dt.getUTCDate() - 1);
    return toDayKey(dt);
  }

  function parseDayKey(key){
    if (!key) return null;
    const parts = key.split('-').map(Number);
    if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return null;
    return new Date(Date.UTC(parts[0], parts[1]-1, parts[2]));
  }

  function approxTechSeconds(record){
    const out = {};
    if (!record || !record.sessions) return out;
    const secondsPerSession = (record.seconds || 0) / Math.max(1, record.sessions);
    const techs = record.techs || {};
    Object.keys(techs).forEach(id => {
      const count = Number(techs[id]) || 0;
      out[id] = count * secondsPerSession;
    });
    return out;
  }

  function sumWindowSeconds(history, windowDays){
    let total = 0;
    if (!history) return total;
    for (let offset=0; offset<windowDays; offset++){
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - offset);
      const record = history[toDayKey(d)];
      if (!record) continue;
      total += Number(record.seconds || 0);
    }
    return total;
  }

  function sumWindowSessions(history, windowDays){
    let total = 0;
    if (!history) return total;
    for (let offset=0; offset<windowDays; offset++){
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - offset);
      const record = history[toDayKey(d)];
      if (!record) continue;
      total += Number(record.sessions || 0);
    }
    return total;
  }

  function countDaysWith(history, windowDays, predicate){
    if (!history) return 0;
    let count = 0;
    for (let offset=0; offset<windowDays; offset++){
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - offset);
      const record = history[toDayKey(d)];
      if (predicate(record)) count += 1;
    }
    return count;
  }

  function sumTechSessions(history, techTotals, techIds, windowDays){
    if (!history || !techIds || !techIds.length) return 0;
    let total = 0;
    for (let offset=0; offset<windowDays; offset++){
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - offset);
      const record = history[toDayKey(d)];
      if (!record) continue;
      techIds.forEach(id => {
        const perDay = Number(record?.techs?.[id]) || 0;
        total += perDay;
      });
    }
    if (!total && techTotals){
      techIds.forEach(id => {
        if (techTotals[id]) total += techTotals[id] / 300;
      });
    }
    return total;
  }

  function techMinutesWindow(history, techIds, windowDays){
    if (!history || !techIds || !techIds.length) return 0;
    let seconds = 0;
    for (let offset=0; offset<windowDays; offset++){
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - offset);
      const record = history[toDayKey(d)];
      if (!record) continue;
      const approx = approxTechSeconds(record);
      techIds.forEach(id => { seconds += approx[id] || 0; });
    }
    return seconds / 60;
  }

  function computeTechTotals(history){
    const totals = {};
    if (!history) return totals;
    Object.keys(history).forEach(dayKey => {
      const contributions = approxTechSeconds(history[dayKey]);
      Object.keys(contributions).forEach(id => {
        totals[id] = (totals[id] || 0) + contributions[id];
      });
    });
    return totals;
  }

  function computeConsecutiveDays(history, minSeconds){
    if (!history) return 0;
    let streak = 0;
    let cursor = toDayKey(new Date());
    for (let i=0; i<60; i++){
      const record = history[cursor];
      if (!record || Number(record.seconds || 0) < minSeconds){
        break;
      }
      streak += 1;
      cursor = prevDayKey(cursor);
      if (!cursor) break;
    }
    return streak;
  }

  function computeBestStreak(history){
    if (!history) return 0;
    const keys = Object.keys(history).sort();
    let best = 0;
    let current = 0;
    let prev = null;
    keys.forEach(key => {
      if (!(history[key]?.sessions)){
        current = 0;
        prev = null;
        return;
      }
      const date = parseDayKey(key);
      if (!prev){
        current = 1;
      } else {
        const diff = Math.round((date - prev) / 86400000);
        current = diff === 1 ? current + 1 : 1;
      }
      if (current > best) best = current;
      prev = date;
    });
    return best;
  }

  function getSnapshot(){
    if (!Stats || typeof Stats.get !== 'function') return null;
    try{
      return Stats.get();
    }catch{
      try{ return Stats.get(); }catch{ return null; }
    }
  }

  function computeDerived(snapshot, history){
    const seconds7 = sumWindowSeconds(history, 7);
    const seconds30 = sumWindowSeconds(history, 30);
    const sessions7 = sumWindowSessions(history, 7);
    const sessions30 = sumWindowSessions(history, 30);
    const daysActive7 = countDaysWith(history, 7, record => (record?.sessions || 0) > 0);
    const techTotals = computeTechTotals(history);
    const bestStreak = computeBestStreak(history);
    const currentStreak = snapshot?.dayStreak || 0;
    return { seconds7, seconds30, sessions7, sessions30, daysActive7, techTotals, bestStreak, currentStreak };
  }

  function formatMinutes(value){
    if (!value) return '0 min';
    if (value < 1) return '<1 min';
    return `${Math.round(value)} min`;
  }

  function getTechLabel(id){
    return TECH_LABELS[id] || id?.replace(/[-_]/g,' ') || 'Technique';
  }

  function computeChallengeProgress(def, history){
    const fallback = { id:def.id, name:def.name, percent:0, label:'Start to track progress.', detail:'No data yet.', state:'idle' };
    if (!history) return fallback;
    switch(def.type){
      case 'streakMinutes': {
        const streak = computeConsecutiveDays(history, def.minSeconds);
        const percent = Math.min(100, Math.round((streak / def.targetDays) * 100));
        return {
          id:def.id,
          name:def.name,
          percent,
          label:`Day ${Math.min(streak, def.targetDays)} of ${def.targetDays}`,
          detail: streak >= def.targetDays ? 'Goal met — keep it gentle.' : 'Stack calm days to build tone.',
          state: streak >= def.targetDays ? 'complete' : (streak ? 'active' : 'idle')
        };
      }
      case 'daysWithSessions': {
        const days = countDaysWith(history, def.windowDays, record => {
          if (!record || !record.sessions) return false;
          const enoughMinutes = Number(record.seconds || 0) >= def.minSecondsPerDay;
          return enoughMinutes && record.sessions >= def.sessionsPerDay;
        });
        const percent = Math.min(100, Math.round((days / def.targetDays) * 100));
        return {
          id:def.id,
          name:def.name,
          percent,
          label:`${days}/${def.targetDays} focus days`,
          detail: days ? 'Nice job priming your brain before work.' : 'Plan two mini breaths before you dive in.',
          state: days >= def.targetDays ? 'complete' : (days ? 'active' : 'idle')
        };
      }
      case 'techMinutesWindow': {
        const minutes = techMinutesWindow(history, def.techIds, def.windowDays);
        const percent = Math.min(100, Math.round((minutes / def.targetMinutes) * 100));
        return {
          id:def.id,
          name:def.name,
          percent,
          label:`${Math.round(minutes)}/${def.targetMinutes} min logged`,
          detail: minutes >= def.targetMinutes ? 'Wind-down complete — enjoy the rest.' : 'Stack a 4-7-8 tonight to nudge this up.',
          state: minutes >= def.targetMinutes ? 'complete' : (minutes ? 'active' : 'idle')
        };
      }
      case 'techSessionsWindow': {
        const sessions = sumTechSessions(history, null, def.techIds, def.windowDays);
        const percent = Math.min(100, Math.round((sessions / def.targetSessions) * 100));
        return {
          id:def.id,
          name:def.name,
          percent,
          label:`${Math.round(sessions)}/${def.targetSessions} resets`,
          detail: sessions ? 'Keep sprinkling those SOS breaks.' : 'Tap SOS 60s to start logging resets.',
          state: sessions >= def.targetSessions ? 'complete' : (sessions ? 'active' : 'idle')
        };
      }
      case 'distinctDaysWindow': {
        const days = countDaysWith(history, def.windowDays, record => (record?.sessions || 0) > 0);
        const percent = Math.min(100, Math.round((days / def.daysRequired) * 100));
        return {
          id:def.id,
          name:def.name,
          percent,
          label:`${days}/${def.daysRequired} days logged`,
          detail: days >= def.daysRequired ? 'Great consistency this week.' : 'Breaks on four days keeps sensory overload lower.',
          state: days >= def.daysRequired ? 'complete' : (days ? 'active' : 'idle')
        };
      }
      default:
        return fallback;
    }
  }

  function updateChallenges(history){
    const cards = document.querySelectorAll('.challenge-card[data-challenge]');
    const results = [];
    cards.forEach(card => {
      const id = card.dataset.challenge;
      const def = CHALLENGES[id];
      const labelEl = card.querySelector('[data-role="challenge-progress-label"]');
      const barEl = card.querySelector('[data-role="challenge-progress-bar"]');
      if (!def){
        if (labelEl) labelEl.textContent = 'Challenge coming soon.';
        return;
      }
      const progress = computeChallengeProgress(def, history);
      results.push(progress);
      if (labelEl) labelEl.textContent = progress.label;
      if (barEl) barEl.style.width = `${progress.percent}%`;
      card.dataset.state = progress.state;
    });
    const summaryEl = document.querySelector('[data-role="challenge-summary"]');
    if (summaryEl){
      const sorted = results.filter(Boolean).sort((a,b) => b.percent - a.percent);
      if (!sorted.length || sorted[0].percent === 0){
        summaryEl.textContent = 'Start a quest to see progress snapshots here.';
      } else {
        summaryEl.innerHTML = `<strong>${sorted[0].name}</strong>: ${sorted[0].detail}`;
      }
    }
    return results;
  }

  function updateRewards(snapshot, history, derived){
    const cards = document.querySelectorAll('.reward-card[data-reward]');
    if (!cards.length) return;
    cards.forEach(card => {
      const id = card.dataset.reward;
      const def = REWARDS[id];
      const statusEl = card.querySelector('[data-role="reward-status"]');
      const barEl = card.querySelector('[data-role="reward-progress-bar"]');
      if (!def){
        if (statusEl) statusEl.textContent = 'Coming soon';
        return;
      }
      const value = def.measure({ snapshot, history, derived }) || 0;
      const percent = Math.min(100, Math.round((value / def.target) * 100));
      if (barEl) barEl.style.width = `${percent}%`;
      const unlocked = value >= def.target;
      if (unlocked){
        if (!rewardState.unlocked[id]){
          rewardState.unlocked[id] = { unlockedAt: new Date().toISOString() };
          saveRewardState(rewardState);
        }
        card.classList.add('is-unlocked');
        if (statusEl) statusEl.textContent = 'Unlocked · kind work!';
      } else {
        card.classList.remove('is-unlocked');
        if (statusEl) statusEl.textContent = `${Math.round(value)}/${def.target}`;
      }
    });
  }

  function renderTechBreakdown(totals){
    const container = document.querySelector('[data-role="tech-breakdown"]');
    if (!container) return;
    container.innerHTML = '';
    const entries = Object.entries(totals || {}).sort((a,b) => b[1]-a[1]).slice(0,4);
    if (!entries.length){
      container.innerHTML = '<p class="muted">Complete a guided session to populate this view.</p>';
      return;
    }
    const maxSeconds = entries[0][1] || 1;
    entries.forEach(([techId, seconds]) => {
      const row = document.createElement('div');
      row.className = 'tech-breakdown__row';
      row.innerHTML = `
        <span class="tech-breakdown__label">${getTechLabel(techId)}</span>
        <div class="tech-breakdown__bar" role="img" aria-label="${Math.round(seconds/60)} minutes with ${getTechLabel(techId)}">
          <span style="width:${Math.round((seconds / maxSeconds) * 100)}%"></span>
        </div>
        <span class="tech-breakdown__value">${Math.round(seconds/60)} min</span>
      `;
      container.appendChild(row);
    });
  }

  function renderRecentMetrics(derived){
    const list = document.querySelector('[data-role="recent-metrics"]');
    if (!list) return;
    list.innerHTML = '';
    const items = [];
    items.push(`Last 7 days: ${derived.sessions7 || 0} sessions · ${formatMinutes(derived.seconds7 / 60)}`);
    items.push(`Last 30 days: ${derived.sessions30 || 0} sessions · ${formatMinutes(derived.seconds30 / 60)}`);
    items.push(`Active days this week: ${derived.daysActive7 || 0} of 7`);
    items.push(`Current streak: ${derived.currentStreak || 0} · Best streak: ${derived.bestStreak || 0}`);
    items.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
  }

  function renderInsights(derived, challengeResults){
    const container = document.querySelector('[data-role="insights-list"]');
    if (!container) return;
    container.innerHTML = '';
    const insights = [];
    if (derived.daysActive7){
      insights.push(`You practised on ${derived.daysActive7} of the last 7 days — consistent bite-sized breaths build regulation.`);
    }
    const techEntries = Object.entries(derived.techTotals || {}).sort((a,b)=>b[1]-a[1]);
    if (techEntries.length){
      const top = techEntries[0];
      const next = techEntries[1];
      insights.push(`You reach for ${getTechLabel(top[0])} most often${next ? `; ${getTechLabel(next[0])} is a solid backup for variety.` : '.'}`);
    }
    if (derived.bestStreak && derived.bestStreak > derived.currentStreak){
      insights.push(`Longest streak so far: ${derived.bestStreak} days. Fancy a gentle ${Math.min(3, derived.bestStreak)}-day run again?`);
    }
    const leadingChallenge = (challengeResults || []).filter(Boolean).sort((a,b)=>b.percent - a.percent)[0];
    if (leadingChallenge && leadingChallenge.percent){
      insights.push(`${leadingChallenge.name} is ${leadingChallenge.percent}% complete — keep the momentum or celebrate and rest.`);
    }
    if (!insights.length){
      insights.push('Practise once to unlock personalised insights.');
    }
    insights.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      container.appendChild(p);
    });
  }

  function updateProgressExtras(snapshot, history, derived, challengeResults){
    if (!snapshot || !history){
      renderTechBreakdown({});
      renderRecentMetrics({ sessions7:0, sessions30:0, seconds7:0, seconds30:0, daysActive7:0, currentStreak:0, bestStreak:0, techTotals:{} });
      renderInsights({ techTotals:{} }, []);
      return;
    }
    renderTechBreakdown(derived.techTotals || {});
    renderRecentMetrics(derived);
    renderInsights(derived, challengeResults);
  }

  function refreshStats(){
    if (!Stats || typeof Stats.get !== 'function'){
      updateChallenges(null);
      return;
    }
    const snapshot = getSnapshot();
    const history = snapshot?.history || {};
    const derived = computeDerived(snapshot, history);
    const challengeResults = updateChallenges(history);
    updateRewards(snapshot, history, derived);
    updateProgressExtras(snapshot, history, derived, challengeResults);
  }

  refreshStats();
  if (Stats){
    window.addEventListener('mpl:progress-update', refreshStats);
    window.addEventListener('storage', evt => {
      if (evt && (evt.key === 'mpl.stats.v1' || evt.key === rewardKey)) refreshStats();
    });
  } else {
    setTimeout(refreshStats, 1500);
  }

  function setHomePlayer(tech, minutes){
    const techniqueSelect = document.getElementById('homeTechnique');
    const minutesSlider = document.getElementById('homeMinutes');
    if (techniqueSelect && tech){
      techniqueSelect.value = tech;
      techniqueSelect.dispatchEvent(new Event('change'));
    }
    if (minutesSlider && minutes){
      setTimeout(() => {
        minutesSlider.value = String(minutes);
        minutesSlider.dispatchEvent(new Event('input'));
      }, 80);
    }
  }

  function wireChallengeButtons(){
    const buttons = document.querySelectorAll('[data-challenge-start]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tech = btn.getAttribute('data-challenge-tech');
        const minutes = Number(btn.getAttribute('data-challenge-min'));
        setHomePlayer(tech, minutes);
      });
    });
  }

  const LADDER_RUNGS = [
    { counts:[3,3,3,3], minutes:3, label:'Steady base' },
    { counts:[4,4,4,4], minutes:3, label:'Balanced 4-count' },
    { counts:[4,6,4,6], minutes:4, label:'Lengthened holds' },
    { counts:[5,5,5,5], minutes:5, label:'Coherent ladder' },
    { counts:[5,7,5,7], minutes:5, label:'Sleep prep' }
  ];
  let ladderIndex = 0;

  function renderLadder(){
    const stepsEl = document.getElementById('ladderSteps');
    const linkEl = document.getElementById('ladderLink');
    if (!stepsEl) return;
    stepsEl.innerHTML = '';
    const rung = LADDER_RUNGS[ladderIndex] || LADDER_RUNGS[0];
    ['Inhale','Hold','Exhale','Hold'].forEach((phase, idx) => {
      const span = document.createElement('span');
      span.className = 'ladder-step';
      span.textContent = `${phase} ${rung.counts[idx]}s`;
      stepsEl.appendChild(span);
    });
    if (linkEl){
      linkEl.href = `box-breathing.html?pattern=${rung.counts.join(',')}&minutes=${rung.minutes}`;
    }
  }

  function wireLadder(){
    const nextBtn = document.querySelector('[data-action="ladder-next"]');
    const softerBtn = document.querySelector('[data-action="ladder-softer"]');
    if (nextBtn){
      nextBtn.addEventListener('click', () => {
        ladderIndex = Math.min(LADDER_RUNGS.length - 1, ladderIndex + 1);
        renderLadder();
      });
    }
    if (softerBtn){
      softerBtn.addEventListener('click', () => {
        ladderIndex = Math.max(0, ladderIndex - 1);
        renderLadder();
      });
    }
    renderLadder();
  }

  function wireColorPath(){
    const toggle = document.querySelector('[data-action="color-path-toggle"]');
    const canvas = document.getElementById('colorPathCanvas');
    if (!toggle || !canvas) return;
    let timer = null;
    function updateSpot(){
      canvas.style.setProperty('--path-x', `${20 + Math.random()*60}%`);
      canvas.style.setProperty('--path-y', `${20 + Math.random()*60}%`);
    }
    toggle.addEventListener('click', () => {
      const active = !canvas.classList.contains('is-animating');
      canvas.classList.toggle('is-animating', active);
      toggle.textContent = active ? 'Pause animation' : 'Start animation';
      if (active){
        updateSpot();
        timer = setInterval(updateSpot, 2000);
      } else if (timer){
        clearInterval(timer);
        timer = null;
      }
    });
  }

  function wireRoulette(){
    const resultEl = document.querySelector('[data-role="roulette-result"]');
    const button = document.querySelector('[data-action="roulette-spin"]');
    if (!resultEl || !button) return;
    const options = [
      { title:'60-second SOS', note:'Power down fight-or-flight when panic spikes.', link:'sos-60.html', cta:'Open SOS timer' },
      { title:'4-7-8 x2 rounds', note:'Use before an exam or bedtime.', link:'4-7-8-breathing.html?minutes=2', cta:'Open 4-7-8' },
      { title:'Coherent 5-5 · 3 min', note:'Balances alertness for work meetings.', link:'coherent-5-5.html?minutes=3', cta:'Open Coherent' },
      { title:'Box breathing · 2 min', note:'Great between tasks or traffic lights.', link:'box-breathing.html?minutes=2', cta:'Open Box' }
    ];
    button.addEventListener('click', () => {
      const pick = options[Math.floor(Math.random() * options.length)];
      resultEl.innerHTML = `<strong>${pick.title}</strong> · ${pick.note} <div class="actions" style="margin-top:.5rem;"><a class="btn" href="${pick.link}" data-href="${pick.link}">${pick.cta}</a></div>`;
    });
  }

  function wireFocusTiles(){
    const tiles = document.querySelectorAll('.focus-tile');
    const noteEl = document.querySelector('[data-role="focus-note"]');
    if (!tiles.length || !noteEl) return;
    tiles.forEach(tile => {
      tile.addEventListener('click', () => {
        tiles.forEach(btn => btn.classList.remove('is-active'));
        tile.classList.add('is-active');
        const label = tile.getAttribute('data-focus-label') || 'Focus mode';
        const tech = tile.getAttribute('data-focus-tech');
        const minutes = Number(tile.getAttribute('data-focus-min'));
        const note = tile.getAttribute('data-focus-note') || '';
        noteEl.innerHTML = `<strong>${label}</strong> · ${note}`;
        setHomePlayer(tech, minutes);
        document.getElementById('daily-practice')?.scrollIntoView({ behavior:'smooth', block:'start' });
      });
    });
  }

  wireChallengeButtons();
  wireLadder();
  wireColorPath();
  wireRoulette();
  wireFocusTiles();
})();
