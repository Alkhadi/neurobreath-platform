import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrintablesHub } from '@/components/printables/PrintablesHub';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionPrintablesPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionPrintablesPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/printables`;
  const alternates = getRegionAlternates('/printables');

  const baseMetadata = generatePageMetadata({
    title: 'Printables & templates',
    description:
      'Print-friendly resources for parents, teachers, and workplaces with structured templates and checklists. Educational only.',
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

export default async function RegionPrintablesPage({ params }: RegionPrintablesPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and template coverage.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Printables hub refreshed with current templates.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(25, ['A', 'B']),
  });

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1200px] py-12 space-y-10">
        <PrintablesHub region={region} />
        <CredibilityFooter editorial={editorial} region={region} />
      </div>
    </main>
  );
}
