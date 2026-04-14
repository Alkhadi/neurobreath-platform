/* eslint-disable no-restricted-globals */

// NeuroBreath Service Worker
// - Cache-first for static assets (icons, fonts, images)
// - Stale-while-revalidate for pages
// - Network-only for API routes
// - Offline fallback page when network is unavailable

const CACHE_NAME = 'nb-cache-v1';

// Paths to pre-cache on install.
const PRECACHE_URLS = [
  '/offline.html',
  '/icons/neurobreath/icon-192.png',
  '/icons/neurobreath/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  // Clean up old caches.
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/**
 * Returns true for URLs that should never be cached.
 */
function isApiOrAuth(url) {
  const path = new URL(url).pathname;
  return (
    path.startsWith('/api/') ||
    path.startsWith('/__/auth/') ||
    path.includes('firestore.googleapis.com') ||
    path.includes('identitytoolkit.googleapis.com')
  );
}

/**
 * Returns true for static assets that benefit from cache-first.
 */
function isStaticAsset(url) {
  const path = new URL(url).pathname;
  return (
    path.startsWith('/icons/') ||
    path.startsWith('/images/') ||
    path.startsWith('/fonts/') ||
    path.startsWith('/_next/static/') ||
    /\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf)$/.test(path)
  );
}

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests.
  if (request.method !== 'GET') return;

  // Never cache API or auth requests.
  if (isApiOrAuth(request.url)) {
    return;
  }

  // Cache-first for static assets.
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for navigation / pages.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // Default: network first, fall back to cache.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
