import * as z from "zod";

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID harus berupa angka")
    .transform((val) => Number(val)),
});

export type IdParam = z.infer<typeof idParamSchema>;
