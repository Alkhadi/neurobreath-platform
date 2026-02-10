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

interface RegionAboutWhoItsForPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionAboutWhoItsForPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/about/who-its-for`;
  const alternates = getRegionAlternates('/about/who-its-for');

  const baseMetadata = generatePageMetadata({
    title: 'Who it’s for',
    description: 'Who NeuroBreath is designed to help, with recommended journeys, tools, and printables.',
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

export default async function RegionAboutWhoItsForPage({ params }: RegionAboutWhoItsForPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity and audience signposting.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Audience guidance page launched.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(4, ['A', 'B']),
  });

  return (
    <AboutPageShell
      region={region}
      path={`/${regionKey}/about/who-its-for`}
      title="Who it’s for"
      summary="NeuroBreath supports individuals, families, educators, and workplaces with practical, educational tools."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Individuals</h2>
        <p className="mt-2 text-sm text-slate-600">Quick routines, calm tools, and glossary support for everyday needs.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
          <Link href={`/${regionKey}/journeys`} className="hover:underline">Starter journeys</Link>
          <span>·</span>
          <Link href={`/${regionKey}/printables`} className="hover:underline">Printables</Link>
          <span>·</span>
          <Link href={`/${regionKey}/glossary`} className="hover:underline">Glossary</Link>
          <span>·</span>
          <Link href="/tools/roulette" className="hover:underline">Quick calm tool</Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Parents &amp; carers</h2>
        <p className="mt-2 text-sm text-slate-600">Home routines, communication supports, and template packs.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
          <Link href={`/${regionKey}/printables`} className="hover:underline">Parent starter pack</Link>
          <span>·</span>
          <Link href={`/${regionKey}/guides`} className="hover:underline">Guides</Link>
          <span>·</span>
          <Link href={`/${regionKey}/glossary/executive-function`} className="hover:underline">Executive function</Link>
          <span>·</span>
          <Link href={`/${regionKey}/trust/safeguarding`} className="hover:underline">Safeguarding</Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Teachers &amp; support staff</h2>
        <p className="mt-2 text-sm text-slate-600">Classroom tools, printable supports, and calm routines.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
          <Link href={`/${regionKey}/printables`} className="hover:underline">Classroom printables</Link>
          <span>·</span>
          <Link href={`/${regionKey}/guides`} className="hover:underline">Teaching guides</Link>
          <span>·</span>
          <Link href={`/${regionKey}/glossary/sensory-overload`} className="hover:underline">Sensory overload</Link>
          <span>·</span>
          <Link href={`/${regionKey}/trust/evidence-policy`} className="hover:underline">Evidence policy</Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Workplace &amp; teams</h2>
        <p className="mt-2 text-sm text-slate-600">Work‑friendly templates and focus plans for managers and teams.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
          <Link href={`/${regionKey}/printables`} className="hover:underline">Workplace templates</Link>
          <span>·</span>
          <Link href="/tools/focus-tiles" className="hover:underline">Focus tools</Link>
          <span>·</span>
          <Link href={`/${regionKey}/guides/focus-start`} className="hover:underline">Focus starter routine</Link>
          <span>·</span>
          <Link href={`/${regionKey}/trust/privacy`} className="hover:underline">Privacy notice</Link>
        </div>
      </section>

      <CredibilityFooter editorial={editorial} region={region} />
    </AboutPageShell>
  );
}
