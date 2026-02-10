import Link from 'next/link';
import { LastReviewed } from '@/components/evidence/LastReviewed';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';

interface TrustPageShellProps {
  title: string;
  summary: string;
  lastReviewed: string;
  reviewIntervalDays?: number;
  region?: Region;
  path: string;
  children: React.ReactNode;
}

export function TrustPageShell({
  title,
  summary,
  lastReviewed,
  reviewIntervalDays = 180,
  region,
  path,
  children,
}: TrustPageShellProps) {
  const hubHref = region ? `/${getRegionKey(region)}/trust` : '/trust';
  const hubUrl = generateCanonicalUrl(hubHref);
  const pageUrl = generateCanonicalUrl(path);
  const breadcrumbItems = hubHref === path
    ? [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trust Centre',
          item: hubUrl,
        },
      ]
    : [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trust Centre',
          item: hubUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: title,
          item: pageUrl,
        },
      ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: summary,
    url: pageUrl,
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <div className="text-sm text-slate-500">
          {hubHref === path ? (
            'Trust Centre'
          ) : (
            <>
              <Link href={hubHref} className="hover:text-slate-700">Trust Centre</Link> / {title}
            </>
          )}
        </div>
        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{title}</h1>
          <p className="text-base text-slate-600 max-w-3xl">{summary}</p>
        </header>
        <LastReviewed reviewedAt={lastReviewed} reviewIntervalDays={reviewIntervalDays} />
        <section className="space-y-6">{children}</section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
