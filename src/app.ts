import { Hono } from "hono";
import { response } from "./common/http/response";
import { errorHandler } from "./common/http/error-handler";
import { httpLogger } from "./common/lib/logger/http-logger";
import { auth } from "./common/lib/auth";
import { cors } from "hono/cors";
import { env } from "./common/config/env";

/**
 * Create an instance of Hono application
 *
 * @return {Hono} Hono application instance
 */
export function createApp() {
  const app = new Hono().basePath("/api");

  // CORS configuration
  app.use(
    "*",
    cors({
      origin: [env.HOST_WEB_BASE_URL],
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
  );

  // Apply httpLogger middleware for logging HTTP requests
  app.use(httpLogger);

  // Apply errorHandler middleware for handling errors
  app.onError(errorHandler);

  app.get("/", (c) => {
    return response.success(c, { message: "Hello Hono!" });
  });

  app.on(["POST", "GET"], "/auth/*", (c) => {
    console.log("AUTH HIT:", c.req.path);
    return auth.handler(c.req.raw);
  });

  // Protected route example
  app.get("/user", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ user: session.user });
  });

  return app;
}
