/**
 * bank.schema.ts — Validated Zod schema for the Bank category data
 */

import { z } from "zod";

const trimToUndefined = (v: unknown): unknown => {
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t.length ? t : undefined;
};

export const BankCategoryDataValidatedSchema = z
  .object({
    bankName: z.string().trim().min(1, "Bank Name is required").max(80),
    accountName: z.string().trim().min(1, "Account Name is required").max(80),
    sortCode: z
      .string()
      .trim()
      .min(1, "Sort Code is required")
      .max(8)
      .regex(/^[\d-]+$/, "Sort code must be digits (e.g. 00-00-00)."),
    accountNumber: z
      .string()
      .trim()
      .min(1, "Account Number is required")
      .max(8)
      .regex(/^\d+$/, "Account number must be 8 digits."),
    iban: z
      .string()
      .trim()
      .max(34)
      .optional()
      .transform(trimToUndefined),
    swift: z
      .string()
      .trim()
      .max(11)
      .optional()
      .transform(trimToUndefined),
    disclaimer: z
      .string()
      .trim()
      .max(120)
      .optional()
      .transform(trimToUndefined),
  })
  .strict();

export type BankCategoryDataValidated = z.infer<
  typeof BankCategoryDataValidatedSchema
>;
