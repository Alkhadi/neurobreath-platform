'use client'

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FaChevronDown, FaEdit, FaPlus, FaUsers } from "react-icons/fa";

import type { Contact, Profile } from "@/lib/utils";
import { defaultProfile } from "@/lib/utils";

import { loadNbcardLocalState, saveNbcardLocalState } from "@/app/contact/lib/nbcard-storage";
import { ContactCapture } from "@/app/contact/components/contact-capture";
import { ProfileCard } from "@/app/contact/components/profile-card";
import { ProfileManager } from "@/app/contact/components/profile-manager";
import { ShareButtons } from "@/app/contact/components/share-buttons";

const SOCIAL_PLACEHOLDER_VALUES = new Set([
  "https://instagram.com/username",
  "https://facebook.com/username",
  "https://tiktok.com/username",
  "https://linkedin.com/username",
  "https://twitter.com/username",
  "https://website.com/username",
]);

function sanitizeSocialUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (SOCIAL_PLACEHOLDER_VALUES.has(trimmed)) return undefined;
  return trimmed;
}

function sanitizeProfile(profile: Profile): Profile {
  const social = profile.socialMedia || {};

  return {
    ...profile,
    socialMedia: {
      instagram: sanitizeSocialUrl(social.instagram),
      facebook: sanitizeSocialUrl(social.facebook),
      tiktok: sanitizeSocialUrl(social.tiktok),
      linkedin: sanitizeSocialUrl(social.linkedin),
      twitter: sanitizeSocialUrl(social.twitter),
      website: sanitizeSocialUrl(social.website),
    },
  };
}

function detectStandalone(): boolean {
  if (typeof window === "undefined") return false;

  const nav = window.navigator as Navigator & { standalone?: boolean };
  const mediaStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  const iosStandalone = nav.standalone === true;
  return mediaStandalone || iosStandalone;
}

