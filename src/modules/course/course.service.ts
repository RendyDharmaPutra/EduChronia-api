import type { CourseRepository } from "./course.repository";
import type {
  InsertCourse,
  SelectCourse,
  UpdateCourseDto,
} from "./dto/course.dto";
import { AppException } from "../../common/http/exception/base.exception";
import { logger } from "../../common/lib/logger/pino";
import { PaginationQuery } from "../../common/http/validation/pagination.query";

export class CourseService {
  constructor(private readonly repository: CourseRepository) {}

  async getAllCourse(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: SelectCourse[];
    pagination: PaginationQuery;
  }> {
    logger.trace("Get course list service");

    try {
      const [data, total] = await Promise.all([
        this.repository.findAllByUser(userId, page, limit),
        this.repository.countByUser(userId),
      ]);

      const pagination = {
        page,
        limit,
        total,
      };

      logger.debug({ data, pagination }, "Course list retrieved");

      return { data, pagination };
    } catch (error: any) {
      throw new Error(error.cause);
    }
  }

  async getCourseById(id: number, userId: string): Promise<SelectCourse> {
    logger.trace("Get course service");

    try {
      const course = await this.repository.findById(id, userId);
      logger.debug({ course }, "Course retrieved");

      if (!course)
        throw new AppException(
          `Kursus tidak ditemukan`,
          "COURSE_NOT_FOUND",
          404,
        );

      return course;
    } catch (error: any) {
      if (error instanceof AppException) throw error;

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
    logger.trace("Create course service");

    try {
      const result = await this.repository.create(course);
      logger.debug({ result }, "Course created");

      return result;
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

  async updateCourseById(id: number, course: InsertCourse, userId: string) {
    logger.trace("Update course service");

    try {
      const result = await this.repository.updateById(id, course, userId);
      logger.debug({ result }, "Course updated");

      if (!result)
        throw new AppException(
          `Kursus tidak ditemukan`,
          "COURSE_NOT_FOUND",
          404,
        );

      return result;
    } catch (error: any) {
      if (error instanceof AppException) throw error;

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

  async deleteCourseById(id: number, userId: string) {
    logger.trace("Delete course service");

    try {
      const affected = await this.repository.deleteById(id, userId);
      logger.debug({ affected }, "Course deleted");

      if (!affected)
        throw new AppException(
          `Kursus tidak ditemukan`,
          "COURSE_NOT_FOUND",
          404,
        );

      return affected;
    } catch (error: any) {
      if (error instanceof AppException) throw error;

      throw new Error(error.cause);
    }
  }
}
