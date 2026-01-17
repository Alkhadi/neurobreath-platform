import Link from 'next/link';
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

export function AboutPageShell({ title, summary, region, path, children }: AboutPageShellProps) {
  const regionKey = getRegionKey(region);
  const hubHref = `/${regionKey}/about`;
  const hubUrl = generateCanonicalUrl(hubHref);
  const pageUrl = generateCanonicalUrl(path);

  const breadcrumbItems = hubHref === path
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <div className="text-sm text-slate-500">
          {hubHref === path ? (
            'About'
          ) : (
            <>
              <Link href={hubHref} className="hover:text-slate-700">About</Link> / {title}
            </>
          )}
        </div>
        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{title}</h1>
          <p className="text-base text-slate-600 max-w-3xl">{summary}</p>
        </header>
        <section className="space-y-6">{children}</section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
