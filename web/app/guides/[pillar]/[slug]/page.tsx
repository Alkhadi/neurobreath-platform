import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { FaqSection } from '@/components/seo/FAQSection';
import { getCluster, getPillar, listClusterParams } from '@/lib/content/content-seo-map';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { getRelatedContentForUrl } from '@/lib/content/link-intel-runtime';

export async function generateStaticParams() {
  return listClusterParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const cluster = getCluster(resolvedParams.pillar, resolvedParams.slug);
  if (!cluster) return {};
  return generatePageMetadata({
    title: `${cluster.title} | NeuroBreath`,
    description: cluster.description,
    path: `/guides/${resolvedParams.pillar}/${resolvedParams.slug}`,
  });
}

export default async function ClusterPage({
  params,
}: {
  params: Promise<{ pillar: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const pillar = getPillar(resolvedParams.pillar);
  const cluster = getCluster(resolvedParams.pillar, resolvedParams.slug);

  if (!pillar || !cluster) return notFound();

  const pageUrl = generateCanonicalUrl(`/guides/${pillar.key}/${cluster.slug}`);

  const siblingItems = cluster.siblingSlugs
    .map(slug => getCluster(pillar.key, slug))
    .filter(Boolean)
    .slice(0, 4)
    .map(sibling => ({
      href: `/guides/${pillar.key}/${sibling!.slug}`,
      label: sibling!.title,
      description: sibling!.description,
      typeBadge: 'Guide' as const,
    }));

  const pillarItem = {
    href: `/guides/${pillar.key}`,
    label: pillar.title,
    description: 'Return to the pillar hub and choose the next guide.',
    typeBadge: 'Guide' as const,
  };

  const relatedItems = getRelatedContentForUrl({
    url: `/guides/${pillar.key}/${cluster.slug}`,
    existing: [pillarItem, ...siblingItems],
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <nav className="text-sm text-neutral-600">
        <Link href="/" className="hover:underline">Home</Link> <span aria-hidden="true">›</span>{' '}
        <Link href="/guides" className="hover:underline">Guides</Link> <span aria-hidden="true">›</span>{' '}
        <Link href={`/guides/${pillar.key}`} className="hover:underline">{pillar.title}</Link>{' '}
        <span aria-hidden="true">›</span> <span className="text-neutral-800">{cluster.title}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold text-neutral-900">{cluster.h1}</h1>
      <div className="mt-4 space-y-3 text-neutral-700">
        {cluster.intro.map(text => (
          <p key={text}>{text}</p>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-neutral-900">Try this now</div>
        <p className="mt-2 text-sm text-neutral-700">
          If you want to act immediately, use the tool first. Then return here to build a routine.
        </p>
        <Link
          href={cluster.tryNow.href}
          className="mt-4 inline-flex rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          {cluster.tryNow.label}
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900">Practical steps</h2>
        <div className="mt-4 space-y-6">
          {cluster.sections.map(section => (
            <div key={section.heading} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-neutral-900">{section.heading}</h3>
              <div className="mt-2 space-y-2 text-sm leading-relaxed text-neutral-700">
                {section.body.map(line => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <RelatedContent title="Next steps" items={relatedItems} />

      {cluster.miniFaqs?.length ? (
        <FaqSection pageUrl={pageUrl} faqs={cluster.miniFaqs} title="Quick FAQs" />
      ) : null}

      <p className="mt-10 text-xs text-neutral-600">
        Educational information only. If you are in immediate danger or feel unable to keep yourself safe, call 999.
        For urgent medical advice in the UK, contact NHS 111.
      </p>
    </main>
  );
}