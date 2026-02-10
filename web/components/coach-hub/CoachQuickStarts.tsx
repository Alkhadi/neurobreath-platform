import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { HomeSection } from '@/components/home/Section';

interface QuickStartItem {
	text: string;
	linkText: string;
	href: string;
	description: string;
}

const sessionQuickStarts: QuickStartItem[] = [
	{
		text: '',
		linkText: 'Box Breathing',
		href: '/legacy-assets/box-breathing',
		description: 'Calm nerves before presentations, exams, or games.',
	},
	{
		text: '',
		linkText: '4-7-8 Breathing',
		href: '/legacy-assets/4-7-8-breathing',
		description: 'Longer exhale to settle the body before rest periods.',
	},
	{
		text: '',
		linkText: 'Breath Tools',
		href: '/legacy-assets/breath-tools',
		description: 'Timers with audio and vibration prompts for group use.',
	},
];

const teamCheckIns: QuickStartItem[] = [
	{
		text: 'Invite a one-minute',
		linkText: 'SOS reset',
		href: '/legacy-assets/sos-60',
		description: 'anytime energy or focus drops.',
	},
	{
		text: 'Use the',
		linkText: 'Focus guide',
		href: '/legacy-assets/focus',
		description: 'for pre-task briefings and visualisation cues.',
	},
	{
		text: 'Track attendance or streaks with the built-in progress card on the home page.',
		linkText: '',
		href: '',
		description: '',
	},
];

function QuickStartCard({
	title,
	items,
}: {
	title: string;
	items: QuickStartItem[];
}) {
	return (
		<Card className="h-full rounded-2xl border-border/60 bg-card shadow-sm">
			<CardContent className="p-6">
				<h2 className="text-lg font-semibold text-foreground">{title}</h2>
				<ul className="mt-4 space-y-3">
					{items.map((item, index) => (
						<li key={index} className="text-sm text-muted-foreground leading-relaxed">
							{item.href ? (
								<>
									{item.text}{' '}
									<Link
										href={item.href}
										className="font-semibold text-foreground hover:text-foreground/80 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
									>
										{item.linkText}
									</Link>
									{item.description ? ` \u2014 ${item.description}` : ''}
								</>
							) : (
								<span>{item.text}</span>
							)}
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}

export function CoachQuickStarts() {
	return (
		<HomeSection>
			<div className="grid gap-4 md:grid-cols-2">
				<QuickStartCard title="Session quick-starts" items={sessionQuickStarts} />
				<QuickStartCard title="Team check-ins" items={teamCheckIns} />
			</div>
		</HomeSection>
	);
}
