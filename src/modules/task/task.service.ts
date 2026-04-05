import { mapToAppException } from "../../common/error/error-mapper";
import { logger } from "../../common/lib/logger/pino";
import { InsertTask, SelectTask } from "./dto/task.dto";
import type { TaskRepository } from "./task.repository";

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async createTask(task: InsertTask): Promise<SelectTask> {
    logger.trace("Create task service");

    try {
      const result = await this.repository.create(task);
      logger.debug({ result }, "Task Created");

      return result;
    } catch (error: any) {
      mapToAppException(error);
    }
  }
}
