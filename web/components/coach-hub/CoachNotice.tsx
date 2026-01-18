import { Card, CardContent } from '@/components/ui/card';
import { HomeSection } from '@/components/home/Section';
import { Bot } from 'lucide-react';

interface CoachNoticeProps {
	label?: string;
}

export function CoachNotice({ label = 'AI coach' }: CoachNoticeProps) {
	return (
		<HomeSection>
			<Card
				role="note"
				aria-live="polite"
				className="rounded-2xl border-border/60 bg-muted/30 shadow-sm"
			>
				<CardContent className="p-6">
					<div className="flex items-start gap-4">
						<div
							aria-hidden="true"
							className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-background border border-border/60 text-foreground"
						>
							<Bot className="h-5 w-5" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-sm font-semibold text-foreground">{label}</p>
							<p className="mt-1 text-sm text-muted-foreground leading-relaxed">
								This resource hub is designed for educators, coaches, and support staff. The
								techniques and materials are educational only and do not replace professional medical
								advice. Always consult appropriate professionals for individual care needs.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</HomeSection>
	);
}
