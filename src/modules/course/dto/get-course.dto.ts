import * as z from "zod";

export const getCourseParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID harus berupa angka")
    .transform((val) => Number(val)),
});

export type GetCourseParam = z.infer<typeof getCourseParamSchema>;
