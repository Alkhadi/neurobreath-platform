/**
 * NB-Card SVG Template Renderer
 * Single generic function to fill any SVG template with profile data
 * Phase 4: Data-driven SVG renderer implementation
 */

import type { Profile } from "@/lib/utils";
import type { Template } from "@/lib/nbcard-templates";

/**
 * Standard field IDs that should be present in SVG templates
 * Templates can include any subset of these IDs
 */
export const SVG_FIELD_IDS = {
  // Core identity
  fullName: "fullName",
  jobTitle: "jobTitle",
  
  // Contact
  phone: "phone",
  email: "email",
  website: "website",
  
  // Address fields
  addressLine1: "addressLine1",
  addressLine2: "addressLine2",
  city: "city",
  postcode: "postcode",
  country: "country",
  
  // Bank fields
  bankAccountName: "bankAccountName",
  bankName: "bankName",
  sortCode: "sortCode",
  accountNumber: "accountNumber",
  iban: "iban",
  swift: "swift",
  
  // Business fields
  bizCompanyName: "bizCompanyName",
  bizTagline: "bizTagline",
  bizServices: "bizServices",
  bizHours: "bizHours",
  bizLocation: "bizLocation",
  bizVatReg: "bizVatReg",
  
  // Social media
  instagram: "instagram",
  facebook: "facebook",
  tiktok: "tiktok",
  linkedin: "linkedin",
  twitter: "twitter",
  
  // Images
  avatarImage: "avatarImage",
  backgroundImage: "backgroundImage",
} as const;

/**
 * Extract field value from profile based on field ID
 */
function getProfileFieldValue(profile: Profile, fieldId: string): string | undefined {
  switch (fieldId) {
    // Core
    case SVG_FIELD_IDS.fullName:
      return profile.fullName;
    case SVG_FIELD_IDS.jobTitle:
      return profile.jobTitle;
    
    // Contact
    case SVG_FIELD_IDS.phone:
      return profile.phone;
    case SVG_FIELD_IDS.email:
      return profile.email;
    case SVG_FIELD_IDS.website:
      return profile.website;
    
    // Address
    case SVG_FIELD_IDS.addressLine1:
      return profile.addressCard?.addressLine1;
    case SVG_FIELD_IDS.addressLine2:
      return profile.addressCard?.addressLine2;
    case SVG_FIELD_IDS.city:
      return profile.addressCard?.city;
    case SVG_FIELD_IDS.postcode:
      return profile.addressCard?.postcode;
    case SVG_FIELD_IDS.country:
      return profile.addressCard?.country;
    
    // Bank
    case SVG_FIELD_IDS.bankAccountName:
      return profile.bankCard?.accountName;
    case SVG_FIELD_IDS.bankName:
      return profile.bankCard?.bankName;
    case SVG_FIELD_IDS.sortCode:
      return profile.bankCard?.sortCode;
    case SVG_FIELD_IDS.accountNumber:
      return profile.bankCard?.accountNumber;
    case SVG_FIELD_IDS.iban:
      return profile.bankCard?.iban;
    case SVG_FIELD_IDS.swift:
      return profile.bankCard?.swiftBic;
    
    // Business
    case SVG_FIELD_IDS.bizCompanyName:
      return profile.businessCard?.companyName;
    case SVG_FIELD_IDS.bizTagline:
      return profile.businessCard?.tagline;
    case SVG_FIELD_IDS.bizServices:
      return profile.businessCard?.services;
    case SVG_FIELD_IDS.bizHours:
      return profile.businessCard?.hours;
    case SVG_FIELD_IDS.bizLocation:
      return profile.businessCard?.locationNote;
    case SVG_FIELD_IDS.bizVatReg:
      return profile.businessCard?.vatOrRegNo;
    
    // Social
    case SVG_FIELD_IDS.instagram:
      return profile.socialMedia?.instagram;
    case SVG_FIELD_IDS.facebook:
      return profile.socialMedia?.facebook;
    case SVG_FIELD_IDS.tiktok:
      return profile.socialMedia?.tiktok;
    case SVG_FIELD_IDS.linkedin:
      return profile.socialMedia?.linkedin;
    case SVG_FIELD_IDS.twitter:
      return profile.socialMedia?.twitter;
    
    default:
      return undefined;
  }
}

