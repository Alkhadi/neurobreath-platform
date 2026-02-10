'use client';

import { useUserPreferencesState } from '@/lib/user-preferences/useUserPreferences';
import { getReadingLevelClassName } from '@/lib/user-preferences/readingLevel';
import type { ReadingLevel } from '@/lib/user-preferences/schema';
import { ReactNode } from 'react';

interface ReadingLevelBlockProps {
  level: ReadingLevel;
  children: ReactNode;
  className?: string;
}

/**
 * ReadingLevelBlock - Conditional content display based on user's reading level preference
 * 
 * Usage:
 * ```tsx
 * <ReadingLevelBlock level="simple">
 *   <p>Simple explanation here</p>
 * </ReadingLevelBlock>
 * 
 * <ReadingLevelBlock level="standard">
 *   <p>Standard explanation with more detail</p>
 * </ReadingLevelBlock>
 * 
 * <ReadingLevelBlock level="detailed">
 *   <p>Comprehensive explanation with technical terms</p>
 * </ReadingLevelBlock>
 * ```
 * 
 * The component uses CSS (data-reading-level attribute on html) to hide/show content.
 * This prevents layout shift and works with SSR.
 */
export function ReadingLevelBlock({ level, children, className }: ReadingLevelBlockProps) {
  const levelClassName = getReadingLevelClassName(level);
  
  return (
    <div className={`${levelClassName} ${className || ''}`}>
      {children}
    </div>
  );
}

interface ReadingLevelContentProps {
  simple?: ReactNode;
  standard?: ReactNode;
  detailed?: ReactNode;
  className?: string;
}

/**
 * ReadingLevelContent - Alternative API for providing all variants at once
 * 
 * Usage:
 * ```tsx
 * <ReadingLevelContent
 *   simple={<p>Simple explanation</p>}
 *   standard={<p>Standard explanation</p>}
 *   detailed={<p>Detailed explanation</p>}
 * />
 * ```
 */
export function ReadingLevelContent({ simple, standard, detailed, className }: ReadingLevelContentProps) {
  return (
    <>
      {simple && (
        <ReadingLevelBlock level="simple" className={className}>
          {simple}
        </ReadingLevelBlock>
      )}
      {standard && (
        <ReadingLevelBlock level="standard" className={className}>
          {standard}
        </ReadingLevelBlock>
      )}
      {detailed && (
        <ReadingLevelBlock level="detailed" className={className}>
          {detailed}
        </ReadingLevelBlock>
      )}
    </>
  );
}

/**
 * Hook to get current reading level in client components
 * Returns the user's reading level preference
 */
export function useReadingLevel(): ReadingLevel {
  const { preferences, isLoaded } = useUserPreferencesState();
  return isLoaded ? preferences.readingLevel : 'standard';
}
