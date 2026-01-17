import type { GlossaryTerm } from './glossary';
import { GLOSSARY_TERMS } from './glossary';
import type { Region } from '@/lib/region/region';

export interface GlossaryMatchSegment {
  type: 'text' | 'term';
  value: string;
  termId?: string;
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getLocaleTerms = (region: Region) => {
  return GLOSSARY_TERMS.flatMap(term => {
    const spelling = region === 'US' ? term.localeVariants.us.spelling : term.localeVariants.uk.spelling;
    const values = new Set([term.term, spelling]);
    return Array.from(values).map(value => ({ id: term.id, value }));
  }).filter(entry => entry.value);
};

const buildMatches = (text: string, region: Region) => {
  const terms = getLocaleTerms(region).sort((a, b) => b.value.length - a.value.length);
  const matches: Array<{ start: number; end: number; termId: string; value: string }> = [];

  terms.forEach(term => {
    const regex = new RegExp(`\\b${escapeRegex(term.value)}\\b`, 'gi');
    for (const match of text.matchAll(regex)) {
      const start = match.index ?? -1;
      const end = start + match[0].length;
      if (start < 0) continue;
      const overlaps = matches.some(existing => !(end <= existing.start || start >= existing.end));
      if (overlaps) continue;
      matches.push({ start, end, termId: term.id, value: match[0] });
    }
  });

  return matches.sort((a, b) => a.start - b.start);
};

export const splitTextWithGlossary = (text: string, region: Region, maxMatches = 5): GlossaryMatchSegment[] => {
  const matches = buildMatches(text, region).slice(0, maxMatches);
  if (!matches.length) return [{ type: 'text', value: text }];

  const segments: GlossaryMatchSegment[] = [];
  let cursor = 0;

  matches.forEach(match => {
    if (match.start > cursor) {
      segments.push({ type: 'text', value: text.slice(cursor, match.start) });
    }
    segments.push({ type: 'term', value: match.value, termId: match.termId });
    cursor = match.end;
  });

  if (cursor < text.length) {
    segments.push({ type: 'text', value: text.slice(cursor) });
  }

  return segments;
};

export const resolveGlossaryTerm = (termId: string): GlossaryTerm | undefined => {
  return GLOSSARY_TERMS.find(term => term.id === termId);
};