/**
 * Fill SVG template with profile data
 * 
 * This is a single generic renderer that:
 * - Finds elements by ID
 * - Sets textContent for <text> elements
 * - Sets href/xlink:href for <image> elements
 * - Hides elements when data is missing (no ghost placeholders)
 * 
 * @param svgRoot - The SVG DOM element (can be from document or DocumentFragment)
 * @param profile - Profile data to fill
 * @param template - Template metadata (optional, for future template-specific quirks)
 * @param avatarUrl - Avatar image URL (optional)
 * @param backgroundUrl - Background image URL (optional)
 */
export function fillSvgTemplate(
  svgRoot: SVGSVGElement | DocumentFragment,
  profile: Profile,
  template?: Template,
  avatarUrl?: string,
  backgroundUrl?: string
): void {
  // Helper to find element by ID in both SVGSVGElement and DocumentFragment
  const getElementById = (id: string): Element | null => {
    if (svgRoot instanceof SVGSVGElement) {
      return svgRoot.getElementById(id);
    }
    // DocumentFragment doesn't have getElementById, use querySelector
    return svgRoot.querySelector(`#${CSS.escape(id)}`);
  };

  // Process all standard field IDs
  Object.values(SVG_FIELD_IDS).forEach((fieldId) => {
    const element = getElementById(fieldId);
    if (!element) return; // Field not in this template
    
    // Handle image elements
    if (fieldId === SVG_FIELD_IDS.avatarImage && avatarUrl) {
      if (element.tagName === "image") {
        element.setAttribute("href", avatarUrl);
        element.setAttribute("xlink:href", avatarUrl); // Fallback for older SVG
        element.setAttribute("opacity", "1");
        element.removeAttribute("display");
      }
      return;
    }
    
    if (fieldId === SVG_FIELD_IDS.backgroundImage && backgroundUrl) {
      if (element.tagName === "image") {
        element.setAttribute("href", backgroundUrl);
        element.setAttribute("xlink:href", backgroundUrl);
        element.setAttribute("opacity", "1");
        element.removeAttribute("display");
      }
      return;
    }
    
    // Handle text elements
    const value = getProfileFieldValue(profile, fieldId);
    
    if (value && value.trim()) {
      // Has value: set content and make visible
      if (element.tagName === "text" || element.tagName === "tspan") {
        element.textContent = value;
      }
      element.setAttribute("opacity", "1");
      element.removeAttribute("display");
    } else {
      // No value: hide element (no ghost placeholders)
      element.setAttribute("opacity", "0");
      element.setAttribute("display", "none");
      if (element.tagName === "text" || element.tagName === "tspan") {
        element.textContent = "";
      }
    }
  });
  
  // Template-specific quirks can be handled here via template metadata
  // Example: if (template?.id === 'special-template') { ... }
}

/**
 * Text overflow strategy enum
 */
export type TextOverflowStrategy = "truncate" | "wrap" | "scale";

/**
 * Apply text overflow handling to an SVG text element
 * This is a helper for templates that need overflow protection
 * 
 * @param textElement - SVG text element
 * @param maxWidth - Maximum width in SVG units
 * @param strategy - How to handle overflow
 */
export function applyTextOverflow(
  textElement: SVGTextElement,
  maxWidth: number,
  strategy: TextOverflowStrategy = "truncate"
): void {
  const bbox = textElement.getBBox();
  
  if (bbox.width <= maxWidth) {
    return; // Fits fine
  }
  
  const originalText = textElement.textContent || "";
  
  switch (strategy) {
    case "truncate": {
      // Binary search for longest text that fits
      let text = originalText;
      while (text.length > 0 && textElement.getBBox().width > maxWidth) {
        text = text.slice(0, -1);
        textElement.textContent = text + "…";
      }
      break;
    }
    
    case "wrap": {
      // Not implemented: requires converting to <tspan> with dy offsets
      // Fall back to truncate
      applyTextOverflow(textElement, maxWidth, "truncate");
      break;
    }
    
    case "scale": {
      // Scale font size proportionally
      const currentFontSize = parseFloat(textElement.getAttribute("font-size") || "12");
      const scaleFactor = maxWidth / bbox.width;
      const newFontSize = currentFontSize * scaleFactor * 0.95; // 5% padding
      textElement.setAttribute("font-size", newFontSize.toString());
      break;
    }
  }
}

/**
 * Batch fill multiple SVG templates
 * Useful when rendering front/back of business cards
 */
export function fillSvgTemplates(
  svgRoots: Array<{ svg: SVGSVGElement | DocumentFragment; template?: Template }>,
  profile: Profile,
  avatarUrl?: string,
  backgroundUrl?: string
): void {
  svgRoots.forEach(({ svg, template }) => {
    fillSvgTemplate(svg, profile, template, avatarUrl, backgroundUrl);
  });
}
