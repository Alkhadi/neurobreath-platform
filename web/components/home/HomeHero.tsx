import Image from 'next/image';
import Link from 'next/link';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import type { LocaleCopy } from '@/lib/i18n/localeCopy';
import type { QuickSelectorRecommendation } from '@/components/home/QuickSelector';
import { QuickSelector } from '@/components/home/QuickSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HomeHeroProps {
	region: Region;
	copy: LocaleCopy;
	recommendations: QuickSelectorRecommendation[];
}

export function HomeHero({ region, copy, recommendations }: HomeHeroProps) {
	const regionKey = getRegionKey(region);
	const heroBackgroundSrc = '/images/home/home-section-bg.png';

	return (
		<section aria-label="NeuroBreath homepage hero" data-testid="home-hero" className="relative overflow-hidden">
			<Image
				src={heroBackgroundSrc}
				alt=""
				aria-hidden="true"
				fill
				sizes="100vw"
				priority={true}
				className="object-cover object-center"
			/>
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/45 to-background/65 dark:from-background/60 dark:via-background/55 dark:to-background/70"
			/>
			<div
				aria-hidden="true"
				className="absolute inset-0 [background:radial-gradient(1100px_circle_at_25%_20%,rgba(255,255,255,0.50),rgba(255,255,255,0.12),transparent_62%)] dark:[background:radial-gradient(1100px_circle_at_25%_20%,rgba(0,0,0,0.40),rgba(0,0,0,0.18),transparent_62%)] pointer-events-none"
			/>
			<div aria-hidden="true" className="absolute inset-0 nb-noise opacity-[0.06] dark:opacity-[0.05] pointer-events-none" />

			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-[2%]">
				<div
					className="
						relative overflow-hidden
						min-h-[560px] sm:min-h-[620px] lg:min-h-[680px]
						rounded-2xl
						border border-border/60
						bg-background/60 dark:bg-background/45
						backdrop-blur-md
					"
				>
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/55 to-background/70 dark:from-background/35 dark:via-background/50 dark:to-background/70"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-0 [background:radial-gradient(900px_circle_at_20%_25%,rgba(255,255,255,0.40),transparent_60%)] dark:[background:radial-gradient(900px_circle_at_20%_25%,rgba(0,0,0,0.30),transparent_60%)]"
					/>

					<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
						<div className="grid gap-8 lg:grid-cols-12 lg:items-start">
							<div className="lg:col-span-7">
								<div
									className="
										inline-block
										rounded-2xl
										border border-border/60
										bg-background/55 dark:bg-background/35
										backdrop-blur-md
										shadow-sm
										p-6 sm:p-8 lg:p-10
									"
								>
									<div className="flex flex-wrap items-center gap-3">
										<Badge variant="secondary" className="border border-border/60 bg-background/70 text-foreground">
											{copy.trustStrip.disclaimer}
										</Badge>
										<Link
											href={`/${regionKey}/trust`}
											className="text-xs font-semibold text-foreground/80 hover:text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
										>
											{copy.trustStrip.trustCentreLabel}
										</Link>
									</div>

									<h1 className="mt-5 text-3xl sm:text-5xl font-semibold tracking-tight text-foreground">
										{copy.valueProp}
									</h1>
									<p className="mt-4 text-base text-muted-foreground max-w-2xl">{copy.heroSubtitle}</p>

									<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
										<Button asChild className="w-full sm:w-auto rounded-xl">
											<Link href={`/${regionKey}/help-me-choose`}>Help me choose</Link>
										</Button>
										<Button asChild variant="outline" className="w-full sm:w-auto rounded-xl">
											<Link href={`/${regionKey}/journeys`}>Starter journeys</Link>
										</Button>
									</div>

									<div className="mt-4 flex flex-wrap gap-2">
										<Button asChild variant="secondary" className="rounded-xl">
											<Link href={`/${regionKey}/conditions`}>Browse conditions</Link>
										</Button>
										<Button asChild variant="ghost" className="rounded-xl">
											<Link href="/techniques/sos">Try a quick calm tool</Link>
										</Button>
										<Button asChild variant="ghost" className="rounded-xl">
											<Link href={`/${regionKey}/trust/last-reviewed`}>{copy.trustStrip.lastReviewedLabel}</Link>
										</Button>
									</div>

									<div className="mt-6 text-sm text-muted-foreground">
										<span className="font-semibold text-foreground">{copy.trustStrip.disclaimer}</span>{' '}
											<span>Educational only. Not medical advice. No diagnosis. No medical claims.</span>
									</div>
								</div>
							</div>

							<div className="lg:col-span-5">
								<QuickSelector regionKey={regionKey} copy={copy} recommendations={recommendations} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
