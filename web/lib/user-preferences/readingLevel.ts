import { ReadingLevel } from './schema';

/**
 * Get the current user's reading level preference
 * In client components, use useUserPreferencesState().preferences.readingLevel instead
 * This helper is for server-side or static content generation
 */
export function getReadingLevel(): ReadingLevel {
  // Default to 'standard' for server-side rendering
  // Client components should use the hook for real-time user preference
  return 'standard';
}

/**
 * Filter content blocks by reading level
 * Returns true if the block should be shown for the given reading level
 */
export function shouldShowForReadingLevel(
  blockLevel: ReadingLevel,
  userLevel: ReadingLevel
): boolean {
  return blockLevel === userLevel;
}

/**
 * Get all content variants and pick the appropriate one
 */
export function selectReadingLevelContent<T>(
  variants: {
    simple?: T;
    standard?: T;
    detailed?: T;
  },
  userLevel: ReadingLevel
): T | undefined {
  return variants[userLevel];
}

/**
 * Get CSS class for reading level display
 * Use with global CSS rules for conditional display
 */
export function getReadingLevelClassName(level: ReadingLevel): string {
  return `reading-${level}`;
}
