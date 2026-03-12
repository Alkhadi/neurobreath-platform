/**
 * profileToCardModel.ts
 *
 * Bridge between the editor's Profile type (from lib/utils.ts) and the
 * canonical CardModel type (from lib/nbcard/cardModel.ts) used by the
 * server-backed share API.
 *
 * This is the single place where the two type systems are reconciled.
 * Includes all serializable canvas layers, template selection, and profile
 * fields — producing a fully reconstructable share snapshot.
 *
 * Asset normalization (local:// → S3) is the caller's responsibility:
 * call normalizeLayerImageRefs() and normalizeProfileAssets() before invoking
 * this function if you need cross-device image fidelity.
 */

import type { Profile, CardLayer, AvatarLayer } from "@/lib/utils";
import type { TemplateSelection } from "@/lib/nbcard-templates";
import type { CardModel, CardCategory, CanvasElement } from "@/lib/nbcard/cardModel";
import { CARD_MODEL_VERSION } from "@/lib/nbcard/cardModel";

// ---------------------------------------------------------------------------
// Category mapping
// ---------------------------------------------------------------------------

const PROFILE_CATEGORY_TO_CARD: Record<string, CardCategory> = {
  ADDRESS: "address",
  BANK: "bank",
  BUSINESS: "business",
  FLYER: "flyer",
  WEDDING: "wedding",
  PROFILE: "business",
};

// ---------------------------------------------------------------------------
// Local asset detection
// ---------------------------------------------------------------------------

function isLocalOnlyRef(src: string | undefined): boolean {
  if (!src) return false;
  return src.startsWith("local://") || src.startsWith("blob:");
}

// ---------------------------------------------------------------------------
// CardLayer → CanvasElement mapping
//
// Maps the editor's free-layout layer types to the serializable CanvasElement
// format stored in CardModel.canvas.elements.
//
// Rules:
// - All pure-data layers (text, shape, qr) are fully preserved.
// - Avatar layers with stable (https://) image refs are included.
// - Avatar layers with local-only refs (local://, blob:) have imageRef cleared.
//   Callers that need cross-device image fidelity must call
//   normalizeLayerImageRefs() from normalizeAssets.ts first.
// ---------------------------------------------------------------------------

export function cardLayersToCanvasElements(
  layers: CardLayer[] | undefined
): CanvasElement[] {
  if (!layers || layers.length === 0) return [];

  return layers.map((layer): CanvasElement => {
    const base = {
      id: layer.id,
      x: layer.x,
      y: layer.y,
      w: layer.w,
      h: layer.h,
      rotate: layer.rotation ?? 0,
      zIndex: layer.zIndex,
      visible: layer.visible,
      locked: layer.locked,
    };

    switch (layer.type) {
      case "text":
        return {
          ...base,
          type: "text",
          text: layer.style.content,
          linkUrl: layer.href,
          style: {
            fontSize: layer.style.fontSize,
            fontFamily: layer.style.fontFamily,
            fontWeight: layer.style.fontWeight,
            align: layer.style.align,
            color: layer.style.color,
            backgroundColor: layer.style.backgroundColor,
            padding: layer.style.padding,
          },
          fieldBinding: layer.fieldLink,
        };

      case "avatar": {
        const av = layer as AvatarLayer;
        return {
          ...base,
          type: "image",
          // Only persist stable URLs; local/blob refs must be normalized before calling
          imageRef: isLocalOnlyRef(av.style.src) ? undefined : (av.style.src || undefined),
          style: {
            fit: av.style.fit,
            borderRadius: av.style.borderRadius,
            borderWidth: av.style.borderWidth,
            borderColor: av.style.borderColor,
          },
        };
      }

      case "shape":
        return {
          ...base,
          type: "shape",
          style: {
            shapeKind: layer.style.shapeKind,
            fill: layer.style.fill,
            stroke: layer.style.stroke,
            strokeWidth: layer.style.strokeWidth,
            opacity: layer.style.opacity,
            cornerRadius: layer.style.cornerRadius,
          },
        };

      case "qr":
        return {
          ...base,
          type: "qr",
          style: {
            value: layer.style.value,
            fill: layer.style.fill,
            background: layer.style.background,
            level: layer.style.level,
            marginSize: layer.style.marginSize,
          },
        };
    }
  });
}

// ---------------------------------------------------------------------------
// Main bridge
// ---------------------------------------------------------------------------

/**
 * Convert the editor's Profile + TemplateSelection into a portable CardModel
 * suitable for the share API (POST /api/nb-card/share).
 *
 * This produces a FULL snapshot including:
 * - All profile/contact fields
 * - Category-specific data
 * - Social links
 * - Canvas layers (text, shape, qr fully included; avatar only if imageRef is stable)
 * - Template/style selection
 *
 * For cross-device image fidelity, normalize local assets BEFORE calling:
 *   const normalizedLayers = await normalizeLayerImageRefs(profile.layers, userEmail)
 *   const normalizedAssets = await normalizeProfileAssets(profile, userEmail)
 *   // Pass normalized data through
 */
