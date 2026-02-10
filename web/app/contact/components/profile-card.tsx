"use client";

import { Profile, cn, CardLayer } from "@/lib/utils";
import { FaInstagram, FaFacebook, FaTiktok, FaLinkedin, FaTwitter, FaGlobe, FaPhone, FaEnvelope, FaHome } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import { resolveAssetUrl } from "../lib/nbcard-assets";
import { getProfileShareUrl } from "../lib/nbcard-share";
import { CaptureImage } from "./capture-image";
import styles from "./profile-card.module.css";
import type { TemplateSelection } from "@/lib/nbcard-templates";
import { getTemplateThemeTokens, isLightColor } from "@/lib/nbcard-templates";

interface ProfileCardProps {
  profile: Profile;
  onPhotoClick?: (e?: React.MouseEvent) => void;
  showEditButton?: boolean;
  userEmail?: string; // For IndexedDB namespace
  templateSelection?: TemplateSelection; // Template background/overlay
  captureId?: string;
  editMode?: boolean; // Free Layout Editor: enable drag/resize
  selectedLayerId?: string | null; // Free Layout Editor: currently selected layer
  onLayerUpdate?: (layerId: string, updates: Partial<CardLayer>) => void; // Free Layout Editor: update layer
  onLayerSelect?: (layerId: string | null) => void; // Free Layout Editor: select layer
}

