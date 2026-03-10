'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-[var(--nb-accordion-border)]', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Base layout
        'flex flex-1 items-center justify-between py-4 transition-all',
        // Typography — authoritative but not harsh
        'font-semibold text-[var(--nb-accordion-trigger-text)]',
        // Hover — surface tint, no underline
        'hover:bg-[var(--nb-accordion-trigger-hover-bg)] rounded-sm px-1 -mx-1',
        // Open state chevron rotation
        '[&[data-state=open]>svg]:rotate-180',
        // Focus ring
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-tab-focus)] focus-visible:ring-offset-1',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-[var(--nb-accordion-icon-color)] transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0 text-[var(--nb-accordion-content-text)]', className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
