export type AnalyticsEventName =
  | 'home_primary_cta_click'
  | 'home_secondary_cta_click'
  | 'home_audience_select'
  | 'nav_to_conditions'
  | 'nav_to_tools'
  | 'nav_to_guides'
  | 'nav_to_trust'
  | 'tool_try_now_click'
  | 'journey_start_click';

export interface AnalyticsEventPayload {
  href?: string;
  audience?: string;
  source?: string;
  label?: string;
}

declare global {
  interface Window {
    __nbAnalyticsDump?: () => void;
    __nbAnalyticsReset?: () => void;
    __nbAnalyticsLastEvent?: { name: string; payload: AnalyticsEventPayload; at: string };
  }
}

interface AnalyticsStore {
  version: 1;
  updatedAt: string;
  totals: Record<string, number>;
  byPath: Record<string, Record<string, number>>;
}

const STORAGE_KEY = 'nb:analytics:v1';

const nowIso = () => new Date().toISOString();

const safeParse = (raw: string | null): AnalyticsStore | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AnalyticsStore;
  } catch {
    return null;
  }
};

const getPathname = () => {
  if (typeof window === 'undefined') return 'server';
  return window.location?.pathname || '/';
};

const loadStore = (): AnalyticsStore => {
  if (typeof window === 'undefined') {
    return { version: 1, updatedAt: nowIso(), totals: {}, byPath: {} };
  }

  const existing = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (existing && existing.version === 1) return existing;

  return { version: 1, updatedAt: nowIso(), totals: {}, byPath: {} };
};

const saveStore = (store: AnalyticsStore) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const increment = (obj: Record<string, number>, key: string, delta = 1) => {
  obj[key] = (obj[key] || 0) + delta;
};

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload = {}) {
  if (typeof window === 'undefined') return;

  const write = () => {
    try {
      const store = loadStore();
      store.updatedAt = nowIso();

      increment(store.totals, name);

      const path = getPathname();
      store.byPath[path] = store.byPath[path] || {};
      increment(store.byPath[path], name);

      // Lightweight dimensions as extra counters (still aggregated)
      if (payload.audience) {
        increment(store.totals, `${name}:audience:${payload.audience}`);
      }
      if (payload.href) {
        increment(store.totals, `${name}:href:${payload.href}`);
      }

      saveStore(store);

      if (process.env.NODE_ENV !== 'production') {
        // Dev convenience: expose a snapshot for manual QA
        window.__nbAnalyticsLastEvent = { name, payload, at: store.updatedAt };
      }
    } catch {
      // Never block UX
    }
  };

  // Non-blocking write
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => write());
  }
  else window.setTimeout(write, 0);
}

export function getAnalyticsSnapshot(): AnalyticsStore | null {
  if (typeof window === 'undefined') return null;
  return loadStore();
}

export function resetAnalytics() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function exportAnalyticsJson(): string {
  const store = getAnalyticsSnapshot();
  return JSON.stringify(store, null, 2);
}

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  window.__nbAnalyticsDump = () => {
    // eslint-disable-next-line no-console
    console.log(exportAnalyticsJson());
  };
  window.__nbAnalyticsReset = () => {
    resetAnalytics();
    // eslint-disable-next-line no-console
    console.log('NeuroBreath analytics reset');
  };
}
