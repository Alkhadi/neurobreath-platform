/* eslint-disable no-restricted-globals */

// Bump this to force clients to drop old cached /contact assets.
const CACHE_NAME = 'nbcard-v2';
const CORE_URLS = [
  '/contact',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => undefined)
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => (key === CACHE_NAME ? Promise.resolve() : caches.delete(key))));
      await self.clients.claim();
    })()
  );
});

function isSameOrigin(url) {
  try {
    return new URL(url).origin === self.location.origin;
  } catch {
    return false;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') return;

  // Only handle same-origin requests
  if (!isSameOrigin(req.url)) return;

  // Navigation: network-first, cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put('/contact', res.clone()).catch(() => undefined);
          return res;
        } catch {
          const cached = await caches.match(req);
          return cached || caches.match('/contact');
        }
      })()
    );
    return;
  }

  // Assets: stale-while-revalidate
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      const fetchPromise = fetch(req)
        .then(async (res) => {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, res.clone()).catch(() => undefined);
          return res;
        })
        .catch(() => undefined);

      return cached || (await fetchPromise) || cached;
    })()
  );
});
