"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Profile } from "@/lib/utils";
import { GradientSelector } from "./gradient-selector";
import { FaSave, FaTimes, FaTrash } from "react-icons/fa";

interface ProfileManagerProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onDelete?: () => void;
  onClose: () => void;
  isNew?: boolean;
}

export function ProfileManager({ profile, onSave, onDelete, onClose, isNew = false }: ProfileManagerProps) {
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const toDataUrl = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(blob);
    });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    setUploading(true);

    try {
      // Get presigned URL
      const presignedRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          isPublic: true,
        }),
      });

      if (!presignedRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, cloud_storage_path } = await presignedRes.json();

      // Check if Content-Disposition header is required
      const urlObj = new URL(uploadUrl);
      const signedHeaders = urlObj.searchParams.get("X-Amz-SignedHeaders") ?? "";
      const needsContentDisposition = signedHeaders.includes("content-disposition");

      // Upload to S3
      const uploadHeaders: Record<string, string> = {
        "Content-Type": file.type,
      };
      if (needsContentDisposition) {
        uploadHeaders["Content-Disposition"] = "attachment";
      }

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: uploadHeaders,
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file");

      // Complete upload
      const completeRes = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cloud_storage_path,
          isPublic: true,
        }),
      });

      if (!completeRes.ok) throw new Error("Failed to complete upload");
      const { fileUrl } = await completeRes.json();

      setEditedProfile({ ...editedProfile, photoUrl: fileUrl });
    } catch (error) {
      console.error("Upload error:", error);

      // Fallback: store locally as data URL so avatar still updates on this device.
      try {
        const dataUrl = await toDataUrl(file);
        setEditedProfile({ ...editedProfile, photoUrl: dataUrl });
        toast.message("Photo stored locally", {
          description: "Avatar updated on this device. Upload service unavailable.",
        });
      } catch (fallbackError) {
        console.error("Local fallback failed:", fallbackError);
        toast.error("Failed to upload photo. Please try a smaller image.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClearBackground = () => {
    setEditedProfile({ ...editedProfile, backgroundUrl: undefined });
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    setUploading(true);

    try {
      const presignedRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          isPublic: true,
        }),
      });

      if (!presignedRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, cloud_storage_path } = await presignedRes.json();

      const urlObj = new URL(uploadUrl);
      const signedHeaders = urlObj.searchParams.get("X-Amz-SignedHeaders") ?? "";
      const needsContentDisposition = signedHeaders.includes("content-disposition");

      const uploadHeaders: Record<string, string> = {
        "Content-Type": file.type,
      };
      if (needsContentDisposition) {
        uploadHeaders["Content-Disposition"] = "attachment";
      }

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: uploadHeaders,
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file");

      const completeRes = await fetch("/api/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cloud_storage_path,
          isPublic: true,
        }),
      });

      if (!completeRes.ok) throw new Error("Failed to complete upload");
      const { fileUrl } = await completeRes.json();

      setEditedProfile({ ...editedProfile, backgroundUrl: fileUrl });
    } catch (error) {
      console.error("Background upload error:", error);
      try {
        const dataUrl = await toDataUrl(file);
        setEditedProfile({ ...editedProfile, backgroundUrl: dataUrl });
        toast.message("Background stored locally", {
          description: "Card background updated on this device.",
        });
      } catch (fallbackError) {
        console.error("Background local fallback failed:", fallbackError);
        toast.error("Failed to upload background. Please try a smaller image.");
      }
    } finally {
      setUploading(false);
    }
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
                  : editedProfile.backgroundUrl
                  ? "Change Background Image"
                  : "Upload Background Image"}
              </button>
              {editedProfile.backgroundUrl && (
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
              {["instagram", "facebook", "tiktok", "linkedin", "twitter", "website"].map((platform) => (
                <div key={platform}>
                  <label
                    htmlFor={`social-${platform}`}
                    className="block text-sm font-semibold text-gray-700 mb-2 capitalize"
                  >
                    {platform}
                  </label>
                  <input
                    type="url"
                    id={`social-${platform}`}
                    name={platform}
                    value={editedProfile.socialMedia?.[platform as keyof typeof editedProfile.socialMedia] ?? ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, [platform]: e.target.value },
                      })
                    }
                    placeholder={`https://${platform}.com/username`}
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
    </div>
  );
}

