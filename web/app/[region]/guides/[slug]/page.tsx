import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { FaqSection } from '@/components/seo/FAQSection';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { Citations } from '@/components/evidence/Citations';
import { LastReviewed } from '@/components/evidence/LastReviewed';
import { canonicalPagesBySlug } from '@/lib/content/pages';
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
  const citations = getCitationsForRegion(page, region);
  const pageUrl = generateCanonicalUrl(`/${getRegionKey(region)}/guides/${resolvedParams.slug}`);
  const relatedItems = getRelatedContentForUrl({
    url: `/${getRegionKey(region)}/guides/${resolvedParams.slug}`,
    existing: resolveRelatedItems(page.related, region),
  });

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

        <LastReviewed reviewedAt={page.reviewedAt} reviewIntervalDays={page.reviewIntervalDays} />
        <ContentRenderer blocks={resolvedBlocks} />

        <RelatedContent title={page.relatedTitle ? resolveH1(page.relatedTitle, region) : 'Related content'} items={relatedItems} />

        <FaqSection title="Quick FAQs" faqs={resolvedFaqs} pageUrl={pageUrl} />

        <Citations sources={citations} />
      </div>
    </main>
  );
}
