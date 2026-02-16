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
  | "facebook"
  | "addressLine1"
  | "addressLine2"
  | "city"
  | "postcode"
  | "country"
  | "directionsNote"
  | "bankAccountName"
  | "bankName"
  | "sortCode"
  | "accountNumber"
  | "iban"
  | "swiftBic"
  | "paymentLink"
  | "referenceNote"
  | "companyName"
  | "tagline"
  | "services"
  | "websiteUrl"
  | "locationNote"
  | "hours"
  | "bookingLink"
  | "vatOrRegNo"
  | "flyerHeadline"
  | "flyerSubheadline"
  | "flyerCtaUrl"
  | "weddingHeadline"
  | "weddingSubheadline"
  | "weddingCtaUrl";

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

    // Address card fields
    addressLine1: false,
    addressLine2: false,
    city: false,
    postcode: false,
    country: false,
    directionsNote: false,

    // Bank card fields (sensitive)
    bankAccountName: false,
    bankName: false,
    sortCode: false,
    accountNumber: false,
    iban: false,
    swiftBic: false,
    paymentLink: false,
    referenceNote: false,

    // Business card fields
    companyName: false,
    tagline: false,
    services: false,
    websiteUrl: false,
    locationNote: false,
    hours: false,
    bookingLink: false,
    vatOrRegNo: false,

    // Flyer card fields
    flyerHeadline: false,
    flyerSubheadline: false,
    flyerCtaUrl: false,

      // Wedding card fields
      weddingHeadline: false,
      weddingSubheadline: false,
      weddingCtaUrl: false,
  };
}

/**
 * Category-aware defaults used for shares/exports.
 * This keeps PROFILE defaults privacy-first, while enabling the fields a user
 * is explicitly editing for ADDRESS/BANK/BUSINESS/FLYER cards.
 */
