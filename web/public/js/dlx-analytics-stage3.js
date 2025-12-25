// dlx-analytics-stage3.js
// Lightweight analytics for Stage 3 (Vowel Quest + Fluency Pacer)

(function () {
  const STORAGE_KEY = "nb_dlx_stage3_log_v1";

  // Optional: point this to a Cloudflare Worker / API endpoint later
  const CONFIG = {
    endpointUrl: null, // e.g. "https://your-worker.example.com/dlx-log"
  };

  let buffer = [];

  function loadExisting() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        buffer = parsed;
      }
    } catch (e) {
      console.warn("NB_ANALYTICS: failed to load existing log", e);
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(buffer));
    } catch (e) {
      console.warn("NB_ANALYTICS: failed to persist log", e);
    }
  }

  function sendToServer(event) {
    if (!CONFIG.endpointUrl) return;

    try {
      const payload = JSON.stringify(event);

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(CONFIG.endpointUrl, blob);
      } else {
        fetch(CONFIG.endpointUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch (e) {
      console.warn("NB_ANALYTICS: sendToServer failed", e);
    }
  }

  function logEvent(event) {
    if (!event || typeof event !== "object") return;

    const enriched = {
      ...event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent || "",
      pagePath: location.pathname,
    };

    buffer.push(enriched);
    persist();
    sendToServer(enriched);
  }

  function getEvents() {
    return buffer.slice();
  }

  function clear() {
    buffer = [];
    persist();
  }

  loadExisting();

  window.NB_ANALYTICS = {
    logEvent,
    getEvents,
    clear,
    _config: CONFIG, // so you can set endpointUrl from another script if you wish
  };
})();
