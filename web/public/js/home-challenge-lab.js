(function(){
  const env = window.__MSHARE__ = window.__MSHARE__ || {};
  const Stats = env.Stats || null;
  const PAGE_ID = (env.pageId || document.body?.dataset?.pageId || 'index').toLowerCase();

  const STORAGE_KEY = 'nb_challenge_stats_v1';
  const WEEK_GOAL_MINUTES = 60;

  const QUESTS = [
    {
      id:'box_calm_3',
      title:'3-minute Box Calm Reset',
      category:'calm',
      categoryLabel:'Calm',
      minutes:3,
      benefit:'Good for stress spikes & transitions between tasks.',
      description:'Inhale 4, hold 4, exhale 4 with shoulders relaxed. Use between lessons or after alerts.'
    },
    {
      id:'focus_55_2',
      title:'2-minute 5-5 Focus Warm-up',
      category:'focus',
      categoryLabel:'Focus (ADHD-friendly)',
      minutes:2,
      benefit:'Helps steady attention before starting work.',
      description:'Breathe in for 5, out for 5. Keep your eyes on one spot or a simple task list.'
    },
    {
      id:'sleep_478_4',
      title:'4-minute Sleep Drift',
      category:'sleep',
      categoryLabel:'Sleep wind-down',
      minutes:4,
      benefit:'Supports sleep onset when used regularly.',
      description:'With lights low, breathe in 4, hold 4, out for 6-8 counts with your phone face-down.'
    },
    {
      id:'school_silent_3',
      title:'3-minute Silent Transition Reset',
      category:'school',
      categoryLabel:'Classroom regulation',
      minutes:3,
      benefit:'Helps autistic and ADHD pupils transition more smoothly.',
      description:'Everyone tracks a visual (like a box or orb) while breathing in-hold-out in time.'
    },
    {
      id:'mood_55_5',
      title:'5-minute Burnout Buffer',
      category:'mood',
      categoryLabel:'Mood & burnout',
      minutes:5,
      benefit:'Gives your nervous system a short recovery window.',
      description:'Use 5-5 breathing between demanding tasks, and label how you feel before and after.'
    }
  ];

  const BADGES = [
    { id:'first_breath', icon:'🌱', title:'First breath', description:'Complete your first logged challenge.', requirement:'1 session', check:s => s.totalSessions >= 1 },
    { id:'ten_minutes', icon:'⏱', title:'10-minute mark', description:'Build 10 minutes of total practice.', requirement:'10 min total', check:s => s.totalMinutes >= 10 },
    { id:'calm_steady', icon:'🫧', title:'Calm steady', description:'Use calm-reset challenges regularly.', requirement:'5 calm sessions', check:s => (s.challengeCompletions.calm || 0) >= 5 },
    { id:'focus_friendly', icon:'🎯', title:'Focus friendly', description:'Log breathing before focus tasks.', requirement:'5 focus sessions', check:s => (s.challengeCompletions.focus || 0) >= 5 },
    { id:'sleep_supporter', icon:'🌙', title:'Sleep supporter', description:'Use wind-down sessions on multiple nights.', requirement:'4 sleep sessions', check:s => (s.challengeCompletions.sleep || 0) >= 4 },
    { id:'three_day_streak', icon:'🔥', title:'3-day streak', description:'Practise on 3 different days in a row.', requirement:'3-day streak', check:s => s.streakDays >= 3 },
    { id:'seven_day_streak', icon:'🏆', title:'7-day streak', description:'Keep breathing practice going for a full week.', requirement:'7-day streak', check:s => s.streakDays >= 7 },
    { id:'mood_builder', icon:'💛', title:'Mood builder', description:'Use breathing tools when your mood dips.', requirement:'3 mood sessions', check:s => (s.challengeCompletions.mood || 0) >= 3 }
  ];

  function createEmptyCompletions(){
    return { calm:0, focus:0, sleep:0, school:0, mood:0 };
  }

  function defaultMeta(){
    return {
      challengeCompletions:createEmptyCompletions(),
      recent:[],
      fallbackTotals:{
        totalMinutes:0,
        totalSessions:0,
        streakDays:0,
        bestStreak:0,
        lastDay:null,
        todayMinutes:0
      }
    };
  }

  function ensureMetaShape(meta){
    const base = defaultMeta();
    const next = Object.assign({}, base, typeof meta === 'object' && meta ? meta : {});
    next.challengeCompletions = Object.assign(createEmptyCompletions(), next.challengeCompletions || {});
    next.recent = Array.isArray(next.recent) ? next.recent.slice(0, 8) : [];
    next.fallbackTotals = Object.assign({}, base.fallbackTotals, next.fallbackTotals || {});
    return next;
  }

  function loadMeta(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultMeta();
      return ensureMetaShape(JSON.parse(raw));
    }catch{
      return defaultMeta();
    }
  }

  function saveMeta(meta){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
    }catch{}
  }

  const fallbackDayKey = value => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const toDayKey = date => (Stats && typeof Stats.toDayKey === 'function') ? Stats.toDayKey(date) : fallbackDayKey(date);
  const todayKey = () => toDayKey(new Date());
  const yesterdayKey = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return toDayKey(d);
  };

  function computeBestStreak(history){
    if (!history) return 0;
    const keys = Object.keys(history).filter(key => (history[key]?.sessions || 0) > 0).sort();
    if (!keys.length) return 0;
    let best = 0;
    let streak = 0;
    let prev = null;
    keys.forEach(key => {
      const record = history[key];
      if (!(record?.sessions)){
        streak = 0;
        prev = null;
        return;
      }
      const currentDate = new Date(`${key}T00:00:00Z`);
      if (!prev){
        streak = 1;
      } else {
        const diff = Math.round((currentDate - prev) / 86400000);
        streak = diff === 1 ? streak + 1 : 1;
      }
      prev = currentDate;
      if (streak > best) best = streak;
    });
    return best;
  }

  function summaryFromSnapshot(snapshot, meta){
    const history = snapshot?.history || {};
    const today = todayKey();
    const todayRecord = history[today] || {};
    const todayMinutes = Math.round((todayRecord.seconds || 0) / 60);
    const todaySessions = Number(todayRecord.sessions || 0);
    const totalMinutes = Math.round((snapshot?.totalSeconds || 0) / 60);
    const totalSessions = Number(snapshot?.sessions || 0);
    const streakDays = Number(snapshot?.dayStreak || 0) || 0;
    const bestStreak = computeBestStreak(history);
    return {
      totalMinutes,
      totalSessions,
      streakDays,
      bestStreak,
      todayMinutes,
      todaySessions,
      challengeCompletions: meta.challengeCompletions,
      recent: meta.recent
    };
  }

  function summaryFromFallback(meta){
    const fallback = meta.fallbackTotals || {};
    return {
      totalMinutes: Math.round(fallback.totalMinutes || 0),
      totalSessions: Math.round(fallback.totalSessions || 0),
      streakDays: fallback.streakDays || 0,
      bestStreak: Math.max(fallback.bestStreak || 0, fallback.streakDays || 0),
      todayMinutes: fallback.todayMinutes || 0,
      todaySessions: 0,
      challengeCompletions: meta.challengeCompletions,
      recent: meta.recent
    };
  }

  function getSummary(meta){
    if (Stats && typeof Stats.get === 'function'){
      try{
        const snapshot = Stats.get();
        if (snapshot) return summaryFromSnapshot(snapshot, meta);
      }catch{}
    }
    return summaryFromFallback(meta);
  }

  function updateFallback(meta, minutes){
    const fallback = meta.fallbackTotals || (meta.fallbackTotals = defaultMeta().fallbackTotals);
    fallback.totalMinutes += minutes;
    fallback.totalSessions += 1;
    const today = todayKey();
    const yest = yesterdayKey();
    if (fallback.lastDay === today){
      fallback.todayMinutes += minutes;
    } else {
      fallback.todayMinutes = minutes;
      if (fallback.lastDay === yest){
        fallback.streakDays = (fallback.streakDays || 0) + 1;
      } else {
        fallback.streakDays = 1;
      }
    }
    fallback.lastDay = today;
    if ((fallback.streakDays || 0) > (fallback.bestStreak || 0)){
      fallback.bestStreak = fallback.streakDays;
    }
  }

  function setText(id, value){
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderStats(summary, meta){
    const completions = meta.challengeCompletions || createEmptyCompletions();
    setText('nb-stat-total-mins', summary.totalMinutes);
    setText('nb-stat-sessions', summary.totalSessions);
    setText('nb-stat-streak', summary.bestStreak || summary.streakDays || 0);
    setText('nb-stat-today-mins', summary.todayMinutes);

    const percent = WEEK_GOAL_MINUTES > 0 ? Math.min(100, Math.round((summary.totalMinutes / WEEK_GOAL_MINUTES) * 100)) : 0;
    setText('nb-progress-percent', percent);
    const fill = document.getElementById('nb-progress-fill');
    if (fill) fill.style.width = `${percent}%`;

    setText('nb-count-calm', `${completions.calm || 0} completed`);
    setText('nb-count-focus', `${completions.focus || 0} completed`);
    setText('nb-count-sleep', `${completions.sleep || 0} completed`);
    setText('nb-count-school', `${completions.school || 0} completed`);
    setText('nb-count-mood', `${completions.mood || 0} completed`);
  }

  function renderBadges(summary, meta){
    const grid = document.getElementById('nb-badges-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const statsForBadges = Object.assign({}, summary, { challengeCompletions: meta.challengeCompletions });
    BADGES.forEach(badge => {
      const unlocked = badge.check(statsForBadges);
      const div = document.createElement('div');
      div.className = `nb-badge${unlocked ? '' : ' nb-badge-locked'}`;
      div.innerHTML = `
        <div class="nb-badge-title">
          <span>${badge.icon}</span>
          <strong>${badge.title}</strong>
        </div>
        <div class="nb-badge-desc">${badge.description}</div>
        <div class="nb-badge-pill">
          <span></span>
          <span>${badge.requirement}</span>
        </div>
      `;
      grid.appendChild(div);
    });
  }

  function renderRecent(meta){
    const list = document.getElementById('nb-activity-list');
    const empty = document.getElementById('nb-activity-empty');
    if (!list || !empty) return;
    const recent = meta.recent || [];
    list.innerHTML = '';
    if (!recent.length){
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    recent.forEach(entry => {
      const li = document.createElement('li');
      li.className = 'nb-activity-item';
      const prettyCategory = entry.category ? (entry.category.charAt(0).toUpperCase() + entry.category.slice(1)) : 'Breathing';
      li.innerHTML = `
        <div class="nb-activity-main">
          <strong>${entry.label}</strong>
          <div class="nb-activity-meta">${prettyCategory} · ${entry.date}</div>
        </div>
        <div class="nb-activity-mins">${entry.minutes} min</div>
      `;
      list.appendChild(li);
    });
  }

  function showToast(message){
    const toast = document.getElementById('nb-toast');
    const text = document.getElementById('nb-toast-text');
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.add('nb-toast-visible');
    clearTimeout(showToast._timeout);
    showToast._timeout = setTimeout(() => {
      toast.classList.remove('nb-toast-visible');
    }, 2600);
  }

  function pickQuest(){
    if (!QUESTS.length) return null;
    const idx = Math.floor(Math.random() * QUESTS.length);
    return QUESTS[idx];
  }

  function renderQuest(quest){
    if (!quest) return;
    setText('nb-daily-name', quest.title);
    setText('nb-daily-description', quest.description);
    setText('nb-daily-mins', quest.minutes);
    setText('nb-daily-category-label', quest.categoryLabel);
    setText('nb-daily-benefit', quest.benefit);
    const completeBtn = document.getElementById('nb-daily-complete');
    if (completeBtn){
      completeBtn.dataset.category = quest.category;
      completeBtn.dataset.minutes = String(quest.minutes);
      completeBtn.dataset.label = quest.title;
    }
  }

  function logCompletion(meta, category, minutes, label){
    const safeMinutes = Math.max(0.5, Number(minutes) || 0);
    const clampedCategory = category || 'calm';
    meta.challengeCompletions[clampedCategory] = (meta.challengeCompletions[clampedCategory] || 0) + 1;
    meta.recent.unshift({
      date: todayKey(),
      label: label || 'Breathing challenge',
      minutes: safeMinutes,
      category: clampedCategory
    });
    meta.recent = meta.recent.slice(0, 8);
    if (Stats && typeof Stats.addSession === 'function'){
      Stats.addSession({
        seconds: Math.round(safeMinutes * 60),
        breaths: Math.max(1, Math.round(safeMinutes * 6)),
        techId: `challenge-${clampedCategory}`,
        pageId: PAGE_ID,
        source: 'challenge-lab'
      });
    } else {
      updateFallback(meta, safeMinutes);
    }
    saveMeta(meta);
  }

  function handleChallengeButton(btn, onComplete){
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category') || 'calm';
      const minutes = Number(btn.getAttribute('data-minutes') || '1') || 1;
      const label = btn.getAttribute('data-label') || btn.textContent.trim() || 'Breathing challenge';
      onComplete(category, minutes, label, 'Challenge logged — time added.');
    });
  }

  function ready(fn){
    if (document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', fn, { once:true });
    } else {
      fn();
    }
  }

  ready(() => {
    const labSection = document.getElementById('nb-challenge-lab');
    if (!labSection) return;
    let meta = loadMeta();

    const refreshAll = () => {
      meta = ensureMetaShape(meta);
      const summary = getSummary(meta);
      renderStats(summary, meta);
      renderBadges(summary, meta);
      renderRecent(meta);
    };

    refreshAll();
    const quest = pickQuest();
    if (quest) renderQuest(quest);

    const statsRefresher = (category, minutes, label, toastMessage) => {
      logCompletion(meta, category, minutes, label);
      meta = loadMeta();
      refreshAll();
      showToast(toastMessage);
    };

    document.querySelectorAll('[data-challenge-button]').forEach(btn => handleChallengeButton(btn, statsRefresher));

    const dailyComplete = document.getElementById('nb-daily-complete');
    if (dailyComplete){
      dailyComplete.addEventListener('click', () => {
        const category = dailyComplete.dataset.category || 'calm';
        const minutes = Number(dailyComplete.dataset.minutes || '3') || 3;
        const label = dailyComplete.dataset.label || 'Today’s breathing quest';
        statsRefresher(category, minutes, label, 'Quest complete — streak updated if today is a new day.');
      });
    }

    const dailySoft = document.getElementById('nb-daily-soft-complete');
    if (dailySoft){
      dailySoft.addEventListener('click', () => {
        const fallbackQuest = QUESTS[0] || { category:'calm', minutes:2, title:'Untracked breathing' };
        const category = (dailyComplete && dailyComplete.dataset.category) || fallbackQuest.category;
        const minutes = (dailyComplete && Number(dailyComplete.dataset.minutes || '2')) || fallbackQuest.minutes;
        statsRefresher(category, minutes, 'Similar breathing completed (manual log)', 'Logged a similar breathing session.');
      });
    }

    const dailySwap = document.getElementById('nb-daily-swap');
    if (dailySwap){
      dailySwap.addEventListener('click', () => {
        const newQuest = pickQuest();
        if (newQuest) renderQuest(newQuest);
        showToast('New quest loaded — pick the one that fits your day.');
      });
    }

    const resetBtn = document.getElementById('nb-reset-stats');
    if (resetBtn){
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset breathing stats on this device? This only affects this browser and cannot be undone.')){
          meta = defaultMeta();
          saveMeta(meta);
          refreshAll();
          showToast('Challenge stats reset on this device.');
        }
      });
    }

    const refreshFromExternal = () => {
      meta = loadMeta();
      refreshAll();
    };

    if (Stats){
      window.addEventListener('mpl:progress-update', refreshFromExternal);
    }
    window.addEventListener('storage', event => {
      if (event && (event.key === STORAGE_KEY || event.key === 'mpl.stats.v1')){
        refreshFromExternal();
      }
    });
  });
})();
