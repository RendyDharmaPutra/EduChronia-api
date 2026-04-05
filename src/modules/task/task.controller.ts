import { Context } from "hono";
import type { TaskService } from "./task.service";
import { response } from "../../common/http/response";
import { logger } from "../../common/lib/logger/pino";
import { safeParseBody } from "../../common/http/validation/safe-parse-body";
import { createTaskDto } from "./dto/task.dto";

export class TaskController {
  constructor(private readonly service: TaskService) {}

  create = async (c: Context): Promise<Response> => {
    logger.trace("Create task controller");

    const userId = c.get("userId");
    const body = await safeParseBody(c, createTaskDto, "Data task tidak valid");

    const task = { ...body, userId };
    const result = await this.service.createTask(task);

    return response.success(c, result);
  };
}
