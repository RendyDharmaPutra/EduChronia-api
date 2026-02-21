import { Hono } from "hono";
import { requireAuth } from "../../common/http/middleware/require-auth.middleware";
import type { CourseController } from "./course.controller";

export function courseRoutes(controller: CourseController) {
  // route instance
  const router = new Hono();

  // implement auth middleware
  router.use(requireAuth);

  // implement routes
  router.get("/", controller.list);
  router.post("/", controller.create);
  router.get("/:id", controller.get);
  router.delete("/:id", controller.delete);

  return router;
}
