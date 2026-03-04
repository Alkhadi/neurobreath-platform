import Link from 'next/link';
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
		<div className="flex flex-col md:flex-row md:flex-wrap gap-4">
			{items.map(item => (
				<div
					key={item.id}
					className="basis-full md:basis-[calc(50%-8px)] lg:basis-[calc(33.333%-11px)]"
				>
					<Link
						href={item.href}
						className="group flex h-full flex-col bg-white/90 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[30px] p-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.99] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
					>
						<div className="flex items-start gap-4">
							<div
								aria-hidden="true"
								className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#4ECDC4]/10 text-[#4ECDC4]"
							>
								{item.icon || (
									<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
										<path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
										<path d="M13 6l7 6-7 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</div>

							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<h3 className="text-base font-semibold text-[#0F172A] dark:text-white">{item.title}</h3>
											{item.recommended ? (
												<Badge className="bg-[#4ECDC4]/10 text-[#4ECDC4] border-0 text-xs">
													Recommended
												</Badge>
											) : null}
										</div>
										<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
									</div>
									<span aria-hidden="true" className="shrink-0 text-slate-400 group-hover:text-[#4ECDC4] transition-colors">
										→
									</span>
								</div>
							</div>
						</div>
					</Link>
				</div>
			))}
		</div>
	);
}
