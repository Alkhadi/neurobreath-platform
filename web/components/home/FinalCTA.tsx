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
					<Link href={primaryHref} className="nb-btn-primary">
						{primaryLabel}
					</Link>
					<Link href={secondaryHref} className="nb-btn-secondary">
						{secondaryLabel}
					</Link>
				</div>
			</div>
		</div>
	);
}
