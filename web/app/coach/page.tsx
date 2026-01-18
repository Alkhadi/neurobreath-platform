import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import {
	CoachHubHero,
	CoachQuickStarts,
	CoachPrintables,
	CoachSafeguarding,
	CoachNextSteps,
	CoachNotice,
} from '@/components/coach-hub';

export const metadata: Metadata = generatePageMetadata({
	title: 'Coach Hub',
	description:
		'Fast briefings, printable resources, and breathing plans for educators, coaches, and support staff. Educational information only; not medical advice.',
	path: '/coach',
});

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
