import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomeHero } from '@/components/home/Hero';
import { HomeSection } from '@/components/home/Section';
import { NextStepCards } from '@/components/home/NextStepCards';
import { TrustCards } from '@/components/home/TrustCards';
import { CONDITIONS } from '@/lib/coverage/conditions';
import { getLocaleCopy } from '@/lib/i18n/localeCopy';
import { PILLARS } from '@/lib/content/content-seo-map';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionHomePageProps {
	params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionHomePageProps): Promise<Metadata> {
	const resolved = await params;
	const region = getRegionFromKey(resolved.region);
	const regionKey = getRegionKey(region);
	const path = `/${regionKey}`;
	const alternates = getRegionAlternates('/');
	const copy = getLocaleCopy(region);

	const base = generatePageMetadata({
		title: region === 'US' ? 'NeuroBreath — Calm, focus, and routines' : 'NeuroBreath — Calm, focus, and routines',
		description: copy.valueProp,
		path,
	});

	return {
		...base,
		alternates: {
			canonical: generateCanonicalUrl(path),
			languages: {
				'en-GB': generateCanonicalUrl(alternates['en-GB']),
				'en-US': generateCanonicalUrl(alternates['en-US']),
			},
		},
	};
}

export default async function RegionHomePage({ params }: RegionHomePageProps) {
	const resolved = await params;
	const region = getRegionFromKey(resolved.region);
	const regionKey = getRegionKey(region);
	const copy = getLocaleCopy(region);

	if (!['uk', 'us'].includes(regionKey)) return notFound();

	const websiteUrl = generateCanonicalUrl('/');
	const pagePath = `/${regionKey}`;
	const pageUrl = generateCanonicalUrl(pagePath);

	const webSiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${websiteUrl}#website`,
		url: websiteUrl,
		name: 'NeuroBreath',
		inLanguage: copy.locale,
	};

	const webPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'NeuroBreath',
		description: copy.valueProp,
		url: pageUrl,
	};

	const topConditions = CONDITIONS.filter(c => c.requiredPillar || c.scope === 'condition').slice(0, 10);

	const toolsGroups = [
		{
			title: 'Calm',
			items: [
				{ label: 'SOS 60-second calm', href: '/techniques/sos' },
				{ label: 'Breathing tools', href: '/tools/breath-tools' },
			],
		},
		{
			title: 'Focus',
			items: [
				{ label: 'Focus tiles', href: '/tools/focus-tiles' },
				{ label: 'Focus training', href: '/tools/focus-training' },
			],
		},
		{
			title: 'Sleep',
			items: [
				{ label: 'Sleep tools', href: '/tools/sleep-tools' },
				{ label: 'Wind-down routine', href: '/sleep' },
			],
		},
		{
			title: 'Reading',
			items: [
				{ label: 'Reading training', href: '/dyslexia-reading-training' },
				{ label: 'Dyslexia support', href: '/dyslexia-reading-training' },
			],
		},
	];

	const guidesPreview = [
		{ title: 'ADHD basics', href: `/guides/focus-adhd`, description: 'Focus, planning, and routine support.' },
		{ title: 'Autism support', href: `/guides/autism-support`, description: 'Sensory needs, routines, and communication.' },
		{ title: 'Dyslexia learning', href: `/guides/dyslexia-reading`, description: 'Reading practice and learning supports.' },
		{ title: 'Sensory strategies', href: `/guides/autism-support`, description: 'Environmental changes and calm plans.' },
		{ title: 'Sleep routines', href: `/guides/sleep`, description: 'Wind-down routines and consistency.' },
	];

	const recommendations = [
		{
			id: 'help-me-choose',
			label: 'Help me choose (recommended)',
			description: 'Answer a few questions and get a safe, practical starting plan.',
			href: `/${regionKey}/help-me-choose`,
			tags: ['me', 'parent-carer', 'teacher', 'workplace'],
			primary: true,
		},
		{
			id: 'starter-journeys',
			label: 'Starter journeys',
			description: 'Short paths combining tools and guides (calm, focus, sleep).',
			href: `/${regionKey}/journeys`,
			tags: ['me', 'parent-carer', 'teacher', 'workplace'],
		},
		{
			id: 'conditions',
			label: 'Browse conditions',
			description: 'Filter by audience and support need, then jump into tools and guides.',
			href: `/${regionKey}/conditions`,
			tags: ['me', 'parent-carer', 'teacher', 'workplace'],
		},
		{
			id: 'tools',
			label: 'Try a quick tool',
			description: 'Start with an accessible, low-friction tool you can use right now.',
			href: `/${regionKey}/tools`,
			tags: ['me', 'teacher', 'workplace'],
		},
		{
			id: 'guides',
			label: 'Learn the basics',
			description: 'Plain-language guides with safe, evidence-informed routines.',
			href: `/${regionKey}/guides`,
			tags: ['me', 'parent-carer', 'teacher', 'workplace'],
		},
		{
			id: 'trust',
			label: copy.trustStrip.trustCentreLabel,
			description: 'Evidence policy, citations, privacy, accessibility, and safeguarding.',
			href: `/${regionKey}/trust`,
			tags: ['parent-carer', 'teacher', 'workplace', 'me'],
		},
	];

	const featuredPillars = PILLARS.filter(p => ['focus-adhd', 'autism-support', 'dyslexia-reading', 'sleep'].includes(p.key));

	const nextStepCards = [
		{
			title: 'Help me choose',
			description: 'Answer a few questions and get a safe, practical starting plan.',
			href: `/${regionKey}/help-me-choose`,
			highlight: true,
			icon: (
				<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
					<path d="M4 6h16M4 12h10M4 18h13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			),
		},
		{
			title: 'Starter journeys',
			description: 'Short paths combining tools and guides (calm, focus, sleep).',
			href: `/${regionKey}/journeys`,
			icon: (
				<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
					<path
						d="M7 7h10M7 12h6M7 17h10M5 5v14"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			),
		},
		{
			title: 'Browse conditions',
			description: 'Filter by audience and support need, then jump into tools and guides.',
			href: `/${regionKey}/conditions`,
			icon: (
				<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
					<path d="M4 6h16v6H4zM4 16h7v4H4zM13 16h7v4h-7z" fill="none" stroke="currentColor" strokeWidth="2" />
				</svg>
			),
		},
		{
			title: 'Try a quick tool',
			description: 'Start with an accessible, low-friction tool you can use right now.',
			href: `/${regionKey}/tools`,
			icon: (
				<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
					<path d="M12 2v4m0 12v4M4 12H2m20 0h-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
					<path d="M12 7a5 5 0 1 0 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			),
		},
		{
			title: 'Learn the basics',
			description: 'Plain-language guides with safe, evidence-informed routines.',
			href: `/${regionKey}/guides`,
			icon: (
				<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
					<path d="M6 4h10l2 2v14H6z" fill="none" stroke="currentColor" strokeWidth="2" />
					<path d="M8 9h8M8 13h8M8 17h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			),
		},
	];

	const trustCards = [
		{
			title: 'Evidence-informed language',
			description: 'Clear safety boundaries: educational support only, no diagnosis or treatment claims.',
			icon: (
				<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
					<path d="M12 2 20 6v6c0 5-3.5 9.4-8 10-4.5-.6-8-5-8-10V6l8-4z" fill="none" stroke="currentColor" strokeWidth="2" />
					<path d="M8 12l2.5 2.5L16 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			),
		},
		{
			title: 'Last-reviewed signals',
			description: 'Key educational pages include review metadata so you can judge freshness.',
			icon: (
				<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
					<path d="M7 3v3m10-3v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
					<path d="M4 7h16v14H4z" fill="none" stroke="currentColor" strokeWidth="2" />
					<path d="M8 11h4m-4 4h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			),
		},
		{
			title: 'Copy-only citations',
			description: 'External sources are shown as references (no outbound tracking clicks).',
			icon: (
				<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
					<path d="M7 7h10v14H7z" fill="none" stroke="currentColor" strokeWidth="2" />
					<path d="M9 11h6M9 15h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
					<path d="M9 3h10v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			),
		},
		{
			title: 'Accessibility-first',
			description: 'Keyboard, focus, contrast, and reduced motion respected across key flows.',
			icon: (
				<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
					<path d="M12 4a2 2 0 1 0 0.001 4.001A2 2 0 0 0 12 4z" fill="none" stroke="currentColor" strokeWidth="2" />
					<path d="M4 9h16M12 9v12m-5 0 3-6m7 6-3-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			),
		},
	];

	return (
		<main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
			<HomeHero region={region} copy={copy} recommendations={recommendations} />

			<HomeSection
				id="next-best-step"
				eyebrow="Get your next best step"
				title="Clear next actions — without medical claims"
				subtitle="Use Help me choose for a quick plan, or pick a starting path that combines tools and guides."
			>
				<NextStepCards items={nextStepCards} />
			</HomeSection>

			<HomeSection
				id="start-here"
				eyebrow="Start here"
				title={copy.sections.startHere.title}
				subtitle={copy.sections.startHere.subtitle}
				withDivider
			>
				<div className="grid gap-4 md:grid-cols-3">
					{[
						{
							title: 'Quick calm (SOS 60)',
							description: 'A one-minute reset for overwhelm or stress.',
							extra: '1 minute',
							href: '/techniques/sos',
						},
						{
							title: 'Build a routine',
							description: 'Starter journeys combine tools and guides into a short path.',
							extra: '3–5 mins',
							href: `/${regionKey}/journeys`,
						},
						{
							title: 'Learn the basics',
							description: 'Plain-English definitions for common terms.',
							extra: '2 mins reading',
							href: `/${regionKey}/glossary`,
						},
					].map(card => (
						<Link
							key={card.href}
							href={card.href}
							className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
						>
							<div className="flex items-center justify-between gap-3">
								<h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{card.title}</h3>
								<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.extra}</span>
							</div>
							<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
							<div className="mt-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
								Start →
							</div>
						</Link>
					))}
				</div>
			</HomeSection>

			<HomeSection
				id="conditions"
				eyebrow="Coverage"
				title={copy.sections.conditions.title}
				subtitle={copy.sections.conditions.subtitle}
				actions={
					<Link
						href={`/${regionKey}/conditions`}
						className="text-sm font-semibold text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm dark:text-indigo-300 dark:focus-visible:ring-offset-slate-950"
					>
						{copy.sections.conditions.ctaLabel}
					</Link>
				}
				withDivider
			>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{topConditions.map(condition => (
						<Link
							key={condition.conditionId}
							href={`/${regionKey}/conditions`}
							className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
						>
							<div className="flex items-start gap-3">
								<div className="mt-0.5 h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800" aria-hidden="true" />
								<div className="min-w-0">
									<div className="text-base font-semibold text-slate-900 dark:text-slate-50">
										{condition.canonicalName}
									</div>
									<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{condition.summary}</p>
								</div>
							</div>
						<div className="mt-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300">Explore →</div>
					</Link>
					))}
				</div>
			</HomeSection>

			<HomeSection
				id="tools"
				eyebrow="Try today"
				title={copy.sections.tools.title}
				subtitle={copy.sections.tools.subtitle}
				actions={
					<Link
						href={`/${regionKey}/tools`}
						className="text-sm font-semibold text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm dark:text-indigo-300 dark:focus-visible:ring-offset-slate-950"
					>
						{copy.sections.tools.ctaLabel}
					</Link>
				}
				withDivider
			>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{toolsGroups.map(group => (
						<div
							key={group.title}
							className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800"
						>
							<div className="flex items-center justify-between">
								<h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{group.title}</h3>
								<span aria-hidden="true" className="text-slate-400 dark:text-slate-500">↗</span>
							</div>
							<div className="mt-3 space-y-2 text-sm">
								{group.items.map(item => (
									<Link
										key={item.href + item.label}
										href={item.href}
										className="block font-semibold text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm dark:text-indigo-300 dark:focus-visible:ring-offset-slate-950"
									>
										{item.label}
									</Link>
								))}
							</div>
						</div>
					))}
				</div>
			</HomeSection>

			<HomeSection
				id="guides"
				eyebrow="Guides"
				title={copy.sections.guides.title}
				subtitle={copy.sections.guides.subtitle}
				actions={
					<Link
						href={`/${regionKey}/guides`}
						className="text-sm font-semibold text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm dark:text-indigo-300 dark:focus-visible:ring-offset-slate-950"
					>
						{copy.sections.guides.ctaLabel}
					</Link>
				}
				withDivider
			>
				<div className="grid gap-6 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Featured guides</h3>
						<div className="mt-3 grid gap-4 sm:grid-cols-2">
							{guidesPreview.slice(0, 4).map(cluster => (
								<Link
									key={cluster.href}
									href={cluster.href}
									className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
								>
									<div className="text-base font-semibold text-slate-900 dark:text-slate-50">{cluster.title}</div>
									<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{cluster.description}</p>
									<div className="mt-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300">Read →</div>
								</Link>
							))}
						</div>
					</div>
					<div className="lg:col-span-5">
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
							<h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Topic clusters</h3>
							<p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
								Start with a topic hub, then pick a specific guide.
							</p>
							<div className="mt-4 grid gap-3">
								{featuredPillars.map(pillar => (
									<Link
										key={pillar.key}
										href={`/guides/${pillar.key}`}
										className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-slate-950/30 dark:border-slate-800 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
									>
										<div className="font-semibold text-slate-900 dark:text-slate-50">{pillar.title}</div>
										<div className="mt-1 text-slate-600 dark:text-slate-300">{pillar.description}</div>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</HomeSection>

			<HomeSection
				id="trust"
				eyebrow="Trust & safety"
				title="Proof without claims"
				subtitle="Credible language, review signals, and privacy-respecting citations — built for accessibility."
				tone="muted"
				withDivider
			>
				<div className="grid gap-6 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<TrustCards items={trustCards} />
						<div className="mt-4 text-xs text-slate-600 dark:text-slate-300">
							Citations are shown as copy-only references (no external clicks). See the Trust Centre for details.
						</div>
					</div>
					<div className="lg:col-span-5">
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
							<h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Trust Centre</h3>
							<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
								Educational information only. Not medical advice. Use the Trust Centre to understand our evidence policy, citations,
								privacy, and safeguarding.
							</p>
							<div className="mt-4 flex flex-wrap gap-3 text-sm">
								{[
									{ label: copy.trustStrip.trustCentreLabel, href: `/${regionKey}/trust` },
									{ label: 'Evidence policy', href: `/${regionKey}/trust/evidence-policy` },
									{ label: copy.trustStrip.lastReviewedLabel, href: `/${regionKey}/trust/last-reviewed` },
									{ label: 'Disclaimer', href: `/${regionKey}/trust/disclaimer` },
									{ label: 'Privacy', href: `/${regionKey}/trust/privacy` },
								].map(item => (
									<Link
										key={item.href + item.label}
										href={item.href}
										className="font-semibold text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm dark:text-indigo-300 dark:focus-visible:ring-offset-slate-950"
									>
										{item.label}
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</HomeSection>

			<HomeSection id="final-cta" tone="muted" withDivider>
				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Get started with a safe next step</h2>
							<p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
								Educational only. Not medical advice.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row">
							<Link
								href={`/${regionKey}/journeys`}
								className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
							>
								Get Started
							</Link>
							<Link
								href={`/${regionKey}/help-me-choose`}
								className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:text-slate-50 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
							>
								Help me choose
							</Link>
						</div>
					</div>
				</div>
			</HomeSection>

			<footer className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1200px] pb-14">
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
					<div className="text-sm text-slate-700 dark:text-slate-200">
						<span className="font-semibold">Privacy note:</span> Event counts are stored locally (no personal data). See{' '}
						<Link
							href={`/${regionKey}/trust/privacy`}
							className="text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm dark:text-indigo-300 dark:focus-visible:ring-offset-slate-950"
						>
							Privacy
						</Link>
						.
					</div>
				</div>
			</footer>

			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
		</main>
	);
}
