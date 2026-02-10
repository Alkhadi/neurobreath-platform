import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AboutPageShell } from '@/components/about/AboutPageShell';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionAboutMethodologyPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionAboutMethodologyPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/about/methodology`;
  const alternates = getRegionAlternates('/about/methodology');

  const baseMetadata = generatePageMetadata({
    title: 'Methodology',
    description: 'How NeuroBreath content is written, reviewed, and kept evidence-informed.',
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

export default async function RegionAboutMethodologyPage({ params }: RegionAboutMethodologyPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const copy = region === 'US'
    ? {
        intro: 'Our methodology keeps content clear, safe, and evidence-informed without making medical claims.',
        programWord: 'program',
      }
    : {
        intro: 'Our methodology keeps content clear, safe, and evidence‑informed without making medical claims.',
        programWord: 'programme',
      };

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and evidence standards.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Methodology page published and reviewed.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(3, ['A', 'B']),
  });

  return (
    <AboutPageShell
      region={region}
      path={`/${regionKey}/about/methodology`}
      title="Methodology"
      summary={copy.intro}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">How content is created</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li>Author drafts content using the editorial standards and localisation checklist.</li>
          <li>Reviewer checks clarity, safety language, and that citations are present.</li>
          <li>Evidence reviewer confirms source quality tiers and recency.</li>
          <li>Accessibility reviewer checks readability and inclusive language.</li>
          <li>Published content is reviewed again on a scheduled cadence.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Evidence‑informed approach</h2>
        <p className="text-sm text-slate-600">
          We prioritise public‑health guidance and peer‑reviewed evidence. We summarise in plain English and avoid medical claims.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li><strong>Tier A:</strong> national public‑health bodies and official guidance.</li>
          <li><strong>Tier B:</strong> peer‑reviewed research and systematic reviews.</li>
          <li><strong>Tier C:</strong> reputable education or charity sources with transparent standards.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Product methodology</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Tools are calm, frictionless, and easy to pause.</li>
          <li>Visuals and language are designed to reduce cognitive load.</li>
          <li>Short routines fit into daily life without needing a full {copy.programWord}.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Accessibility first</h2>
        <p className="mt-2 text-sm text-slate-600">
          Keyboard navigation, reduced‑motion support, and readable layouts are built into our default patterns.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">Related trust resources</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href={`/${regionKey}/trust/evidence-policy`} className="text-indigo-600 hover:underline">
            Evidence policy
          </Link>
          <Link href={`/${regionKey}/trust/editorial-standards`} className="text-indigo-600 hover:underline">
            Editorial standards
          </Link>
          <Link href={`/${regionKey}/about/how-we-update`} className="text-indigo-600 hover:underline">
            How we update content
          </Link>
          <Link href={`/${regionKey}/editorial`} className="text-indigo-600 hover:underline">
            Editorial team
          </Link>
        </div>
      </section>

      <CredibilityFooter editorial={editorial} region={region} />
    </AboutPageShell>
  );
}
