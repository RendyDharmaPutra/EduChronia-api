import { createCourseDto, updateCourseDto } from "./dto/course.dto";
import type { Context } from "hono";
import type { CourseService } from "./course.service";
import { response } from "../../common/http/response";
import { safeParseBody } from "../../common/http/validation/safe-parse-body";
import { logger } from "../../common/lib/logger/pino";
import { safeParsePaginationQuery } from "../../common/http/validation/safe-parse-query";
import { idParamSchema } from "../../common/http/validation/schemas/id.param";
import { safeParseParams } from "../../common/http/validation/safe-parse-params";

export class CourseController {
  /**
   * Initialize the CourseController with the CourseService.
   * @param {CourseService} service - The service handling course operations.
   */
  constructor(private readonly service: CourseService) {}

  /**
   * Retrieve a paginated list of courses for the authenticated user.
   * @param {Context} c - The request context.
   * @returns {Promise<Response>} A list of courses with pagination metadata.
   */
  list = async (c: Context): Promise<Response> => {
    logger.trace("Get course list controller");

    const userId = c.get("userId");
    const { page, limit } = safeParsePaginationQuery(c);

    const { data, pagination } = await this.service.getAllCourse(
      userId,
      page,
      limit,
    );

    return response.success(c, data, { pagination });
  };

  /**
   * Retrieve a specific course by its ID for the authenticated user.
   * @param {Context} c - The request context.
   * @returns {Promise<Response>} The requested course details.
   */
  get = async (c: Context): Promise<Response> => {
    logger.trace("Get course controller");

    const userId = c.get("userId");
    const { id } = safeParseParams(c, idParamSchema, "ID tidak valid");

    const result = await this.service.getCourseById(id, userId);

    return response.success(c, result);
  };

  /**
   * Handle course creation logic.
   *
   * This method is responsible for parsing the request body,
   * injecting the userId from the context, and passing it to the service.
   *
   * @param {Context} c - The current request context.
   * @return {Promise<Response>} A promise that resolves to the created course.
   */
  create = async (c: Context): Promise<Response> => {
    logger.trace("Create course controller");

    const userId = c.get("userId");
    const body = await safeParseBody(
      c,
      createCourseDto,
      "Data kursus tidak valid",
    );

    const course = { ...body, userId };
    const result = await this.service.createCourse(course);

    // ? audit log, do not remove
    logger.info(`User (${userId}) created course [${result.name}]`);

    return response.success(c, result);
  };

  /**
   * Update an existing course by its ID for the authenticated user.
   * @param {Context} c - The request context.
   * @returns {Promise<Response>} The updated course details.
   */
  update = async (c: Context): Promise<Response> => {
    logger.trace("Update course controller");

    const userId = c.get("userId");
    const { id } = safeParseParams(c, idParamSchema, "ID tidak valid");
    const body = await safeParseBody(
      c,
      updateCourseDto,
      "Data kursus tidak valid",
    );

    const course = { ...body, userId };
    const result = await this.service.updateCourseById(id, course, userId);

    // ? audit log, do not remove
    logger.info(`User (${userId}) updated course [${id}]`);

    return response.success(c, result);
  };

  /**
   * Delete a specific course by its ID for the authenticated user.
   * @param {Context} c - The request context.
   * @returns {Promise<Response>} A success response indicating deletion.
   */
  delete = async (c: Context): Promise<Response> => {
    logger.trace("Delete course controller");

    const userId = c.get("userId");
    const { id } = safeParseParams(c, idParamSchema, "ID tidak valid");

    await this.service.deleteCourseById(id, userId);

    // ? audit log, do not remove
    logger.info(`User (${userId}) deleted course [${id}]`);

    return response.success(c);
  };
}
