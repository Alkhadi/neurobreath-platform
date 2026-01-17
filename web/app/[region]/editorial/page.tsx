import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { EDITORIAL_PEOPLE } from '@/lib/editorial/people';
import { EDITORIAL_ROLES } from '@/lib/editorial/roles';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionEditorialPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionEditorialPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/editorial`;
  const alternates = getRegionAlternates('/editorial');

  const baseMetadata = generatePageMetadata({
    title: 'Editorial team',
    description: 'Meet the NeuroBreath editorial team and review standards.',
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

export default async function RegionEditorialPage({ params }: RegionEditorialPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity and accuracy of editorial roles.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Editorial team hub published.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(2, ['B', 'C']),
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-500">Editorial team</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Meet the editorial team</h1>
          <p className="text-base text-slate-600 max-w-3xl">
            NeuroBreath content is created and reviewed by an editorial team focused on clarity, safety language, and evidence‑informed guidance.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Editorial roles</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {EDITORIAL_ROLES.map(role => (
              <div key={role.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{role.title}</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
                  {role.responsibilities.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {EDITORIAL_PEOPLE.map(person => (
            <Link
              key={person.id}
              href={`/${regionKey}/editorial/${person.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300"
            >
              <h2 className="text-lg font-semibold text-slate-900">{person.displayName}</h2>
              <p className="mt-1 text-sm text-slate-600">{person.roleTitle}</p>
              <p className="mt-2 text-sm text-slate-600">{person.bio}</p>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-600">
          <p>
            Editorial standards and review cadence are published in the Trust Centre. We do not claim clinical roles unless verified.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
            <Link href={`/${regionKey}/trust/editorial-standards`} className="text-indigo-600 hover:underline">
              Editorial standards
            </Link>
            <Link href={`/${regionKey}/trust`} className="text-indigo-600 hover:underline">
              Trust Centre
            </Link>
          </div>
        </section>

        <CredibilityFooter editorial={editorial} region={region} />
      </div>
    </main>
  );
}
