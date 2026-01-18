import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
		<Card className="rounded-3xl border-border/60 bg-card shadow-sm">
			<CardContent className="p-6 sm:p-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-xl font-semibold text-foreground">{title}</h2>
						<p className="mt-1 text-sm text-muted-foreground">{educationOnlyLine}</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button asChild className="w-full sm:w-auto rounded-xl">
							<Link href={primaryHref}>{primaryLabel}</Link>
						</Button>
						<Button asChild variant="outline" className="w-full sm:w-auto rounded-xl">
							<Link href={secondaryHref}>{secondaryLabel}</Link>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
