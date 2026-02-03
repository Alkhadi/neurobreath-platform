import Link from 'next/link';
import { TrustPageShell } from '@/components/trust/TrustPageShell';
import { References, type ReferenceItem } from '@/components/trust/References';
import { CitationList } from '@/components/trust/CitationList';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';
import type { Region } from '@/lib/region/region';
import { GUIDES } from '@/lib/guides/guides';
import { TOOLS } from '@/lib/tools/tools';
import { PRINTABLES } from '@/lib/printables/printables';
import { GLOSSARY_TERMS } from '@/lib/glossary/glossary';

const LAST_REVIEWED = '2026-01-16';

const trustLinks = [
  { href: '/trust/evidence-policy', title: 'Evidence policy', summary: 'How we select, summarise, and review sources.' },
  { href: '/trust/citations', title: 'Citations & attribution', summary: 'How citations appear and how to verify sources.' },
  { href: '/trust/editorial-standards', title: 'Editorial standards', summary: 'Tone, claims, localisation, and quality rules.' },
  { href: '/trust/safeguarding', title: 'Safeguarding guidance', summary: 'How to use the site safely and get urgent help.' },
  { href: '/trust/privacy', title: 'Privacy notice (plain language)', summary: 'How we handle data in clear, practical terms.' },
  { href: '/trust/accessibility', title: 'Accessibility statement', summary: 'Our commitment to inclusive access.' },
  { href: '/trust/last-reviewed', title: 'Last reviewed & updates', summary: 'How we track content freshness and review due dates.' },
  { href: '/trust/disclaimer', title: 'Educational disclaimer', summary: 'What NeuroBreath can and cannot do.' },
  { href: '/trust/contact', title: 'Contact & feedback', summary: 'How to reach us and report content issues.' },
];

const getRegionalSupportLine = (region: Region) =>
  region === 'US'
    ? 'Call 911 for emergencies or 988 for the Suicide & Crisis Lifeline.'
    : 'Call 999 or 112 for emergencies, or NHS 111 for urgent medical advice.';

export function TrustHubPage({ region }: { region: Region }) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust`}
      title="Trust Centre"
      summary="NeuroBreath is an educational wellbeing and neurodiversity support platform. This Trust Centre explains how we keep information safe, evidence-led, and accessible."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="grid gap-4 md:grid-cols-2">
        {trustLinks.map(link => (
          <Link
            key={link.href}
            href={`${prefix}${link.href}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300"
          >
            <h2 className="text-lg font-semibold text-slate-900">{link.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{link.summary}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">What we do</h2>
        <p className="mt-2 text-sm text-slate-600">
          NeuroBreath provides educational support for neurodivergent wellbeing, routines, and learning strategies. We do not
          diagnose, treat, or replace professional care.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
        <h2 className="text-lg font-semibold text-slate-900">How we keep content accurate</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Evidence-informed guidance reviewed on a published cadence.</li>
          <li>Clear source tiers and copy-only citations for transparency.</li>
          <li>Non-clinical language with cautious, practical framing.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">How to use the site safely</h2>
        <p className="mt-2 text-sm text-slate-600">
          Use NeuroBreath for everyday routines and educational support. For urgent or emergency concerns, use local emergency services.
        </p>
        <p className="mt-2 text-xs text-slate-500">{getRegionalSupportLine(region)}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Contact & feedback</h2>
        <p className="mt-2 text-sm text-slate-600">
          Share feedback, report concerns, or request updates through our Trust contact route.
        </p>
        <Link href={`${prefix}/trust/contact`} className="mt-3 inline-flex text-sm font-semibold text-indigo-600 hover:underline">
          Contact the Trust team
        </Link>
      </section>
    </TrustPageShell>
  );
}

