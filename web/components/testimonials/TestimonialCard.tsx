'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StarRating } from './StarRating';
import type { Testimonial } from './types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      className={cn(
        'flex flex-col gap-3 rounded-2xl md:rounded-[30px] border border-black/5 dark:border-white/10',
        'bg-white/90 dark:bg-white/5 p-4 sm:p-5 md:p-6 shadow-xl',
        'transition-shadow hover:shadow-2xl',
        className,
      )}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <StarRating rating={testimonial.rating} />

      <blockquote className="flex-1 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <footer className="flex items-center gap-3 pt-2 border-t border-black/5 dark:border-white/10">
        {/* Avatar placeholder – initials */}
        <div
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4ECDC4]/10 text-sm font-semibold text-[#4ECDC4]"
        >
          {testimonial.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">
            {testimonial.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {testimonial.role}
          </p>
        </div>

        {testimonial.status === 'pending' && (
          <span className="ml-auto inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/20 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/30">
            Awaiting review
          </span>
        )}
      </footer>
    </motion.article>
  );
}