export function getDefaultIncludedFieldsForProfile(profile: Profile): Set<RedactableField> {
  const populated = getPopulatedFields(profile);
  const defaults = getDefaultRedactionSettings();
  const initial = new Set<RedactableField>();

  for (const field of populated) {
    if (defaults[field]) initial.add(field);
  }

  switch (profile.cardCategory) {
    case "ADDRESS": {
      [
        "addressLine1",
        "addressLine2",
        "city",
        "postcode",
        "country",
        "directionsNote",
      ].forEach((f) => {
        if (populated.includes(f as RedactableField)) initial.add(f as RedactableField);
      });
      break;
    }
    case "BANK": {
      [
        "bankAccountName",
        "bankName",
        "sortCode",
        "accountNumber",
        "iban",
        "swiftBic",
        "paymentLink",
        "referenceNote",
      ].forEach((f) => {
        if (populated.includes(f as RedactableField)) initial.add(f as RedactableField);
      });
      break;
    }
    case "BUSINESS": {
      [
        "companyName",
        "tagline",
        "services",
        "websiteUrl",
        "locationNote",
        "hours",
        "bookingLink",
        "vatOrRegNo",
      ].forEach((f) => {
        if (populated.includes(f as RedactableField)) initial.add(f as RedactableField);
      });
      break;
    }
    case "FLYER": {
      ["flyerHeadline", "flyerSubheadline", "flyerCtaUrl"].forEach((f) => {
        if (populated.includes(f as RedactableField)) initial.add(f as RedactableField);
      });
      break;
    }
      case "WEDDING": {
        ["weddingHeadline", "weddingSubheadline", "weddingCtaUrl"].forEach((f) => {
          if (populated.includes(f as RedactableField)) initial.add(f as RedactableField);
        });
        break;
      }
    default:
      break;
  }

  return initial;
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

  // Address card redaction
  if (redacted.addressCard) {
    const next = { ...(redacted.addressCard ?? {}) };
    if (!includedFields.has("addressLine1")) next.addressLine1 = undefined;
    if (!includedFields.has("addressLine2")) next.addressLine2 = undefined;
    if (!includedFields.has("city")) next.city = undefined;
    if (!includedFields.has("postcode")) next.postcode = undefined;
    if (!includedFields.has("country")) next.country = undefined;
    if (!includedFields.has("directionsNote")) next.directionsNote = undefined;
    redacted.addressCard = next;
  }

  // Bank card redaction
  if (redacted.bankCard) {
    const next = { ...(redacted.bankCard ?? {}) };
    if (!includedFields.has("bankAccountName")) next.accountName = undefined;
    if (!includedFields.has("bankName")) next.bankName = undefined;
    if (!includedFields.has("sortCode")) next.sortCode = undefined;
    if (!includedFields.has("accountNumber")) next.accountNumber = undefined;
    if (!includedFields.has("iban")) next.iban = undefined;
    if (!includedFields.has("swiftBic")) next.swiftBic = undefined;
    if (!includedFields.has("paymentLink")) next.paymentLink = undefined;
    if (!includedFields.has("referenceNote")) next.referenceNote = undefined;
    redacted.bankCard = next;
  }

  // Business card redaction
  if (redacted.businessCard) {
    const next = { ...(redacted.businessCard ?? {}) };
    if (!includedFields.has("companyName")) next.companyName = undefined;
    if (!includedFields.has("tagline")) next.tagline = undefined;
    if (!includedFields.has("services")) next.services = undefined;
    if (!includedFields.has("websiteUrl")) next.websiteUrl = undefined;
    if (!includedFields.has("locationNote")) next.locationNote = undefined;
    if (!includedFields.has("hours")) next.hours = undefined;
    if (!includedFields.has("bookingLink")) next.bookingLink = undefined;
    if (!includedFields.has("vatOrRegNo")) next.vatOrRegNo = undefined;
    redacted.businessCard = next;
  }

  // Flyer card redaction
  if (redacted.flyerCard) {
    const next = { ...(redacted.flyerCard ?? {}) };
    if (!includedFields.has("flyerHeadline")) next.headline = undefined;
    if (!includedFields.has("flyerSubheadline")) next.subheadline = undefined;
    if (!includedFields.has("flyerCtaUrl")) next.ctaUrl = undefined;
    redacted.flyerCard = next;
  }

  // Wedding card redaction
  if (redacted.weddingCard) {
    const next = { ...(redacted.weddingCard ?? {}) };
    if (!includedFields.has("weddingHeadline")) next.headline = undefined;
    if (!includedFields.has("weddingSubheadline")) next.subheadline = undefined;
    if (!includedFields.has("weddingCtaUrl")) next.ctaUrl = undefined;
    redacted.weddingCard = next;
  }

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

    addressLine1: "Address line 1",
    addressLine2: "Address line 2",
    city: "City",
    postcode: "Postcode",
    country: "Country",
    directionsNote: "Directions note",

    bankAccountName: "Account name",
    bankName: "Bank name",
    sortCode: "Sort code",
    accountNumber: "Account number",
    iban: "IBAN",
    swiftBic: "SWIFT/BIC",
    paymentLink: "Payment link",
    referenceNote: "Payment reference",

    companyName: "Company name",
    tagline: "Tagline",
    services: "Services",
    websiteUrl: "Business website",
    locationNote: "Location note",
    hours: "Hours",
    bookingLink: "Booking link",
    vatOrRegNo: "VAT/Reg no.",

    flyerHeadline: "Flyer headline",
    flyerSubheadline: "Flyer subheadline",
    flyerCtaUrl: "Flyer CTA link",

    weddingHeadline: "Wedding headline",
    weddingSubheadline: "Wedding subheadline",
    weddingCtaUrl: "Wedding CTA link",
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

    case "addressLine1":
      return !!profile.addressCard?.addressLine1?.trim();
    case "addressLine2":
      return !!profile.addressCard?.addressLine2?.trim();
    case "city":
      return !!profile.addressCard?.city?.trim();
    case "postcode":
      return !!profile.addressCard?.postcode?.trim();
    case "country":
      return !!profile.addressCard?.country?.trim();
    case "directionsNote":
      return !!profile.addressCard?.directionsNote?.trim();

    case "bankAccountName":
      return !!profile.bankCard?.accountName?.trim();
    case "bankName":
      return !!profile.bankCard?.bankName?.trim();
    case "sortCode":
      return !!profile.bankCard?.sortCode?.trim();
    case "accountNumber":
      return !!profile.bankCard?.accountNumber?.trim();
    case "iban":
      return !!profile.bankCard?.iban?.trim();
    case "swiftBic":
      return !!profile.bankCard?.swiftBic?.trim();
    case "paymentLink":
      return !!profile.bankCard?.paymentLink?.trim();
    case "referenceNote":
      return !!profile.bankCard?.referenceNote?.trim();

    case "companyName":
      return !!profile.businessCard?.companyName?.trim();
    case "tagline":
      return !!profile.businessCard?.tagline?.trim();
    case "services":
      return !!profile.businessCard?.services?.trim();
    case "websiteUrl":
      return !!profile.businessCard?.websiteUrl?.trim();
    case "locationNote":
      return !!profile.businessCard?.locationNote?.trim();
    case "hours":
      return !!profile.businessCard?.hours?.trim();
    case "bookingLink":
      return !!profile.businessCard?.bookingLink?.trim();
    case "vatOrRegNo":
      return !!profile.businessCard?.vatOrRegNo?.trim();

    case "flyerHeadline":
      return !!profile.flyerCard?.headline?.trim();
    case "flyerSubheadline":
      return !!profile.flyerCard?.subheadline?.trim();
    case "flyerCtaUrl":
      return !!profile.flyerCard?.ctaUrl?.trim();

    case "weddingHeadline":
      return !!profile.weddingCard?.headline?.trim();
    case "weddingSubheadline":
      return !!profile.weddingCard?.subheadline?.trim();
    case "weddingCtaUrl":
      return !!profile.weddingCard?.ctaUrl?.trim();
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

    "addressLine1",
    "addressLine2",
    "city",
    "postcode",
    "country",
    "directionsNote",

    "bankAccountName",
    "bankName",
    "sortCode",
    "accountNumber",
    "iban",
    "swiftBic",
    "paymentLink",
    "referenceNote",

    "companyName",
    "tagline",
    "services",
    "websiteUrl",
    "locationNote",
    "hours",
    "bookingLink",
    "vatOrRegNo",

    "flyerHeadline",
    "flyerSubheadline",
    "flyerCtaUrl",

    "weddingHeadline",
    "weddingSubheadline",
    "weddingCtaUrl",
  ];

  return allFields.filter((field) => hasFieldContent(profile, field));
}
