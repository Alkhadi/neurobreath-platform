import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base layout
          'flex min-h-[80px] w-full rounded-md px-3 py-2 text-sm ring-offset-background',
          // Background + text
          'bg-[var(--nb-form-bg)] text-[var(--nb-form-input-text)]',
          // Border — default → hover → focus
          'border border-[var(--nb-form-border)]',
          'hover:border-[var(--nb-form-border-hover)]',
          // Placeholder
          'placeholder:text-[var(--nb-form-placeholder)]',
          // Focus-visible ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-form-ring-focus)] focus-visible:ring-offset-2 focus-visible:border-[var(--nb-form-border-focus)]',
          // Error state
          'aria-[invalid=true]:border-[var(--nb-form-error-border)] aria-[invalid=true]:bg-[var(--nb-form-error-bg)] aria-[invalid=true]:focus-visible:ring-[var(--nb-form-error-ring)]',
          // Read-only state
          'read-only:bg-[var(--nb-form-bg-readonly)] read-only:cursor-default read-only:focus-visible:ring-0 read-only:focus-visible:border-[var(--nb-form-border)]',
          // Disabled state
          'disabled:cursor-not-allowed disabled:bg-[var(--nb-form-bg-disabled)] disabled:text-[var(--nb-form-disabled-text)] disabled:border-[var(--nb-form-disabled-border)]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
