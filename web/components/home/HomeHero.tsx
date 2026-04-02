import Image from 'next/image';
import Link from 'next/link';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import type { LocaleCopy } from '@/lib/i18n/localeCopy';
import type { QuickSelectorRecommendation } from '@/components/home/QuickSelector';
import { QuickSelector } from '@/components/home/QuickSelector';
import { Badge } from '@/components/ui/badge';

// Hoisted outside component to satisfy react/require-constant
const heroBackgroundSrc = '/images/home/home-section-bg.png';

interface HomeHeroProps {
	region: Region;
	copy: LocaleCopy;
	recommendations: QuickSelectorRecommendation[];
}

export function HomeHero({ region, copy, recommendations }: HomeHeroProps) {
	const regionKey = getRegionKey(region);
	const pageKey = `${regionKey}-home`;

	return (
		<section
			aria-label="NeuroBreath homepage hero"
			data-testid="home-hero"
			data-tour={`nb:${pageKey}:hero`}
			data-tour-order="1"
			data-tour-title="Calm, focus, and routines"
			className="relative overflow-hidden"
		>
			{/* Background image */}
			<Image
				src={heroBackgroundSrc}
				alt=""
				aria-hidden="true"
				fill
				sizes="100vw"
				priority={true}
				className="object-cover object-center"
			/>

			{/* Gradient overlay — no transform/filter so fixed descendants aren't trapped */}
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/20 via-[#0F172A]/65 to-[#0F172A]/85"
			/>
			<div
				aria-hidden="true"
				className="absolute inset-0 [background:radial-gradient(1100px_circle_at_25%_20%,rgba(78,205,196,0.18),transparent_60%)] pointer-events-none"
			/>
			<div aria-hidden="true" className="absolute inset-0 nb-noise opacity-[0.04] pointer-events-none" />

			{/* Content — single container, no nested card wrapper */}
			<div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-16 lg:py-20">
				<div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:items-start">

					{/* Left: hero text + CTAs */}
					<div className="w-full lg:w-[58%]">
						<h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-white leading-tight">
							{copy.valueProp}
						</h1>
						<p className="mt-3 sm:mt-4 text-sm sm:text-lg md:text-xl text-white/80 font-light max-w-2xl leading-relaxed">
							{copy.heroSubtitle}
						</p>

						{/* Primary + secondary CTAs */}
						<div className="mt-4 sm:mt-8 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:flex-wrap">
							<Link href={`/${regionKey}/help-me-choose`} className="nb-btn-primary">
								Help me choose
							</Link>
							<Link href={`/${regionKey}/journeys`} className="nb-btn-secondary">
								Starter journeys
							</Link>
						</div>

						{/* Secondary ghost actions */}
						<div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
							<Link
								href={`/${regionKey}/conditions`}
								className="inline-flex items-center justify-center rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
							>
								Browse conditions
							</Link>
							<Link
								href="/techniques/sos"
								className="inline-flex items-center justify-center rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
							>
								Try a quick calm tool
							</Link>
							<Link
								href={`/${regionKey}/trust/last-reviewed`}
								className="inline-flex items-center justify-center rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
							>
								{copy.trustStrip.lastReviewedLabel}
							</Link>
						</div>

						{/* Trust badge + Trust Centre link — below all CTAs */}
						<div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
							<Badge className="border border-white/20 bg-white/10 text-white/90 transition-colors backdrop-blur-sm">
								{copy.trustStrip.disclaimer}
							</Badge>
							<Link
								href={`/${regionKey}/trust`}
								className="text-xs font-semibold text-white/90 hover:text-white underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 rounded-sm transition-colors"
							>
								{copy.trustStrip.trustCentreLabel}
							</Link>
						</div>
					</div>

					{/* Right: QuickSelector */}
					<div
						className="w-full lg:flex-1"
						data-tour={`nb:${pageKey}:quick-selector`}
						data-tour-order="3"
						data-tour-title="Quick selector"
					>
						<QuickSelector regionKey={regionKey} copy={copy} recommendations={recommendations} />
					</div>
				</div>
			</div>
		</section>
	);
}
