import Link from 'next/link';
import { LastReviewed } from '@/components/evidence/LastReviewed';
import { PageShellNB } from '@/components/layout/page-primitives';
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

  const breadcrumbItems =
    hubHref === path
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
    <PageShellNB tone="soft">
      <div className="page-content-nb space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-[color:var(--nb-text-secondary)]">
          {hubHref === path ? (
            <span>Trust Centre</span>
          ) : (
            <>
              <Link
                href={hubHref}
                className="hover:text-[color:var(--nb-text-heading)] transition-colors"
              >
                Trust Centre
              </Link>
              <span aria-hidden="true"> / </span>
              <span>{title}</span>
            </>
          )}
        </nav>

        {/* Page intro */}
        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[color:var(--nb-text-heading)] dark:text-white">
            {title}
          </h1>
          <p className="text-base text-[color:var(--nb-text-body)] dark:text-white/75 max-w-3xl">
            {summary}
          </p>
        </header>

        <LastReviewed
          reviewedAt={lastReviewed}
          reviewIntervalDays={reviewIntervalDays}
        />

        <section className="space-y-6">{children}</section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </PageShellNB>
  );
}
