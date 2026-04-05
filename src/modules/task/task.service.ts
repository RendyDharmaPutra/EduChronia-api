import type { TaskRepository } from "./task.repository";

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}
}
