import { db } from "../../common/db/client";
import { tasksTable } from "../../common/db/schema/task.schema";
import { eq, sql } from "drizzle-orm";
import { logger } from "../../common/lib/logger/pino";
import { InsertTask, SelectTask } from "./dto/task.dto";

export class TaskRepository {
  async findByCourseId(courseId: number) {
    logger.trace(`Find task by course id: ${courseId}`);

    const result = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.courseId, courseId))
      .orderBy(
        sql`
          CASE 
            WHEN ${tasksTable.isCompleted} = true THEN 4
            WHEN ${tasksTable.deadline} < NOW() THEN 1
            WHEN ${tasksTable.deadline} < NOW() + INTERVAL '2 days' THEN 2
            ELSE 3
          END ASC
        `,
        tasksTable.deadline,
      );

    return result;
  }

  async create(task: InsertTask): Promise<SelectTask> {
    logger.trace("Create task repository");

    const result = await db.insert(tasksTable).values(task).returning();

    return result[0];
  }

  async updateById(id: number, task: InsertTask): Promise<SelectTask> {
    logger.trace("Update task by id repository");

    const result = await db
      .update(tasksTable)
      .set(task)
      .where(eq(tasksTable.id, id))
      .returning();

    return result[0];
  }
}
