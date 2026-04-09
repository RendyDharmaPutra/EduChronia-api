import { mapToAppException } from "../../common/error/error-mapper";
import { AppException } from "../../common/http/exception/base.exception";
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

  async updateTaskById(id: number, task: InsertTask): Promise<SelectTask> {
    logger.trace("Update task service");

    try {
      const result = await this.repository.updateById(id, task);
      logger.debug({ result }, "Task Updated");

      if (!result)
        throw new AppException(`Task tidak ditemukan`, "TASK_NOT_FOUND", 404);

      return result;
    } catch (error: any) {
      mapToAppException(error);
    }
  }
}
