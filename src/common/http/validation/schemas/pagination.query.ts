import { z } from "zod";

/**
 * Zod schema for validating and transforming pagination query parameters.
 * Converts string inputs from URL queries into validated numbers with default values.
 */
export const paginationQuerySchema = z.object({
  /**
   * The page number to retrieve.
   * @default 1
   */
  page: z
    .string()
    .optional()
    .transform((v) => Number(v ?? 1))
    .refine((v) => Number.isInteger(v) && v > 0, {
      message: "Page harus berupa angka positif",
    }),

  /**
   * The number of items to return per page.
   * @default 10
   * @maximum 100
   */
  limit: z
    .string()
    .optional()
    .transform((v) => Number(v ?? 10))
    .refine((v) => Number.isInteger(v) && v > 0 && v <= 100, {
      message: "Limit harus berupa angka antara 1–100",
    }),
});

/**
 * Type definition for pagination query parameters inferred from the schema.
 */
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