// Helper component to render a single card layer
function CardLayerRenderer({
  layer,
  editMode,
  isSelected,
  onSelect,
  onUpdate,
  containerRef,
}: {
  layer: CardLayer;
  editMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<CardLayer>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, layerX: 0, layerY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, layerW: 0, layerH: 0 });

  if (!layer.visible) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!editMode || layer.locked) return;
    e.stopPropagation();
    
    onSelect?.(layer.id);
    
    const container = containerRef.current;
    if (!container) return;
    
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      layerX: layer.x,
      layerY: layer.y,
    });
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !editMode || layer.locked) return;
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const deltaX = (e.clientX - dragStart.x) / rect.width * 100;
    const deltaY = (e.clientY - dragStart.y) / rect.height * 100;
    
    const newX = Math.max(0, Math.min(100 - layer.w, dragStart.layerX + deltaX));
    const newY = Math.max(0, Math.min(100 - layer.h, dragStart.layerY + deltaY));
    
    onUpdate?.(layer.id, { x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const handleResizePointerDown = (e: React.PointerEvent, _corner: string) => {
    if (!editMode || layer.locked) return;
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      layerW: layer.w,
      layerH: layer.h,
    });
    setIsResizing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!isResizing || !editMode || layer.locked) return;
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const deltaX = (e.clientX - resizeStart.x) / rect.width * 100;
    const deltaY = (e.clientY - resizeStart.y) / rect.height * 100;
    
    const newW = Math.max(5, Math.min(100 - layer.x, resizeStart.layerW + deltaX));
    const newH = Math.max(5, Math.min(100 - layer.y, resizeStart.layerH + deltaY));
    
    onUpdate?.(layer.id, { w: newW, h: newH });
  };

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (isResizing) {
      e.stopPropagation();
      setIsResizing(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${layer.x}%`,
    top: `${layer.y}%`,
    width: `${layer.w}%`,
    height: `${layer.h}%`,
    transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
    zIndex: layer.zIndex,
    pointerEvents: editMode && !layer.locked ? "auto" : "none",
    cursor: editMode && !layer.locked ? (isDragging ? "grabbing" : "grab") : undefined,
    outline: editMode && isSelected ? "2px solid #A855F7" : undefined,
    outlineOffset: "2px",
  };

  const renderContent = () => {
    if (layer.type === "text") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            fontSize: `${layer.style.fontSize}px`,
            fontWeight: layer.style.fontWeight,
            textAlign: layer.style.align,
            color: layer.style.color,
            backgroundColor: layer.style.backgroundColor || "transparent",
            padding: layer.style.padding ? `${layer.style.padding}px` : undefined,
            display: "flex",
            alignItems: "center",
            justifyContent: layer.style.align === "center" ? "center" : layer.style.align === "right" ? "flex-end" : "flex-start",
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          {layer.style.content}
        </div>
      );
    }

    if (layer.type === "avatar") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: `${layer.style.borderRadius}px`,
            borderWidth: layer.style.borderWidth ? `${layer.style.borderWidth}px` : undefined,
            borderColor: layer.style.borderColor || "transparent",
            borderStyle: layer.style.borderWidth ? "solid" : undefined,
            overflow: "hidden",
          }}
        >
          {layer.style.src && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={layer.style.src}
              alt="Layer avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: layer.style.fit,
              }}
            />
          )}
        </div>
      );
    }

    if (layer.type === "shape") {
      const { shapeKind, fill, stroke, strokeWidth, opacity, cornerRadius } = layer.style;

      if (shapeKind === "rect") {
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: fill,
              border: stroke && strokeWidth ? `${strokeWidth}px solid ${stroke}` : undefined,
              opacity,
              borderRadius: cornerRadius ? `${cornerRadius}px` : undefined,
            }}
          />
        );
      }

      if (shapeKind === "circle") {
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: fill,
              border: stroke && strokeWidth ? `${strokeWidth}px solid ${stroke}` : undefined,
              opacity,
              borderRadius: "50%",
            }}
          />
        );
      }

      if (shapeKind === "line") {
        return (
          <div
            style={{
              width: "100%",
              height: strokeWidth ? `${strokeWidth}px` : "2px",
              backgroundColor: fill,
              opacity,
            }}
          />
        );
      }
    }

    return null;
  };

  return (
    <div
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={isDragging ? handlePointerMove : isResizing ? handleResizePointerMove : undefined}
      onPointerUp={isDragging ? handlePointerUp : isResizing ? handleResizePointerUp : undefined}
    >
      {renderContent()}
      
      {/* Resize handle (bottom-right corner) */}
      {editMode && isSelected && !layer.locked && (
        <div
          style={{
            position: "absolute",
            right: -4,
            bottom: -4,
            width: 12,
            height: 12,
            backgroundColor: "#A855F7",
            border: "2px solid white",
            borderRadius: "50%",
            cursor: "nwse-resize",
            zIndex: 1,
          }}
          onPointerDown={(e) => handleResizePointerDown(e, "br")}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
        />
      )}
    </div>
  );
}

export function ProfileCard({
  profile,
  onPhotoClick,
  showEditButton = false,
  userEmail,
  templateSelection,
  captureId,
  editMode = false,
  selectedLayerId = null,
  onLayerUpdate,
  onLayerSelect,
}: ProfileCardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [resolvedBackgroundUrl, setResolvedBackgroundUrl] = useState<string | null>(null);
  const [resolvedPhotoUrl, setResolvedPhotoUrl] = useState<string | null>(null);
  const [backgroundRevoke, setBackgroundRevoke] = useState<(() => void) | null>(null);
  const [photoRevoke, setPhotoRevoke] = useState<(() => void) | null>(null);

  const assetNamespace = userEmail ?? sessionEmail ?? undefined;

  // Determine if we're using template mode (new) or legacy background mode
  const useTemplateMode = Boolean(templateSelection?.backgroundId);

  const templateTheme = useTemplateMode ? getTemplateThemeTokens(templateSelection?.backgroundId) : null;
  const isLightSurfaceTemplate = Boolean(useTemplateMode && templateTheme?.tone === "dark");

  // Auto-contrast: if palette color is set, override text color based on palette luminance.
  const paletteColor = templateSelection?.backgroundColor;
  const paletteOverridesContrast = useTemplateMode && paletteColor ? isLightColor(paletteColor) : null;
  const effectiveLightSurface = paletteOverridesContrast !== null ? paletteOverridesContrast : isLightSurfaceTemplate;

  const contentTextClass = effectiveLightSurface ? "text-gray-900" : "text-white";
  const hoverRowClass = effectiveLightSurface ? "hover:bg-black/5" : "hover:bg-white/10";
  const softPanelClass = effectiveLightSurface ? "bg-black/5" : "bg-white/10";
  const dividerBorderClass = effectiveLightSurface ? "border-black/10" : "border-white/20";
  const socialChipClass = effectiveLightSurface ? "bg-black/10 text-gray-900" : "bg-white/20 text-white";

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const theme = templateTheme;
    const tint = templateSelection?.backgroundColor;

    // Template background filter
    el.style.setProperty("--nbcard-template-bg-filter", theme?.backgroundFilter ?? "none");

    // Overlays (keep consistent for UI + exports)
    el.style.setProperty(
      "--nbcard-template-readability-alpha",
      String(typeof theme?.readabilityOverlayAlpha === "number" ? theme.readabilityOverlayAlpha : 0.35)
    );
    el.style.setProperty(
      "--nbcard-template-lighten-alpha",
      String(typeof theme?.lightenOverlayAlpha === "number" ? theme.lightenOverlayAlpha : 0)
    );

    // Palette tint
    if (typeof tint === "string" && tint.trim()) {
      el.style.setProperty("--nbcard-template-tint", tint.trim());
      el.style.setProperty("--nbcard-template-tint-alpha", "0.25");
    } else {
      el.style.setProperty("--nbcard-template-tint", "transparent");
      el.style.setProperty("--nbcard-template-tint-alpha", "0");
    }

    // Accent color (optional)
    const accent = (profile as unknown as { accentColor?: string }).accentColor;
    const nextAccent = (accent ?? "").toString().trim();
    if (/^#[0-9a-fA-F]{6}$/.test(nextAccent)) {
      el.style.setProperty("--nb-accent", nextAccent);
    } else {
      el.style.removeProperty("--nb-accent");
    }
  }, [profile, templateSelection?.backgroundColor, templateSelection?.backgroundId, templateTheme]);
  
  // Build template paths from IDs
  // New naming: "modern-geometric-landscape" -> "modern-geometric-landscape.svg"
  // Old naming: "modern_geometric_v1_landscape" -> "modern_geometric_landscape_bg.svg" (fallback)
  const getTemplatePath = (id: string, type: 'background' | 'overlay'): string => {
    // Try new direct naming first
    if (id && !id.includes('_v')) {
      const suffix = type === 'background' ? '.svg' : '.svg';
      return `/nb-card/templates/${type}s/${id}${suffix}`;
    }
    // Fallback for legacy versioned IDs
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

  const isFlyerPromoPortrait = templateSelection?.backgroundId === "flyer-promo-portrait" || templateSelection?.backgroundId === "flyer_promo_v1_portrait";
  const shareUrl = getProfileShareUrl(profile.id);
  
  // Determine card orientation from template
  const templateOrientation = templateSelection?.orientation || "landscape";
  const orientationClass = templateOrientation === "portrait" ? "aspect-[3/4]" : "aspect-video";

  return (
    <div
      id={captureId ?? "profile-card-capture"}
      ref={rootRef}
      className={cn(
        "relative isolate w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden",
        orientationClass,
        !hasAnyBackground && gradientClass,
        hasAnyBackground && (templateTheme?.tone === "dark" ? "bg-white" : "bg-gray-900")
      )}
    >
      {/* TEMPLATE BACKGROUND LAYER (z=0) */}
      {hasTemplateBackground && templateBackgroundSrc && (
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <CaptureImage
            src={templateBackgroundSrc}
            alt="Card background"
            className={cn("w-full h-full object-cover", styles.templateBgImage)}
          />
        </div>
      )}

      {/* OPTIONAL PALETTE TINT (z=1) */}
      {hasTemplateBackground && templateSelection?.backgroundColor ? (
        <div className={cn("absolute inset-0 z-[1] pointer-events-none", styles.templateTint)} aria-hidden="true" />
      ) : null}

      {/* LIGHTEN HARSH TEMPLATES (z=1) */}
      {hasTemplateBackground && templateTheme?.lightenOverlayAlpha && templateTheme.lightenOverlayAlpha > 0 ? (
        <div className={cn("absolute inset-0 z-[1] pointer-events-none", styles.templateLighten)} aria-hidden="true" />
      ) : null}

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

      {/* Readability overlay for readability (z=1) */}
      {hasAnyBackground && (templateTheme?.readabilityOverlayAlpha ?? 0.35) > 0 ? (
        <div className={cn("absolute inset-0 z-[1] pointer-events-none", styles.templateReadability)} aria-hidden="true" />
      ) : null}

      {/* TEMPLATE OVERLAY LAYER (z=2) */}
      {hasTemplateBackground && templateOverlaySrc ? (
        <div className="absolute inset-0 z-[2] pointer-events-none select-none">
          <CaptureImage src={templateOverlaySrc} alt="Card overlay" className="w-full h-full object-cover" />
        </div>
      ) : null}

      {/* CARD CONTENT (z=10) */}
      <div className={cn("relative z-10 p-8", contentTextClass)}>
        {isFlyerPromoPortrait ? (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 text-white">
                    <h2 className="text-3xl font-bold leading-tight" data-pdf-text={profile.flyerCard?.headline ?? ""}>
                      {profile.flyerCard?.headline || profile.fullName || "Headline"}
                    </h2>
                    {profile.flyerCard?.subheadline || profile.jobTitle ? (
                      <p className="mt-2 text-base opacity-90" data-pdf-text={profile.flyerCard?.subheadline ?? ""}>
                        {profile.flyerCard?.subheadline || profile.jobTitle}
                      </p>
                    ) : null}
                  </div>

                  {/* Main panel */}
                  <div className="rounded-2xl bg-white/95 p-5 text-gray-900">
                    {profile.profileDescription ? (
                      <p className="text-sm text-gray-700" data-pdf-text={profile.profileDescription}>
                        {profile.profileDescription}
                      </p>
                    ) : null}

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="flex flex-col gap-2">
                        <a
                          href={profile.flyerCard?.ctaUrl || shareUrl}
                          data-pdf-link={profile.flyerCard?.ctaUrl || shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "inline-flex items-center justify-center rounded-xl border-2 px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity",
                            styles.accentBorder,
                            styles.accentText
                          )}
                        >
                          {profile.flyerCard?.ctaText || "Open link"}
                        </a>
                        <p className="text-xs text-gray-600 break-all" data-pdf-text={profile.flyerCard?.ctaUrl || shareUrl}>
                          {profile.flyerCard?.ctaUrl || shareUrl}
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="rounded-xl bg-white p-2 shadow-md">
                          <QRCodeSVG value={profile.flyerCard?.ctaUrl || shareUrl} size={120} includeMargin level="M" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact strip */}
                  <div className="rounded-2xl bg-black/80 p-4 text-white">
                    <div className="flex flex-col gap-2 text-sm">
                      {profile.phone ? (
                        <a href={`tel:${profile.phone}`} data-pdf-link={`tel:${profile.phone}`} className="underline">
                          <span data-pdf-text={profile.phone}>{profile.phone}</span>
                        </a>
                      ) : null}
                      {profile.email ? (
                        <a href={`mailto:${profile.email}`} data-pdf-link={`mailto:${profile.email}`} className="underline">
                          <span data-pdf-text={profile.email}>{profile.email}</span>
                        </a>
                      ) : null}
                      {profile.website ? (
                        <a href={profile.website} data-pdf-link={profile.website} className="underline break-all">
                          <span data-pdf-text={profile.website}>{profile.website}</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
        ) : (
          <>
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
                            className={cn("w-5 h-5", styles.accentText)}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 0 016 0z"
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
            className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors", hoverRowClass)}
          >
            <FaPhone className="text-xl" />
            <span className="text-lg" data-pdf-text={profile?.phone ?? ""}>
              {profile?.phone ?? "Phone"}
            </span>
          </a>
          <a
            href={`mailto:${profile?.email ?? ""}`}
            data-pdf-link={`mailto:${profile?.email ?? ""}`}
            className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors", hoverRowClass)}
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
              className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors", hoverRowClass)}
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
                className={cn(
                  "backdrop-blur-md p-3 rounded-full transition-all hover:scale-110",
                  socialChipClass,
                  isLightSurfaceTemplate ? "hover:bg-black/15" : "hover:bg-white/30"
                )}
                aria-label={`Visit ${social.url}`}
              >
                <Icon className="text-2xl" />
              </a>
            );
          })}
        </div>

        {/* Descriptions */}
        {profile?.profileDescription && (
          <div className={cn("mt-6 backdrop-blur-md p-4 rounded-lg", softPanelClass)}>
            <h3 className="font-semibold mb-2">Profile</h3>
            <p className="text-sm opacity-90">{profile.profileDescription}</p>
          </div>
        )}
        {profile?.businessDescription && (
          <div className={cn("mt-3 backdrop-blur-md p-4 rounded-lg", softPanelClass)}>
            <h3 className="font-semibold mb-2">Business</h3>
            <p className="text-sm opacity-90">{profile.businessDescription}</p>
          </div>
        )}

        {/* Category-specific Details Blocks */}
        {profile?.cardCategory === "ADDRESS" && profile?.addressCard && (
          <div className={cn("mt-6 backdrop-blur-md p-4 rounded-lg", softPanelClass)}>
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
                <div className={cn("mt-3 pt-3 border-t", dividerBorderClass)}>
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
                <div className={cn("mt-3 pt-3 border-t space-y-2", dividerBorderClass)}>
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
          <div className={cn("mt-6 backdrop-blur-md p-4 rounded-lg", softPanelClass)}>
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
                <div className={cn("mt-3 pt-3 border-t", dividerBorderClass)}>
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
          <div className={cn("mt-6 backdrop-blur-md p-4 rounded-lg", softPanelClass)}>
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
                <div className={cn("mt-3 pt-3 border-t", dividerBorderClass)}>
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
          </>
        )}
      </div>

      {/* FREE LAYOUT EDITOR: CUSTOM LAYERS (z=15) */}
      {profile.layers && profile.layers.length > 0 && (
        <div className="absolute inset-0 z-[15] pointer-events-none">
          {profile.layers
            .filter((l) => l.visible)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((layer) => (
              <CardLayerRenderer
                key={layer.id}
                layer={layer}
                editMode={editMode}
                isSelected={selectedLayerId === layer.id}
                onSelect={onLayerSelect}
                onUpdate={onLayerUpdate}
                containerRef={rootRef}
              />
            ))}
        </div>
      )}
    </div>
  );
}

