import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { PlainEnglishToggle } from '@/components/content/PlainEnglishToggle';
import { FaqSection } from '@/components/seo/FAQSection';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { Citations } from '@/components/evidence/Citations';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { GLOSSARY_TERM_MAP } from '@/lib/glossary/glossary';
import { canonicalPagesBySlug } from '@/lib/content/pages';
import { resolvePlainEnglish } from '@/lib/content/plainEnglish';
import { resolveBlocks, resolveFaqs, resolveH1, resolveRelatedItems, resolveSEO } from '@/lib/content/localise';
import { getRelatedContentForUrl } from '@/lib/content/link-intel-runtime';
import { getCitationsForRegion } from '@/lib/evidence/getCitationsForRegion';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionGuidePageProps {
  params: Promise<{ region: string; slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(canonicalPagesBySlug).map(slug => ({
    region: 'uk',
    slug,
  })).concat(Object.keys(canonicalPagesBySlug).map(slug => ({
    region: 'us',
    slug,
  })));
}

export async function generateMetadata({ params }: RegionGuidePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const region = getRegionFromKey(resolvedParams.region);
  const page = canonicalPagesBySlug[resolvedParams.slug];

  if (!page) return {};

  const seo = resolveSEO(page.seo, region);
  const canonicalPath = `/${getRegionKey(region)}/guides/${resolvedParams.slug}`;
  const alternates = getRegionAlternates(`/guides/${resolvedParams.slug}`);

  const baseMetadata = generatePageMetadata({
    title: seo.title,
    description: seo.description,
    path: canonicalPath,
  });

  return {
    ...baseMetadata,
    alternates: {
      canonical: generateCanonicalUrl(canonicalPath),
      languages: {
        'en-GB': generateCanonicalUrl(alternates['en-GB']),
        'en-US': generateCanonicalUrl(alternates['en-US']),
      },
    },
  };
}

export default async function RegionGuidePage({ params }: RegionGuidePageProps) {
  const resolvedParams = await params;
  const region = getRegionFromKey(resolvedParams.region);
  const page = canonicalPagesBySlug[resolvedParams.slug];

  if (!page) {
    notFound();
  }

  const resolvedBlocks = resolveBlocks(page.blocks, region);
  const resolvedFaqs = resolveFaqs(page.faqs, region) || [];
  const h1 = resolveH1(page.h1, region);
  const plainEnglish = resolvePlainEnglish(page, region);
  const citations = getCitationsForRegion(page, region);
  const pageUrl = generateCanonicalUrl(`/${getRegionKey(region)}/guides/${resolvedParams.slug}`);
  const relatedItems = getRelatedContentForUrl({
    url: `/${getRegionKey(region)}/guides/${resolvedParams.slug}`,
    existing: resolveRelatedItems(page.related, region),
  });
  const editorial = page.editorial;

  const keyTerms = (page.keyTerms || [])
    .map(termId => GLOSSARY_TERM_MAP.get(termId))
    .filter(Boolean)
    .map(term => ({
      id: term!.id,
      label: region === 'US' ? term!.localeVariants.us.spelling : term!.localeVariants.uk.spelling,
      href: `/${getRegionKey(region)}/glossary/${term!.id}`,
    }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <div className="text-sm text-slate-500">
          <Link href={`/${getRegionKey(region)}/guides`} className="hover:text-slate-700">Guides</Link> / {h1}
        </div>

        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{h1}</h1>
          <p className="text-base text-slate-600 max-w-3xl">{resolveSEO(page.seo, region).description}</p>
        </header>

        {plainEnglish && <PlainEnglishToggle summary={plainEnglish.summary} bullets={plainEnglish.bullets} />}
        <ContentRenderer
          blocks={resolvedBlocks}
          region={region}
          enableGlossaryTooltips={page.enableGlossaryTooltips}
        />

        {keyTerms.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Key terms</h2>
            <p className="text-sm text-slate-600">Explore related glossary terms for quick definitions.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {keyTerms.map(term => (
                <Link
                  key={term.id}
                  href={term.href}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-indigo-300"
                >
                  {term.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        <RelatedContent title={page.relatedTitle ? resolveH1(page.relatedTitle, region) : 'Related content'} items={relatedItems} />

        <FaqSection title="Quick FAQs" faqs={resolvedFaqs} pageUrl={pageUrl} />

        <Citations sources={citations} />

        <CredibilityFooter editorial={editorial} region={region} />
      </div>
    </main>
  );
}
