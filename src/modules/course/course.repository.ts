import { eq } from "drizzle-orm";
import { db } from "../../common/db/client";
import { coursesTable } from "../../common/db/schema/course.schema";
import { InsertCourse } from "./course.dto";

export class CourseRepository {
  async findAllByUser(userId: string) {
    return await db
      .select({
        id: coursesTable.id,
        name: coursesTable.name,
        description: coursesTable.description,
      })
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
