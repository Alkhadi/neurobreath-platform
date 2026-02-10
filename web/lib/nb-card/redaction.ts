/**
 * NB-Card Field Redaction
 * Controls which fields are included in exports/shares
 * Implements privacy-by-design defaults (sensitive fields OFF by default)
 */

import type { Profile } from "@/lib/utils";

export type RedactableField =
  | "fullName"
  | "jobTitle"
  | "email"
  | "phone"
  | "profileDescription"
  | "businessDescription"
  | "website"
  | "instagram"
  | "linkedin"
  | "twitter"
  | "facebook";

/**
 * Default inclusion settings: sensitive fields OFF by default
 */
export function getDefaultRedactionSettings(): Record<RedactableField, boolean> {
  return {
    fullName: true,
    jobTitle: true,
    email: true,
    phone: true,
    profileDescription: true,
    businessDescription: true,
    website: true,
    instagram: false, // Social media OFF by default for privacy
    linkedin: false,
    twitter: false,
    facebook: false,
  };
}

/**
 * Apply redaction to a profile based on field selection
 * Returns a new profile with excluded fields cleared
 */
export function applyRedaction(
  profile: Profile,
  includedFields: Set<RedactableField>
): Profile {
  const redacted: Profile = { ...profile };

  if (!includedFields.has("fullName")) redacted.fullName = "";
  if (!includedFields.has("jobTitle")) redacted.jobTitle = "";
  if (!includedFields.has("email")) redacted.email = "";
  if (!includedFields.has("phone")) redacted.phone = "";
  if (!includedFields.has("profileDescription")) redacted.profileDescription = "";
  if (!includedFields.has("businessDescription")) redacted.businessDescription = "";

  // Social media redaction
  if (redacted.socialMedia) {
    const social = { ...redacted.socialMedia };
    if (!includedFields.has("website")) social.website = undefined;
    if (!includedFields.has("instagram")) social.instagram = undefined;
    if (!includedFields.has("linkedin")) social.linkedin = undefined;
    if (!includedFields.has("twitter")) social.twitter = undefined;
    if (!includedFields.has("facebook")) social.facebook = undefined;
    redacted.socialMedia = social;
  }

  return redacted;
}

/**
 * Get user-friendly labels for each field
 */
export function getFieldLabel(field: RedactableField): string {
  const labels: Record<RedactableField, string> = {
    fullName: "Name",
    jobTitle: "Job Title",
    email: "Email",
    phone: "Phone",
    profileDescription: "Profile Description",
    businessDescription: "Business Description",
    website: "Website",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    twitter: "Twitter",
    facebook: "Facebook",
  };
  return labels[field];
}

/**
 * Check if profile has any content in a given field
 */
export function hasFieldContent(profile: Profile, field: RedactableField): boolean {
  switch (field) {
    case "fullName":
      return !!profile.fullName?.trim();
    case "jobTitle":
      return !!profile.jobTitle?.trim();
    case "email":
      return !!profile.email?.trim();
    case "phone":
      return !!profile.phone?.trim();
    case "profileDescription":
      return !!profile.profileDescription?.trim();
    case "businessDescription":
      return !!profile.businessDescription?.trim();
    case "website":
      return !!profile.socialMedia?.website?.trim();
    case "instagram":
      return !!profile.socialMedia?.instagram?.trim();
    case "linkedin":
      return !!profile.socialMedia?.linkedin?.trim();
    case "twitter":
      return !!profile.socialMedia?.twitter?.trim();
    case "facebook":
      return !!profile.socialMedia?.facebook?.trim();
    default:
      return false;
  }
}

/**
 * Get list of populated fields in a profile
 */
export function getPopulatedFields(profile: Profile): RedactableField[] {
  const allFields: RedactableField[] = [
    "fullName",
    "jobTitle",
    "email",
    "phone",
    "profileDescription",
    "businessDescription",
    "website",
    "instagram",
    "linkedin",
    "twitter",
    "facebook",
  ];

  return allFields.filter((field) => hasFieldContent(profile, field));
}
