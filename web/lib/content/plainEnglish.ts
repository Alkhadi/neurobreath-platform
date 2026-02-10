import type { ContentPage, LocalisedString } from '@/lib/content/canonical-schema';
import type { Region } from '@/lib/region/region';
import { resolveString } from '@/lib/content/localise';

export interface PlainEnglishContent {
  summary: string;
  bullets: string[];
}

const resolveLocalised = (value: LocalisedString, region: Region) => resolveString(value, region);

export const resolvePlainEnglish = (page: ContentPage, region: Region): PlainEnglishContent | null => {
  if (!page.plainEnglish) return null;
  return {
    summary: resolveLocalised(page.plainEnglish.summary, region),
    bullets: page.plainEnglish.bullets.map(item => resolveLocalised(item, region)),
  };
};