export function TrustDisclaimerPage({ region }: { region: Region }) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust/disclaimer`}
      title="Educational disclaimer"
      summary="NeuroBreath provides educational information to support wellbeing routines. It does not offer medical advice, diagnosis, or emergency services."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What NeuroBreath can do</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Provide educational guidance for breathing, focus, and wellbeing routines.</li>
          <li>Offer practical tools and prompts that may support daily habits.</li>
          <li>Share evidence-informed resources with transparent references.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What we cannot do</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Provide a diagnosis, treatment plan, or medical advice.</li>
          <li>Replace professional healthcare, psychological, or educational support.</li>
          <li>Offer emergency or crisis services.</li>
        </ul>
        <p className="text-sm text-slate-600">{getRegionalSupportLine(region)}</p>
      </section>

      <EducationalDisclaimerInline contextLabel="Using NeuroBreath" />
    </TrustPageShell>
  );
}

export function TrustEvidencePolicyPage({ region }: { region: Region }) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  const references = region === 'US'
    ? [
        { label: 'CDC: Stress and coping', url: 'https://www.cdc.gov/mentalhealth/stress-coping/index.html' },
        { label: 'NIMH: ADHD overview', url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd' },
        { label: 'US Department of Education: IDEA', url: 'https://sites.ed.gov/idea/' },
      ]
    : [
        { label: 'NHS: Breathing exercises for stress', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/' },
        { label: 'NICE: ADHD guidance', url: 'https://www.nice.org.uk/guidance/ng87' },
        { label: 'UK Department for Education: SEND guidance', url: 'https://www.gov.uk/children-with-special-educational-needs' },
      ];

  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust/evidence-policy`}
      title="Evidence policy"
      summary="We prioritise credible public-health and peer‑reviewed sources and review them regularly. This policy explains how sources are selected and maintained."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={90}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What “evidence‑informed” means here</h2>
        <p className="text-sm text-slate-600">
          We use evidence to shape educational guidance and practical routines. We do not make clinical claims or offer medical advice.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Acceptable source tiers</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li><strong>Tier A:</strong> Official public health bodies and national guidance.</li>
          <li><strong>Tier B:</strong> Peer‑reviewed journals, systematic reviews, and consensus statements.</li>
          <li><strong>Tier C:</strong> Reputable charities and education authorities with transparent standards.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What we avoid</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Miracle cures, sensational claims, or unverified advice.</li>
          <li>Diagnosis or treatment instructions.</li>
          <li>Sources that cannot be independently verified.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">How we review and update</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Evidence is reviewed on a rolling cadence for core wellbeing guidance.</li>
          <li>Each page shows a “last reviewed” date and review‑due window.</li>
          <li>If evidence conflicts, we prioritise high‑quality reviews and official guidance.</li>
          <li>When uncertainty remains, we present information cautiously.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Medical disclaimer</h2>
        <p className="mt-2 text-sm text-slate-600">
          NeuroBreath provides educational information only. It is not a substitute for professional medical, psychological, or educational care.
        </p>
      </section>

      <CitationList title="Example citations" sources={references} />
    </TrustPageShell>
  );
}

export function TrustCitationsPage({ region }: { region: Region }) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  const references = region === 'US'
    ? [
        { label: 'CDC: Stress and coping', url: 'https://www.cdc.gov/mentalhealth/stress-coping/index.html' },
        { label: 'NIMH: ADHD overview', url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd' },
      ]
    : [
        { label: 'NHS: Breathing exercises for stress', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/' },
        { label: 'NICE: ADHD guidance', url: 'https://www.nice.org.uk/guidance/ng87' },
      ];

  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust/citations`}
      title="Citations & source attribution"
      summary="We show citations as copy‑only references so you can verify sources without leaving NeuroBreath."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">How citations appear</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Source label and URL are displayed as text.</li>
          <li>External links are copy‑only (not clickable).</li>
          <li>A copy button lets you verify sources independently.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What information is shown</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Source name and publisher where relevant.</li>
          <li>URL for independent verification.</li>
          <li>Last reviewed date for NeuroBreath content.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">How sources are selected</h2>
        <p className="text-sm text-slate-600">
          We prioritise official guidance, peer‑reviewed research, and reputable education authorities. Sources are reviewed on a cadence
          aligned with our evidence policy.
        </p>
      </section>

      <CitationList title="Example citations" sources={references} />
    </TrustPageShell>
  );
}

export function TrustEditorialStandardsPage({ region }: { region: Region }) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust/editorial-standards`}
      title="Editorial standards"
      summary="Our editorial standards keep content consistent, respectful, and evidence‑informed across UK and US locales."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Tone and language</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Neurodiversity‑affirming, respectful, and practical language.</li>
          <li>Plain‑English summaries alongside deeper explanations.</li>
          <li>Accessible phrasing that avoids jargon where possible.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Claims rules</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Avoid “treat”, “cure”, or “diagnose” language.</li>
          <li>Prefer “may help”, “can support”, and “people often find”.</li>
          <li>Highlight uncertainty if evidence is mixed.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Content templates</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Pillar pages: broad overviews with clear signposting.</li>
          <li>Guides: step‑by‑step educational routines with evidence notes.</li>
          <li>Tools: on‑page usage instructions and safety disclaimers.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Duplication policy</h2>
        <p className="text-sm text-slate-600">
          We avoid duplicating content across pages unless localisation or audience needs require it. When content overlaps, we link to a
          primary source page.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">UK/US localisation</h2>
        <p className="text-sm text-slate-600">
          We adapt spelling, terminology, and local references (e.g., SEND/SENCO in the UK and IEP/504 in the US) while keeping the
          educational intent consistent.
        </p>
      </section>
    </TrustPageShell>
  );
}

