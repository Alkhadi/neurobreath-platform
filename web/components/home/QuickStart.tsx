import Link from 'next/link';

export interface QuickStartCard {
	id: string;
	title: string;
	description: string;
	time: string;
	href: string;
}

export function QuickStart({ cards }: { cards: QuickStartCard[] }) {
	return (
		<div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
			{cards.map(card => (
				<div
					key={card.id}
					className="w-full md:basis-[calc(33.333%-11px)]"
				>
					<Link
						href={card.href}
						className="group flex items-center gap-4 md:flex-col md:items-stretch md:gap-0 bg-white/90 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl md:rounded-[30px] p-4 md:p-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.99] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
					>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<h3 className="text-sm sm:text-base font-semibold text-[#0F172A] dark:text-white">{card.title}</h3>
								<span className="shrink-0 text-[10px] sm:text-xs font-semibold text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-full">
									{card.time}
								</span>
							</div>
							<p className="mt-1 md:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{card.description}</p>
						</div>
						<div className="shrink-0 text-sm font-semibold text-[#4ECDC4] group-hover:translate-x-0.5 transition-transform md:mt-4">
							Start →
						</div>
					</Link>
				</div>
			))}
		</div>
	);
}
