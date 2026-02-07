"use client";

import { Profile, cn } from "@/lib/utils";
import { FaInstagram, FaFacebook, FaTiktok, FaLinkedin, FaTwitter, FaGlobe, FaPhone, FaEnvelope } from "react-icons/fa";
import Image from "next/image";
import styles from "./profile-card.module.css";

interface ProfileCardProps {
  profile: Profile;
  onPhotoClick?: (e?: React.MouseEvent) => void;
  showEditButton?: boolean;
}

export function ProfileCard({ profile, onPhotoClick, showEditButton = false }: ProfileCardProps) {
  const gradientClassMap: Record<string, string> = {
    "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)": "bg-gradient-to-br from-purple-600 to-blue-500",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)": "bg-gradient-to-br from-indigo-500 to-purple-600",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)": "bg-gradient-to-br from-fuchsia-400 to-rose-500",
    "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)": "bg-gradient-to-br from-emerald-500 to-green-400",
    "linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)": "bg-gradient-to-br from-violet-400 to-fuchsia-500",
    "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)": "bg-gradient-to-br from-orange-400 to-rose-400",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)": "bg-gradient-to-br from-sky-400 to-cyan-400",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)": "bg-gradient-to-br from-pink-400 to-yellow-300",
  };
  const defaultGradient = "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)";
  const gradientClass =
    gradientClassMap[profile?.gradient ?? ""] ??
    gradientClassMap[defaultGradient];

  const hasBackgroundImage = Boolean(profile?.backgroundUrl || profile?.frameUrl);

  const socialMediaLinks = [
    { icon: FaInstagram, url: profile?.socialMedia?.instagram, color: "#E1306C" },
    { icon: FaFacebook, url: profile?.socialMedia?.facebook, color: "#1877F2" },
    { icon: FaTiktok, url: profile?.socialMedia?.tiktok, color: "#000000" },
    { icon: FaLinkedin, url: profile?.socialMedia?.linkedin, color: "#0A66C2" },
    { icon: FaTwitter, url: profile?.socialMedia?.twitter, color: "#1DA1F2" },
    { icon: FaGlobe, url: profile?.socialMedia?.website, color: "#4CAF50" },
  ];

  return (
    <div
      className={cn(
        "relative w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden",
        !hasBackgroundImage && gradientClass,
        hasBackgroundImage && "bg-gray-900"
      )}
    >
      {hasBackgroundImage && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={(profile?.frameUrl || profile?.backgroundUrl) ?? ""}
            alt="Card background"
            fill
            className="object-cover"
            unoptimized
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        </div>
      )}

      <div className="p-8 text-white relative">
        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
              {profile?.photoUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={profile.photoUrl}
                    alt={profile?.fullName ?? "Profile"}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="128px"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500 text-4xl font-bold text-white">
                  {profile?.fullName?.charAt(0)?.toUpperCase() ?? "A"}
                </div>
              )}
            </div>
            {showEditButton && onPhotoClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPhotoClick(e);
                }}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                aria-label="Upload photo"
              >
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Name & Title */}
        <h2 className={cn("text-3xl font-bold text-center mb-2", styles.signatureFont)}>
          {profile?.fullName ?? "Name"}
        </h2>
        <p className="text-lg text-center mb-6 opacity-90">{profile?.jobTitle ?? "Job Title"}</p>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <a
            href={`tel:${profile?.phone ?? ""}`}
            data-pdf-link={`tel:${profile?.phone ?? ""}`}
            className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <FaPhone className="text-xl" />
            <span className="text-lg">{profile?.phone ?? "Phone"}</span>
          </a>
          <a
            href={`mailto:${profile?.email ?? ""}`}
            data-pdf-link={`mailto:${profile?.email ?? ""}`}
            className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <FaEnvelope className="text-xl" />
            <span className="text-lg">{profile?.email ?? "Email"}</span>
          </a>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 flex-wrap">
          {socialMediaLinks.map((social, index) => {
            const Icon = social.icon;
            if (!social.url) return null;
            return (
              <a
                key={index}
                href={social.url}
                data-pdf-link={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 text-white backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all hover:scale-110"
                aria-label={`Visit ${social.url}`}
              >
                <Icon className="text-2xl" />
              </a>
            );
          })}
        </div>

        {/* Descriptions */}
        {profile?.profileDescription && (
          <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Profile</h3>
            <p className="text-sm opacity-90">{profile.profileDescription}</p>
          </div>
        )}
        {profile?.businessDescription && (
          <div className="mt-3 bg-white/10 backdrop-blur-md p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Business</h3>
            <p className="text-sm opacity-90">{profile.businessDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}

