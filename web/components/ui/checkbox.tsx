'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base
      'peer h-4 w-4 shrink-0 rounded-sm ring-offset-background',
      // Border — unchecked default → hover
      'border border-[var(--nb-form-border)] hover:border-[var(--nb-form-border-hover)]',
      // Focus ring
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-form-ring-focus)] focus-visible:ring-offset-2',
      // Checked state — NB blue fill
      'data-[state=checked]:bg-[var(--nb-btn-primary-bg)] data-[state=checked]:border-[var(--nb-btn-primary-bg)] data-[state=checked]:text-white',
      // Disabled
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:border-[var(--nb-form-disabled-border)]',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