export function NBCardPanel() {
  const [mounted, setMounted] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([defaultProfile]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Load NBCard state + register SW
  useEffect(() => {
    let cancelled = false;
    setMounted(true);

    (async () => {
      const state = await loadNbcardLocalState([defaultProfile], []);
      if (cancelled) return;
      const sanitizedProfiles = state.profiles.map(sanitizeProfile);
      setProfiles(sanitizedProfiles);
      setContacts(state.contacts);

      // Support deep-linking to a specific profile via ?profile=<id>
      try {
        const params = new URLSearchParams(window.location.search);
        const profileId = params.get("profile");
        if (profileId) {
          const index = sanitizedProfiles.findIndex((p) => p.id === profileId);
          if (index >= 0) setCurrentProfileIndex(index);
        }
      } catch {
        // ignore
      }

      // Register NBCard service worker (offline-friendly)
      try {
        if ("serviceWorker" in navigator) {
          // Keep NB-Card SW strictly scoped so it cannot control the full site origin.
          await navigator.serviceWorker.register("/nbcard-sw.js", { scope: "/resources/nb-card/" });
        }
      } catch {
        // Don't block page; SW is best-effort
      }
    })().catch((e) => console.error("Failed to load NBCard state", e));

    const updateInstalled = () => setIsInstalled(detectStandalone());
    updateInstalled();

    const media = window.matchMedia?.("(display-mode: standalone)");
    const onDisplayModeChange = () => updateInstalled();

    if (media?.addEventListener) {
      media.addEventListener("change", onDisplayModeChange);
    } else if (media && "addListener" in media) {
      // Safari fallback
      media.addListener(onDisplayModeChange);
    }

    window.addEventListener("appinstalled", updateInstalled);

    return () => {
      cancelled = true;
      window.removeEventListener("appinstalled", updateInstalled);

      if (media?.removeEventListener) {
        media.removeEventListener("change", onDisplayModeChange);
      } else if (media && "removeListener" in media) {
        media.removeListener(onDisplayModeChange);
      }
    };
  }, []);

  // Persist profiles + contacts (local-first)
  useEffect(() => {
    if (mounted) {
      saveNbcardLocalState({ profiles, contacts }).catch((e) => console.error("Failed to persist NBCard state", e));
    }
  }, [profiles, contacts, mounted]);

  const currentProfile = useMemo(() => profiles?.[currentProfileIndex] ?? defaultProfile, [profiles, currentProfileIndex]);

  const handleSaveProfile = (profile: Profile) => {
    if (isNewProfile) {
      setProfiles([...profiles, { ...profile, id: Date.now().toString() }]);
      setCurrentProfileIndex(profiles.length);
    } else {
      const updated = profiles.map((p) => (p.id === profile.id ? profile : p));
      setProfiles(updated);
    }
    setShowProfileManager(false);
    setEditingProfile(null);
    setIsNewProfile(false);
  };

  const handleDeleteProfile = () => {
    if (profiles.length === 1) {
      toast.error("Cannot delete the last profile");
      return;
    }
    if (confirm("Are you sure you want to delete this profile?")) {
      const updated = profiles.filter((p) => p.id !== currentProfile.id);
      setProfiles(updated);
      setCurrentProfileIndex(0);
      setShowProfileManager(false);
    }
  };

  const handleCreateNewProfile = () => {
    setEditingProfile({
      id: "",
      fullName: "",
      jobTitle: "",
      phone: "",
      email: "",
      profileDescription: "",
      businessDescription: "",
      gradient: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
      socialMedia: {},
    });
    setIsNewProfile(true);
    setShowProfileManager(true);
  };

  const handleEditProfile = () => {
    setEditingProfile(currentProfile);
    setIsNewProfile(false);
    setShowProfileManager(true);
  };

  const handleUpsertContact = (contact: Contact) => {
    setContacts((prev) => {
      const idx = prev.findIndex((c) => c.id === contact.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = contact;
        return next;
      }
      return [...prev, contact];
    });
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContacts(contacts.filter((c) => c.id !== id));
    }
  };

  return (
    <>
      {/* Profile Selector */}
      {profiles.length > 1 && (
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-semibold text-gray-700"
            >
              <FaUsers className="text-purple-600" />
              {currentProfile?.fullName ?? "Select Profile"}
              <FaChevronDown className={`transition-transform ${showProfileDropdown ? "rotate-180" : ""}`} />
            </button>
            {showProfileDropdown && (
              <div className="absolute top-full mt-2 bg-white rounded-lg shadow-xl py-2 min-w-full z-10">
                {profiles.map((profile, index) => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      setCurrentProfileIndex(index);
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors ${
                      index === currentProfileIndex ? "bg-purple-100 font-semibold" : ""
                    }`}
                  >
                    {profile.fullName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Profile Card */}
        <div>
          {/* Profile Card with Capture Wrapper */}
          <div className="mb-6">
            <div
              id="profile-card-capture"
              className="cursor-pointer text-left w-full"
              role="button"
              tabIndex={0}
              aria-label="Edit profile"
              onClick={handleEditProfile}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleEditProfile();
                }
              }}
            >
              <ProfileCard
                profile={currentProfile}
                showEditButton
                onPhotoClick={(e) => {
                  e?.stopPropagation();
                  handleEditProfile();
                }}
              />
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mb-4">Click on the card to edit your profile</p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleEditProfile}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              onClick={handleCreateNewProfile}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              <FaPlus /> New Profile
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("share-your-profile");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
                toast.message("Share Your Profile", { description: "Choose a share option on the right." });
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Share Your Profile
            </button>
          </div>
        </div>

        {/* Right Column - Share Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div id="share-your-profile">
            <ShareButtons
              profile={currentProfile}
              profiles={profiles}
              contacts={contacts}
              onSetProfiles={setProfiles}
              onSetContacts={setContacts}
            />
          </div>
        </div>
      </div>

      {/* Contact Capture Section */}
      <div className="mb-8">
        <ContactCapture contacts={contacts} onUpsert={handleUpsertContact} onDelete={handleDeleteContact} />
      </div>

      {/* PWA Install Section */}
      <div id="nbcard-install" className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Install as App</h3>
          <p className="text-gray-600">Use the “Download & Install NB-Card” button at the top of the page, or follow the steps below.</p>
        </div>

        {/* Installed State */}
        {isInstalled ? (
          <div className="mb-4">
            <div className="w-full max-w-md mx-auto rounded-xl bg-white/70 border border-purple-100 px-6 py-4 text-center">
              <p className="font-semibold text-gray-800">NB-Card is installed</p>
              <p className="text-sm text-gray-600">You can open it from your home screen / apps.</p>
            </div>
          </div>
        ) : null}

        {/* Install button removed: primary one-shot install is handled by the page CTA */}

        {/* Manual Install Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs">iOS</span>
              iPhone & iPad
            </h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Open NB-Card in Safari</li>
              <li>Tap the share button (square with arrow)</li>
              <li>Scroll and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Android</span>
              Chrome Browser
            </h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Tap the menu button (three dots)</li>
              <li>Select "Add to Home screen" or "Install app"</li>
              <li>Tap "Install" or "Add"</li>
              <li>Find the app on your home screen</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Profile Manager Modal */}
      {showProfileManager && editingProfile && (
        <ProfileManager
          profile={editingProfile}
          onSave={handleSaveProfile}
          onDelete={!isNewProfile ? handleDeleteProfile : undefined}
          onClose={() => {
            setShowProfileManager(false);
            setEditingProfile(null);
            setIsNewProfile(false);
          }}
          isNew={isNewProfile}
        />
      )}
    </>
  );
}
