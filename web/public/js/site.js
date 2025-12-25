(function(){
  function computeSitePrefix(){
    try{
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const marker = 'assets/js/site.js';
      const candidate = scripts.find(script => {
        const src = (script.getAttribute('src') || '').trim();
        return src.includes(marker);
      });
      if (!candidate) return '';
      const raw = (candidate.getAttribute('src') || '').trim();
      const src = raw.split('?')[0].split('#')[0];
      const idx = src.lastIndexOf(marker);
      if (idx === -1) return '';
      return src.slice(0, idx);
    }catch{
      return '';
    }
  }

  const NB_SITE_PREFIX = computeSitePrefix();

  function resolveSiteHref(rawHref){
    const href = String(rawHref || '').trim();
    if (!href) return href;

    const lower = href.toLowerCase();
    const isAbsolute = lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('mailto:') || lower.startsWith('tel:');
    if (isAbsolute) return href;
    if (href.startsWith('#') || href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) return href;
    if (!NB_SITE_PREFIX) return href;
    return NB_SITE_PREFIX + href;
  }

  function ensureBlogCssIsGlobal(){
    try{
      if (!document || !document.head) return;
      if (document.body && document.body.getAttribute('data-no-global-blog-css') === '1') return;

      const head = document.head;
      const styles = Array.from(head.querySelectorAll('link[rel="stylesheet"][href]'));
      const existing = styles.find(link => {
        const href = (link.getAttribute('href') || '').trim();
        return href.includes('blog-nhs.css');
      });

      const link = existing || document.createElement('link');
      if (!existing){
        link.rel = 'stylesheet';
        link.href = resolveSiteHref('assets/css/blog-nhs.css');
      }

      // Always make it the last stylesheet so it overrides page-specific CSS.
      const lastStylesheet = Array.from(head.querySelectorAll('link[rel="stylesheet"][href]')).pop();
      if (!lastStylesheet){
        head.appendChild(link);
        return;
      }
      if (lastStylesheet !== link){
        head.appendChild(link);
      }
    }catch{}
  }

  // Global blog theme injection is opt-in.
  // To enable on a page, add: data-use-global-blog-theme="1" to <body>.
  function shouldUseGlobalBlogTheme(){
    try{
      return !!(document && document.body && document.body.getAttribute('data-use-global-blog-theme') === '1');
    }catch{
      return false;
    }
  }

  if (shouldUseGlobalBlogTheme()){
    // Treat blog.html's stylesheet as the global stylesheet layer.
    ensureBlogCssIsGlobal();
  }

  function ensureGlobalBlogThemeOverrides(){
    try{
      if (!document || !document.body) return;
      if (document.body.getAttribute('data-no-global-blog-css') === '1') return;

      // Opt-in only.
      if (!shouldUseGlobalBlogTheme()) return;

      // Mark the document so assets/css/blog-nhs.css can apply the blog theme.
      document.body.setAttribute('data-nb-theme', 'blog');

      // Clean up older injected overrides (if any).
      const legacy = document.getElementById('nbGlobalBlogTheme');
      if (legacy){
        try{ legacy.remove(); }catch{}
      }
    }catch{}
  }

  ensureGlobalBlogThemeOverrides();

  // Note: do not force dark mode globally. The site-wide default theme is the
  // blog.html (light) palette; users/pages can still opt into dark if needed.

  function initGlobalNavigation(){
    const nav = document.getElementById('mainNav') || document.getElementById('nav');
    if (!nav) return;

    const groupEls = Array.from(nav.querySelectorAll('.menu-group'));
    if (!groupEls.length) return;

    const link = (href, label) => `<a href="${href}" data-href="${href}">${label}</a>`;
    const label = text => `<div class="menu-label" aria-hidden="true">${text}</div>`;
    const group = (heading, items) => {
      const inner = Array.isArray(items) ? items.join('') : String(items || '');
      return `<div class="submenu-group">${label(heading)}<div class="submenu-links">${inner}</div></div>`;
    };

    const menus = {
      conditions: [
        label('Neurodevelopmental'),
        link('autism.html', 'Autism'),
        link('autism-parent.html', 'Autism Parent'),
        link('adhd.html', 'ADHD'),
        link('dyslexia.html', 'Dyslexia'),
        label('Mental Health'),
        link('anxiety.html', 'Anxiety'),
        link('depression.html', 'Depression'),
        link('stress.html', 'Stress'),
        link('sleep.html', 'Sleep'),
        link('bipolar.html', 'Bipolar'),
        label('Mood & Burnout'),
        link('mood.html', 'Mood'),
        link('low-mood-burnout.html', 'Low Mood & Burnout')
      ].join(''),

      breathing: [
        label('Guides'),
        link('breath.html', 'Breath (how-to)'),
        link('focus.html', 'Focus'),
        link('mindfulness.html', 'Mindfulness'),
        label('Techniques'),
        link('sos-60.html', '60-second Reset'),
        link('box-breathing.html', 'Box Breathing'),
        link('4-7-8-breathing.html', '4-7-8 Breathing'),
        link('coherent-5-5.html', 'Coherent 5-5'),
        label('Training'),
        link('focus-garden.html', 'Focus Training (Garden)')
      ].join(''),

      tools: [
        group('Toolkits', [
          link('breath-tools.html', 'Breath Tools'),
          link('mood-tools.html', 'Mood Tools'),
          link('sleep-tools.html', 'Sleep Tools'),
          link('anxiety-tools.html', 'Anxiety Tools'),
          link('stress-tools.html', 'Stress Tools'),
          link('depression-tools.html', 'Depression Tools'),
          link('adhd-tools.html', 'ADHD Tools'),
          link('autism-tools.html', 'Autism Tools')
        ]),
        group('ADHD (deep dive)', [
          link('adhd-what-is.html', 'What is ADHD?'),
          link('adhd-assessment.html', 'Assessment'),
          link('adhd-diagnosis.html', 'Diagnosis'),
          link('adhd-support-home.html', 'Support at Home'),
          link('adhd-self-care.html', 'Self-care'),
          link('adhd-school.html', 'Working with School'),
          link('adhd-teens.html', 'Teens'),
          link('adhd-young-people.html', 'Young People'),
          link('adhd-helplines.html', 'Helplines'),
          link('adhd-focus-lab.html', 'ADHD Focus Lab')
        ]),
        group('More', [
          link('focus-garden.html', '🌱 Focus Training')
        ])
      ].join(''),

      about: [
        link('about.html', 'About'),
        link('aims-objectives.html', 'Aims & Objectives'),
        link('resources.html', 'Resources'),
        link('downloads.html', 'Downloads'),
        link('blog.html', 'Blog'),
        label('Support'),
        link('coffee.html', 'Support Us'),
        link('bank.html', 'Bank Details'),
        label('For schools'),
        link('teacher-quick-pack.html', 'Teacher Quick Pack'),
        label('Contact'),
        link('coach.html', 'Coach'),
        link('contact.html', 'Contact')
      ].join('')
    };

    function normalizeGroupLabel(text){
      return String(text || '').replace(/[▾▼]/g, '').trim().toLowerCase();
    }

    groupEls.forEach(group => {
      const btn = group.querySelector('.menu-toggle');
      const submenu = group.querySelector('.submenu');
      if (!btn || !submenu) return;
      const key = normalizeGroupLabel(btn.textContent);

      if (key.startsWith('conditions')){
        group.classList.add('menu-mega','menu-mega-2col');
        submenu.innerHTML = menus.conditions;
      }
      else if (key.startsWith('breathing') || key.startsWith('breathing & focus')) submenu.innerHTML = menus.breathing;
      else if (key === 'tools' || key.startsWith('tools')){
        group.classList.add('menu-mega');
        submenu.innerHTML = menus.tools;
      }
      else if (key === 'about' || key === 'more') submenu.innerHTML = menus.about;
    });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initGlobalNavigation);
  } else {
    initGlobalNavigation();
  }

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

    function recomputeTotals(){
      const history = state.history = state.history && typeof state.history === 'object' ? state.history : {};
      let totalSeconds = 0;
      let totalBreaths = 0;
      let totalSessions = 0;
      let lastSessionIso = null;

      Object.keys(history).forEach(dayKey => {
        const record = history[dayKey];
        if (!record) return;
        record.seconds = Math.max(0, Number(record.seconds || 0));
        record.breaths = Math.max(0, Number(record.breaths || 0));
        record.sessions = Math.max(0, Number(record.sessions || 0));

        if (!record.sessions && (!record.pages || !Object.keys(record.pages).length)){
          delete history[dayKey];
          return;
        }

        totalSeconds += record.seconds;
        totalBreaths += record.breaths;
        totalSessions += record.sessions;
        const referenceIso = record.updatedAt || record.firstRecordedAt;
        if (referenceIso){
          const refDate = new Date(referenceIso);
          if (!Number.isNaN(refDate.getTime())){
            if (!lastSessionIso || refDate > new Date(lastSessionIso)){
              lastSessionIso = referenceIso;
            }
          }
        }
      });

      state.sessions = totalSessions;
      state.totalSeconds = totalSeconds;
      state.totalBreaths = totalBreaths;
      state.lastSession = lastSessionIso;
      const anchorKey = lastSessionIso ? toDayKey(new Date(lastSessionIso)) : undefined;
      state.dayStreak = computeStreak(history, anchorKey);
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

    function resetPage(pageId){
      const slug = normalizePageId(pageId);
      if (!slug) return get();
      const history = state.history = state.history && typeof state.history === 'object' ? state.history : {};
      let changed = false;

      Object.keys(history).forEach(dayKey => {
        const record = history[dayKey];
        if (!record || !record.pages || !record.pages[slug]) return;
        const pageRecord = record.pages[slug];
        const seconds = Math.max(0, Number(pageRecord.seconds || 0));
        const breaths = Math.max(0, Number(pageRecord.breaths || 0));
        const sessions = Math.max(0, Number(pageRecord.sessions || 0));

        record.seconds = Math.max(0, Number(record.seconds || 0) - seconds);
        record.breaths = Math.max(0, Number(record.breaths || 0) - breaths);
        record.sessions = Math.max(0, Number(record.sessions || 0) - sessions);

        if (pageRecord.techs && record.techs && typeof record.techs === 'object'){
          Object.keys(pageRecord.techs).forEach(techId => {
            const nextValue = (record.techs[techId] || 0) - Number(pageRecord.techs[techId] || 0);
            if (nextValue > 0){
              record.techs[techId] = nextValue;
            } else {
              delete record.techs[techId];
            }
          });
        }

        delete record.pages[slug];
        if (record.pages && !Object.keys(record.pages).length){
          delete record.pages;
        }

        if (!record.sessions && (!record.pages || !Object.keys(record.pages).length)){
          delete history[dayKey];
        } else if (!record.sessions){
          record.updatedAt = record.firstRecordedAt || record.updatedAt || null;
        }
        changed = true;
      });

      if (!changed) return get({ pageId: slug });

      recomputeTotals();
      state.updatedAt = new Date().toISOString();
      save();

      const pageSnapshot = get({ pageId: slug });
      const globalSnapshot = get();
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function'){
        try{
          window.dispatchEvent(new CustomEvent('mpl:progress-update', {
            detail: {
              snapshot: globalSnapshot,
              pageId: slug,
              pageStats: pageSnapshot,
              source: 'page-reset'
            }
          }));
        }catch{}
      }
      return pageSnapshot;
    }
    return { addSession, get, resetPage, toDayKey, timezone:TZ };
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
    const disabledPages = new Set(['about','focus-garden']);
    if (disabledPages.has(pageId.toLowerCase())){
      const existing = document.getElementById('progressCard');
      if (existing) existing.remove();
      return;
    }
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

  function initHeroActivityCards(env){
    const Stats = env?.Stats;
    const pageId = typeof env?.pageId === 'string' ? env.pageId.trim().toLowerCase() : '';
    if (!Stats || typeof Stats.get !== 'function') return;
    if (document.body?.dataset.progressDisabled === 'true') return;

    const cloneHeroCard = (() => {
      const tpl = document.createElement('template');
      tpl.innerHTML = `
        <aside class="nb-hero-orbit" data-nb-activity-card="1" aria-label="Breathing rhythm visual with live stats">
          <div class="nb-orbit-visual" aria-hidden="true">
            <div class="nb-orbit-ring"></div>
            <div class="nb-orbit-orb"></div>
          </div>
          <div class="nb-orbit-label-row" aria-hidden="true">
            <div class="nb-orbit-label"><span></span> Inhale</div>
            <div class="nb-orbit-label"><span></span> Hold</div>
            <div class="nb-orbit-label"><span></span> Exhale</div>
          </div>
          <div class="nb-orbit-stat" aria-live="polite">
            <span>Today’s calm time</span>
            <strong><b data-hero-stat="today">0</b> min</strong>
          </div>
          <div class="nb-orbit-side">
            <div class="nb-orbit-side-title">
              <span data-hero-activity>Measured relief tracker</span>
              <span class="nb-orbit-side-pill" data-hero-streak-pill>
                <span aria-hidden="true">●</span>
                <span data-hero-stat="streak">No streak yet</span>
              </span>
            </div>
            <div class="nb-orbit-side-body">
              <p data-hero-stat="message">Complete any 1-minute challenge to start your streak. Small, regular practice helps your nervous system learn a predictable calm pattern.</p>
              <div class="nb-orbit-score">
                <span>Score awards</span>
                <p data-hero-stat="awards">Log a quick session to unlock your first badge.</p>
              </div>
              <div class="nb-orbit-mini-metrics">
                <div class="nb-orbit-mini-metric">
                  <span>Sessions</span>
                  <b data-hero-stat="sessions">0</b>
                </div>
                <div class="nb-orbit-mini-metric">
                  <span>Lifetime min</span>
                  <b data-hero-stat="minutes">0</b>
                </div>
                <div class="nb-orbit-mini-metric">
                  <span>Lifetime hrs</span>
                  <b data-hero-stat="hours">0</b>
                </div>
                <div class="nb-orbit-mini-metric">
                  <span>Avg session</span>
                  <b data-hero-stat="average">0 min</b>
                </div>
              </div>
              <div class="nb-hero-reset">
                <button type="button" data-hero-reset="auto" data-reset-label="Reset these stats" data-reset-done="Stats cleared">&#8635; Reset these stats</button>
                <small>Only clears this page's record on this device.</small>
              </div>
            </div>
          </div>
        </aside>
      `.trim();
      return () => tpl.content.firstElementChild.cloneNode(true);
    })();

    function ensureHeroActivityCardPresence(){
      const heroSections = Array.from(document.querySelectorAll('.card.hero, .hero-plate'));
      heroSections.forEach(section => {
        if (!section || section.dataset.heroCard === 'off' || section.dataset.activityCard === 'off') return;
        if (section.closest('#shareSheet')) return;
        if (section.querySelector('[data-nb-activity-card]')) return;
        const card = cloneHeroCard();
        const slot = section.querySelector('[data-nb-activity-slot]');
        const baseName = (section.getAttribute('data-activity-name') || section.querySelector('h1, h2')?.textContent || 'Measured relief tracker').trim();
        if (baseName) card.setAttribute('data-activity-name', baseName);
        const explicitPage = (section.getAttribute('data-activity-page') || '').trim().toLowerCase();
        const resolvedPage = explicitPage || pageId;
        if (resolvedPage) card.setAttribute('data-activity-page', resolvedPage);
        if (slot){
          slot.insertAdjacentElement('afterbegin', card);
        } else {
          section.insertAdjacentElement('afterbegin', card);
        }
      });
    }

    ensureHeroActivityCardPresence();

    const cards = Array.from(document.querySelectorAll('[data-nb-activity-card]')).filter(card => {
      if (!card || card.dataset.nbActivityCardReady === '1') return false;
      card.dataset.nbActivityCardReady = '1';
      if (!card.getAttribute('data-activity-page') && pageId) card.setAttribute('data-activity-page', pageId);
      const heroContainer = card.closest('.card.hero, .hero-plate');
      if (heroContainer && card.parentElement === heroContainer){
        heroContainer.dataset.nbActivityMounted = '1';
      }
      return true;
    });
    if (!cards.length) return;

    const numberFmt = new Intl.NumberFormat('en-GB');

    const configs = cards.map(card => {
      const labelNode = card.querySelector('[data-hero-activity]');
      const defaults = {
        message: (card.querySelector('[data-hero-stat="message"]')?.textContent || 'Complete any 1-minute challenge to start your streak.').trim(),
        awards: (card.querySelector('[data-hero-stat="awards"]')?.textContent || 'Log a quick session to unlock your first badge.').trim()
      };
      const activityName = (card.getAttribute('data-activity-name') || labelNode?.textContent || 'Measured relief tracker').trim();
      if (labelNode && activityName) labelNode.textContent = activityName;
      const attrPage = (card.getAttribute('data-activity-page') || '').trim().toLowerCase();
      const resetBtn = card.querySelector('[data-hero-reset]');
      if (resetBtn && (!resetBtn.getAttribute('data-hero-reset') || resetBtn.getAttribute('data-hero-reset') === 'auto')){
        const nextPage = attrPage || pageId;
        if (nextPage) resetBtn.setAttribute('data-hero-reset', nextPage);
      }
      return {
        node: card,
        defaults,
        pageId: attrPage || pageId,
        activityName
      };
    });

    function normalizePage(value){
      return typeof value === 'string' ? value.trim().toLowerCase() : '';
    }

    function setText(node, key, value){
      const target = node.querySelector(`[data-hero-stat="${key}"]`);
      if (target) target.textContent = value;
    }

    function minutesLabel(seconds, opts){
      const allowFraction = !!opts?.allowFraction;
      const minutes = seconds / 60;
      if (!minutes) return '0';
      if (minutes < 1) return '≤1';
      if (minutes < 10 && allowFraction){
        return minutes.toFixed(1).replace(/\.0$/,'');
      }
      return String(Math.round(minutes));
    }

    function hoursLabel(seconds){
      const hours = seconds / 3600;
      if (!hours) return '0';
      if (hours >= 10) return numberFmt.format(Math.round(hours));
      if (hours >= 1) return hours.toFixed(1).replace(/\.0$/,'');
      return hours.toFixed(2).replace(/0+$/,'').replace(/\.$/,'') || '0';
    }

    function averageLabel(seconds, sessions){
      if (!sessions) return '0 min';
      const avgMinutes = (seconds / sessions) / 60;
      if (avgMinutes < 1) return '≤1 min';
      if (avgMinutes < 10) return avgMinutes.toFixed(1).replace(/\.0$/,'') + ' min';
      return Math.round(avgMinutes) + ' min';
    }

    function buildMessage(stats, fallback){
      if (!stats || !stats.sessions) return fallback;
      const streak = Math.max(0, Number(stats.dayStreak || 0));
      const minutes = (Number(stats.totalSeconds || 0) / 60) || 0;
      const lastSession = stats.lastSession ? new Date(stats.lastSession) : null;
      let daysSince = null;
      if (lastSession && !Number.isNaN(lastSession.getTime())){
        daysSince = Math.max(0, Math.floor((Date.now() - lastSession.getTime()) / 86400000));
      }
      if (streak >= 4) return `🔥 ${streak}-day streak — nervous system learning this pattern.`;
      if (streak >= 2) return `Nice — ${streak} days in a row. Aim for day ${streak + 1} tomorrow.`;
      if (minutes >= 30) return 'Solid practice banked. Drop in for a 1-minute check-in to chase a streak.';
      if (daysSince === 0) return 'Session logged today. A short return tonight deepens the calm response.';
      if (daysSince !== null && daysSince <= 2) return 'Recent practice detected. Re-run this technique within 48h to reinforce it.';
      if (stats.sessions >= 1) return 'You have a saved session. Run another round to unlock streak tracking.';
      return fallback;
    }

    function buildAwards(stats, fallback){
      if (!stats || !stats.sessions) return fallback;
      const minutes = Number(stats.totalSeconds || 0) / 60;
      if (minutes >= 180) return '🌟 Regulation Pro — 3h+ recorded on this tool.';
      if (minutes >= 120) return '🏅 Nervous system shift — 2 hours logged here.';
      if (minutes >= 60) return '🥇 Deep Calm badge — 60+ minutes of guided work.';
      if (minutes >= 30) return '✨ Consistency badge — 30 minutes logged. Keep daily cues going.';
      if (minutes >= 10) return '🎖️ Focus booster — 10 minutes saved. Streak unlocks at 3 days.';
      return '🎉 Starter badge — first sessions saved. Come back tomorrow for streak glow.';
    }

    function setStreak(node, streak){
      const target = node.querySelector('[data-hero-stat="streak"]');
      const pill = node.querySelector('[data-hero-streak-pill]');
      if (target){
        target.textContent = streak ? `${streak} day${streak === 1 ? '' : 's'}` : 'No streak yet';
      }
      if (pill){
        pill.setAttribute('data-state', streak ? 'active' : 'idle');
        pill.setAttribute('aria-label', streak ? `${streak} day streak` : 'No streak yet');
      }
    }

    function safeGetStats(slug){
      if (!slug) return null;
      try{
        return Stats.get({ pageId: slug });
      }catch{
        return null;
      }
    }

    function refreshCard(config, stats){
      const history = stats?.history || {};
      const todayKey = Stats?.toDayKey ? Stats.toDayKey(new Date()) : null;
      const todaySeconds = todayKey && history[todayKey] ? Number(history[todayKey].seconds || 0) : 0;
      const totalSeconds = Math.max(0, Number(stats?.totalSeconds || 0));
      const sessions = Math.max(0, Number(stats?.sessions || 0));

      setText(config.node, 'today', minutesLabel(todaySeconds, { allowFraction:true }));
      setText(config.node, 'sessions', numberFmt.format(sessions));
      setText(config.node, 'minutes', numberFmt.format(Math.round(totalSeconds / 60)));
      setText(config.node, 'hours', hoursLabel(totalSeconds));
      setText(config.node, 'average', averageLabel(totalSeconds, sessions));
      setStreak(config.node, Math.max(0, Number(stats?.dayStreak || 0)));
      setText(config.node, 'message', buildMessage(stats, config.defaults.message));
      setText(config.node, 'awards', buildAwards(stats, config.defaults.awards));
    }

    function refresh(targetPage){
      const statCache = new Map();
      const readStats = slug => {
        if (!slug) return null;
        if (statCache.has(slug)) return statCache.get(slug);
        const value = safeGetStats(slug);
        statCache.set(slug, value);
        return value;
      };
      configs.forEach(config => {
        if (targetPage && config.pageId && targetPage !== config.pageId) return;
        refreshCard(config, readStats(config.pageId));
      });
    }

    function attachResetHandlers(){
      if (typeof Stats.resetPage !== 'function') return;
      configs.forEach(config => {
        const resetBtn = config.node.querySelector('[data-hero-reset]');
        if (!resetBtn) return;
        const targetPage = normalizePage(resetBtn.getAttribute('data-hero-reset')) || config.pageId;
        if (!targetPage){
          resetBtn.disabled = true;
          resetBtn.title = 'Reset unavailable';
          return;
        }
        const defaultLabel = resetBtn.getAttribute('data-reset-label') || (resetBtn.textContent || '').trim() || 'Reset stats';
        resetBtn.dataset.resetLabel = defaultLabel;
        const doneLabel = resetBtn.getAttribute('data-reset-done') || 'Stats reset';
        resetBtn.addEventListener('click', () => {
          const confirmMsg = resetBtn.getAttribute('data-reset-confirm') || 'Reset these stats on this device? This will not touch other pages.';
          if (!window.confirm(confirmMsg)) return;
          resetBtn.disabled = true;
          resetBtn.classList.add('is-busy');
          let succeeded = false;
          try{
            Stats.resetPage(targetPage);
            succeeded = true;
          }catch(err){
            console.error('Hero stats reset failed', err);
            alert('Unable to reset these stats right now. Please try again.');
          }
          if (succeeded){
            refresh(targetPage);
            resetBtn.textContent = doneLabel;
            setTimeout(() => {
              resetBtn.textContent = resetBtn.dataset.resetLabel || defaultLabel;
              resetBtn.disabled = false;
              resetBtn.classList.remove('is-busy');
            }, 2000);
            return;
          }
          resetBtn.disabled = false;
          resetBtn.classList.remove('is-busy');
        });
      });
    }

    attachResetHandlers();
    refresh();

    window.addEventListener('mpl:progress-update', evt => {
      const detailPage = normalizePage(evt?.detail?.pageId);
      if (!detailPage) return refresh();
      refresh(detailPage);
    });

    window.addEventListener('storage', evt => {
      if (evt && evt.key === 'mpl.stats.v1') refresh();
    });
  }

  function initThemeManager(){
    const editor = document.getElementById('themeEditor');
    if (!editor || !document?.documentElement) return;

    const statusEl = document.getElementById('themeStatus');
    const modeButtons = Array.from(editor.querySelectorAll('.theme-btn'));
    const colorInput = document.getElementById('themeColorInput');
    const swatchButtons = Array.from(editor.querySelectorAll('.theme-swatch'));
    const storageKey = 'mpl.theme.v1';

    const docEl = document.documentElement;
    const rootStyle = docEl.style;
    const computed = getComputedStyle(docEl);
    const paletteVars = ['--bg-start','--bg-mid','--bg-end','--surface','--ink','--ink-2','--border'];
    const defaultPalette = {};
    paletteVars.forEach(name=>{ defaultPalette[name] = (computed.getPropertyValue(name) || '').trim(); });
    const brandVars = ['--nb-background','--nb-surface','--nb-border','--nb-ink','--nb-text-muted'];
    const defaultBrandTokens = {};
    brandVars.forEach(name=>{ defaultBrandTokens[name] = (computed.getPropertyValue(name) || '').trim(); });
    const defaultColor = normalizeHex(defaultPalette['--bg-mid']) || '#203158';
    const WHITE_THEME_PALETTE = Object.freeze({
      '--bg-start':'#f7f7f8',
      '--bg-mid':'#f3efe9',
      '--bg-end':'#efe6dc',
      '--surface':'#ffffff',
      '--ink':'#0d0c22',
      '--ink-2':'#3d3a32',
      '--border':'rgba(15,23,42,.1)'
    });
    const DEFAULT_BRIGHT_MODE = true;

    let state = readState();
    let autoPending = false;

    function setThemeEditorBackground(color){
      if (!editor) return;
      const normalized = normalizeHex(color);
      if (!normalized){
        editor.style.removeProperty('--theme-editor-bg-start');
        editor.style.removeProperty('--theme-editor-bg-end');
        editor.style.removeProperty('--theme-editor-border');
        editor.removeAttribute('data-theme-state');
        return;
      }
      editor.setAttribute('data-theme-state','custom');
      editor.style.setProperty('--theme-editor-bg-start', adjustLightness(normalized, 0.45));
      editor.style.setProperty('--theme-editor-bg-end', adjustLightness(normalized, 0.12));
      editor.style.setProperty('--theme-editor-border', adjustLightness(normalized, -0.25));
    }

    function applyBrandTokens(palette = {}){
      const baseBackground = palette['--bg-mid'] || palette['--bg-start'] || defaultBrandTokens['--nb-background'];
      const surface = palette['--surface'] || defaultBrandTokens['--nb-surface'];
      const border = palette['--border'] || defaultBrandTokens['--nb-border'];
      const ink = palette['--ink'] || defaultBrandTokens['--nb-ink'];
      const muted = palette['--ink-2'] || defaultBrandTokens['--nb-text-muted'];
      if (baseBackground) rootStyle.setProperty('--nb-background', baseBackground);
      if (surface) rootStyle.setProperty('--nb-surface', surface);
      if (border) rootStyle.setProperty('--nb-border', border);
      if (ink) rootStyle.setProperty('--nb-ink', ink);
      if (muted) rootStyle.setProperty('--nb-text-muted', muted);
      setThemeEditorBackground(baseBackground);
      updateLogoMode();
    }

    function resetBrandTokens(){
      brandVars.forEach(name=>{
        const fallback = defaultBrandTokens[name];
        if (fallback){
          rootStyle.setProperty(name, fallback);
        } else {
          rootStyle.removeProperty(name);
        }
      });
      setThemeEditorBackground(null);
      updateLogoMode();
    }

    function setActiveSwatch(color){
      const normalized = normalizeHex(color);
      swatchButtons.forEach(btn=>{
        const btnColor = normalizeHex(btn.getAttribute('data-color'));
        const isMatch = normalized && btnColor === normalized;
        btn.classList.toggle('active', !!isMatch);
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });
    }

    syncFromState();
    if (!state.mode || state.mode === 'default'){
      setActiveMode('reset');
  setStatus('Default theme in use. Choose "Auto match" to personalise.', false);
      if (colorInput) colorInput.value = defaultColor;
    } else if (state.mode === 'auto'){
      triggerAuto(false);
    }

    modeButtons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const mode = (btn.getAttribute('data-mode') || '').toLowerCase();
        if (mode === 'auto'){
          triggerAuto(true);
          return;
        }
        if (mode === 'day' || mode === 'night'){
          applyTimeTheme(mode, { persist:true, announce:true });
          return;
        }
        if (mode === 'reset'){
          restoreDefault({ persist:true, announce:true });
        }
      });
    });

    colorInput?.addEventListener('input', event=>{
      const value = event?.target?.value;
      if (value) applyCustomColor(value, { persist:true, announce:true });
    });

    swatchButtons.forEach(btn=>{
      updateSwatchVisual(btn);
      btn.setAttribute('aria-pressed','false');
      btn.addEventListener('click', ()=>{
        const color = btn.getAttribute('data-color');
        if (colorInput){
          const normal = normalizeHex(color) || defaultColor;
          colorInput.value = normal;
        }
        applyCustomColor(color, { persist:true, announce:true });
      });
    });

    window.addEventListener('storage', evt=>{
      if (evt?.key !== storageKey) return;
      state = readState();
      syncFromState();
    });

    function triggerAuto(announceStart){
      if (autoPending) return;
      if (announceStart) setStatus('Detecting local weather…');
      setActiveMode('auto');
      autoPending = true;
      applyAutoTheme().catch(err=>{
        console.info('Theme auto detection issue', err);
        applyTimeFallback();
      }).finally(()=>{ autoPending = false; });
    }

    function syncFromState(){
      if (state.mode === 'custom' && state.customColor){
        applyCustomColor(state.customColor, { persist:false, announce:false });
        if (colorInput) colorInput.value = state.customColor;
        setActiveMode(null);
        setActiveSwatch(state.customColor);
        if (isWhiteColor(state.customColor)){
          setStatus('Bright theme in use.', false);
        } else {
          setStatus('Custom theme in use.', false);
        }
        return;
      }
      if (state.mode === 'day' || state.mode === 'night'){
        applyTimeTheme(state.mode, { persist:false, announce:false });
        setStatus(state.mode === 'day' ? 'Daylight theme active.' : 'Night theme active.', false);
        setActiveSwatch(null);
        return;
      }
      if (state.mode === 'auto'){
        setActiveMode('auto');
        const label = formatAutoStatus(state.autoMeta);
        if (label) setStatus(label, false);
        setActiveSwatch(null);
        return;
      }
      restoreDefault({ persist:false, announce:false });
      setActiveSwatch(null);
    }

    function applyPalette(palette){
      if (!palette) return;
      const bright = needsBrightMode(palette);
      setBrightMode(bright);
      paletteVars.forEach(name=>{
        const value = palette[name];
        if (typeof value === 'string' && value){
          rootStyle.setProperty(name, value);
        } else {
          rootStyle.removeProperty(name);
        }
      });
      applyBrandTokens(palette);
    }

    function resetPalette(){
      setBrightMode(DEFAULT_BRIGHT_MODE);
      paletteVars.forEach(name=>rootStyle.removeProperty(name));
      resetBrandTokens();
    }

    function applyCustomColor(hex, options = {}){
      const { persist = false, announce = false } = options;
      const colour = normalizeHex(hex);
      if (!colour) return;
      if (isWhiteColor(colour)){
        applyWhiteTheme({ persist, announce });
        return;
      }
      applyPalette(buildPalette(colour));
      setActiveSwatch(colour);
      updateState({ mode:'custom', customColor:colour, autoMeta:null }, persist);
      setActiveMode(null);
      if (announce) setStatus('Custom theme in use.');
    }

    function applyWhiteTheme(options = {}){
      const { persist = false, announce = false } = options;
      applyPalette(WHITE_THEME_PALETTE);
      updateState({ mode:'custom', customColor:'#ffffff', autoMeta:null }, persist);
      setActiveMode(null);
      setActiveSwatch('#ffffff');
      if (announce) setStatus('Bright theme in use.');
    }

    function restoreDefault(options = {}){
      const { persist = true, announce = true } = options;
      resetPalette();
      updateState({ mode:'default', customColor:null, autoMeta:null }, persist);
      setActiveMode('reset');
      if (colorInput) colorInput.value = defaultColor;
      setActiveSwatch(null);
      if (announce) setStatus('Default theme in use. Choose "Auto match" to personalise.');
    }

    function applyTimeTheme(mode, options = {}){
      const { persist = false, announce = false } = options;
      const base = mode === 'day' ? '#1d3c64' : '#0b1424';
      applyPalette(buildPalette(base));
      updateState({ mode, customColor:null, autoMeta:null }, persist);
      setActiveMode(mode);
      setActiveSwatch(null);
      if (announce) setStatus(mode === 'day' ? 'Daylight theme active.' : 'Night theme active.');
    }

    function applyTimeFallback(){
      const period = getLocalPeriod();
      const base = period === 'day' ? '#1d3c64' : '#0b1424';
      applyPalette(buildPalette(base));
      updateState({ mode:'auto', customColor:null, autoMeta:{ condition:'time-fallback', isDay: period === 'day', reason:'time', fetchedAt:Date.now() } }, true);
      setActiveMode('auto');
      setActiveSwatch(null);
      setStatus(`Auto theme (${period === 'day' ? 'daylight' : 'night'} fallback).`);
    }

    async function applyAutoTheme(){
      if (typeof fetch !== 'function') throw new Error('Fetch API unavailable');
      setStatus('Detecting local weather…');
      const location = await resolveLocation();
      const weather = await fetchWeather(location);
      const condition = mapWeatherCode(weather.code);
      const base = selectBaseForWeather(condition, weather.isDay);
      applyPalette(buildPalette(base));
      const meta = {
        condition,
        isDay: !!weather.isDay,
        temperature: typeof weather.temperature === 'number' ? weather.temperature : null,
        location: locationLabel(location),
        fetchedAt: Date.now()
      };
      updateState({ mode:'auto', customColor:null, autoMeta:meta }, true);
      setActiveMode('auto');
      setActiveSwatch(null);
      setStatus(formatWeatherLabel(condition, weather, location));
    }

    function updateState(patch, persist){
      state = Object.assign({}, state, patch);
      if (!persist) return;
      try{ localStorage.setItem(storageKey, JSON.stringify(state)); }catch{}
    }

    function updateLogoMode(){
      if (!docEl) return;
      try{
        const style = getComputedStyle(docEl);
        const fallback = normalizeHex(defaultBrandTokens['--nb-background']) || '#ffffff';
        const token = (style.getPropertyValue('--nb-background') || fallback).trim();
        const colour = normalizeHex(token) || fallback;
        const luminance = relativeLuminance(colour);
        const mode = luminance >= 0.58 ? 'light' : 'dark';
        docEl.setAttribute('data-nb-logo-mode', mode);
      }catch{
        docEl.setAttribute('data-nb-logo-mode', 'light');
      }
    }

    function setBrightMode(active){
      if (docEl) docEl.setAttribute('data-nb-contrast', active ? 'light' : 'dark');
      const body = document.body;
      if (!body) return;
      body.classList.toggle('theme-bright', !!active);
    }

    updateLogoMode();

    function readState(){
      try{
        const raw = localStorage.getItem(storageKey);
        if (!raw) return { mode:'default', customColor:null, autoMeta:null };
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return { mode:'default', customColor:null, autoMeta:null };
        return {
          mode: typeof parsed.mode === 'string' ? parsed.mode : 'default',
          customColor: typeof parsed.customColor === 'string' ? parsed.customColor : null,
          autoMeta: parsed.autoMeta && typeof parsed.autoMeta === 'object' ? parsed.autoMeta : null
        };
      }catch{
        return { mode:'default', customColor:null, autoMeta:null };
      }
    }

    function setActiveMode(mode){
      modeButtons.forEach(btn=>{
        const target = (btn.getAttribute('data-mode') || '').toLowerCase();
        btn.classList.toggle('active', !!mode && target === mode);
      });
    }

    function setStatus(message, allowEmpty = true){
      if (!statusEl) return;
      if (!message && !allowEmpty) return;
      statusEl.textContent = message || '';
    }

    function formatAutoStatus(meta){
      if (!meta) return '';
      const labelMap = {
        clear:'Clear skies',
        'partly-cloudy':'Scattered clouds',
        overcast:'Overcast',
        fog:'Foggy',
        rain:'Rainy',
        snow:'Snowy',
        storm:'Stormy',
        'time-fallback':'Time of day',
        unknown:'Local conditions'
      };
      const descriptor = labelMap[meta.condition] || 'Auto theme';
      const parts = [`Auto theme: ${descriptor}${meta.reason === 'time' ? '' : ` (${meta.isDay ? 'daytime' : 'night'})`}`];
      if (typeof meta.temperature === 'number') parts.push(`${Math.round(meta.temperature)}°C`);
      const place = meta.location?.city || meta.location?.region || meta.location?.country;
      if (place) parts.push(place);
      return parts.join(' · ');
    }

    function updateSwatchVisual(btn){
      if (!btn) return;
      const color = normalizeHex(btn.getAttribute('data-color'));
      if (!color) return;
      const palette = paletteFromColor(color);
      const gradient = palette
        ? `linear-gradient(145deg, ${palette['--bg-start']} 0%, ${palette['--bg-mid']} 50%, ${palette['--surface']} 100%)`
        : color;
      btn.style.setProperty('--swatch-color', gradient || color);
      const border = palette?.['--border'] || borderForColor(color);
      btn.style.setProperty('--swatch-border', border);
      const label = btn.getAttribute('data-label') || 'Custom colour';
      btn.setAttribute('aria-label', `Use ${label} theme (${color.toUpperCase()})`);
    }

    function borderForColor(color){
      if (isWhiteColor(color)) return 'rgba(15,23,42,.2)';
      const lum = relativeLuminance(color);
      return lum > 0.4 ? 'rgba(15,23,42,.25)' : 'rgba(255,255,255,.28)';
    }

    function paletteFromColor(color){
      const normalized = normalizeHex(color);
      if (!normalized) return null;
      if (normalized === '#ffffff') return WHITE_THEME_PALETTE;
      return buildPalette(normalized);
    }

    function normalizeHex(hex){
      if (!hex) return null;
      const match = String(hex).trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (!match) return null;
      let value = match[1];
      if (value.length === 3){ value = value.split('').map(ch=>ch+ch).join(''); }
      return '#' + value.toLowerCase();
    }

    function isWhiteColor(value){
      return normalizeHex(value) === '#ffffff';
    }

    function buildPalette(baseHex){
      const base = normalizeHex(baseHex) || defaultColor;
      const start = adjustLightness(base, -0.12);
      const mid = adjustLightness(base, -0.02);
      const end = adjustLightness(base, -0.22);
      const surface = adjustLightness(base, 0.12);
      const ink = chooseInk(base);
      return {
        '--bg-start': start,
        '--bg-mid': mid,
        '--bg-end': end,
        '--surface': surface,
        '--ink': ink,
        '--ink-2': ink === '#F4F8FF' ? '#E3E9FF' : '#1F2937',
        '--border': ink === '#F4F8FF' ? 'rgba(255,255,255,.18)' : 'rgba(15,23,42,.18)'
      };
    }

    function chooseInk(baseHex){
      const hsl = hexToHsl(baseHex);
      return hsl.l > 0.65 ? '#0F172A' : '#F4F8FF';
    }

    function needsBrightMode(palette){
      const surface = palette?.['--surface'];
      if (!surface) return false;
      return relativeLuminance(surface) >= 0.6;
    }

    function relativeLuminance(hex){
      const { r, g, b } = hexToRgb(hex);
      const toLinear = value => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
      };
      const rLin = toLinear(r);
      const gLin = toLinear(g);
      const bLin = toLinear(b);
      return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
    }

    function adjustLightness(hex, delta){
      const hsl = hexToHsl(hex);
      const next = { h:hsl.h, s:hsl.s, l:clamp(hsl.l + delta, 0, 1) };
      return hslToHex(next);
    }

    function clamp(value, min, max){
      return Math.min(Math.max(value, min), max);
    }

    function hexToHsl(hex){
      const { r, g, b } = hexToRgb(hex);
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;
      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;
      if (max !== min){
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
          case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)); break;
          case gNorm: h = ((bNorm - rNorm) / d + 2); break;
          default: h = ((rNorm - gNorm) / d + 4); break;
        }
        h /= 6;
      }
      return { h, s, l };
    }

    function hexToRgb(hex){
      const value = normalizeHex(hex) || '#000000';
      const intVal = parseInt(value.slice(1), 16);
      return {
        r:(intVal >> 16) & 255,
        g:(intVal >> 8) & 255,
        b:intVal & 255
      };
    }

    function hslToHex({ h, s, l }){
      return rgbToHex(...Object.values(hslToRgb(h, s, l)));
    }

    function hslToRgb(h, s, l){
      if (s === 0){
        const val = Math.round(l * 255);
        return { r:val, g:val, b:val };
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      return {
        r:Math.round(hueToRgb(p, q, h + 1/3) * 255),
        g:Math.round(hueToRgb(p, q, h) * 255),
        b:Math.round(hueToRgb(p, q, h - 1/3) * 255)
      };
    }

    function hueToRgb(p, q, t){
      let value = t;
      if (value < 0) value += 1;
      if (value > 1) value -= 1;
      if (value < 1/6) return p + (q - p) * 6 * value;
      if (value < 1/2) return q;
      if (value < 2/3) return p + (q - p) * (2/3 - value) * 6;
      return p;
    }

    function rgbToHex(r, g, b){
      return '#' + [r,g,b].map(val=>val.toString(16).padStart(2,'0')).join('');
    }

    function getLocalPeriod(){
      const hour = new Date().getHours();
      return hour >= 6 && hour < 18 ? 'day' : 'night';
    }

    async function resolveLocation(){
      try{
        if (!navigator.geolocation) throw new Error('Geolocation unavailable');
        const position = await new Promise((resolve, reject)=>{
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy:false, timeout:8000, maximumAge:300000 });
        });
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy || null,
          source:'geolocation'
        };
      }catch(err){
        return await ipFallback(err);
      }
    }

    async function ipFallback(originalError){
      if (typeof fetch !== 'function') throw originalError || new Error('Location unavailable');
      const response = await fetch('https://ipapi.co/json/', { headers:{ 'Accept':'application/json' } });
      if (!response.ok) throw new Error('IP geolocation failed');
      const data = await response.json();
      if (!data || typeof data.latitude !== 'number' || typeof data.longitude !== 'number') throw new Error('IP geolocation incomplete');
      return {
        latitude:data.latitude,
        longitude:data.longitude,
        city:data.city || null,
        region:data.region || data.region_code || null,
        country:data.country_name || data.country || null,
        source:'ip'
      };
    }

    async function fetchWeather(location){
      const params = new URLSearchParams({
        latitude:String(location.latitude),
        longitude:String(location.longitude),
        current:'temperature_2m,weather_code,is_day',
        timezone:'auto'
      });
      const url = 'https://api.open-meteo.com/v1/forecast?' + params.toString();
      const response = await fetch(url, { headers:{ 'Accept':'application/json' } });
      if (!response.ok) throw new Error('Weather request failed');
      const data = await response.json();
      const current = data?.current || data?.current_weather;
      if (!current) throw new Error('Weather data missing');
      return {
        code: typeof current.weather_code === 'number' ? current.weather_code : (typeof current.weathercode === 'number' ? current.weathercode : null),
        temperature: typeof current.temperature_2m === 'number' ? current.temperature_2m : (typeof current.temperature === 'number' ? current.temperature : null),
        isDay: current.is_day === 1 || current.is_day === true || current.isDay === 1,
        raw: current
      };
    }

    function mapWeatherCode(code){
      if (code === null || code === undefined) return 'unknown';
      if (code === 0) return 'clear';
      if (code === 1 || code === 2) return 'partly-cloudy';
      if (code === 3) return 'overcast';
      if (code === 45 || code === 48) return 'fog';
      if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
      if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow';
      if (code >= 95) return 'storm';
      return 'unknown';
    }

    function selectBaseForWeather(condition, isDay){
      switch(condition){
        case 'clear': return isDay ? '#1c4070' : '#0b1428';
        case 'partly-cloudy': return isDay ? '#1f365c' : '#101b32';
        case 'overcast':
        case 'fog': return isDay ? '#23303f' : '#101c28';
        case 'rain': return isDay ? '#123a4d' : '#0b1f2b';
        case 'snow': return isDay ? '#4a6078' : '#25374a';
        case 'storm': return isDay ? '#2b2246' : '#1a1534';
        default: return isDay ? '#1d3557' : '#0f172a';
      }
    }

    function locationLabel(location){
      if (!location) return null;
      return {
        city: location.city || null,
        region: location.region || null,
        country: location.country || null,
        source: location.source || null
      };
    }

    function formatWeatherLabel(condition, weather, location){
      const labelMap = {
        clear:'Clear skies',
        'partly-cloudy':'Soft clouds',
        overcast:'Overcast',
        fog:'Foggy',
        rain:'Rainy',
        snow:'Snowy',
        storm:'Stormy',
        'time-fallback':'Time of day',
        unknown:'Local conditions'
      };
      const descriptor = labelMap[condition] || 'Auto theme';
      const parts = [`Auto theme: ${descriptor} (${weather.isDay ? 'daytime' : 'night'})`];
      if (typeof weather.temperature === 'number') parts.push(`${Math.round(weather.temperature)}°C`);
      const place = location.city || location.region || location.country;
      if (place && location.source === 'ip') parts.push(place);
      return parts.join(' · ');
    }
  }

  const root = window.__MSHARE__ = window.__MSHARE__ || {};
  if (!root.Stats || typeof root.Stats.addSession !== 'function' || typeof root.Stats.resetPage !== 'function'){
    root.Stats = createStatsModule();
  }
  const Stats = root.Stats;
  const TZ = Stats?.timezone || 'Europe/London';
  const PAGE_ID = typeof root.pageId === 'string' && root.pageId ? root.pageId : resolvePageId();
  root.pageId = PAGE_ID;

  initThemeManager();

  function injectAiBlogLinks(){
    const blogHref = 'blog.html';
    const headerNav = document.querySelector('.main-nav');
    if (headerNav && !headerNav.querySelector('[data-nav="ai-blog"]')){
      const group = document.createElement('div');
      group.className = 'menu-group menu-direct';
      const link = document.createElement('a');
      link.className = 'menu-direct-link';
      link.href = blogHref;
      link.setAttribute('data-href', blogHref);
      link.setAttribute('data-nav','ai-blog');
      link.setAttribute('aria-label','AI Blog and Q&A hub');
      link.textContent = 'AI Blog & Q&A';
      group.appendChild(link);
      headerNav.appendChild(group);
    }

    const footerNav = document.querySelector('.ft-nav');
    if (footerNav && !footerNav.querySelector('[data-ft-link="ai-blog"]')){
      const details = document.createElement('details');
      details.className = 'ft-group';
      const summary = document.createElement('summary');
      summary.append('AI Hub ');
      const caret = document.createElement('span');
      caret.setAttribute('aria-hidden','true');
      caret.textContent = '▾';
      summary.appendChild(caret);
      const links = document.createElement('div');
      links.className = 'links';
      const paragraph = document.createElement('p');
      const link = document.createElement('a');
      link.href = blogHref;
      link.setAttribute('data-href', blogHref);
      link.setAttribute('data-ft-link','ai-blog');
      link.textContent = 'AI Blog & Q&A hub';
      paragraph.appendChild(link);
      links.appendChild(paragraph);
      details.appendChild(summary);
      details.appendChild(links);
      footerNav.appendChild(details);
    }
  }

  injectAiBlogLinks();

  function normalizeInteractiveLinks(){
    const nodes = document.querySelectorAll('[data-href]');
    nodes.forEach(node=>{
      const rawTarget = node.getAttribute('data-href');
      const target = rawTarget ? rawTarget.trim() : '';
      if (!target) return;
      const tag = node.tagName.toLowerCase();
      if (tag === 'a'){
        if (!node.hasAttribute('href') || node.getAttribute('href') !== target){
          node.setAttribute('href', target);
        }
        return;
      }
      if (node.dataset.nbHrefWired === '1') return;
      node.dataset.nbHrefWired = '1';
      const isButton = tag === 'button' || tag === 'input';
      if (!isButton){
        if (!node.hasAttribute('role')) node.setAttribute('role','link');
        if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex','0');
      }
      const targetAttr = node.getAttribute('data-target') || node.getAttribute('target') || '_self';
      function openTarget(evt){
        const wantsNewTab = targetAttr === '_blank' || evt?.metaKey || evt?.ctrlKey;
        if (wantsNewTab){
          const ref = window.open(target, '_blank', 'noopener');
          if (ref) try{ ref.focus(); }catch{}
          return;
        }
        window.location.assign(target);
      }
      node.addEventListener('click', evt=>{
        if (evt.defaultPrevented) return;
        if (evt.button && evt.button !== 0) return;
        evt.preventDefault();
        openTarget(evt);
      });
      node.addEventListener('keydown', evt=>{
        if (evt.defaultPrevented) return;
        if (evt.key === 'Enter' || (!isButton && evt.key === ' ')){
          evt.preventDefault();
          openTarget(evt);
        }
      });
    });
  }

  function enforceSkipLinkPlacement(){
    const docEl = document.documentElement;
    const header = document.querySelector('header.site-header') || document.querySelector('header');
    if (!header) return;
    let main = document.getElementById('main') || document.querySelector('main');
    if (main && !main.id) main.id = 'main';
    const skipLinks = Array.from(document.querySelectorAll('a.skip-link'));
    let skip = skipLinks.find(link => link.getAttribute('href') === '#main');
    if (!skip){
      skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#main';
      skip.textContent = 'Skip to content';
    }
    skipLinks.forEach(link=>{
      if (link !== skip) link.remove();
    });
    if (header.nextElementSibling !== skip){
      skip.remove();
      header.insertAdjacentElement('afterend', skip);
    }
    skip.dataset.nbSkipReady = '1';
    if (docEl) docEl.setAttribute('data-nb-skiplink','ready');
  }

  function initPageSeeder(){
    const docEl = document.documentElement;
    if (docEl?.dataset.nbSeeded === '1') return;
    const anchors = Array.from(document.querySelectorAll('a[href], [data-href]'));
    const pages = new Set();
    const missing = [];

    const isLocalLink = url => {
      if (!url) return false;
      if (/^(https?:)?\/\//i.test(url)) return false;
      if (/^(mailto:|tel:|javascript:|data:)/i.test(url)) return false;
      if (url.trim().startsWith('#')) return false;
      return url.split('#')[0].split('?')[0].toLowerCase().endsWith('.html');
    };
    const canonicalise = url => {
      try{
        const abs = new URL(url, window.location.href);
        if (abs.origin !== window.location.origin) return null;
        const path = abs.pathname.startsWith('/') ? abs.pathname.slice(1) : abs.pathname;
        return path || 'index.html';
      }catch{
        return url.replace(/^\.\//,'').replace(/^\//,'');
      }
    };
    anchors.forEach(el => {
      const href = el.getAttribute('data-href') || el.getAttribute('href');
      if (!isLocalLink(href)) return;
      const cleaned = href.replace(/[?#].*$/,'');
      const canonical = canonicalise(cleaned);
      if (!canonical) return;
      pages.add(canonical);
    });

    const links = Array.from(pages.values()).sort();
    root.pageSeeds = { links, missing: [] };
    if (docEl) docEl.dataset.nbSeeded = '1';

    if (!window.fetch || !links.length) return;
    if (window.location.protocol === 'file:') return;
    const sessionKey = 'nb.page.seeded';
    try{
      if (window.sessionStorage && sessionStorage.getItem(sessionKey) === '1') return;
      if (window.sessionStorage) sessionStorage.setItem(sessionKey,'1');
    }catch{}

    const currentPath = window.location.pathname.replace(/^\//,'') || 'index.html';
    links.forEach(path => {
      if (path === currentPath) return;
      let requestUrl = '/' + path.replace(/^\/+/,'');
      try{
        requestUrl = new URL(path, window.location.origin + '/').href;
      }catch{}
      fetch(requestUrl, { method:'HEAD', cache:'no-store' }).then(resp=>{
        if (resp && resp.ok) return;
        missing.push(path);
        root.pageSeeds.missing = Array.from(new Set(missing));
        console.warn('[NeuroBreath] Missing local page detected:', path);
      }).catch(()=>{
        missing.push(path);
        root.pageSeeds.missing = Array.from(new Set(missing));
        console.warn('[NeuroBreath] Missing local page detected:', path);
      });
    });
  }

  root.nbNormalizeLinks = normalizeInteractiveLinks;
  root.nbEnsureSkipLink = enforceSkipLinkPlacement;
  root.nbInitPageSeeder = initPageSeeder;

  normalizeInteractiveLinks();
  enforceSkipLinkPlacement();
  initPageSeeder();

  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('navToggle');
  const menuGroups = Array.from(document.querySelectorAll('.menu-group'));
  const menuToggles = menuGroups
    .map(group => group.querySelector('.menu-toggle'))
    .filter(Boolean);

  if (nav && !nav.hasAttribute('aria-expanded')){
    nav.setAttribute('aria-expanded','false');
  }

  function closeNav(){
    if (!nav) return;
    nav.classList.remove('open');
    nav.setAttribute('aria-expanded','false');
    if (btn) btn.setAttribute('aria-expanded','false');
    menuGroups.forEach(group=>group.classList.remove('open'));
    menuToggles.forEach(toggle=>toggle.setAttribute('aria-expanded','false'));
  }

  if (btn && !btn.dataset.navWired) {
    btn.dataset.navWired = '1';
    btn.addEventListener('click', ()=>{
      if (!nav) return;
      if (nav.classList.contains('open')){
        closeNav();
        return;
      }
      menuGroups.forEach(group=>group.classList.remove('open'));
      menuToggles.forEach(toggle=>toggle.setAttribute('aria-expanded','false'));
      nav.classList.add('open');
      nav.setAttribute('aria-expanded','true');
      btn.setAttribute('aria-expanded','true');
    });
  }

  menuToggles.forEach(t=>{
    if (t.dataset.navSubWired === '1') return;
    t.dataset.navSubWired = '1';
    t.addEventListener('click', ()=>{
      const group = t.closest('.menu-group');
      if (!group) return;
      const willOpen = !group.classList.contains('open');
      menuGroups.forEach(x=>x.classList.remove('open'));
      menuToggles.forEach(toggle=>toggle.setAttribute('aria-expanded','false'));
      if (willOpen){
        group.classList.add('open');
        t.setAttribute('aria-expanded','true');
      }
    });
  });

  if (nav && !nav.dataset.nbNavLinks){
    nav.dataset.nbNavLinks = '1';
    const candidates = nav.querySelectorAll('a[href], [data-href]');
    candidates.forEach(link=>{
      if (link.dataset.nbNavClose === '1') return;
      link.dataset.nbNavClose = '1';
      link.addEventListener('click', ()=>{
        if (!btn) return;
        if (window.matchMedia('(max-width: 960px)').matches){
          closeNav();
        }
      });
    });
  }

  if (document.body && !document.body.dataset.nbNavEscape){
    document.body.dataset.nbNavEscape = '1';
    document.addEventListener('keyup', evt=>{
      if (evt.key === 'Escape' && nav?.classList.contains('open')){
        closeNav();
      }
    });
  }

  const sheet    = document.getElementById('shareSheet');
  const openBtn  = document.getElementById('shareOpen');
  const closeBtn = document.getElementById('shareClose');
  const backdrop = document.getElementById('shareBackdrop');
  const text     = document.getElementById('shareText');
  const copyBtn  = document.getElementById('copyShare');
  const nativeBtn= document.getElementById('shareNative');
  const shareOpeners = Array.from(document.querySelectorAll('[data-share-open]'));

  function openSheet(){
    if (!sheet) return;
    sheet.classList.remove('hidden');
    sheet.setAttribute('aria-hidden','false');
    if (text) text.value = location.href + "\nMeasured Breathing tools that work offline.";
  }
  function closeSheet(){
    if (!sheet) return;
    sheet.classList.add('hidden');
    sheet.setAttribute('aria-hidden','true');
  }

  shareOpeners.forEach(trigger => {
    if (!trigger || trigger.dataset.nbShareOpen === '1') return;
    trigger.dataset.nbShareOpen = '1';
    trigger.addEventListener('click', event => {
      if (event) event.preventDefault();
      openSheet();
    });
  });
  closeBtn?.addEventListener('click', closeSheet);
  backdrop?.addEventListener('click', closeSheet);
  copyBtn?.addEventListener('click', async()=>{
    if (!text) return;
    try{
      await navigator.clipboard.writeText(text.value);
      copyBtn.textContent = '✅ Copied';
      setTimeout(()=>copyBtn.textContent = '📋 Copy text', 1200);
    }catch{
      alert('Copy failed');
    }
  });
  nativeBtn?.addEventListener('click', async()=>{
    if (!text) return;
    try{
      if (navigator.share){
        await navigator.share({ title:document.title, text:text.value, url:location.href });
      } else {
        open(location.href,'_blank');
      }
    }catch{}
  });

  const quickScriptBtn = document.getElementById('copyShareScript');
  function buildQuickShareScript(){
    const origin = (typeof location !== 'undefined' && location.href) ? location.href : 'https://www.mindpaylink.com/';
    const title = (typeof document !== 'undefined' && document.title) ? document.title : 'Neurobreath Support';
    const intro = 'Guided breathing with timers, printable packs, and QR handouts. Works on phones, tablets, and laptops.';
    return `Quick Neurobreath support:\n${title}\n${origin}\n\n${intro}\nFree to use and share.`;
  }

  quickScriptBtn?.addEventListener('click', async()=>{
    const defaultLabel = quickScriptBtn.dataset.defaultLabel || (quickScriptBtn.textContent || '').trim() || 'Copy quick script';
    const script = buildQuickShareScript();
    let copied = false;
    if (navigator?.clipboard?.writeText){
      try{
        await navigator.clipboard.writeText(script);
        copied = true;
      }catch{}
    }

    if (copied){
      quickScriptBtn.disabled = true;
      quickScriptBtn.textContent = '✅ Script copied';
      setTimeout(()=>{
        quickScriptBtn.disabled = false;
        quickScriptBtn.textContent = defaultLabel;
      }, 1800);
      return;
    }

    try{
      const fallback = window.prompt('Copy this script and share it:', script);
      if (fallback !== null){
        quickScriptBtn.textContent = 'Script ready to paste';
        setTimeout(()=>{
          quickScriptBtn.textContent = defaultLabel;
        }, 2400);
      }
    }catch{
      alert(script);
    }
  });

  initProgressCard({ Stats, timezone: TZ, pageId: PAGE_ID });
  initManualProgressButtons(Stats);
  initHeroActivityCards({ Stats, pageId: PAGE_ID });

  const NB_LAYOUT_ATTR = 'data-nb-layout';
  const HERO_MIN_LENGTH = 220;
  const HERO_GRADIENT_CLASSES = ['hero-gradient--1','hero-gradient--2','hero-gradient--3','hero-gradient--4','hero-gradient--5','hero-gradient--6'];

  function shouldSkipCard(card){
    return !!card && (card.hasAttribute('data-nb-keep') || card.getAttribute(NB_LAYOUT_ATTR) === 'solo');
  }

  function getCardLength(node){
    if (!node) return 0;
    return (node.textContent || '').replace(/\s+/g,' ').trim().length;
  }

  function hasHeading(card){
    if (!card || shouldSkipCard(card)) return false;
    return !!card.querySelector('h1, h2, h3');
  }

    function pickHeroGradient(){
      const key = (location?.pathname || '/') + '|' + (document?.title || '');
      let hash = 0;
      for (let i = 0; i < key.length; i++){
        hash = ((hash << 5) - hash) + key.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % HERO_GRADIENT_CLASSES.length;
      return HERO_GRADIENT_CLASSES[index];
    }

    function cleanupContainer(node){
      if (!node || node.matches('main, body') || node.hasAttribute('data-nb-keep')) return;
      if (node.children && node.children.length === 0){
        const parent = node.parentElement;
        node.remove();
        cleanupContainer(parent);
      }
    }

    function mergeHeroContent(heroCard, minChars){
      if (!heroCard) return;
      let length = getCardLength(heroCard);
      let merges = 0;
      let sibling = heroCard.nextElementSibling;
      while (length < minChars && merges < 2 && sibling){
        if (sibling.matches('.card')){
          if (shouldSkipCard(sibling)){
            sibling = sibling.nextElementSibling;
            continue;
          }
          const donor = sibling;
          sibling = sibling.nextElementSibling;
          const fragment = document.createDocumentFragment();
          while (donor.firstChild){ fragment.appendChild(donor.firstChild); }
          heroCard.appendChild(fragment);
          const donorParent = donor.parentElement;
          donor.remove();
          cleanupContainer(donorParent);
          merges += 1;
          length = getCardLength(heroCard);
          continue;
        }
        break;
      }
    }

    function applySpan(container, suppliedCards){
      if (!container) return;
      const cards = suppliedCards && suppliedCards.length ? suppliedCards : Array.from(container.querySelectorAll(':scope > .card'));
      cards.forEach(card => card.classList.remove('span-2'));
      if (cards.length >= 3 && cards.length % 2 === 1){
        cards[cards.length - 1].classList.add('span-2');
      }
    }

    function normalizeExistingGrids(main, heroCard, processed){
      const grids = Array.from(main.querySelectorAll('.grid')).filter(grid =>
        !grid.closest('.hero') &&
        !grid.closest('.sheet') &&
        !grid.closest('#shareSheet') &&
        !grid.closest('footer') &&
        grid.closest('main') === main
      );
      grids.forEach(grid => {
        const cards = Array.from(grid.querySelectorAll(':scope > .card')).filter(card => card !== heroCard && hasHeading(card));
        if (!cards.length) return;
        if (!grid.classList.contains('cards-auto')) grid.classList.add('cards-auto');
        ['cols-1','cols-2','cols-3','cols-4','cols-5'].forEach(cls => grid.classList.remove(cls));
        grid.setAttribute(NB_LAYOUT_ATTR,'grid');
        cards.forEach(card => processed.add(card));
        applySpan(grid, cards);
      });
    }

    function collectGroup(startCard, parent, heroCard, processed){
      const group = [];
      let node = startCard;
      while (node && node.parentElement === parent){
        if (node.nodeType !== 1){ node = node.nextSibling; continue; }
        if (!node.matches('.card')) break;
    if (node === heroCard || processed.has(node) || shouldSkipCard(node) || !hasHeading(node) || node.closest('.sheet') || node.closest('#shareSheet')) break;
        group.push(node);
        node = node.nextElementSibling;
      }
      return group;
    }

    function wrapLooseCards(main, heroCard, processed){
      const looseCards = Array.from(main.querySelectorAll('.card')).filter(card =>
        card !== heroCard &&
        !card.closest('.hero') &&
        !card.closest('.sheet') &&
        !card.closest('#shareSheet') &&
        !card.closest('footer') &&
        !card.closest('.grid') &&
        card.closest('main') === main &&
        !shouldSkipCard(card)
      );
      looseCards.forEach(card => {
        if (processed.has(card)) return;
        if (!hasHeading(card)){ processed.add(card); return; }
        const parent = card.parentElement;
        if (!parent){ processed.add(card); return; }
        const group = collectGroup(card, parent, heroCard, processed);
        if (!group.length){ processed.add(card); return; }
        if (group.length === 1){ processed.add(group[0]); return; }
        const wrapper = document.createElement('div');
        wrapper.className = 'grid cards-auto';
        wrapper.setAttribute(NB_LAYOUT_ATTR,'cards');
        parent.insertBefore(wrapper, group[0]);
        group.forEach(item => { processed.add(item); wrapper.appendChild(item); });
        applySpan(wrapper, group);
        cleanupContainer(parent);
      });
    }

    function findPrimaryCard(main){
      const cards = Array.from(main.querySelectorAll('.card'));
      for (const card of cards){
        if (shouldSkipCard(card)) continue;
        if (card.closest('.sheet') || card.closest('#shareSheet') || card.closest('footer') || card.closest('.site-footer')) continue;
        if (card.closest('main') !== main) continue;
        return card;
      }
      return null;
    }

    function buildHero(main){
      const heroCard = findPrimaryCard(main);
      if (!heroCard) return null;
      if (!heroCard.dataset.nbHero){
        heroCard.dataset.nbHero = '1';
        HERO_GRADIENT_CLASSES.forEach(cls => heroCard.classList.remove(cls));
        heroCard.classList.add('hero');
        heroCard.classList.add(pickHeroGradient());
      }
      const currentParent = heroCard.parentElement;
      if (currentParent !== main){
        main.insertBefore(heroCard, main.firstElementChild);
        cleanupContainer(currentParent);
      } else if (heroCard !== main.firstElementChild){
        main.insertBefore(heroCard, main.firstElementChild);
      }
      mergeHeroContent(heroCard, HERO_MIN_LENGTH);
      return heroCard;
    }

    function initAutoLayout(){
      const main = document.querySelector('main#main') || document.querySelector('main');
      if (!main || main.getAttribute(NB_LAYOUT_ATTR) === 'applied') return;
      main.setAttribute(NB_LAYOUT_ATTR,'applied');
      const processed = new Set();
      const heroCard = buildHero(main);
      if (heroCard) processed.add(heroCard);
      normalizeExistingGrids(main, heroCard, processed);
      wrapLooseCards(main, heroCard, processed);
    }

    function initGuideExcerpts(root = document){
      const excerpts = root.querySelectorAll('.guide-excerpt');
      let autoId = 0;
      excerpts.forEach((excerpt)=>{
        if (!excerpt || excerpt.dataset.nbExcerptInit === '1') return;
        const body = excerpt.querySelector('.guide-excerpt__body');
        const toggle = excerpt.querySelector('.guide-excerpt__toggle');
        if (!body || !toggle) return;

        excerpt.dataset.nbExcerptInit = '1';
        const requestedLines = Number(excerpt.dataset.lines);
        if (Number.isFinite(requestedLines) && requestedLines > 0){
          excerpt.style.setProperty('--excerpt-lines', requestedLines);
        }

        const expandLabel = toggle.dataset.expandLabel || 'Show more';
        const collapseLabel = toggle.dataset.collapseLabel || 'Show less';
        if (!body.id){
          const uid = `guideExcerptSite_${Date.now()}_${autoId++}`;
          body.id = uid;
        }
        toggle.setAttribute('aria-controls', body.id);

        function render(){
          const expanded = excerpt.dataset.expanded === 'true';
          toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
          toggle.textContent = expanded ? collapseLabel : expandLabel;
        }

        if (excerpt.dataset.expanded !== 'true'){ excerpt.dataset.expanded = 'false'; }
        toggle.addEventListener('click', ()=>{
          const expanded = excerpt.dataset.expanded === 'true';
          excerpt.dataset.expanded = expanded ? 'false' : 'true';
          render();
        });

        render();
      });
    }

    const GLOBAL_SECTION_BGS = [
      'section-bg-white',
      'section-bg-sky-lavender',
      'section-bg-coral-sky',
      'section-bg-earth-sage',
      'section-bg-sage-coral',
      'section-bg-lavender-coral',
      'section-bg-sky-earth',
      'section-bg-cream',
      'section-bg-sage-light',
      'section-bg-lavender-gradient'
    ];

    function hasExplicitSectionBg(el){
      if (!el || !el.classList) return false;
      for (const cls of el.classList){
        if (cls && cls.startsWith('section-bg-')) return true;
      }
      return false;
    }

    function shouldSkipGlobalSectionBlock(el){
      if (!el || el.nodeType !== 1) return true;
      const tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK') return true;
      if (el.id === 'root') return true;
      if (el.classList && (el.classList.contains('site-footer') || el.classList.contains('site-header'))) return true;
      return false;
    }

    function initGlobalSectionBackgrounds(){
      const body = document.body;
      if (!body) return;
      const pageId = body.dataset.pageId || '';
      if (pageId === 'index') return;
      if (body.dataset.noGlobalBg === 'true' || body.dataset.noGlobalBg === '1') return;

      const main = document.querySelector('main#main-content') || document.querySelector('main#main') || document.querySelector('main.page-main') || document.querySelector('main');
      if (!main) return;
      if (main.querySelector('.content-section') || main.querySelector('.section-divider') || main.querySelector('.section-divider--thick')) return;

      // Prefer the common layout: <main><div class="page-container"> ...blocks... </div></main>
      const directContainer = main.firstElementChild && main.firstElementChild.classList && main.firstElementChild.classList.contains('page-container')
        ? main.firstElementChild
        : null;

      // 1) If we have a direct .page-container, split its direct children into full-width content sections.
      if (directContainer){
        const blocks = Array.from(directContainer.children).filter(el => !shouldSkipGlobalSectionBlock(el));
        if (!blocks.length) return;

        const fragment = document.createDocumentFragment();
        const innerClassName = directContainer.className || 'page-container';

        blocks.forEach((block, index)=>{
          const section = document.createElement('section');
          section.className = 'content-section ' + GLOBAL_SECTION_BGS[index % GLOBAL_SECTION_BGS.length];

          const inner = document.createElement('div');
          inner.className = innerClassName;
          inner.appendChild(block);
          section.appendChild(inner);
          fragment.appendChild(section);

          if (index < blocks.length - 1){
            const divider = document.createElement('hr');
            divider.className = 'section-divider';
            divider.setAttribute('aria-hidden','true');
            fragment.appendChild(divider);
          }
        });

        main.replaceChild(fragment, directContainer);
        body.classList.add('nb-global-bg');
        body.dataset.noAutoLayout = '1';
        return;
      }

      // 2) Fallback: if the page already uses direct <section> blocks in main, style them like index sections.
      const directSections = Array.from(main.children).filter(el => el && el.tagName === 'SECTION' && !shouldSkipGlobalSectionBlock(el));
      if (!directSections.length) return;

      directSections.forEach((sec, index)=>{
        sec.classList.add('content-section');
        if (!hasExplicitSectionBg(sec)){
          sec.classList.add(GLOBAL_SECTION_BGS[index % GLOBAL_SECTION_BGS.length]);
        }
        if (index > 0){
          const divider = document.createElement('hr');
          divider.className = 'section-divider';
          divider.setAttribute('aria-hidden','true');
          main.insertBefore(divider, sec);
        }
      });

      body.classList.add('nb-global-bg');
      body.dataset.noAutoLayout = '1';
    }

    function initPageChrome(){
      initGlobalSectionBackgrounds();
      const disableAutoLayout = document?.body?.dataset?.noAutoLayout === 'true' || document?.body?.dataset?.noAutoLayout === '1';
      if (!disableAutoLayout){
        initAutoLayout();
      }
      initGuideExcerpts();
    }

    if (document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', initPageChrome);
    } else {
      initPageChrome();
    }

    function downloadContactCard(){
      const vcf = `BEGIN:VCARD
  VERSION:3.0
  N:Koroma;Alkhadi;;;
  FN:Alkhadi M Koroma
  ORG:NeuroBreath
  EMAIL;type=INTERNET:info@mindpaylink.com
  URL:https://www.mindpaylink.com/
  END:VCARD`;
      const blob = new Blob([vcf],{ type:'text/vcard' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'NeuroBreath-Contact.vcf';
      link.click();
      URL.revokeObjectURL(url);
    }

    function bindVcfDownload(buttonId){
      const trigger = document.getElementById(buttonId);
      if (!trigger) return;
      trigger.addEventListener('click', event=>{
        event.preventDefault();
        downloadContactCard();
      });
    }

    bindVcfDownload('vp-home-vcf-proxy');
    bindVcfDownload('vp-coach-vcf');
    bindVcfDownload('shareContactVcf');

  const currentYearText = String(new Date().getFullYear());
  document.querySelectorAll('#yearFooter').forEach(span=>{ span.textContent = currentYearText; });

  function bindBackToTop(trigger){
    if (!trigger) return;
    trigger.addEventListener('click', event=>{
      event.preventDefault();
      try{
        (document.getElementById('top') || document.body).scrollIntoView({ behavior:'smooth', block:'start' });
      }catch{
        window.scrollTo({ top:0, behavior:'smooth' });
      }
    });
  }

  bindBackToTop(document.getElementById('backToTop'));
  document.querySelectorAll('[data-action="back-to-top"]').forEach(btn=>bindBackToTop(btn));

  function initQuickBreathingEngine(){
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;
    const STORAGE_KEY = 'nb.quick-breathing.pref';
    const TECH_MAP = {
      'sos-60':{ path:'sos-60.html', defaultSeconds:60 },
      'box':{ path:'box-breathing.html', defaultSeconds:180 },
      '4-7-8':{ path:'4-7-8-breathing.html', defaultSeconds:240 },
      'coherent-5-5':{ path:'coherent-5-5.html', defaultSeconds:300 }
    };

    function sanitizeTechnique(raw){
      const value = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
      if (TECH_MAP[value]) return value;
      const alt = value.replace(/[^a-z0-9\-]/g,'');
      return TECH_MAP[alt] ? alt : 'sos-60';
    }

    function computeMinutes(seconds, fallback){
      const secs = Number(seconds);
      if (Number.isFinite(secs) && secs > 0){
        return Math.max(1, Math.round(secs / 60));
      }
      return Math.max(1, fallback);
    }

    function normalize(detail){
      const technique = sanitizeTechnique(detail?.technique);
      const spec = TECH_MAP[technique] || TECH_MAP['sos-60'];
      const fallbackMinutes = Math.max(1, Math.round((spec.defaultSeconds || 60) / 60));
      const minutes = computeMinutes(detail?.durationSeconds, fallbackMinutes);
      return {
        technique,
        minutes,
        durationSeconds: minutes * 60,
        source: typeof detail?.source === 'string' && detail.source.trim() ? detail.source.trim() : 'quick-session',
        openInSameTab: detail?.openInSameTab === true
      };
    }

    function buildUrl(normalized){
      const spec = TECH_MAP[normalized.technique] || TECH_MAP['sos-60'];
      const targetPath = spec.path || TECH_MAP['sos-60'].path;
      const url = new URL(targetPath, window.location.href);
      url.searchParams.set('minutes', String(normalized.minutes));
      return url.toString();
    }

    function persist(selection){
      try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          technique: selection.technique,
          minutes: selection.minutes,
          timestamp: Date.now()
        }));
      }catch{}
    }

    function dispatchTelemetry(payload, url){
      try{
        window.dispatchEvent(new CustomEvent('nb:quickBreathing:launch',{
          detail:Object.assign({}, payload, { url })
        }));
      }catch{}
    }

    function start(detail){
      const normalized = normalize(detail || {});
      const url = buildUrl(normalized);
      persist(normalized);
      let opened = null;
      try{
        opened = window.open(url, normalized.openInSameTab ? '_self' : '_blank', normalized.openInSameTab ? undefined : 'noopener,noreferrer');
      }catch{}
      if (!opened){
        try{
          if (normalized.openInSameTab){
            window.location.assign(url);
          } else {
            window.location.href = url;
          }
        }catch{}
      }
      dispatchTelemetry(normalized, url);
      return url;
    }

    function readLastSelection(){
      try{
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (!saved) return null;
        if (!TECH_MAP[saved.technique]) return null;
        return saved;
      }catch{
        return null;
      }
    }

    document.addEventListener('nb:startQuickBreathing', event => {
      start(event?.detail || {});
    });

    return { start, getLastSelection:readLastSelection };
  }

  if (typeof window !== 'undefined'){
    window.nbBreathingEngine = window.nbBreathingEngine || initQuickBreathingEngine();
  }

  window.MSHARE_VA_OPTS = {
    openOnInit:false,
    startMinimised:true,
    ttsEngine:'speechSynthesis',
    preferUserVoices:['Daniel','en-GB','English (United Kingdom)'],
    stripNonAlphabetic:true,
    rememberSettings:true,
  bindSelectors:'[data-va-bind]',
  speakOnPageIntroSelector:'#vp-home-hero .muted.intro',
    ariaLabels:{hide:'Hide Voice Assistant',show:'Show Voice Assistant',start:'Start speaking',pause:'Pause speaking',resume:'Resume speaking',stop:'Stop speaking',repeat:'Repeat last speech'}
  };
})();
