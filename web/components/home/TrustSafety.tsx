import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

export interface TrustCard {
	title: string;
	description: string;
	icon?: ReactNode;
}

export interface TrustLink {
	label: string;
	href: string;
}

export function TrustSafety({
	cards,
	links,
	educationOnlyLine,
	extraNote,
}: {
	cards: TrustCard[];
	links: TrustLink[];
	educationOnlyLine: string;
	extraNote?: string;
}) {
	return (
		<div className="grid gap-6 lg:grid-cols-12">
			<div className="lg:col-span-7">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{cards.map(card => (
						<Card key={card.title} className="rounded-2xl border-border/60 bg-card shadow-sm">
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									<div aria-hidden="true" className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground">
										{card.icon || (
											<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
												<path d="M12 2 20 6v6c0 5-3.5 9.4-8 10-4.5-.6-8-5-8-10V6l8-4z" fill="none" stroke="currentColor" strokeWidth="2" />
											</svg>
										)}
									</div>
									<div>
										<h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
										<p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{extraNote ? <div className="mt-4 text-xs text-muted-foreground">{extraNote}</div> : null}
			</div>

			<div className="lg:col-span-5">
				<Card className="rounded-2xl border-border/60 bg-card shadow-sm">
					<CardContent className="p-6">
						<h3 className="text-base font-semibold text-foreground">Trust Centre</h3>
						<p className="mt-2 text-sm text-muted-foreground">{educationOnlyLine}</p>
						<div className="mt-4 flex flex-wrap gap-3 text-sm">
							{links.map(link => (
								<Link
									key={link.href + link.label}
									href={link.href}
									className="rounded-md font-semibold text-foreground/80 hover:text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								>
									{link.label}
								</Link>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
