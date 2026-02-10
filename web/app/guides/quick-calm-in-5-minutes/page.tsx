import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { FaqSection } from '@/components/seo/FAQSection';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { Citations } from '@/components/evidence/Citations';
import { GuidedResetStepper } from '@/components/guides/GuidedResetStepper';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { getRelatedContentForUrl } from '@/lib/content/link-intel-runtime';
import { INTERACTIVE_GUIDES_MAP } from '@/lib/content/interactive-guides';
import { evidenceSources } from '@/lib/evidence/evidence-registry';

const SLUG = 'quick-calm-in-5-minutes';

export async function generateMetadata(): Promise<Metadata> {
  const guide = INTERACTIVE_GUIDES_MAP.get(SLUG);
  if (!guide) return {};

  return generatePageMetadata({
    title: `${guide.title} | NeuroBreath`,
    description: guide.description,
    path: `/guides/${guide.slug}`,
  });
}

export default async function QuickCalmIn5MinutesGuidePage() {
  const guide = INTERACTIVE_GUIDES_MAP.get(SLUG);

  if (!guide) {
    notFound();
  }

  const pagePath = `/guides/${guide.slug}`;
  const pageUrl = generateCanonicalUrl(pagePath);

  const relatedItems = getRelatedContentForUrl({
    url: pagePath,
    existing: guide.related,
  });

  const citations = guide.evidenceIds.map(id => evidenceSources[id]).filter(Boolean);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-10 space-y-10">
        <Breadcrumb
          items={[
            { label: guide.pillar.label, href: guide.pillar.href },
            { label: guide.title, href: pagePath },
          ]}
        />

        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">{guide.pillar.label}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{guide.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">{guide.description}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Why this helps</h2>
          <p className="text-base text-muted-foreground leading-relaxed">{guide.intro}</p>
        </section>

        <GuidedResetStepper />

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

        {guide.safetyNotes && guide.safetyNotes.length > 0 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-lg font-semibold text-amber-900">Safety notes</h2>
            <ul className="mt-3 space-y-2 text-sm text-amber-800">
              {guide.safetyNotes.map(note => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        )}

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

        <RelatedContent title="Next steps" items={relatedItems} />

        <FaqSection title="Quick FAQs" faqs={guide.faqs} pageUrl={pageUrl} />

        {citations.length > 0 && <Citations sources={citations} title="Evidence sources" />}

        <section className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Disclaimer</p>
          <p className="mt-1">
            Educational information only. This does not replace professional medical, psychological, or educational advice.
            Stop if you feel dizzy or panicky and seek support if symptoms persist.
          </p>
          <p className="mt-2 text-xs text-slate-600">
            Last reviewed: {guide.reviewedAt} · Next review due: {guide.nextReviewDue}
          </p>
        </section>
      </div>
    </main>
  );
}
