import { and, asc, count, eq } from "drizzle-orm";
import { db } from "../../common/db/client";
import { coursesTable } from "../../common/db/schema/course.schema";
import { logger } from "../../common/lib/logger/pino";
import type { InsertCourse } from "./dto/course.dto";

export class CourseRepository {
  async findAllByUser(userId: string, page: number, limit: number) {
    logger.trace("Find all by user repository");

    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.userId, userId))
      .orderBy(asc(coursesTable.name))
      .limit(limit)
      .offset((page - 1) * limit);

    return result;
  }

  async findById(id: number, userId: string) {
    logger.trace("Find by id repository");

    const result = await db
      .select()
      .from(coursesTable)
      .where(and(eq(coursesTable.id, id), eq(coursesTable.userId, userId)));

    return result[0] ?? null;
  }

  async countByUser(userId: string) {
    logger.trace("Count by user repository");

    const result = await db
      .select({ count: count(coursesTable.id) })
      .from(coursesTable)
      .where(eq(coursesTable.userId, userId));

    return result[0].count;
  }

  /**
   * This method creates a new course by inserting it into the database and checking for
   * duplication of the name. It returns the created course.
   *
   * @param {InsertCourse} course - The data of the course to be created.
   * @return {Promise<InsertCourse>} - A promise that resolves to the created course.
   * @throws {AppException} - If a course with the same name already exists, an
   * `AppException` with the error type `DUPLICATE_COURSE` and the HTTP status
   * code 409 is thrown.
   * @throws {Error} - If there is a connection error, an `Error` is thrown.
   */
  async create(course: InsertCourse): Promise<InsertCourse> {
    logger.trace("Create repository");

    // Insert & check duplication of name into database
    const result = await db.insert(coursesTable).values(course).returning();

    return result[0];
  }

  async updateById(id: number, course: InsertCourse, userId: string) {
    logger.trace("Update by id repository");

    // Insert & check duplication of name into database
    const result = await db
      .update(coursesTable)
      .set(course)
      .where(and(eq(coursesTable.id, id), eq(coursesTable.userId, userId)))
      .returning();

    return result[0];
  }

  async deleteById(id: number, userId: string) {
    logger.trace("Delete by id repository");

    const result = await db
      .delete(coursesTable)
      .where(and(eq(coursesTable.id, id), eq(coursesTable.userId, userId)));

    return result.rowCount;
  }
}
