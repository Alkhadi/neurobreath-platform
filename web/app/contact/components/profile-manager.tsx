"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import {
  type Profile,
  getNbcardSavedNamespace,
  getOrCreateNbcardDeviceId,
  loadNbcardSavedCards,
  upsertNbcardSavedCard,
} from "@/lib/utils";
import { GradientSelector } from "./gradient-selector";
import { FrameChooser } from "./frame-chooser";
import { FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { storeAsset, generateAssetKey } from "../lib/nbcard-assets";
import {
  clearProfileDraft,
  loadProfileDraft,
  normalizeProfileForCategory,
  saveProfileDraft,
} from "@/lib/nbcard-saved-cards";

type FrameCategory = "ADDRESS" | "BANK" | "BUSINESS";

interface ProfileManagerProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onDelete?: () => void;
  onClose: () => void;
  isNew?: boolean;
  userEmail?: string; // For IndexedDB namespace
}

export function ProfileManager({ profile, onSave, onDelete, onClose, isNew = false, userEmail }: ProfileManagerProps) {
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showFrameChooser, setShowFrameChooser] = useState(false);
  const initialFrameCategory: FrameCategory =
    profile.cardCategory === "BANK" || profile.cardCategory === "BUSINESS" || profile.cardCategory === "ADDRESS"
      ? profile.cardCategory
      : "ADDRESS";
  const [selectedFrameCategory, setSelectedFrameCategory] = useState<FrameCategory>(initialFrameCategory);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const draftTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasRestoredDraftRef = useRef(false);
  const didInitRef = useRef(false);
  
  // LIVE BACKGROUND PREVIEW: objectURL for instant preview before upload completes
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<string | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSession()
      .then((s) => {
        if (cancelled) return;
        const email = (s?.user?.email ?? "").toString().trim().toLowerCase();
        setSessionEmail(email && email.includes("@") ? email : null);
      })
      .catch(() => {
        // ignore
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveUserEmail = sessionEmail ?? userEmail;
  const deviceId = getOrCreateNbcardDeviceId();
  const namespace = getNbcardSavedNamespace(effectiveUserEmail ?? deviceId);
  const assetNamespace = sessionEmail ?? deviceId;

  // Restore locally persisted draft (so autosave doesn't need to call onSave / close modal)
  useEffect(() => {
    if (hasRestoredDraftRef.current) return;
    if (!profile.id) return;

    const draft = loadProfileDraft(namespace, profile.id);
    if (draft && typeof draft === "object") {
      setEditedProfile(draft);
      toast.message("Restored unsaved changes", { description: "Your draft was saved on this device." });
    }
    hasRestoredDraftRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, profile.id]);

  // Draft autosave: debounced local persistence only (never closes modal)
  const persistDraft = useCallback(() => {
    if (!profile.id) return;
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);

    setSaveStatus("saving");
    draftTimerRef.current = setTimeout(() => {
      try {
        saveProfileDraft(namespace, editedProfile);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("idle");
      }
    }, 600);
  }, [editedProfile, namespace, profile.id]);

  // Trigger draft persistence when editedProfile changes (except initial mount)
  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      return;
    }
    if (editedProfile === profile) return;
    persistDraft();
  }, [editedProfile, persistDraft, profile]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // LIVE PREVIEW: Create objectURL immediately for instant preview
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreviewUrl(previewUrl);
    setEditedProfile({ ...editedProfile, photoUrl: previewUrl });

    setUploading(true);

    try {
      // Store in IndexedDB as local asset
      const assetKey = generateAssetKey("avatar");
      const localUrl = await storeAsset(file, assetKey, assetNamespace);

      setEditedProfile({ ...editedProfile, photoUrl: localUrl });
      setPhotoPreviewUrl(null); // Clear preview once upload completes
      URL.revokeObjectURL(previewUrl);
      toast.success("Photo uploaded and stored locally");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // LIVE PREVIEW: Create objectURL immediately for instant background preview
    if (backgroundPreviewUrl) URL.revokeObjectURL(backgroundPreviewUrl);
    const previewUrl = URL.createObjectURL(file);
    setBackgroundPreviewUrl(previewUrl);
    setEditedProfile({ ...editedProfile, backgroundUrl: previewUrl, frameUrl: undefined });

    setUploading(true);

    try {
      // Store in IndexedDB as local asset
      const assetKey = generateAssetKey("bg");
      const localUrl = await storeAsset(file, assetKey, assetNamespace);

      setEditedProfile({ ...editedProfile, backgroundUrl: localUrl, frameUrl: undefined });
      setBackgroundPreviewUrl(null); // Clear preview once upload completes
      URL.revokeObjectURL(previewUrl);
      toast.success("Background uploaded and stored locally");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload background");
    } finally {
      setUploading(false);
    }
  };

  const handleClearBackground = () => {
    setEditedProfile({ ...editedProfile, backgroundUrl: undefined, frameUrl: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.id) {
      clearProfileDraft(namespace, profile.id);
    }

    // If this profile corresponds to a Saved Card, persist it back automatically.
    // This makes Saved Cards fully editable via the existing modal.
    try {
      const saved = loadNbcardSavedCards(namespace);
      const existing = saved.find((c) => c.id === editedProfile.id);
      if (existing) {
        upsertNbcardSavedCard(namespace, {
          ...existing,
          category: existing.category,
          title: existing.title,
          createdAt: existing.createdAt,
          snapshot: normalizeProfileForCategory(editedProfile, existing.category),
        });
      }
    } catch {
      // Best-effort; still allow primary save.
    }

    onSave(editedProfile);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{isNew ? "Create New Profile" : "Edit Profile"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors" aria-label="Close">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Gradient Selector */}
          <GradientSelector
            selectedGradient={editedProfile.gradient}
            onSelect={(gradient) => setEditedProfile({ ...editedProfile, gradient })}
            onClearBackground={editedProfile.backgroundUrl ? handleClearBackground : undefined}
          />

          {/* Background Upload */}
          <div>
            <label htmlFor="profile-background" className="block text-sm font-semibold text-gray-700 mb-2">
              Card Background (optional)
            </label>

            {/* Professional Frames Section */}
            <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Professional frames made for you</h4>
              <p className="text-xs text-gray-600 mb-3">
                Choose a frame style for how you want your profile presented: Address details, Bank details, or Business profile.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setSelectedFrameCategory("ADDRESS")}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    selectedFrameCategory === "ADDRESS"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Address details
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFrameCategory("BANK")}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    selectedFrameCategory === "BANK"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Bank details
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFrameCategory("BUSINESS")}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    selectedFrameCategory === "BUSINESS"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Business profile
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowFrameChooser(true)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Browse Professional Frames
              </button>
            </div>

            <input
              ref={backgroundInputRef}
              id="profile-background"
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="hidden"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => backgroundInputRef.current?.click()}
                disabled={uploading}
                className="flex-1 px-4 py-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : editedProfile.backgroundUrl || editedProfile.frameUrl
                  ? "Change Background Image"
                  : "Upload Background Image"}
              </button>
              {(editedProfile.backgroundUrl || editedProfile.frameUrl) && (
                <button
                  type="button"
                  onClick={handleClearBackground}
                  className="px-4 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Use Gradient
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">Uploads fall back to your device if the server is unavailable.</p>
          </div>

          {/* Photo Upload */}
          <div>
            <label htmlFor="profile-photo" className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Photo
            </label>
            <input
              ref={fileInputRef}
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full px-4 py-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading..." : editedProfile.photoUrl ? "Change Photo" : "Upload Photo"}
            </button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-full-name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="profile-full-name"
                type="text"
                required
                value={editedProfile.fullName}
                onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="profile-job-title" className="block text-sm font-semibold text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                id="profile-job-title"
                type="text"
                required
                value={editedProfile.jobTitle}
                onChange={(e) => setEditedProfile({ ...editedProfile, jobTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone *
              </label>
              <input
                id="profile-phone"
                type="tel"
                required
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="profile-email"
                type="email"
                required
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label htmlFor="profile-description" className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Description ({editedProfile.profileDescription.length}/50)
            </label>
            <input
              id="profile-description"
              type="text"
              maxLength={50}
              value={editedProfile.profileDescription}
              onChange={(e) => setEditedProfile({ ...editedProfile, profileDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="business-description" className="block text-sm font-semibold text-gray-700 mb-2">
              Business Description ({editedProfile.businessDescription.length}/50)
            </label>
            <input
              id="business-description"
              type="text"
              maxLength={50}
              value={editedProfile.businessDescription}
              onChange={(e) => setEditedProfile({ ...editedProfile, businessDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
                { key: "website", label: "Website", placeholder: "https://yourwebsite.com" },
                { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourname" },
                { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourname" },
                { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourname" },
                { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname" },
                { key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/yourname" },
              ] as const).map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label htmlFor={`social-${key}`} className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="url"
                    id={`social-${key}`}
                    name={`social-${key}`}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    inputMode="url"
                    value={editedProfile.socialMedia?.[key] ?? ""}
                    onChange={(e) => {
                      let value = e.target.value.trim();
                      // Normalize website URLs: add https:// if missing scheme
                      if (key === "website" && value && !value.match(/^https?:\/\//i)) {
                        value = `https://${value}`;
                      }
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, [key]: value },
                      });
                    }}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card Details Section (Category-specific inputs) */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Card Details</h3>
              {saveStatus === "saving" && (
                <span className="text-sm text-gray-500 italic">Saving...</span>
              )}
              {saveStatus === "saved" && (
                <span className="text-sm text-green-600 font-semibold">✓ Saved</span>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Fill in details specific to the category you selected above ({selectedFrameCategory}).
              These will appear on your card.
            </p>

            {/* ADDRESS CARD FIELDS */}
            {selectedFrameCategory === "ADDRESS" && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-gray-800">Address Card</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedProfile({
                        ...editedProfile,
                        cardCategory: "ADDRESS",
                        addressCard: {},
                      });
                      toast.success("Address fields reset");
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Reset this section
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address-line1" className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 1
                    </label>
                    <input
                      id="address-line1"
                      type="text"
                      value={editedProfile.addressCard?.addressLine1 ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "ADDRESS",
                          addressCard: { ...editedProfile.addressCard, addressLine1: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="address-line2" className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      id="address-line2"
                      type="text"
                      value={editedProfile.addressCard?.addressLine2 ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "ADDRESS",
                          addressCard: { ...editedProfile.addressCard, addressLine2: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="address-city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      id="address-city"
                      type="text"
                      value={editedProfile.addressCard?.city ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "ADDRESS",
                          addressCard: { ...editedProfile.addressCard, city: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="address-postcode" className="block text-sm font-semibold text-gray-700 mb-2">
                      Postcode
                    </label>
                    <input
                      id="address-postcode"
                      type="text"
                      value={editedProfile.addressCard?.postcode ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "ADDRESS",
                          addressCard: { ...editedProfile.addressCard, postcode: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="address-country" className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      id="address-country"
                      type="text"
                      value={editedProfile.addressCard?.country ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "ADDRESS",
                          addressCard: { ...editedProfile.addressCard, country: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="address-map-label" className="block text-sm font-semibold text-gray-700 mb-2">
                      Map Link Label
                    </label>
                    <input
                      id="address-map-label"
                      type="text"
                      placeholder="Click Here"
                      value={editedProfile.addressCard?.mapLinkLabel ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "ADDRESS",
                          addressCard: { ...editedProfile.addressCard, mapLinkLabel: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address-directions" className="block text-sm font-semibold text-gray-700 mb-2">
                    Directions Note (short)
                  </label>
                  <input
                    id="address-directions"
                    type="text"
                    maxLength={60}
                    value={editedProfile.addressCard?.directionsNote ?? ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        cardCategory: "ADDRESS",
                        addressCard: { ...editedProfile.addressCard, directionsNote: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="address-map-override" className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Map Query (optional, overrides address fields)
                  </label>
                  <input
                    id="address-map-override"
                    type="text"
                    value={editedProfile.addressCard?.mapQueryOverride ?? ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        cardCategory: "ADDRESS",
                        addressCard: { ...editedProfile.addressCard, mapQueryOverride: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* BANK CARD FIELDS */}
            {selectedFrameCategory === "BANK" && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-gray-800">Bank Card</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedProfile({
                        ...editedProfile,
                        cardCategory: "BANK",
                        bankCard: {},
                      });
                      toast.success("Bank fields reset");
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Reset this section
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bank-account-name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      id="bank-account-name"
                      type="text"
                      value={editedProfile.bankCard?.accountName ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BANK",
                          bankCard: { ...editedProfile.bankCard, accountName: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="bank-name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      id="bank-name"
                      type="text"
                      value={editedProfile.bankCard?.bankName ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BANK",
                          bankCard: { ...editedProfile.bankCard, bankName: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="bank-sort-code" className="block text-sm font-semibold text-gray-700 mb-2">
                      Sort Code
                    </label>
                    <input
                      id="bank-sort-code"
                      type="text"
                      value={editedProfile.bankCard?.sortCode ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BANK",
                          bankCard: { ...editedProfile.bankCard, sortCode: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="bank-account-number" className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      id="bank-account-number"
                      type="text"
                      value={editedProfile.bankCard?.accountNumber ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BANK",
                          bankCard: { ...editedProfile.bankCard, accountNumber: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="bank-iban" className="block text-sm font-semibold text-gray-700 mb-2">
                      IBAN (optional)
                    </label>
                    <input
                      id="bank-iban"
                      type="text"
                      value={editedProfile.bankCard?.iban ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BANK",
                          bankCard: { ...editedProfile.bankCard, iban: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="bank-swift" className="block text-sm font-semibold text-gray-700 mb-2">
                      SWIFT/BIC (optional)
                    </label>
                    <input
                      id="bank-swift"
                      type="text"
                      value={editedProfile.bankCard?.swiftBic ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BANK",
                          bankCard: { ...editedProfile.bankCard, swiftBic: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="bank-payment-link" className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Link (optional)
                    </label>
                    <input
                      id="bank-payment-link"
                      type="url"
                      value={editedProfile.bankCard?.paymentLink ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BANK",
                          bankCard: { ...editedProfile.bankCard, paymentLink: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="bank-payment-label" className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Link Label
                    </label>
                    <input
                      id="bank-payment-label"
                      type="text"
                      placeholder="Send Money"
                      value={editedProfile.bankCard?.paymentLinkLabel ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BANK",
                          bankCard: { ...editedProfile.bankCard, paymentLinkLabel: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="bank-reference" className="block text-sm font-semibold text-gray-700 mb-2">
                    Reference Note (short)
                  </label>
                  <input
                    id="bank-reference"
                    type="text"
                    maxLength={60}
                    value={editedProfile.bankCard?.referenceNote ?? ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        cardCategory: "BANK",
                        bankCard: { ...editedProfile.bankCard, referenceNote: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* BUSINESS CARD FIELDS */}
            {selectedFrameCategory === "BUSINESS" && (
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-gray-800">Business Card</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedProfile({
                        ...editedProfile,
                        cardCategory: "BUSINESS",
                        businessCard: {},
                      });
                      toast.success("Business fields reset");
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Reset this section
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="business-company-name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      id="business-company-name"
                      type="text"
                      value={editedProfile.businessCard?.companyName ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BUSINESS",
                          businessCard: { ...editedProfile.businessCard, companyName: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="business-website" className="block text-sm font-semibold text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      id="business-website"
                      type="url"
                      value={editedProfile.businessCard?.websiteUrl ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BUSINESS",
                          businessCard: { ...editedProfile.businessCard, websiteUrl: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="business-services" className="block text-sm font-semibold text-gray-700 mb-2">
                      Services (max 80 chars)
                    </label>
                    <input
                      id="business-services"
                      type="text"
                      maxLength={80}
                      value={editedProfile.businessCard?.services ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BUSINESS",
                          businessCard: { ...editedProfile.businessCard, services: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="business-location" className="block text-sm font-semibold text-gray-700 mb-2">
                      Location Note (short)
                    </label>
                    <input
                      id="business-location"
                      type="text"
                      maxLength={60}
                      value={editedProfile.businessCard?.locationNote ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BUSINESS",
                          businessCard: { ...editedProfile.businessCard, locationNote: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="business-hours" className="block text-sm font-semibold text-gray-700 mb-2">
                      Hours (short)
                    </label>
                    <input
                      id="business-hours"
                      type="text"
                      maxLength={60}
                      value={editedProfile.businessCard?.hours ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BUSINESS",
                          businessCard: { ...editedProfile.businessCard, hours: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="business-booking-link" className="block text-sm font-semibold text-gray-700 mb-2">
                      Booking Link (optional)
                    </label>
                    <input
                      id="business-booking-link"
                      type="url"
                      value={editedProfile.businessCard?.bookingLink ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BUSINESS",
                          businessCard: { ...editedProfile.businessCard, bookingLink: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="business-booking-label" className="block text-sm font-semibold text-gray-700 mb-2">
                      Booking Link Label
                    </label>
                    <input
                      id="business-booking-label"
                      type="text"
                      placeholder="Book Now"
                      value={editedProfile.businessCard?.bookingLinkLabel ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BUSINESS",
                          businessCard: { ...editedProfile.businessCard, bookingLinkLabel: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="business-vat" className="block text-sm font-semibold text-gray-700 mb-2">
                      VAT/Reg No (optional)
                    </label>
                    <input
                      id="business-vat"
                      type="text"
                      value={editedProfile.businessCard?.vatOrRegNo ?? ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          cardCategory: "BUSINESS",
                          businessCard: { ...editedProfile.businessCard, vatOrRegNo: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              <FaSave /> Save Profile
            </button>
            {!isNew && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                <FaTrash /> Delete
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Frame Chooser Modal */}
      {showFrameChooser && (
        <FrameChooser
          category={selectedFrameCategory}
          onSelect={(frameUrl) => {
            setEditedProfile({ ...editedProfile, frameUrl, backgroundUrl: undefined });
            setShowFrameChooser(false);
          }}
          onClose={() => setShowFrameChooser(false)}
        />
      )}
    </div>
  );
}

