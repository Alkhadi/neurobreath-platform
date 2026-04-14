'use client';

import { TestimonialsProvider, useTestimonials } from '@/contexts/TestimonialsContext';
import { TestimonialCarousel } from './TestimonialCarousel';
import { TestimonialForm } from './TestimonialForm';
import type { Testimonial } from './types';

interface TestimonialsSectionProps {
  /** Show the submission form below the carousel. */
  showForm?: boolean;
  /** Enable auto-rotating carousel. */
  autoRotate?: boolean;
  /** Override the default approved testimonials (for future backend integration). */
  initialTestimonials?: Testimonial[];
}

function TestimonialsSectionInner({
  showForm = true,
  autoRotate = true,
}: Omit<TestimonialsSectionProps, 'initialTestimonials'>) {
  const { approved, pending } = useTestimonials();

  return (
    <div className="flex flex-col gap-8">
      {/* Approved testimonials carousel */}
      <TestimonialCarousel testimonials={approved} autoRotate={autoRotate} />

      {/* Pending testimonials (visible only to submitting user) */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Your submissions
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((t) => (
              <article
                key={t.id}
                className="rounded-2xl border border-amber-200/60 dark:border-amber-700/30 bg-amber-50/50 dark:bg-amber-900/10 p-4 sm:p-5"
              >
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  — {t.name}, {t.role}
                </p>
                <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                  Awaiting review
                </span>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Submission form */}
      {showForm && <TestimonialForm />}

      {/* Trust/safety note */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        Testimonials reflect personal experience and are reviewed before public display.
        They are not medical advice.
      </p>
    </div>
  );
}

export function TestimonialsSection(props: TestimonialsSectionProps) {
  return (
    <TestimonialsProvider>
      <TestimonialsSectionInner
        showForm={props.showForm}
        autoRotate={props.autoRotate}
      />
    </TestimonialsProvider>
  );
}
