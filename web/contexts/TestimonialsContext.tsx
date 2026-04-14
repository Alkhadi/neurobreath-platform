'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Testimonial } from '@/components/testimonials/types';

const STORAGE_KEY = 'nb-pending-testimonials';

const STARTER_TESTIMONIALS: Testimonial[] = [
  {
    id: 'starter-1',
    name: 'Michelle',
    role: 'Neurodivergent Parent',
    quote:
      "NeuroBreath's calm breathing exercises helped me feel more settled during stressful days. I feel lighter and more able to focus now.",
    rating: 5,
    status: 'approved',
  },
  {
    id: 'starter-2',
    name: 'Alex',
    role: 'Adult with ADHD',
    quote:
      'Finally, tools that cut through my ADHD fog. The focus routines made it much easier for me to start and finish small tasks.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'starter-3',
    name: 'Rebecca',
    role: 'Parent',
    quote:
      'There is less sensory overwhelm at home, and routines feel more doable now. It has made a real difference for my autistic child.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'starter-4',
    name: 'Sam',
    role: 'Teen User',
    quote:
      'The breathing resets are simple but powerful. They help me calm down when stress starts building.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'starter-5',
    name: 'Abby',
    role: 'Autistic Adult',
    quote:
      'Accessible, clear, and genuinely helpful. The routines supported my sleep and emotional regulation in a way that felt manageable.',
    rating: 5,
    status: 'approved',
  },
];

interface TestimonialsContextValue {
  approved: Testimonial[];
  pending: Testimonial[];
  addPending: (data: Omit<Testimonial, 'id' | 'status'>) => void;
}

const TestimonialsContext = createContext<TestimonialsContextValue | null>(null);

export function TestimonialsProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Testimonial[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Testimonial[];
        if (Array.isArray(parsed)) setPending(parsed);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const addPending = useCallback(
    (data: Omit<Testimonial, 'id' | 'status'>) => {
      const newItem: Testimonial = {
        ...data,
        id: `pending-${Date.now()}`,
        status: 'pending',
      };
      setPending((prev) => {
        const updated = [...prev, newItem];
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore storage errors
        }
        return updated;
      });
    },
    [],
  );

  return (
    <TestimonialsContext.Provider
      value={{
        approved: STARTER_TESTIMONIALS,
        pending,
        addPending,
      }}
    >
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials() {
  const ctx = useContext(TestimonialsContext);
  if (!ctx) {
    throw new Error(
      'useTestimonials must be used within a TestimonialsProvider',
    );
  }
  return ctx;
}
