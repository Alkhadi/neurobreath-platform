'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TestimonialCard } from './TestimonialCard';
import type { Testimonial } from './types';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoRotate?: boolean;
  intervalMs?: number;
  className?: string;
}

function useCardsPerPage() {
  const [cardsPerPage, setCardsPerPage] = useState(1);

  useEffect(() => {
    function update() {
      if (window.innerWidth >= 1024) setCardsPerPage(3);
      else if (window.innerWidth >= 768) setCardsPerPage(2);
      else setCardsPerPage(1);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return cardsPerPage;
}

export function TestimonialCarousel({
  testimonials,
  autoRotate = true,
  intervalMs = 6000,
  className,
}: TestimonialCarouselProps) {
  const cardsPerPage = useCardsPerPage();
  const totalPages = Math.max(1, Math.ceil(testimonials.length / cardsPerPage));
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep page in bounds when cardsPerPage or length changes
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  // Auto-rotation
  useEffect(() => {
    if (!autoRotate || isPaused || shouldReduceMotion || totalPages <= 1) return;
    const timer = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [autoRotate, isPaused, shouldReduceMotion, totalPages, intervalMs]);

  const goTo = useCallback(
    (next: number) => setPage(((next % totalPages) + totalPages) % totalPages),
    [totalPages],
  );

  const visibleTestimonials = testimonials.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage,
  );

  const variants = shouldReduceMotion
    ? { enter: {}, center: {}, exit: {} }
    : {
        enter: { opacity: 0, x: 40 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
      };

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setIsPaused(false);
        }
      }}
    >
      {/* Cards grid */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="grid gap-4 sm:gap-6"
        style={{
          gridTemplateColumns: `repeat(${cardsPerPage}, minmax(0, 1fr))`,
        }}
      >
        <AnimatePresence mode="wait">
          {visibleTestimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <TestimonialCard testimonial={t} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {totalPages > 1 && (
        <nav
          aria-label="Testimonial carousel controls"
          className="mt-6 flex items-center justify-center gap-3"
        >
          <button
            type="button"
            aria-label="Previous testimonials"
            onClick={() => goTo(page - 1)}
            className="rounded-full p-2 text-slate-500 hover:text-[#4ECDC4] hover:bg-[#4ECDC4]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 focus-visible:ring-offset-2"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            type="button"
            aria-label={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
            onClick={() => setIsPaused((p) => !p)}
            className="rounded-full p-2 text-slate-500 hover:text-[#4ECDC4] hover:bg-[#4ECDC4]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 focus-visible:ring-offset-2"
          >
            {isPaused ? (
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            aria-label="Next testimonials"
            onClick={() => goTo(page + 1)}
            className="rounded-full p-2 text-slate-500 hover:text-[#4ECDC4] hover:bg-[#4ECDC4]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 focus-visible:ring-offset-2"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Page dots */}
          <div className="ml-2 flex gap-1.5" role="tablist" aria-label="Testimonial pages">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === page}
                aria-label={`Page ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 focus-visible:ring-offset-2',
                  i === page
                    ? 'w-6 bg-[#4ECDC4]'
                    : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-[#4ECDC4]/40',
                )}
              />
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
