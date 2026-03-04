import Link from 'next/link';

export interface ToolLink {
	label: string;
	href: string;
}

export interface ToolsGroup {
	title: string;
	items: ToolLink[];
}

export function ToolsToday({ groups }: { groups: ToolsGroup[] }) {
	return (
		<div className="flex flex-col md:flex-row md:flex-wrap gap-4">
			{groups.map(group => (
				<div
					key={group.title}
					className="basis-full md:basis-[calc(50%-8px)]"
				>
					<div className="h-full bg-white/90 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[30px] p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
						<div className="flex items-center justify-between">
							<h3 className="text-base font-semibold text-[#0F172A] dark:text-white">{group.title}</h3>
							<span aria-hidden="true" className="text-[#4ECDC4]">↗</span>
						</div>
						<div className="mt-4 space-y-2 text-sm">
							{group.items.map(item => (
								<Link
									key={item.href + item.label}
									href={item.href}
									className="block rounded-xl px-3 py-2 font-semibold text-[#0F172A]/80 dark:text-white/80 hover:text-[#4ECDC4] dark:hover:text-[#4ECDC4] hover:bg-[#4ECDC4]/8 underline-offset-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
