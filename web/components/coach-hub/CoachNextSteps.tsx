import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HomeSection } from '@/components/home/Section';
import { Calendar, UserPlus } from 'lucide-react';
import type { ReactNode } from 'react';

interface NextStepCard {
	id?: string;
	title: string;
	description: string;
	href: string;
	buttonLabel: string;
	icon: ReactNode;
	download?: string;
}

const nextSteps: NextStepCard[] = [
	{
		title: 'Build a routine',
		description:
			'Anchor a daily minute of calm at the start, middle, and end of your timetable. Consistency makes the skills stick.',
		href: '/legacy-assets/stress-anxiety',
		buttonLabel: 'Plan a calm block',
		icon: <Calendar className="h-5 w-5" aria-hidden="true" />,
	},
	{
		id: 'vp-coach-vcf',
		title: 'Share the contact card',
		description:
			'Keep our VCF handy so families or co-coaches can access the full toolkit quickly.',
		href: '/legacy-assets/assets/downloads/mshare-contact.vcf',
		buttonLabel: 'Save VCF',
		download: 'NeuroBreath-Contact.vcf',
		icon: <UserPlus className="h-5 w-5" aria-hidden="true" />,
	},
];

export function CoachNextSteps() {
	return (
		<HomeSection id="coach-nextsteps" title="Next steps" withDivider>
			<div className="grid gap-4 md:grid-cols-2">
				{nextSteps.map(card => (
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
									<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
										{card.description}
									</p>
								</div>
							</div>
							<div className="mt-4 pt-2">
								<Button
									asChild
									variant="outline"
									size="sm"
									className="w-full rounded-xl"
									id={card.id}
								>
									{card.download ? (
										<a href={card.href} download={card.download} rel="noopener">
											{card.buttonLabel}
										</a>
									) : (
										<Link href={card.href} rel="noopener">
											{card.buttonLabel}
										</Link>
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</HomeSection>
	);
}
