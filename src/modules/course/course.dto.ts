import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import { coursesTable } from "../../common/db/schema/course.schema";

export const createCourseDto = z.object({
  name: z
    .string("Format nama kursus tidak valid")
    .trim()
    .nonempty("Nama Kursus harus diisi")
    .min(3, "Nama Kursus harus minimal 3 karakter")
    .max(100, "Nama Kursus harus maksimal 100 karakter"),
  description: z
    .string("Format deskripsi tidak valid")
    .max(255, "Deskripsi harus maksimal 255 karakter")
    .trim()
    .optional(),
});

export type CreateCourseDto = z.infer<typeof createCourseDto>;
export type InsertCourse = InferInsertModel<typeof coursesTable>;
export type SelectCourse = InferSelectModel<typeof coursesTable>;
