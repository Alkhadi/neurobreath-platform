import Link from 'next/link';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import { canonicalPages } from '@/lib/content/pages';
import { GLOSSARY_TERMS } from '@/lib/glossary/glossary';
import { PRINTABLES, getPrintableTitle } from '@/lib/printables/printables';

export type RelatedTag = string;

interface RelatedResourcesProps {
  region: Region;
  audience?: string;
  tags?: RelatedTag[];
  title?: string;
  maxPerGroup?: number;
}

const unique = <T,>(items: T[]) => Array.from(new Set(items));

const pick = <T,>(items: T[], n: number) => items.slice(0, n);

const toolIndex: Record<string, Array<{ label: string; href: string }>> = {
  calm: [
    { label: 'SOS 60-second calm', href: '/techniques/sos' },
    { label: 'Breathing tools', href: '/tools/breath-tools' },
    { label: 'Stress tools', href: '/tools/stress-tools' },
  ],
  focus: [
    { label: 'Focus tiles', href: '/tools/focus-tiles' },
    { label: 'Focus training', href: '/tools/focus-training' },
    { label: 'ADHD tools', href: '/tools/adhd-tools' },
  ],
  sleep: [
    { label: 'Sleep tools', href: '/tools/sleep-tools' },
    { label: 'Wind-down routine', href: '/sleep' },
  ],
  reading: [
    { label: 'Reading training hub', href: '/dyslexia-reading-training' },
  ],
  sensory: [
    { label: 'Autism tools', href: '/tools/autism-tools' },
  ],
};

const journeyIndex = (regionKey: string) => [
  { label: 'Starter journeys', href: `/${regionKey}/journeys` },
  { label: 'Help me choose', href: `/${regionKey}/help-me-choose` },
];

export function RelatedResources({ region, title = 'Related resources', tags = [], maxPerGroup = 6 }: RelatedResourcesProps) {
  const regionKey = getRegionKey(region);

  const toolLinks = unique(
    tags.flatMap(tag => toolIndex[tag] || []).map(item => `${item.label}|||${item.href}`)
  ).map(key => {
    const [label, href] = key.split('|||');
    return { label, href };
  });

  const guideLinks = canonicalPages.map(page => ({
    label: (region === 'US' ? page.h1.US : page.h1.UK) || page.h1.base,
    href: `/${regionKey}/guides/${region === 'US' ? page.slugs.US : page.slugs.UK}`,
  }));

  const glossaryLinks = GLOSSARY_TERMS
    .slice(0, 12)
    .map(term => ({
      label: region === 'US' ? term.localeVariants.us.spelling : term.localeVariants.uk.spelling,
      href: `/${regionKey}/glossary/${term.id}`,
    }));

  const printableLinks = PRINTABLES
    .slice(0, 6)
    .map(item => ({
      label: getPrintableTitle(item, region),
      href: `/${regionKey}/printables/${item.id}`,
    }));

  const journeyLinks = journeyIndex(regionKey);

  const groups: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
    { title: 'Start here', links: journeyLinks },
    { title: 'Tools', links: toolLinks },
    { title: 'Guides', links: guideLinks },
    { title: 'Key terms', links: glossaryLinks },
    { title: 'Printables', links: printableLinks },
  ].filter(group => group.links.length > 0);

  // Keep the UI clean
  const trimmedGroups = groups.map(group => ({
    ...group,
    links: pick(group.links, maxPerGroup),
  }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {trimmedGroups.map(group => (
          <div key={group.title} className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{group.title}</div>
            <div className="flex flex-col gap-1 text-sm">
              {group.links.map(link => (
                <Link key={link.href + link.label} href={link.href} className="text-indigo-600 hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
