"use client";

import { useState, useRef } from "react";
import { Profile, gradientOptions } from "@/lib/utils";
import { GradientSelector } from "./gradient-selector";
import { FaSave, FaTimes, FaTrash, FaPlus } from "react-icons/fa";

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert("File size must be less than 100MB");
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
      alert("Failed to upload photo");
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
          />

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
            <input
              ref={fileInputRef}
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={editedProfile.fullName}
                onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                required
                value={editedProfile.jobTitle}
                onChange={(e) => setEditedProfile({ ...editedProfile, jobTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                required
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Description ({editedProfile.profileDescription.length}/50)
            </label>
            <input
              type="text"
              maxLength={50}
              value={editedProfile.profileDescription}
              onChange={(e) => setEditedProfile({ ...editedProfile, profileDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Description ({editedProfile.businessDescription.length}/50)
            </label>
            <input
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">{platform}</label>
                  <input
                    type="url"
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