export function profileToCardModel(
  profile: Profile,
  templateSelection?: TemplateSelection
): CardModel {
  const profileCategory = (profile.cardCategory ?? "PROFILE").toUpperCase();
  const category: CardCategory =
    PROFILE_CATEGORY_TO_CARD[profileCategory] ?? "business";

  const categoryData = buildCategoryData(profileCategory, profile);
  const now = new Date().toISOString();

  // Include all serializable canvas layers in the snapshot
  const canvasElements = cardLayersToCanvasElements(profile.layers);

  return {
    meta: {
      id: profile.id || `p_${Date.now()}`,
      version: CARD_MODEL_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    category,
    style: {
      backgroundPresetId: templateSelection?.backgroundId ?? undefined,
      accentColor: profile.accentColor ?? undefined,
      fontFamily: profile.typography?.fontKey ?? undefined,
      // Only include stable (non-local) background image refs
      backgroundImageRef:
        profile.backgroundUrl && !isLocalOnlyRef(profile.backgroundUrl)
          ? profile.backgroundUrl
          : undefined,
    },
    profile: {
      fullName: profile.fullName ?? "",
      jobTitle: profile.jobTitle ?? "",
      phone: profile.phone ?? "",
      email: profile.email ?? "",
      profileDescription: (profile.profileDescription ?? "").slice(0, 50),
      businessDescription: (profile.businessDescription ?? "").slice(0, 50),
      // Only include stable photo URL; local refs are excluded unless normalized
      photoRef:
        profile.photoUrl && !isLocalOnlyRef(profile.photoUrl)
          ? profile.photoUrl
          : undefined,
    },
    social: {
      website: profile.website ?? profile.socialMedia?.website ?? "",
      instagram: profile.socialMedia?.instagram ?? "",
      facebook: profile.socialMedia?.facebook ?? "",
      tiktok: profile.socialMedia?.tiktok ?? "",
      linkedin: profile.socialMedia?.linkedin ?? "",
      x: profile.socialMedia?.twitter ?? "",
    },
    categoryData,
    canvas: { elements: canvasElements },
  };
}

// ---------------------------------------------------------------------------
// Category-specific data builders
// ---------------------------------------------------------------------------

function buildCategoryData(
  category: string,
  profile: Profile
): Record<string, unknown> {
  switch (category) {
    case "ADDRESS": {
      const a = profile.addressCard ?? {};
      return {
        line1: a.addressLine1 ?? "",
        line2: a.addressLine2 ?? "",
        city: a.city ?? "",
        postcode: a.postcode ?? "",
        country: a.country ?? "",
        mapLabel: a.mapLinkLabel ?? "",
        directionsNote: a.directionsNote ?? "",
        mapUrlOverride: a.mapUrlOverride ?? "",
        mapDestinationOverride:
          a.mapDestinationOverride ?? a.mapQueryOverride ?? "",
      };
    }

    case "BANK": {
      const b = profile.bankCard ?? {};
      return {
        bankName: b.bankName ?? "",
        accountName: b.accountName ?? "",
        sortCode: b.sortCode ?? "",
        accountNumber: b.accountNumber ?? "",
        iban: b.iban ?? "",
        swift: b.swiftBic ?? "",
        disclaimer: "",
      };
    }

    case "BUSINESS": {
      const biz = profile.businessCard ?? {};
      return {
        companyName: biz.companyName ?? "",
        services: biz.services ?? "",
        hours: biz.hours ?? "",
        address: biz.locationNote ?? "",
        bookingLink: biz.bookingLink ?? "",
        tagline: biz.tagline ?? "",
      };
    }

    case "FLYER": {
      const f = profile.flyerCard ?? {};
      return {
        headline: f.headline ?? "",
        subheadline: f.subheadline ?? "",
        ctaLabel: f.ctaText ?? "",
        ctaUrl: f.ctaUrl ?? "",
        eventDate: "",
        location: "",
      };
    }

    case "WEDDING": {
      const w = profile.weddingCard ?? {};
      return {
        coupleNames: w.headline ?? "",
        date: w.subheadline ?? "",
        venue: "",
        rsvpLabel: w.ctaText ?? "",
        rsvpUrl: w.ctaUrl ?? "",
      };
    }

    default: {
      const biz = profile.businessCard ?? {};
      return {
        companyName: biz.companyName ?? "",
        services: biz.services ?? "",
        hours: biz.hours ?? "",
        address: biz.locationNote ?? "",
        bookingLink: biz.bookingLink ?? "",
        tagline: biz.tagline ?? "",
      };
    }
  }
}
