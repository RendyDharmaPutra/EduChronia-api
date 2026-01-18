import { Hono } from "hono";
import { response } from "./common/http/response";
import { AppException } from "./common/http/exception/base.exception";
import { errorHandler } from "./common/http/error-handler";

export function createApp() {
  const app = new Hono().basePath("/api");

  app.onError(errorHandler);

  app.get("/", (c) => {
    return response.success(c, { message: "Hello Hono!" });
  });

  return app;
}
