"use client";

import { Profile, cn } from "@/lib/utils";
import { FaInstagram, FaFacebook, FaTiktok, FaLinkedin, FaTwitter, FaGlobe, FaPhone, FaEnvelope, FaHome } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { resolveAssetUrl } from "../lib/nbcard-assets";
import { CaptureImage } from "./capture-image";
import styles from "./profile-card.module.css";
import type { TemplateSelection } from "@/lib/nbcard-templates";

interface ProfileCardProps {
  profile: Profile;
  onPhotoClick?: (e?: React.MouseEvent) => void;
  showEditButton?: boolean;
  userEmail?: string; // For IndexedDB namespace
  templateSelection?: TemplateSelection; // Template background/overlay
}

export function ProfileCard({ profile, onPhotoClick, showEditButton = false, userEmail, templateSelection }: ProfileCardProps) {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [resolvedBackgroundUrl, setResolvedBackgroundUrl] = useState<string | null>(null);
  const [resolvedPhotoUrl, setResolvedPhotoUrl] = useState<string | null>(null);
  const [backgroundRevoke, setBackgroundRevoke] = useState<(() => void) | null>(null);
  const [photoRevoke, setPhotoRevoke] = useState<(() => void) | null>(null);

  const assetNamespace = userEmail ?? sessionEmail ?? undefined;

  // Determine if we're using template mode (new) or legacy background mode
  const useTemplateMode = Boolean(templateSelection?.backgroundId);
  
  // Build template paths from IDs
  // ID format: "modern_geometric_v1_landscape" -> "modern_geometric_landscape_bg.svg"
  // ID format: "ink_frame_v1_portrait" -> "ink_frame_overlay_portrait.svg"
  const getTemplatePath = (id: string, type: 'background' | 'overlay'): string => {
    // Remove version suffix (_v1)
    const base = id.replace(/_v\d+_/, '_');
    const suffix = type === 'background' ? '_bg.svg' : '.svg';
    return `/nb-card/templates/${type}s/${base}${suffix}`;
  };
  
  const templateBackgroundSrc = useTemplateMode && templateSelection?.backgroundId
    ? getTemplatePath(templateSelection.backgroundId, 'background')
    : null;
  const templateOverlaySrc = useTemplateMode && templateSelection?.overlayId
    ? getTemplatePath(templateSelection.overlayId, 'overlay')
    : null;

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
    
    resolveAssetUrl(backgroundSource, assetNamespace)
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
  }, [profile?.frameUrl, profile?.backgroundUrl, assetNamespace]);

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
    
    resolveAssetUrl(profile.photoUrl, assetNamespace)
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
  }, [profile?.photoUrl, assetNamespace]);
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

  // Priority order: template > legacy frameUrl/backgroundUrl > gradient
  const hasTemplateBackground = Boolean(templateBackgroundSrc);
  const hasLegacyBackground = !useTemplateMode && Boolean(resolvedBackgroundUrl);
  const hasAnyBackground = hasTemplateBackground || hasLegacyBackground;

  const socialMediaLinks = [
    { icon: FaGlobe, url: profile?.socialMedia?.website, color: "#6366F1", label: "Website" },
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
        "relative isolate w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden",
        !hasAnyBackground && gradientClass,
        hasAnyBackground && "bg-gray-900"
      )}
    >
      {/* TEMPLATE BACKGROUND LAYER (z=0) */}
      {hasTemplateBackground && templateBackgroundSrc && (
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src={templateBackgroundSrc}
            alt="Card background"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* LEGACY BACKGROUND LAYER (z=0, only if no template) */}
      {!useTemplateMode && hasLegacyBackground && resolvedBackgroundUrl && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <CaptureImage
            src={resolvedBackgroundUrl}
            alt="Card background"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Dark overlay for readability (z=1) */}
      {hasAnyBackground && (
        <div className="absolute inset-0 z-[1] bg-black/35 pointer-events-none" />
      )}

      {/* TEMPLATE OVERLAY LAYER (z=2) */}
      {hasTemplateBackground && templateOverlaySrc && (
        <div className="absolute inset-0 z-[2] pointer-events-none select-none">
          <img
            src={templateOverlaySrc}
            alt="Card overlay"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* CARD CONTENT (z=10) */}
      <div className="relative z-10 p-8 text-white">
        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
              {resolvedPhotoUrl ? (
                <CaptureImage
                  src={resolvedPhotoUrl}
                  alt={profile?.fullName ?? "Profile"}
                  className="w-full h-full object-cover"
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
          <span data-pdf-text={profile?.fullName ?? ""}>{profile?.fullName ?? "Name"}</span>
        </h2>
        <p className="text-lg text-center mb-6 opacity-90">
          <span data-pdf-text={profile?.jobTitle ?? ""}>{profile?.jobTitle ?? "Job Title"}</span>
        </p>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <a
            href={`tel:${profile?.phone ?? ""}`}
            data-pdf-link={`tel:${profile?.phone ?? ""}`}
            className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <FaPhone className="text-xl" />
            <span className="text-lg" data-pdf-text={profile?.phone ?? ""}>
              {profile?.phone ?? "Phone"}
            </span>
          </a>
          <a
            href={`mailto:${profile?.email ?? ""}`}
            data-pdf-link={`mailto:${profile?.email ?? ""}`}
            className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <FaEnvelope className="text-xl" />
            <span className="text-lg" data-pdf-text={profile?.email ?? ""}>
              {profile?.email ?? "Email"}
            </span>
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
              <span className="text-lg break-all" data-pdf-text={profile.website}>
                {profile.website}
              </span>
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
              {profile.addressCard.recipientName && (
                <p className="font-semibold" data-pdf-text={profile.addressCard.recipientName}>
                  {profile.addressCard.recipientName}
                </p>
              )}
              {profile.addressCard.addressLine1 && <p data-pdf-text={profile.addressCard.addressLine1}>{profile.addressCard.addressLine1}</p>}
              {profile.addressCard.addressLine2 && <p data-pdf-text={profile.addressCard.addressLine2}>{profile.addressCard.addressLine2}</p>}
              {profile.addressCard.city && profile.addressCard.postcode && (
                <p data-pdf-text={`${profile.addressCard.city}, ${profile.addressCard.postcode}`}>{profile.addressCard.city}, {profile.addressCard.postcode}</p>
              )}
              {profile.addressCard.country && <p data-pdf-text={profile.addressCard.country}>{profile.addressCard.country}</p>}
              {profile.addressCard.directionsNote && (
                <p className="mt-2 text-xs opacity-75 italic" data-pdf-text={profile.addressCard.directionsNote}>
                  {profile.addressCard.directionsNote}
                </p>
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

              {(profile.addressCard.phoneLabel || profile.addressCard.emailLabel) && (profile.phone || profile.email) ? (
                <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
                  {profile.phone ? (
                    <a
                      href={`tel:${profile.phone}`}
                      data-pdf-link={`tel:${profile.phone}`}
                      className="inline-flex items-center gap-2 text-sm underline hover:opacity-80 transition-opacity"
                    >
                      <span className="opacity-80">{profile.addressCard.phoneLabel || "Call"}:</span>
                      <span data-pdf-text={profile.phone}>{profile.phone}</span>
                    </a>
                  ) : null}
                  {profile.email ? (
                    <a
                      href={`mailto:${profile.email}`}
                      data-pdf-link={`mailto:${profile.email}`}
                      className="block text-sm underline hover:opacity-80 transition-opacity"
                    >
                      <span className="opacity-80">{profile.addressCard.emailLabel || "Email"}:</span>{" "}
                      <span data-pdf-text={profile.email}>{profile.email}</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {profile?.cardCategory === "BANK" && profile?.bankCard && (
          <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-base">Bank Details</h3>
            <div className="text-sm space-y-2">
              {profile.bankCard.bankName && (
                <p>
                  <span className="opacity-75">Bank:</span>{" "}
                  <span data-pdf-text={profile.bankCard.bankName}>{profile.bankCard.bankName}</span>
                </p>
              )}
              {profile.bankCard.accountName && (
                <p>
                  <span className="opacity-75">Account Name:</span>{" "}
                  <span data-pdf-text={profile.bankCard.accountName}>{profile.bankCard.accountName}</span>
                </p>
              )}
              {profile.bankCard.sortCode && (
                <p>
                  <span className="opacity-75">Sort Code:</span>{" "}
                  <span data-pdf-text={profile.bankCard.sortCode}>{profile.bankCard.sortCode}</span>
                </p>
              )}
              {profile.bankCard.accountNumber && (
                <p>
                  <span className="opacity-75">Account Number:</span>{" "}
                  <span data-pdf-text={profile.bankCard.accountNumber}>{profile.bankCard.accountNumber}</span>
                </p>
              )}
              {profile.bankCard.iban && (
                <p>
                  <span className="opacity-75">IBAN:</span>{" "}
                  <span data-pdf-text={profile.bankCard.iban}>{profile.bankCard.iban}</span>
                </p>
              )}
              {profile.bankCard.swiftBic && (
                <p>
                  <span className="opacity-75">SWIFT/BIC:</span>{" "}
                  <span data-pdf-text={profile.bankCard.swiftBic}>{profile.bankCard.swiftBic}</span>
                </p>
              )}
              {profile.bankCard.referenceNote && (
                <p className="mt-2 text-xs opacity-75 italic" data-pdf-text={profile.bankCard.referenceNote}>
                  {profile.bankCard.referenceNote}
                </p>
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
                <p className="font-semibold text-base" data-pdf-text={profile.businessCard.companyName}>
                  {profile.businessCard.companyName}
                </p>
              )}
              {profile.businessCard.tagline && (
                <p className="opacity-90 italic" data-pdf-text={profile.businessCard.tagline}>
                  {profile.businessCard.tagline}
                </p>
              )}
              {profile.businessCard.services && (
                <p className="opacity-90" data-pdf-text={profile.businessCard.services}>
                  {profile.businessCard.services}
                </p>
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
                    <span data-pdf-text={profile.businessCard.websiteUrl}>{profile.businessCard.websiteUrl}</span>
                  </a>
                </p>
              )}
              {profile.businessCard.hours && (
                <p>
                  <span className="opacity-75">Hours:</span>{" "}
                  <span data-pdf-text={profile.businessCard.hours}>{profile.businessCard.hours}</span>
                </p>
              )}
              {profile.businessCard.locationNote && (
                <p>
                  <span className="opacity-75">Location:</span>{" "}
                  <span data-pdf-text={profile.businessCard.locationNote}>{profile.businessCard.locationNote}</span>
                </p>
              )}
              {profile.businessCard.vatOrRegNo && (
                <p className="text-xs opacity-75">
                  VAT/Reg:{" "}
                  <span data-pdf-text={profile.businessCard.vatOrRegNo}>{profile.businessCard.vatOrRegNo}</span>
                </p>
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

