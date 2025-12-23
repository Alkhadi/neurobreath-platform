/* NeuroBreath Rewards System (vanilla JS)
   - Computes points, badges, coupons, and prompt rewards based on local-only progress.
   - Safe to include on any page.
   - Storage:
     - Progress (primary): mpl.stats.v1 (from assets/js/app.js)
     - Challenge Lab (optional): nb_challenge_stats_v1 (from assets/js/home-challenge-lab.js)
     - Wallet: nb.rewards.wallet.v1
*/
(() => {
  'use strict';

  const WALLET_KEY = 'nb.rewards.wallet.v1';
  const STATS_KEY = 'mpl.stats.v1';
  const CHALLENGE_KEY = 'nb_challenge_stats_v1';

  // ---------- Small utils ----------
  const clampInt = (n, min, max) => Math.max(min, Math.min(max, n | 0));

  function safeJsonParse(raw, fallback) {
    try {
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }
  function readLS(key, fallback) {
    try {
      return safeJsonParse(window.localStorage.getItem(key), fallback);
    } catch {
      return fallback;
    }
  }
  function writeLS(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
  function isoNow() {
    return new Date().toISOString();
  }

  function normalizeNumber(n, fallback = 0) {
    const x = Number(n);
    return Number.isFinite(x) ? x : fallback;
  }

  function getTodayKey() {
    // London date key in YYYY-MM-DD (best-effort; avoids dependency on Intl in older browsers)
    try {
      const d = new Date();
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/London',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(d);
      const y = parts.find(p => p.type === 'year')?.value;
      const m = parts.find(p => p.type === 'month')?.value;
      const day = parts.find(p => p.type === 'day')?.value;
      if (y && m && day) return `${y}-${m}-${day}`;
    } catch {
      // ignore
    }
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function humanMinsFromSeconds(totalSeconds) {
    return Math.max(0, Math.floor(normalizeNumber(totalSeconds) / 60));
  }

  // ---------- Read progress ----------
  function getStatsSnapshot() {
    // Prefer the shared stats module if present
    const mod = window.__MSHARE__ && window.__MSHARE__.Stats;
    if (mod && typeof mod.get === 'function') {
      const s = mod.get() || {};
      return {
        sessions: clampInt(normalizeNumber(s.sessions), 0, 1e9),
        totalSeconds: Math.max(0, normalizeNumber(s.totalSeconds)),
        todaySeconds: Math.max(0, normalizeNumber(s.todaySeconds ?? s.today?.seconds ?? 0)),
        dayStreak: clampInt(normalizeNumber(s.dayStreak ?? s.streakDays ?? 0), 0, 36500),
        totalBreaths: clampInt(normalizeNumber(s.totalBreaths ?? 0), 0, 1e9),
        history: s.history || {},
        lastSession: s.lastSession || null
      };
    }

    // Fallback: parse localStorage
    const raw = readLS(STATS_KEY, {});
    return {
      sessions: clampInt(normalizeNumber(raw.sessions), 0, 1e9),
      totalSeconds: Math.max(0, normalizeNumber(raw.totalSeconds)),
      todaySeconds: Math.max(0, normalizeNumber(raw.todaySeconds ?? raw.today?.seconds ?? 0)),
      dayStreak: clampInt(normalizeNumber(raw.dayStreak ?? raw.streakDays ?? 0), 0, 36500),
      totalBreaths: clampInt(normalizeNumber(raw.totalBreaths ?? 0), 0, 1e9),
      history: raw.history || {},
      lastSession: raw.lastSession || null
    };
  }

  function getChallengeSnapshot() {
    const raw = readLS(CHALLENGE_KEY, null);
    if (!raw || typeof raw !== 'object') {
      return {
        totalMinutes: 0,
        todayMinutes: 0,
        categories: { calm: 0, focus: 0, sleep: 0, school: 0, mood: 0 }
      };
    }

    // Support a few possible shapes
    const categories = raw.categoryCounts || raw.categories || raw.counts || {};
    const totals = raw.totals || raw.stats || raw;

    const totalMinutes =
      normalizeNumber(raw.totalMinutes) ||
      normalizeNumber(totals.totalMinutes) ||
      normalizeNumber(totals.totalMins) ||
      normalizeNumber(totals.total_mins) ||
      normalizeNumber(totals.totalMinsLifetime) ||
      0;

    // Try "today" buckets if present
    const todayKey = getTodayKey();
    let todayMinutes = 0;

    if (raw.today && typeof raw.today === 'object') {
      todayMinutes = normalizeNumber(raw.today.minutes ?? raw.today.mins ?? 0, 0);
    } else if (raw.byDay && typeof raw.byDay === 'object') {
      todayMinutes = normalizeNumber(raw.byDay[todayKey]?.minutes ?? raw.byDay[todayKey]?.mins ?? 0, 0);
    } else if (raw.days && typeof raw.days === 'object') {
      todayMinutes = normalizeNumber(raw.days[todayKey]?.minutes ?? raw.days[todayKey]?.mins ?? 0, 0);
    }

    return {
      totalMinutes: Math.max(0, totalMinutes),
      todayMinutes: Math.max(0, todayMinutes),
      categories: {
        calm: clampInt(normalizeNumber(categories.calm), 0, 1e9),
        focus: clampInt(normalizeNumber(categories.focus), 0, 1e9),
        sleep: clampInt(normalizeNumber(categories.sleep), 0, 1e9),
        school: clampInt(normalizeNumber(categories.school), 0, 1e9),
        mood: clampInt(normalizeNumber(categories.mood), 0, 1e9)
      }
    };
  }

  // ---------- Categorisation helpers ----------
  function normaliseTechId(x) {
    return String(x || '').toLowerCase().trim();
  }

  function techToCategory(techId) {
    const t = normaliseTechId(techId);
    if (!t) return 'calm';

    if (t.includes('sleep') || t.includes('4-7-8') || t.includes('478') || t.includes('wind') || t.includes('insomnia')) return 'sleep';
    if (t.includes('focus') || t.includes('garden') || t.includes('study') || t.includes('work') || t.includes('attention')) return 'focus';
    if (t.includes('school') || t.includes('class') || t.includes('teacher') || t.includes('lesson')) return 'school';
    if (t.includes('mood') || t.includes('depress') || t.includes('burnout')) return 'mood';

    // default breathing / anxiety helpers
    if (t.includes('box') || t.includes('sos') || t.includes('coherent') || t.includes('breath') || t.includes('calm')) return 'calm';
    return 'calm';
  }

  function extractTechCounts(history) {
    // history may be { days: { 'YYYY-MM-DD': { techs: {id: count}, seconds: n } } }
    const out = {};
    if (!history || typeof history !== 'object') return out;

    const daysObj = history.days || history.byDay || history;
    if (!daysObj || typeof daysObj !== 'object') return out;

    for (const k of Object.keys(daysObj)) {
      const day = daysObj[k];
      const techs = day && (day.techs || day.techCounts || day.techniques);
      if (!techs || typeof techs !== 'object') continue;
      for (const id of Object.keys(techs)) {
        out[id] = (out[id] || 0) + clampInt(normalizeNumber(techs[id]), 0, 1e9);
      }
    }
    return out;
  }

  function categoryTotalsFromTechCounts(techCounts) {
    const cat = { calm: 0, focus: 0, sleep: 0, school: 0, mood: 0 };
    for (const id of Object.keys(techCounts || {})) {
      const c = techToCategory(id);
      cat[c] += clampInt(normalizeNumber(techCounts[id]), 0, 1e9);
    }
    return cat;
  }

  // ---------- Points ----------
  function computePoints(progress, challenge) {
    // Opinionated but simple (edit freely):
    // - 10 points per minute logged (breathing + tools)
    // - 5 points per session
    // - +25 streak bonus for 3+ days, +75 for 7+ days, +200 for 21+ days
    const totalMins = humanMinsFromSeconds(progress.totalSeconds) + clampInt(challenge.totalMinutes, 0, 1e9);
    const pointsFromMinutes = totalMins * 10;
    const pointsFromSessions = clampInt(progress.sessions, 0, 1e9) * 5;

    const streak = clampInt(progress.dayStreak, 0, 36500);
    const streakBonus = streak >= 21 ? 200 : streak >= 7 ? 75 : streak >= 3 ? 25 : 0;

    return clampInt(pointsFromMinutes + pointsFromSessions + streakBonus, 0, 2_000_000_000);
  }

  // ---------- Reward catalog (edit here) ----------
  // Keep IDs stable once you publish; otherwise older wallets will not match.
  const BADGES = [
    {
      id: 'first-session',
      title: 'First Step',
      icon: '👣',
      category: 'points',
      description: 'Log your first session.',
      unlocked: ({ progress }) => progress.sessions >= 1
    },
    {
      id: 'calm-starter-5',
      title: 'Calm Starter',
      icon: '🫧',
      category: 'breathing',
      description: 'Accumulate 5 minutes of calm practice.',
      unlocked: ({ progress, challenge }) => (humanMinsFromSeconds(progress.totalSeconds) + challenge.totalMinutes) >= 5
    },
    {
      id: 'week-goal-60',
      title: 'Weekly Goal',
      icon: '🏁',
      category: 'points',
      description: 'Accumulate 60 minutes total practice.',
      unlocked: ({ progress, challenge }) => (humanMinsFromSeconds(progress.totalSeconds) + challenge.totalMinutes) >= 60
    },
    {
      id: 'streak-3',
      title: '3‑Day Streak',
      icon: '🔥',
      category: 'streak',
      description: 'Practice on 3 different days in a row.',
      unlocked: ({ progress }) => progress.dayStreak >= 3
    },
    {
      id: 'streak-7',
      title: '7‑Day Streak',
      icon: '🌟',
      category: 'streak',
      description: 'Practice on 7 different days in a row.',
      unlocked: ({ progress }) => progress.dayStreak >= 7
    },
    {
      id: 'focus-friend',
      title: 'Focus Friend',
      icon: '🌱',
      category: 'focus',
      description: 'Use Focus tools at least 5 times (Focus Garden counts).',
      unlocked: ({ techCounts }) => (categoryTotalsFromTechCounts(techCounts).focus || 0) >= 5
    }
  ];

  const COUPONS = [
    {
      id: 'streak-pause-token',
      title: 'Streak Pause Token',
      icon: '⏸️',
      category: 'streak',
      cost: 120,
      description: 'Redeem 1 token that you can choose to "use" on a tough day to protect motivation. (Local-only; you decide how to apply it.)',
      unlock: ({ availablePoints }) => availablePoints >= 120,
      kind: 'token',
      tokenId: 'streak-pause'
    },
    {
      id: 'teacher-time-saver',
      title: 'Teacher Time‑Saver Token',
      icon: '🧑‍🏫',
      category: 'points',
      cost: 200,
      description: 'Redeem a prompt pack you can copy/paste into a teacher, tutor, SENCO or manager message.',
      unlock: ({ earnedBadges }) => earnedBadges.includes('week-goal-60'),
      kind: 'prompt',
      promptTitle: 'Teacher / Parent Confidence Script',
      promptText:
        'Short update (copy/paste):\n\n' +
        'Today we used NeuroBreath for a calm start (1–5 minutes). The goal is consistency without pressure.\n' +
        'What helps most:\n' +
        '• Short, repeatable practice (daily if possible)\n' +
        '• One clear "next right action" after calming\n' +
        '• Positive feedback on effort + strategy, not speed\n\n' +
        'If you can, please support with: reduced noise, clear instructions, and one task at a time.'
    },
    {
      id: 'calm-coach-pack',
      title: 'Calm Coach Pack',
      icon: '🧘',
      category: 'breathing',
      cost: 80,
      description: 'Redeem a micro‑coaching prompt to guide a 60‑second calm reset.',
      unlock: ({ availablePoints }) => availablePoints >= 80,
      kind: 'prompt',
      promptTitle: '60‑Second Calm Reset Script',
      promptText:
        '60‑second calm reset (read slowly):\n\n' +
        '1) Soften your shoulders.\n' +
        '2) Breathe in gently through the nose.\n' +
        '3) Pause for one beat.\n' +
        '4) Breathe out longer than you breathed in.\n' +
        '5) Notice one thing you can do next—small and easy.\n\n' +
        'Repeat once if needed.'
    }
  ];

  // ---------- Wallet ----------
  const DEFAULT_WALLET = {
    v: 1,
    pointsSpent: 0,
    earnedBadges: {}, // { [badgeId]: { earnedAt, title } }
    redeemedCoupons: {}, // { [couponId]: { redeemedAt, title, kind, tokenId? } }
    tokens: {}, // { [tokenId]: count }
    promptVault: {}, // { [couponId]: { title, text, redeemedAt } }
    updatedAt: null
  };

  function loadWallet() {
    const w = readLS(WALLET_KEY, null);
    if (!w || typeof w !== 'object') return { ...DEFAULT_WALLET, updatedAt: isoNow() };

    // Shallow merge to tolerate older versions
    return {
      ...DEFAULT_WALLET,
      ...w,
      earnedBadges: { ...(w.earnedBadges || {}) },
      redeemedCoupons: { ...(w.redeemedCoupons || {}) },
      tokens: { ...(w.tokens || {}) },
      promptVault: { ...(w.promptVault || {}) }
    };
  }

  function saveWallet(wallet) {
    wallet.updatedAt = isoNow();
    return writeLS(WALLET_KEY, wallet);
  }

  // ---------- Evaluate state ----------
  function buildState() {
    const progress = getStatsSnapshot();
    const challenge = getChallengeSnapshot();
    const wallet = loadWallet();

    const techCounts = extractTechCounts(progress.history);
    const totalPoints = computePoints(progress, challenge);
    const availablePoints = clampInt(totalPoints - clampInt(wallet.pointsSpent, 0, totalPoints), 0, totalPoints);

    const earnedBadges = Object.keys(wallet.earnedBadges || {});
    const earnedBadgeSet = new Set(earnedBadges);

    // Ensure badges earned if unlocked
    for (const b of BADGES) {
      if (earnedBadgeSet.has(b.id)) continue;
      let ok = false;
      try {
        ok = !!b.unlocked({ progress, challenge, techCounts });
      } catch {
        ok = false;
      }
      if (ok) {
        wallet.earnedBadges[b.id] = { earnedAt: isoNow(), title: b.title };
        earnedBadgeSet.add(b.id);
      }
    }

    // Build coupons list with status
    const coupons = COUPONS.map((c) => {
      const redeemed = !!wallet.redeemedCoupons[c.id];
      let unlocked = false;
      try {
        unlocked = !!c.unlock({
          progress,
          challenge,
          techCounts,
          totalPoints,
          availablePoints,
          earnedBadges: Array.from(earnedBadgeSet)
        });
      } catch {
        unlocked = false;
      }
      // A coupon is redeemable if unlocked and not yet redeemed and user has enough points
      const canAfford = availablePoints >= c.cost;
      const redeemable = unlocked && !redeemed && canAfford;

      return {
        ...c,
        unlocked,
        redeemed,
        canAfford,
        redeemable
      };
    });

    // Save if we minted new badges
    saveWallet(wallet);

    return {
      progress,
      challenge,
      techCounts,
      wallet,
      totalPoints,
      availablePoints,
      earnedBadges: Array.from(earnedBadgeSet),
      coupons
    };
  }

  function dispatchUpdate(meta) {
    try {
      const state = buildState();
      window.dispatchEvent(
        new CustomEvent('nb:rewards-update', { detail: { ...meta, state } })
      );
    } catch {
      // ignore
    }
  }

  // ---------- Public API ----------
  function getState() {
    return buildState();
  }

  function redeemCoupon(couponId) {
    const state = buildState();
    const coupon = state.coupons.find((c) => c.id === couponId);
    if (!coupon) return { ok: false, reason: 'unknown_coupon' };
    if (!coupon.unlocked) return { ok: false, reason: 'locked' };
    if (coupon.redeemed) return { ok: false, reason: 'already_redeemed' };
    if (state.availablePoints < coupon.cost) return { ok: false, reason: 'not_enough_points' };

    const wallet = state.wallet;
    wallet.pointsSpent = clampInt(wallet.pointsSpent + coupon.cost, 0, 2_000_000_000);
    wallet.redeemedCoupons[coupon.id] = {
      redeemedAt: isoNow(),
      title: coupon.title,
      kind: coupon.kind,
      tokenId: coupon.tokenId || null
    };

    if (coupon.kind === 'token' && coupon.tokenId) {
      wallet.tokens[coupon.tokenId] = clampInt((wallet.tokens[coupon.tokenId] || 0) + 1, 0, 999999);
    }

    if (coupon.kind === 'prompt') {
      wallet.promptVault[coupon.id] = {
        title: coupon.promptTitle || coupon.title,
        text: coupon.promptText || '',
        redeemedAt: isoNow()
      };
    }

    saveWallet(wallet);
    dispatchUpdate({ action: 'redeem', couponId: coupon.id });
    return { ok: true };
  }

  function useToken(tokenId) {
    const state = buildState();
    const wallet = state.wallet;
    const current = clampInt(wallet.tokens[tokenId] || 0, 0, 999999);
    if (current <= 0) return { ok: false, reason: 'no_token' };
    wallet.tokens[tokenId] = current - 1;
    saveWallet(wallet);
    dispatchUpdate({ action: 'useToken', tokenId });
    return { ok: true };
  }

  function recommendNextQuest() {
    const state = buildState();
    const lastTech = normaliseTechId(state.progress.lastSession?.techniqueId || state.progress.lastSession?.techId || '');
    const cats = categoryTotalsFromTechCounts(state.techCounts);

    // If we have a last technique, bias away from it (variety)
    const lastCat = techToCategory(lastTech);
    const entries = Object.entries(cats);
    // Sort by least-used first for variety; if empty, default to calm
    entries.sort((a, b) => a[1] - b[1]);

    let pick = entries.find(([c]) => c !== lastCat)?.[0] || entries[0]?.[0] || 'calm';
    if (!pick) pick = 'calm';

    const byCat = {
      calm: {
        title: '1‑minute calm reset (SOS 60)',
        description: 'Do a simple 60‑second reset to reduce stress load before any task.',
        href: 'sos-60.html?pattern=4,4,4,4&minutes=1&tts=off&vib=off',
        pointsHint: '+10–20 points'
      },
      focus: {
        title: 'Focus Garden (2 minutes)',
        description: 'Short focus training with a gentle timer and low-stimulation visuals.',
        href: 'focus-garden.html',
        pointsHint: '+20–40 points'
      },
      sleep: {
        title: '4‑7‑8 wind‑down (2–3 minutes)',
        description: 'Use 4‑7‑8 breathing to support sleep onset and downshift.',
        href: '4-7-8-breathing.html',
        pointsHint: '+20–40 points'
      },
      school: {
        title: 'Dyslexia reading drill (5 minutes)',
        description: 'Run one short reading drill and log it for progress + badges.',
        href: 'dyslexia-reading-training.html#daily-practice',
        pointsHint: '+50+ points'
      },
      mood: {
        title: 'Low mood reset (2 minutes)',
        description: 'Choose one gentle action to reduce overwhelm and build momentum.',
        href: 'low-mood-burnout.html',
        pointsHint: '+20–40 points'
      }
    };

    return byCat[pick] || byCat.calm;
  }

  // Expose a stable namespace
  window.NeuroBreathRewards = {
    getState,
    redeemCoupon,
    useToken,
    recommendNextQuest,
    catalog: { BADGES, COUPONS }
  };

  // Update on storage changes (if user completes sessions on another tab)
  window.addEventListener('storage', (e) => {
    if (!e || !e.key) return;
    if (e.key === WALLET_KEY || e.key === STATS_KEY || e.key === CHALLENGE_KEY) {
      dispatchUpdate({ reason: 'storage' });
    }
  });

  // Emit initial state
  dispatchUpdate({ reason: 'init' });
})();
