import { Hono } from "hono";
import { response } from "./common/http/response";

export function createApp() {
  const app = new Hono().basePath("/api");

  app.get("/", (c) => {
    return response.success(c, { message: "Hello Hono!" });
  });

  return app;
}
