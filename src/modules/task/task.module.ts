import { TaskRepository } from "./task.repository";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { taskRoutes } from "./task.route";

const repository = new TaskRepository();
const service = new TaskService(repository);
const controller = new TaskController(service);

export const TaskModule = {
  repository,
  service,
  controller,
  routes: taskRoutes(controller),
};
