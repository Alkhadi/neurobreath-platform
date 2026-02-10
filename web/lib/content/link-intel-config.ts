export type LinkIntelPageType = 'pillar' | 'cluster' | 'tool' | 'trust' | 'other';

export const LINK_INTEL_CONFIG = {
  maxLinksByType: {
    pillar: 8,
    cluster: 6,
    tool: 4,
    trust: 4,
    other: 4,
  },
  minClusterSiblingLinks: 2,
  maxClusterSiblingLinks: 4,
  minPillarClusterLinks: 4,
  maxRelatedLinks: 6,
  pinnedLinks: {} as Record<string, string[]>,
  bannedLinks: {} as Record<string, string[]>,
  bannedDestinationsGlobal: ['/terms', '/privacy'],
  allowCrossLocale: false,
};
