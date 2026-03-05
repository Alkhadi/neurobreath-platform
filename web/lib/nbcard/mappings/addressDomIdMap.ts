/**
 * addressDomIdMap.ts — Maps existing HTML input IDs to CardModel field keys
 *
 * This allows the existing NBCardPanel form inputs (e.g. id="address-line1")
 * to be bound to the new CardModel.categoryData fields incrementally without
 * requiring an immediate full rewrite of the form JSX.
 *
 * Usage:
 *   import { ADDRESS_DOM_ID_TO_MODEL_KEY } from "@/lib/nbcard/mappings/addressDomIdMap";
 *   const modelKey = ADDRESS_DOM_ID_TO_MODEL_KEY["address-line1"]; // "line1"
 */

export const ADDRESS_DOM_ID_TO_MODEL_KEY = {
  "address-line1": "line1",
  "address-line2": "line2",
  "address-city": "city",
  "address-postcode": "postcode",
  "address-country": "country",
  "address-map-label": "mapLabel",
  "address-directions": "directionsNote",
  "address-map-url-override": "mapUrlOverride",
  "address-map-destination-override": "mapDestinationOverride",
} as const;

export type AddressDomId = keyof typeof ADDRESS_DOM_ID_TO_MODEL_KEY;
export type AddressModelKey =
  (typeof ADDRESS_DOM_ID_TO_MODEL_KEY)[AddressDomId];

/**
 * Reverse map: CardModel key → DOM input ID.
 */
export const ADDRESS_MODEL_KEY_TO_DOM_ID: Record<AddressModelKey, AddressDomId> =
  Object.fromEntries(
    Object.entries(ADDRESS_DOM_ID_TO_MODEL_KEY).map(([k, v]) => [v, k])
  ) as Record<AddressModelKey, AddressDomId>;
