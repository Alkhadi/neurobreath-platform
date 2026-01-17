import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GlossaryTermView } from '@/components/glossary/GlossaryTermView';
import { GLOSSARY_TERM_MAP, GLOSSARY_TERMS } from '@/lib/glossary/glossary';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getGuideById } from '@/lib/guides/guides';
import { getJourneyById } from '@/lib/journeys/journeys';
import { getToolById } from '@/lib/tools/tools';

interface GlossaryTermPageProps {
  params: Promise<{ region: string; term: string }>;
}

export function generateStaticParams() {
  return GLOSSARY_TERMS.flatMap(term => [
    { region: 'uk', term: term.id },
    { region: 'us', term: term.id },
  ]);
}

export async function generateMetadata({ params }: GlossaryTermPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const term = GLOSSARY_TERM_MAP.get(resolved.term);
  if (!term) return {};

  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/glossary/${term.id}`;
  const alternates = getRegionAlternates(`/glossary/${term.id}`);

  const baseMetadata = generatePageMetadata({
    title: `${term.term} — Glossary`,
    description: term.plainEnglishDefinition,
    path,
  });

  return {
    ...baseMetadata,
    alternates: {
      canonical: generateCanonicalUrl(path),
      languages: {
        'en-GB': generateCanonicalUrl(alternates['en-GB']),
        'en-US': generateCanonicalUrl(alternates['en-US']),
      },
    },
  };
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const term = GLOSSARY_TERM_MAP.get(resolved.term);

  if (!term) return notFound();

  const localeSpelling = region === 'US' ? term.localeVariants.us.spelling : term.localeVariants.uk.spelling;

  const relatedTerms = term.relatedTerms
    .map(id => GLOSSARY_TERM_MAP.get(id))
    .filter(Boolean)
    .map(related => ({
      id: related!.id,
      label: region === 'US' ? related!.localeVariants.us.spelling : related!.localeVariants.uk.spelling,
      href: `/${regionKey}/glossary/${related!.id}`,
    }));

  const journey = getJourneyById(term.recommendedNextLinks.journey);
  const guides = term.recommendedNextLinks.guides
    .map(guideId => getGuideById(guideId))
    .filter(Boolean)
    .map(guide => ({
      id: guide!.id,
      label: guide!.title,
      href: guide!.hrefs[region],
    }));
  const tool = term.recommendedNextLinks.tool ? getToolById(term.recommendedNextLinks.tool) : undefined;

  const nextLinks = {
    journey: journey
      ? {
          id: journey.id,
          label: journey.title,
          href: journey.hrefs[region],
        }
      : undefined,
    guides,
    tool: tool
      ? {
          id: tool.id,
          label: tool.title,
          href: tool.href,
        }
      : undefined,
  };

  const canonicalTermUrl = generateCanonicalUrl(`/${regionKey}/glossary/${term.id}`);
  const canonicalGlossaryUrl = generateCanonicalUrl(`/${regionKey}/glossary`);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Glossary',
        item: canonicalGlossaryUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: localeSpelling,
        item: canonicalTermUrl,
      },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: localeSpelling,
    description: term.plainEnglishDefinition,
    url: canonicalTermUrl,
  };

  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: localeSpelling,
    description: term.plainEnglishDefinition,
    inDefinedTermSet: canonicalGlossaryUrl,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <GlossaryTermView term={term} region={region} relatedTerms={relatedTerms} nextLinks={nextLinks} />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }} />
    </main>
  );
}
