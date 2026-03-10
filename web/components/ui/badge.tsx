import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--nb-form-ring-focus)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        // ── shadcn base variants (kept for backward compatibility) ──
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // ── NB semantic status variants ──────────────────────────
        neutral:
          'border-[var(--nb-badge-neutral-border)] bg-[var(--nb-badge-neutral-bg)] text-[var(--nb-badge-neutral-text)]',
        soft:
          'border-[var(--nb-badge-soft-border)] bg-[var(--nb-badge-soft-bg)] text-[var(--nb-badge-soft-text)]',
        success:
          'border-[var(--nb-badge-success-border)] bg-[var(--nb-badge-success-bg)] text-[var(--nb-badge-success-text)]',
        warning:
          'border-[var(--nb-badge-warning-border)] bg-[var(--nb-badge-warning-bg)] text-[var(--nb-badge-warning-text)]',
        error:
          'border-[var(--nb-badge-error-border)] bg-[var(--nb-badge-error-bg)] text-[var(--nb-badge-error-text)]',
        info:
          'border-[var(--nb-badge-info-border)] bg-[var(--nb-badge-info-bg)] text-[var(--nb-badge-info-text)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
