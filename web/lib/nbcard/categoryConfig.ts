/**
 * categoryConfig.ts — Category configs for NB-Card
 *
 * Defines required/optional/advanced fields + UI metadata (labels, placeholders,
 * helper text, maxLength, inputMode) per category. The form renders required
 * fields immediately, optional fields behind an "Add more details" toggle, and
 * advanced fields behind an "Advanced" toggle.
 *
 * This is DATA, not JSX — no React imports here.
 */

import type { CardCategory } from "./cardModel";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FieldMeta = {
  label: string;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
  /** HTML inputMode attribute */
  inputMode?:
    | "none"
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
  autoComplete?: string;
  type?: "text" | "email" | "tel" | "url" | "textarea";
};

export type CategoryConfig<TFields extends string = string> = {
  id: CardCategory;
  title: string;
  description: string;
  /** Fields shown by default (always visible) */
  requiredFields: readonly TFields[];
  /** Fields hidden under "Add more details (optional)" */
  optionalFields: readonly TFields[];
  /** Fields hidden under "Advanced (optional)" */
  advancedFields?: readonly TFields[];
  /** UI metadata */
  fieldMeta: Record<TFields, FieldMeta>;
  /** Default values used when initialising or resetting the section */
  defaults: Record<TFields, string>;
};

// ---------------------------------------------------------------------------
// Address
// ---------------------------------------------------------------------------

export type AddressFields =
  | "line1"
  | "line2"
  | "city"
  | "postcode"
  | "country"
  | "mapLabel"
  | "directionsNote"
  | "mapUrlOverride"
  | "mapDestinationOverride";

const addressConfig: CategoryConfig<AddressFields> = {
  id: "address",
  title: "Address details",
  description:
    "Fill in your address details. Your card will include a clickable Directions link that opens Google Maps.",
  requiredFields: ["line1", "city", "postcode", "country"],
  optionalFields: ["line2", "mapLabel", "directionsNote"],
  advancedFields: ["mapUrlOverride", "mapDestinationOverride"],
  fieldMeta: {
    line1: {
      label: "Address Line 1",
      placeholder: "Flat/House number and street",
      autoComplete: "address-line1",
    },
    line2: {
      label: "Address Line 2",
      placeholder: "Building, area, etc. (optional)",
      autoComplete: "address-line2",
    },
    city: {
      label: "City",
      placeholder: "City/Town",
      autoComplete: "address-level2",
    },
    postcode: {
      label: "Postcode",
      placeholder: "e.g., SE15 3BG",
      autoComplete: "postal-code",
    },
    country: {
      label: "Country",
      placeholder: "e.g., United Kingdom",
      autoComplete: "country-name",
    },
    mapLabel: {
      label: "Map Link Label",
      placeholder: "Get Directions",
      helperText: 'Label shown on the card (e.g., "Get Directions").',
      maxLength: 30,
    },
    directionsNote: {
      label: "Directions Note (short)",
      placeholder: 'e.g., "Near the library"',
      helperText: "Human-readable hint shown on the card. No URLs allowed.",
      maxLength: 60,
    },
    mapUrlOverride: {
      label: "Custom Directions/Map URL (optional)",
      placeholder: "https://www.google.com/maps/dir/?api=1&destination=...",
      helperText:
        "Paste a full Google Maps /dir/?api=1… link here to override default map behaviour.",
      inputMode: "url",
      type: "url",
    },
    mapDestinationOverride: {
      label: "Custom Destination (optional)",
      placeholder: "Eiffel Tower, Paris",
      helperText: "Plain text destination (no links).",
      maxLength: 80,
    },
  },
  defaults: {
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "",
    mapLabel: "Click Here",
    directionsNote: "",
    mapUrlOverride: "",
    mapDestinationOverride: "",
  },
};

// ---------------------------------------------------------------------------
// Bank
// ---------------------------------------------------------------------------

export type BankFields =
  | "bankName"
  | "accountName"
  | "sortCode"
  | "accountNumber"
  | "iban"
  | "swift"
  | "disclaimer";

const bankConfig: CategoryConfig<BankFields> = {
  id: "bank",
  title: "Bank details",
  description:
    "Share your payment details securely on your digital card. Only share with people you trust.",
  requiredFields: ["bankName", "accountName", "sortCode", "accountNumber"],
  optionalFields: ["iban", "swift"],
  advancedFields: ["disclaimer"],
  fieldMeta: {
    bankName: {
      label: "Bank Name",
      placeholder: "e.g., Barclays",
    },
    accountName: {
      label: "Account Name",
      placeholder: "Name on the account",
    },
    sortCode: {
      label: "Sort Code",
      placeholder: "00-00-00",
      inputMode: "numeric",
      maxLength: 8,
    },
    accountNumber: {
      label: "Account Number",
      placeholder: "8-digit account number",
      inputMode: "numeric",
      maxLength: 8,
    },
    iban: {
      label: "IBAN (optional)",
      placeholder: "GB00BANK12345678901234",
      helperText: "International Bank Account Number",
    },
    swift: {
      label: "SWIFT/BIC (optional)",
      placeholder: "e.g., BARCGB22",
      helperText: "Used for international transfers",
    },
    disclaimer: {
      label: "Disclaimer (optional)",
      placeholder: "e.g., For personal transfers only",
      helperText: "Short note shown at the bottom of the card.",
      maxLength: 120,
      type: "textarea",
    },
  },
  defaults: {
    bankName: "",
    accountName: "",
    sortCode: "",
    accountNumber: "",
    iban: "",
    swift: "",
    disclaimer: "",
  },
};

// ---------------------------------------------------------------------------
// Business
// ---------------------------------------------------------------------------

export type BusinessFields =
  | "companyName"
  | "services"
  | "hours"
  | "address"
  | "bookingLink"
  | "tagline";

