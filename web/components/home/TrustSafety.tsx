import Link from 'next/link';
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
		<div className="flex flex-col lg:flex-row gap-6">
			{/* Trust cards — ~58% on desktop */}
			<div className="w-full lg:w-[58%]">
				<div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
					{cards.map(card => (
						<div
							key={card.title}
							className="w-full md:basis-[calc(50%-8px)]"
						>
							<div className="bg-white/90 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl md:rounded-[30px] p-4 md:p-6 shadow-xl">
								<div className="flex items-start gap-3 sm:gap-4">
									<div
										aria-hidden="true"
										className="mt-0.5 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#4ECDC4]/10 text-[#4ECDC4]"
									>
										{card.icon || (
											<svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5">
												<path d="M12 2 20 6v6c0 5-3.5 9.4-8 10-4.5-.6-8-5-8-10V6l8-4z" fill="none" stroke="currentColor" strokeWidth="2" />
											</svg>
										)}
									</div>
									<div className="min-w-0">
										<h3 className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white">{card.title}</h3>
										<p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{card.description}</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{extraNote ? <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">{extraNote}</div> : null}
			</div>

			{/* Trust Centre card — ~40% on desktop */}
			<div className="w-full lg:flex-1">
				<div className="h-full bg-white/90 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[30px] p-4 sm:p-6 shadow-xl">
					<h3 className="text-base font-semibold text-[#0F172A] dark:text-white">Trust Centre</h3>
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{educationOnlyLine}</p>
					<div className="mt-4 flex flex-wrap gap-3 text-sm">
						{links.map(link => (
							<Link
								key={link.href + link.label}
								href={link.href}
								className="rounded-full px-4 py-1.5 font-semibold text-[#4ECDC4] border border-[#4ECDC4]/30 hover:bg-[#4ECDC4]/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
							>
								{link.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
