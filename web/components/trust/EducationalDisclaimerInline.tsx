'use client';

import { cn } from '@/lib/utils';

interface EducationalDisclaimerInlineProps {
  contextLabel?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export function EducationalDisclaimerInline({
  contextLabel,
  variant = 'default',
  className,
}: EducationalDisclaimerInlineProps) {
  const label = contextLabel ? `${contextLabel}: ` : '';
  return (
    <div
      className={cn(
        'rounded-lg border border-amber-200/80 bg-amber-50/70 text-amber-900',
        variant === 'compact' ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
        className,
      )}
      role="note"
      aria-live="polite"
    >
      <strong>{label}</strong>
      Educational information only. It can support wellbeing routines, but it is not medical advice or a diagnosis.
    </div>
  );
}
