"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type ShareMode = "image" | "text";

type Props = {
  open: boolean;
  onSelect: (mode: ShareMode) => void;
  onCancel: () => void;
  /** Label shown in the dialog title, e.g. "WhatsApp" */
  channel?: string;
};

export function ShareModeDialog({
  open,
  onSelect,
  onCancel,
  channel = "Share",
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onCancel();
      }}
    >
      <DialogContent className="max-w-sm" data-testid="share-mode-dialog">
        <DialogHeader>
          <DialogTitle>Share via {channel}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Button
            type="button"
            variant="outline"
            className="justify-start gap-3 h-auto py-4 text-left"
            onClick={() => onSelect("image")}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              &#128444;
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">Share as Image</span>
              <span className="text-xs text-muted-foreground font-normal">
                Exact canvas capture (background + avatar + all layers). On desktop the image will be downloaded.
              </span>
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start gap-3 h-auto py-4 text-left"
            onClick={() => onSelect("text")}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              &#128203;
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">Share as Text</span>
              <span className="text-xs text-muted-foreground font-normal">
                Professionally formatted contact details + card preview link (works everywhere)
              </span>
            </span>
          </Button>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
