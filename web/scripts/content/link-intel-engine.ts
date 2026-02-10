import { buildRouteRegistry, type RouteRegistryEntry } from './route-registry';
import { LINK_INTEL_CONFIG, type LinkIntelPageType } from '../../lib/content/link-intel-config';

const STOPWORDS = new Set([
  'the', 'a', 'and', 'or', 'to', 'for', 'of', 'in', 'on', 'with', 'by', 'is', 'are', 'this', 'that', 'your', 'you',
  'guide', 'tools', 'tool', 'support', 'help', 'hub', 'page', 'how', 'do', 'use', 'what', 'why', 'when',
]);

const tokenise = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token));

const buildVector = (entry: RouteRegistryEntry) => {
  const weights: Record<string, number> = {};
  const addTokens = (tokens: string[], weight: number) => {
    tokens.forEach(token => {
      weights[token] = (weights[token] || 0) + weight;
    });
  };
  addTokens(tokenise(entry.title), 3);
  addTokens(tokenise(entry.h1), 2.5);
  addTokens(tokenise(entry.description), 2);
  addTokens(tokenise(entry.summary || ''), 1.5);
  addTokens(entry.tags || [], 2);
  return weights;
};

const cosineSimilarity = (a: Record<string, number>, b: Record<string, number>) => {
  const aKeys = Object.keys(a);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  aKeys.forEach(key => {
    const aVal = a[key];
    magA += aVal * aVal;
    if (b[key]) {
      dot += aVal * b[key];
    }
  });
  Object.values(b).forEach(val => {
    magB += val * val;
  });
  if (!magA || !magB) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const localeCompatible = (source: RouteRegistryEntry, candidate: RouteRegistryEntry) => {
  if (source.locale === 'GLOBAL') return true;
  if (candidate.locale === 'GLOBAL') return true;
  return source.locale === candidate.locale;
};

const normaliseUrl = (url: string) => (url.length > 1 ? url.replace(/\/$/, '') : url);

export const scoreCandidate = (source: RouteRegistryEntry, candidate: RouteRegistryEntry) => {
  const similarity = cosineSimilarity(buildVector(source), buildVector(candidate));
  const samePillar = source.primaryPillar && candidate.primaryPillar && source.primaryPillar === candidate.primaryPillar;
  const bonus = samePillar ? 0.2 : 0;
  const penalty = source.url === candidate.url ? 1 : 0;
  return Math.max(0, similarity + bonus - penalty);
};

const selectTop = (items: Array<{ entry: RouteRegistryEntry; score: number; reason: string }>, count: number) => {
  return items
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item);
};

