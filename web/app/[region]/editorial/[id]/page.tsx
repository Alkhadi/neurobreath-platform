import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { EDITORIAL_PEOPLE, getEditorialPersonById } from '@/lib/editorial/people';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionEditorialProfileProps {
  params: Promise<{ region: string; id: string }>;
}

export function generateStaticParams() {
  return EDITORIAL_PEOPLE.flatMap(person => [
    { region: 'uk', id: person.id },
    { region: 'us', id: person.id },
  ]);
}

export async function generateMetadata({ params }: RegionEditorialProfileProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const person = getEditorialPersonById(resolved.id);
  if (!person) return {};

  const path = `/${regionKey}/editorial/${person.id}`;
  const alternates = getRegionAlternates(`/editorial/${person.id}`);

  const baseMetadata = generatePageMetadata({
    title: `${person.displayName} | Editorial team`,
    description: `${person.displayName} — ${person.roleTitle}.`,
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

export default async function RegionEditorialProfile({ params }: RegionEditorialProfileProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const person = getEditorialPersonById(resolved.id);

  if (!['uk', 'us'].includes(regionKey)) return notFound();
  if (!person) return notFound();

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for accuracy and role description.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Editorial profile published.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(1, ['C']),
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[900px] py-12 space-y-8">
        <div className="text-sm text-slate-500">
          <Link href={`/${regionKey}/editorial`} className="hover:text-slate-700">Editorial team</Link> / {person.displayName}
        </div>

        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{person.displayName}</h1>
          <p className="text-base text-slate-600">{person.roleTitle}</p>
          <p className="text-sm text-slate-600">{person.bio}</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <h2 className="text-lg font-semibold text-slate-900">Focus areas</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {person.focusAreas.map(area => (
              <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {area}
              </span>
            ))}
          </div>
        </section>

        {person.credentials?.length ? (
          <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-600">
            <h2 className="text-lg font-semibold text-slate-900">Credentials</h2>
            <ul className="mt-2 list-disc pl-5">
              {person.credentials.map(cred => (
                <li key={cred}>{cred}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-600">
          <p>
            This profile reflects editorial responsibilities only. We do not claim clinical credentials unless verified.
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
