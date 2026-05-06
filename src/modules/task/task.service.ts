import { mapToAppException } from "../../common/error/error-mapper";
import { AppException } from "../../common/http/exception/base.exception";
import { logger } from "../../common/lib/logger/pino";
import { InsertTask, SelectTask, UpdateTaskDto } from "./dto/task.dto";
import type { TaskRepository } from "./task.repository";

/**
 * Service handling business logic for tasks.
 */
export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  /**
   * Creates a new task and saves it to the database.
   *
   * @param {InsertTask} task - The task data to create.
   * @returns {Promise<SelectTask | void>} A promise that resolves to the created task.
   */
  async createTask(task: InsertTask): Promise<SelectTask | void> {
    logger.trace("Create task service");

    try {
      const result = await this.repository.create(task);
      logger.debug({ result }, "Task Created");

      return result;
    } catch (error: any) {
      mapToAppException(error);
    }
  }

  /**
   * Updates an existing task by its ID.
   *
   * @param {number} id - The unique identifier of the task to update.
   * @param {UpdateTaskDto} task - The updated task data.
   * @returns {Promise<SelectTask | void>} A promise that resolves to the updated task.
   * @throws {AppException} If the task is not found (404).
   */
  async updateTaskById(
    id: number,
    task: UpdateTaskDto,
  ): Promise<SelectTask | void> {
    logger.trace("Update task service");

    try {
      const result = await this.repository.updateById(id, task);
      logger.debug({ result }, "Task Updated");

      if (!result)
        throw new AppException(`Tugas tidak ditemukan`, "TASK_NOT_FOUND", 404);

      return result;
    } catch (error: any) {
      mapToAppException(error);
    }
  }

  /**
   * Deletes a task by its ID.
   *
   * @param {number} id - The unique identifier of the task to delete.
   * @returns {Promise<number | void>} A promise that resolves to the number of deleted rows.
   * @throws {AppException} If the task is not found (404).
   */
  async deleteTaskById(id: number): Promise<number | void> {
    logger.trace("Delete task service");

    try {
      const affected = await this.repository.deleteById(id);
      logger.debug({ affected }, "Task deleted");

      if (!affected)
        throw new AppException(`Tugas tidak ditemukan`, "TASK_NOT_FOUND", 404);

      return affected;
    } catch (error: any) {
      mapToAppException(error);
    }
  }

  /**
   * Updates the completion status of a task.
   *
   * @param {number} id - The unique identifier of the task.
   * @param {boolean} status - The new completion status (true for complete, false for incomplete).
   * @returns {Promise<SelectTask | void>} A promise that resolves to the updated task.
   * @throws {AppException} If the task is not found (404).
   */
  async toggleCompletionById(
    id: number,
    status: boolean,
  ): Promise<SelectTask | void> {
    logger.trace("Toggle completion task service");

    try {
      const result = await this.repository.updateById(id, {
        isCompleted: status,
      });
      logger.debug({ result }, "Toggle task completion");

      if (!result)
        throw new AppException(`Tugas tidak ditemukan`, "TASK_NOT_FOUND", 404);

      return result;
    } catch (error: any) {
      mapToAppException(error);
    }
  }
}
