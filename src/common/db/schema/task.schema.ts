import { boolean, index, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { coursesTable } from "./course.schema";
import { eq, sql } from "drizzle-orm";

export const tasksTable = pgTable(
    "tasks",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        title: varchar().notNull(),
        description: text(),
        deadline: timestamp("deadline").notNull(),
        isCompleted: boolean("is_completed").default(false).notNull(),
        courseId: integer("course_id")
            .notNull()
            .references(() => coursesTable.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        queryCourseTaskIndex: index("idx_tasks_course_status_deadline").on(
            table.courseId,
            table.isCompleted,
            table.deadline,
        ),
        queryUnfinishedTaskIndex: index("idx_tasks_unfinished").on(
            table.deadline,
        ).where(sql`is_completed = false`),
    }),
)