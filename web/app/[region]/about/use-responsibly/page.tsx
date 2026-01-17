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

interface RegionAboutUseResponsiblyPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionAboutUseResponsiblyPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/about/use-responsibly`;
  const alternates = getRegionAlternates('/about/use-responsibly');

  const baseMetadata = generatePageMetadata({
    title: 'Use tools responsibly',
    description: 'How to use NeuroBreath tools safely and within educational boundaries.',
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

export default async function RegionAboutUseResponsiblyPage({ params }: RegionAboutUseResponsiblyPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const safetyLine = region === 'US'
    ? 'If you feel unsafe or at immediate risk, call 911.'
    : 'If you feel unsafe or at immediate risk, call 999 or 112. For urgent medical advice in the UK, call NHS 111.';

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for safety language and boundaries.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Use responsibly guidance published.', 'safety'),
    ]),
    citationsSummary: createCitationsSummary(3, ['A', 'B']),
  });

  return (
    <AboutPageShell
      region={region}
      path={`/${regionKey}/about/use-responsibly`}
      title="Use tools responsibly"
      summary="Clear boundaries and safety guidance for using NeuroBreath tools and resources."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What these tools can help with</h2>
        <p className="text-sm text-slate-600">
          NeuroBreath supports calm routines, focus resets, sleep habits, and practical planning. It is designed for
          everyday wellbeing support, not clinical treatment.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">If you feel worse</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Pause the activity and take a short break.</li>
          <li>Try a simpler routine or stop for the day.</li>
          <li>Speak to someone you trust or a professional for support.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Safeguarding reminders</h2>
        <p className="mt-2 text-sm text-slate-600">
          NeuroBreath is educational and not an emergency service. Children and vulnerable users should use the site with
          support from a trusted adult where appropriate.
        </p>
        <p className="mt-3 text-sm text-slate-700 font-semibold">{safetyLine}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
          <Link href={`/${regionKey}/trust/safeguarding`} className="text-indigo-600 hover:underline">
            Safeguarding guidance
          </Link>
          <Link href={`/${regionKey}/trust/disclaimer`} className="text-indigo-600 hover:underline">
            Educational disclaimer
          </Link>
          <Link href={`/${regionKey}/about/how-we-update`} className="text-indigo-600 hover:underline">
            How we update content
          </Link>
        </div>
      </section>

      <CredibilityFooter editorial={editorial} region={region} />
    </AboutPageShell>
  );
}
