import type { RelatedContentItem } from '@/components/seo/RelatedContent';
import { LINK_INTEL_OVERRIDES } from '@/lib/content/link-intel-overrides';
import { LINK_INTEL_CONFIG } from '@/lib/content/link-intel-config';

const normaliseUrl = (url: string) => (url.length > 1 ? url.replace(/\/$/, '') : url);

const mergeUnique = (base: RelatedContentItem[], extra: RelatedContentItem[]) => {
  const seen = new Set(base.map(item => normaliseUrl(item.href)));
  const merged = [...base];
  extra.forEach(item => {
    const key = normaliseUrl(item.href);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  });
  return merged;
};

export const getRelatedContentForUrl = (params: {
  url: string;
  existing?: RelatedContentItem[];
}): RelatedContentItem[] => {
  const urlKey = normaliseUrl(params.url);
  const existing = params.existing ?? [];
  const overrides = LINK_INTEL_OVERRIDES[urlKey] ?? [];
  const banned = new Set([...(LINK_INTEL_CONFIG.bannedDestinationsGlobal || []), ...(LINK_INTEL_CONFIG.bannedLinks[urlKey] || [])]);
  const merged = mergeUnique(existing, overrides).filter(item => !banned.has(normaliseUrl(item.href)));
  return merged.slice(0, LINK_INTEL_CONFIG.maxRelatedLinks);
};
