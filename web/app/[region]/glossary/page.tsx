import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GlossaryHub } from '@/components/glossary/GlossaryHub';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { GLOSSARY_TERMS } from '@/lib/glossary/glossary';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionGlossaryPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionGlossaryPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/glossary`;
  const alternates = getRegionAlternates('/glossary');

  const description =
    region === 'US'
      ? 'Plain‑English glossary for neurodivergent support, learning, and tools. Clear definitions with trusted context.'
      : 'Plain‑English glossary for neurodivergent support, learning, and tools. Clear definitions with trusted context.';

  const baseMetadata = generatePageMetadata({
    title: region === 'US' ? 'Glossary & Plain‑English definitions' : 'Glossary & Plain‑English definitions',
    description,
    path,
  });

  return {
    ...baseMetadata,
    alternates: {
      canonical: generateCanonicalUrl(path),
      languages: {
        'en-GB': generateCanonicalUrl(alternates['en-GB']),
        'en-US': generateCanonicalUrl(alternates['en-US']),
      },
    },
  };
}

export default async function RegionGlossaryPage({ params }: RegionGlossaryPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and glossary coverage.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Glossary hub updated with current terms.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(GLOSSARY_TERMS.length, ['A', 'B']),
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1200px] py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-500">Glossary</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
            Glossary &amp; plain‑English definitions
          </h1>
          <p className="text-base text-slate-600 max-w-3xl">
            Clear, respectful definitions for neurodivergent support terms. Educational only, not medical advice.
          </p>
        </header>
        <GlossaryHub terms={GLOSSARY_TERMS} region={region} />
        <CredibilityFooter editorial={editorial} region={region} />
      </div>
    </main>
  );
}
