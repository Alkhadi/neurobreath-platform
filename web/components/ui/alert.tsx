import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
  {
    variants: {
      variant: {
        // ── base variants ─────────────────────────────────
        default:
          'border-[var(--nb-border-soft)] bg-[var(--nb-surface-soft)] text-[var(--nb-text-body)] [&>svg]:text-[var(--nb-text-secondary)]',
        destructive:
          'border-[var(--nb-badge-error-border)] bg-[var(--nb-badge-error-bg)] text-[var(--nb-badge-error-text)] [&>svg]:text-[var(--nb-badge-error-text)]',
        // ── NB semantic variants ──────────────────────────
        success:
          'border-[var(--nb-badge-success-border)] bg-[var(--nb-badge-success-bg)] text-[var(--nb-badge-success-text)] [&>svg]:text-[var(--nb-badge-success-text)]',
        warning:
          'border-[var(--nb-badge-warning-border)] bg-[var(--nb-badge-warning-bg)] text-[var(--nb-badge-warning-text)] [&>svg]:text-[var(--nb-badge-warning-text)]',
        info:
          'border-[var(--nb-badge-info-border)] bg-[var(--nb-badge-info-bg)] text-[var(--nb-badge-info-text)] [&>svg]:text-[var(--nb-badge-info-text)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
