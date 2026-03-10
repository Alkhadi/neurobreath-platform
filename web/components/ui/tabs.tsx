'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md p-1',
      'bg-[var(--nb-surface-soft)] border border-[var(--nb-border-soft)]',
      'text-[var(--nb-tab-text)]',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
      // Colour — inactive
      'text-[var(--nb-tab-text)]',
      // Hover — inactive
      'hover:bg-[var(--nb-tab-hover-bg)] hover:text-[var(--nb-tab-text-active)]',
      // Active state
      'data-[state=active]:bg-[var(--nb-tab-active-bg)] data-[state=active]:text-[var(--nb-tab-text-active)] data-[state=active]:shadow-sm data-[state=active]:font-semibold',
      // Focus ring
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-tab-focus)] focus-visible:ring-offset-1',
      // Disabled
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-tab-focus)] focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
