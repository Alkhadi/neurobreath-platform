/**
 * wedding.schema.ts — Validated Zod schema for the Wedding category data
 */

import { z } from "zod";
import { isValidHttpUrl } from "../sanitize";

const trimToUndefined = (v: unknown): unknown => {
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t.length ? t : undefined;
};

export const WeddingCategoryDataValidatedSchema = z
  .object({
    coupleNames: z
      .string()
      .trim()
      .min(1, "Couple Names is required")
      .max(80),
    date: z.string().trim().min(1, "Wedding Date is required").max(60),
    venue: z.string().trim().min(1, "Venue is required").max(120),
    rsvpLabel: z
      .string()
      .trim()
      .max(30)
      .optional()
      .transform((v): string =>
        typeof v === "string" && v.trim().length ? v.trim() : "RSVP Now"
      ),
    rsvpUrl: z
      .string()
      .trim()
      .optional()
      .transform(trimToUndefined)
      .refine(
        (v): boolean =>
          typeof v === "string" ? isValidHttpUrl(v) : true,
        { message: "RSVP link must be a valid http(s) URL." }
      ),
  })
  .strict();

export type WeddingCategoryDataValidated = z.infer<
  typeof WeddingCategoryDataValidatedSchema
>;
