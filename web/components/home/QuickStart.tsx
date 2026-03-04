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
		<div className="flex flex-col md:flex-row md:flex-wrap gap-4">
			{cards.map(card => (
				<div
					key={card.id}
					className="basis-full md:basis-[calc(33.333%-11px)]"
				>
					<Link
						href={card.href}
						className="group flex h-full flex-col bg-white/90 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[30px] p-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.99] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
					>
						<div className="flex items-center justify-between gap-3">
							<h3 className="text-base font-semibold text-[#0F172A] dark:text-white">{card.title}</h3>
							<span className="shrink-0 text-xs font-semibold text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-1 rounded-full">
								{card.time}
							</span>
						</div>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
						<div className="mt-4 text-sm font-semibold text-[#4ECDC4] group-hover:translate-x-0.5 transition-transform">
							Start →
						</div>
					</Link>
				</div>
			))}
		</div>
	);
}
