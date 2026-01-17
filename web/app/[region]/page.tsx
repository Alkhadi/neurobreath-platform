import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrimaryCtaBlock } from '@/components/growth/PrimaryCtaBlock';
import { SecondaryCtaRow } from '@/components/growth/SecondaryCtaRow';
import { HomeAudienceSelector, type AudienceRecommendation } from '@/components/growth/HomeAudienceSelector';
import { TrustMiniPanel } from '@/components/trust/TrustMiniPanel';
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

	const recommendations: AudienceRecommendation[] = [
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

	return (
		<main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
			<div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1200px] py-12 space-y-10">
				<header className="space-y-4">
					<p className="text-sm uppercase tracking-wide text-slate-500">NeuroBreath</p>
					<h1 className="text-3xl sm:text-5xl font-semibold text-slate-900">{copy.valueProp}</h1>
					<p className="text-base text-slate-600 max-w-3xl">{copy.heroSubtitle}</p>

					<PrimaryCtaBlock
						region={region}
						title={region === 'US' ? 'Get your next best step' : 'Get your next best step'}
						description="Use Help Me Choose for a quick, safe starting plan, or browse conditions and tools." 
						primary={{ label: 'Help me choose', href: `/${regionKey}/help-me-choose` }}
						secondary={{ label: 'Starter journeys', href: `/${regionKey}/journeys` }}
					/>

					<SecondaryCtaRow
						actions={[
							{ label: copy.sections.conditions.ctaLabel, href: `/${regionKey}/conditions`, event: 'nav_to_conditions' },
							{ label: 'Try a quick calm tool', href: '/techniques/sos', event: 'tool_try_now_click' },
							{ label: copy.trustStrip.trustCentreLabel, href: `/${regionKey}/trust`, event: 'nav_to_trust' },
						]}
					/>

					<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div className="text-sm text-slate-700">
								<span className="font-semibold">{copy.trustStrip.disclaimer}</span>{' '}
								<span className="text-slate-600">We focus on practical, educational support — not diagnosis or treatment.</span>
							</div>
							<div className="flex flex-wrap gap-3 text-sm">
								<Link href={`/${regionKey}/trust`} className="text-indigo-600 hover:underline">{copy.trustStrip.trustCentreLabel}</Link>
								<Link href={`/${regionKey}/trust/last-reviewed`} className="text-indigo-600 hover:underline">{copy.trustStrip.lastReviewedLabel}</Link>
							</div>
						</div>
					</div>
				</header>

				<HomeAudienceSelector region={region} copy={copy} recommendations={recommendations} />

				<section className="space-y-4">
					<div>
						<h2 className="text-2xl font-semibold text-slate-900">{copy.sections.startHere.title}</h2>
						<p className="text-sm text-slate-600">{copy.sections.startHere.subtitle}</p>
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						<Link href="/techniques/sos" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
							<h3 className="text-base font-semibold text-slate-900">Quick calm (SOS 60)</h3>
							<p className="mt-2 text-sm text-slate-600">A one-minute reset for overwhelm or stress.</p>
						</Link>
						<Link href={`/${regionKey}/journeys`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
							<h3 className="text-base font-semibold text-slate-900">Build a routine</h3>
							<p className="mt-2 text-sm text-slate-600">Starter journeys combine tools and guides into a short path.</p>
						</Link>
						<Link href={`/${regionKey}/glossary`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
							<h3 className="text-base font-semibold text-slate-900">Learn the basics</h3>
							<p className="mt-2 text-sm text-slate-600">Plain-English definitions for common terms.</p>
						</Link>
					</div>
				</section>

				<section className="space-y-4">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h2 className="text-2xl font-semibold text-slate-900">{copy.sections.conditions.title}</h2>
							<p className="text-sm text-slate-600">{copy.sections.conditions.subtitle}</p>
						</div>
						<Link href={`/${regionKey}/conditions`} className="text-sm font-semibold text-indigo-600 hover:underline">{copy.sections.conditions.ctaLabel}</Link>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{topConditions.map(condition => (
							<Link
								key={condition.conditionId}
								href={`/${regionKey}/conditions`}
								className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
							>
								<div className="text-base font-semibold text-slate-900">{condition.canonicalName}</div>
								<p className="mt-2 text-sm text-slate-600">{condition.summary}</p>
							</Link>
						))}
					</div>
				</section>

				<section className="space-y-4">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h2 className="text-2xl font-semibold text-slate-900">{copy.sections.tools.title}</h2>
							<p className="text-sm text-slate-600">{copy.sections.tools.subtitle}</p>
						</div>
						<Link href={`/${regionKey}/tools`} className="text-sm font-semibold text-indigo-600 hover:underline">{copy.sections.tools.ctaLabel}</Link>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{toolsGroups.map(group => (
							<div key={group.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
								<h3 className="text-base font-semibold text-slate-900">{group.title}</h3>
								<div className="mt-3 flex flex-col gap-2 text-sm">
									{group.items.map(item => (
										<Link key={item.href + item.label} href={item.href} className="text-indigo-600 hover:underline">
											{item.label}
										</Link>
									))}
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="space-y-4">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h2 className="text-2xl font-semibold text-slate-900">{copy.sections.guides.title}</h2>
							<p className="text-sm text-slate-600">{copy.sections.guides.subtitle}</p>
						</div>
						<Link href={`/${regionKey}/guides`} className="text-sm font-semibold text-indigo-600 hover:underline">{copy.sections.guides.ctaLabel}</Link>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{guidesPreview.map(cluster => (
							<Link
								key={cluster.href}
								href={cluster.href}
								className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
							>
								<div className="text-base font-semibold text-slate-900">{cluster.title}</div>
								<p className="mt-2 text-sm text-slate-600">{cluster.description}</p>
							</Link>
						))}
					</div>
					<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
						<h3 className="text-base font-semibold text-slate-900">Topic clusters (browse)</h3>
						<p className="mt-1 text-sm text-slate-600">Start with a topic hub, then pick a specific guide.</p>
						<div className="mt-3 grid gap-3 sm:grid-cols-2">
							{featuredPillars.map(pillar => (
								<Link
									key={pillar.key}
									href={`/guides/${pillar.key}`}
									className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
								>
									<div className="font-semibold text-slate-900">{pillar.title}</div>
									<div className="mt-1 text-slate-600">{pillar.description}</div>
								</Link>
							))}
						</div>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-2xl font-semibold text-slate-900">{copy.sections.proof.title}</h2>
					<div className="grid gap-4 lg:grid-cols-2">
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<ul className="space-y-2 text-sm text-slate-700">
								{copy.sections.proof.bullets.map(item => (
									<li key={item}>• {item}</li>
								))}
							</ul>
							<div className="mt-4 text-xs text-slate-500">
								Citations are shown as copy-only references (no external clicks). See the Trust Centre for details.
							</div>
						</div>
						<TrustMiniPanel region={region} />
					</div>
				</section>

				<footer className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<div className="text-sm text-slate-700">
						<span className="font-semibold">Privacy note:</span> Event counts are stored locally (no personal data). See{' '}
						<Link href={`/${regionKey}/trust/privacy`} className="text-indigo-600 hover:underline">Privacy</Link>.
					</div>
				</footer>
			</div>

			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
		</main>
	);
}
