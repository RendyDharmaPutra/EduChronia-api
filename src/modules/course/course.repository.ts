import { and, asc, count, eq } from "drizzle-orm";
import { db } from "../../common/db/client";
import { coursesTable } from "../../common/db/schema/course.schema";
import { logger } from "../../common/lib/logger/pino";
import type { InsertCourse, SelectCourse } from "./dto/course.dto";

export class CourseRepository {
  /**
   * Retrieves a paginated list of courses for a specific user.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {number} page - The page number to retrieve.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<SelectCourse[]>} A promise that resolves to an array of courses.
   */
  async findAllByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<SelectCourse[]> {
    logger.trace("Find all courses by user repository");

    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.userId, userId))
      .orderBy(asc(coursesTable.name))
      .limit(limit)
      .offset((page - 1) * limit);

    return result;
  }

  /**
   * Finds a specific course by its ID and the user ID it belongs to.
   *
   * @param {number} id - The unique identifier of the course.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<SelectCourse | null>} A promise that resolves to the course if found, or null otherwise.
   */
  async findById(id: number, userId: string): Promise<SelectCourse | null> {
    logger.trace("Find course by id repository");

    const result = await db
      .select()
      .from(coursesTable)
      .where(and(eq(coursesTable.id, id), eq(coursesTable.userId, userId)));

    return result[0] ?? null;
  }

  /**
   * Counts the total number of courses belonging to a specific user.
   *
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<number>} A promise that resolves to the total count of courses.
   */
  async countByUser(userId: string): Promise<number> {
    logger.trace("Count courses by user repository");

    const result = await db
      .select({ count: count(coursesTable.id) })
      .from(coursesTable)
      .where(eq(coursesTable.userId, userId));

    return result[0].count;
  }

  /**
   * Creates a new course in the database.
   *
   * @param {InsertCourse} course - The course data to be inserted.
   * @returns {Promise<SelectCourse>} A promise that resolves to the newly created course.
   */
  async create(course: InsertCourse): Promise<SelectCourse> {
    logger.trace("Create course repository");

    const result = await db.insert(coursesTable).values(course).returning();

    return result[0];
  }

  /**
   * Updates an existing course by its ID and user ID.
   *
   * @param {number} id - The unique identifier of the course to update.
   * @param {InsertCourse} course - The updated course data.
   * @param {string} userId - The unique identifier of the user who owns the course.
   * @returns {Promise<SelectCourse>} A promise that resolves to the updated course.
   */
  async updateById(
    id: number,
    course: InsertCourse,
    userId: string,
  ): Promise<SelectCourse> {
    logger.trace("Update course by id repository");

    const result = await db
      .update(coursesTable)
      .set(course)
      .where(and(eq(coursesTable.id, id), eq(coursesTable.userId, userId)))
      .returning();

    return result[0];
  }

  /**
   * Deletes a course by its ID and user ID.
   *
   * @param {number} id - The unique identifier of the course to delete.
   * @param {string} userId - The unique identifier of the user who owns the course.
   * @returns {Promise<number | null>} A promise that resolves to the number of affected rows.
   */
  async deleteById(id: number, userId: string): Promise<number | null> {
    logger.trace("Delete course by id repository");

    const result = await db
      .delete(coursesTable)
      .where(and(eq(coursesTable.id, id), eq(coursesTable.userId, userId)));

    return result.rowCount;
  }
}
