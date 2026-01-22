import { Hono } from "hono";
import { response } from "./common/http/response";
import { errorHandler } from "./common/http/error-handler";
import { httpLogger } from "./common/lib/logger/http-logger";

export function createApp() {
  const app = new Hono().basePath("/api");

  app.use(httpLogger);
  app.onError(errorHandler);

  app.get("/", (c) => {
    return response.success(c, { message: "Hello Hono!" });
  });

  return app;
}
