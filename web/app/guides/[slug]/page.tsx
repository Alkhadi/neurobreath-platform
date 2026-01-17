import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { FaqSection } from '@/components/seo/FAQSection';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { SEO_GUIDES, SEO_GUIDES_MAP } from '@/content/seo-guides';
import { getRelatedContentForUrl } from '@/lib/content/link-intel-runtime';

interface GuidePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return SEO_GUIDES.map(guide => ({ slug: guide.slug }));
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = SEO_GUIDES_MAP.get(params.slug);

  if (!guide) {
    notFound();
  }

  const pageUrl = generateCanonicalUrl(`/guides/${guide.slug}`);

  const relatedItems = getRelatedContentForUrl({
    url: `/guides/${guide.slug}`,
    existing: guide.related,
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-10 space-y-10">
        <Breadcrumb items={[{ label: guide.pillar.label, href: guide.pillar.href }, { label: guide.title, href: `/guides/${guide.slug}` }]} />

        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">{guide.pillar.label}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{guide.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">{guide.description}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Why this guide helps</h2>
          <p className="text-base text-muted-foreground leading-relaxed">{guide.intro}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Practical steps</h2>
          <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground">
            {guide.steps.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Helpful tips</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            {guide.practicalTips.map(tip => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold text-foreground">Try this now</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start with a short, guided activity. You can come back to this guide anytime.
          </p>
          <Link
            href={guide.tryNow.href}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            {guide.tryNow.label}
          </Link>
        </section>

        <RelatedContent title="Related guides" items={relatedItems} />
        <FaqSection title="Quick FAQs" faqs={guide.faqs} pageUrl={pageUrl} />

        <section className="text-xs text-muted-foreground">
          Educational information only. It does not replace professional medical, psychological, or educational advice.
        </section>
      </div>
    </main>
  );
}
