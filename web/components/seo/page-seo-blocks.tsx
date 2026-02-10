'use client';

import { usePathname } from 'next/navigation';
import { CONTENT_SEO_PAGE_BLOCKS } from '@/lib/seo/content-seo';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { FaqSection } from '@/components/seo/FAQSection';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';

export function PageSeoBlocks() {
  const pathname = usePathname();
  const config = CONTENT_SEO_PAGE_BLOCKS[pathname || '/'];
  const pageUrl = generateCanonicalUrl(pathname || '/');

  if (!config) return null;

  return (
    <section className="border-t border-gray-200/70 dark:border-gray-800/70 bg-background">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1200px] py-10 space-y-10">
        {config.related?.length ? (
          <RelatedContent title={config.relatedTitle || 'Related content'} items={config.related} />
        ) : null}
        {config.nextSteps?.length ? (
          <RelatedContent title="Next steps" items={config.nextSteps} />
        ) : null}
        {config.faqs?.length ? (
          <FaqSection title="Frequently asked questions" faqs={config.faqs} pageUrl={pageUrl} />
        ) : null}
        {config.disclaimer ? (
          <p className="text-xs text-muted-foreground">{config.disclaimer}</p>
        ) : null}
      </div>
    </section>
  );
}
