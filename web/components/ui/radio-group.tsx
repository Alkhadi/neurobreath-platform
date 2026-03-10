'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Base
        'aspect-square h-4 w-4 rounded-full ring-offset-background',
        // Border — unchecked default → hover
        'border border-[var(--nb-form-border)] hover:border-[var(--nb-form-border-hover)]',
        // Selected indicator colour
        'text-[var(--nb-btn-primary-bg)]',
        // Focus ring
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-form-ring-focus)] focus-visible:ring-offset-2',
        // Checked border
        'data-[state=checked]:border-[var(--nb-btn-primary-bg)]',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:border-[var(--nb-form-disabled-border)]',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
