import { MiddlewareHandler } from "hono";
import { logger } from "./pino";

/**
 * Middleware for logging HTTP requests.
 *
 * This middleware logs information about each HTTP request, including the
 * request method, path, response status, and response time.
 *
 * @param {Context} c - The current request context.
 * @param {Next} next - The next middleware function in the chain.
 */
export const httpLogger: MiddlewareHandler = async (c, next) => {
  const reqId = c.get("requestId");

  // Get the start time of the request
  const startTime = Date.now();
  // Call the next middleware function
  await next();
  // Calculate the response time
  const duration = Date.now() - startTime;

  logger.info(
    {
      reqId,
      localTime: new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      }),
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration,
    },
    "HTTP Request",
  );
};
