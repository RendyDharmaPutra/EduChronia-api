import { Hono } from "hono";
import { response } from "./common/http/response";
import { errorHandler } from "./common/http/error-handler";
import { httpLogger } from "./common/lib/logger/http-logger";

/**
 * Create an instance of Hono application
 *
 * @return {Hono} Hono application instance
 */
export function createApp() {
  const app = new Hono().basePath("/api");

  // Apply httpLogger middleware for logging HTTP requests
  app.use(httpLogger);

  // Apply errorHandler middleware for handling errors
  app.onError(errorHandler);

  app.get("/", (c) => {
    return response.success(c, { message: "Hello Hono!" });
  });

  return app;
}
