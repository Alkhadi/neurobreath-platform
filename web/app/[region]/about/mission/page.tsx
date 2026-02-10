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

interface RegionAboutMissionPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionAboutMissionPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/about/mission`;
  const alternates = getRegionAlternates('/about/mission');

  const baseMetadata = generatePageMetadata({
    title: 'Mission & values',
    description: 'Why NeuroBreath exists, what we value, and what we do not do.',
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

export default async function RegionAboutMissionPage({ params }: RegionAboutMissionPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and mission alignment.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Mission & values page drafted and reviewed.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(2, ['A', 'B']),
  });

  return (
    <AboutPageShell
      region={region}
      path={`/${regionKey}/about/mission`}
      title="Mission & values"
      summary="Why NeuroBreath exists and the standards we follow for educational support."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Our mission</h2>
        <p className="text-sm text-slate-600">
          NeuroBreath exists to make calm, focus, and learning support easier to access. We translate trustworthy guidance into
          clear, practical routines people can use at home, school, and work.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Our values</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li><strong>Clarity:</strong> plain‑English steps and honest limits.</li>
          <li><strong>Respect:</strong> neurodiversity‑affirming language and practical choices.</li>
          <li><strong>Accessibility:</strong> readable layouts, keyboard‑friendly tools, and calm visual design.</li>
          <li><strong>Practicality:</strong> short routines you can start in minutes.</li>
          <li><strong>Evidence‑informed:</strong> sources you can verify, updated on a published cadence.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <h2 className="text-lg font-semibold text-slate-900">What NeuroBreath does not do</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>We do not diagnose, treat, or replace professional care.</li>
          <li>We do not provide crisis services or emergency responses.</li>
          <li>We do not make medical claims or guarantee outcomes.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">Continue exploring</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href={`/${regionKey}/about/methodology`} className="text-indigo-600 hover:underline">
            Methodology
          </Link>
          <Link href={`/${regionKey}/about/use-responsibly`} className="text-indigo-600 hover:underline">
            Use tools responsibly
          </Link>
          <Link href={`/${regionKey}/trust`} className="text-indigo-600 hover:underline">
            Trust Centre
          </Link>
          <Link href={`/${regionKey}/trust/editorial-standards`} className="text-indigo-600 hover:underline">
            Editorial standards
          </Link>
        </div>
      </section>

      <CredibilityFooter editorial={editorial} region={region} />
    </AboutPageShell>
  );
}
