/**
 * address.schema.ts — Validated Zod schema for the Address category data
 *
 * Rules retained from the existing UI:
 * - directionsNote: "No URLs allowed."
 * - mapUrlOverride: must be a valid URL (Google Maps recommended)
 * - mapDestinationOverride: plain text only, not a link
 * - Field lengths match the current maxlength hints
 *
 * Imports `isValidHttpUrl` and `looksLikeUrl` from the existing sanitize.ts
 * so there is a single source of truth for those helpers.
 */

import { z } from "zod";
import { isValidHttpUrl, looksLikeUrl } from "../sanitize";

const trimToUndefined = (v: unknown): unknown => {
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t.length ? t : undefined;
};

const isGoogleMapsish = (s: string): boolean => {
  const x = s.toLowerCase();
  return (
    x.includes("google.com/maps") ||
    x.includes("maps.google.com") ||
    x.includes("maps.app.goo.gl")
  );
};

export const AddressCategoryDataValidatedSchema = z
  .object({
    line1: z.string().trim().min(1, "Address Line 1 is required").max(120),
    line2: z.string().trim().max(120).optional().transform(trimToUndefined),

    city: z.string().trim().min(1, "City is required").max(80),
    postcode: z.string().trim().min(1, "Postcode is required").max(24),
    country: z.string().trim().min(1, "Country is required").max(80),

    mapLabel: z
      .string()
      .trim()
      .max(30)
      .optional()
      .transform(
        (v): string =>
          typeof v === "string" && v.trim().length ? v.trim() : "Click Here"
      ),

    directionsNote: z
      .string()
      .trim()
      .max(60)
      .optional()
      .transform(trimToUndefined)
      .refine(
        (v): boolean =>
          typeof v === "string" ? !looksLikeUrl(v) : true,
        { message: "Directions note must not include a URL." }
      ),

    mapUrlOverride: z
      .string()
      .trim()
      .optional()
      .transform(trimToUndefined)
      .refine(
        (v): boolean =>
          typeof v === "string" ? isValidHttpUrl(v) : true,
        { message: "Custom map URL must be a valid http(s) link." }
      )
      .refine(
        (v): boolean =>
          typeof v === "string" ? isGoogleMapsish(v) : true,
        {
          message:
            "Please use a Google Maps link (google.com/maps or maps.app.goo.gl).",
        }
      ),

    mapDestinationOverride: z
      .string()
      .trim()
      .max(80)
      .optional()
      .transform(trimToUndefined)
      .refine(
        (v): boolean =>
          typeof v === "string" ? !looksLikeUrl(v) : true,
        { message: "Destination must be plain text (do not paste links)." }
      ),
  })
  .strict();

export type AddressCategoryDataValidated = z.infer<
  typeof AddressCategoryDataValidatedSchema
>;
