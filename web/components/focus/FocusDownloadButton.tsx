'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FocusDownloadButton() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/legacy-assets/assets/downloads/focus-resources.pdf';
    link.download = 'focus-sprints-recovery-resources.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button className="w-full md:w-auto" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download: Focus — Sprints with Recovery — Resources (PDF)
    </Button>
  );
}
