import { createCourseDto } from "./course.dto";
import type { Context } from "hono";
import type { CourseService } from "./course.service";
import { response } from "../../common/http/response";
import { safeParseBody } from "../../common/http/validation/safe-parse-body";
import { logger } from "../../common/lib/logger/pino";
import { safeParsePaginationQuery } from "../../common/http/validation/safe-parse-query";

export class CourseController {
  constructor(private readonly service: CourseService) {}

  list = async (c: Context) => {
    const userId = c.get("userId");

    const { page, limit } = safeParsePaginationQuery(c);
    // ? Debug page & limit value based on query params
    logger.debug({ page, limit }, "List course query params");

    const { data, pagination } = await this.service.getAllCourse(
      userId,
      page,
      limit,
    );

    // ? Debug response value
    logger.debug({ data, pagination }, "List course result");

    return response.success(c, data, { pagination });
  };

  get = async (c: Context) => {
    // trace
    logger.trace("Get course controller");

    const userId = c.get("userId");
    const id = c.req.param("id"); // TODO: Validate & parse id into number using zod with parse query pattern

    const result = await this.service.getCourseById(Number(id), userId); // TODO: remove hard parsing id
    logger.debug({ result }, "Course");

    return response.success(c, result);
  };

  /**
   * Handle course creation logic.
   *
   * This method is responsible for parsing the request body,
   * injecting the userId from the context, and passing it to the service.
   *
   * @param {Context} c - The current request context.
   * @return {Promise<unknown>} A promise that resolves to the created course.
   * @throws {ValidationException} If the request body is invalid.
   * @throws {AppException} If there is an error with the course creation process.
   */
  create = async (c: Context) => {
    // Validate and parse the request body
    const body = await safeParseBody(
      c,
      createCourseDto,
      "Data kursus tidak valid",
    );
    // Inject the userId from the context into the input
    const course = { ...body, userId: c.get("userId") };
    const result = await this.service.createCourse(course);

    return response.success(c, result);
  };
}
