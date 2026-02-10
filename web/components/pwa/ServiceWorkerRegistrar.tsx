'use client';

import { useEffect } from 'react';

const SW_URL = '/sw.js';

function isSameScope(scopeUrl: string, desiredScope: string) {
  try {
    const desired = new URL(desiredScope, window.location.href).href;
    return scopeUrl === desired;
  } catch {
    return false;
  }
}

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    let cancelled = false;

    async function register() {
      if (typeof window === 'undefined') return;
      if (!('serviceWorker' in navigator)) return;

      try {
        // If an older SW is registered at the root scope (e.g. `/nbcard-sw.js`),
        // unregister it so `/sw.js` can take over cleanly.
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          if (!isSameScope(registration.scope, '/')) continue;

          const activeUrl = registration.active?.scriptURL || '';
          const installingUrl = registration.installing?.scriptURL || '';
          const waitingUrl = registration.waiting?.scriptURL || '';
          const scriptUrl = activeUrl || installingUrl || waitingUrl;

          if (scriptUrl && !scriptUrl.endsWith(SW_URL)) {
            await registration.unregister();
          }
        }

        if (cancelled) return;

        await navigator.serviceWorker.register(SW_URL, { scope: '/' });
      } catch {
        // Ignore registration errors to avoid breaking the app.
      }
    }

    void register();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
