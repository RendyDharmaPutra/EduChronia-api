import { and, asc, count, eq } from "drizzle-orm";
import { db } from "../../common/db/client";
import { coursesTable } from "../../common/db/schema/course.schema";
import { InsertCourse } from "./course.dto";
import { logger } from "../../common/lib/logger/pino";

export class CourseRepository {
  async findAllByUser(userId: string, page: number, limit: number) {
    return await db
      .select({
        id: coursesTable.id,
        name: coursesTable.name,
        description: coursesTable.description,
      })
      .from(coursesTable)
      .where(eq(coursesTable.userId, userId))
      .orderBy(asc(coursesTable.name))
      .limit(limit)
      .offset((page - 1) * limit); // TODO: Sort by "something???" with ASC as default
  }

  async findById(id: number, userId: string) {
    // trace
    logger.trace("Find by id repository");

    return await db
      .select({
        id: coursesTable.id,
        name: coursesTable.name,
        description: coursesTable.description,
      })
      .from(coursesTable)
      .where(and(eq(coursesTable.id, id), eq(coursesTable.userId, userId)))
      .then((res) => res[0] ?? null);
  }

  async countByUser(userId: string) {
    return await db
      .select({ count: count(coursesTable.id) })
      .from(coursesTable)
      .where(eq(coursesTable.userId, userId));
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
    // Insert & check duplication of name into database
    return (await db.insert(coursesTable).values(course).returning())[0];
  }
}
