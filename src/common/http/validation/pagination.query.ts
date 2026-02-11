import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => Number(v ?? 1))
    .refine((v) => Number.isInteger(v) && v > 0, {
      message: "Page harus berupa angka positif",
    }),

  limit: z
    .string()
    .optional()
    .transform((v) => Number(v ?? 10))
    .refine((v) => Number.isInteger(v) && v > 0 && v <= 100, {
      message: "Limit harus berupa angka antara 1–100",
    }),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
