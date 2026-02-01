import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomeHero } from '@/components/home/Hero';
import { HomeSection } from '@/components/home/Section';
import { NextSteps } from '@/components/home/NextSteps';
import { QuickStart } from '@/components/home/QuickStart';
import { ToolsToday } from '@/components/home/ToolsToday';
import { ConditionsGrid } from '@/components/home/ConditionsGrid';
import { GuidesBlock } from '@/components/home/GuidesBlock';
import { TrustSafety } from '@/components/home/TrustSafety';
import { FinalCTA } from '@/components/home/FinalCTA';
import { CONDITIONS } from '@/lib/coverage/conditions';
import { getLocaleCopy } from '@/lib/i18n/localeCopy';
import { PILLARS } from '@/lib/content/content-seo-map';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { SITE_CONFIG } from '@/lib/seo/site-seo';

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
		title: SITE_CONFIG.defaultTitle,
		description: copy.metaDescription,
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
	const tourPageKey = `${regionKey}-home`;
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
		name: SITE_CONFIG.defaultTitle,
		description: copy.metaDescription,
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
			id: 'help-me-choose',
			title: 'Help me choose',
			description: 'Answer a few questions and get a safe, practical starting plan.',
			href: `/${regionKey}/help-me-choose`,
			recommended: true,
			icon: (
				<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
					<path d="M4 6h16M4 12h10M4 18h13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			),
		},
		{
			id: 'starter-journeys',
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
			id: 'browse-conditions',
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
			id: 'try-a-tool',
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
			id: 'learn-basics',
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
		<main className="min-h-screen bg-gradient-to-b from-muted/25 via-background to-muted/20 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
			<HomeHero region={region} copy={copy} recommendations={recommendations} />

			<HomeSection
				id="next-best-step"
				tourId={`nb:${tourPageKey}:next-step`}
				tourOrder={2}
				tourTitle="Get your next best step"
				eyebrow="Get your next best step"
				title="Clear next actions — without medical claims"
				subtitle="Use Help me choose for a quick plan, or pick a starting path that combines tools and guides."
				tone="surface"
			>
				<div data-testid="home-primary-cards">
					<NextSteps items={nextStepCards} />
				</div>
			</HomeSection>

			<HomeSection
				id="start-here"
				tourId={`nb:${tourPageKey}:start-60s`}
				tourOrder={4}
				tourTitle="Start here in 60 seconds"
				eyebrow="Start here"
				title={copy.sections.startHere.title}
				subtitle={copy.sections.startHere.subtitle}
				tone="surface"
			>
				<QuickStart
					cards={[
						{
							id: 'sos',
							title: 'Quick calm (SOS 60)',
							description: 'A one-minute reset for overwhelm or stress.',
							time: '1 minute',
							href: '/techniques/sos',
						},
						{
							id: 'journeys',
							title: 'Build a routine',
							description: 'Starter journeys combine tools and guides into a short path.',
							time: '3–5 mins',
							href: `/${regionKey}/journeys`,
						},
						{
							id: 'glossary',
							title: 'Learn the basics',
							description: 'Plain-English definitions for common terms.',
							time: '2 mins reading',
							href: `/${regionKey}/glossary`,
						},
					]}
				/>
			</HomeSection>

			<HomeSection
				id="conditions"
				tourId={`nb:${tourPageKey}:conditions`}
				tourOrder={5}
				tourTitle="Conditions we cover"
				eyebrow="Coverage"
				title={copy.sections.conditions.title}
				subtitle={copy.sections.conditions.subtitle}
				tone="muted"
				actions={
					<Link
						href={`/${regionKey}/conditions`}
						className="text-sm font-semibold text-foreground/80 hover:text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
					>
						{copy.sections.conditions.ctaLabel}
					</Link>
				}
			>
				<ConditionsGrid
					conditions={topConditions}
					regionKey={regionKey}
					href={`/${regionKey}/conditions`}
					ctaLabel="Explore"
				/>
			</HomeSection>

			<HomeSection
				id="tools"
				tourId={`nb:${tourPageKey}:tools`}
				tourOrder={6}
				tourTitle="Tools you can try today"
				eyebrow="Try today"
				title={copy.sections.tools.title}
				subtitle={copy.sections.tools.subtitle}
				tone="surface"
				actions={
					<Link
						href={`/${regionKey}/tools`}
						className="text-sm font-semibold text-foreground/80 hover:text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
					>
						{copy.sections.tools.ctaLabel}
					</Link>
				}
			>
				<ToolsToday groups={toolsGroups} />
			</HomeSection>

			<HomeSection
				id="guides"
				tourId={`nb:${tourPageKey}:guides`}
				tourOrder={7}
				tourTitle="Guides (organised by topic)"
				eyebrow="Guides"
				title={copy.sections.guides.title}
				subtitle={copy.sections.guides.subtitle}
				tone="muted"
				actions={
					<Link
						href={`/${regionKey}/guides`}
						className="text-sm font-semibold text-foreground/80 hover:text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
					>
						{copy.sections.guides.ctaLabel}
					</Link>
				}
			>
				<GuidesBlock
					featured={guidesPreview.slice(0, 4)}
					clusters={featuredPillars.map(p => ({
						key: p.key,
						title: p.title,
						description: p.description,
						href: `/guides/${p.key}`,
					}))}
				/>
			</HomeSection>

			<HomeSection
				id="trust"
				eyebrow="Trust & safety"
				title="Proof without claims"
				subtitle="Credible language, review signals, and privacy-respecting citations — built for accessibility."
				tone="surface"
			>
				<TrustSafety
					cards={trustCards}
					links={[
						{ label: copy.trustStrip.trustCentreLabel, href: `/${regionKey}/trust` },
						{ label: 'Evidence policy', href: `/${regionKey}/trust/evidence-policy` },
						{ label: copy.trustStrip.lastReviewedLabel, href: `/${regionKey}/trust/last-reviewed` },
						{ label: 'Disclaimer', href: `/${regionKey}/trust/disclaimer` },
						{ label: 'Privacy', href: `/${regionKey}/trust/privacy` },
					]}
					educationOnlyLine="Educational information only. Not medical advice. No diagnosis or treatment claims."
					extraNote="Citations are shown as copy-only references (no external clicks). See the Trust Centre for details."
				/>
			</HomeSection>

			<HomeSection id="final-cta" tone="muted" withDivider>
				<FinalCTA
					title="Get started with a safe next step"
					educationOnlyLine={copy.trustStrip.disclaimer}
					primaryHref={`/${regionKey}/journeys`}
					primaryLabel="Get started"
					secondaryHref={`/${regionKey}/help-me-choose`}
					secondaryLabel="Help me choose"
				/>
			</HomeSection>

			<footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14">
				<div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
					<div className="text-sm text-muted-foreground">
						<span className="font-semibold text-foreground">Privacy note:</span> Event counts are stored locally (no personal data). See{' '}
						<Link
							href={`/${regionKey}/trust/privacy`}
							className="font-semibold text-foreground/80 hover:text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
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
