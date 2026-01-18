import type { Metadata } from 'next';
import {
	CoachHubHero,
	CoachQuickStarts,
	CoachPrintables,
	CoachSafeguarding,
	CoachNextSteps,
	CoachNotice,
} from '@/components/coach-hub';

export const metadata: Metadata = {
	title: 'Coach Hub',
	description:
		'Fast briefings, printable resources, and breathing plans for educators, coaches, and support staff. Educational information only; not medical advice.',
	openGraph: {
		title: 'Coach Hub · NeuroBreath',
		description:
			'Fast briefings, printable resources, and breathing plans for educators, coaches, and support staff.',
		type: 'website',
	},
};

export default function CoachPage() {
	return (
		<main id="main-content" tabIndex={-1}>
			<CoachHubHero />
			<CoachQuickStarts />
			<CoachPrintables />
			<CoachSafeguarding />
			<CoachNextSteps />
			<CoachNotice label="AI coach" />
		</main>
	);
}
