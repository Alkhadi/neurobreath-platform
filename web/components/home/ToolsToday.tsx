import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

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
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{groups.map(group => (
				<Card key={group.title} className="rounded-2xl border-border/60 bg-card shadow-sm">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<h3 className="text-base font-semibold text-foreground">{group.title}</h3>
							<span aria-hidden="true" className="text-muted-foreground">↗</span>
						</div>
						<div className="mt-4 space-y-2 text-sm">
							{group.items.map(item => (
								<Link
									key={item.href + item.label}
									href={item.href}
									className="block rounded-md font-semibold text-foreground/80 hover:text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								>
									{item.label}
								</Link>
							))}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
