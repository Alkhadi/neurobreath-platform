/* eslint-disable no-restricted-globals */

// Bump this to force clients to drop old cached /contact assets.
const CACHE_NAME = 'nbcard-v3';
const CORE_URLS = [
  '/contact',
  '/resources/nb-card',
  '/uk/resources/nb-card',
  '/us/resources/nb-card',
  '/manifest.json',
  '/resources/nb-card/manifest.webmanifest',
  '/uk/resources/nb-card/manifest.webmanifest',
  '/us/resources/nb-card/manifest.webmanifest',
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
        const url = new URL(req.url);
        const isUkNbCard = url.pathname.startsWith('/uk/resources/nb-card');
        const isUsNbCard = url.pathname.startsWith('/us/resources/nb-card');
        const isGlobalNbCard = url.pathname.startsWith('/resources/nb-card');
        const fallbackPath = isUkNbCard
          ? '/uk/resources/nb-card'
          : isUsNbCard
            ? '/us/resources/nb-card'
            : isGlobalNbCard
              ? '/resources/nb-card'
              : '/contact';
        try {
          const res = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(fallbackPath, res.clone()).catch(() => undefined);
          return res;
        } catch {
          const cached = await caches.match(req);
          return cached || caches.match(fallbackPath);
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