export const buildRecommendations = (page: RouteRegistryEntry, registry: RouteRegistryEntry[]) => {
  const candidates = registry.filter(entry => entry.url !== page.url && localeCompatible(page, entry));
  const banned = new Set([
    ...(LINK_INTEL_CONFIG.bannedDestinationsGlobal || []),
    ...(LINK_INTEL_CONFIG.bannedLinks[page.url] || []),
  ].map(normaliseUrl));

  const scored = candidates
    .filter(entry => !banned.has(normaliseUrl(entry.url)))
    .map(entry => ({ entry, score: scoreCandidate(page, entry), reason: 'semantic match' }));

  const recommendations: Array<{ entry: RouteRegistryEntry; reason: string; score: number }> = [];
  const blocked: Array<{ entry: RouteRegistryEntry; reason: string }> = [];

  const addUnique = (item: { entry: RouteRegistryEntry; reason: string; score: number }) => {
    if (recommendations.some(rec => rec.entry.url === item.entry.url)) return;
    recommendations.push(item);
  };

  if (page.type === 'cluster') {
    const parent = scored.find(item => item.entry.type === 'pillar' && item.entry.primaryPillar === page.primaryPillar);
    if (parent) {
      addUnique({ ...parent, reason: 'parent pillar' });
    }

    const siblings = selectTop(
      scored.filter(item =>
        item.entry.type === 'cluster' &&
        item.entry.primaryPillar === page.primaryPillar &&
        item.entry.url !== page.url,
      ),
      LINK_INTEL_CONFIG.maxClusterSiblingLinks,
    );
    siblings.forEach(item => addUnique({ ...item, reason: 'sibling cluster' }));

    const crossPillar = selectTop(
      scored.filter(item => item.entry.type === 'cluster' && item.entry.primaryPillar !== page.primaryPillar),
      2,
    );
    crossPillar.forEach(item => addUnique({ ...item, reason: 'cross-pillar related' }));

    const toolCta = selectTop(scored.filter(item => item.entry.type === 'tool'), 1);
    toolCta.forEach(item => addUnique({ ...item, reason: 'tool CTA' }));
  }

  if (page.type === 'pillar') {
    const clusterLinks = selectTop(
      scored.filter(item => item.entry.type === 'cluster' && item.entry.primaryPillar === page.primaryPillar),
      LINK_INTEL_CONFIG.maxLinksByType.pillar,
    );
    clusterLinks.forEach(item => addUnique({ ...item, reason: 'pillar cluster' }));

    const crossPillar = selectTop(
      scored.filter(item => item.entry.type === 'pillar' && item.entry.primaryPillar !== page.primaryPillar),
      2,
    );
    crossPillar.forEach(item => addUnique({ ...item, reason: 'cross-pillar hub' }));

    const toolCta = selectTop(scored.filter(item => item.entry.type === 'tool'), 2);
    toolCta.forEach(item => addUnique({ ...item, reason: 'tool CTA' }));
  }

  if (page.type === 'tool') {
    const guideLinks = selectTop(scored.filter(item => item.entry.type === 'cluster'), 2);
    guideLinks.forEach(item => addUnique({ ...item, reason: 'explainer guide' }));

    const pillarLinks = selectTop(scored.filter(item => item.entry.type === 'pillar'), 1);
    pillarLinks.forEach(item => addUnique({ ...item, reason: 'pillar hub' }));

    const toolAlt = selectTop(scored.filter(item => item.entry.type === 'tool'), 1);
    toolAlt.forEach(item => addUnique({ ...item, reason: 'related tool' }));
  }

  if (page.type === 'trust') {
    const trustLinks = selectTop(scored.filter(item => item.entry.type === 'trust'), 3);
    trustLinks.forEach(item => addUnique({ ...item, reason: 'related trust' }));
  }

  const maxLinks = LINK_INTEL_CONFIG.maxLinksByType[page.type as LinkIntelPageType] || LINK_INTEL_CONFIG.maxRelatedLinks;
  const trimmed = recommendations.slice(0, Math.min(maxLinks, LINK_INTEL_CONFIG.maxRelatedLinks));

  scored
    .filter(item => !trimmed.some(rec => rec.entry.url === item.entry.url))
    .slice(0, 5)
    .forEach(item => blocked.push({ entry: item.entry, reason: 'lower priority or cap reached' }));

  return { recommendations: trimmed, blocked };
};

export const buildLinkIntelReport = () => {
  const registry = buildRouteRegistry();
  const registryMap = new Map(registry.map(entry => [entry.url, entry]));
  const pages = registry.map(page => {
    const { recommendations, blocked } = buildRecommendations(page, registry);
    return {
      url: page.url,
      type: page.type,
      locale: page.locale,
      recommendations: recommendations.map(rec => ({
        url: rec.entry.url,
        label: rec.entry.title,
        description: rec.entry.description,
        typeBadge: rec.entry.type,
        score: Number(rec.score.toFixed(3)),
        reason: rec.reason,
      })),
      blocked: blocked.map(item => ({
        url: item.entry.url,
        reason: item.reason,
      })),
    };
  });

  const orphanCandidates = pages.filter(page => page.recommendations.length === 0).map(page => page.url);
  const weakCandidates = pages.filter(page => page.recommendations.length > 0 && page.recommendations.length < 3).map(page => page.url);
  const overlinkedCandidates = pages.filter(page => page.recommendations.length >= LINK_INTEL_CONFIG.maxRelatedLinks).map(page => page.url);

  const pillarOpportunities: Record<string, string[]> = {};
  pages.forEach(page => {
    const entry = registryMap.get(page.url);
    if (!entry?.primaryPillar) return;
    pillarOpportunities[entry.primaryPillar] = pillarOpportunities[entry.primaryPillar] || [];
    if (page.recommendations.length < 3) {
      pillarOpportunities[entry.primaryPillar].push(page.url);
    }
  });

  return {
    runAt: new Date().toISOString(),
    summary: {
      pages: pages.length,
      orphans: orphanCandidates.length,
      orphanPages: orphanCandidates,
      weakPages: weakCandidates,
      overlinkedPages: overlinkedCandidates,
      opportunitiesByPillar: pillarOpportunities,
    },
    pages,
  };
};
