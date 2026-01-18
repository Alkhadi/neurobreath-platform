import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export interface QuickStartCard {
	id: string;
	title: string;
	description: string;
	time: string;
	href: string;
}

export function QuickStart({ cards }: { cards: QuickStartCard[] }) {
	return (
		<div className="grid gap-4 md:grid-cols-3">
			{cards.map(card => (
				<Card key={card.id} className="h-full rounded-2xl border-border/60 bg-card shadow-sm">
					<Link
						href={card.href}
						className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					>
						<CardContent className="p-6">
							<div className="flex items-center justify-between gap-3">
								<h3 className="text-base font-semibold text-foreground">{card.title}</h3>
								<span className="text-xs font-semibold text-muted-foreground">{card.time}</span>
							</div>
							<p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
							<div className="mt-4 text-sm font-semibold text-foreground">Start →</div>
						</CardContent>
					</Link>
				</Card>
			))}
		</div>
	);
}
