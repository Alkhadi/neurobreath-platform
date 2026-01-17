import { BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { focusEvidenceByRegion } from '@/lib/focus/data';
import type { Region } from '@/lib/region/region';
import { FocusDownloadButton } from './FocusDownloadButton';

interface FocusEvidenceProps {
  region: Region;
}

export function FocusEvidence({ region }: FocusEvidenceProps) {
  const evidence = focusEvidenceByRegion[region];
  const regionLabel = region === 'UK' ? 'UK' : 'US';

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">
        Evidence &amp; {regionLabel} resources
      </h3>
      <ul className="space-y-2 mb-6">
        {evidence.links.map((link, idx) => (
          <li key={idx}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              {link.title}
            </a>
          </li>
        ))}
      </ul>
      <FocusDownloadButton />
    </Card>
  );
}
