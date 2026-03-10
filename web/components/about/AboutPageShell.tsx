import Link from 'next/link';
import { PageShellNB } from '@/components/layout/page-primitives';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';

interface AboutPageShellProps {
  title: string;
  summary: string;
  region: Region;
  path: string;
  children: React.ReactNode;
}

export function AboutPageShell({
  title,
  summary,
  region,
  path,
  children,
}: AboutPageShellProps) {
  const regionKey = getRegionKey(region);
  const hubHref = `/${regionKey}/about`;
  const hubUrl = generateCanonicalUrl(hubHref);
  const pageUrl = generateCanonicalUrl(path);

  const breadcrumbItems =
    hubHref === path
      ? [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'About',
            item: hubUrl,
          },
        ]
      : [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'About',
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
            <span>About</span>
          ) : (
            <>
              <Link
                href={hubHref}
                className="hover:text-[color:var(--nb-text-heading)] transition-colors"
              >
                About
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
