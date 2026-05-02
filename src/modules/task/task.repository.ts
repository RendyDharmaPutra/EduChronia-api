import { db } from "../../common/db/client";
import { tasksTable } from "../../common/db/schema/task.schema";
import { eq, sql } from "drizzle-orm";
import { logger } from "../../common/lib/logger/pino";
import { InsertTask, SelectTask, UpdateTaskDto } from "./dto/task.dto";

/**
 * Repository for managing database operations related to tasks.
 */
export class TaskRepository {
  /**
   * Finds all tasks associated with a specific course ID.
   * Tasks are ordered by completion status, urgency (deadline), and general order.
   * 
   * @param {number} courseId - The unique identifier of the course.
   * @returns {Promise<SelectTask[]>} A promise that resolves to an array of tasks.
   */
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

  /**
   * Inserts a new task into the database.
   * 
   * @param {InsertTask} task - The task data to be inserted.
   * @returns {Promise<SelectTask>} A promise that resolves to the created task.
   */
  async create(task: InsertTask): Promise<SelectTask> {
    logger.trace("Create task repository");

    const result = await db.insert(tasksTable).values(task).returning();

    return result[0];
  }

  /**
   * Updates an existing task by its ID.
   * 
   * @param {number} id - The unique identifier of the task to update.
   * @param {UpdateTaskDto} task - The updated task data.
   * @returns {Promise<SelectTask>} A promise that resolves to the updated task.
   */
  async updateById(id: number, task: UpdateTaskDto): Promise<SelectTask> {
    logger.trace("Update task by id repository");

    const result = await db
      .update(tasksTable)
      .set(task)
      .where(eq(tasksTable.id, id))
      .returning();

    return result[0];
  }

  /**
   * Deletes a task by its ID.
   * 
   * @param {number} id - The unique identifier of the task to delete.
   * @returns {Promise<number | null>} A promise that resolves to the number of rows affected.
   */
  async deleteById(id: number): Promise<number | null> {
    logger.trace("Delete task by id repository");

    const result = await db.delete(tasksTable).where(eq(tasksTable.id, id));

    return result.rowCount;
  }
}
