"use client";

import { useEffect, useRef } from "react";

type TurnstileTheme = "auto" | "light" | "dark";

type TurnstileSize = "normal" | "compact";

export type TurnstileWidgetProps = {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  action?: string;
  theme?: TurnstileTheme;
  size?: TurnstileSize;
  resetKey?: string | number;
};

function ensureTurnstileScriptLoaded(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  if (window.turnstile) return Promise.resolve();

  if (!window.__turnstileScriptPromise) {
    window.__turnstileScriptPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      );

      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Failed to load Turnstile script")));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Turnstile script"));
      document.head.appendChild(script);
    });
  }

  return window.__turnstileScriptPromise;
}

export function TurnstileWidget({
  siteKey,
  onVerify,
  onError,
  onExpire,
  action = "contact",
  theme = "auto",
  size = "normal",
  resetKey,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function mount() {
      if (!siteKey || !containerRef.current) return;

      await ensureTurnstileScriptLoaded();
      if (cancelled) return;

      if (!window.turnstile) throw new Error("Turnstile API not available after script load");

      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }

      containerRef.current.innerHTML = "";

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        theme,
        size,
        callback: (token: string) => onVerify(token),
        "error-callback": () => onError?.(),
        "expired-callback": () => {
          onExpire?.();
          onVerify("");
        },
      });
    }

    mount().catch(() => {
      onError?.();
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, action, theme, size, resetKey]);

  return <div ref={containerRef} />;
}
