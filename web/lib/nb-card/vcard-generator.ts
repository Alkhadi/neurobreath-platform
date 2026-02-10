/**
 * NB-Card vCard Generator (improved correctness)
 * Implements vCard 3.0 format per spec requirements
 */

import type { Profile } from "@/lib/utils";

/**
 * Generate a vCard (VCF) file content from a profile
 * Follows vCard 3.0 spec with correct field mappings
 */
export function generateVCard(profile: Profile, options?: { includeBankDetails?: boolean }): string {
  const lines: string[] = [];

  // Header
  lines.push("BEGIN:VCARD");
  lines.push("VERSION:3.0");

  // FN (Full Name) - required
  if (profile.fullName?.trim()) {
    lines.push(`FN:${escapeVCardValue(profile.fullName)}`);
  } else {
    lines.push("FN:Unknown");
  }

  // N (Structured Name) - optional but recommended
  // Format: Family;Given;Additional;Honorific Prefix;Honorific Suffix
  const lastName = profile.fullName?.split(" ").slice(-1)[0] || "";
  const firstName = profile.fullName?.split(" ").slice(0, -1).join(" ") || "";
  if (lastName || firstName) {
    lines.push(`N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`);
  }

  // ORG (Organization)
  if (profile.businessDescription?.trim()) {
    lines.push(`ORG:${escapeVCardValue(profile.businessDescription)}`);
  }

  // TITLE (Job Title)
  if (profile.jobTitle?.trim()) {
    lines.push(`TITLE:${escapeVCardValue(profile.jobTitle)}`);
  }

  // TEL (Phone)
  if (profile.phone?.trim()) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(profile.phone)}`);
  }

  // EMAIL
  if (profile.email?.trim()) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(profile.email)}`);
  }

  // URL (Website)
  if (profile.socialMedia?.website?.trim()) {
    lines.push(`URL:${escapeVCardValue(profile.socialMedia.website)}`);
  }

  // ADR (Address) - only if profile has address fields (future-proof)
  // Format: ;;Street;City;Region;Postal Code;Country
  // Currently Profile doesn't have address fields, but we keep this for future

  // NOTE (Profile Description)
  if (profile.profileDescription?.trim()) {
    lines.push(`NOTE:${escapeVCardValue(profile.profileDescription)}`);
  }

  // Bank details: NEVER include by default (unsafe)
  // If explicitly opted in, add to NOTE with clear labeling
  if (options?.includeBankDetails) {
    // Bank details would go here IF they exist in Profile type
    // Currently not implemented in Profile schema
    // Future: add bank fields and include here ONLY if opted in
  }

  // Footer
  lines.push("END:VCARD");

  return lines.join("\r\n");
}

/**
 * Escape special characters for vCard format
 * Per RFC 2426: escape \, newline, comma, semicolon
 */
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * Generate a safe filename from profile data
 */
export function getVCardFilename(profile: Profile): string {
  const name = profile.fullName?.trim() || "Contact";
  const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${safeName}.vcf`;
}

/**
 * Estimate vCard text size (for QR generation)
 */
export function estimateVCardSize(profile: Profile): number {
  return generateVCard(profile).length;
}

/**
 * Generate trimmed vCard for QR (only essential fields)
 * Use when full vCard is too large for QR encoding
 */
export function generateTrimmedVCard(profile: Profile): string {
  const lines: string[] = [];

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:3.0");

  // FN (required)
  if (profile.fullName?.trim()) {
    lines.push(`FN:${escapeVCardValue(profile.fullName)}`);
  } else {
    lines.push("FN:Unknown");
  }

  // TEL (essential)
  if (profile.phone?.trim()) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(profile.phone)}`);
  }

  // EMAIL (essential)
  if (profile.email?.trim()) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(profile.email)}`);
  }

  // URL (essential if present)
  if (profile.socialMedia?.website?.trim()) {
    lines.push(`URL:${escapeVCardValue(profile.socialMedia.website)}`);
  }

  // ORG and TITLE are nice-to-have but may be dropped if size is an issue
  if (profile.businessDescription?.trim()) {
    lines.push(`ORG:${escapeVCardValue(profile.businessDescription)}`);
  }
  if (profile.jobTitle?.trim()) {
    lines.push(`TITLE:${escapeVCardValue(profile.jobTitle)}`);
  }

  lines.push("END:VCARD");

  return lines.join("\r\n");
}
