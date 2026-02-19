"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Profile } from "@/lib/utils";
import {
  type RedactableField,
  getDefaultIncludedFieldsForProfile,
  getFieldLabel,
  getPopulatedFields,
} from "@/lib/nb-card/redaction";

interface RedactionDialogProps {
  isOpen: boolean;
  profile: Profile;
  onClose: () => void;
  onConfirm: (includedFields: Set<RedactableField>) => void;
}

export function RedactionDialog({ isOpen, profile, onClose, onConfirm }: RedactionDialogProps) {
  const [includedFields, setIncludedFields] = useState<Set<RedactableField>>(new Set());

  // Initialize with default settings on open
  useEffect(() => {
    if (isOpen) {
      setIncludedFields(getDefaultIncludedFieldsForProfile(profile));
    }
  }, [isOpen, profile]);

  const toggleField = (field: RedactableField) => {
    setIncludedFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (includedFields.size === 0) {
      // Warn if no fields selected
      if (!confirm("You haven't selected any fields to share. Are you sure?")) {
        return;
      }
    }
    onConfirm(includedFields);
  };

  // Group fields by category
  const populatedFields = getPopulatedFields(profile);
  const essentialFields = populatedFields.filter((f) =>
    ["fullName", "phone", "email", "jobTitle"].includes(f)
  );
  const descriptionFields = populatedFields.filter((f) =>
    ["profileDescription", "businessDescription"].includes(f)
  );
  const socialFields = populatedFields.filter((f) =>
    ["website", "instagram", "linkedin", "twitter", "facebook"].includes(f)
  );

  const addressFields = populatedFields.filter((f) =>
    ["addressLine1", "addressLine2", "city", "postcode", "country", "directionsNote"].includes(f)
  );

  const bankFields = populatedFields.filter((f) =>
    [
      "bankAccountName",
      "bankName",
      "sortCode",
      "accountNumber",
      "iban",
      "swiftBic",
      "paymentLink",
      "referenceNote",
    ].includes(f)
  );

  const businessFields = populatedFields.filter((f) =>
    [
      "companyName",
      "tagline",
      "services",
      "websiteUrl",
      "locationNote",
      "hours",
      "bookingLink",
      "vatOrRegNo",
    ].includes(f)
  );

  const flyerFields = populatedFields.filter((f) =>
    ["flyerHeadline", "flyerSubheadline", "flyerCtaUrl"].includes(f)
  );

  const weddingFields = populatedFields.filter((f) =>
    ["weddingHeadline", "weddingSubheadline", "weddingCtaUrl"].includes(f)
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select details to share</DialogTitle>
          <DialogDescription>
            Sensitive info is off by default. Toggle on only what you want to include.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[400px] overflow-y-auto">
          {/* Essential Fields */}
          {essentialFields.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Essential Info</h4>
              <div className="space-y-2">
                {essentialFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includedFields.has(field)}
                      onCheckedChange={() => toggleField(field)}
                    />
                    <span className="text-sm text-gray-700">{getFieldLabel(field)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Descriptions */}
          {descriptionFields.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Descriptions</h4>
              <div className="space-y-2">
                {descriptionFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includedFields.has(field)}
                      onCheckedChange={() => toggleField(field)}
                    />
                    <span className="text-sm text-gray-700">{getFieldLabel(field)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Social Media */}
          {socialFields.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Social Media</h4>
              <div className="space-y-2">
                {socialFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includedFields.has(field)}
                      onCheckedChange={() => toggleField(field)}
                    />
                    <span className="text-sm text-gray-700">{getFieldLabel(field)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Address */}
          {addressFields.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Address</h4>
              <div className="space-y-2">
                {addressFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includedFields.has(field)}
                      onCheckedChange={() => toggleField(field)}
                    />
                    <span className="text-sm text-gray-700">{getFieldLabel(field)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Bank */}
          {bankFields.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Bank</h4>
              <div className="space-y-2">
                {bankFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includedFields.has(field)}
                      onCheckedChange={() => toggleField(field)}
                    />
                    <span className="text-sm text-gray-700">{getFieldLabel(field)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Business */}
          {businessFields.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Business</h4>
              <div className="space-y-2">
                {businessFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includedFields.has(field)}
                      onCheckedChange={() => toggleField(field)}
                    />
                    <span className="text-sm text-gray-700">{getFieldLabel(field)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Flyer */}
          {flyerFields.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Flyer card</h4>
              <div className="space-y-2">
                {flyerFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includedFields.has(field)}
                      onCheckedChange={() => toggleField(field)}
                    />
                    <span className="text-sm text-gray-700">{getFieldLabel(field)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Wedding */}
          {weddingFields.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Wedding card</h4>
              <div className="space-y-2">
                {weddingFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={includedFields.has(field)} onCheckedChange={() => toggleField(field)} />
                    <span className="text-sm text-gray-700">{getFieldLabel(field)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {populatedFields.length === 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-900 mb-2">Manual Canvas Sharing</h4>
              <p className="text-sm text-purple-800">
                Your card uses custom layout. When you share, the exact canvas preview (background + layers) will be captured and shared.
              </p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-2">
          <p className="text-xs text-blue-800">
            <strong>Privacy note:</strong> Unshared fields stay private on your device.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            Continue to Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
