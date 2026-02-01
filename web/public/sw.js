/* eslint-disable no-restricted-globals */

// Minimal, safe Service Worker for installability.
// - No precaching (avoids stale asset risk)
// - Fetch handler is pass-through (meets PWA install criteria)
// - Immediate activation to pick up updates quickly

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  event.respondWith(fetch(request));
});
