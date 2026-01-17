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

interface RegionAboutPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionAboutPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/about`;
  const alternates = getRegionAlternates('/about');

  const baseMetadata = generatePageMetadata({
    title: 'About NeuroBreath',
    description: 'What NeuroBreath is, how it works, and how we keep guidance safe and evidence-informed.',
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

export default async function RegionAboutPage({ params }: RegionAboutPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const copy = region === 'US'
    ? {
        hero: 'NeuroBreath is an educational wellbeing platform for calm, focus, sleep, and everyday support.',
        proof: {
          tools: 'Practical tools for breathing, focus, sleep, and daily routines.',
          learning: 'Clear learning resources—guides, glossary, and printables.',
          trust: 'Trust & safety standards with evidence and review transparency.',
          local: 'US-aware terminology and localized support routes.',
        },
        lastReviewed: 'Learn how we review and update content.',
      }
    : {
        hero: 'NeuroBreath is an educational wellbeing platform for calm, focus, sleep, and everyday support.',
        proof: {
          tools: 'Practical tools for breathing, focus, sleep, and daily routines.',
          learning: 'Clear learning resources—guides, glossary, and printables.',
          trust: 'Trust & safety standards with evidence and review transparency.',
          local: 'UK-aware terminology and localised support routes.',
        },
        lastReviewed: 'Learn how we review and update content.',
      };

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and trust signals.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'About hub launched with authority stack overview.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(4, ['A', 'B']),
  });

  return (
    <AboutPageShell
      region={region}
      path={`/${regionKey}/about`}
      title="About NeuroBreath"
      summary={copy.hero}
    >
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Practical tools</h2>
          <p className="mt-2 text-sm text-slate-600">{copy.proof.tools}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Clear learning resources</h2>
          <p className="mt-2 text-sm text-slate-600">{copy.proof.learning}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Trust &amp; safety</h2>
          <p className="mt-2 text-sm text-slate-600">{copy.proof.trust}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Localised support</h2>
          <p className="mt-2 text-sm text-slate-600">{copy.proof.local}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Start here</h2>
        <p className="mt-2 text-sm text-slate-600">Choose a starting point based on your needs and context.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/${regionKey}/help-me-choose`}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300"
          >
            Help me choose
          </Link>
          <Link
            href={`/${regionKey}/journeys`}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300"
          >
            Starter journeys
          </Link>
          <Link
            href={`/${regionKey}/conditions`}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300"
          >
            Conditions hub
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Trust mini‑panel</h2>
        <p className="mt-2 text-sm text-slate-600">{copy.lastReviewed}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
          <Link href={`/${regionKey}/trust`} className="text-indigo-600 hover:underline">
            Trust Centre
          </Link>
          <Link href={`/${regionKey}/trust/editorial-standards`} className="text-indigo-600 hover:underline">
            Editorial standards
          </Link>
          <Link href={`/${regionKey}/trust/last-reviewed`} className="text-indigo-600 hover:underline">
            Last reviewed
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Explore the authority stack</h2>
        <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          <Link href={`/${regionKey}/about/mission`} className="hover:underline">Mission &amp; values</Link>
          <Link href={`/${regionKey}/about/methodology`} className="hover:underline">Methodology</Link>
          <Link href={`/${regionKey}/about/who-its-for`} className="hover:underline">Who it’s for</Link>
          <Link href={`/${regionKey}/about/use-responsibly`} className="hover:underline">Use tools responsibly</Link>
          <Link href={`/${regionKey}/about/how-we-update`} className="hover:underline">How we update content</Link>
          <Link href={`/${regionKey}/about/faq`} className="hover:underline">FAQ</Link>
          <Link href={`/${regionKey}/about/language`} className="hover:underline">Our language approach</Link>
          <Link href={`/${regionKey}/editorial`} className="hover:underline">Editorial team</Link>
        </div>
      </section>

      <CredibilityFooter editorial={editorial} region={region} />
    </AboutPageShell>
  );
}
