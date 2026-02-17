/**
 * mapHref.ts — Build consistent Google Maps links for NB-Card
 * Ensures URLs never leak into visible card text
 */

import { isValidHttpUrl, looksLikeUrl } from "./sanitize";
import type { Profile } from "@/lib/utils";

export interface AddressFields {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

/**
 * Build a Google Maps directions link from address data
 * Priority:
 * 1. mapUrlOverride (if valid http(s) URL)
 * 2. mapDestinationOverride (or legacy mapQueryOverride if NOT a URL)
 * 3. Composed address string from fields
 */
export function buildMapHref(
  addressCard: NonNullable<Profile["addressCard"]> | undefined,
  addressFields?: AddressFields
): string {
  if (!addressCard) {
    // Fallback to composed address if no addressCard
    const destination = composeAddressString(addressFields);
    return buildDirectionsUrl(destination);
  }

  // 1. Check mapUrlOverride first
  if (addressCard.mapUrlOverride && isValidHttpUrl(addressCard.mapUrlOverride)) {
    return addressCard.mapUrlOverride;
  }

  // 2. Check mapDestinationOverride (or legacy mapQueryOverride)
  const customDestination = addressCard.mapDestinationOverride || addressCard.mapQueryOverride;
  
  if (customDestination) {
    // If someone pasted a URL into the destination field, treat it as a URL override
    if (isValidHttpUrl(customDestination)) {
      return customDestination;
    }
    
    // If it looks like a URL but isn't valid, try to treat it as one
    if (looksLikeUrl(customDestination) && customDestination.includes(".")) {
      // Attempt to parse as URL with https:// prefix
      const withProtocol = customDestination.startsWith("http")
        ? customDestination
        : `https://${customDestination}`;
      
      if (isValidHttpUrl(withProtocol)) {
        return withProtocol;
      }
    }
    
    // Otherwise use it as a destination string
    return buildDirectionsUrl(customDestination);
  }

  // 3. Compose from address fields
  const fields: AddressFields = {
    addressLine1: addressCard.addressLine1,
    addressLine2: addressCard.addressLine2,
    city: addressCard.city,
    postcode: addressCard.postcode,
    country: addressCard.country,
  };
  
  const destination = composeAddressString(fields);
  return buildDirectionsUrl(destination);
}

/**
 * Compose address string from fields
 */
function composeAddressString(fields?: AddressFields): string {
  if (!fields) return "";
  
  return [
    fields.addressLine1,
    fields.addressLine2,
    fields.city,
    fields.postcode,
    fields.country,
  ]
    .filter((v) => v && typeof v === "string" && v.trim().length > 0)
    .map((v) => v!.trim())
    .join(", ");
}

/**
 * Build Google Maps directions URL with destination parameter
 */
function buildDirectionsUrl(destination: string): string {
  if (!destination || !destination.trim()) {
    // Fallback to generic Google Maps if no destination
    return "https://www.google.com/maps";
  }
  
  const encoded = encodeURIComponent(destination.trim());
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}&travelmode=driving`;
}
