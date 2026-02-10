"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Upload, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Contact, Profile } from "@/lib/utils";
import {
  createBackup,
  validateBackup,
  migrateBackup,
  mergeCards,
  mergeContacts,
  type ConflictStrategy,
  type NBCardBackupV1,
} from "@/lib/nb-card/backup";

interface DataControlsCenterProps {
  profiles: Profile[];
  contacts: Contact[];
  onRestoreData: (profiles: Profile[], contacts: Contact[]) => void;
  onDeleteAll: () => void;
}

export function DataControlsCenter({ profiles, contacts, onRestoreData, onDeleteAll }: DataControlsCenterProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importBackup, setImportBackup] = useState<NBCardBackupV1 | null>(null);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importStrategy, setImportStrategy] = useState<ConflictStrategy>("duplicate");

  const handleExportAll = () => {
    if (profiles.length === 0) {
      toast.error("No cards to export", {
        description: "Create a card first, then export your data.",
      });
      return;
    }

    try {
      const backup = createBackup(profiles, contacts);
      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `nb-card-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();

      URL.revokeObjectURL(url);

      toast.success("Backup exported", {
        description: `${profiles.length} cards and ${contacts.length} contacts saved to file.`,
      });
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Export failed", {
        description: "Could not create backup file. Please try again.",
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const backup = validateBackup(data);

        if (!backup) {
          toast.error("Invalid backup file", {
            description: "The file you selected is not a valid NB-Card backup.",
          });
          setIsImporting(false);
          return;
        }

        const migrated = migrateBackup(backup);

        setImportBackup(migrated);
        setImportFileName(file.name);
        setImportStrategy("duplicate");
        setShowImportConfirm(true);
      } catch (error) {
        console.error("Import failed", error);
        toast.error("Import failed", {
          description: "Could not read backup file. Please check the file and try again.",
        });
      } finally {
        setIsImporting(false);
      }
    };

    input.click();
  };

  const confirmImport = () => {
    const backup = importBackup;
    if (!backup) return;

    try {
      const nextProfiles =
        importStrategy === "overwrite" ? backup.cards : mergeCards(profiles, backup.cards, importStrategy);
      const nextContacts =
        importStrategy === "overwrite" ? backup.contacts : mergeContacts(contacts, backup.contacts, importStrategy);

      onRestoreData(nextProfiles, nextContacts);

      toast.success("Backup imported", {
        description: `Imported ${backup.cards.length} cards and ${backup.contacts.length} contacts.`,
      });
    } finally {
      setShowImportConfirm(false);
      setImportBackup(null);
      setImportFileName(null);
    }
  };

  const confirmDeleteAll = () => {
    setShowDeleteConfirm(false);
    onDeleteAll();
    toast.success("All data deleted", {
      description: "Your cards and contacts have been removed from this device.",
    });
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <Info className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Data &amp; Privacy</h3>
            <p className="text-sm text-gray-600">
              Back up your cards, restore them, or delete data from this device at any time.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleExportAll}
            disabled={profiles.length === 0}
            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Export All Cards
          </Button>

          <Button
            onClick={handleImport}
            disabled={isImporting}
            variant="outline"
            className="w-full justify-start border-gray-300 hover:bg-gray-50"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isImporting ? "Importing..." : "Import Cards"}
          </Button>

          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="outline"
            className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All Data
          </Button>
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Note:</strong> Browsers can&apos;t guarantee a &ldquo;secure wipe&rdquo;, but this removes your cards from this app&apos;s storage.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Data?</DialogTitle>
            <DialogDescription>
              Are you sure? This removes all saved cards and captured contacts from this device. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAll}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Conflict Strategy Dialog (apply to all) */}
      <Dialog
        open={showImportConfirm}
        onOpenChange={(open) => {
          setShowImportConfirm(open);
          if (!open) {
            setImportBackup(null);
            setImportFileName(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import backup</DialogTitle>
            <DialogDescription>
              Choose how to handle conflicts. This selection applies to both cards and captured contacts.
            </DialogDescription>
          </DialogHeader>

          {importBackup ? (
            <div className="grid gap-4">
              <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                <div className="font-medium">File</div>
                <div className="text-muted-foreground">{importFileName ?? "backup.json"}</div>
                <div className="mt-2 text-muted-foreground">
                  Contains {importBackup.cards.length} cards and {importBackup.contacts.length} contacts.
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Conflicts</div>
                <div className="mt-3">
                  <RadioGroup value={importStrategy} onValueChange={(v) => setImportStrategy(v as ConflictStrategy)}>
                    <label className="flex items-start gap-3 rounded-md p-2 hover:bg-muted/30 cursor-pointer">
                      <RadioGroupItem value="duplicate" className="mt-1" />
                      <div>
                        <div className="text-sm font-medium">Duplicate (recommended)</div>
                        <div className="text-xs text-muted-foreground">Keeps existing items; imported duplicates get new IDs.</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-md p-2 hover:bg-muted/30 cursor-pointer">
                      <RadioGroupItem value="overwrite" className="mt-1" />
                      <div>
                        <div className="text-sm font-medium">Overwrite</div>
                        <div className="text-xs text-muted-foreground">Replaces your current cards and contacts with the backup.</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-md p-2 hover:bg-muted/30 cursor-pointer">
                      <RadioGroupItem value="skip" className="mt-1" />
                      <div>
                        <div className="text-sm font-medium">Skip duplicates</div>
                        <div className="text-xs text-muted-foreground">Only imports items with new IDs.</div>
                      </div>
                    </label>
                  </RadioGroup>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowImportConfirm(false);
                setImportBackup(null);
                setImportFileName(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmImport} disabled={!importBackup}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
