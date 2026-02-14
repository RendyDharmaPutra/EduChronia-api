import type { CourseRepository } from "./course.repository";
import type { InsertCourse } from "./course.dto";
import { AppException } from "../../common/http/exception/base.exception";

export class CourseService {
  constructor(private readonly repository: CourseRepository) {}

  async getAllCourse(userId: string, page: number, limit: number) {
    try {
      const data = await this.repository.findAllByUser(userId, page, limit);

      const pagination = {
        page,
        limit,
        total: data.length,
      };

      return { data, pagination };
    } catch (error: any) {
      throw new Error(error.cause);
    }
  }

  /**
   * This method creates a new course by calling the `create` method of the
   * `CourseRepository` with the provided `course` data. It handles the result
   * of the repository method and throws an appropriate error if there is one.
   *
   * @param {InsertCourse} course - The data of the course to be created.
   * @return {Promise<InsertCourse>} - A promise that resolves to the created course.
   * @throws {AppException} - If a course with the same name already exists, an
   * `AppException` with the error type `DUPLICATE_COURSE` and the HTTP status
   * code 409 is thrown.
   * @throws {Error} - If there is a connection error, an `Error` is thrown.
   */
  /**
   * This method creates a new course by calling the `create` method of the
   * `CourseRepository` with the provided `course` data. It handles the result
   * of the repository method and throws an appropriate error if there is one.
   *
   * Steps:
   * 1. Call the `create` method of the `CourseRepository` with the provided `course` data.
   * 2. Handle the result from the repository method:
   *    - If successful, return the created course.
   *    - If there is an error:
   *      - If the error is a duplicate course error, throw an `AppException` with the
   *        error type `DUPLICATE_COURSE` and the HTTP status code 409.
   *      - If there is a connection error, throw a generic error.
   *
   * @param {InsertCourse} course - The data of the course to be created.
   * @return {Promise<InsertCourse>} - A promise that resolves to the created course.
   * @throws {AppException} - If a course with the same name already exists, an
   * `AppException` with the error type `DUPLICATE_COURSE` and the HTTP status
   * code 409 is thrown.
   * @throws {Error} - If there is a connection error, an `Error` is thrown.
   */
  async createCourse(course: InsertCourse): Promise<InsertCourse> {
    try {
      return await this.repository.create(course);
    } catch (error: any) {
      // Handle duplication course entry
      if (error.cause.code === "23505") {
        throw new AppException(
          `Kursus dengan nama ${course.name} sudah ada`,
          "DUPLICATE_COURSE",
          409,
        );
      }

      throw new Error(error.cause);
    }
  }
}
