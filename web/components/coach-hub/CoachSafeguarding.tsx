import { Card, CardContent } from '@/components/ui/card';
import { HomeSection } from '@/components/home/Section';
import { Shield } from 'lucide-react';

const reminders = [
	'Invite, never force, participation. Offer opt-out gestures and quieter alternatives.',
	'Keep holds short for anyone with respiratory, cardiovascular, or trauma histories.',
	'Partner with the person\'s clinician or guardian before adding breathing plans to care programmes.',
];

export function CoachSafeguarding() {
	return (
		<HomeSection id="coach-safeguarding" withDivider>
			<Card className="rounded-2xl border-border/60 bg-card shadow-sm">
				<CardContent className="p-6 sm:p-8">
					<div className="flex items-start gap-4">
						<div
							aria-hidden="true"
							className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-foreground"
						>
							<Shield className="h-5 w-5" />
						</div>
						<div className="min-w-0 flex-1">
							<h2 id="coach-safeguarding-heading" className="text-lg font-semibold text-foreground">
								Safeguarding reminders
							</h2>

							<ul className="mt-4 space-y-2">
								{reminders.map((reminder, index) => (
									<li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
										<span
											aria-hidden="true"
											className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60"
										/>
										<span className="leading-relaxed">{reminder}</span>
									</li>
								))}
							</ul>

							<p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-4">
								If someone feels unwell, stop the exercise, offer normal breathing, and follow your
								organisation&apos;s escalation process.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</HomeSection>
	);
}
