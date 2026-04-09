import { Hono } from "hono";
import type { TaskController } from "./task.controller";
import { requireAuth } from "../../common/http/middleware/require-auth.middleware";

export function taskRoutes(controller: TaskController) {
  const router = new Hono();

  router.use(requireAuth);

  router.post("/", controller.create);
  router.put("/:id", controller.update);

  return router;
}
