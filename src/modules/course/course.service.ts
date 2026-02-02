import type { CourseRepository } from "./course.repository";

export class CourseService {
  constructor(private readonly repository: CourseRepository) {}
}
