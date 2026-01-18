import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ReactNode } from 'react';

export interface NextStepItem {
	id: string;
	title: string;
	description: string;
	href: string;
	recommended?: boolean;
	icon?: ReactNode;
}

export function NextSteps({ items }: { items: NextStepItem[] }) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{items.map(item => (
				<Card
					key={item.id}
					className={
						"group h-full rounded-2xl border-border/60 bg-card shadow-sm transition-colors hover:bg-accent/30"
					}
				>
					<Link
						href={item.href}
						className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
					>
						<CardContent className="p-6">
							<div className="flex items-start gap-4">
								<div
									aria-hidden="true"
									className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground"
								>
									{item.icon || (
										<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
											<path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
											<path d="M13 6l7 6-7 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									)}
								</div>

								<div className="min-w-0">
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-2">
												<h3 className="text-base font-semibold text-foreground">{item.title}</h3>
												{item.recommended ? (
													<Badge variant="secondary" className="border border-border/60 bg-background/70">
														Recommended
													</Badge>
												) : null}
											</div>
											<p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
										</div>
										<span aria-hidden="true" className="shrink-0 text-muted-foreground group-hover:text-foreground">
											→
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Link>
				</Card>
			))}
		</div>
	);
}
