// assets/js/rewards-store.js
(() => {
  const KEY = 'nb_rewards_v1';
  const VERSION = 1;

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const defaultState = () => ({
    version: VERSION,
    points: 0,
    badges: {},   // { [badgeId]: { earnedAt, count } }
    coupons: {},  // { [couponId]: { earnedAt, status:'unlocked'|'redeemed', code, meta } }
    prompts: {},  // { [promptId]: { earnedAt, title, body, meta } }
    history: []   // [{ ts, type, id, deltaPoints, reason }]
  });

  function load(){
    try{
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw || typeof raw !== 'object') throw new Error('bad');
      if (raw.version !== VERSION) throw new Error('version');
      return Object.assign(defaultState(), raw);
    }catch{
      return defaultState();
    }
  }

  function save(state){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch{}
  }

  function pushHistory(state, entry){
    state.history = Array.isArray(state.history) ? state.history : [];
    state.history.unshift(entry);
    state.history = state.history.slice(0, 120); // keep it light
  }

  function grantPoints(state, points, reason){
    const delta = Math.max(0, Number(points) || 0);
    if (!delta) return;
    state.points = Math.max(0, (Number(state.points) || 0) + delta);
    pushHistory(state, { ts: new Date().toISOString(), type:'points', id:'points', deltaPoints:delta, reason });
  }

  function grantBadge(state, badgeId, reason){
    const id = String(badgeId || '').trim();
    if (!id) return;
    const cur = state.badges[id];
    if (cur){
      cur.count = (Number(cur.count) || 1) + 1;
      cur.updatedAt = new Date().toISOString();
      pushHistory(state, { ts: new Date().toISOString(), type:'badge_repeat', id, reason });
      return;
    }
    state.badges[id] = { earnedAt: new Date().toISOString(), count: 1 };
    pushHistory(state, { ts: new Date().toISOString(), type:'badge', id, reason });
  }

  function unlockCoupon(state, coupon){
    const id = String(coupon?.id || '').trim();
    if (!id) return;
    if (state.coupons[id]) return; // once
    state.coupons[id] = {
      earnedAt: new Date().toISOString(),
      status: 'unlocked',
      code: coupon.code || '',
      meta: coupon.meta || {}
    };
    pushHistory(state, { ts:new Date().toISOString(), type:'coupon', id, reason: coupon.reason || 'Unlocked coupon' });
  }

  function unlockPrompt(state, prompt){
    const id = String(prompt?.id || '').trim();
    if (!id) return;
    if (state.prompts[id]) return; // once
    state.prompts[id] = {
      earnedAt: new Date().toISOString(),
      title: prompt.title || 'Prompt win',
      body: prompt.body || '',
      meta: prompt.meta || {}
    };
    pushHistory(state, { ts:new Date().toISOString(), type:'prompt', id, reason: prompt.reason || 'Unlocked prompt' });
  }

  function redeemCoupon(couponId){
    const state = load();
    const id = String(couponId || '').trim();
    if (!id || !state.coupons[id]) return null;
    state.coupons[id].status = 'redeemed';
    state.coupons[id].redeemedAt = new Date().toISOString();
    pushHistory(state, { ts:new Date().toISOString(), type:'coupon_redeemed', id, reason:'Redeemed coupon' });
    save(state);
    return deepClone(state.coupons[id]);
  }

  function get(){
    return deepClone(load());
  }

  function update(mutator){
    const state = load();
    try{ mutator(state); }catch{}
    save(state);
    return deepClone(state);
  }

  window.NBRewardsStore = { get, update, redeemCoupon, _key:KEY };
})();

