import type { CourseRepository } from "./course.repository";

export class CourseService {
  constructor(private readonly repository: CourseRepository) {}

  createCourse() {
    // ** TODO: Implement course creation logic
    // 1. Calling create method from repo with courseData as an argument
    // 2. Handle result from repo:
    //    - If success, return created course
    //    - If error, throw appropriate error:
    //      - DuplicateCourseError
    //      - Connection Failed -> Server Error (500)
    // */

    return this.repository.create();
  }
}
