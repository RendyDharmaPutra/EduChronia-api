import type { Context } from "hono";
import type { CourseService } from "./course.service";
import { response } from "../../common/http/response";

export class CourseController {
  constructor(private readonly service: CourseService) {}

  create = async (c: Context) => {
    //** TODO: Implemenet course creation logic
    // 1. Validate Input based on DTO
    // 2. Handle validation result:
    //    - Throw error for failed
    //    - Injecting userId from context into input then pass it to service
    //  3. Return success result from service -> created (201)
    //    (error already throw in service)
    // */

    const result = this.service.createCourse();

    return response.success(c, result);
  };
}