export function TrustLastReviewedPage({ region }: { region: Region }) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  const now = new Date();
  const freshnessWindowDays = 180;

  const sections = [
    { label: 'Guides', items: GUIDES },
    { label: 'Tools', items: TOOLS },
    { label: 'Printables', items: PRINTABLES },
    { label: 'Glossary', items: GLOSSARY_TERMS },
  ];

  const sectionSummaries = sections.map(section => {
    const total = section.items.length;
    const recent = section.items.filter(item => {
      const reviewedAt = new Date(item.reviewedAt);
      return (now.getTime() - reviewedAt.getTime()) / (1000 * 60 * 60 * 24) <= freshnessWindowDays;
    }).length;
    const latest = section.items.reduce<Date | null>((acc, item) => {
      const reviewedAt = new Date(item.reviewedAt);
      return !acc || reviewedAt > acc ? reviewedAt : acc;
    }, null);
    return { label: section.label, total, recent, latest };
  });

  const totalItems = sectionSummaries.reduce((sum, section) => sum + section.total, 0);
  const recentItems = sectionSummaries.reduce((sum, section) => sum + section.recent, 0);
  const recentPercent = totalItems ? Math.round((recentItems / totalItems) * 100) : 0;
  const topSections = [...sectionSummaries].sort((a, b) => {
    if (!a.latest || !b.latest) return 0;
    return b.latest.getTime() - a.latest.getTime();
  });

  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust/last-reviewed`}
      title="Last reviewed & content freshness"
      summary="We track when content was last reviewed and when it is due for the next update."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">How last reviewed works</h2>
        <p className="text-sm text-slate-600">
          Each evidence‑informed page includes a “last reviewed” date and a review‑due window. This helps us keep guidance current and
          transparent.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What “review due” means</h2>
        <p className="text-sm text-slate-600">
          A review due date indicates when a page is scheduled for reassessment. If a review is due soon or overdue, we prioritise updates
          without changing the educational‑only stance.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">How we prioritise reviews</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>High‑traffic pages and core routines are reviewed first.</li>
          <li>Content linked to safety or classroom guidance is prioritised.</li>
          <li>We monitor feedback and update sooner if needed.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Content freshness summary</h2>
        <p className="mt-2 text-sm text-slate-600">
          {recentPercent}% of tracked pages were reviewed in the last {Math.round(freshnessWindowDays / 30)} months.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sectionSummaries.map(section => (
            <div key={section.label} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <p className="font-semibold text-slate-900">{section.label}</p>
              <p className="text-slate-600">{section.recent} of {section.total} reviewed recently</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-slate-500">
          Top sections recently updated: {topSections.slice(0, 2).map(section => section.label).join(' · ')}
        </div>
      </section>
    </TrustPageShell>
  );
}

export function TrustSafeguardingPage({ region }: { region: Region }) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  const references: ReferenceItem[] = region === 'US'
    ? [
        { title: '988 Suicide & Crisis Lifeline', publisher: 'SAMHSA', url: 'https://988lifeline.org/', region: 'US', badge: '988lifeline.org' },
      ]
    : [
        { title: 'NHS urgent and emergency help', publisher: 'NHS', url: 'https://www.nhs.uk/using-the-nhs/nhs-services/urgent-and-emergency-care/', region: 'UK', badge: 'nhs.uk' },
      ];

  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust/safeguarding`}
      title="Safeguarding guidance"
      summary="We take safeguarding seriously. This page explains how to report concerns and what to do in urgent situations."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Intended audience</h2>
        <p className="text-sm text-slate-600">
          NeuroBreath is designed for parents, carers, teachers, and adults seeking educational support tools. It is not a crisis or emergency service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">If someone is in immediate danger</h2>
        <p className="text-sm text-slate-600">{getRegionalSupportLine(region)}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Safe usage guidelines</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Use printables and tools for educational support, not diagnosis or treatment.</li>
          <li>Keep routines flexible and adapt to individual needs.</li>
          <li>Seek professional support if you are concerned about risk or wellbeing.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What we can’t do</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Provide emergency or crisis support.</li>
          <li>Offer diagnosis or clinical care.</li>
          <li>Monitor users in real time.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Report a safeguarding concern</h2>
        <p className="text-sm text-slate-600">
          If you see content that worries you, report it via the Trust Centre contact route. Include as much detail as you can.
        </p>
        <Link href={`${prefix}/trust/contact`} className="text-sm font-semibold text-indigo-600 hover:underline">
          Report a concern
        </Link>
      </section>

      <References title="Support references" items={references} />
    </TrustPageShell>
  );
}

