import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AboutPageShell } from '@/components/about/AboutPageShell';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { LastReviewedBadge } from '@/components/trust/LastReviewedBadge';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionAboutHowWeUpdatePageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionAboutHowWeUpdatePageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/about/how-we-update`;
  const alternates = getRegionAlternates('/about/how-we-update');

  const baseMetadata = generatePageMetadata({
    title: 'How we update content',
    description: 'How NeuroBreath reviews content, what “review due” means, and how to report updates.',
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

export default async function RegionAboutHowWeUpdatePage({ params }: RegionAboutHowWeUpdatePageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const reviewedAt = '2026-01-17';
  const reviewIntervalDays = 180;

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for transparency and update workflow accuracy.',
    createdAt: reviewedAt,
    updatedAt: reviewedAt,
    reviewedAt,
    reviewIntervalDays,
    changeLog: createChangeLog([
      createChangeLogEntry(reviewedAt, 'Update workflow page published.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(3, ['A', 'B']),
  });

  return (
    <AboutPageShell
      region={region}
      path={`/${regionKey}/about/how-we-update`}
      title="How we update content"
      summary="We track review dates, review intervals, and update history to keep guidance current and transparent."
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What “last reviewed” means</h2>
        <p className="text-sm text-slate-600">
          Every evidence‑informed page includes a last reviewed date and a planned review interval. This tells you when the content was last checked.
        </p>
      </section>

      <LastReviewedBadge reviewedAt={reviewedAt} reviewIntervalDays={reviewIntervalDays} region={region} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">How to interpret “review due”</h2>
        <p className="text-sm text-slate-600">
          When a review is due, we reassess sources and language, and update content as needed. A review due date does not imply urgent risk.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Report an issue</h2>
        <p className="mt-2 text-sm text-slate-600">
          If something looks outdated or unclear, let us know. We prioritise updates based on feedback and review schedules.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
          <Link href={`/${regionKey}/trust/contact`} className="text-indigo-600 hover:underline">
            Contact the Trust team
          </Link>
          <Link href={`/${regionKey}/trust/last-reviewed`} className="text-indigo-600 hover:underline">
            Review dashboard
          </Link>
          <Link href={`/${regionKey}/trust/evidence-policy`} className="text-indigo-600 hover:underline">
            Evidence policy
          </Link>
          <Link href={`/${regionKey}/trust/editorial-standards`} className="text-indigo-600 hover:underline">
            Editorial standards
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">Related pages</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href={`/${regionKey}/about/mission`} className="text-indigo-600 hover:underline">
            Mission &amp; values
          </Link>
          <Link href={`/${regionKey}/about/faq`} className="text-indigo-600 hover:underline">
            FAQ
          </Link>
        </div>
      </section>

      <CredibilityFooter editorial={editorial} region={region} />
    </AboutPageShell>
  );
}
