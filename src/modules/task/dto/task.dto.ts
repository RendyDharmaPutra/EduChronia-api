import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import { tasksTable } from "../../../common/db/schema/task.schema";

export const createTaskDto = z.object({
  title: z
    .string("Format nama tugas tidak valid")
    .trim()
    .nonempty("Nama Tugas harus diisi")
    .min(2, "Nama Tugas harus minimal 2 karakter")
    .max(150, "Nama Tugas harus maksimal 150 karakter"),
  description: z
    .string("Format deskripsi tidak valid")
    .max(255, "Deskripsi harus maksimal 255 karakter")
    .trim()
    .optional(),
  deadline: z.date("Format tanggal tidak valid").nonoptional(),
  isCompleted: z.boolean().optional(),
  courseId: z.number("Format ID kursus tidak valid").nonoptional(),
});

export const updateTaskDto = createTaskDto;

export type CreateTaskDto = z.infer<typeof createTaskDto>;
export type UpdateTaskDto = z.infer<typeof updateTaskDto>;
export type InsertTask = InferInsertModel<typeof tasksTable>;
export type SelectTask = InferSelectModel<typeof tasksTable>;