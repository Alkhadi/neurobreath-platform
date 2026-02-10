"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg border-purple-300 hover:bg-purple-50 z-40"
        aria-label="Help and quick start tips"
      >
        <HelpCircle className="h-6 w-6 text-purple-600" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              NB-Card Quick Start
            </DialogTitle>
            <DialogDescription>
              Your profile card toolkit — fast, private, and offline-ready.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Saved Locally */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Saved Locally</h4>
              <p className="text-sm text-blue-800">
                Your cards are stored on this device only. Nothing is uploaded to the cloud unless you explicitly
                share.
              </p>
            </div>

            {/* How to Backup */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">How to Back Up</h4>
              <p className="text-sm text-gray-700 mb-2">
                Scroll down to the <strong>"Your Data"</strong> section and tap <strong>"Export All Cards"</strong> to
                download a backup file. Keep this file safe!
              </p>
            </div>

            {/* Sharing Methods */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Best Sharing Methods</h4>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>
                  <strong>QR Code:</strong> Show your QR code for others to scan (no internet needed).
                </li>
                <li>
                  <strong>vCard:</strong> Save as a contact file, then share via email or messaging apps.
                </li>
                <li>
                  <strong>PNG/PDF:</strong> Save as an image or PDF for easy sharing.
                </li>
              </ul>
            </div>

            {/* Platform Tips */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Platform Tips</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>
                  <strong>iOS:</strong> After downloading a vCard, open it from Files app to import to Contacts.
                </li>
                <li>
                  <strong>Android:</strong> Use the share menu to send files directly via messaging apps.
                </li>
                <li>
                  <strong>Desktop:</strong> Right-click links to copy or download files.
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close help"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
