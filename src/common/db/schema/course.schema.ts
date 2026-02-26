import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth.schema";

export const coursesTable = pgTable(
  "courses",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    description: text(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userCourseNameUnique: uniqueIndex("user_course_name_unique").on(
      table.userId,
      table.name,
    ),
  }),
);

export const coursesRelations = relations(coursesTable, ({ one }) => ({
  user: one(user, {
    fields: [coursesTable.userId],
    references: [user.id],
  }),
}));
