import { CourseController } from "./course.controller";
import { CourseRepository } from "./course.repository";
import { courseRoutes } from "./course.route";
import { CourseService } from "./course.service";

const repository = new CourseRepository();
const service = new CourseService(repository);
const controller = new CourseController(service);

export const CourseModule = {
  repository,
  service,
  controller,
  routes: courseRoutes(controller),
};
