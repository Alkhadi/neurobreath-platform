import Link from 'next/link';

export interface FeaturedGuide {
	title: string;
	description: string;
	href: string;
}

export interface TopicCluster {
	key: string;
	title: string;
	description: string;
	href: string;
}

export function GuidesBlock({
	featured,
	clusters,
}: {
	featured: FeaturedGuide[];
	clusters: TopicCluster[];
}) {
	return (
		<div className="flex flex-col lg:flex-row gap-6">
			{/* Featured guides — ~58% on desktop */}
			<div className="w-full lg:w-[58%]">
				<h3 className="text-base font-semibold text-[#0F172A] dark:text-white">Featured guides</h3>
				<div className="mt-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
					{featured.map(guide => (
						<div
							key={guide.href + guide.title}
							className="w-full md:basis-[calc(50%-8px)]"
						>
							<Link
								href={guide.href}
								className="group flex items-center gap-3 md:flex-col md:items-stretch md:gap-0 bg-white/90 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl md:rounded-[30px] p-3 sm:p-4 md:p-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.99] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
							>
								<div className="flex-1 min-w-0">
									<div className="text-sm sm:text-base font-semibold text-[#0F172A] dark:text-white">{guide.title}</div>
									<p className="mt-1 md:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{guide.description}</p>
								</div>
								<div className="shrink-0 text-sm font-semibold text-[#4ECDC4] group-hover:translate-x-0.5 transition-transform md:mt-4">
									Read →
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>

			{/* Topic clusters — ~40% on desktop */}
			<div className="w-full lg:flex-1">
				<div className="h-full bg-white/90 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl sm:rounded-[30px] p-3 sm:p-4 md:p-6 shadow-xl">
					<h3 className="text-base font-semibold text-[#0F172A] dark:text-white">Topic clusters</h3>
					<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Start with a topic hub, then pick a specific guide.</p>
					<div className="mt-4 flex flex-col gap-3">
						{clusters.map(cluster => (
							<Link
								key={cluster.key}
								href={cluster.href}
								className="group rounded-2xl border border-black/5 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm hover:border-[#4ECDC4]/40 hover:bg-[#4ECDC4]/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
							>
								<div className="font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4ECDC4] transition-colors">
									{cluster.title}
								</div>
								<div className="mt-1 text-slate-500 dark:text-slate-400">{cluster.description}</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
