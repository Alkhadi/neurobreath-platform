import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ConditionEntry } from '@/lib/coverage/conditions';
import { Brain, HeartPulse, Moon, GraduationCap } from 'lucide-react';

function iconForCategory(category?: string) {
	const key = (category || '').toLowerCase();
	if (key.includes('sleep')) return Moon;
	if (key.includes('anxiety') || key.includes('stress')) return HeartPulse;
	if (key.includes('learning') || key.includes('dyslexia')) return GraduationCap;
	return Brain;
}

export function ConditionsGrid({
	conditions,
	regionKey,
	href,
	ctaLabel,
}: {
	conditions: ConditionEntry[];
	regionKey: string;
	href: string;
	ctaLabel: string;
}) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{conditions.map(condition => {
				const Icon = iconForCategory(condition.category);
				return (
					<Card key={condition.conditionId} className="h-full rounded-2xl border-border/60 bg-card shadow-sm">
						<Link
							href={href}
							className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									<div
										aria-hidden="true"
										className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground"
									>
										<Icon className="h-5 w-5" />
									</div>
									<div className="min-w-0">
										<div className="flex items-center justify-between gap-3">
											<h3 className="text-base font-semibold text-foreground">{condition.canonicalName}</h3>
											<Badge variant="outline" className="text-xs text-muted-foreground">
												{regionKey.toUpperCase()}
											</Badge>
										</div>
										<p className="mt-2 text-sm text-muted-foreground">{condition.summary}</p>
										<div className="mt-4 text-sm font-semibold text-foreground">{ctaLabel} →</div>
									</div>
								</div>
							</CardContent>
						</Link>
					</Card>
				);
			})}
		</div>
	);
}
