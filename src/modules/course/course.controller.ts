import { createCourseDto } from "./course.dto";
import type { Context } from "hono";
import type { CourseService } from "./course.service";
import { response } from "../../common/http/response";
import { safeParseBody } from "../../common/http/safe-parse-body";

export class CourseController {
  constructor(private readonly service: CourseService) {}

  create = async (c: Context) => {
    //** TODO: Implemenet course creation logic
    const body = await safeParseBody(
      c,
      createCourseDto,
      "Data kursus tidak valid",
    );
    //    - Injecting userId from context into input then pass it to service
    const bodyWithUserId = { ...body, userId: c.get("userId") };
    const result = this.service.createCourse(bodyWithUserId);
    //  3. Return success result from service -> created (201)
    //    (error already throw in service)
    // */
    return response.success(c, result);
  };
}
