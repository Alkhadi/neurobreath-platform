import RegionHomePage, { generateMetadata as regionGenerateMetadata } from '../[region]/page';
import type { Metadata } from 'next';

const params = Promise.resolve({ region: 'uk' });

export async function generateMetadata(): Promise<Metadata> {
	return regionGenerateMetadata({ params });
}

export default function UkHomePage() {
	return RegionHomePage({ params });
}
