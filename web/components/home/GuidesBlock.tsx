import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

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
		<div className="grid gap-6 lg:grid-cols-12">
			<div className="lg:col-span-7">
				<h3 className="text-base font-semibold text-foreground">Featured guides</h3>
				<div className="mt-4 grid gap-4 sm:grid-cols-2">
					{featured.map(guide => (
						<Card key={guide.href + guide.title} className="h-full rounded-2xl border-border/60 bg-card shadow-sm">
							<Link
								href={guide.href}
								className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								<CardContent className="p-6">
									<div className="text-base font-semibold text-foreground">{guide.title}</div>
									<p className="mt-2 text-sm text-muted-foreground">{guide.description}</p>
									<div className="mt-4 text-sm font-semibold text-foreground">Read →</div>
								</CardContent>
							</Link>
						</Card>
					))}
				</div>
			</div>
			<div className="lg:col-span-5">
				<Card className="rounded-2xl border-border/60 bg-card shadow-sm">
					<CardContent className="p-6">
						<h3 className="text-base font-semibold text-foreground">Topic clusters</h3>
						<p className="mt-1 text-sm text-muted-foreground">Start with a topic hub, then pick a specific guide.</p>
						<div className="mt-4 grid gap-3">
							{clusters.map(cluster => (
								<Link
									key={cluster.key}
									href={cluster.href}
									className="rounded-xl border border-border/60 bg-background/40 px-4 py-3 text-sm hover:bg-accent/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								>
									<div className="font-semibold text-foreground">{cluster.title}</div>
									<div className="mt-1 text-muted-foreground">{cluster.description}</div>
								</Link>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
