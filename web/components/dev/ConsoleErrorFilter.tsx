'use client';

import { useEffect } from 'react';

const INSTALL_FLAG = '__nb_console_error_filter_installed__';
const ORIGINAL_FN = '__nb_console_error_filter_original__';

function isAbortPlayPauseNoise(value: unknown): boolean {
  if (!value) return false;

  if (typeof value === 'string') {
    const msg = value;
    return (
      msg.includes('The play() request was interrupted by a call to pause()') ||
      (msg.includes('play()') && msg.includes('pause()') && msg.includes('interrupted'))
    );
  }

  if (typeof value === 'object') {
    const maybe = value as { name?: unknown; message?: unknown };
    if (maybe.name !== 'AbortError') return false;
    const message = typeof maybe.message === 'string' ? maybe.message : '';
    return (
      message.includes('The play() request was interrupted by a call to pause()') ||
      (message.includes('play()') && message.includes('pause()') && message.includes('interrupted'))
    );
  }

  return false;
}

export function ConsoleErrorFilter() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof console === 'undefined' || typeof console.error !== 'function') return;

    const c = console as unknown as Record<string, unknown>;
    if (c[INSTALL_FLAG]) return;

    const original = console.error.bind(console);
    c[ORIGINAL_FN] = original;
    c[INSTALL_FLAG] = true;

    console.error = (...args: unknown[]) => {
      try {
        if (args.some(isAbortPlayPauseNoise)) return;
      } catch {
        // Fall through to original console.error
      }

      return original(...args);
    };
  }, []);

  return null;
}
