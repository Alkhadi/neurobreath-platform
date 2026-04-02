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
		<div className="rounded-2xl md:rounded-[30px] border border-black/5 dark:border-white/10 bg-white/90 dark:bg-white/5 p-3 sm:p-5 md:p-8 shadow-xl">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="min-w-0">
					<h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#0F172A] dark:text-white">{title}</h2>
					<p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">{educationOnlyLine}</p>
				</div>
				<div className="flex flex-row gap-2 sm:gap-3 md:shrink-0">
					<Link href={primaryHref} className="nb-btn-primary text-xs sm:text-sm">
						{primaryLabel}
					</Link>
					<Link href={secondaryHref} className="nb-btn-secondary text-xs sm:text-sm">
						{secondaryLabel}
					</Link>
				</div>
			</div>
		</div>
	);
}
