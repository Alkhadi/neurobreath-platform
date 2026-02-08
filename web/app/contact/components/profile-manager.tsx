"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Profile } from "@/lib/utils";
import { GradientSelector } from "./gradient-selector";
import { FrameChooser } from "./frame-chooser";
import { FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { storeAsset, generateAssetKey } from "../lib/nbcard-assets";

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
  const [uploading, setUploading] = useState(false);
  const [showFrameChooser, setShowFrameChooser] = useState(false);
  const [selectedFrameCategory, setSelectedFrameCategory] = useState<FrameCategory>("ADDRESS");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      // Store in IndexedDB as local asset
      const assetKey = generateAssetKey("avatar");
      const localUrl = await storeAsset(file, assetKey, userEmail);

      setEditedProfile({ ...editedProfile, photoUrl: localUrl });
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

    setUploading(true);

    try {
      // Store in IndexedDB as local asset
      const assetKey = generateAssetKey("bg");
      const localUrl = await storeAsset(file, assetKey, userEmail);

      setEditedProfile({ ...editedProfile, backgroundUrl: localUrl, frameUrl: undefined });
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
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, [key]: e.target.value },
                      })
                    }
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
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

