'use client';

import { TestimonialsProvider } from '@/contexts/TestimonialsContext';
import { TestimonialCarousel } from '@/components/testimonials/TestimonialCarousel';
import { TestimonialForm } from '@/components/testimonials/TestimonialForm';
import type { Testimonial } from '@/components/testimonials/types';

const NB_CARD_TESTIMONIALS: Testimonial[] = [
  {
    id: 'nbcard-1',
    name: 'Alkhadi Koroma',
    role: 'Entrepreneur',
    quote:
      'NB-Card completely changed how I network. I share my digital business card instantly at events, and people always comment on how professional and polished it looks.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'nbcard-2',
    name: 'Mariatou Koroma',
    role: 'Small Business Owner',
    quote:
      'I love that all my contact details, social links, and branding live in one clean card I can update any time. No more reprinting paper cards every time something changes.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'nbcard-3',
    name: 'Andrew Smith',
    role: 'Freelance Consultant',
    quote:
      'The install-to-home-screen feature is brilliant. My NB-Card works offline and loads instantly. Clients are always impressed when I pull it up in seconds.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'nbcard-4',
    name: 'Fatima Johnson',
    role: 'Marketing Manager',
    quote:
      'NB-Card makes sharing contact details effortless. The OG image previews look fantastic when I drop my card link into emails and messages — it really stands out.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'nbcard-5',
    name: 'Peter Williams',
    role: 'Sales Director',
    quote:
      'Our whole team switched to NB-Card. It is easy to set up, keeps everything on-device for privacy, and the multiple card types — business, flyer, address — cover every use case we need.',
    rating: 5,
    status: 'approved',
  },
];

export function NBCardTestimonials() {
  return (
    <TestimonialsProvider>
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-purple-500">
            What people say
          </p>
          <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            Loved by professionals everywhere
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            See how NB-Card helps people network, share contact details, and make a lasting impression.
          </p>
        </div>

        <TestimonialCarousel testimonials={NB_CARD_TESTIMONIALS} autoRotate />

        <TestimonialForm />

        <p className="text-center text-xs text-gray-400">
          Testimonials reflect personal experience and are reviewed before public display.
        </p>
      </div>
    </TestimonialsProvider>
  );
}
