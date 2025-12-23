(() => {
  try{
    if (document && document.body){
      document.body.dataset.theme = 'dark';
      document.querySelectorAll('[data-nb-theme-toggle="1"], .nb-theme-toggle, [data-action="toggle-theme"]').forEach(node => {
        try{ node.remove(); }catch{}
      });
    }
  }catch{}

  function createStatsModule(){
    const KEY = 'mpl.stats.v1';
    const TZ = 'Europe/London';
    const defaultState = { version:1, timezone:TZ, sessions:0, totalSeconds:0, totalBreaths:0, lastSession:null, dayStreak:0, history:{} };
    const dayFormatter = (()=>{
      try{ return new Intl.DateTimeFormat('en-CA',{ timeZone:TZ }); }
      catch{ return { format(date){ const d = date instanceof Date ? date : new Date(date); if (Number.isNaN(d.getTime())) return ''; const y = d.getUTCFullYear(); const m = String(d.getUTCMonth()+1).padStart(2,'0'); const day = String(d.getUTCDate()).padStart(2,'0'); return `${y}-${m}-${day}`; } }; }
    })();
    let state = load();

    function load(){
      try{
        const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (!raw || typeof raw !== 'object') throw new Error('Invalid stats');
        raw.history = raw.history && typeof raw.history === 'object' ? raw.history : {};
        return Object.assign({}, defaultState, raw);
      }catch{
        return JSON.parse(JSON.stringify(defaultState));
      }
    }
    function save(){
      try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch{}
    }
    function toDayKey(value){
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) return dayFormatter.format(new Date());
      return dayFormatter.format(date);
    }
    function prevDayKey(key){
      const parts = key.split('-').map(Number);
      if (parts.length !== 3 || parts.some(n=>Number.isNaN(n))) return key;
      const dt = new Date(Date.UTC(parts[0], parts[1]-1, parts[2]));
      dt.setUTCDate(dt.getUTCDate()-1);
      return dayFormatter.format(dt);
    }
    function cloneHistory(src){
      const out = {};
      Object.keys(src || {}).forEach(key=>{
        const item = src[key] || {};
        out[key] = {
          seconds: Number(item.seconds || 0),
          breaths: Number(item.breaths || 0),
          sessions: Number(item.sessions || 0),
          techs: Object.assign({}, item.techs || {}),
          firstRecordedAt: item.firstRecordedAt || null,
          updatedAt: item.updatedAt || null,
          pages: {}
        };
        if (item.pages && typeof item.pages === 'object'){
          Object.keys(item.pages).forEach(pageKey=>{
            const page = item.pages[pageKey] || {};
            out[key].pages[pageKey] = {
              seconds: Number(page.seconds || 0),
              breaths: Number(page.breaths || 0),
              sessions: Number(page.sessions || 0),
              techs: Object.assign({}, page.techs || {}),
              firstRecordedAt: page.firstRecordedAt || null,
              updatedAt: page.updatedAt || null
            };
          });
        }
      });
      return out;
    }
    function normalizePageId(value){
      if (typeof value !== 'string') return '';
      return value.trim().toLowerCase();
    }
    function computeStreak(history, anchorKey){
      const keys = Object.keys(history || {}).filter(k => (history[k]?.sessions || 0) > 0).sort();
      if (!keys.length) return 0;
      let streak = 0;
      let cursor = anchorKey || keys[keys.length - 1];
      const visited = new Set();
      while (cursor && history[cursor] && (history[cursor].sessions || 0) > 0){
        if (visited.has(cursor)) break;
        visited.add(cursor);
        streak += 1;
        const next = prevDayKey(cursor);
        if (next === cursor) break;
        cursor = next;
      }
      return streak;
    }
    function addSession(payload = {}){
      const ts = payload.timestamp ? new Date(payload.timestamp) : new Date();
      if (Number.isNaN(ts.getTime())) return get();
      const seconds = Math.max(0, Number(payload.seconds) || 0);
      const breaths = Math.max(0, Number(payload.breaths) || 0);
      const techId = typeof payload.techId === 'string' ? payload.techId.trim() : '';
      const pageId = normalizePageId(payload.pageId);
      const dayKey = toDayKey(ts);

      state.sessions = (state.sessions || 0) + 1;
      state.totalSeconds = (state.totalSeconds || 0) + seconds;
      state.totalBreaths = (state.totalBreaths || 0) + breaths;
      state.lastSession = ts.toISOString();

      const history = state.history = state.history && typeof state.history === 'object' ? state.history : {};
      const record = history[dayKey] = Object.assign({ seconds:0, breaths:0, sessions:0, techs:{}, firstRecordedAt:null, updatedAt:null, pages:{} }, history[dayKey]);
      record.pages = record.pages && typeof record.pages === 'object' ? record.pages : {};
      record.seconds += seconds;
      record.breaths += breaths;
      record.sessions += 1;
      if (techId) record.techs[techId] = (record.techs[techId] || 0) + 1;
      if (!record.firstRecordedAt) record.firstRecordedAt = ts.toISOString();
      record.updatedAt = ts.toISOString();

      if (pageId){
        const pageRecord = record.pages[pageId] = Object.assign({ seconds:0, breaths:0, sessions:0, techs:{}, firstRecordedAt:null, updatedAt:null }, record.pages[pageId]);
        pageRecord.seconds += seconds;
        pageRecord.breaths += breaths;
        pageRecord.sessions += 1;
        if (techId) pageRecord.techs[techId] = (pageRecord.techs[techId] || 0) + 1;
        if (!pageRecord.firstRecordedAt) pageRecord.firstRecordedAt = ts.toISOString();
        pageRecord.updatedAt = ts.toISOString();
      }

      state.dayStreak = computeStreak(history, dayKey);
      state.updatedAt = ts.toISOString();
      save();
      const snapshot = get();
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function'){
        try{
          const pageStats = pageId ? get({ pageId }) : null;
          window.dispatchEvent(new CustomEvent('mpl:progress-update', {
            detail: {
              snapshot,
              pageId,
              pageStats,
              techId,
              seconds,
              breaths,
              timestamp: ts.toISOString(),
              source: payload?.source || 'session'
            }
          }));
        }catch{}
      }
      return snapshot;
    }
    function get(options){
      const opts = options && typeof options === 'object' ? options : null;
      const pageId = normalizePageId(opts?.pageId);
      const history = cloneHistory(state.history || {});
      if (pageId){
        const filteredHistory = {};
        let totalSeconds = 0;
        let totalBreaths = 0;
        let totalSessions = 0;
        let lastSessionIso = null;

        Object.keys(history).forEach(dayKey => {
          const record = history[dayKey];
          const pageRecord = record?.pages?.[pageId];
          if (!pageRecord || !pageRecord.sessions) return;
          const clone = {
            seconds: Number(pageRecord.seconds || 0),
            breaths: Number(pageRecord.breaths || 0),
            sessions: Number(pageRecord.sessions || 0),
            techs: Object.assign({}, pageRecord.techs || {}),
            firstRecordedAt: pageRecord.firstRecordedAt || null,
            updatedAt: pageRecord.updatedAt || null
          };
          filteredHistory[dayKey] = clone;
          totalSeconds += clone.seconds;
          totalBreaths += clone.breaths;
          totalSessions += clone.sessions;
          if (pageRecord.updatedAt){
            if (!lastSessionIso || new Date(pageRecord.updatedAt) > new Date(lastSessionIso)){
              lastSessionIso = pageRecord.updatedAt;
            }
          }
        });

        const anchorKey = lastSessionIso ? toDayKey(new Date(lastSessionIso)) : undefined;
        const dayStreak = computeStreak(filteredHistory, anchorKey);
        return {
          version: state.version || defaultState.version,
          timezone: state.timezone || TZ,
          sessions: totalSessions,
          totalSeconds,
          totalMinutesExact: totalSeconds / 60,
          totalMinutes: Math.round(totalSeconds / 60),
          totalBreaths,
          lastSession: lastSessionIso,
          dayStreak,
          history: filteredHistory
        };
      }

      const totalSeconds = Number(state.totalSeconds || 0);
      const anchorKey = state.lastSession ? toDayKey(new Date(state.lastSession)) : undefined;
      const dayStreak = Number(state.dayStreak || 0) || computeStreak(state.history || {}, anchorKey);
      return {
        version: state.version || defaultState.version,
        timezone: state.timezone || TZ,
        sessions: Number(state.sessions || 0),
        totalSeconds,
        totalMinutesExact: totalSeconds / 60,
        totalMinutes: Math.round(totalSeconds / 60),
        totalBreaths: Number(state.totalBreaths || 0),
        lastSession: state.lastSession || null,
        dayStreak,
        history
      };
    }
    return { addSession, get, toDayKey, timezone:TZ };
  }

  const TECH_LIBRARY = {
    'stress-box-4444': {
      rounds: 4,
      breathsPerRound: 1,
      phases: [
        { id:'inhale', label:'Inhale', cue:'Breathe in through the nose', seconds:4 },
        { id:'hold-1', label:'Hold', cue:'Hold softly; untension the jaw', seconds:4 },
        { id:'exhale', label:'Exhale', cue:'Slow exhale through the mouth', seconds:4 },
        { id:'hold-2', label:'Hold', cue:'Pause with lungs emptied', seconds:4 }
      ]
    },

    'breath-howto': {
      rounds: 1,
      breathsPerRound: 0,
      completionMessage: '<strong>Complete:</strong> 2 minutes done. Keep it easy and comfortable.',
      phases: [
        { id:'practice', label:'Practice', cue:'Breathe comfortably: smooth inhale, gentle longer exhale.', seconds:120 }
      ]
    },

    'mindfulness-3min': {
      rounds: 1,
      breathsPerRound: 0,
      completionMessage: '<strong>Complete:</strong> 3 minutes done. Notice how you feel before you continue.',
      phases: [
        { id:'arrive', label:'Arrive', cue:'Notice posture, contact points and breath.', seconds:60 },
        { id:'follow', label:'Follow', cue:'Follow the breath. Return kindly when distracted.', seconds:60 },
        { id:'widen', label:'Widen', cue:'Widen attention to sound and body.', seconds:60 }
      ]
    },

    'focus-3x5': {
      rounds: 3,
      breathsPerRound: 0,
      completionMessage: '<strong>Complete:</strong> 3 focus sprints done. Take a short reset before switching tasks.',
      phases: [
        { id:'focus', label:'Single-task focus', cue:'One small outcome; one tab; notifications off.', seconds:300 }
      ]
    },

    'adhd-25-5': {
      rounds: 4,
      breathsPerRound: 0,
      completionMessage: '<strong>Complete:</strong> 4 sprints done. Consider a 20–30 minute longer break.',
      phases: [
        { id:'work', label:'Work', cue:'Pick your Next 3. Start the first step.', seconds:1500 },
        { id:'break', label:'Break', cue:'Stand up, sip water, and do 10 slow breaths.', seconds:300 }
      ]
    }
  };

  function initTechPlayers(env = {}){
    const players = Array.from(document.querySelectorAll('.tech-player[data-tech]'));
    if (!players.length) return;
    const Stats = env.Stats;
    const pageId = typeof env.pageId === 'string' ? env.pageId : '';

    players.forEach(player => {
      if (!player || player.dataset.techWired === '1') return;
      const techId = (player.getAttribute('data-tech') || '').trim();
      const config = TECH_LIBRARY[techId];
      if (!config) return;

      const startBtn = player.querySelector('[data-act="start"]');
      const stopBtn = player.querySelector('[data-act="stop"]');
      const statusEl = player.querySelector('[data-role="status"]');
      const edges = Array.from(player.querySelectorAll('.tech-edge'));
      if (!startBtn || !stopBtn || !statusEl || !edges.length) return;

      player.dataset.techWired = '1';
      stopBtn.disabled = true;
      stopBtn.setAttribute('aria-disabled', 'true');

      const totalSecondsPerRound = config.phases.reduce((acc, phase) => acc + (Number(phase.seconds) || 0), 0);

      let phaseIndex = 0;
      let round = 0;
      let countdownTimer = null;
      let running = false;

      function clearCountdown(){
        if (countdownTimer){
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
      }

      function highlightPhase(phaseId){
        edges.forEach(edge => {
          edge.classList.toggle('is-active', phaseId ? edge.dataset.phase === phaseId : false);
        });
      }

      function formatStatusText(currentRound, phase, secondsRemaining){
        const label = `<strong>Round ${currentRound}/${config.rounds}</strong> — ${phase.label}`;
        const suffix = secondsRemaining > 0 ? ` · ${secondsRemaining}s` : '';
        const cue = phase.cue ? `<span class="tech-status__cue">${phase.cue}</span>` : '';
        return `${label}${suffix}${cue}`;
      }

      function setStatus(html){
        statusEl.innerHTML = html;
      }

      function setButtons(isRunning){
        running = isRunning;
        startBtn.disabled = !!isRunning;
        if (isRunning){
          startBtn.setAttribute('aria-disabled', 'true');
        } else {
          startBtn.removeAttribute('aria-disabled');
        }
        stopBtn.disabled = !isRunning;
        if (!isRunning){
          stopBtn.setAttribute('aria-disabled', 'true');
        } else {
          stopBtn.setAttribute('aria-disabled', 'false');
        }
      }

      function finishSession(completed){
        clearCountdown();
        highlightPhase(null);
        phaseIndex = 0;
        round = 0;
        setButtons(false);
        if (completed){
          setStatus(`<strong>Complete:</strong> ${config.rounds} rounds logged. Take a sip of water.`);
          if (Stats && typeof Stats.addSession === 'function'){
            Stats.addSession({
              seconds: config.rounds * totalSecondsPerRound,
              breaths: config.rounds * (config.breathsPerRound || 1),
              techId,
              pageId
            });
          }
        } else {
          setStatus('Session stopped. Press start to begin a fresh cycle.');
        }
      }

      function runNextPhase(){
        if (!running) return;
        if (phaseIndex >= config.phases.length){
          phaseIndex = 0;
          round += 1;
        }

        if (round >= config.rounds){
          finishSession(true);
          return;
        }

        const phase = config.phases[phaseIndex];
        let remaining = Number(phase.seconds) || 0;
        highlightPhase(phase.id);
        setStatus(formatStatusText(round + 1, phase, remaining));

        clearCountdown();
        countdownTimer = setInterval(() => {
          if (!running) { clearCountdown(); return; }
          remaining -= 1;
          if (remaining <= 0){
            clearCountdown();
            phaseIndex += 1;
            runNextPhase();
            return;
          }
          setStatus(formatStatusText(round + 1, phase, remaining));
        }, 1000);
      }

      startBtn.addEventListener('click', () => {
        if (running) return;
        phaseIndex = 0;
        round = 0;
        setButtons(true);
        runNextPhase();
      });

      stopBtn.addEventListener('click', () => {
        if (!running){
          setStatus('No active cycle. Press start to begin.');
          return;
        }
        finishSession(false);
      });

      player.addEventListener('keydown', evt => {
        if (!running) return;
        if (evt.key === 'Escape'){ evt.preventDefault(); finishSession(false); }
      });
    });
  }

  function initTechActionBlocks(env = {}){
    const blocks = Array.from(document.querySelectorAll('.actions[data-tech]'));
    if (!blocks.length) return;
    const Stats = env.Stats;
    const pageId = typeof env.pageId === 'string' ? env.pageId : '';

    blocks.forEach(block => {
      if (!block || block.dataset.techWired === '1') return;
      const techId = (block.getAttribute('data-tech') || '').trim();
      const config = TECH_LIBRARY[techId];
      if (!config) return;

      const startBtn = block.querySelector('[data-act="start"]');
      const stopBtn = block.querySelector('[data-act="stop"]');
      if (!startBtn || !stopBtn) return;

      let statusEl = null;
      const container = block.closest('section, .card') || block.parentElement;
      if (container){
        statusEl = container.querySelector('[data-role="status"]');
      }

      if (!statusEl){
        statusEl = document.createElement('p');
        statusEl.className = 'muted tech-status';
        statusEl.setAttribute('data-role', 'status');
        statusEl.setAttribute('aria-live', 'polite');
        statusEl.textContent = 'Press start to begin.';
        try{
          block.insertAdjacentElement('beforebegin', statusEl);
        }catch{
          (container || block.parentElement || document.body).appendChild(statusEl);
        }
      }

      function setStatus(html){
        statusEl.innerHTML = html;
      }

      block.dataset.techWired = '1';
      stopBtn.disabled = true;
      stopBtn.setAttribute('aria-disabled', 'true');

      const totalSecondsPerRound = config.phases.reduce((acc, phase) => acc + (Number(phase.seconds) || 0), 0);

      let phaseIndex = 0;
      let round = 0;
      let countdownTimer = null;
      let running = false;

      function clearCountdown(){
        if (countdownTimer){
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
      }

      function formatStatusText(currentRound, phase, secondsRemaining){
        const label = config.rounds > 1
          ? `<strong>Round ${currentRound}/${config.rounds}</strong> — ${phase.label}`
          : `<strong>${phase.label}</strong>`;
        const suffix = secondsRemaining > 0 ? ` · ${secondsRemaining}s` : '';
        const cue = phase.cue ? `<span class="tech-status__cue">${phase.cue}</span>` : '';
        return `${label}${suffix}${cue}`;
      }

      function setButtons(isRunning){
        running = isRunning;
        startBtn.disabled = !!isRunning;
        if (isRunning){
          startBtn.setAttribute('aria-disabled', 'true');
        } else {
          startBtn.removeAttribute('aria-disabled');
        }
        stopBtn.disabled = !isRunning;
        if (!isRunning){
          stopBtn.setAttribute('aria-disabled', 'true');
        } else {
          stopBtn.setAttribute('aria-disabled', 'false');
        }
      }

      function finishSession(completed){
        clearCountdown();
        phaseIndex = 0;
        round = 0;
        setButtons(false);
        if (completed){
          setStatus(config.completionMessage || '<strong>Complete.</strong>');
          if (Stats && typeof Stats.addSession === 'function'){
            Stats.addSession({
              seconds: config.rounds * totalSecondsPerRound,
              breaths: config.rounds * (config.breathsPerRound || 0),
              techId,
              pageId
            });
          }
        } else {
          setStatus('Session stopped. Press start to begin again.');
        }
      }

      function runNextPhase(){
        if (!running) return;
        if (phaseIndex >= config.phases.length){
          phaseIndex = 0;
          round += 1;
        }

        if (round >= config.rounds){
          finishSession(true);
          return;
        }

        const phase = config.phases[phaseIndex];
        let remaining = Number(phase.seconds) || 0;
        setStatus(formatStatusText(round + 1, phase, remaining));

        clearCountdown();
        countdownTimer = setInterval(() => {
          if (!running) { clearCountdown(); return; }
          remaining -= 1;
          if (remaining <= 0){
            clearCountdown();
            phaseIndex += 1;
            runNextPhase();
            return;
          }
          setStatus(formatStatusText(round + 1, phase, remaining));
        }, 1000);
      }

      startBtn.addEventListener('click', () => {
        if (running) return;
        phaseIndex = 0;
        round = 0;
        setButtons(true);
        runNextPhase();
      });

      stopBtn.addEventListener('click', () => {
        if (!running){
          setStatus('No active cycle. Press start to begin.');
          return;
        }
        finishSession(false);
      });
    });
  }

  function resolvePageId(){
    try{
      const attr = document?.body?.getAttribute('data-page-id');
      if (attr && attr.trim()) return attr.trim().toLowerCase();
      const meta = document?.querySelector('meta[name="mshare:page"]');
      const metaContent = meta?.getAttribute('content');
      if (metaContent && metaContent.trim()) return metaContent.trim().toLowerCase();
      const path = (location && typeof location.pathname === 'string') ? location.pathname : '';
      const segments = path.split('/').filter(Boolean);
      let last = segments.length ? segments[segments.length - 1] : '';
      if (!last && path === '/') last = 'index';
      if (!last){
        return 'index';
      }
      const cleaned = last.replace(/\.[a-z0-9]+$/i, '') || 'index';
      return cleaned.toLowerCase();
    }catch{
      return 'index';
    }
  }

  function initCookieBanner(env = {}){
    const doc = document;
    const body = doc.body;
    if (!body) return;

    const normalizedPageId = typeof env.pageId === 'string' ? env.pageId.trim().toLowerCase() : '';
    if (!normalizedPageId.startsWith('adhd')) return;

    const rootRef = env.root || window.__MSHARE__ || {};
    const CONSENT_KEY = 'nb.cookiePrefs.v1';
    const CONSENT_VERSION = 1;
    const hasStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

    function applyChoice(choice){
      if (!body) return;
      body.dataset.cookieConsent = choice;
    }

    function dispatch(choice, payload){
      try{
        window.dispatchEvent(new CustomEvent('nb:cookie-consent', { detail:{ choice, payload } }));
      }catch{}
    }

    function readChoice(){
      if (!hasStorage) return null;
      try{
        const raw = window.localStorage.getItem(CONSENT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        if (parsed.version !== CONSENT_VERSION) return null;
        if (!parsed.choice || typeof parsed.choice !== 'string') return null;
        parsed.choice = parsed.choice === 'all' ? 'all' : 'necessary';
        return parsed;
      }catch{
        return null;
      }
    }

    function persist(choice){
      const payload = {
        version: CONSENT_VERSION,
        choice: choice === 'all' ? 'all' : 'necessary',
        updatedAt: new Date().toISOString()
      };
      if (hasStorage){
        try{
          window.localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
        }catch{}
      }
      rootRef.cookieConsent = payload;
      applyChoice(payload.choice);
      dispatch(payload.choice, payload);
      return payload;
    }

    const existing = readChoice();
    if (existing && existing.choice){
      rootRef.cookieConsent = existing;
      applyChoice(existing.choice);
      dispatch(existing.choice, existing);
      return;
    }

    const banner = doc.createElement('section');
    banner.className = 'cookie-banner';
    banner.id = 'nbCookieBanner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.setAttribute('tabindex', '-1');

    const title = doc.createElement('h2');
    title.className = 'cookie-banner__title';
    title.textContent = 'Our cookies';

    const intro = doc.createElement('p');
    intro.className = 'cookie-banner__intro';
    intro.textContent = 'We use essential cookies to keep Neurobreath tools working — timers, downloads and accessibility features. With your permission, we will add privacy-conscious analytics cookies so we can see how people use neurobreath.co.uk and improve future updates.';

    const scope = doc.createElement('p');
    scope.className = 'cookie-banner__scope';
    scope.innerHTML = 'Selecting "I accept cookies" means analytics tracking can run while you browse <a href="https://www.neurobreath.co.uk/" target="_blank" rel="noopener">neurobreath.co.uk</a>, <a href="https://www.mindpaylink.com/" target="_blank" rel="noopener">mindpaylink.com</a> and related Neurobreath pilot spaces.';

    const links = doc.createElement('p');
    links.className = 'cookie-banner__links';
    links.innerHTML = '<a href="https://www.neurobreath.co.uk/cookies" target="_blank" rel="noopener">Cookies page (opens in new tab)</a> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google privacy notice</a> · <a href="https://www.neurobreath.co.uk/privacy" target="_blank" rel="noopener">Privacy policy (opens in new tab)</a>';

    const necessaryWrap = doc.createElement('div');
    necessaryWrap.className = 'cookie-banner__necessary';

    const necessaryTitle = doc.createElement('h3');
    necessaryTitle.textContent = 'Necessary cookies';

    const necessaryCopy = doc.createElement('p');
    necessaryCopy.textContent = 'Necessary cookies allow the site to load, save your essential preferences and provide basic performance signals so we can fix issues. You can only switch these off by changing your browser settings.';

    necessaryWrap.appendChild(necessaryTitle);
    necessaryWrap.appendChild(necessaryCopy);

    const actions = doc.createElement('div');
    actions.className = 'cookie-banner__actions';

    const acceptBtn = doc.createElement('button');
    acceptBtn.className = 'btn btn-primary';
    acceptBtn.type = 'button';
    acceptBtn.id = 'nbCookieAccept';
    acceptBtn.textContent = 'I accept cookies';

    const rejectBtn = doc.createElement('button');
    rejectBtn.className = 'btn btn-soft';
    rejectBtn.type = 'button';
    rejectBtn.id = 'nbCookieDecline';
    rejectBtn.textContent = 'I do not accept cookies';

    actions.appendChild(acceptBtn);
    actions.appendChild(rejectBtn);

    banner.appendChild(title);
    banner.appendChild(intro);
    banner.appendChild(scope);
    banner.appendChild(links);
    banner.appendChild(necessaryWrap);
    banner.appendChild(actions);

    body.appendChild(banner);

    const dismiss = () => {
      banner.classList.remove('is-visible');
      window.setTimeout(() => {
        try{
          banner.remove();
        }catch{
          banner.parentNode?.removeChild?.(banner);
        }
      }, 260);
    };

    const focusSafely = () => {
      try{
        acceptBtn.focus({ preventScroll:true });
      }catch{
        acceptBtn.focus();
      }
    };

    acceptBtn.addEventListener('click', () => {
      persist('all');
      dismiss();
    });

    rejectBtn.addEventListener('click', () => {
      persist('necessary');
      dismiss();
    });

    banner.addEventListener('keydown', evt => {
      if (evt.key === 'Escape'){
        persist('necessary');
        dismiss();
      }
    });

    window.setTimeout(() => {
      banner.classList.add('is-visible');
      window.setTimeout(focusSafely, 60);
    }, 20);
  }

  function findReferenceAnchor(){
    const priorityIds = ['refs','references','reference','bibliography','biblio'];
    for (const id of priorityIds){
      const el = document.getElementById(id);
      if (el) return el;
    }
    const labelled = document.querySelector('[data-nb-ref], [data-nb-biblio]');
    if (labelled) return labelled;
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
    const primaryKeywords = ['reference', 'references', 'bibliography'];
    for (const heading of headings){
      const text = (heading.textContent || '').trim().toLowerCase();
      if (!text) continue;
      if (primaryKeywords.some(word => text.includes(word))){
        const container = heading.closest('.card, section, article');
        if (container) return container;
      }
    }
    const fallbackKeywords = ['resources', 'resource', 'sources'];
    let fallback = null;
    for (const heading of headings){
      const text = (heading.textContent || '').trim().toLowerCase();
      if (!text) continue;
      if (fallbackKeywords.some(word => text.includes(word))){
        const container = heading.closest('.card, section, article');
        if (container) fallback = container;
      }
    }
    return fallback;
  }

  function ensureProgressCard(){
    const existing = document.getElementById('progressCard');
    if (existing) existing.remove();
    return null;
  }

  function initProgressCard(env){
    const Stats = env?.Stats;
    const timezone = env?.timezone || 'Europe/London';
    const pageId = typeof env?.pageId === 'string' ? env.pageId : '';
    const card = ensureProgressCard();
    if (!card) return;
    if (card.dataset.nbProgressWired === '1') return;
    card.dataset.nbProgressWired = '1';
    const els = {
      minutes: document.getElementById('mTotal'),
      streak: document.getElementById('mStreak'),
      sessions: document.getElementById('mSessions'),
      breaths: document.getElementById('mBreaths'),
      today: document.getElementById('todayNow'),
      last: document.getElementById('lastSessionLine'),
      calTitle: document.getElementById('calTitle'),
      calGrid: document.getElementById('calGrid'),
      calBody: document.getElementById('calBody'),
      calPrev: document.getElementById('calPrev'),
      calNext: document.getElementById('calNext'),
      dayDetail: document.getElementById('calDayDetail')
    };
    if (!els.calGrid || !els.calBody || !els.calTitle) return;

    const nowFormatter = new Intl.DateTimeFormat('en-GB',{ timeZone:timezone, weekday:'long', day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:false });
    const monthFormatter = new Intl.DateTimeFormat('en-GB',{ timeZone:timezone, month:'long', year:'numeric' });
    const dayLabelFormatter = new Intl.DateTimeFormat('en-GB',{ timeZone:timezone, day:'2-digit', month:'long', year:'numeric' });

    function fallbackDayKey(date){
      const d = date instanceof Date ? date : new Date(date);
      if (Number.isNaN(d.getTime())) return '';
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth()+1).padStart(2,'0');
      const day = String(d.getUTCDate()).padStart(2,'0');
      return `${y}-${m}-${day}`;
    }
    function parseDayKey(key){
      if (!key) return null;
      const parts = key.split('-').map(Number);
      if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return null;
      return new Date(Date.UTC(parts[0], parts[1]-1, parts[2]));
    }
    function formatMinutesLabel(seconds){
      if (!seconds) return '0m';
      const minutes = seconds / 60;
      if (minutes < 1) return '<=1m';
      if (minutes < 10 && Math.abs(minutes - Math.round(minutes)) > 0.05){
        return minutes.toFixed(1).replace(/\.0$/,'') + 'm';
      }
      return Math.round(minutes) + 'm';
    }
    function collectLegacyProgress(pageSlug){
      const result = { sessions:0, minutes:0, last:null };
      const slug = typeof pageSlug === 'string' ? pageSlug.trim().toLowerCase() : '';
      try{
        if (!window.localStorage) return result;
        const len = localStorage.length;
        for (let i=0; i<len; i++){
          const key = localStorage.key(i);
          if (!key || key.indexOf('mpl.progress.') !== 0) continue;
          if (slug){
            const suffix = key.slice('mpl.progress.'.length).toLowerCase();
            const normalized = suffix.replace(/\.count$/,'');
            const base = normalized.split('.')[0];
            const matches = slug === normalized || slug === base || slug.indexOf(base) !== -1 || base.indexOf(slug) !== -1;
            if (!matches) continue;
          }
          const value = localStorage.getItem(key);
          if (!value) continue;
          if (key.endsWith('.count')){
            const count = Number(value) || 0;
            result.sessions += count;
            result.minutes += count;
            continue;
          }
          try{
            const data = JSON.parse(value);
            if (!data || typeof data !== 'object') continue;
            if (data.sessions) result.sessions += Number(data.sessions) || 0;
            if (data.minutes) result.minutes += Number(data.minutes) || 0;
            if (data.last){
              const lastDate = new Date(data.last);
              if (!Number.isNaN(lastDate.getTime())){
                if (!result.last || lastDate > result.last) result.last = lastDate;
              }
            }
          }catch{}
        }
      }catch{}
      return result;
    }

    let viewDate = new Date();
    viewDate.setHours(0,0,0,0);
    let viewYear = viewDate.getFullYear();
    let viewMonth = viewDate.getMonth();
    let calendarHistory = {};
    let selectedCell = null;
    const todayKey = Stats?.toDayKey ? Stats.toDayKey(new Date()) : fallbackDayKey(new Date());

    function updateNowLine(){
      if (els.today) els.today.textContent = 'Today: ' + nowFormatter.format(new Date());
    }
    updateNowLine();
    try{ setInterval(updateNowLine, 60000); }catch{}

    function showDayDetail(dayKey, record){
      if (!els.dayDetail) return;
      const dateObj = parseDayKey(dayKey);
      const label = dateObj ? dayLabelFormatter.format(dateObj) : (dayKey || 'Unknown day');
      if (!record || !record.sessions){
        els.dayDetail.hidden = false;
        els.dayDetail.textContent = `${label}: No practice logged.`;
        return;
      }
      const parts = [`${label}: ${formatMinutesLabel(record.seconds || 0)}`, `${record.sessions} session${record.sessions === 1 ? '' : 's'}`];
      if (record.breaths) parts.push(`${record.breaths} breath${record.breaths === 1 ? '' : 's'}`);
      els.dayDetail.hidden = false;
      els.dayDetail.textContent = parts.join(' · ');
    }

    function drawCalendar(){
      els.calBody.innerHTML = '';
      if (els.dayDetail) els.dayDetail.hidden = true;
      selectedCell = null;

      const monthDate = new Date(Date.UTC(viewYear, viewMonth, 1));
      els.calTitle.textContent = monthFormatter.format(monthDate);

      const firstDow = (monthDate.getUTCDay() + 6) % 7;
      const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
      const rowCount = Math.ceil((firstDow + daysInMonth) / 7);
      let dayNumber = 1 - firstDow;

      for (let rowIndex=0; rowIndex<rowCount; rowIndex++){
        const row = document.createElement('div');
        row.className = 'cal-row';
        row.setAttribute('role','row');

        for (let colIndex=0; colIndex<7; colIndex++, dayNumber++){
          if (dayNumber < 1 || dayNumber > daysInMonth){
            const filler = document.createElement('div');
            filler.className = 'cal-cell empty';
            filler.setAttribute('role','presentation');
            filler.setAttribute('aria-hidden','true');
            row.appendChild(filler);
            continue;
          }

          const cell = document.createElement('div');
          cell.className = 'cal-cell';
          cell.setAttribute('role','gridcell');

          const dateEl = document.createElement('div');
          dateEl.className = 'date';
          dateEl.textContent = dayNumber;

          const minsEl = document.createElement('div');
          minsEl.className = 'mins';
          minsEl.textContent = '0m';

          const marksEl = document.createElement('div');
          marksEl.className = 'marks';

          const cellDate = new Date(Date.UTC(viewYear, viewMonth, dayNumber));
          const dayKey = Stats?.toDayKey ? Stats.toDayKey(cellDate) : fallbackDayKey(cellDate);
          const record = calendarHistory[dayKey];

          if (record && record.sessions){
            cell.classList.add('has-data');
            const labelMinutes = formatMinutesLabel(record.seconds || 0);
            minsEl.textContent = labelMinutes;
            cell.setAttribute('data-day', dayKey);
            cell.title = `${dayLabelFormatter.format(cellDate)} — ${labelMinutes} · ${record.sessions} session${record.sessions === 1 ? '' : 's'}`;
            cell.setAttribute('aria-label', cell.title);

            const dots = Math.min(record.sessions, 3);
            for (let i=0; i<dots; i++){
              const dot = document.createElement('span');
              dot.className = 'dot';
              marksEl.appendChild(dot);
            }
            if (record.sessions > 3){
              const extra = document.createElement('span');
              extra.className = 'dot extra';
              extra.textContent = '+' + (record.sessions - 3);
              marksEl.appendChild(extra);
            }

            cell.addEventListener('click', ()=>{
              if (selectedCell) selectedCell.classList.remove('is-selected');
              selectedCell = cell;
              cell.classList.add('is-selected');
              showDayDetail(dayKey, record);
            });
          } else {
            cell.title = dayLabelFormatter.format(cellDate);
            cell.setAttribute('aria-label', cell.title);
            cell.addEventListener('click', ()=>{
              if (selectedCell) selectedCell.classList.remove('is-selected');
              selectedCell = cell;
              cell.classList.add('is-selected');
              showDayDetail(dayKey, null);
            });
          }

          if (todayKey && dayKey === todayKey){
            cell.classList.add('today');
            cell.setAttribute('aria-current','date');
          }

          cell.append(dateEl, minsEl, marksEl);
          row.appendChild(cell);
        }

        els.calBody.appendChild(row);
      }
    }

    function refreshProgress(){
      const stats = pageId ? Stats?.get?.({ pageId }) : Stats?.get?.();
      const fallback = (!stats || !stats.sessions) ? collectLegacyProgress(pageId) : null;

      const totalMinutes = stats ? Math.round(stats.totalMinutesExact || stats.totalMinutes || 0) : Math.round(fallback?.minutes || 0);
      const totalSessions = stats ? stats.sessions || 0 : Math.round(fallback?.sessions || 0);
      const totalBreaths = stats ? stats.totalBreaths || 0 : 0;
      const dayStreak = stats ? stats.dayStreak || 0 : 0;
      const lastDate = stats?.lastSession ? new Date(stats.lastSession) : (fallback?.last || null);

      if (els.minutes) els.minutes.textContent = String(totalMinutes);
      if (els.sessions) els.sessions.textContent = String(totalSessions);
      if (els.breaths) els.breaths.textContent = String(totalBreaths);
      if (els.streak) els.streak.textContent = String(dayStreak);
      if (els.last){
        if (lastDate && !Number.isNaN(lastDate.getTime())){
          els.last.textContent = 'Last session: ' + nowFormatter.format(lastDate);
        } else {
          els.last.textContent = 'No sessions logged yet.';
        }
      }

      calendarHistory = stats?.history || {};
      drawCalendar();
    }

    refreshProgress();

    const targetPageId = (pageId || '').toLowerCase();

    els.calPrev?.addEventListener('click', ()=>{
      const d = new Date(Date.UTC(viewYear, viewMonth, 1));
      d.setUTCMonth(d.getUTCMonth() - 1);
      viewYear = d.getUTCFullYear();
      viewMonth = d.getUTCMonth();
      drawCalendar();
    });
    els.calNext?.addEventListener('click', ()=>{
      const d = new Date(Date.UTC(viewYear, viewMonth, 1));
      d.setUTCMonth(d.getUTCMonth() + 1);
      viewYear = d.getUTCFullYear();
      viewMonth = d.getUTCMonth();
      drawCalendar();
    });

    window.addEventListener('mpl:progress-update', evt=>{
      const evtPage = typeof evt?.detail?.pageId === 'string' ? evt.detail.pageId.trim().toLowerCase() : '';
      if (!targetPageId || !evtPage || evtPage === targetPageId){
        refreshProgress();
      }
    });

    window.addEventListener('storage', evt=>{
      if (evt && evt.key === 'mpl.stats.v1') refreshProgress();
    });
  }

  let manualProgressInit = false;
  function initManualProgressButtons(Stats){
    if (manualProgressInit) return;
    if (!Stats?.addSession || !Stats?.get) return;
    const buttons = Array.from(document.querySelectorAll('[data-mpl-prog]'));
    if (!buttons.length) return;
    manualProgressInit = true;

    const normalize = value => (typeof value === 'string' ? value.trim().toLowerCase() : '');
    const slugBadges = new Map();
    const seenSlugs = new Set();

    function updateBadge(slug){
      const badge = slugBadges.get(slug);
      if (!badge) return;
      let minutes = 0;
      try{
        const stats = Stats.get({ pageId: slug });
        if (stats){
          if (typeof stats.totalMinutesExact === 'number' && !Number.isNaN(stats.totalMinutesExact)){
            minutes = Math.round(stats.totalMinutesExact);
          } else if (typeof stats.totalMinutes === 'number' && !Number.isNaN(stats.totalMinutes)){
            minutes = Math.round(stats.totalMinutes);
          } else if (typeof stats.totalSeconds === 'number' && !Number.isNaN(stats.totalSeconds)){
            minutes = Math.round(stats.totalSeconds / 60);
          } else if (typeof stats.sessions === 'number' && !Number.isNaN(stats.sessions)){
            minutes = Math.round(stats.sessions);
          }
        }
      }catch{}
      if (!minutes){
        try{
          const legacyCount = Number(localStorage.getItem(`mpl.progress.${slug}.count`) || '0');
          if (!Number.isNaN(legacyCount) && legacyCount > minutes) minutes = legacyCount;
          if (!minutes){
            const legacyRaw = localStorage.getItem(`mpl.progress.${slug}`);
            if (legacyRaw){
              try{
                const legacyData = JSON.parse(legacyRaw);
                if (legacyData && typeof legacyData.minutes === 'number' && !Number.isNaN(legacyData.minutes)){
                  minutes = Math.round(legacyData.minutes);
                }
              }catch{}
            }
          }
        }catch{}
      }
      minutes = Math.max(0, minutes);
      badge.textContent = `Completed: ${minutes} min`;
    }

    buttons.forEach(button => {
      if (!button) return;
      const slug = normalize(button.getAttribute('data-mpl-prog'));
      if (!slug) return;
      let target = button;
      if (button.dataset.nbProgressBtnWired !== '1'){
        const clone = button.cloneNode(true);
        clone.dataset.nbProgressBtnWired = '1';
        if (button.parentNode){
          button.parentNode.replaceChild(clone, button);
        }
        target = clone;
      }
      const badgeId = `mpl-prog-${slug}`;
      const badge = document.getElementById(badgeId);
      if (badge) slugBadges.set(slug, badge);

      if (target.dataset.nbManualProgressBound === '1'){
        if (!seenSlugs.has(slug)){
          seenSlugs.add(slug);
          updateBadge(slug);
        }
        return;
      }
      target.dataset.nbManualProgressBound = '1';

      target.addEventListener('click', evt => {
        evt.preventDefault();
        evt.stopPropagation();
        try{
          Stats.addSession({ seconds:60, breaths:0, techId:`manual-${slug}`, pageId: slug, source:'manual' });
        }catch{}
        updateBadge(slug);
      });

      if (!seenSlugs.has(slug)){
        seenSlugs.add(slug);
        updateBadge(slug);
      }
    });

    const handleProgressUpdate = evt => {
      const slug = normalize(evt?.detail?.pageId);
      if (!slug || !slugBadges.has(slug)) return;
      updateBadge(slug);
    };

    const handleStorage = evt => {
      if (evt && evt.key === 'mpl.stats.v1'){
        slugBadges.forEach((_, slug) => updateBadge(slug));
      }
    };

    window.addEventListener('mpl:progress-update', handleProgressUpdate);
    window.addEventListener('storage', handleStorage);
  }

  const root = window.__MSHARE__ = window.__MSHARE__ || {};
  if (!root.Stats || typeof root.Stats.addSession !== 'function'){
    root.Stats = createStatsModule();
  }
  const Stats = root.Stats;
  const TZ = Stats?.timezone || 'Europe/London';
  const PAGE_ID = typeof root.pageId === 'string' && root.pageId ? root.pageId : resolvePageId();
  root.pageId = PAGE_ID;

  initCookieBanner({ pageId: PAGE_ID, root });

  if (typeof root.nbNormalizeLinks === 'function') root.nbNormalizeLinks();
  if (typeof root.nbEnsureSkipLink === 'function') root.nbEnsureSkipLink();
  if (typeof root.nbInitPageSeeder === 'function') root.nbInitPageSeeder();

  const nav = document.getElementById('mainNav') || document.getElementById('nav');
  const toggle = document.getElementById('navToggle');

  function initGlobalFocusScreenLauncher(){
    const shouldAutoOpen = (() => {
      try{
        const params = new URLSearchParams(window.location.search || '');
        return params.get('openFocusScreen') === '1' || params.get('focusScreen') === '1';
      }catch{
        return false;
      }
    })();

    if (PAGE_ID === 'index' && shouldAutoOpen){
      window.addEventListener('load', () => {
        const start = document.getElementById('heroOrbitStart');
        if (start && typeof start.click === 'function'){
          start.click();
        }
      }, { once: true });
    }

    document.addEventListener('click', evt => {
      const link = evt.target && evt.target.closest ? evt.target.closest('a[href="focus.html"]') : null;
      if (!link) return;
      if (!link.classList || !link.classList.contains('btn')) return;
      evt.preventDefault();
      evt.stopPropagation();
      window.location.href = 'index.html?openFocusScreen=1#top';
    });
  }

  initGlobalFocusScreenLauncher();

  if (toggle && !toggle.dataset.navWired) {
    toggle.dataset.navWired = '1';
    toggle.addEventListener('click', () => {
      if (!nav) {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        return;
      }

      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

      if (!open) {
        nav.querySelectorAll('.menu-group.open, .nav-group.open').forEach(group => group.classList.remove('open'));
        nav.querySelectorAll('.menu-toggle[aria-expanded], .nav-button[aria-expanded]').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
      }
    });
  }

  const modernGroups = Array.from(document.querySelectorAll('.menu-group'));
  if (modernGroups.length) {
    const closeAll = () => {
      modernGroups.forEach(group => {
        group.classList.remove('open');
        group.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
      });
    };

    modernGroups.forEach(group => {
      const btn = group.querySelector('.menu-toggle');
      if (!btn || btn.dataset.navSubWired === '1') return;
      btn.dataset.navSubWired = '1';
      btn.addEventListener('click', () => {
        const willOpen = !group.classList.contains('open');
        closeAll();
        if (willOpen) {
          group.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    if (!document.__mshareNavClickAway) {
      document.__mshareNavClickAway = true;
      document.addEventListener('click', event => {
        if (!event.target.closest('.menu-group')) closeAll();
      });
    }
  }

  const legacyGroups = Array.from(document.querySelectorAll('.nav-group'));
  if (legacyGroups.length) {
    const resetLegacy = () => {
      legacyGroups.forEach(group => {
        group.classList.remove('open');
        group.querySelector('.nav-button')?.setAttribute('aria-expanded', 'false');
      });
    };

    legacyGroups.forEach(group => {
      const btn = group.querySelector('.nav-button');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const willOpen = !group.classList.contains('open');
        resetLegacy();
        if (willOpen) {
          group.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  initTechPlayers({ Stats, pageId: PAGE_ID });
  initTechActionBlocks({ Stats, pageId: PAGE_ID });
  initProgressCard({ Stats, timezone: TZ, pageId: PAGE_ID });

  function initDownloadButtons(root = document){
    if (!root) return;
    root.querySelectorAll('[data-download]').forEach(btn => {
      if (!btn || btn.dataset.nbDownloadWired === '1') return;
      btn.dataset.nbDownloadWired = '1';
      btn.addEventListener('click', () => {
        const fileName = (btn.dataset.download || '').trim();
        if (!fileName) return;
        const target = /^(?:https?:|mailto:)/i.test(fileName)
          ? fileName
          : `assets/downloads/${fileName}`;
        try {
          window.open(target, '_blank', 'noopener');
        } catch {
          window.location.href = target;
        }
      });
    });
  }

  initDownloadButtons(document);

  function initAdhdPage(env = {}){
    const pageId = typeof env?.pageId === 'string' ? env.pageId.trim().toLowerCase() : '';
    const allowedPages = new Set(['adhd','adhd-tools']);
    if (!allowedPages.has(pageId)) return;
    const doc = typeof document !== 'undefined' ? document : null;
    if (!doc) return;
    const canMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    const motionQuery = canMatchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const prefersReducedMotion = !!motionQuery?.matches;
    const heroActionDelay = prefersReducedMotion ? 120 : 480;

    function resolveTarget(targetLike){
      if (!targetLike) return null;
      if (typeof targetLike === 'string'){
        const trimmed = targetLike.trim();
        if (!trimmed) return null;
        let resolved = doc.querySelector(trimmed);
        if (!resolved && trimmed.startsWith('#')){
          resolved = doc.getElementById(trimmed.slice(1));
        }
        if (!resolved && !trimmed.startsWith('#')){
          resolved = doc.getElementById(trimmed);
        }
        return resolved;
      }
      if (typeof Element !== 'undefined' && targetLike instanceof Element){
        return targetLike;
      }
      return null;
    }

    function scrollToTarget(targetLike, options = {}){
      const target = resolveTarget(targetLike);
      if (!target) return null;
      if (typeof target.scrollIntoView === 'function'){
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : (options.behavior || 'smooth'),
          block: options.block || 'start'
        });
      }
      if (options.focus !== false && typeof target.focus === 'function'){
        try {
          target.focus({ preventScroll: true });
        } catch {}
      }
      return target;
    }
    const rootState = window.__MSHARE__ = window.__MSHARE__ || {};
    if (rootState.__adhdInit) return;
    rootState.__adhdInit = true;

    const shellMarker = doc.querySelector('.adhd-shell') || doc.getElementById('adhd-tools-hero') || doc.getElementById('adhd-practice-zone');
    if (!shellMarker) return;

    const heroActivityList = doc.querySelector('[data-hero-activity-log]');
    const heroActivityEmpty = doc.querySelector('[data-hero-activity-empty]');

  const StatsModule = env?.Stats;
  const statsPageId = pageId === 'adhd-tools' ? 'adhd-tools' : 'adhd';

    const pick = (...ids) => {
      for (const id of ids){
        if (!id) continue;
        const el = doc.getElementById(id);
        if (el) return el;
      }
      return null;
    };

    const ls = {
      get(key){
        try{
          const raw = window.localStorage?.getItem(key);
          return raw === null ? null : JSON.parse(raw);
        }catch{
          return null;
        }
      },
      set(key, value){
        try{
          window.localStorage?.setItem(key, JSON.stringify(value));
        }catch{
          /* ignore */
        }
      }
    };

    const AGE_CONFIGS = {
      '0-6': {
        label:'Early years (0–6)',
        summary:'attention naturally comes in tiny bursts. Aim for fun, 2–4 minute focus moments with lots of movement, play and immediate praise.',
        baseline:'2–3 min',
        stretch:'4–5 min',
        breaks:'1–2 min movement',
        seconds:180,
        gameTitle:'Game: "Treasure Timer"',
        gameDesc:'Put a favourite toy or sticker chart in view. Set the timer for 2–3 minutes — tidy blocks, colour, or look at a picture book together until the timer ends. When it beeps, celebrate and add a sticker to the "treasure map".',
        tips:[
          'Keep instructions short: "We build until the timer says stop."',
          'Use big, visible timers and playful language rather than "work" or "behave".',
          'End on success, even if you stop before the timer sometimes.'
        ]
      },
      '7-12': {
        label:'Primary (7–12)',
        summary:'focus is growing but still sensitive to interest and fatigue. Use 5–10 minute blocks with movement, humour and clear, visual goals.',
        baseline:'5–8 min',
        stretch:'10–15 min',
        breaks:'3–5 min movement',
        seconds:420,
        gameTitle:'Game: "Quest for 3 stars"',
        gameDesc:'Set a 7-minute timer. List three tiny quests on a sticky note (e.g., write name, answer two questions, put books away). When all three are done before the timer ends, earn a star or token.',
        tips:[
          'Use simple checklists or doodle icons instead of long written instructions.',
          'Offer a menu of rewards: choosing a song, drawing time, a short game.',
          'Stack harder tasks right after a physical break, not at the end of the day.'
        ]
      },
      '13-17': {
        label:'Teens (13–17)',
        summary:'screens, exams and social life compete for attention. Use 10–20 minute sprints with clear rewards and tech boundaries agreed in advance.',
        baseline:'10–15 min',
        stretch:'20–25 min',
        breaks:'5–10 min reset',
        seconds:900,
        gameTitle:'Game: "Boss-level checkpoints"',
        gameDesc:'Create a 15-minute "boss level": choose one assignment, divide it into three tiny checkpoints (open file, outline, first paragraph). Start the timer and tick off checkpoints as you reach them.',
        tips:[
          'Keep phones in a different room or face-down basket during sprints.',
          'Pair revision with body-doubling (online or in-person) for accountability.',
          'Use music without lyrics or brown noise if sound helps, silence if it distracts.'
        ]
      },
      '18-25': {
        label:'Young adults (18–25)',
        summary:'study, work and life admin collide. Use 15–25 minute blocks and treat planning time as real work, not a luxury.',
        baseline:'15–20 min',
        stretch:'25–30 min',
        breaks:'5–10 min movement / snack',
        seconds:1200,
        gameTitle:'Game: "Inbox raid"',
        gameDesc:'Set a 20-minute timer. Your mission: clear or categorise as many messages as you can into three folders (Today, This week, Parked). Count how many you move before time runs out.',
        tips:[
          'Batch similar tasks (emails, calls, forms) rather than switching every few minutes.',
          'Use calendars and reminders as external memory, not proof of failure.',
          'End each block by writing the next tiny step for future-you.'
        ]
      },
      '26-40': {
        label:'Adults (26–40)',
        summary:'competing roles (work, caring, family) stretch attention. Use realistic 20–30 minute focus windows with strong boundaries around start and stop.',
        baseline:'20–25 min',
        stretch:'30–35 min',
        breaks:'5–10 min move / tidy / reset',
        seconds:1500,
        gameTitle:'Game: "One-drawer victory"',
        gameDesc:'Choose one drawer, inbox folder or mini-project. Set a 25-minute timer and see how much progress you can make without opening new tabs. Record one clear win at the end.',
        tips:[
          'Protect small, regular focus slots instead of waiting for a perfect free day.',
          'Agree signals with family or colleagues for "do not interrupt" time.',
          'Automate or delegate boring-but-essential tasks where possible.'
        ]
      },
      '41-50': {
        label:'Adults (41–50)',
        summary:'energy, health and responsibilities may shift. Use flexible 15–25 minute blocks with gentle pacing, especially if sleep or mood are affected.',
        baseline:'15–20 min',
        stretch:'25–30 min',
        breaks:'5–10 min gentle movement',
        seconds:1200,
        gameTitle:'Game: "Timeline tiles"',
        gameDesc:'Write today\'s three key tasks on separate sticky notes. Set a 20-minute timer and move each note from "Not started" to "In progress" to "Done" as you work.',
        tips:[
          'Schedule focus blocks for your best energy times, not when you are exhausted.',
          'Combine focus with wellbeing habits: water, movement, breathing, medication on time.',
          'Review workload with a manager or GP if demands routinely exceed capacity.'
        ]
      }
    };

    const HERO_ACTIVITY_OVERRIDES = {
      'adhd-guided-warmup':'Guided warm-up · 4-minute flow',
      'adhd-attention-game':'Attention game · 30-second round'
    };

    function toTitleCase(value){
      return value.replace(/(^|\s)([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
    }

    function getHeroActivityLabel(techId){
      if (!techId) return 'Activity';
      if (HERO_ACTIVITY_OVERRIDES[techId]) return HERO_ACTIVITY_OVERRIDES[techId];
      if (techId.startsWith('adhd-workout-')){
        const ageKey = techId.replace('adhd-workout-','');
        const ageLabel = AGE_CONFIGS[ageKey]?.label || `Age ${ageKey}`;
        return `Focus workout · ${ageLabel}`;
      }
      return toTitleCase(techId.replace(/[-_]+/g,' '));
    }

    const ageSummaryEl = doc.getElementById('ageSummary');
    const ageBaselineEl = doc.getElementById('ageBaseline');
    const ageStretchEl = doc.getElementById('ageStretch');
    const ageBreaksEl = doc.getElementById('ageBreaks');
    const ageGameTitleEl = doc.getElementById('ageGameTitle');
    const ageGameDescEl = doc.getElementById('ageGameDesc');
    const ageGameTipsEl = doc.getElementById('ageGameTips');
    const ageTabs = Array.from(doc.querySelectorAll('.age-tab'));

    let currentAgeKey = ageTabs.find(btn => btn.classList.contains('active'))?.getAttribute('data-age') || '0-6';

    function renderAge(key){
      const conf = AGE_CONFIGS[key];
      if (!conf) return;
      currentAgeKey = key;
      if (ageSummaryEl) ageSummaryEl.innerHTML = `<strong>${conf.label}:</strong> ${conf.summary}`;
      if (ageBaselineEl) ageBaselineEl.textContent = conf.baseline;
      if (ageStretchEl) ageStretchEl.textContent = conf.stretch;
      if (ageBreaksEl) ageBreaksEl.textContent = conf.breaks;
      if (ageGameTitleEl) ageGameTitleEl.textContent = conf.gameTitle;
      if (ageGameDescEl) ageGameDescEl.textContent = conf.gameDesc;
      if (ageGameTipsEl) ageGameTipsEl.innerHTML = Array.isArray(conf.tips) ? conf.tips.map(tip => `<li>${tip}</li>`).join('') : '';
    }

    ageTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-age');
        if (!key) return;
        ageTabs.forEach(item => {
          const isActive = item === btn;
          item.classList.toggle('active', isActive);
          item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        renderAge(key);
      });
    });

    renderAge(currentAgeKey);

    const timerDisplay = doc.getElementById('timerDisplay');
    const timerFill = doc.getElementById('timerFill');
    const timerStatus = doc.getElementById('timerStatus');
    const btnTimerStart = doc.getElementById('btnTimerStart');
    const btnTimerStop = doc.getElementById('btnTimerStop');
    const statFocusSessionsEl = doc.getElementById('statFocusSessions');
    const statFocusMinutesEl = doc.getElementById('statFocusMinutes');
    const statHeroMinutesEl = doc.getElementById('statHeroMinutes');
    const statBestScoreEl = doc.getElementById('statBestScore');
    const gameBestEl = doc.getElementById('toolsGameBest');
    const practiceGuidedCountEl = doc.getElementById('toolsGuidedCount');

    const LS_KEYS = {
      sessions:'adhd_focus_sessions',
      minutes:'adhd_focus_minutes',
      best:'adhd_best_click_score',
      guided:'adhd_guided_completed'
    };

    let focusSessions = 0;
    let focusMinutes = 0;
    let bestScore = 0;
    let guidedCompleted = 0;

    function formatSessionsLabel(count){
      const safe = Math.max(0, Number(count) || 0);
      return `${safe} session${safe === 1 ? '' : 's'}`;
    }

    function buildHeroActivityEntries(){
      const entries = [];
      const totals = {};
      if (StatsModule?.get){
        try{
          const stats = StatsModule.get({ pageId: statsPageId });
          const history = stats?.history || {};
          Object.keys(history).forEach(dayKey => {
            const day = history[dayKey];
            if (!day || !day.techs) return;
            Object.keys(day.techs).forEach(techId => {
              const value = Number(day.techs[techId] || 0);
              if (!value) return;
              totals[techId] = (totals[techId] || 0) + value;
            });
          });
        }catch{}
      }

      Object.keys(totals).forEach(techId => {
        const count = Math.max(0, Number(totals[techId] || 0));
        entries.push({
          id: techId,
          name: getHeroActivityLabel(techId),
          score: formatSessionsLabel(count),
          priority: techId.includes('attention-game') ? 1 : techId.includes('guided') ? 2 : 3
        });
      });

      if (bestScore > 0){
        const rounded = Math.max(0, Math.round(bestScore));
        entries.push({
          id: 'adhd-attention-game-best',
          name: 'Attention game · best score',
          score: `${rounded} tap${rounded === 1 ? '' : 's'}`,
          priority: 0
        });
      }

      if (focusMinutes > 0 && !entries.some(entry => entry.id.startsWith('adhd-workout'))){
        const roundedMinutes = Math.max(1, Math.round(focusMinutes));
        entries.push({
          id: 'adhd-workout-summary',
          name: 'Focus workouts · all ages',
          score: `${roundedMinutes} min logged`,
          priority: 4
        });
      }

      if (guidedCompleted > 0 && !entries.some(entry => entry.id === 'adhd-guided-warmup')){
        const roundedGuided = Math.max(0, Math.round(guidedCompleted));
        entries.push({
          id: 'adhd-guided-warmup-summary',
          name: HERO_ACTIVITY_OVERRIDES['adhd-guided-warmup'] || 'Guided warm-up',
          score: `${roundedGuided} run${roundedGuided === 1 ? '' : 's'}`,
          priority: 2.5
        });
      }

      return entries.sort((a, b) => (a.priority - b.priority) || a.name.localeCompare(b.name));
    }

    function renderHeroActivityLog(){
      if (!heroActivityList) return;
      const entries = buildHeroActivityEntries();
      heroActivityList.innerHTML = '';
      entries.forEach(entry => {
        const li = doc.createElement('li');
        li.className = 'nb-orbit-activity-log__item';
        li.innerHTML = `<span class="activity-name">${entry.name}</span><span class="activity-score">${entry.score}</span>`;
        heroActivityList.appendChild(li);
      });
      if (heroActivityEmpty){
        heroActivityEmpty.hidden = entries.length > 0;
      }
    }

    function updateStatsUI(){
      const minutesLabel = Math.max(0, Math.round(focusMinutes));
      if (statFocusSessionsEl) statFocusSessionsEl.textContent = String(Math.max(0, Math.round(focusSessions)));
      if (statFocusMinutesEl) statFocusMinutesEl.textContent = String(minutesLabel);
      if (statHeroMinutesEl) statHeroMinutesEl.textContent = String(minutesLabel);
      if (statBestScoreEl) statBestScoreEl.textContent = String(Math.max(0, Math.round(bestScore)));
      if (gameBestEl) gameBestEl.textContent = String(Math.max(0, Math.round(bestScore)));
      if (practiceGuidedCountEl) practiceGuidedCountEl.textContent = String(Math.max(0, Math.round(guidedCompleted)));
      renderHeroActivityLog();
    }

    function loadStats(){
      const sessions = Number(ls.get(LS_KEYS.sessions)) || 0;
      const minutes = Number(ls.get(LS_KEYS.minutes)) || 0;
      const best = Number(ls.get(LS_KEYS.best)) || 0;
      const guided = Number(ls.get(LS_KEYS.guided)) || 0;
      focusSessions = sessions;
      focusMinutes = minutes;
      bestScore = best;
      guidedCompleted = guided;
      updateStatsUI();
    }

    function saveStats(){
      ls.set(LS_KEYS.sessions, Number.isFinite(focusSessions) ? focusSessions : 0);
      ls.set(LS_KEYS.minutes, Number.isFinite(focusMinutes) ? focusMinutes : 0);
      ls.set(LS_KEYS.best, Number.isFinite(bestScore) ? bestScore : 0);
      ls.set(LS_KEYS.guided, Number.isFinite(guidedCompleted) ? guidedCompleted : 0);
    }

    loadStats();

    let workoutTotal = 0;
    let workoutRemaining = 0;
    let workoutInterval = null;
    let workoutActive = false;

    function renderWorkoutTime(){
      if (!timerDisplay || !timerFill) return;
      const mins = Math.floor(workoutRemaining / 60);
      const secs = workoutRemaining % 60;
      timerDisplay.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
      const pct = workoutTotal > 0 ? ((workoutTotal - workoutRemaining) / workoutTotal) * 100 : 0;
      timerFill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    }

    function stopWorkout(showMessage){
      if (workoutInterval){
        clearInterval(workoutInterval);
        workoutInterval = null;
      }
      workoutActive = false;
      workoutRemaining = 0;
      if (timerDisplay) timerDisplay.textContent = '00:00';
      if (timerFill) timerFill.style.width = '0%';
      if (showMessage && timerStatus){
        timerStatus.textContent = 'Workout stopped early — adjust the length if it felt too long.';
      }
    }

    function startWorkout(){
      const conf = AGE_CONFIGS[currentAgeKey] || AGE_CONFIGS['0-6'];
      if (!conf || !timerDisplay || !timerFill) return;

      if (workoutActive) stopWorkout(false);

      workoutTotal = Number(conf.seconds) || 180;
      workoutRemaining = workoutTotal;
      workoutActive = true;

      if (timerStatus){
        timerStatus.textContent = 'Stay with one tiny task until the timer ends, then stretch and log one win.';
      }

      renderWorkoutTime();

      if (workoutInterval){
        clearInterval(workoutInterval);
        workoutInterval = null;
      }

      workoutInterval = setInterval(() => {
        workoutRemaining -= 1;
        if (workoutRemaining <= 0){
          workoutRemaining = 0;
          renderWorkoutTime();
          clearInterval(workoutInterval);
          workoutInterval = null;
          workoutActive = false;
          const minutes = Math.max(1, Math.round(workoutTotal / 60));
          focusSessions += 1;
          focusMinutes += minutes;
          updateStatsUI();
          saveStats();
          if (timerStatus){
            timerStatus.textContent = 'Workout complete — notice one win, then choose your next block.';
          }
          if (StatsModule?.addSession){
            try{
              StatsModule.addSession({ seconds:workoutTotal, breaths:0, techId:`adhd-workout-${currentAgeKey}`, pageId:statsPageId, source:'adhd-workout' });
            }catch{}
          }
          return;
        }
        renderWorkoutTime();
      }, 1000);
    }

    btnTimerStart?.addEventListener('click', startWorkout);
    btnTimerStop?.addEventListener('click', () => stopWorkout(true));

    const btnStartAgeWorkout = doc.getElementById('btnStartAgeWorkout');
    btnStartAgeWorkout?.addEventListener('click', () => {
      const targetSelector = btnStartAgeWorkout.dataset.scrollTarget || '#age-workouts-title';
      scrollToTarget(targetSelector);
      window.setTimeout(startWorkout, heroActionDelay);
    });

    const clickGameBoard = pick('clickGameBoard','toolsGameBoard');
    const gameShape = pick('gameShape','toolsGameShape');
    const gameTimeEl = pick('gameTime','toolsGameTime');
    const gameScoreEl = pick('gameScore','toolsGameScore');
    const btnGameStart = pick('btnGameStart','toolsGameStart');
    const btnGameReset = doc.getElementById('toolsGameReset');
    const btnOpenGameHero = doc.getElementById('btnOpenGame');
    const gameStatusEl = pick('gameStatus','toolsGameStatus');

    const GAME_DURATION = 30;
    let gameInterval = null;
    let gameRemaining = GAME_DURATION;
    let gameScore = 0;

    function updateGameDisplays(){
      if (gameTimeEl) gameTimeEl.textContent = String(gameRemaining);
      if (gameScoreEl) gameScoreEl.textContent = String(gameScore);
      if (gameBestEl) gameBestEl.textContent = String(Math.max(0, Math.round(bestScore)));
    }

    function placeShape(){
      if (!clickGameBoard || !gameShape) return;
      const boardRect = clickGameBoard.getBoundingClientRect();
      const shapeWidth = gameShape.offsetWidth || 38;
      const shapeHeight = gameShape.offsetHeight || 38;
      const padding = 8;
      const maxX = Math.max(padding, boardRect.width - shapeWidth - padding);
      const maxY = Math.max(padding, boardRect.height - shapeHeight - padding);
      const x = padding + Math.random() * Math.max(0, maxX - padding);
      const y = padding + Math.random() * Math.max(0, maxY - padding);
      gameShape.style.left = `${x}px`;
      gameShape.style.top = `${y}px`;
    }

    function endGame(){
      if (gameInterval){
        clearInterval(gameInterval);
        gameInterval = null;
      }
      gameRemaining = 0;
      updateGameDisplays();
      if (gameShape) gameShape.style.display = 'none';
      if (btnGameStart){
        btnGameStart.disabled = false;
        btnGameStart.setAttribute('aria-disabled','false');
      }
      if (gameScore > bestScore){
        bestScore = gameScore;
        updateStatsUI();
        saveStats();
      }
      if (StatsModule?.addSession){
        try{
          StatsModule.addSession({ seconds:GAME_DURATION, breaths:0, techId:'adhd-attention-game', pageId:statsPageId, source:'adhd-game' });
        }catch{}
      }
      if (gameStatusEl){
        gameStatusEl.textContent = `Game over — ${gameScore} tap${gameScore === 1 ? '' : 's'} in 30 seconds.`;
      }
    }

    function resetGame(message){
      if (gameInterval){
        clearInterval(gameInterval);
        gameInterval = null;
      }
      gameRemaining = GAME_DURATION;
      gameScore = 0;
      if (gameShape){
        gameShape.style.display = 'none';
        gameShape.style.left = 'auto';
        gameShape.style.top = 'auto';
      }
      if (btnGameStart){
        btnGameStart.disabled = false;
        btnGameStart.setAttribute('aria-disabled','false');
      }
      updateGameDisplays();
      if (gameStatusEl){
        gameStatusEl.textContent = message || '';
      }
    }

    function startGame(){
      if (!clickGameBoard || !gameShape || !gameTimeEl || !gameScoreEl) return;
      if (gameInterval){
        clearInterval(gameInterval);
        gameInterval = null;
      }
      gameRemaining = GAME_DURATION;
      gameScore = 0;
      updateGameDisplays();
      if (gameStatusEl) gameStatusEl.textContent = 'Tap the glowing coin each time it lands.';
      gameShape.style.display = 'flex';
      placeShape();
      if (btnGameStart){
        btnGameStart.disabled = true;
        btnGameStart.setAttribute('aria-disabled','true');
      }
      gameInterval = setInterval(() => {
        gameRemaining -= 1;
        if (gameRemaining <= 0){
          endGame();
        } else {
          updateGameDisplays();
        }
      }, 1000);
    }

    btnGameStart?.addEventListener('click', startGame);

    btnGameReset?.addEventListener('click', () => resetGame('Game reset — press start when you are ready.'));

    gameShape?.addEventListener('click', () => {
      if (gameRemaining <= 0) return;
      gameScore += 1;
      updateGameDisplays();
      placeShape();
    });

    btnOpenGameHero?.addEventListener('click', () => {
      const targetSelector = btnOpenGameHero.dataset.scrollTarget || '#clickGameCard';
      scrollToTarget(targetSelector);
      window.setTimeout(startGame, heroActionDelay);
    });

    if (clickGameBoard && gameTimeEl && gameScoreEl){
      resetGame('Press start to run the 30-second round.');
    }

    const heroActivityProgressListener = evt => {
      const evtPage = (evt?.detail?.pageId || '').trim().toLowerCase();
      if (evtPage && evtPage !== statsPageId) return;
      renderHeroActivityLog();
    };

    window.addEventListener('mpl:progress-update', heroActivityProgressListener);
    window.addEventListener('storage', evt => {
      if (!evt) return;
      if (evt.key === 'mpl.stats.v1'){
        renderHeroActivityLog();
      }
      if (Object.values(LS_KEYS).includes(evt.key)){
        loadStats();
      }
    });

  const guidedTimerEl = pick('guidedTimer','toolsGuidedTimer');
  const guidedStatusEl = pick('guidedStatus','toolsGuidedStatus');
  const guidedBarFill = pick('guidedBarFill','toolsGuidedProgress');
  const btnGuidedStart = pick('btnGuidedStart','toolsGuidedStart');
  const btnGuidedStop = pick('btnGuidedStop','toolsGuidedStop');
  const guidedPlaceholder = pick('guidedPlaceholder','toolsGuidedPlaceholder');

    const GUIDED_TOTAL = 240;
    let guidedRemaining = GUIDED_TOTAL;
    let guidedInterval = null;
    let guidedActive = false;

    function renderGuided(){
      if (!guidedTimerEl || !guidedBarFill) return;
      const mins = Math.floor(guidedRemaining / 60);
      const secs = guidedRemaining % 60;
      guidedTimerEl.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
      const pct = ((GUIDED_TOTAL - guidedRemaining) / GUIDED_TOTAL) * 100;
      guidedBarFill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    }

    function updateGuidedPhase(){
      if (!guidedStatusEl) return;
      const elapsed = GUIDED_TOTAL - guidedRemaining;
      if (elapsed < 60){
        guidedStatusEl.textContent = 'Phase 1 of 3: Breathing — slow, steady in for 4, out for 6.';
      } else if (elapsed < 180){
        guidedStatusEl.textContent = 'Phase 2 of 3: Quiet focus — stay with one tiny task until the timer moves on.';
      } else {
        guidedStatusEl.textContent = 'Phase 3 of 3: Stretch & praise — move, stretch, and notice one win.';
      }
    }

    function stopGuided(updateStatus){
      if (guidedInterval){
        clearInterval(guidedInterval);
        guidedInterval = null;
      }
      guidedActive = false;
      guidedRemaining = GUIDED_TOTAL;
      renderGuided();
      if (btnGuidedStart){
        btnGuidedStart.disabled = false;
        btnGuidedStart.setAttribute('aria-disabled','false');
      }
      if (updateStatus && guidedStatusEl){
        guidedStatusEl.textContent = 'Warm-up stopped. You can press play again when you are ready.';
      }
    }

    function startGuided(){
      if (!guidedTimerEl || !guidedBarFill || guidedActive) return;
      if (guidedInterval){
        clearInterval(guidedInterval);
        guidedInterval = null;
      }
      guidedRemaining = GUIDED_TOTAL;
      guidedActive = true;
      if (btnGuidedStart){
        btnGuidedStart.disabled = true;
        btnGuidedStart.setAttribute('aria-disabled','true');
      }
      renderGuided();
      updateGuidedPhase();
      guidedInterval = setInterval(() => {
        guidedRemaining -= 1;
        if (guidedRemaining <= 0){
          guidedRemaining = 0;
          renderGuided();
          clearInterval(guidedInterval);
          guidedInterval = null;
          guidedActive = false;
          if (btnGuidedStart){
            btnGuidedStart.disabled = false;
            btnGuidedStart.setAttribute('aria-disabled','false');
          }
          if (guidedStatusEl){
            guidedStatusEl.textContent = 'Warm-up complete — choose a small task and start a focus block.';
          }
          guidedCompleted += 1;
          updateStatsUI();
          saveStats();
          if (StatsModule?.addSession){
            try{
              StatsModule.addSession({ seconds:GUIDED_TOTAL, breaths:0, techId:'adhd-guided-warmup', pageId:statsPageId, source:'adhd-guided' });
            }catch{}
          }
          return;
        }
        renderGuided();
        updateGuidedPhase();
      }, 1000);
    }

    btnGuidedStart?.addEventListener('click', startGuided);
    btnGuidedStop?.addEventListener('click', () => stopGuided(true));
    guidedPlaceholder?.addEventListener('click', startGuided);
    renderGuided();

    doc.addEventListener('visibilitychange', () => {
      if (doc.visibilityState !== 'visible'){
        if (workoutActive) stopWorkout(true);
        if (guidedActive) stopGuided(true);
        if (gameInterval) endGame();
      }
    });
  }

  initAdhdPage({ Stats, pageId: PAGE_ID });

  // Initialize rewards engine (site-wide)
  if (typeof window.initNBRewardsEngine === 'function') {
    window.initNBRewardsEngine({ Stats, pageId: PAGE_ID });
  }

  window.MSHARE_VA_OPTS = {
    openOnInit: false,
    startMinimised: true,
    ttsEngine: 'speechSynthesis',
    preferUserVoices: ['Daniel', 'en-GB', 'English (United Kingdom)'],
    stripNonAlphabetic: true,
    rememberSettings: true,
    bindSelectors: '[data-va-bind]',
    speakOnPageIntroSelector: '',
    ariaLabels: { hide: 'Hide Voice Assistant', show: 'Show Voice Assistant', start: 'Start speaking', pause: 'Pause speaking', resume: 'Resume speaking', stop: 'Stop speaking', repeat: 'Repeat last speech' }
  };
})();
