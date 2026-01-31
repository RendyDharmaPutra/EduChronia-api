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
  const start = Date.now();
  // Call the next middleware function
  await next();
  // Calculate the response time
  const ms = Date.now() - start;

  logger.info(
    `[rid=${reqId}] ${c.req.method} ${c.req.path} ${c.res.status} ${ms}ms`,
  );
};
