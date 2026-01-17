import Link from 'next/link';
import { TrustPageShell } from '@/components/trust/TrustPageShell';
import { References } from '@/components/trust/References';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';
import type { Region } from '@/lib/region/region';

const LAST_REVIEWED = '2026-01-16';

const trustLinks = [
  { href: '/trust/disclaimer', title: 'Educational disclaimer', summary: 'How to use NeuroBreath safely and what we cannot do.' },
  { href: '/trust/evidence-policy', title: 'Evidence policy', summary: 'How we select and review sources.' },
  { href: '/trust/safeguarding', title: 'Safeguarding guidance', summary: 'How to report concerns and get urgent help.' },
  { href: '/trust/accessibility', title: 'Accessibility statement', summary: 'Our commitment to inclusive access.' },
  { href: '/trust/privacy', title: 'Privacy notice (plain language)', summary: 'How we handle data in clear, practical terms.' },
  { href: '/trust/terms', title: 'Terms of use', summary: 'Acceptable use and user responsibilities.' },
  { href: '/trust/contact', title: 'Contact & report concerns', summary: 'How to reach us and report content issues.' },
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

      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Quick safety note</h2>
        <p className="mt-2 text-sm text-slate-600">
          NeuroBreath provides educational information only. It is not medical advice or a substitute for professional care.
          {region === 'US' ? ' For urgent concerns, use local emergency services.' : ' For urgent concerns, use UK emergency services.'}
        </p>
        <p className="mt-2 text-xs text-slate-500">{getRegionalSupportLine(region)}</p>
      </section>
    </TrustPageShell>
  );
}

export function TrustDisclaimerPage({ region }: { region: Region }) {
  return (
    <TrustPageShell
      region={region}
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
  const references = region === 'US'
    ? [
        { title: 'Stress and coping', publisher: 'CDC', url: 'https://www.cdc.gov/mentalhealth/stress-coping/index.html', region: 'US', badge: 'cdc.gov' },
        { title: 'ADHD information', publisher: 'NIMH', url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd', region: 'US', badge: 'nimh.nih.gov' },
      ]
    : [
        { title: 'Breathing exercises for stress', publisher: 'NHS', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/', region: 'UK', badge: 'nhs.uk' },
        { title: 'ADHD: diagnosis and management', publisher: 'NICE', url: 'https://www.nice.org.uk/guidance/ng87', region: 'UK', badge: 'nice.org.uk' },
      ];

  return (
    <TrustPageShell
      region={region}
      title="Evidence policy"
      summary="We prioritise credible public-health and peer‑reviewed sources and review them regularly. This policy explains how sources are selected and maintained."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={90}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Acceptable sources</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>National public health bodies (NHS, NICE, CDC, NIH, MedlinePlus).</li>
          <li>Peer-reviewed journals and systematic reviews.</li>
          <li>Government resources where appropriate (.gov.uk / .gov).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">How we review and update</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Evidence is reviewed on a rolling 90-day cadence for core wellbeing guidance.</li>
          <li>We mark each page with a “last reviewed” date and next review due date.</li>
          <li>If evidence conflicts, we prioritise high-quality reviews and reputable public-health guidance.</li>
          <li>When uncertainty remains, we present information cautiously and avoid clinical claims.</li>
        </ul>
      </section>

      <References title="Example references" items={references} />
    </TrustPageShell>
  );
}

export function TrustSafeguardingPage({ region }: { region: Region }) {
  const prefix = region ? `/${region.toLowerCase()}` : '';
  const references = region === 'US'
    ? [
        { title: '988 Suicide & Crisis Lifeline', publisher: 'SAMHSA', url: 'https://988lifeline.org/', region: 'US', badge: '988lifeline.org' },
      ]
    : [
        { title: 'NHS urgent and emergency help', publisher: 'NHS', url: 'https://www.nhs.uk/using-the-nhs/nhs-services/urgent-and-emergency-care/', region: 'UK', badge: 'nhs.uk' },
      ];

  return (
    <TrustPageShell
      region={region}
      title="Safeguarding guidance"
      summary="We take safeguarding seriously. This page explains how to report concerns and what to do in urgent situations."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">If someone is in immediate danger</h2>
        <p className="text-sm text-slate-600">{getRegionalSupportLine(region)}</p>
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
  return (
    <TrustPageShell
      region={region}
      title="Accessibility statement"
      summary="We are committed to making NeuroBreath accessible and inclusive, in line with WCAG principles."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Our commitment</h2>
        <p className="text-sm text-slate-600">
          We aim to meet WCAG 2.1 AA principles and continually improve usability for people with different needs, devices, and assistive technologies.
        </p>
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
  return (
    <TrustPageShell
      region={region}
      title="Privacy notice (plain language)"
      summary="This plain-language summary explains how NeuroBreath handles data for educational tools. It is not a legal document."
      lastReviewed={LAST_REVIEWED}
      reviewIntervalDays={180}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What we collect</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Basic usage data to improve the platform.</li>
          <li>Optional notes and progress entries you choose to save locally or in your account.</li>
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
    </TrustPageShell>
  );
}

export function TrustTermsPage({ region }: { region?: Region } = {}) {
  return (
    <TrustPageShell
      region={region}
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
