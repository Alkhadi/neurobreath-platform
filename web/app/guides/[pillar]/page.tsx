import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { FaqSection } from '@/components/seo/FAQSection';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { getPillar, listPillarKeys } from '@/lib/content/content-seo-map';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { getRelatedContentForUrl } from '@/lib/content/link-intel-runtime';

export async function generateStaticParams() {
  return listPillarKeys().map(pillar => ({ pillar }));
}

export async function generateMetadata({ params }: { params: { pillar: string } }): Promise<Metadata> {
  const pillar = getPillar(params.pillar);
  if (!pillar) return {};
  return generatePageMetadata({
    title: `${pillar.title} | NeuroBreath`,
    description: pillar.description,
    path: `/guides/${pillar.key}`,
  });
}

export default function PillarPage({ params }: { params: { pillar: string } }) {
  const pillar = getPillar(params.pillar);
  if (!pillar) return notFound();

  const pageUrl = generateCanonicalUrl(`/guides/${pillar.key}`);

  const guideItems = pillar.clusters.map(cluster => ({
    href: `/guides/${pillar.key}/${cluster.slug}`,
    label: cluster.title,
    description: cluster.description,
    typeBadge: 'Guide' as const,
  }));

  const relatedItems = getRelatedContentForUrl({
    url: `/guides/${pillar.key}`,
    existing: guideItems,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav className="text-sm text-neutral-600">
        <Link href="/" className="hover:underline">Home</Link> <span aria-hidden="true">›</span>{' '}
        <Link href="/guides" className="hover:underline">Guides</Link> <span aria-hidden="true">›</span>{' '}
        <span className="text-neutral-800">{pillar.title}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold text-neutral-900">{pillar.h1}</h1>
      <div className="mt-4 space-y-3 text-neutral-700">
        {pillar.intro.map(text => (
          <p key={text}>{text}</p>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-neutral-900">Start here</div>
        <p className="mt-2 text-sm text-neutral-700">
          If you want a practical next step, use the tool first—then come back to the guides for structure.
        </p>
        <Link
          href={pillar.startHere.href}
          className="mt-4 inline-flex rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          {pillar.startHere.label}
        </Link>
      </div>

      <RelatedContent title="Explore supporting guides" items={relatedItems} />

      <RelatedContent title="Related across the site" items={pillar.relatedAcrossSite} />

      <FaqSection pageUrl={pageUrl} faqs={pillar.faqs} />
    </main>
  );
}