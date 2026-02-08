"use client";

import { Profile, cn } from "@/lib/utils";
import { FaInstagram, FaFacebook, FaTiktok, FaLinkedin, FaTwitter, FaGlobe, FaPhone, FaEnvelope, FaHome } from "react-icons/fa";
import { useEffect, useState } from "react";
import { resolveAssetUrl } from "../lib/nbcard-assets";
import { CaptureImage } from "./capture-image";
import styles from "./profile-card.module.css";

interface ProfileCardProps {
  profile: Profile;
  onPhotoClick?: (e?: React.MouseEvent) => void;
  showEditButton?: boolean;
  userEmail?: string; // For IndexedDB namespace
}

export function ProfileCard({ profile, onPhotoClick, showEditButton = false, userEmail }: ProfileCardProps) {
  const [resolvedBackgroundUrl, setResolvedBackgroundUrl] = useState<string | null>(null);
  const [resolvedPhotoUrl, setResolvedPhotoUrl] = useState<string | null>(null);
  const [backgroundRevoke, setBackgroundRevoke] = useState<(() => void) | null>(null);
  const [photoRevoke, setPhotoRevoke] = useState<(() => void) | null>(null);

  // Resolve background URL (frameUrl or backgroundUrl)
  useEffect(() => {
    const backgroundSource = profile?.frameUrl || profile?.backgroundUrl;
    const revokeFn = backgroundRevoke;
    
    // Cleanup previous objectURL
    if (revokeFn) {
      revokeFn();
      setBackgroundRevoke(null);
    }
    
    if (!backgroundSource) {
      setResolvedBackgroundUrl(null);
      return;
    }
    
    resolveAssetUrl(backgroundSource, userEmail)
      .then((result) => {
        if (result) {
          setResolvedBackgroundUrl(result.src);
          if (result.revoke) {
            setBackgroundRevoke(() => result.revoke);
          }
        } else {
          setResolvedBackgroundUrl(null);
        }
      })
      .catch((err) => {
        console.error("Failed to resolve background:", err);
        setResolvedBackgroundUrl(null);
      });
      
    return () => {
      if (revokeFn) {
        revokeFn();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.frameUrl, profile?.backgroundUrl, userEmail]);

  // Resolve photo URL
  useEffect(() => {
    const revokeFn = photoRevoke;
    
    // Cleanup previous objectURL
    if (revokeFn) {
      revokeFn();
      setPhotoRevoke(null);
    }
    
    if (!profile?.photoUrl) {
      setResolvedPhotoUrl(null);
      return;
    }
    
    resolveAssetUrl(profile.photoUrl, userEmail)
      .then((result) => {
        if (result) {
          setResolvedPhotoUrl(result.src);
          if (result.revoke) {
            setPhotoRevoke(() => result.revoke);
          }
        } else {
          setResolvedPhotoUrl(null);
        }
      })
      .catch((err) => {
        console.error("Failed to resolve photo:", err);
        setResolvedPhotoUrl(null);
      });
      
    return () => {
      if (revokeFn) {
        revokeFn();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.photoUrl, userEmail]);
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

  const hasBackgroundImage = Boolean(resolvedBackgroundUrl);

  const socialMediaLinks = [
    { icon: FaInstagram, url: profile?.socialMedia?.instagram, color: "#E1306C" },
    { icon: FaFacebook, url: profile?.socialMedia?.facebook, color: "#1877F2" },
    { icon: FaTiktok, url: profile?.socialMedia?.tiktok, color: "#000000" },
    { icon: FaLinkedin, url: profile?.socialMedia?.linkedin, color: "#0A66C2" },
    { icon: FaTwitter, url: profile?.socialMedia?.twitter, color: "#1DA1F2" },
  ];

  return (
    <div
      id="profile-card-capture"
      className={cn(
        "relative w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden",
        !hasBackgroundImage && gradientClass,
        hasBackgroundImage && "bg-gray-900"
      )}
    >
      {hasBackgroundImage && resolvedBackgroundUrl && (
        <div className="absolute inset-0 -z-10">
          <CaptureImage
            src={resolvedBackgroundUrl}
            alt="Card background"
            className="w-full h-full object-cover"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        </div>
      )}

      <div className="p-8 text-white relative">
        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
              {resolvedPhotoUrl ? (
                <CaptureImage
                  src={resolvedPhotoUrl}
                  alt={profile?.fullName ?? "Profile"}
                  className="w-full h-full object-cover"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
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
          {profile?.address && (
            <div className="flex items-center gap-3 p-2">
              <FaHome className="text-xl" />
              <div className="flex flex-col">
                <span className="text-sm opacity-75">Find Address:</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`}
                  data-pdf-link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base underline hover:opacity-80 transition-opacity"
                >
                  Click Here
                </a>
              </div>
            </div>
          )}
          {profile?.website && (
            <a
              href={profile.website}
              data-pdf-link={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <FaGlobe className="text-xl" />
              <span className="text-lg break-all">{profile.website}</span>
            </a>
          )}
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

        {/* Category-specific Details Blocks */}
        {profile?.cardCategory === "ADDRESS" && profile?.addressCard && (
          <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-base">Address</h3>
            <div className="text-sm space-y-1">
              {profile.addressCard.addressLine1 && <p>{profile.addressCard.addressLine1}</p>}
              {profile.addressCard.addressLine2 && <p>{profile.addressCard.addressLine2}</p>}
              {profile.addressCard.city && profile.addressCard.postcode && (
                <p>{profile.addressCard.city}, {profile.addressCard.postcode}</p>
              )}
              {profile.addressCard.country && <p>{profile.addressCard.country}</p>}
              {profile.addressCard.directionsNote && (
                <p className="mt-2 text-xs opacity-75 italic">{profile.addressCard.directionsNote}</p>
              )}
              {(profile.addressCard.addressLine1 || profile.addressCard.mapQueryOverride) && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-xs opacity-75 mb-1">Find Address:</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      profile.addressCard.mapQueryOverride ||
                      [
                        profile.addressCard.addressLine1,
                        profile.addressCard.addressLine2,
                        profile.addressCard.city,
                        profile.addressCard.postcode,
                        profile.addressCard.country,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    )}`}
                    data-pdf-link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      profile.addressCard.mapQueryOverride ||
                      [
                        profile.addressCard.addressLine1,
                        profile.addressCard.addressLine2,
                        profile.addressCard.city,
                        profile.addressCard.postcode,
                        profile.addressCard.country,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold underline hover:opacity-80 transition-opacity"
                  >
                    {profile.addressCard.mapLinkLabel || "Click Here"}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {profile?.cardCategory === "BANK" && profile?.bankCard && (
          <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-base">Bank Details</h3>
            <div className="text-sm space-y-2">
              {profile.bankCard.bankName && (
                <p><span className="opacity-75">Bank:</span> {profile.bankCard.bankName}</p>
              )}
              {profile.bankCard.accountName && (
                <p><span className="opacity-75">Account Name:</span> {profile.bankCard.accountName}</p>
              )}
              {profile.bankCard.sortCode && (
                <p><span className="opacity-75">Sort Code:</span> {profile.bankCard.sortCode}</p>
              )}
              {profile.bankCard.accountNumber && (
                <p><span className="opacity-75">Account Number:</span> {profile.bankCard.accountNumber}</p>
              )}
              {profile.bankCard.iban && (
                <p><span className="opacity-75">IBAN:</span> {profile.bankCard.iban}</p>
              )}
              {profile.bankCard.swiftBic && (
                <p><span className="opacity-75">SWIFT/BIC:</span> {profile.bankCard.swiftBic}</p>
              )}
              {profile.bankCard.referenceNote && (
                <p className="mt-2 text-xs opacity-75 italic">{profile.bankCard.referenceNote}</p>
              )}
              {profile.bankCard.paymentLink && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <a
                    href={profile.bankCard.paymentLink}
                    data-pdf-link={profile.bankCard.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors"
                  >
                    {profile.bankCard.paymentLinkLabel || "Send Money"}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {profile?.cardCategory === "BUSINESS" && profile?.businessCard && (
          <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-base">Business</h3>
            <div className="text-sm space-y-2">
              {profile.businessCard.companyName && (
                <p className="font-semibold text-base">{profile.businessCard.companyName}</p>
              )}
              {profile.businessCard.services && (
                <p className="opacity-90">{profile.businessCard.services}</p>
              )}
              {profile.businessCard.websiteUrl && (
                <p>
                  <span className="opacity-75">Website:</span>{" "}
                  <a
                    href={profile.businessCard.websiteUrl}
                    data-pdf-link={profile.businessCard.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80 transition-opacity"
                  >
                    {profile.businessCard.websiteUrl}
                  </a>
                </p>
              )}
              {profile.businessCard.hours && (
                <p><span className="opacity-75">Hours:</span> {profile.businessCard.hours}</p>
              )}
              {profile.businessCard.locationNote && (
                <p><span className="opacity-75">Location:</span> {profile.businessCard.locationNote}</p>
              )}
              {profile.businessCard.vatOrRegNo && (
                <p className="text-xs opacity-75">VAT/Reg: {profile.businessCard.vatOrRegNo}</p>
              )}
              {profile.businessCard.bookingLink && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <a
                    href={profile.businessCard.bookingLink}
                    data-pdf-link={profile.businessCard.bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors"
                  >
                    {profile.businessCard.bookingLinkLabel || "Book Now"}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

