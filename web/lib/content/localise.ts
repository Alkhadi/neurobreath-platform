import type { ContentBlock, ContentPage, LocalisedString, RelatedContentItem } from './canonical-schema';
import type { Region } from '@/lib/region/region';
import { withRegionPrefix } from '@/lib/region/region';

const termMap = {
  UK: {
    primary_care: 'GP',
    pediatrician: 'paediatrician',
    counselor: 'counsellor',
  },
  US: {
    primary_care: 'primary care doctor',
    paediatrician: 'pediatrician',
    counsellor: 'counselor',
  },
};

const applyTermMap = (text: string, region: 'UK' | 'US') => {
  return text.replace(/\{term:([a-z_]+)\}/g, (_, key) => termMap[region][key] || key);
};

export const resolveString = (value: LocalisedString, region: 'UK' | 'US') => {
  const resolved = region === 'US' ? value.US || value.base : value.UK || value.base;
  return applyTermMap(resolved, region);
};

export const resolveFaqs = (faqs: ContentPage['faqs'] | undefined, region: 'UK' | 'US') => {
  if (!faqs) return undefined;
  const regionFaqs = region === 'US' ? faqs.US || faqs.base : faqs.UK || faqs.base;
  return regionFaqs.map(item => ({
    question: resolveString(item.question, region),
    answer: resolveString(item.answer, region),
  }));
};

export const resolveBlocks = (blocks: ContentBlock[], region: 'UK' | 'US') =>
  blocks.map(block => {
    switch (block.type) {
      case 'heading':
        return { ...block, text: resolveString(block.text, region) };
      case 'paragraph':
      case 'callout':
        return { ...block, text: resolveString(block.text, region) };
      case 'bullets':
      case 'steps':
        return { ...block, items: block.items.map(item => resolveString(item, region)) };
      case 'cta':
        return { ...block, cta: { ...block.cta, label: resolveString(block.cta.label, region) } };
      default:
        return block;
    }
  });

export const resolveSEO = (seo: ContentPage['seo'], region: 'UK' | 'US') => ({
  title: resolveString(seo.title, region),
  description: resolveString(seo.description, region),
});

export const resolveH1 = (h1: LocalisedString, region: 'UK' | 'US') => resolveString(h1, region);

const shouldPrefixRegion = (href: string) => {
  return href.startsWith('/guides') || href.startsWith('/trust');
};

export const resolveRelatedItems = (items: RelatedContentItem[] | undefined, region: Region) => {
  if (!items?.length) return [];
  return items.map(item => {
    const label = resolveString(item.label, region);
    const description = item.description ? resolveString(item.description, region) : undefined;
    const href = shouldPrefixRegion(item.href) ? withRegionPrefix(item.href, region) : item.href;
    return { ...item, label, description, href };
  });
};
