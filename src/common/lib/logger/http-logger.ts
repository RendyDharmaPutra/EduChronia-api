import { MiddlewareHandler } from "hono";
import { logger } from "./pino";

export const httpLogger: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;

  logger.info(`[HTTP]: ${c.req.method} ${c.req.path} ${c.res.status} ${ms}ms`);
};