export function TrustAccessibilityPage({ region }: { region?: Region } = {}) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust/accessibility`}
      title="Accessibility statement"
      summary="We are committed to making NeuroBreath accessible and inclusive, with a WCAG 2.2 AA target."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Our commitment</h2>
        <p className="text-sm text-slate-600">
          We aim to meet WCAG 2.2 AA principles and continually improve usability for people with different needs, devices, and assistive technologies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Inclusive design choices</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Keyboard navigation and visible focus states across core pages.</li>
          <li>Reduced motion defaults where possible.</li>
          <li>Readable typography and colour contrast checks.</li>
          <li>Plain‑language summaries on complex pages.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Known limitations</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Some interactive tools rely on timed animations which may require adjustment.</li>
          <li>Legacy pages may not yet offer full keyboard support or contrast options.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Contact us about accessibility</h2>
        <p className="text-sm text-slate-600">
          Email <strong>accessibility@neurobreath.co.uk</strong> with details about the issue and the page you were using.
          We respond as quickly as possible and aim to confirm a plan for improvements.
        </p>
      </section>
    </TrustPageShell>
  );
}

export function TrustPrivacyPage({ region }: { region?: Region } = {}) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust/privacy`}
      title="Privacy notice (plain language)"
      summary="This plain-language summary explains how NeuroBreath handles data for educational tools. It is not a legal document."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What we collect</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Basic usage data to improve the platform when analytics are enabled.</li>
          <li>Information you choose to submit through forms or accounts (if used).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Stored locally on your device</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Preferences such as theme, region, or tool settings.</li>
          <li>Progress notes you choose to keep on your device.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Progress saving (optional)</h2>
        <p className="text-sm text-slate-600">
          If you choose to enable progress saving, we store completion markers for lessons and exercises (and, where relevant, timestamps and quiz scores).
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li><strong>Guests:</strong> progress is saved on this device only, and requires your consent.</li>
          <li><strong>Accounts:</strong> if you create an account or sign in, we can store progress in your account so it can be available across devices.</li>
          <li>You can reset saved progress or withdraw consent at any time in Settings.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">How we use it</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>To deliver requested features and personalised routines.</li>
          <li>To improve accessibility, safety, and content quality.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Your choices</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>You can request data removal or correction by contacting us.</li>
          <li>You can opt out of non-essential analytics where available.</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Cookies</h2>
        <p className="text-sm text-slate-600">
          We use essential cookies only where needed for sign‑in or security. If optional analytics are enabled, you will be able to opt out.
        </p>
      </section>
    </TrustPageShell>
  );
}

export function TrustTermsPage({ region }: { region?: Region } = {}) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust/terms`}
      title="Terms of use"
      summary="These terms set out acceptable use for NeuroBreath’s educational tools and content."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Acceptable use</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Use the platform for personal, educational, or classroom support.</li>
          <li>Do not use NeuroBreath to provide or claim clinical diagnosis.</li>
          <li>Do not upload content that is harmful, abusive, or misleading.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Content ownership</h2>
        <p className="text-sm text-slate-600">
          NeuroBreath content is provided for educational use. You may share links to our pages, but you may not resell or misrepresent content as medical advice.
        </p>
      </section>
    </TrustPageShell>
  );
}

export function TrustContactPage({ region }: { region: Region }) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  return (
    <TrustPageShell
      region={region}
      path={`${prefix}/trust/contact`}
      title="Contact & report concerns"
      summary="Contact the NeuroBreath team for support, feedback, or to report safeguarding and content concerns."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
        <p className="text-sm text-slate-600">
          Email <strong>support@neurobreath.co.uk</strong> for general enquiries or feedback. For accessibility issues, email accessibility@neurobreath.co.uk.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Report a concern</h2>
        <p className="text-sm text-slate-600">
          If you see content that feels unsafe or inappropriate, please report it with the page link and a short description. We review reports promptly.
        </p>
        <Link href={`${prefix}/trust/safeguarding`} className="text-sm font-semibold text-indigo-600 hover:underline">
          Safeguarding guidance
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Urgent support</h2>
        <p className="text-sm text-slate-600">{getRegionalSupportLine(region)}</p>
      </section>
    </TrustPageShell>
  );
}
