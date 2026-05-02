import * as z from "zod";

/**
 * Zod schema for validating a numeric ID parameter from the URL path.
 * Ensures the ID is a string of digits and transforms it into a Number.
 */
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID harus berupa angka")
    .transform((val) => Number(val)),
});

/**
 * Type definition inferred from the idParamSchema.
 */
export type IdParam = z.infer<typeof idParamSchema>;
