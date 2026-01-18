import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HomeSection } from '@/components/home/Section';
import { FileText, GraduationCap, Users } from 'lucide-react';
import type { ReactNode } from 'react';

interface PrintableCard {
	title: string;
	description: string;
	href: string;
	buttonLabel: string;
	icon: ReactNode;
}

const printables: PrintableCard[] = [
	{
		title: 'One-page breathing guide',
		description: 'Step-by-step overview with visuals for the main techniques.',
		href: '/legacy-assets/downloads.html#breathing-cheat',
		buttonLabel: 'Open PDF',
		icon: <FileText className="h-5 w-5" aria-hidden="true" />,
	},
	{
		title: 'Classroom calm pack',
		description: 'Timers, scripts, and posters for primary and secondary classrooms.',
		href: '/legacy-assets/teacher-quick-pack',
		buttonLabel: 'View pack',
		icon: <GraduationCap className="h-5 w-5" aria-hidden="true" />,
	},
	{
		title: 'Parent handover',
		description: 'Quick card to explain what you practised and how to continue at home.',
		href: '/legacy-assets/autism-parent',
		buttonLabel: 'See template',
		icon: <Users className="h-5 w-5" aria-hidden="true" />,
	},
];

export function CoachPrintables() {
	return (
		<HomeSection
			id="coach-printables"
			title="Printables & prep"
			subtitle="Share ahead of sessions or keep copies in a binder. Each download opens in a new tab with live links."
			withDivider
		>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{printables.map(card => (
					<Card
						key={card.title}
						className="group h-full rounded-2xl border-border/60 bg-card shadow-sm transition-colors hover:bg-accent/30"
					>
						<CardContent className="flex h-full flex-col p-6">
							<div className="flex items-start gap-4">
								<div
									aria-hidden="true"
									className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-foreground"
								>
									{card.icon}
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="text-base font-semibold text-foreground">{card.title}</h3>
									<p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
								</div>
							</div>
							<div className="mt-4 pt-2">
								<Button asChild variant="outline" size="sm" className="w-full rounded-xl">
									<Link href={card.href} rel="noopener">
										{card.buttonLabel}
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</HomeSection>
	);
}
