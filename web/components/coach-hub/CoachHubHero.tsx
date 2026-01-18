import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Square, Wind, AlertTriangle, Download } from 'lucide-react';

const heroActions = [
	{
		label: 'Box Breathing',
		time: '3 min',
		href: '/legacy-assets/box-breathing.html?minutes=3',
		icon: Square,
		variant: 'default' as const,
	},
	{
		label: 'Coherent 5-5',
		time: '5 min',
		href: '/legacy-assets/coherent-5-5.html?minutes=5',
		icon: Wind,
		variant: 'default' as const,
	},
	{
		label: 'SOS-60 reset',
		time: '1 min',
		href: '/legacy-assets/sos-60.html?pattern=4,4,4,4&minutes=1&tts=off&vib=off',
		icon: AlertTriangle,
		variant: 'destructive' as const,
	},
	{
		label: 'Download print packs',
		href: '/legacy-assets/downloads',
		icon: Download,
		variant: 'outline' as const,
	},
];

export function CoachHubHero() {
	return (
		<section aria-label="Coach hub intro" className="py-10 sm:py-14">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<Card className="overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm">
					<div className="relative">
						{/* Subtle gradient background */}
						<div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-transparent to-muted/20 dark:from-muted/20 dark:to-muted/10" />

						<CardContent className="relative p-6 sm:p-8 lg:p-10">
							<div className="flex flex-wrap items-center gap-3 mb-4">
								<Badge variant="secondary" className="border border-border/60 bg-background/70">
									Educator Resources
								</Badge>
							</div>

							<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
								Coach Hub
							</h1>

							<p className="mt-3 text-base text-muted-foreground max-w-3xl">
								Fast briefings, printable resources, and breathing plans you can offer to learners,
								athletes, and colleagues.{' '}
								<span className="font-semibold text-foreground/80">
									Educational information only; not medical advice.
								</span>
							</p>

							<div className="mt-6 flex flex-wrap gap-3">
								{heroActions.map(action => (
									<Button
										key={action.label}
										asChild
										variant={action.variant}
										className="rounded-xl"
									>
										<Link href={action.href} rel="noopener">
											<action.icon className="h-4 w-4" aria-hidden="true" />
											<span>{action.label}</span>
											{action.time ? (
												<span className="ml-1 text-xs opacity-80">({action.time})</span>
											) : null}
										</Link>
									</Button>
								))}
							</div>
						</CardContent>
					</div>
				</Card>
			</div>
		</section>
	);
}
