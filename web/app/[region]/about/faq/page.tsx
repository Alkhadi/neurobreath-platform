import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AboutPageShell } from '@/components/about/AboutPageShell';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { FaqSection } from '@/components/seo/FAQSection';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionAboutFaqPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionAboutFaqPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/about/faq`;
  const alternates = getRegionAlternates('/about/faq');

  const baseMetadata = generatePageMetadata({
    title: 'About FAQ',
    description: 'Plain‑English answers to common questions about NeuroBreath.',
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

export default async function RegionAboutFaqPage({ params }: RegionAboutFaqPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const faqs = [
    {
      question: 'Is NeuroBreath medical advice?',
      answer: 'No. NeuroBreath provides educational information only and does not replace professional care.',
    },
    {
      question: 'Who writes and reviews your content?',
      answer: 'Our editorial team drafts content and a reviewer checks clarity, safety language, and evidence context.',
    },
    {
      question: 'How do you choose sources?',
      answer: 'We prioritise public‑health guidance and peer‑reviewed evidence, then summarise in plain English.',
    },
    {
      question: 'Why are there UK and US versions?',
      answer: 'We localise spelling, terminology, and references so guidance is easier to use in each region.',
    },
    {
      question: 'Can NeuroBreath diagnose me or my child?',
      answer: 'No. NeuroBreath is not a diagnostic service and does not provide medical decisions.',
    },
    {
      question: 'How do I pick a starting point quickly?',
      answer: 'Use the Help Me Choose wizard or the starter journeys hub to find a short path.',
    },
    {
      question: 'Are the tools safe for children?',
      answer: 'The tools are educational and designed for everyday support. Use them with adult guidance where appropriate.',
    },
    {
      question: 'How often is content reviewed?',
      answer: 'Every page displays a last reviewed date and a review interval so you can see the update cadence.',
    },
    {
      question: 'What data do you store?',
      answer: 'We store only essential data needed for the experience. Some tools save locally on your device.',
    },
    {
      question: 'Why are citations copy‑only links?',
      answer: 'We show citations as copy‑only references so you can verify sources without leaving the site.',
    },
    {
      question: 'How do I use printables?',
      answer: 'Printables include short instructions on each page. You can print or download a PDF where available.',
    },
    {
      question: 'How do you handle accessibility?',
      answer: 'We aim for WCAG 2.2 AA standards with readable layouts, keyboard support, and reduced‑motion options.',
    },
  ];

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and FAQ accuracy.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'FAQ page published with common trust questions.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(6, ['A', 'B']),
  });

  return (
    <AboutPageShell
      region={region}
      path={`/${regionKey}/about/faq`}
      title="FAQ"
      summary="Plain‑English answers to common questions about NeuroBreath."
    >
      <FaqSection
        pageUrl={generateCanonicalUrl(`/${regionKey}/about/faq`)}
        faqs={faqs}
        title="Frequently asked questions"
        includeSchema
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">More trust resources</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href={`/${regionKey}/trust`} className="text-indigo-600 hover:underline">
            Trust Centre
          </Link>
          <Link href={`/${regionKey}/trust/citations`} className="text-indigo-600 hover:underline">
            Citations policy
          </Link>
          <Link href={`/${regionKey}/about/how-we-update`} className="text-indigo-600 hover:underline">
            How we update content
          </Link>
          <Link href={`/${regionKey}/about/methodology`} className="text-indigo-600 hover:underline">
            Methodology
          </Link>
        </div>
      </section>

      <CredibilityFooter editorial={editorial} region={region} />
    </AboutPageShell>
  );
}
