import { breathingStressPage } from './breathing-stress';
import { focusStartPage } from './focus-start';
import type { ContentPage } from '@/lib/content/canonical-schema';

export const canonicalPages: ContentPage[] = [breathingStressPage, focusStartPage];

export const canonicalPagesBySlug = canonicalPages.reduce<Record<string, ContentPage>>((acc, page) => {
  acc[page.slugs.UK] = page;
  acc[page.slugs.US] = page;
  return acc;
}, {});
