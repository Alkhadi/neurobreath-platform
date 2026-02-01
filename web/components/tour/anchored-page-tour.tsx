'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Square, Volume2, X } from 'lucide-react';

export type TourPlacement = 'auto' | 'right' | 'left' | 'bottom';

export interface AnchoredTourStep {
  tourId: string;
  selector: string;
  title: string;
  order: number;
  placement: TourPlacement;
}

interface AnchoredPageTourProps {
  open: boolean;
  steps: AnchoredTourStep[];
  stepIndex: number;
  heading: string;
  subheading?: string;
  onStepChange: (nextIndex: number) => void;
  onClose: () => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getViewport() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function AnchoredPageTour({
  open,
  steps,
  stepIndex,
  heading,
  subheading,
  onStepChange,
  onClose,
}: AnchoredPageTourProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const overlayTopRef = useRef<HTMLDivElement | null>(null);
  const overlayBottomRef = useRef<HTMLDivElement | null>(null);
  const overlayLeftRef = useRef<HTMLDivElement | null>(null);
  const overlayRightRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const rafRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const current = steps[stepIndex];

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return true;
    }
  }, []);

  const speechSupported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }, []);

  const helpMeChooseHref = useMemo(() => {
    if (typeof window === 'undefined') return '/uk/help-me-choose';
    const path = window.location?.pathname ?? '';
    if (path.startsWith('/us')) return '/us/help-me-choose';
    return '/uk/help-me-choose';
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setIsComplete(false);
  }, [open]);

  const stopSpeech = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!speechSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, [speechSupported]);

  const speakCurrentStep = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!speechSupported) return;
    if (!current) return;

    stopSpeech();

    const idx = stepIndex + 1;
    const total = steps.length;
    const parts = [heading, subheading, `Step ${idx} of ${total}.`, current.title].filter(Boolean);
    const text = parts.join(' ');

    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    u.volume = 1;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => {
      utteranceRef.current = null;
      setIsSpeaking(false);
    };
    u.onerror = () => {
      utteranceRef.current = null;
      setIsSpeaking(false);
    };

    utteranceRef.current = u;
    try {
      window.speechSynthesis.speak(u);
    } catch {
      utteranceRef.current = null;
      setIsSpeaking(false);
    }
  }, [current, heading, stepIndex, steps.length, speechSupported, stopSpeech, subheading]);

  const computePosition = () => {
    if (!open) return;
    if (!current) return;

    const el = document.querySelector(current.selector);
    if (!(el instanceof HTMLElement)) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    setTargetRect(rect);

    const pop = popoverRef.current;
    if (!pop) return;

    const popRect = pop.getBoundingClientRect();
    const viewport = getViewport();

    const margin = 12;

    const tryRight = () => {
      const left = rect.right + margin;
      if (left + popRect.width > viewport.width - margin) return null;
      const top = clamp(rect.top, margin, viewport.height - popRect.height - margin);
      return { top, left };
    };

    const tryLeft = () => {
      const left = rect.left - margin - popRect.width;
      if (left < margin) return null;
      const top = clamp(rect.top, margin, viewport.height - popRect.height - margin);
      return { top, left };
    };

    const tryBottom = () => {
      const topCandidate = rect.bottom + margin;
      const top =
        topCandidate + popRect.height <= viewport.height - margin
          ? topCandidate
          : clamp(rect.top - margin - popRect.height, margin, viewport.height - popRect.height - margin);
      const left = clamp(rect.left, margin, viewport.width - popRect.width - margin);
      return { top, left };
    };

    const placement = current.placement;

    const pick = () => {
      if (placement === 'right') return tryRight() || tryLeft() || tryBottom();
      if (placement === 'left') return tryLeft() || tryRight() || tryBottom();
      if (placement === 'bottom') return tryBottom();
      return tryRight() || tryLeft() || tryBottom();
    };

    setPopoverPos(pick());
  };

  const scheduleReposition = () => {
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      computePosition();
    });
  };

  // Scroll + initial measure on step changes
  useEffect(() => {
    if (!open) return;
    if (!current) return;

    const el = document.querySelector(current.selector);
    if (el instanceof HTMLElement) {
      try {
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      } catch {
        // ignore
      }
    }

    // Let layout settle after scrolling
    const t1 = window.setTimeout(() => scheduleReposition(), reducedMotion ? 0 : 180);
    const t2 = window.setTimeout(() => scheduleReposition(), reducedMotion ? 0 : 360);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stepIndex, current?.selector]);

  // Track scroll/resize while open
  useEffect(() => {
    if (!open) return;

    const onScroll = () => scheduleReposition();
    const onResize = () => scheduleReposition();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, current?.selector]);

  // ESC to close + arrow navigation
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        stopSpeech();
        onClose();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stopSpeech();
        onStepChange(Math.min(stepIndex + 1, steps.length - 1));
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stopSpeech();
        onStepChange(Math.max(stepIndex - 1, 0));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, onStepChange, stepIndex, steps.length, stopSpeech]);

  useEffect(() => {
    if (!open) return;
    scheduleReposition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    stopSpeech();
  }, [open, stepIndex, current?.title, stopSpeech]);

  useEffect(() => {
    if (open) return;
    stopSpeech();
  }, [open, stopSpeech]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;
    if (!open) return;

    const pop = popoverRef.current;
    const nextPos = popoverPos ?? { top: 12, left: 12 };
    if (pop) {
      pop.style.top = `${Math.round(nextPos.top)}px`;
      pop.style.left = `${Math.round(nextPos.left)}px`;
    }

    if (!targetRect) return;

    const rect = targetRect;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const topH = Math.max(0, rect.top);
    const bottomTop = Math.max(0, rect.bottom);
    const bottomH = Math.max(0, vh - rect.bottom);
    const leftW = Math.max(0, rect.left);
    const rightLeft = Math.max(0, rect.right);
    const rightW = Math.max(0, vw - rect.right);
    const stripTop = Math.max(0, rect.top);
    const stripH = Math.max(0, rect.height);

    const topPanel = overlayTopRef.current;
    if (topPanel) {
      topPanel.style.top = '0px';
      topPanel.style.left = '0px';
      topPanel.style.right = '0px';
      topPanel.style.height = `${Math.round(topH)}px`;
    }

    const bottomPanel = overlayBottomRef.current;
    if (bottomPanel) {
      bottomPanel.style.top = `${Math.round(bottomTop)}px`;
      bottomPanel.style.left = '0px';
      bottomPanel.style.right = '0px';
      bottomPanel.style.height = `${Math.round(bottomH)}px`;
    }

    const leftPanel = overlayLeftRef.current;
    if (leftPanel) {
      leftPanel.style.top = `${Math.round(stripTop)}px`;
      leftPanel.style.left = '0px';
      leftPanel.style.width = `${Math.round(leftW)}px`;
      leftPanel.style.height = `${Math.round(stripH)}px`;
    }

    const rightPanel = overlayRightRef.current;
    if (rightPanel) {
      rightPanel.style.top = `${Math.round(stripTop)}px`;
      rightPanel.style.left = `${Math.round(rightLeft)}px`;
      rightPanel.style.width = `${Math.round(rightW)}px`;
      rightPanel.style.height = `${Math.round(stripH)}px`;
    }

    const spot = spotlightRef.current;
    if (spot) {
      spot.style.top = `${Math.round(rect.top - 6)}px`;
      spot.style.left = `${Math.round(rect.left - 6)}px`;
      spot.style.width = `${Math.round(rect.width + 12)}px`;
      spot.style.height = `${Math.round(rect.height + 12)}px`;
    }
  }, [mounted, open, popoverPos, targetRect]);

  if (!mounted || !open || !current) return null;

  const total = steps.length;
  const idx = stepIndex + 1;

  const hasTarget = Boolean(targetRect);

  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isComplete ? 'Tour completed.' : `Step ${idx}/${total}: ${current.title}`}
      </div>

      {hasTarget ? (
        <>
          <div
            ref={overlayTopRef}
            className="fixed bg-black/55"
          />
          <div
            ref={overlayBottomRef}
            className="fixed bg-black/55"
          />
          <div
            ref={overlayLeftRef}
            className="fixed bg-black/55"
          />
          <div
            ref={overlayRightRef}
            className="fixed bg-black/55"
          />

          <div
            ref={spotlightRef}
            aria-hidden="true"
            className="fixed pointer-events-none rounded-xl ring-2 ring-white/90 ring-offset-0"
          />
        </>
      ) : (
        <div className="fixed inset-0 bg-black/55" />
      )}

      <div
        ref={popoverRef}
        className={cn(
          'fixed w-[min(360px,calc(100vw-24px))] rounded-2xl border border-border/60 bg-popover text-popover-foreground shadow-2xl',
          'p-4 sm:p-5',
          'animate-nbPopoverFadeIn'
        )}
        role="dialog"
        aria-modal="false"
        aria-label="Page tour"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{heading}</div>
            {subheading ? <div className="text-xs text-muted-foreground truncate">{subheading}</div> : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            aria-label="Close tour"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          {isComplete
            ? 'You’ve completed the tour.'
            : `I've scanned this page and found ${total} sections to explore.`}
        </div>

        <div className="mt-3">
          {isComplete ? (
            <>
              <div className="text-xs text-muted-foreground">Tour completed</div>
              <div className="mt-1 text-base font-semibold leading-snug">You're all set.</div>
              <div className="mt-2 text-sm text-muted-foreground">
                If you want to get going fast, use Quick Start.
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-muted-foreground">{`Step ${idx}/${total}`}</div>
              <div className="mt-1 text-base font-semibold leading-snug">{current.title}</div>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={speakCurrentStep}
            disabled={!speechSupported}
            aria-disabled={!speechSupported}
            aria-label={speechSupported ? 'Listen to this tour step' : 'Listen is not supported in this browser'}
          >
            <Volume2 className="h-4 w-4" />
            Listen
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={stopSpeech}
            disabled={!speechSupported || !isSpeaking}
            aria-label="Stop listening"
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
          {!speechSupported ? <div className="text-xs text-muted-foreground">TTS not supported.</div> : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          {isComplete ? (
            <Button
              type="button"
              size="sm"
              className="w-full"
              asChild
              onClick={() => stopSpeech()}
            >
              <Link href={helpMeChooseHref}>click me to for a quick start</Link>
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onStepChange(Math.max(stepIndex - 1, 0))}
                disabled={stepIndex === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (stepIndex >= total - 1) {
                    stopSpeech();
                    setIsComplete(true);
                    return;
                  }
                  stopSpeech();
                  onStepChange(stepIndex + 1);
                }}
                className="gap-1"
              >
                {stepIndex >= total - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
