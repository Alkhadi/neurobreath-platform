/**
 * flyer.schema.ts — Validated Zod schema for the Flyer category data
 */

import { z } from "zod";
import { isValidHttpUrl } from "../sanitize";

const trimToUndefined = (v: unknown): unknown => {
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t.length ? t : undefined;
};

export const FlyerCategoryDataValidatedSchema = z
  .object({
    headline: z.string().trim().min(1, "Headline is required").max(80),
    subheadline: z
      .string()
      .trim()
      .max(120)
      .optional()
      .transform(trimToUndefined),
    ctaLabel: z.string().trim().max(30).optional().transform(trimToUndefined),
    ctaUrl: z
      .string()
      .trim()
      .optional()
      .transform(trimToUndefined)
      .refine(
        (v): boolean =>
          typeof v === "string" ? isValidHttpUrl(v) : true,
        { message: "CTA URL must be a valid http(s) link." }
      ),
    eventDate: z
      .string()
      .trim()
      .max(60)
      .optional()
      .transform(trimToUndefined),
    location: z
      .string()
      .trim()
      .max(100)
      .optional()
      .transform(trimToUndefined),
  })
  .strict();

export type FlyerCategoryDataValidated = z.infer<
  typeof FlyerCategoryDataValidatedSchema
>;
