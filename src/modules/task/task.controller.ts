import type { TaskService } from "./task.service";

export class TaskController {
  constructor(private readonly service: TaskService) {}
}
