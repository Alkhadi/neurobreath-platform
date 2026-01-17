import fs from 'fs';
import path from 'path';
import { canonicalPages } from '../../lib/content/pages';
import { resolveH1, resolveSEO } from '../../lib/content/localise';
import { PILLARS } from '../../lib/content/content-seo-map';
import { SEO_GUIDES } from '../../content/seo-guides';

export type RegistryLocale = 'UK' | 'US' | 'GLOBAL';
export type RegistryType = 'pillar' | 'cluster' | 'tool' | 'trust' | 'other';

export interface RouteRegistryEntry {
  url: string;
  type: RegistryType;
  locale: RegistryLocale;
  title: string;
  description: string;
  h1: string;
  tags: string[];
  primaryPillar?: string;
  summary?: string;
}

const toTitle = (slug: string) =>
  slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const listSubdirsWithPage = (dir: string) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .filter(entry => fs.existsSync(path.join(dir, entry.name, 'page.tsx')))
    .map(entry => entry.name);
};

export const buildRouteRegistry = (): RouteRegistryEntry[] => {
  const entries: RouteRegistryEntry[] = [];
  const rootDir = path.resolve(__dirname, '../..');
  const appDir = path.join(rootDir, 'app');

  canonicalPages.forEach(page => {
    const ukSeo = resolveSEO(page.seo, 'UK');
    const usSeo = resolveSEO(page.seo, 'US');
    entries.push({
      url: `/uk/guides/${page.slugs.UK}`,
      type: page.pageType || 'cluster',
      locale: 'UK',
      title: ukSeo.title,
      description: ukSeo.description,
      h1: resolveH1(page.h1, 'UK'),
      tags: page.tags || [],
      primaryPillar: page.primaryPillar,
      summary: page.summary,
    });
    entries.push({
      url: `/us/guides/${page.slugs.US}`,
      type: page.pageType || 'cluster',
      locale: 'US',
      title: usSeo.title,
      description: usSeo.description,
      h1: resolveH1(page.h1, 'US'),
      tags: page.tags || [],
      primaryPillar: page.primaryPillar,
      summary: page.summary,
    });
  });

  PILLARS.forEach(pillar => {
    entries.push({
      url: `/guides/${pillar.key}`,
      type: 'pillar',
      locale: 'GLOBAL',
      title: pillar.title,
      description: pillar.description,
      h1: pillar.h1,
      tags: [pillar.key, ...pillar.title.toLowerCase().split(' ')],
      primaryPillar: pillar.key,
      summary: pillar.description,
    });

    pillar.clusters.forEach(cluster => {
      entries.push({
        url: `/guides/${pillar.key}/${cluster.slug}`,
        type: 'cluster',
        locale: 'GLOBAL',
        title: cluster.title,
        description: cluster.description,
        h1: cluster.h1,
        tags: [pillar.key, ...cluster.title.toLowerCase().split(' ')],
        primaryPillar: pillar.key,
        summary: cluster.description,
      });
    });
  });

  SEO_GUIDES.forEach(guide => {
    const pillarKey = guide.pillar.href.replace('/', '') || 'general';
    entries.push({
      url: `/guides/${guide.slug}`,
      type: 'cluster',
      locale: 'GLOBAL',
      title: guide.title,
      description: guide.description,
      h1: guide.title,
      tags: [pillarKey, ...guide.title.toLowerCase().split(' ')],
      primaryPillar: pillarKey,
      summary: guide.intro,
    });
  });

  const toolSlugs = listSubdirsWithPage(path.join(appDir, 'tools'));
  toolSlugs.forEach(slug => {
    entries.push({
      url: `/tools/${slug}`,
      type: 'tool',
      locale: 'GLOBAL',
      title: toTitle(slug),
      description: `Tool page for ${toTitle(slug)}.`,
      h1: toTitle(slug),
      tags: [slug.replace(/-/g, ' ')],
      summary: `Interactive tool: ${toTitle(slug)}.`,
    });
  });

  if (fs.existsSync(path.join(appDir, 'trust', 'page.tsx'))) {
    entries.push({
      url: '/trust',
      type: 'trust',
      locale: 'GLOBAL',
      title: 'Trust',
      description: 'Trust and safety information.',
      h1: 'Trust',
      tags: ['trust', 'policy'],
      summary: 'Trust and safety policies and guidance.',
    });
  }

  listSubdirsWithPage(path.join(appDir, 'trust')).forEach(slug => {
    entries.push({
      url: `/trust/${slug}`,
      type: 'trust',
      locale: 'GLOBAL',
      title: toTitle(slug),
      description: `${toTitle(slug)} trust information.`,
      h1: toTitle(slug),
      tags: ['trust', slug.replace(/-/g, ' ')],
      summary: `${toTitle(slug)} policy details.`,
    });
  });

  if (fs.existsSync(path.join(appDir, '[region]', 'trust', 'page.tsx'))) {
    entries.push({
      url: '/uk/trust',
      type: 'trust',
      locale: 'UK',
      title: 'Trust',
      description: 'Trust and safety information.',
      h1: 'Trust',
      tags: ['trust', 'policy'],
      summary: 'Trust and safety policies and guidance.',
    });
    entries.push({
      url: '/us/trust',
      type: 'trust',
      locale: 'US',
      title: 'Trust',
      description: 'Trust and safety information.',
      h1: 'Trust',
      tags: ['trust', 'policy'],
      summary: 'Trust and safety policies and guidance.',
    });
  }

  listSubdirsWithPage(path.join(appDir, '[region]', 'trust')).forEach(slug => {
    entries.push({
      url: `/uk/trust/${slug}`,
      type: 'trust',
      locale: 'UK',
      title: toTitle(slug),
      description: `${toTitle(slug)} trust information.`,
      h1: toTitle(slug),
      tags: ['trust', slug.replace(/-/g, ' ')],
      summary: `${toTitle(slug)} policy details.`,
    });
    entries.push({
      url: `/us/trust/${slug}`,
      type: 'trust',
      locale: 'US',
      title: toTitle(slug),
      description: `${toTitle(slug)} trust information.`,
      h1: toTitle(slug),
      tags: ['trust', slug.replace(/-/g, ' ')],
      summary: `${toTitle(slug)} policy details.`,
    });
  });

  return entries;
};
