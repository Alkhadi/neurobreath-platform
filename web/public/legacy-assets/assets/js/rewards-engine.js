// assets/js/rewards-engine.js
(() => {
  function safeNumber(x){ const n = Number(x); return Number.isFinite(n) ? n : 0; }

  function getChallengeStats(){
    // Matches your tests: nb_challenge_stats_v1
    try{
      return JSON.parse(localStorage.getItem('nb_challenge_stats_v1') || 'null') || {};
    }catch{ return {}; }
  }

  function emitRewardsUpdate(snapshot){
    try{
      window.dispatchEvent(new CustomEvent('nb:rewards-update', { detail:{ snapshot } }));
    }catch{}
  }

  function evaluateAwards({ Stats, pageId, eventDetail }){
    const catalog = window.NB_REWARDS_CATALOG || {};
    const store = window.NBRewardsStore;
    if (!store) return;

    const seconds = safeNumber(eventDetail?.seconds);
    const techId = String(eventDetail?.techId || '').trim();
    const source = String(eventDetail?.source || '').trim();

    // Pull live Stats snapshot (site-wide)
    const globalStats = Stats?.get ? Stats.get() : null;
    const streak = safeNumber(globalStats?.dayStreak);
    const totalMinutes = safeNumber(globalStats?.totalMinutesExact || globalStats?.totalMinutes);

    // Pull challenge stats if you use them
    const ch = getChallengeStats();

    const updated = store.update((state) => {
      // 1) Points baseline: any logged session ≥ 60s
      if (seconds >= 60) {
        // You can tune these values
        const pts = (source === 'session' ? 10 : 15);
        state.points = safeNumber(state.points);
        // Use helper by calling internal methods via update? Keep simple:
        state.points += pts;
        state.history = Array.isArray(state.history) ? state.history : [];
        state.history.unshift({ ts:new Date().toISOString(), type:'points', id:'session', deltaPoints:pts, reason:`Logged ${Math.round(seconds)}s (${techId || 'session'})` });
      }

      // 2) First session badge
      if (!state.badges?.['first-session'] && seconds >= 60) {
        state.badges = state.badges || {};
        state.badges['first-session'] = { earnedAt:new Date().toISOString(), count:1 };
        state.history.unshift({ ts:new Date().toISOString(), type:'badge', id:'first-session', reason:'First logged session' });
      }

      // 3) Streak badges
      if (streak >= 3 && !state.badges?.['streak-3']) {
        state.badges = state.badges || {};
        state.badges['streak-3'] = { earnedAt:new Date().toISOString(), count:1 };
        state.history.unshift({ ts:new Date().toISOString(), type:'badge', id:'streak-3', reason:'Reached a 3-day streak' });
      }

      // 4) Weekly minutes badge (simple version)
      if (totalMinutes >= 60 && !state.badges?.['week-60']) {
        state.badges = state.badges || {};
        state.badges['week-60'] = { earnedAt:new Date().toISOString(), count:1 };
        state.history.unshift({ ts:new Date().toISOString(), type:'badge', id:'week-60', reason:'Logged 60+ minutes total' });
      }

      // 5) Calm starter badge based on challenge counts (if your key stores it)
      // Adjust this to your actual schema once you confirm how you store categories
      const calmDone = safeNumber(ch?.categories?.calm?.completed || ch?.calmCompleted || 0);
      if (calmDone >= 5 && !state.badges?.['calm-starter']) {
        state.badges = state.badges || {};
        state.badges['calm-starter'] = { earnedAt:new Date().toISOString(), count:1 };
        state.history.unshift({ ts:new Date().toISOString(), type:'badge', id:'calm-starter', reason:'Completed 5 calm challenges' });
      }

      // 6) Unlock a coupon when week badge is earned
      if (state.badges?.['week-60'] && !state.coupons?.['teacher-token']) {
        const c = catalog?.coupons?.['teacher-token'];
        if (c){
          state.coupons = state.coupons || {};
          state.coupons['teacher-token'] = { earnedAt: new Date().toISOString(), status:'unlocked', code:c.code, meta:c.meta || {} };
          state.history.unshift({ ts:new Date().toISOString(), type:'coupon', id:'teacher-token', reason:'Unlocked Teacher token' });
        }
      }

      // 7) Unlock a "prompt win" after ADHD focus game, etc.
      if (techId === 'adhd-attention-game' && !state.prompts?.['focus-script-1']) {
        const p = catalog?.prompts?.['focus-script-1'];
        if (p){
          state.prompts = state.prompts || {};
          state.prompts[p.id] = { earnedAt:new Date().toISOString(), title:p.title, body:p.body, meta:p.meta || {} };
          state.history.unshift({ ts:new Date().toISOString(), type:'prompt', id:p.id, reason:'Unlocked a focus script' });
        }
      }

      // Keep history capped
      state.history = (state.history || []).slice(0, 120);
    });

    emitRewardsUpdate(updated);
  }

  function initRewardsEngine({ Stats, pageId }){
    if (window.__NB_REWARDS_ENGINE__) return;
    window.__NB_REWARDS_ENGINE__ = true;

    // Listen to your existing Stats update event
    window.addEventListener('mpl:progress-update', (evt) => {
      evaluateAwards({ Stats, pageId, eventDetail: evt?.detail || {} });
    });

    // Also refresh once on load so UI pages show current rewards
    try{
      const snapshot = window.NBRewardsStore?.get?.();
      if (snapshot) emitRewardsUpdate(snapshot);
    }catch{}
  }

  window.initNBRewardsEngine = initRewardsEngine;
})();

