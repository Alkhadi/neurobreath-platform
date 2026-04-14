'use client';

import { TestimonialsProvider } from '@/contexts/TestimonialsContext';
import { TestimonialCarousel } from '@/components/testimonials/TestimonialCarousel';
import { TestimonialForm } from '@/components/testimonials/TestimonialForm';
import type { Testimonial } from '@/components/testimonials/types';

const FOCUS_GARDEN_TESTIMONIALS: Testimonial[] = [
  {
    id: 'fg-1',
    name: 'Priya Nair',
    role: 'Teacher & ADHD Advocate',
    quote:
      'Focus Garden turned screen time into something positive for my students. They race to grow their gardens, and their attention spans are genuinely improving week on week.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'fg-2',
    name: 'Oliver Chang',
    role: 'University Student with ADHD',
    quote:
      'I used to struggle to focus for more than five minutes. The timer sessions and streak rewards keep me going — I have hit a 14-day streak and my revision has never been better.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'fg-3',
    name: 'Aisling Byrne',
    role: 'Occupational Therapist',
    quote:
      'I recommend Focus Garden to clients who need structured, low-pressure focus practice. The companion and garden metaphor makes it approachable and genuinely motivating.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'fg-4',
    name: 'Daniel Osei',
    role: 'Parent of Two',
    quote:
      'My kids ask to do their "garden time" every evening. It has replaced endless scrolling with breathing exercises and focus challenges they actually enjoy.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'fg-5',
    name: 'Chloe Martin',
    role: 'Autistic Adult',
    quote:
      'The sensory-friendly design and gentle animations make Focus Garden one of the few focus apps I can use without overwhelm. The badge system keeps me coming back.',
    rating: 5,
    status: 'approved',
  },
];

export function FocusGardenTestimonials() {
  return (
    <TestimonialsProvider>
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-500">
            What growers say
          </p>
          <h3 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
            Real experiences from the Focus Garden community
          </h3>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Hear from people using Focus Garden to build focus habits, grow streaks, and support daily routines.
          </p>
        </div>

        <TestimonialCarousel testimonials={FOCUS_GARDEN_TESTIMONIALS} autoRotate />

        <TestimonialForm />

        <p className="text-center text-xs text-slate-400">
          Testimonials reflect personal experience and are reviewed before public display.
          They are not medical advice.
        </p>
      </div>
    </TestimonialsProvider>
  );
}
