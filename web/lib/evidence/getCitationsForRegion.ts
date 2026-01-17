import type { EvidenceManifest, EvidenceRegion } from './types';
import type { Region } from '@/lib/region/region';
import { evidenceSources } from './evidence-registry';

export function resolveCitationIds(manifest: EvidenceManifest, region: EvidenceRegion | Region): string[] {
  const regionKey: EvidenceRegion = region === 'US' ? 'US' : region === 'UK' ? 'UK' : 'GLOBAL';
  if (manifest.citationsByRegion) {
    const regional = manifest.citationsByRegion[regionKey] || [];
    const global = manifest.citationsByRegion.GLOBAL || [];
    return [...regional, ...global];
  }
  return manifest.citations || [];
}

export function getCitationsForRegion(manifest: EvidenceManifest, region: EvidenceRegion | Region) {
  const ids = resolveCitationIds(manifest, region);
  return ids
    .map(id => evidenceSources[id])
    .filter(Boolean);
}
