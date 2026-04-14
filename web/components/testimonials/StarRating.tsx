'use client';

import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md';
  className?: string;
}

/** Display-only star rating. */
export function StarRating({
  rating,
  maxStars = 5,
  size = 'sm',
  className,
}: StarRatingProps) {
  const sizeClass = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div className={cn('flex gap-0.5', className)} aria-label={`${rating} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={cn(
            sizeClass,
            i < rating
              ? 'text-amber-400'
              : 'text-slate-200 dark:text-slate-600',
          )}
        >
          <path
            fill="currentColor"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
    </div>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
  className?: string;
}

/** Interactive star rating input with keyboard support. */
export function StarRatingInput({
  value,
  onChange,
  maxStars = 5,
  className,
}: StarRatingInputProps) {
  return (
    <div
      className={cn('flex gap-1', className)}
      role="radiogroup"
      aria-label="Rating"
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const isSelected = starValue <= value;

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={starValue === value}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            className={cn(
              'rounded-sm p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 focus-visible:ring-offset-2',
              isSelected
                ? 'text-amber-400'
                : 'text-slate-300 dark:text-slate-600 hover:text-amber-300',
            )}
            onClick={() => onChange(starValue)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                onChange(Math.min(starValue + 1, maxStars));
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                onChange(Math.max(starValue - 1, 1));
              }
            }}
            tabIndex={starValue === value || (value === 0 && i === 0) ? 0 : -1}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-6 w-6">
              <path
                fill="currentColor"
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
