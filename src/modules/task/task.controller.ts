import { Context } from "hono";
import type { TaskService } from "./task.service";
import { response } from "../../common/http/response";
import { logger } from "../../common/lib/logger/pino";
import { safeParseBody } from "../../common/http/validation/safe-parse-body";
import { createTaskDto } from "./dto/task.dto";
import { safeParseParams } from "../../common/http/validation/safe-parse-params";
import { idParamSchema } from "../../common/http/validation/schemas/id.param";

/**
 * Controller handling HTTP requests related to tasks.
 */
export class TaskController {
  constructor(private readonly service: TaskService) {}

  /**
   * Handles the creation of a new task.
   *
   * @param {Context} c - The Hono request context.
   * @returns {Promise<Response>} The HTTP response containing the created task.
   */
  create = async (c: Context): Promise<Response> => {
    logger.trace("Create task controller");

    const userId = c.get("userId");
    const body = await safeParseBody(
      c,
      createTaskDto,
      "Data tugas tidak valid",
    );

    const task = { ...body, userId };
    const result = await this.service.createTask(task);

    return response.success(c, result);
  };

  /**
   * Handles updating an existing task by its ID.
   *
   * @param {Context} c - The Hono request context.
   * @returns {Promise<Response>} The HTTP response containing the updated task.
   */
  update = async (c: Context): Promise<Response> => {
    logger.trace("Update task controller");

    const userId = c.get("userId");
    const { id } = safeParseParams(c, idParamSchema, "ID tidak valid");
    const body = await safeParseBody(
      c,
      createTaskDto,
      "Data tugas tidak valid",
    );

    const task = { ...body, userId };
    const result = await this.service.updateTaskById(id, task);

    return response.success(c, result);
  };

  /**
   * Handles the deletion of a task by its ID.
   *
   * @param {Context} c - The Hono request context.
   * @returns {Promise<Response>} The HTTP response indicating success.
   */
  delete = async (c: Context): Promise<Response> => {
    logger.trace("Delete task controller");

    const { id } = safeParseParams(c, idParamSchema, "ID tidak valid");

    await this.service.deleteTaskById(id);

    return response.success(c);
  };

  /**
   * Marks a specific task as completed.
   *
   * @param {Context} c - The Hono request context.
   * @returns {Promise<Response>} The HTTP response containing the updated task.
   */
  setComplete = async (c: Context): Promise<Response> => {
    logger.trace("Set complete task controller");

    const { id } = safeParseParams(c, idParamSchema, "ID tidak valid");

    const result = await this.service.toggleCompletionById(id, true);

    return response.success(c, result);
  };

  /**
   * Marks a specific task as uncompleted.
   *
   * @param {Context} c - The Hono request context.
   * @returns {Promise<Response>} The HTTP response containing the updated task.
   */
  setUnComplete = async (c: Context): Promise<Response> => {
    logger.trace("Set uncomplete task controller");

    const { id } = safeParseParams(c, idParamSchema, "ID tidak valid");

    const result = await this.service.toggleCompletionById(id, false);

    return response.success(c, result);
  };
}