const businessConfig: CategoryConfig<BusinessFields> = {
  id: "business",
  title: "Business profile",
  description:
    "Showcase your business with key details, services offered, and a booking link.",
  requiredFields: ["companyName", "services"],
  optionalFields: ["tagline", "hours", "address"],
  advancedFields: ["bookingLink"],
  fieldMeta: {
    companyName: {
      label: "Company Name",
      placeholder: "Your business name",
    },
    services: {
      label: "Services",
      placeholder: "e.g., Web design, photography, consulting",
      helperText: "Comma-separated list of services offered.",
      type: "textarea",
    },
    tagline: {
      label: "Tagline (optional)",
      placeholder: "Your short brand statement",
      maxLength: 80,
    },
    hours: {
      label: "Opening Hours (optional)",
      placeholder: "e.g., Mon–Fri 9am–6pm",
      maxLength: 80,
    },
    address: {
      label: "Business Address (optional)",
      placeholder: "Street, City, Postcode",
      type: "textarea",
    },
    bookingLink: {
      label: "Booking/Appointment Link (optional)",
      placeholder: "https://calendly.com/...",
      inputMode: "url",
      type: "url",
    },
  },
  defaults: {
    companyName: "",
    services: "",
    tagline: "",
    hours: "",
    address: "",
    bookingLink: "",
  },
};

// ---------------------------------------------------------------------------
// Flyer
// ---------------------------------------------------------------------------

export type FlyerFields =
  | "headline"
  | "subheadline"
  | "ctaLabel"
  | "ctaUrl"
  | "eventDate"
  | "location";

const flyerConfig: CategoryConfig<FlyerFields> = {
  id: "flyer",
  title: "Flyer / Event",
  description:
    "Create a digital flyer for an event, promotion, or announcement with a call-to-action.",
  requiredFields: ["headline"],
  optionalFields: ["subheadline", "eventDate", "location"],
  advancedFields: ["ctaLabel", "ctaUrl"],
  fieldMeta: {
    headline: {
      label: "Headline",
      placeholder: "Your main message or event name",
      maxLength: 80,
    },
    subheadline: {
      label: "Subheadline (optional)",
      placeholder: "More context or event tagline",
      maxLength: 120,
    },
    ctaLabel: {
      label: "CTA Button Label (optional)",
      placeholder: "e.g., Book Now, Register, RSVP",
      maxLength: 30,
    },
    ctaUrl: {
      label: "CTA URL (optional)",
      placeholder: "https://...",
      inputMode: "url",
      type: "url",
    },
    eventDate: {
      label: "Event Date (optional)",
      placeholder: "e.g., Saturday 12 April 2025",
      maxLength: 60,
    },
    location: {
      label: "Location (optional)",
      placeholder: "Venue name and address",
      maxLength: 100,
    },
  },
  defaults: {
    headline: "",
    subheadline: "",
    ctaLabel: "",
    ctaUrl: "",
    eventDate: "",
    location: "",
  },
};

// ---------------------------------------------------------------------------
// Wedding
// ---------------------------------------------------------------------------

export type WeddingFields =
  | "coupleNames"
  | "date"
  | "venue"
  | "rsvpLabel"
  | "rsvpUrl";

const weddingConfig: CategoryConfig<WeddingFields> = {
  id: "wedding",
  title: "Wedding",
  description:
    "Share your wedding details with guests — date, venue, and an RSVP link.",
  requiredFields: ["coupleNames", "date", "venue"],
  optionalFields: ["rsvpLabel", "rsvpUrl"],
  fieldMeta: {
    coupleNames: {
      label: "Couple Names",
      placeholder: "e.g., Alex & Jordan",
      maxLength: 80,
    },
    date: {
      label: "Wedding Date",
      placeholder: "e.g., Saturday 20 September 2025",
      maxLength: 60,
    },
    venue: {
      label: "Venue",
      placeholder: "Venue name and address",
      maxLength: 120,
    },
    rsvpLabel: {
      label: "RSVP Button Label (optional)",
      placeholder: "e.g., RSVP Now",
      maxLength: 30,
    },
    rsvpUrl: {
      label: "RSVP Link (optional)",
      placeholder: "https://...",
      inputMode: "url",
      type: "url",
    },
  },
  defaults: {
    coupleNames: "",
    date: "",
    venue: "",
    rsvpLabel: "RSVP Now",
    rsvpUrl: "",
  },
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const CATEGORY_CONFIG: Record<CardCategory, CategoryConfig> = {
  address: addressConfig as CategoryConfig,
  bank: bankConfig as CategoryConfig,
  business: businessConfig as CategoryConfig,
  flyer: flyerConfig as CategoryConfig,
  wedding: weddingConfig as CategoryConfig,
};

/**
 * Returns the config for a given category.
 */
export function getCategoryConfig(category: CardCategory): CategoryConfig {
  return CATEGORY_CONFIG[category];
}

/**
 * Returns all required field keys for a category.
 */
export function getRequiredFields(category: CardCategory): readonly string[] {
  return CATEGORY_CONFIG[category].requiredFields;
}

/**
 * Returns all optional field keys for a category.
 */
export function getOptionalFields(category: CardCategory): readonly string[] {
  return CATEGORY_CONFIG[category].optionalFields;
}

/**
 * Returns advanced field keys (or empty array) for a category.
 */
export function getAdvancedFields(category: CardCategory): readonly string[] {
  return CATEGORY_CONFIG[category].advancedFields ?? [];
}

/**
 * Returns field metadata for a specific field within a category.
 */
export function getFieldMeta(
  category: CardCategory,
  field: string
): FieldMeta | undefined {
  return (CATEGORY_CONFIG[category].fieldMeta as Record<string, FieldMeta>)[field];
}
