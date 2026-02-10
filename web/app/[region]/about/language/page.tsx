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

interface RegionAboutLanguagePageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionAboutLanguagePageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/about/language`;
  const alternates = getRegionAlternates('/about/language');

  const baseMetadata = generatePageMetadata({
    title: 'Our language approach',
    description: 'How NeuroBreath uses neurodiversity‑affirming language and respectful framing.',
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

export default async function RegionAboutLanguagePage({ params }: RegionAboutLanguagePageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-accessibility-review',
    editorialRoleNotes: 'Reviewed for inclusive language and accessibility tone.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Language approach page published.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(2, ['B', 'C']),
  });

  return (
    <AboutPageShell
      region={region}
      path={`/${regionKey}/about/language`}
      title="Our language approach"
      summary="We use neurodiversity‑affirming, respectful language that prioritises dignity and clarity."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Why language matters</h2>
        <p className="text-sm text-slate-600">
          Language can shape how people feel about support. We aim for respectful, plain‑English explanations that avoid stigma
          and focus on practical help.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">How we choose terminology</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Use neurodiversity‑affirming language by default.</li>
          <li>Include regional terms when they are widely used and understood.</li>
          <li>Explain clinical terms in plain English, without over‑medicalising.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Feedback welcome</h2>
        <p className="mt-2 text-sm text-slate-600">
          If you notice language that feels unclear or disrespectful, please let us know.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
          <Link href={`/${regionKey}/trust/contact`} className="text-indigo-600 hover:underline">
            Contact the Trust team
          </Link>
          <Link href={`/${regionKey}/trust/editorial-standards`} className="text-indigo-600 hover:underline">
            Editorial standards
          </Link>
          <Link href={`/${regionKey}/about/mission`} className="text-indigo-600 hover:underline">
            Mission &amp; values
          </Link>
        </div>
      </section>

      <CredibilityFooter editorial={editorial} region={region} />
    </AboutPageShell>
  );
}
