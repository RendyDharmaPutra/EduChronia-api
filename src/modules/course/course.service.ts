import type { CourseRepository } from "./course.repository";
import type { InsertCourse, SelectCourse } from "./dto/course.dto";
import { AppException } from "../../common/http/exception/base.exception";
import { logger } from "../../common/lib/logger/pino";
import { PaginationQuery } from "../../common/http/validation/schemas/pagination.query";
import { mapToAppException } from "../../common/error/error-mapper";
import { SelectTask } from "../task/dto/task.dto";
import { TaskRepository } from "../task/task.repository";

export class CourseService {
  /**
   * Initialize the CourseService with the CourseRepository.
   * @param {CourseRepository} courseRepository - The courseRepository handling database operations.
   */
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  /**
   * Retrieves a paginated list of courses for a specific user.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {number} page - The current page number for pagination.
   * @param {number} limit - The maximum number of items to return per page.
   * @returns {Promise<{ data: SelectCourse[]; pagination: PaginationQuery }>} A promise that resolves to an object containing the course data and pagination metadata.
   */
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
        this.courseRepository.findAllByUser(userId, page, limit),
        this.courseRepository.countByUser(userId),
      ]);

      const pagination = {
        page,
        limit,
        total,
      };

      logger.debug({ data, pagination }, "Course list retrieved");

      return { data, pagination };
    } catch (error: any) {
      mapToAppException(error);
    }
  }

  /**
   * Retrieves a specific course by its ID and the user's ID.
   *
   * @param {number} id - The unique identifier of the course.
   * @param {string} userId - The unique identifier of the user who owns the course.
   * @returns {Promise<SelectCourse, SelectTask>} A promise that resolves to the course details.
   * @throws {AppException} If the course is not found (404).
   */
  async getCourseById(
    id: number,
    userId: string,
  ): Promise<{ course: SelectCourse; tasks: SelectTask[] }> {
    logger.trace("Get course service");

    try {
      const course = await this.courseRepository.findById(id, userId);
      logger.debug({ course }, "Course retrieved");

      if (!course)
        throw new AppException(
          `Kursus tidak ditemukan`,
          "COURSE_NOT_FOUND",
          404,
        );

      const tasks = await this.taskRepository.findByCourseId(id);
      logger.debug({ tasks }, "Tasks retrieved");

      return { course, tasks };
    } catch (error: any) {
      mapToAppException(error);
    }
  }

  /**
   * Creates a new course.
   *
   * @param {InsertCourse} course - The course data to be inserted.
   * @returns {Promise<SelectCourse>} A promise that resolves to the newly created course.
   * @throws {AppException} If a course with the same name already exists (409).
   */
  async createCourse(course: InsertCourse): Promise<SelectCourse> {
    logger.trace("Create course service");

    try {
      const result = await this.courseRepository.create(course);
      logger.debug({ result }, "Course created");

      return result;
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw new AppException(
          `Kursus dengan nama ${course.name} sudah ada`,
          "DUPLICATE_COURSE",
          409,
        );
      }

      mapToAppException(error);
    }
  }

  /**
   * Updates an existing course by its ID and the user's ID.
   *
   * @param {number} id - The unique identifier of the course to update.
   * @param {InsertCourse} course - The updated course data.
   * @param {string} userId - The unique identifier of the user who owns the course.
   * @returns {Promise<SelectCourse>} A promise that resolves to the updated course details.
   * @throws {AppException} If the course is not found (404) or if the updated name conflicts with another course (409).
   */
  async updateCourseById(
    id: number,
    course: InsertCourse,
    userId: string,
  ): Promise<SelectCourse> {
    logger.trace("Update course service");

    try {
      const result = await this.courseRepository.updateById(id, course, userId);
      logger.debug({ result }, "Course updated");

      if (!result)
        throw new AppException(
          `Kursus tidak ditemukan`,
          "COURSE_NOT_FOUND",
          404,
        );

      return result;
    } catch (error: any) {
      if (error.cause.code === "23505") {
        throw new AppException(
          `Kursus dengan nama ${course.name} sudah ada`,
          "DUPLICATE_COURSE",
          409,
        );
      }

      mapToAppException(error);
    }
  }

  /**
   * Deletes a course by its ID and the user's ID.
   *
   * @param {number} id - The unique identifier of the course to delete.
   * @param {string} userId - The unique identifier of the user who owns the course.
   * @returns {Promise<number>} A promise that resolves to the number of affected rows.
   * @throws {AppException} If the course is not found (404).
   */
  async deleteCourseById(id: number, userId: string): Promise<number> {
    logger.trace("Delete course service");

    try {
      const affected = await this.courseRepository.deleteById(id, userId);
      logger.debug({ affected }, "Course deleted");

      if (!affected)
        throw new AppException(
          `Kursus tidak ditemukan`,
          "COURSE_NOT_FOUND",
          404,
        );

      return affected;
    } catch (error: any) {
      mapToAppException(error);
    }
  }
}
