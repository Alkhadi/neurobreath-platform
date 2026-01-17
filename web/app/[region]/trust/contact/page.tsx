import { TrustContactPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: { region: string };
}

export default function RegionTrustContact({ params }: RegionPageProps) {
  return <TrustContactPage region={getRegionFromKey(params.region)} />;
}
