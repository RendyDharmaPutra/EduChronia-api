import type { CourseService } from "./course.service";

export class CourseController {
  constructor(private readonly service: CourseService) {}
}
