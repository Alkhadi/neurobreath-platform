'use client';

import { useMemo, useState } from 'react';
import { Download, Share2, Copy, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import {
  useUserPreferencesState,
  useExportPreferences,
  useImportPreferences,
} from '@/lib/user-preferences/useUserPreferences';
import type { SavedItem } from '@/lib/user-preferences/schema';

function downloadTextFile(filename: string, text: string, mime = 'text/plain') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function toCsvValue(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function buildSavedItemsCsv(savedItems: SavedItem[], includeNotes: boolean): string {
  const header = ['type', 'title', 'href', 'tags', 'savedAt', ...(includeNotes ? ['note'] : [])];

  const rows = savedItems.map((item) => {
    const tags = item.tags?.join('|') ?? '';
    const base = [item.type, item.title, item.href, tags, item.savedAt];
    const full = includeNotes ? [...base, item.note ?? ''] : base;
    return full.map((v) => toCsvValue(String(v ?? ''))).join(',');
  });

  return [header.join(','), ...rows].join('\n');
}

function buildShareSummary(opts: {
  savedItems: SavedItem[];
  journeyCount: number;
  routineCount: number;
  includeLinks: boolean;
  includeNotes: boolean;
}): string {
  const { savedItems, journeyCount, routineCount, includeLinks, includeNotes } = opts;

  const lines: string[] = [];
  lines.push('NeuroBreath — My Plan Summary');
  lines.push(new Date().toLocaleString());
  lines.push('');
  lines.push(`Saved items: ${savedItems.length}`);
  lines.push(`Journeys in progress: ${journeyCount}`);
  lines.push(`Routine slots: ${routineCount}`);

  if (savedItems.length > 0) {
    lines.push('');
    lines.push('Saved items (top 10):');
    savedItems.slice(0, 10).forEach((item, idx) => {
      const parts: string[] = [];
      parts.push(`${idx + 1}. [${item.type}] ${item.title}`);
      if (includeLinks) parts.push(`(${item.href})`);
      lines.push(parts.join(' '));
      if (includeNotes && item.note?.trim()) {
        lines.push(`   Note: ${item.note.trim()}`);
      }
    });

    if (savedItems.length > 10) {
      lines.push(`...and ${savedItems.length - 10} more.`);
    }
  }

  lines.push('');
  lines.push('Privacy note: this summary is generated locally on your device.');

  return lines.join('\n');
}

export function ExportShareMyPlan() {
  const { myPlan } = useUserPreferencesState();
  const exportPreferences = useExportPreferences();
  const importPreferences = useImportPreferences();

  const savedItems = useMemo(() => myPlan.savedItems ?? [], [myPlan.savedItems]);
  const journeyCount = Object.keys(myPlan.journeyProgress || {}).length;
  const routineCount = myPlan.routinePlan?.slots?.length || 0;

  const [open, setOpen] = useState(false);
  const [includeLinks, setIncludeLinks] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(false);

  const shareText = useMemo(() => {
    return buildShareSummary({
      savedItems,
      journeyCount,
      routineCount,
      includeLinks,
      includeNotes,
    });
  }, [savedItems, journeyCount, routineCount, includeLinks, includeNotes]);

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleDownloadBackup = () => {
    try {
      const json = exportPreferences();
      downloadTextFile(
        `neurobreath-preferences-${new Date().toISOString().split('T')[0]}.nbx`,
        json,
        'application/json'
      );
      toast.success('Backup downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export backup');
    }
  };

  const handleImportBackup = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.nbx,application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        importPreferences(text);
        toast.success('Imported successfully');
      } catch (err) {
        console.error(err);
        toast.error('Import failed: invalid file');
      }
    };
    input.click();
  };

  const handleDownloadCsv = () => {
    try {
      const csv = buildSavedItemsCsv(savedItems, includeNotes);
      downloadTextFile(
        `neurobreath-my-plan-${new Date().toISOString().split('T')[0]}.csv`,
        csv,
        'text/csv'
      );
      toast.success('CSV downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export CSV');
    }
  };

  const handleCopySummary = async () => {
    const ok = await copyToClipboard(shareText);
    if (ok) toast.success('Copied to clipboard');
    else toast.error('Copy failed');
  };

  const handleShare = async () => {
    if (!canShare) {
      await handleCopySummary();
      return;
    }

    try {
      await navigator.share({
        title: 'NeuroBreath — My Plan Summary',
        text: shareText,
      });
    } catch {
      // user cancelled; no toast
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Share2 className="w-4 h-4 mr-2" />
        Share / Export
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-md hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Share / Export My Plan
            </DialogTitle>
            <DialogDescription>
              Export a backup file, download a CSV, or share a summary. Everything happens locally on your device.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={handleDownloadBackup} className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download backup (.nbx)
              </Button>
              <Button onClick={handleImportBackup} className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Import backup (.nbx)
              </Button>
              <Button onClick={handleDownloadCsv} className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download saved items (.csv)
              </Button>
            </div>

            <div className="grid gap-4 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label className="text-sm font-medium">Include links</Label>
                  <p className="text-xs text-muted-foreground">Adds item paths like /tools/…</p>
                </div>
                <Switch checked={includeLinks} onCheckedChange={setIncludeLinks} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label className="text-sm font-medium">Include personal notes</Label>
                  <p className="text-xs text-muted-foreground">Notes may contain sensitive info</p>
                </div>
                <Switch checked={includeNotes} onCheckedChange={setIncludeNotes} />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopySummary} variant="secondary">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy summary
                </Button>
                <Button onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  {canShare ? 'Share…' : 'Share (copy)'}
                </Button>
              </div>

              <div className="rounded-md bg-muted/40 p-3">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed">
                  {shareText}
                </pre>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
