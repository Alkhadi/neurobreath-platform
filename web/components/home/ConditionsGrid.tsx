import Link from 'next/link';
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
		<div className="flex flex-col md:flex-row md:flex-wrap gap-4">
			{conditions.map(condition => {
				const Icon = iconForCategory(condition.category);
				return (
					<div
						key={condition.conditionId}
						className="basis-full md:basis-[calc(50%-8px)] lg:basis-[calc(33.333%-11px)]"
					>
						<Link
							href={href}
							className="group flex h-full flex-col bg-white/90 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[30px] p-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.99] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
						>
							<div className="flex items-start gap-4">
								<div
									aria-hidden="true"
									className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#4ECDC4]/10 text-[#4ECDC4]"
								>
									<Icon className="h-5 w-5" />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between gap-3">
										<h3 className="text-base font-semibold text-[#0F172A] dark:text-white">{condition.canonicalName}</h3>
										<span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
											{regionKey.toUpperCase()}
										</span>
									</div>
									<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{condition.summary}</p>
									<div className="mt-4 text-sm font-semibold text-[#4ECDC4] group-hover:translate-x-0.5 transition-transform">
										{ctaLabel} →
									</div>
								</div>
							</div>
						</Link>
					</div>
				);
			})}
		</div>
	);
}
