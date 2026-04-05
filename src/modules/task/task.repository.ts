import { db } from "../../common/db/client";
import { tasksTable } from "../../common/db/schema/task.schema";
import { eq, sql } from "drizzle-orm";
import { logger } from "../../common/lib/logger/pino";

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
}
