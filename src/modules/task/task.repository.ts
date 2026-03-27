import { db } from "../../common/db/client";
import { tasksTable } from "../../common/db/schema/task.schema";
import { eq } from "drizzle-orm";
import { logger } from "../../common/lib/logger/pino";

export class TaskRepository {
  async findByCourseId(courseId: number) {
    logger.trace(`Find task by course id: ${courseId}`);

    const result = await db.select().from(tasksTable).where(eq(tasksTable.courseId, courseId));
  
    return result
}
}