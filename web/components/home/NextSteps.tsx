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
	const featured = items.find(item => item.recommended);
	const rest = items.filter(item => !item.recommended);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

			{featured ? (
				<div className="col-span-1 sm:col-span-2 lg:col-span-4">
					<Link
						href={featured.href}
						className="group relative flex items-center justify-between gap-4 sm:gap-6 rounded-2xl bg-gradient-to-r from-[#4ECDC4]/10 via-[#4ECDC4]/[0.05] to-transparent border border-[#4ECDC4]/20 dark:border-[#4ECDC4]/15 px-4 py-4 sm:px-8 sm:py-6 hover:border-[#4ECDC4]/40 hover:from-[#4ECDC4]/[0.12] hover:-translate-y-px transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
					>
						<div className="flex items-center gap-5 min-w-0">
							<div
								aria-hidden="true"
								className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4ECDC4]/15 text-[#4ECDC4]"
							>
								{featured.icon ?? (
									<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
										<path d="M4 6h16M4 12h10M4 18h13" />
									</svg>
								)}
							</div>

							<div className="min-w-0">
								<div className="flex flex-wrap items-center gap-2 mb-1">
									<span className="text-base sm:text-lg font-semibold text-[#0F172A] dark:text-white leading-snug">
										{featured.title}
									</span>
									<Badge className="bg-[#4ECDC4] text-white border-0 text-[10px] px-2 py-0.5 font-semibold tracking-wide uppercase">
										Recommended
									</Badge>
								</div>
								<p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
									{featured.description}
								</p>
							</div>
						</div>

						<span
							aria-hidden="true"
							className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-[#4ECDC4]/10 text-[#4ECDC4] group-hover:bg-[#4ECDC4] group-hover:text-white transition-all duration-200"
						>
							<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<path d="M9 18l6-6-6-6" />
							</svg>
						</span>
					</Link>
				</div>
			) : null}

			{rest.map(item => (
				<Link
					key={item.id}
					href={item.href}
					className="group flex flex-col gap-3 rounded-2xl border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-white/[0.04] px-4 py-4 sm:px-5 sm:py-5 hover:border-[#4ECDC4]/30 hover:bg-white dark:hover:bg-white/[0.07] hover:-translate-y-px transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
				>
					<div className="flex items-start justify-between gap-2">
						<div
							aria-hidden="true"
							className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 group-hover:bg-[#4ECDC4]/10 group-hover:text-[#4ECDC4] transition-colors duration-200"
						>
							{item.icon ?? (
								<svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M9 18l6-6-6-6" />
								</svg>
							)}
						</div>
						<span
							aria-hidden="true"
							className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-[#4ECDC4] transition-colors duration-200 text-base leading-none mt-1"
						>
							→
						</span>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-[#0F172A] dark:text-white mb-1 leading-snug">
							{item.title}
						</h3>
						<p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
							{item.description}
						</p>
					</div>
				</Link>
			))}

		</div>
	);
}
