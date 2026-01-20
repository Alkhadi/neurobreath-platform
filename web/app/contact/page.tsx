"use client";

import { useEffect, useState } from "react";
import { Profile, Contact, defaultProfile } from "@/lib/utils";
import { ProfileCard } from "./components/profile-card";
import { ProfileManager } from "./components/profile-manager";
import { ContactCapture } from "./components/contact-capture";
import { ShareButtons } from "./components/share-buttons";
import { FaEdit, FaPlus, FaUsers, FaChevronDown, FaEnvelope, FaPhone, FaMapMarkerAlt, FaDownload } from "react-icons/fa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([defaultProfile]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    setMounted(true);
    const storedProfiles = localStorage.getItem("nbcard_profiles");
    const storedContacts = localStorage.getItem("nbcard_contacts");

    if (storedProfiles) {
      try {
        const parsed = JSON.parse(storedProfiles);
        setProfiles(parsed?.length > 0 ? parsed : [defaultProfile]);
      } catch (e) {
        console.error("Failed to load profiles", e);
      }
    }

    if (storedContacts) {
      try {
        setContacts(JSON.parse(storedContacts));
      } catch (e) {
        console.error("Failed to load contacts", e);
      }
    }

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Save profiles to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("nbcard_profiles", JSON.stringify(profiles));
    }
  }, [profiles, mounted]);

  // Save contacts to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("nbcard_contacts", JSON.stringify(contacts));
    }
  }, [contacts, mounted]);

  const currentProfile = profiles?.[currentProfileIndex] ?? defaultProfile;

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
      alert("Cannot delete the last profile");
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

  const handleSaveContact = (contact: Contact) => {
    setContacts([...contacts, contact]);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContacts(contacts.filter((c) => c.id !== id));
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Install prompt not available. Please use your browser's menu to install the app.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleContactFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };
    
    // Here you can send the data to an API endpoint
    console.log("Contact form submitted:", data);
    alert("Thank you for your message! We'll get back to you soon.");
    e.currentTarget.reset();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
            NBCard - Digital Business Card
          </h1>
          <p className="text-gray-600 text-lg">Create, manage, and share your professional profile</p>
        </div>

        {/* Contact Us Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h2>
            <p className="text-gray-600">Have questions? We'd love to hear from you!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <form onSubmit={handleContactFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Moe Koroma"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  placeholder="Your message here..."
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <FaEnvelope /> Send Message
              </button>
            </form>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-600 text-white p-3 rounded-lg">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Email:</h4>
                      <div className="flex flex-col">
                        <a href="mailto:info@neurobreath.co.uk" className="text-purple-600 hover:text-purple-700">
                          info@neurobreath.co.uk
                        </a>
                        <a href="mailto:support@nbcard.app" className="text-purple-600 hover:text-purple-700">
                          support@nbcard.app
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white p-3 rounded-lg">
                      <FaPhone className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Phone</h4>
                      <a href="tel:+44232567890" className="text-purple-600 hover:text-purple-700">
                        +44 (232) 567-890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-600 text-white p-3 rounded-lg">
                      <FaMapMarkerAlt className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Location</h4>
                      <div className="text-gray-600">
                        <p>SE 15</p>
                        <p>London United Kingdom</p>
                        <p>England.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                className="cursor-pointer"
                onClick={handleEditProfile}
              >
                <ProfileCard profile={currentProfile} showEditButton onPhotoClick={(e) => {
                  e?.stopPropagation();
                  handleEditProfile();
                }} />
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mb-4">
              Click on the card to edit your profile
            </p>

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
            </div>
          </div>

          {/* Right Column - Share Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <ShareButtons profile={currentProfile} />
          </div>
        </div>

        {/* Contact Capture Section */}
        <div className="mb-8">
          <ContactCapture contacts={contacts} onSave={handleSaveContact} onDelete={handleDeleteContact} />
        </div>

        {/* PWA Install Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Install as App</h3>
            <p className="text-gray-600">
              Add NBCard to your home screen for quick access and offline functionality.
            </p>
          </div>

          {/* Install Button */}
          {showInstallButton && (
            <div className="mb-4">
              <button
                onClick={handleInstallClick}
                className="w-full max-w-md mx-auto flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg"
              >
                <FaDownload className="text-2xl" />
                Install NBCard App Now
              </button>
            </div>
          )}

          {/* Manual Install Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs">iOS</span>
                iPhone & iPad
              </h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Open this page in Safari</li>
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
    </div>
  );
}
