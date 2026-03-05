/**
 * business.schema.ts — Validated Zod schema for the Business category data
 */

import { z } from "zod";
import { isValidHttpUrl } from "../sanitize";

const trimToUndefined = (v: unknown): unknown => {
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t.length ? t : undefined;
};

export const BusinessCategoryDataValidatedSchema = z
  .object({
    companyName: z.string().trim().min(1, "Company Name is required").max(80),
    services: z.string().trim().min(1, "Services is required").max(300),
    tagline: z.string().trim().max(80).optional().transform(trimToUndefined),
    hours: z.string().trim().max(80).optional().transform(trimToUndefined),
    address: z.string().trim().max(200).optional().transform(trimToUndefined),
    bookingLink: z
      .string()
      .trim()
      .optional()
      .transform(trimToUndefined)
      .refine(
        (v): boolean =>
          typeof v === "string" ? isValidHttpUrl(v) : true,
        { message: "Booking link must be a valid http(s) URL." }
      ),
  })
  .strict();

export type BusinessCategoryDataValidated = z.infer<
  typeof BusinessCategoryDataValidatedSchema
>;
