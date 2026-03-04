import Link from 'next/link';

export function FinalCTA({
	primaryHref,
	primaryLabel,
	secondaryHref,
	secondaryLabel,
	educationOnlyLine,
	title,
}: {
	primaryHref: string;
	primaryLabel: string;
	secondaryHref: string;
	secondaryLabel: string;
	educationOnlyLine: string;
	title: string;
}) {
	return (
		<div className="rounded-[30px] border border-black/5 dark:border-white/10 bg-white/90 dark:bg-white/5 p-6 sm:p-8 shadow-xl">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-xl font-semibold text-[#0F172A] dark:text-white">{title}</h2>
					<p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{educationOnlyLine}</p>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
					<Link
						href={primaryHref}
						className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#959E0B] to-[#4ECDC4] shadow-2xl hover:shadow-2xl hover:scale-[1.015] active:scale-[0.99] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
					>
						{primaryLabel}
					</Link>
					<Link
						href={secondaryHref}
						className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold bg-white/90 dark:bg-white/5 border border-[#4ECDC4]/30 dark:border-white/15 text-[#0F172A] dark:text-white hover:bg-[#4ECDC4]/10 dark:hover:bg-white/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
					>
						{secondaryLabel}
					</Link>
				</div>
			</div>
		</div>
	);
}
