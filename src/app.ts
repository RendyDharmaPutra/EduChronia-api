import { Hono } from "hono";

export function createApp() {
  const app = new Hono().basePath("/api");

  app.get("/", (c) => {
    return c.json({ message: "Hello Hono!" });
  });

  return app;
}
