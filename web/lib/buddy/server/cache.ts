type CacheEntry<T> = { value: T; expiresAt: number };

const cache = new Map<string, CacheEntry<unknown>>();

export function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function cacheDelete(key: string): void {
  cache.delete(key);
}

type RateEntry = { windowStart: number; count: number };
const rate = new Map<string, RateEntry>();

export function rateLimit(key: string, max: number, windowMs: number): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = rate.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    rate.set(key, { windowStart: now, count: 1 });
    return { ok: true, remaining: Math.max(0, max - 1) };
  }

  if (entry.count >= max) {
    return { ok: false, remaining: 0 };
  }

  entry.count += 1;
  rate.set(key, entry);
  return { ok: true, remaining: Math.max(0, max - entry.count) };
}
