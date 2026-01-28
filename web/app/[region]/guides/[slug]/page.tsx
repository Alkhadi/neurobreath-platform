import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { PlainEnglishToggle } from '@/components/content/PlainEnglishToggle';
import { FaqSection } from '@/components/seo/FAQSection';
import { RelatedContent } from '@/components/seo/RelatedContent';
import { GuidedBodyScan } from '@/components/guides/GuidedBodyScan';
import { GuidedResetStepper } from '@/components/guides/GuidedResetStepper';
import { Citations } from '@/components/evidence/Citations';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { GLOSSARY_TERM_MAP } from '@/lib/glossary/glossary';
import { canonicalPagesBySlug } from '@/lib/content/pages';
import { resolvePlainEnglish } from '@/lib/content/plainEnglish';
import { resolveBlocks, resolveFaqs, resolveH1, resolveRelatedItems, resolveSEO } from '@/lib/content/localise';
import { getRelatedContentForUrl } from '@/lib/content/link-intel-runtime';
import { getCitationsForRegion } from '@/lib/evidence/getCitationsForRegion';
import { evidenceSources } from '@/lib/evidence/evidence-registry';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { INTERACTIVE_GUIDES, INTERACTIVE_GUIDES_MAP } from '@/lib/content/interactive-guides';

interface RegionGuidePageProps {
  params: Promise<{ region: string; slug: string }>;
}

export function generateStaticParams() {
  const canonicalSlugs = Object.keys(canonicalPagesBySlug);
  const interactiveSlugs = INTERACTIVE_GUIDES.map(guide => guide.slug);
  const slugs = Array.from(new Set([...canonicalSlugs, ...interactiveSlugs]));

  return slugs
    .map(slug => ({ region: 'uk', slug }))
    .concat(slugs.map(slug => ({ region: 'us', slug })));
}

export async function generateMetadata({ params }: RegionGuidePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const region = getRegionFromKey(resolvedParams.region);
  const page = canonicalPagesBySlug[resolvedParams.slug];
  const interactiveGuide = INTERACTIVE_GUIDES_MAP.get(resolvedParams.slug);

  if (!page && !interactiveGuide) return {};

  const canonicalPath = `/${getRegionKey(region)}/guides/${resolvedParams.slug}`;
  const alternates = getRegionAlternates(`/guides/${resolvedParams.slug}`);

  if (interactiveGuide) {
    const baseMetadata = generatePageMetadata({
      title: `${interactiveGuide.title} | NeuroBreath`,
      description: interactiveGuide.description,
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

  const seo = resolveSEO(page.seo, region);

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
  const interactiveGuide = INTERACTIVE_GUIDES_MAP.get(resolvedParams.slug);

  if (!page && !interactiveGuide) {
    notFound();
  }

  if (interactiveGuide) {
    const pagePath = `/${getRegionKey(region)}/guides/${interactiveGuide.slug}`;
    const pageUrl = generateCanonicalUrl(pagePath);
    const relatedItems = getRelatedContentForUrl({
      url: pagePath,
      existing: interactiveGuide.related,
    });
    const citations = interactiveGuide.evidenceIds.map(id => evidenceSources[id]).filter(Boolean);

    return (
      <main className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-10 space-y-10">
          <div className="text-sm text-slate-500">
            <Link href={`/${getRegionKey(region)}/guides`} className="hover:text-slate-700">Guides</Link> / {interactiveGuide.title}
          </div>

          <header className="space-y-4">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{interactiveGuide.pillar.label}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{interactiveGuide.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{interactiveGuide.description}</p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Why this helps</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{interactiveGuide.intro}</p>
          </section>

          {interactiveGuide.slug === 'quick-calm-in-5-minutes' && <GuidedResetStepper />}
          {interactiveGuide.slug === 'body-scan-for-stress' && <GuidedBodyScan />}

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Practical steps</h2>
            <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground">
              {interactiveGuide.steps.map(step => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Helpful tips</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
              {interactiveGuide.practicalTips.map(tip => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          {interactiveGuide.safetyNotes && interactiveGuide.safetyNotes.length > 0 && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-lg font-semibold text-amber-900">Safety notes</h2>
              <ul className="mt-3 space-y-2 text-sm text-amber-800">
                {interactiveGuide.safetyNotes.map(note => (
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
              href={interactiveGuide.tryNow.href}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              {interactiveGuide.tryNow.label}
            </Link>
          </section>

          <RelatedContent title="Next steps" items={relatedItems} />

          <FaqSection title="Quick FAQs" faqs={interactiveGuide.faqs} pageUrl={pageUrl} />

          {citations.length > 0 && <Citations sources={citations} title="Evidence sources" />}

          <section className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Disclaimer</p>
            <p className="mt-1">
              Educational information only. This does not replace professional medical, psychological, or educational advice.
              Stop if you feel dizzy or panicky and seek support if symptoms persist.
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Last reviewed: {interactiveGuide.reviewedAt} · Next review due: {interactiveGuide.nextReviewDue}
            </p>
          </section>
        </div>
      </main>
    );
  }

  const resolvedBlocks = resolveBlocks(page.blocks, region);
  const resolvedFaqs = resolveFaqs(page.faqs, region) || [];
  const h1 = resolveH1(page.h1, region);
  const plainEnglish = resolvePlainEnglish(page, region);
  const citations = getCitationsForRegion(page, region);
  const pageUrl = generateCanonicalUrl(`/${getRegionKey(region)}/guides/${resolvedParams.slug}`);
  const relatedItems = getRelatedContentForUrl({
    url: `/${getRegionKey(region)}/guides/${resolvedParams.slug}`,
    existing: resolveRelatedItems(page.related, region),
  });
  const editorial = page.editorial;

  const keyTerms = (page.keyTerms || [])
    .map(termId => GLOSSARY_TERM_MAP.get(termId))
    .filter(Boolean)
    .map(term => ({
      id: term!.id,
      label: region === 'US' ? term!.localeVariants.us.spelling : term!.localeVariants.uk.spelling,
      href: `/${getRegionKey(region)}/glossary/${term!.id}`,
    }));

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

        {plainEnglish && <PlainEnglishToggle summary={plainEnglish.summary} bullets={plainEnglish.bullets} />}
        <ContentRenderer
          blocks={resolvedBlocks}
          region={region}
          enableGlossaryTooltips={page.enableGlossaryTooltips}
        />

        {keyTerms.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Key terms</h2>
            <p className="text-sm text-slate-600">Explore related glossary terms for quick definitions.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {keyTerms.map(term => (
                <Link
                  key={term.id}
                  href={term.href}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-indigo-300"
                >
                  {term.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        <RelatedContent title={page.relatedTitle ? resolveH1(page.relatedTitle, region) : 'Related content'} items={relatedItems} />

        <FaqSection title="Quick FAQs" faqs={resolvedFaqs} pageUrl={pageUrl} />

        <Citations sources={citations} />

        <CredibilityFooter editorial={editorial} region={region} />
      </div>
    </main>
  );
}
