import RegionHomePage, { generateMetadata as regionGenerateMetadata } from '../[region]/page';
import type { Metadata } from 'next';

const params = Promise.resolve({ region: 'us' });

export async function generateMetadata(): Promise<Metadata> {
	return regionGenerateMetadata({ params });
}

export default function UsHomePage() {
	return RegionHomePage({ params });
}
