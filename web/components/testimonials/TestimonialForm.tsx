'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { StarRatingInput } from './StarRating';
import { useTestimonials } from '@/contexts/TestimonialsContext';
import type { TestimonialSubmission } from './types';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function TestimonialForm({ className }: { className?: string }) {
  const { addPending } = useTestimonials();
  const [formState, setFormState] = useState<FormState>('idle');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestimonialSubmission>({
    defaultValues: {
      name: '',
      role: '',
      rating: 0,
      quote: '',
      email: '',
      consent: false,
    },
  });

  const ratingValue = watch('rating');
  const consentValue = watch('consent');

  async function onSubmit(data: TestimonialSubmission) {
    setFormState('submitting');

    // Optimistic local update
    addPending({
      name: data.name,
      role: data.role,
      quote: data.quote,
      rating: data.rating,
    });

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          role: data.role,
          rating: data.rating,
          quote: data.quote,
          email: data.email || undefined,
        }),
      });

      if (!res.ok) {
        setFormState('error');
        return;
      }

      setFormState('success');
      reset();
    } catch {
      setFormState('error');
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl md:rounded-[30px] border border-black/5 dark:border-white/10',
        'bg-white/90 dark:bg-white/5 p-4 sm:p-5 md:p-8 shadow-xl',
        className,
      )}
    >
      <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] dark:text-white">
        Share your experience
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        All submissions are reviewed before public display.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 grid gap-4 sm:grid-cols-2"
        noValidate
      >
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="testimonial-name">Name *</Label>
          <Input
            id="testimonial-name"
            placeholder="Your first name"
            aria-invalid={!!errors.name}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <p className="text-xs text-[var(--nb-form-error-text)]">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <Label htmlFor="testimonial-role">Role *</Label>
          <Input
            id="testimonial-role"
            placeholder="e.g. Parent, Teacher, Adult with ADHD"
            aria-invalid={!!errors.role}
            {...register('role', { required: 'Role is required' })}
          />
          {errors.role && (
            <p className="text-xs text-[var(--nb-form-error-text)]">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Rating *</Label>
          <StarRatingInput
            value={ratingValue}
            onChange={(v) => setValue('rating', v, { shouldValidate: true })}
          />
          <input
            type="hidden"
            {...register('rating', {
              validate: (v) => (v >= 1 && v <= 5) || 'Please select a rating',
            })}
          />
          {errors.rating && (
            <p className="text-xs text-[var(--nb-form-error-text)]">
              {errors.rating.message}
            </p>
          )}
        </div>

        {/* Quote */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="testimonial-quote">Your experience *</Label>
          <Textarea
            id="testimonial-quote"
            placeholder="Tell us how NeuroBreath has supported you..."
            rows={4}
            aria-invalid={!!errors.quote}
            {...register('quote', {
              required: 'Please share your experience',
              minLength: { value: 10, message: 'Please write at least 10 characters' },
              maxLength: { value: 500, message: 'Maximum 500 characters' },
            })}
          />
          {errors.quote && (
            <p className="text-xs text-[var(--nb-form-error-text)]">
              {errors.quote.message}
            </p>
          )}
        </div>

        {/* Email (optional) */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="testimonial-email">Email (optional)</Label>
          <Input
            id="testimonial-email"
            type="email"
            placeholder="Only used if we need to follow up"
            {...register('email')}
          />
        </div>

        {/* Consent */}
        <div className="sm:col-span-2 flex items-start gap-3">
          <Checkbox
            id="testimonial-consent"
            checked={consentValue}
            onCheckedChange={(checked) =>
              setValue('consent', checked === true, { shouldValidate: true })
            }
            aria-invalid={!!errors.consent}
          />
          <div className="space-y-1">
            <Label htmlFor="testimonial-consent" className="text-sm leading-normal">
              I understand my submission may be reviewed before appearing publicly. *
            </Label>
            <input
              type="hidden"
              {...register('consent', {
                validate: (v) => v === true || 'You must agree to continue',
              })}
            />
            {errors.consent && (
              <p className="text-xs text-[var(--nb-form-error-text)]">
                {errors.consent.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="sm:col-span-2 flex flex-col gap-3">
          <Button
            type="submit"
            disabled={formState === 'submitting'}
            className="w-full sm:w-auto"
          >
            {formState === 'submitting' ? 'Submitting…' : 'Submit testimonial'}
          </Button>

          {/* Feedback */}
          <div aria-live="polite" aria-atomic="true">
            {formState === 'success' && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Thank you! Your testimonial has been submitted for review.
              </p>
            )}
            {formState === 'error' && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Something went wrong. Your testimonial has been saved locally and will appear as
                &quot;Awaiting review.&quot;
              </p>
            )}
          </div>
        </div>
      </form>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
        Testimonials reflect personal experience and are reviewed before public display.
        They are not medical advice.
      </p>
    </div>
  );
}
